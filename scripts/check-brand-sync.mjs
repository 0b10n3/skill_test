#!/usr/bin/env node
// Épico 33 — gate de sincronização com o SSOT de marca (monorepo Syntaxis).
//
// apps/skill_test é um repositório git separado do monorepo que abriga
// brand/ — DESIGN.md e design/tokens.json aqui são cópia byte a byte,
// mantida à mão (ver o cabeçalho de cada arquivo). Nada aqui detecta uma
// mudança em brand/; só confirma que a cópia já feita não divergiu.
//
// Contrato, documentado desde o Épico 24 (specs/epicos/epico-24-sincronizacao-marca-v3.md):
// o build de produção (Vercel) clona só este repositório — brand/ não existe
// nesse disco. Por isso o script SAI VERDE quando não encontra brand/ ao
// lado do monorepo: reprovar o build de produção por um arquivo que ele
// nunca poderia ter seria um falso positivo, não um gate. Em dev local,
// onde os dois repositórios normalmente convivem como irmãos dentro de
// Syntaxis/, a comparação real acontece.
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const monorepoBrandDir = path.resolve(rootDir, '../../brand');

const PAIRS = [
  { local: path.join(rootDir, 'DESIGN.md'), canonical: path.join(monorepoBrandDir, 'DESIGN.md') },
  {
    local: path.join(rootDir, 'design/tokens.json'),
    canonical: path.join(monorepoBrandDir, 'tokens/syntaxis.tokens.json'),
  },
];

if (!existsSync(monorepoBrandDir)) {
  console.log(
    `✓ check-brand-sync: brand/ não está em disco (${monorepoBrandDir}) — ambiente sem o monorepo ao lado (build de produção). Verificação pulada, não é uma falha.`,
  );
  process.exit(0);
}

function firstDiffLine(a, b) {
  const linesA = a.split('\n');
  const linesB = b.split('\n');
  const max = Math.max(linesA.length, linesB.length);
  for (let i = 0; i < max; i++) {
    if (linesA[i] !== linesB[i]) return i + 1;
  }
  return null;
}

let hasError = false;

for (const { local, canonical } of PAIRS) {
  if (!existsSync(canonical)) {
    hasError = true;
    console.error(`✗ ${canonical} não existe — não dá para comparar.`);
    continue;
  }
  const localContent = readFileSync(local, 'utf-8');
  const canonicalContent = readFileSync(canonical, 'utf-8');
  if (localContent !== canonicalContent) {
    hasError = true;
    const line = firstDiffLine(localContent, canonicalContent);
    console.error(
      `✗ ${path.relative(rootDir, local)} diverge de ${path.relative(monorepoBrandDir, canonical)} (brand/) — primeira diferença na linha ${line}.`,
    );
  } else {
    console.log(`✓ ${path.relative(rootDir, local)} idêntico a brand/${path.relative(monorepoBrandDir, canonical)}.`);
  }
}

if (hasError) {
  console.error(
    '\ncheck-brand-sync: cópia local diverge do SSOT em brand/. Copie o arquivo canônico de novo (brand/ → apps/skill_test), rode `npm run format` e confirme byte a byte antes de commitar.',
  );
  process.exitCode = 1;
}
