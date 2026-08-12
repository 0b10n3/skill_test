#!/usr/bin/env node
// Prova de aditividade — Épico 20 (DESIGN.md v1.1 §4.3-4.6, tokens.json
// v1.2.0). A v1.2.0 só pode ACRESCENTAR tokens; nenhum valor pré-existente
// da v1.1.0 pode mudar. Compara o snapshot congelado
// design/archive/tokens-v1.1.0.json (a v1.1.0 real deste repositório, com
// os tokens de contraste AA dos Épicos 14/15/18) contra design/tokens.json
// atual — lógica pura em scripts/lib/check-tokens-additive.mjs.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { diffTokens } from './lib/check-tokens-additive.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const OLD_PATH = path.join(rootDir, 'design/archive/tokens-v1.1.0.json');
const NEW_PATH = path.join(rootDir, 'design/tokens.json');

function loadJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

const oldTokens = loadJson(OLD_PATH);
const newTokens = loadJson(NEW_PATH);
const { changed, removed, added, ok } = diffTokens(oldTokens, newTokens);

if (changed.length > 0) {
  console.error(`\n✗ ${changed.length} token(s) pré-existente(s) com valor alterado:`);
  for (const c of changed) {
    console.error(`  ${c.path}: ${c.old} → ${c.new}`);
  }
}

if (removed.length > 0) {
  console.error(`\n✗ ${removed.length} token(s) pré-existente(s) removido(s):`);
  for (const r of removed) {
    console.error(`  ${r}`);
  }
}

if (ok) {
  console.log(`✓ check-tokens-additive: tokens pré-existentes preservados sem alteração.`);
  console.log(`✓ ${added.length} token(s) novo(s) na v1.2.0 (aditivo):`);
  for (const a of added.sort()) {
    console.log(`  + ${a}`);
  }
} else {
  console.error(
    '\nA v1.2.0 de design/tokens.json não é puramente aditiva sobre design/archive/tokens-v1.1.0.json — corrija antes de prosseguir (DESIGN.md v1.1: paleta e tokens existentes não mudam).',
  );
  process.exitCode = 1;
}
