#!/usr/bin/env node
// Relatório de breaking changes — criado no Épico 22 (v1.2.0 → v2.0.0) e
// rebaseado no Épico 37 para a MAIOR v3.0.0 (DESIGN.md v4.0/v4.1, rodada 5
// da marca). A regra continua a mesma: "só muda exatamente o que está na
// allowlist abaixo, derivada do changelog['3.0.0'] de design/tokens.json".
//
// Compara design/archive/tokens-v2.7.0.json (última MENOR da série 2.x,
// baseline pré-Épico-37) contra design/tokens.json atual. Qualquer
// `changed`/`removed` fora da allowlist falha o build — foi esse mecanismo
// que pegou, no Épico 22, uma regressão de contraste não declarada.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { diffTokens } from './lib/check-tokens-additive.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const OLD_PATH = path.join(rootDir, 'design/archive/tokens-v2.7.0.json');
const NEW_PATH = path.join(rootDir, 'design/tokens.json');

function loadJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

// Paths cujo VALOR pode mudar. A v3.0.0 declara "Nenhum $value existente
// mudou" — a lista fica vazia de propósito.
const ALLOWED_CHANGED_PATTERNS = [];

// Paths que podem ser removidos — todos $deprecated em MENOR anterior.
const ALLOWED_REMOVED_PATTERNS = [
  /^shadow\./, // 2.2.0 (S2): a marca não usa sombra
  /^pattern\.nodeBranch\./, // 2.5.0 (H9): substituído por pattern.mesh
  /^pattern\.dataGrid\./, // 2.2.0 (P4): é pattern.reticula.fine
  /^pattern\.reticula\.coarse\./, // 2.3.0 (I9)
];

const oldTokens = loadJson(OLD_PATH);
const newTokens = loadJson(NEW_PATH);
const { changed, removed, added } = diffTokens(oldTokens, newTokens);

const unexpectedChanged = changed.filter(
  (c) => !ALLOWED_CHANGED_PATTERNS.some((pattern) => pattern.test(c.path)),
);
const unexpectedRemoved = removed.filter(
  (r) => !ALLOWED_REMOVED_PATTERNS.some((pattern) => pattern.test(r)),
);

// Guarda extra (Épico 22): nenhuma cor Forest/Grove/neutro/semântica de feedback pode aparecer no
// diff — nem como `changed`, nem como `removed`. Verificado sobre a lista
// JÁ FILTRADA pela allowlist (então um achado aqui é sempre um bug real:
// algo que passou pela allowlist mas não deveria existir nela).
const BRAND_GUARD_PATTERN = /^color\.(forest|grove)\./;
const NEUTRAL_GUARD_PATTERN = /^color\.neutral\./;
const SEMANTIC_FEEDBACK_GUARD_PATTERN = /^color\.semantic\.(success|error|warning|info)$/;

function violatesGuard(pathStr) {
  return (
    BRAND_GUARD_PATTERN.test(pathStr) ||
    NEUTRAL_GUARD_PATTERN.test(pathStr) ||
    SEMANTIC_FEEDBACK_GUARD_PATTERN.test(pathStr)
  );
}

const guardViolations = [
  ...changed.filter((c) => violatesGuard(c.path)).map((c) => c.path),
  ...removed.filter(violatesGuard),
];

let hasError = false;

if (guardViolations.length > 0) {
  hasError = true;
  console.error(
    `\n✗ ${guardViolations.length} token(s) de Forest/Grove/neutro/semântico-de-feedback no diff — pare, algo está errado (Épico 22/37, critério de aceite):`,
  );
  for (const p of guardViolations) console.error(`  ${p}`);
}

if (unexpectedChanged.length > 0) {
  hasError = true;
  console.error(`\n✗ ${unexpectedChanged.length} token(s) alterado(s) fora da allowlist:`);
  for (const c of unexpectedChanged) {
    console.error(`  ${c.path}: ${c.old} → ${c.new}`);
  }
}

if (unexpectedRemoved.length > 0) {
  hasError = true;
  console.error(`\n✗ ${unexpectedRemoved.length} token(s) removido(s) fora da allowlist:`);
  for (const r of unexpectedRemoved) console.error(`  ${r}`);
}

if (hasError) {
  console.error(
    '\ndesign/tokens.json diverge do changelog declarado ($extensions["br.com.syntaxis"].changelog["3.0.0"]) — corrija a allowlist deste script (se a mudança for legítima e precisa ser documentada) ou reverta o token (se for uma regressão não intencional).',
  );
  process.exitCode = 1;
} else {
  console.log('✓ check-tokens-breaking: diff v2.7.0 → v3.x coincide exatamente com o changelog.');
  console.log(
    `  ${changed.length} token(s) alterado(s), ${removed.length} removido(s), ${added.length} novo(s) — todos dentro do declarado.`,
  );
}
