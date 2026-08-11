#!/usr/bin/env node
// Verificação de paleta (Épico 16, testes obrigatórios): amostra os
// pixels de todo asset publicado em public/img/ (via manifest) e confere
// aderência à paleta da marca — tolerância documentada em
// scripts/lib/palette.mjs. Roda em CI/prebuild.
//
// Todo asset deste pipeline passa por correção de duotone
// (scripts/lib/duotone.mjs) antes de publicar — o resultado esperado é
// um GRADIENTE entre duas cores exatas dos tokens, não pixels
// concentrados perto de pontos discretos da paleta. Por isso a
// verificação usa distância ao SEGMENTO dark↔light registrado no
// manifest (sampleSegmentAdherence), não a distância à cor mais próxima
// entre um conjunto de pontos (sampleAdherence, que reprovaria um
// duotone correto — ver __tests__/palette.test.ts e
// __tests__/process-asset.test.ts para o caso que motivou essa escolha).
// Um asset publicado sem `duotone` no manifest (processado por outro
// método, se algum dia existir) cai no fallback de paleta geral.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';
import tokens from '../design/tokens.json' with { type: 'json' };
import { passesAdherence, sampleAdherence, sampleSegmentAdherence } from './lib/palette.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

function brandPaletteHexes() {
  const hexes = [];
  for (const scale of ['forest', 'grove', 'amber']) {
    for (const [key, def] of Object.entries(tokens.color[scale])) {
      if (key.startsWith('$')) continue;
      hexes.push(def.$value);
    }
  }
  for (const [key, def] of Object.entries(tokens.color.neutral)) {
    if (key.startsWith('$')) continue;
    hexes.push(def.$value);
  }
  return hexes;
}

/** Amostra até N pixels espaçados uniformemente pelo buffer raw (rápido o bastante para CI, representativo o bastante para detectar cor fora da paleta). */
async function samplePixels(filePath, maxSamples = 2000) {
  const { data, info } = await sharp(filePath)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const totalPixels = info.width * info.height;
  const step = Math.max(1, Math.floor(totalPixels / maxSamples));
  const pixels = [];
  for (let i = 0; i < totalPixels; i += step) {
    const offset = i * info.channels;
    pixels.push({ r: data[offset], g: data[offset + 1], b: data[offset + 2] });
  }
  return pixels;
}

const manifestPath = path.join(rootDir, 'assets/manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
const palette = brandPaletteHexes();

const failures = [];
for (const asset of manifest.assets) {
  for (const file of asset.publishedFiles ?? []) {
    const fullPath = path.join(rootDir, file.path);
    const pixels = await samplePixels(fullPath);
    const adherence = asset.duotone
      ? sampleSegmentAdherence(pixels, asset.duotone.dark, asset.duotone.light)
      : sampleAdherence(pixels, palette);
    if (!passesAdherence(adherence)) {
      failures.push(
        `${file.path}: ${(adherence.matchRatio * 100).toFixed(1)}% dos pixels amostrados dentro da paleta (mínimo 90%)`,
      );
    }
  }
}

if (failures.length > 0) {
  console.error('✗ verify-asset-palette: assets fora da paleta da marca:\n');
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(
  manifest.assets.length === 0
    ? '✓ verify-asset-palette: manifest vazio (nenhum asset gerado ainda) — nada a verificar.'
    : '✓ verify-asset-palette: todos os assets publicados dentro da tolerância de paleta.',
);
