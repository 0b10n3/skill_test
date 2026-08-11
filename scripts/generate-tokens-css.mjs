#!/usr/bin/env node
// Gera app/tokens.generated.css a partir de design/tokens.json (DTCG) — fonte
// única de verdade da identidade Syntaxis. Não editar o arquivo gerado à
// mão; editar design/tokens.json e rodar `npm run generate:tokens`.
//
// Camadas geradas (lógica pura em scripts/lib/generate-tokens.mjs):
// - @theme { ... }         primitivos (cor/spacing/radius/pattern) — estáticos,
//                           geram utilitários Tailwind (ex.: bg-forest-500).
// - :root { ... }          camada semântica do tema light (color.theme.light) +
//                           sombras (fixas, independentes de tema).
// - .dark { ... }          camada semântica do tema dark (color.theme.dark) —
//                           ativada pela classe `dark` (ver app/layout.tsx,
//                           next-themes com attribute="class").
// - .text-{scale} { ... }  classes utilitárias para os tokens compostos de
//                           typography.scale (família + peso + tamanho + altura).
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { generateCss } from './lib/generate-tokens.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tokensPath = path.resolve(__dirname, '../design/tokens.json');
const outputPath = path.resolve(__dirname, '../app/tokens.generated.css');

const tokens = JSON.parse(readFileSync(tokensPath, 'utf-8'));
writeFileSync(outputPath, generateCss(tokens), 'utf-8');
console.log(`tokens.generated.css escrito a partir de design/tokens.json (${outputPath})`);
