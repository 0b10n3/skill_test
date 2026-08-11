/**
 * Núcleo testável do processamento de asset (Épico 16): dado um caminho
 * de imagem raw + parâmetros de correção/publicação, aplica duotone,
 * gera as variantes de largura/formato e escreve em disco. Separado de
 * scripts/process-asset.mjs (parsing de CLI args + atualização do
 * manifest) para ser exercitável em teste com uma imagem de referência.
 */
import { mkdirSync, statSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { applyDuotone } from './duotone.mjs';
import { planAssetOutputs } from './asset-plan.mjs';

/**
 * @param {object} params
 * @param {string} params.rawPath - caminho absoluto da imagem raw aprovada
 * @param {string} params.outDir - diretório absoluto onde escrever (normalmente public/img/<slug>)
 * @param {string} params.slug
 * @param {string|undefined} params.variant
 * @param {string} params.dark - hex exato do token usado como ponto escuro do duotone
 * @param {string} params.light - hex exato do token usado como ponto claro do duotone
 * @param {number[]} params.widths
 * @param {string[]} params.formats - subconjunto de ['avif', 'webp']
 * @returns {Promise<Array<{path: string, width: number, format: string, sizeBytes: number}>>}
 */
export async function processAssetToFiles({
  rawPath,
  outDir,
  slug,
  variant,
  dark,
  light,
  widths,
  formats,
}) {
  const image = sharp(rawPath).removeAlpha();
  const { width, height } = await image.metadata();
  const { data: rawBuffer } = await image.raw().toBuffer({ resolveWithObject: true });

  const corrected = applyDuotone(rawBuffer, dark, light);
  const correctedImage = sharp(corrected, { raw: { width, height, channels: 3 } });

  const outputs = planAssetOutputs({ slug, variant, widths, formats });
  const results = [];

  for (const output of outputs) {
    const fileName = path.basename(output.path);
    const outPath = path.join(outDir, fileName);
    mkdirSync(outDir, { recursive: true });

    const pipeline = correctedImage.clone().resize(output.width);
    if (output.format === 'avif') await pipeline.avif({ quality: 60 }).toFile(outPath);
    else if (output.format === 'webp') await pipeline.webp({ quality: 75 }).toFile(outPath);
    else throw new Error(`Formato não suportado: ${output.format}`);

    results.push({
      path: output.path,
      width: output.width,
      format: output.format,
      sizeBytes: statSync(outPath).size,
    });
  }

  return results;
}
