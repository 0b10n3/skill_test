#!/usr/bin/env node
// Sincronia com a SSOT de marca (revisão de 02/09/2026, item 11 parcial).
//
// `brand/DESIGN.md` e `brand/tokens/syntaxis.tokens.json` são a fonte da
// verdade de todo o ecossistema Syntaxis; este repositório mantém uma CÓPIA de
// cada um (`DESIGN.md`, `design/tokens.json`) porque o build da Vercel não
// enxerga `brand/` — ele só recebe o conteúdo deste repo.
//
// Duas cópias sem gate divergem. Foi assim que, em 02/09/2026, uma decisão de
// marca tomada no pipeline `hemingway` (revogar o anti-padrão de iconografia
// financeira para ilustração editorial) ficou dois dias sem registro na fonte:
// quem decidiu não conseguia commitar em `brand/`, e nada avisava.
//
// Este gate compara byte a byte quando `brand/` está no disco, e SAI VERDE com
// aviso quando não está (Vercel, CI, clone isolado do app). Ele protege o
// desenvolvimento local, que é onde a divergência nasce.
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const brandDir = path.resolve(rootDir, '../../brand');

// [cópia local, original em brand/]
const PAIRS = [
  ['DESIGN.md', 'DESIGN.md'],
  ['design/tokens.json', 'tokens/syntaxis.tokens.json'],
];

if (!existsSync(brandDir)) {
  console.log(
    '• check-brand-sync: brand/ não está presente (build isolado do app) — verificação pulada.',
  );
  process.exit(0);
}

const digest = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');
let diverged = 0;

for (const [local, upstream] of PAIRS) {
  const localPath = path.join(rootDir, local);
  const upstreamPath = path.join(brandDir, upstream);

  if (!existsSync(upstreamPath)) {
    console.error(`✗ ${local}: o original brand/${upstream} não existe.`);
    diverged += 1;
    continue;
  }
  if (digest(localPath) !== digest(upstreamPath)) {
    console.error(`✗ ${local} diverge de brand/${upstream}.`);
    diverged += 1;
  }
}

if (diverged > 0) {
  console.error(
    `\n✗ check-brand-sync: ${diverged} arquivo(s) fora de sincronia com a SSOT em brand/.`,
  );
  console.error(
    'A fonte é brand/. Edite lá, copie para cá, e leve as duas versões no mesmo PR —\nnunca edite só a cópia deste repositório.',
  );
  process.exitCode = 1;
} else {
  console.log('✓ check-brand-sync: DESIGN.md e tokens.json idênticos aos de brand/.');
}
