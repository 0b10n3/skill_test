import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { processAssetToFiles } from '../scripts/lib/process-asset-core.mjs';
import { sampleSegmentAdherence, passesAdherence } from '../scripts/lib/palette.mjs';

/**
 * Entrada de referência: um gradiente sintético 200x200 (não depende de
 * nenhuma geração real do Nano Banana Pro) — suficiente para exercitar
 * duotone → resize → export sem precisar de um asset gerado de verdade.
 */
describe('processAssetToFiles (entrada de referência → variantes, formatos e pesos esperados)', () => {
  let workDir: string;
  let rawPath: string;
  let outDir: string;

  beforeAll(async () => {
    workDir = mkdtempSync(path.join(tmpdir(), 'process-asset-test-'));
    rawPath = path.join(workDir, 'reference-input.png');
    outDir = path.join(workDir, 'out');

    // Gradiente horizontal preto → branco, 200x200 — cobre toda a faixa
    // de luminância que o duotone precisa remapear.
    const width = 200;
    const height = 200;
    const raw = Buffer.alloc(width * height * 3);
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const value = Math.round((x / (width - 1)) * 255);
        const offset = (y * width + x) * 3;
        raw[offset] = value;
        raw[offset + 1] = value;
        raw[offset + 2] = value;
      }
    }
    await sharp(raw, { raw: { width, height, channels: 3 } })
      .png()
      .toFile(rawPath);
  });

  afterAll(() => {
    rmSync(workDir, { recursive: true, force: true });
  });

  it('gera exatamente os arquivos esperados (larguras × formatos configurados)', async () => {
    const results = await processAssetToFiles({
      rawPath,
      outDir,
      slug: 'hero-landing',
      variant: 'light',
      dark: '#1B6A45',
      light: '#F7F7F5',
      widths: [100, 200],
      formats: ['avif', 'webp'],
    });

    expect(results).toHaveLength(4);
    const paths = results.map((r) => r.path).sort();
    expect(paths).toEqual([
      'public/img/hero-landing/light-100.avif',
      'public/img/hero-landing/light-100.webp',
      'public/img/hero-landing/light-200.avif',
      'public/img/hero-landing/light-200.webp',
    ]);

    for (const result of results) {
      expect(existsSync(path.join(outDir, path.basename(result.path)))).toBe(true);
      expect(result.sizeBytes).toBeGreaterThan(0);
      // Orçamento de referência do slug (hero-landing: 120KB) — o
      // gradiente sintético é trivial de comprimir, então deve ficar bem
      // abaixo disso; serve de guarda contra regressão grosseira na
      // configuração de qualidade do encoder.
      expect(result.sizeBytes).toBeLessThan(120 * 1024);
    }
  });

  it('o resultado corrigido por duotone só usa cores dentro da reta entre os dois hexes — passa na verificação de paleta', async () => {
    const results = await processAssetToFiles({
      rawPath,
      outDir,
      slug: 'hero-landing',
      variant: 'palette-check',
      dark: '#1B6A45',
      light: '#F7F7F5',
      widths: [200],
      formats: ['webp'],
    });

    const outputPath = path.join(outDir, path.basename(results[0].path));
    const { data, info } = await sharp(outputPath)
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const pixels = [];
    for (let i = 0; i < info.width * info.height; i += 1) {
      const offset = i * info.channels;
      pixels.push({ r: data[offset], g: data[offset + 1], b: data[offset + 2] });
    }

    const adherence = sampleSegmentAdherence(pixels, '#1B6A45', '#F7F7F5');
    expect(passesAdherence(adherence)).toBe(true);
  });
});
