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
    'Para texto (não superfície), usar lime-700/900 em vez de accent — ver DESIGN.md nota de contraste.',
};

/**
 * Pares "regra dura do lime" (Épico 22, DESIGN.md v2.0 §4.1/§4.4/§4.6) —
 * não são aliases de color.theme.*, então não cabem no formato de PAIRS
 * acima (que resolve dois campos do mesmo tema). Hexes literais, checados
 * uma vez (não dependem de tema): lime-500 nunca é texto pequeno sobre
 * claro (Chalk/White); texto sobre superfície lime é sempre Ink; lime-700 é
 * o substituto de texto sobre claro; lime-300 é o "sinal no escuro" sobre
 * banda/Ink.
 */
const LIME_HARD_RULE_PAIRS = [
  {
    label: 'lime-500 (superfície) × Ink (texto) — CTA primário, bloco de highlight',
    bg: '#CDF163',
    fg: '#141414',
  },
  {
    label: 'lime-300 (superfície, hover) × Ink (texto) — hover do CTA primário',
    bg: '#DFF7A1',
    fg: '#141414',
  },
  {
    label: 'White/card claro × lime-700 (texto) — attentionText, texto real sobre superfície clara',
    bg: '#FFFFFF',
    fg: '#5F7D1C',
  },
  {
    label: 'Deep Forest (banda) × lime-300 (texto) — eyebrow/número sobre banda escura',
    bg: '#0F3D27',
    fg: '#DFF7A1',
  },
  {
    label: 'Ink (fundo dark) × lime-300 (texto) — eyebrow sobre Dark Mode',
    bg: '#141414',
    fg: '#DFF7A1',
  },
  {
    label:
      'Chalk × lime-700 (traço, growthLine.colorOnLight) — elemento gráfico, limiar UI 3:1, não texto',
    bg: '#F7F7F5',
    fg: '#5F7D1C',
    threshold: 'ui',
  },
  {
    label:
      'Chalk (fundo claro) × lime-500 (texto pequeno) — NUNCA deve passar (prova da regra dura)',
    bg: '#F7F7F5',
    fg: '#CDF163',
    expectFail: true,
  },
];

function auditLimeHardRules() {
  return LIME_HARD_RULE_PAIRS.map(({ label, bg, fg, expectFail, threshold }) => {
    const ratio = contrastRatio(bg, fg);
    const requiredRatio = threshold === 'ui' ? AA_LARGE_TEXT_OR_UI : AA_NORMAL_TEXT;
    const passes = ratio >= requiredRatio;
    return { label, bg, fg, ratio, passes, requiredRatio, expectFail: Boolean(expectFail) };
  });
}

function renderLimeHardRuleTable(results) {
  const lines = [
    '| Par | Fundo | Texto | Contraste | Limiar exigido | Resultado |',
    '| --- | --- | --- | --- | --- | --- |',
  ];
  for (const r of results) {
    const status = r.expectFail
      ? r.passes
        ? '❌ (deveria falhar!)'
        : '✅ (falha esperada)'
      : r.passes
        ? '✅'
        : '❌';
    lines.push(
      `| ${r.label} | \`${r.bg}\` | \`${r.fg}\` | ${r.ratio.toFixed(2)}:1 | ${r.requiredRatio}:1 | ${status} |`,
    );
  }
  return lines.join('\n');
}

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
const limeHardRules = auditLimeHardRules();

const report = `# Relatório de contraste — design/tokens.json

> Gerado por \`npm run audit:contrast\` (Épico 14, pares do lime no Épico 22).
> Não editar à mão — regenerar após qualquer mudança em \`design/tokens.json\`.

## Tema light

${renderTable(light)}

### Falhas conhecidas (abaixo de 4.5:1) e substituto/justificativa

${renderKnownFailures(light)}

## Tema dark

${renderTable(dark)}

### Falhas conhecidas (abaixo de 4.5:1) e substituto/justificativa

${renderKnownFailures(dark)}

## Regras duras do Lime (Épico 22, DESIGN.md v2.0 §4.1/§4.4/§4.6)

Pares fixos (não dependem de tema) que provam a regra "lime-500 nunca é
texto pequeno sobre fundo claro; texto sobre superfície lime é sempre Ink":

${renderLimeHardRuleTable(limeHardRules)}
`;

writeFileSync(outputPath, report, 'utf-8');

// Falha o build só quando um par reprova até o limiar de 3:1 (UI/texto
// grande) SEM substituto documentado — o par accent/accentForeground no
// light falha 3:1 de propósito (paleta primária inalterada, ver
// design/tokens.json $meta.note) e já tem substituto (lime-700/900) para
// o único uso onde isso importaria (texto). Falha real = token sem
// alternativa conhecida, não a existência do par na paleta.
const undocumentedFailures = [...light, ...dark].filter(
  (r) => !r.passesLargeTextOrUi && !r.substitute,
);

// Regras duras do lime: um par normal precisa passar AA texto normal; o par
// `expectFail` precisa CONTINUAR falhando — se um dia passar, é sinal de que
// o primitivo lime-500 mudou de valor e a regra dura da marca (DESIGN.md
// v2.0 §4.1: "lime-500 nunca é texto pequeno sobre fundo claro") pode ter
// deixado de ser verdade, o que merece revisão, não passar silenciosamente.
const limeRuleViolations = limeHardRules.filter((r) => (r.expectFail ? r.passes : !r.passes));

console.log(`Relatório de contraste escrito em ${outputPath}`);
if (undocumentedFailures.length > 0 || limeRuleViolations.length > 0) {
  if (undocumentedFailures.length > 0) {
    console.error(
      `\n✗ ${undocumentedFailures.length} par(es) abaixo do limiar de 3:1 (texto grande/UI) sem substituto documentado:`,
    );
    for (const r of undocumentedFailures) {
      console.error(`  - ${r.pair}: ${r.ratio.toFixed(2)}:1`);
    }
  }
  if (limeRuleViolations.length > 0) {
    console.error(`\n✗ ${limeRuleViolations.length} regra(s) dura(s) do lime violada(s):`);
    for (const r of limeRuleViolations) {
      console.error(`  - ${r.label}: ${r.ratio.toFixed(2)}:1`);
    }
  }
  process.exitCode = 1;
} else {
  console.log('✓ audit-contrast: nenhuma falha de contraste sem substituto documentado.');
}
