#!/usr/bin/env node
// Auditoria de contraste (Épico 14): calcula a razão de contraste WCAG dos
// pares texto/fundo da camada semântica (design/tokens.json →
// color.theme.light|dark), nos dois temas, e gera um relatório versionado
// em design/contrast-report.md.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { resolveValue } from './lib/generate-tokens.mjs';
import { AA_LARGE_TEXT_OR_UI, AA_NORMAL_TEXT, contrastRatio } from './lib/contrast.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tokensPath = path.resolve(__dirname, '../design/tokens.json');
const outputPath = path.resolve(__dirname, '../design/contrast-report.md');

const tokens = JSON.parse(readFileSync(tokensPath, 'utf-8'));

/** Pares fundo/texto a auditar — cobrem todo par semântico usado como superfície + texto sobre ela. */
const PAIRS = [
  ['background', 'foreground'],
  ['card', 'cardForeground'],
  ['popover', 'popoverForeground'],
  ['primary', 'primaryForeground'],
  ['secondary', 'secondaryForeground'],
  ['accent', 'accentForeground'],
  ['muted', 'mutedForeground'],
  ['destructive', 'destructiveForeground'],
];

/**
 * Substitutos já documentados para pares conhecidos por reprovar em texto
 * pequeno (REDESIGN.md §2 invariante #7) — usar quando o par é aplicado
 * como TEXTO (não como cor de superfície/traço, onde o par original é
 * intencional e correto).
 */
const KNOWN_SUBSTITUTES = {
  accent:
    'Para texto (não superfície), usar amber-700/900 em vez de accent — ver DESIGN.md nota de contraste.',
};

function auditTheme(themeName) {
  const theme = tokens.color.theme[themeName];
  return PAIRS.map(([bgKey, fgKey]) => {
    const bg = resolveValue(tokens, theme[bgKey].$value);
    const fg = resolveValue(tokens, theme[fgKey].$value);
    const ratio = contrastRatio(bg, fg);
    return {
      pair: `${bgKey}/${fgKey}`,
      bg,
      fg,
      ratio,
      passesNormalText: ratio >= AA_NORMAL_TEXT,
      passesLargeTextOrUi: ratio >= AA_LARGE_TEXT_OR_UI,
      substitute: KNOWN_SUBSTITUTES[bgKey],
    };
  });
}

function renderTable(results) {
  const lines = [
    '| Par | Fundo | Texto | Contraste | AA texto normal (4.5:1) | AA texto grande/UI (3:1) |',
    '| --- | --- | --- | --- | --- | --- |',
  ];
  for (const r of results) {
    lines.push(
      `| \`${r.pair}\` | \`${r.bg}\` | \`${r.fg}\` | ${r.ratio.toFixed(2)}:1 | ${r.passesNormalText ? '✅' : '❌'} | ${r.passesLargeTextOrUi ? '✅' : '❌'} |`,
    );
  }
  return lines.join('\n');
}

function renderKnownFailures(results) {
  const failures = results.filter((r) => !r.passesNormalText);
  if (failures.length === 0) return '_Nenhum par abaixo de 4.5:1._';

  return failures
    .map((r) => {
      const note = r.substitute
        ? r.substitute
        : 'Uso pretendido é superfície/traço com texto grande (≥18px) ou elemento de UI, não texto corrido pequeno — ok pelo limiar de 3:1.';
      return `- \`${r.pair}\` (${r.ratio.toFixed(2)}:1): ${note}`;
    })
    .join('\n');
}

const light = auditTheme('light');
const dark = auditTheme('dark');

const report = `# Relatório de contraste — design/tokens.json

> Gerado por \`npm run audit:contrast\` (Épico 14). Não editar à mão —
> regenerar após qualquer mudança em \`design/tokens.json\`.

## Tema light

${renderTable(light)}

### Falhas conhecidas (abaixo de 4.5:1) e substituto/justificativa

${renderKnownFailures(light)}

## Tema dark

${renderTable(dark)}

### Falhas conhecidas (abaixo de 4.5:1) e substituto/justificativa

${renderKnownFailures(dark)}
`;

writeFileSync(outputPath, report, 'utf-8');

// Falha o build só quando um par reprova até o limiar de 3:1 (UI/texto
// grande) SEM substituto documentado — o par accent/accentForeground no
// light falha 3:1 de propósito (paleta primária inalterada, ver
// design/tokens.json $meta.note) e já tem substituto (amber-700/900) para
// o único uso onde isso importaria (texto). Falha real = token sem
// alternativa conhecida, não a existência do par na paleta.
const undocumentedFailures = [...light, ...dark].filter(
  (r) => !r.passesLargeTextOrUi && !r.substitute,
);

console.log(`Relatório de contraste escrito em ${outputPath}`);
if (undocumentedFailures.length > 0) {
  console.error(
    `\n✗ ${undocumentedFailures.length} par(es) abaixo do limiar de 3:1 (texto grande/UI) sem substituto documentado:`,
  );
  for (const r of undocumentedFailures) {
    console.error(`  - ${r.pair}: ${r.ratio.toFixed(2)}:1`);
  }
  process.exitCode = 1;
} else {
  console.log('✓ audit-contrast: nenhuma falha de contraste sem substituto documentado.');
}
