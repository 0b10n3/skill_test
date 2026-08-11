#!/usr/bin/env node
// Processamento e publicação de um asset aprovado (Épico 16,
// REDESIGN.md §4 itens 4-5): aplica correção de cor (duotone entre dois
// hexes exatos dos tokens), gera as variantes de largura/formato
// configuradas, escreve em public/img/<slug>/ e atualiza
// assets/manifest.json. Nunca editar publishedFiles à mão — só por aqui.
//
// Uso:
//   node scripts/process-asset.mjs <slug> \
//     --raw assets/generated/raw/<slug>/<data>-vN.png \
//     --dark "#1B6A45" --light "#F7F7F5" \
//     --widths 400,800,1600 [--formats avif,webp] [--variant light]
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { processAssetToFiles } from './lib/process-asset-core.mjs';
import { largestBudgetedFileSize, withinBudget } from './lib/asset-plan.mjs';
import { parsePromptFile } from './lib/prompt-frontmatter.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

function parseArgs(argv) {
  const [slug, ...rest] = argv;
  if (!slug || slug.startsWith('--')) {
    throw new Error(
      'Uso: node scripts/process-asset.mjs <slug> --raw <path> --dark <hex> --light <hex> --widths <n,n,...> [--formats avif,webp] [--variant <name>]',
    );
  }
  const args = { slug, formats: ['avif', 'webp', 'png'] };
  for (let i = 0; i < rest.length; i += 2) {
    const key = rest[i].replace(/^--/, '');
    const value = rest[i + 1];
    if (key === 'widths') args.widths = value.split(',').map(Number);
    else if (key === 'formats') args.formats = value.split(',');
    else args[key] = value;
  }
  if (!args.raw || !args.dark || !args.light || !args.widths) {
    throw new Error('Faltam argumentos obrigatórios: --raw, --dark, --light, --widths.');
  }
  return args;
}

function loadWeightBudget(slug) {
  const promptPath = path.join(rootDir, 'assets/prompts', `${slug}.md`);
  const { frontmatter } = parsePromptFile(readFileSync(promptPath, 'utf-8'));
  return frontmatter.weightBudgetKb;
}

function updateManifest(args, publishedFiles, weightBudgetKb) {
  const manifestPath = path.join(rootDir, 'assets/manifest.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));

  const entry = {
    slug: args.slug,
    variant: args.variant ?? null,
    promptFile: `assets/prompts/${args.slug}.md`,
    rawFile: args.raw,
    // Guardado para a verificação de paleta (scripts/verify-asset-palette.mjs):
    // um asset corrigido por duotone tem seus pixels sobre o SEGMENTO
    // entre dark/light, não perto de uma cor discreta da paleta geral.
    duotone: { dark: args.dark, light: args.light },
    weightBudgetKb,
    publishedFiles,
    usedIn: [],
  };

  const existingIndex = manifest.assets.findIndex(
    (a) => a.slug === args.slug && a.variant === entry.variant,
  );
  if (existingIndex >= 0) manifest.assets[existingIndex] = entry;
  else manifest.assets.push(entry);

  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  const largest = largestBudgetedFileSize(publishedFiles);
  if (!withinBudget(largest, weightBudgetKb)) {
    console.error(
      `✗ ${args.slug}: maior arquivo publicado (${Math.round(largest / 1024)}KB) excede o orçamento (${weightBudgetKb}KB).`,
    );
    process.exitCode = 1;
  } else {
    console.log(
      `✓ ${args.slug}: publicado em public/img/${args.slug}/, dentro do orçamento (${weightBudgetKb}KB).`,
    );
  }
}

const args = parseArgs(process.argv.slice(2));
const weightBudgetKb = loadWeightBudget(args.slug);
const publishedFiles = await processAssetToFiles({
  rawPath: path.resolve(rootDir, args.raw),
  outDir: path.join(rootDir, 'public/img', args.slug),
  slug: args.slug,
  variant: args.variant,
  dark: args.dark,
  light: args.light,
  widths: args.widths,
  formats: args.formats,
});
updateManifest(args, publishedFiles, weightBudgetKb);
