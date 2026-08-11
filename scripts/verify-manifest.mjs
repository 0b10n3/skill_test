#!/usr/bin/env node
// Verificação de integridade do manifest (Épico 16, testes obrigatórios):
// todo asset publicado em public/img/ tem origem (prompt + raw aprovado)
// e orçamento no manifest; nenhum arquivo em public/img/ fica órfão
// (fora do manifest). Roda em CI/prebuild.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { BUDGET_EXEMPT_FORMATS, withinBudget } from './lib/asset-plan.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const manifestPath = path.join(rootDir, 'assets/manifest.json');
const publicImgDir = path.join(rootDir, 'public/img');

function listPublicImgFiles() {
  if (!existsSync(publicImgDir)) return [];
  const files = [];
  function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(fullPath);
      else if (entry.name !== '.gitkeep') files.push(path.relative(rootDir, fullPath));
    }
  }
  walk(publicImgDir);
  return files;
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
const errors = [];

const referencedPaths = new Set();
for (const asset of manifest.assets) {
  if (!existsSync(path.join(rootDir, asset.promptFile))) {
    errors.push(`${asset.slug}: promptFile ausente (${asset.promptFile})`);
  }
  if (!existsSync(path.join(rootDir, asset.rawFile))) {
    errors.push(`${asset.slug}: rawFile ausente (${asset.rawFile})`);
  }
  if (typeof asset.weightBudgetKb !== 'number') {
    errors.push(`${asset.slug}: weightBudgetKb ausente no manifest`);
  }
  for (const file of asset.publishedFiles ?? []) {
    referencedPaths.add(file.path);
    const fullPath = path.join(rootDir, file.path);
    if (!existsSync(fullPath)) {
      errors.push(`${asset.slug}: publishedFiles referencia arquivo inexistente (${file.path})`);
      continue;
    }
    const actualSize = statSync(fullPath).size;
    // PNG é fallback legado, isento do orçamento — ver
    // scripts/lib/asset-plan.mjs (BUDGET_EXEMPT_FORMATS).
    if (
      !BUDGET_EXEMPT_FORMATS.includes(file.format) &&
      !withinBudget(actualSize, asset.weightBudgetKb)
    ) {
      errors.push(
        `${asset.slug}: ${file.path} (${Math.round(actualSize / 1024)}KB) excede o orçamento (${asset.weightBudgetKb}KB)`,
      );
    }
  }
}

for (const file of listPublicImgFiles()) {
  if (!referencedPaths.has(file)) {
    errors.push(
      `órfão: ${file} existe em public/img/ mas não está em nenhum publishedFiles do manifest`,
    );
  }
}

if (errors.length > 0) {
  console.error('✗ verify-manifest: falhas encontradas:\n');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(
  manifest.assets.length === 0
    ? '✓ verify-manifest: manifest vazio (nenhum asset gerado ainda) — nenhuma inconsistência possível.'
    : `✓ verify-manifest: ${manifest.assets.length} asset(s), todos com origem/orçamento válidos, nenhum órfão em public/img/.`,
);
