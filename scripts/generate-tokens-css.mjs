#!/usr/bin/env node
// Gera app/tokens.generated.css a partir de content/tokens.json — fonte única
// de verdade da paleta "O Sinal no Escuro". Não editar o arquivo gerado à mão;
// editar content/tokens.json e rodar `npm run generate:tokens`.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tokensPath = path.resolve(__dirname, '../content/tokens.json');
const outputPath = path.resolve(__dirname, '../app/tokens.generated.css');

const tokens = JSON.parse(readFileSync(tokensPath, 'utf-8'));

const lines = [];
lines.push('/* ARQUIVO GERADO — não editar à mão.');
lines.push(' * Fonte: content/tokens.json — rodar `npm run generate:tokens` para regenerar. */');
lines.push('@theme {');

for (const [name, def] of Object.entries(tokens.neutrals)) {
  lines.push(`  --color-${name.replace(/_/g, '-')}: ${def.oklch};`);
}

for (const [name, def] of Object.entries(tokens.volt)) {
  lines.push(`  --color-volt-${name}: ${def.oklch};`);
}

for (const [name, def] of Object.entries(tokens.text)) {
  lines.push(`  --color-text-${name.replace(/_/g, '-')}: ${def.oklch};`);
}

for (const [name, def] of Object.entries(tokens.functional)) {
  lines.push(`  --color-${name.replace(/_/g, '-')}: ${def.oklch};`);
}

tokens.dataviz.categorical.forEach((hex, i) => {
  lines.push(`  --color-dataviz-${i + 1}: ${hex};`);
});
tokens.dataviz.sequential_green.forEach((hex, i) => {
  lines.push(`  --color-dataviz-seq-${i + 1}: ${hex};`);
});
const [pnlNeg, pnlNeutral, pnlPos] = tokens.dataviz.diverging_pnl;
lines.push(`  --color-dataviz-pnl-negative: ${pnlNeg};`);
lines.push(`  --color-dataviz-pnl-neutral: ${pnlNeutral};`);
lines.push(`  --color-dataviz-pnl-positive: ${pnlPos};`);
lines.push(`  --color-dataviz-grid-line: ${tokens.dataviz.grid_line};`);
lines.push(`  --color-dataviz-axis-text: ${tokens.dataviz.axis_text};`);

// Famílias tipográficas (Space Grotesk/Inter/JetBrains Mono) não entram aqui:
// são carregadas via next/font em app/layout.tsx e mapeadas em app/globals.css
// (@theme inline), que é a forma correta de expor fontes otimizadas ao Tailwind.

for (const [name, value] of Object.entries(tokens.radius)) {
  lines.push(`  --radius-${name}: ${value};`);
}

lines.push(`  --shadow-card: ${tokens.elevation.card};`);
lines.push(`  --shadow-glow-volt: ${tokens.elevation.glow_volt};`);
lines.push(`  --shadow-focus-ring: ${tokens.elevation.focus_ring};`);

lines.push('}');
lines.push('');

writeFileSync(outputPath, lines.join('\n'), 'utf-8');
console.log(`tokens.generated.css escrito a partir de content/tokens.json (${outputPath})`);
