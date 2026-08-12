#!/usr/bin/env node
// Relatório de breaking changes — Épico 22 (DESIGN.md v2.0, tokens.json
// v2.0.0). Substitui check-tokens-additive.mjs: a v2.0.0 é um bump MAIOR
// declarado (Amber→Lime, cantos retos, tipografia), então "nada muda" não é
// mais a regra — a regra é "só muda exatamente o que está na allowlist
// abaixo, derivada do meta.changelog['2.0.0'] de design/tokens.json".
//
// Compara design/archive/tokens-v1.2.0.json (baseline pré-Épico-22) contra
// design/tokens.json atual. Qualquer `changed`/`removed` fora da allowlist
// falha o build — é exatamente o mecanismo que pegou, nesta mesma sessão, o
// tokens.json v2.0.0 bruto do founder revertendo secondary/primary de
// Grove-700 para Grove-500 (regressão de contraste não declarada, sem
// nenhuma relação com Amber/Lime/radius/fontes) antes de chegar ao repo.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { diffTokens } from './lib/check-tokens-additive.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const OLD_PATH = path.join(rootDir, 'design/archive/tokens-v1.2.0.json');
const NEW_PATH = path.join(rootDir, 'design/tokens.json');

function loadJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

// Paths cujo VALOR pode mudar — cada entrada documenta a que parte do
// changelog ela corresponde. Regex porque radius.sm e os component.* variam
// só de forma previsível (nenhuma surpresa deve passar despercebida).
const ALLOWED_CHANGED_PATTERNS = [
  // (1) Amber → Lime
  /^color\.theme\.(light|dark)\.accent$/,
  /^color\.theme\.(light|dark)\.accentForeground$/,
  // achievementForeground/attentionText não são citados token-a-token no
  // texto do changelog, mas são a mesma migração — pertencem à família
  // accent/conquista que "assume os papéis" do lime (mesma posição
  // relativa na escala: 900/700 no claro, 100/300 no escuro — ver a nota
  // completa em meta.changelog['2.0.0']).
  /^color\.theme\.(light|dark)\.achievementForeground$/,
  /^color\.theme\.(light|dark)\.attentionText$/,
  /^component\.band\.eyebrowColor$/,
  /^component\.highlight\.color$/,
  /^component\.eyebrow\.colorOnDark$/,
  /^pattern\.growthLine\.color$/,
  // (2) cantos retos
  /^radius\.sm$/,
  /^component\.button\.radius$/,
  /^component\.card\.radius$/,
  // (3) tipografia modernizada (família + refinamentos de peso/tracking que
  // acompanham a troca — não são um token isolado, são o mesmo bloco
  // composto typography.scale.*)
  /^typography\.fontFamily\.(display|body)$/,
  /^typography\.scale\.(displayXxl|displayXl|displayLg|heading1|caption)$/,
];

// Paths que podem ser removidos — cada um precisa constar aqui com o motivo.
const ALLOWED_REMOVED_PATTERNS = [
  /^color\.amber\.(100|300|500|700|900)$/,
  /^color\.neutral\.cream$/,
  /^shadow\.amber$/,
  /^component\.highlight\.colorAchievement$/, // lime já É conquista — sem variante separada
  /^radius\.(md|lg|xl|pill)$/,
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

// Guarda extra pedida pelo épico: nenhuma cor Forest/Grove/neutro (exceto
// cream, que É a remoção declarada)/semântica de feedback pode aparecer no
// diff — nem como `changed`, nem como `removed`. Verificado sobre a lista
// JÁ FILTRADA pela allowlist (então um achado aqui é sempre um bug real:
// algo que passou pela allowlist mas não deveria existir nela).
const BRAND_GUARD_PATTERN = /^color\.(forest|grove)\./;
const NEUTRAL_GUARD_PATTERN = /^color\.neutral\.(?!cream$)/;
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
    `\n✗ ${guardViolations.length} token(s) de Forest/Grove/neutro/semântico-de-feedback no diff — pare, algo está errado (Épico 22, critério de aceite):`,
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
    '\ndesign/tokens.json v2.0.0 diverge do changelog declarado (meta.changelog["2.0.0"]) — corrija a allowlist deste script (se a mudança for legítima e precisa ser documentada) ou reverta o token (se for uma regressão não intencional).',
  );
  process.exitCode = 1;
} else {
  console.log('✓ check-tokens-breaking: diff v1.2.0 → v2.0.0 coincide exatamente com o changelog.');
  console.log(
    `  ${changed.length} token(s) alterado(s), ${removed.length} removido(s), ${added.length} novo(s) — todos dentro do declarado.`,
  );
}
