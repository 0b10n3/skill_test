#!/usr/bin/env node
// Lint de cantos retos (Épico 22, DESIGN.md v2.0 §4.4–§4.5): o sistema só
// permite radius.none (0px) e radius.sm (2px, "sm" agora É o máximo, não um
// degrau intermediário). Qualquer classe Tailwind de radius "amigável"
// (md/lg/xl/2xl/3xl/4xl/pill/full, ou um valor arbitrário > 2px) é proibida
// — exceto nas duas exceções documentadas do sistema: avatares/símbolo do
// logo, e o círculo semântico do RadioGroup (components/ui/radio-group.tsx
// — ver comentário no próprio arquivo: achatar o rádio o tornaria
// indistinguível de um checkbox no quiz, trocando precisão de marca por
// ambiguidade real de UX).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const SCAN_DIRS = ['app', 'components'];

// Arquivos com exceção documentada ao sistema de cantos retos — cada um
// precisa do motivo aqui, não só no código.
const EXCEPTIONS = [
  {
    path: 'components/ui/radio-group.tsx',
    reason: 'círculo semântico de seleção única (rádio) — ver comentário no próprio arquivo.',
  },
];

// Sufixos de radius "amigáveis" banidos — tudo que não é none/sm no
// tokens.json v2.0.0. `full` é permitido só nos arquivos de EXCEPTIONS
// (checado separadamente abaixo, não neste padrão).
const FORBIDDEN_NAMED_RADIUS_PATTERN =
  /\brounded(?:-[tlbr][trbl]?)?-(?:xs|md|lg|xl|2xl|3xl|4xl|pill)\b/g;
// `rounded-full` isolado — permitido só nos arquivos de EXCEPTIONS.
const ROUNDED_FULL_PATTERN = /\brounded(?:-[tlbr][trbl]?)?-full\b/g;
// Valor arbitrário: rounded-[Npx] com N > 2, ou qualquer unidade não-px
// (rem/em/%) — sempre suspeito num sistema de 0/2px.
const ARBITRARY_RADIUS_PATTERN = /\brounded(?:-[tlbr][trbl]?)?-\[([^\]]+)\]/g;

function listSourceFiles() {
  const output = execSync(`git ls-files -- ${SCAN_DIRS.map((d) => `'${d}'`).join(' ')}`, {
    cwd: rootDir,
    encoding: 'utf-8',
  });
  return output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((file) => /\.tsx?$/.test(file));
}

function isArbitraryValueTooLarge(rawValue) {
  const match = rawValue.trim().match(/^(-?[\d.]+)px$/);
  if (!match) return true; // unidade não-px num sistema 0/2px é sempre suspeita
  return Math.abs(Number.parseFloat(match[1])) > 2;
}

function findViolations(filePath) {
  const content = readFileSync(path.join(rootDir, filePath), 'utf-8');
  const lines = content.split('\n');
  const exception = EXCEPTIONS.find((e) => e.path === filePath);
  const findings = [];

  lines.forEach((line, index) => {
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;

    const named = line.match(FORBIDDEN_NAMED_RADIUS_PATTERN) ?? [];
    const arbitraryMatches = [...line.matchAll(ARBITRARY_RADIUS_PATTERN)]
      .filter((m) => isArbitraryValueTooLarge(m[1]))
      .map((m) => m[0]);
    const full = exception ? [] : (line.match(ROUNDED_FULL_PATTERN) ?? []);

    const matches = [...named, ...arbitraryMatches, ...full];
    if (matches.length > 0) {
      findings.push({ line: index + 1, text: line.trim(), matches });
    }
  });

  return findings;
}

const files = listSourceFiles();
let totalFindings = 0;

for (const file of files) {
  const findings = findViolations(file);
  for (const finding of findings) {
    totalFindings += 1;
    console.error(`${file}:${finding.line}: ${finding.matches.join(', ')}`);
    console.error(`  ${finding.text}`);
  }
}

if (totalFindings > 0) {
  console.error(
    `\n✗ lint-radius: ${totalFindings} ocorrência(s) de radius fora do sistema de cantos retos (radius.none/radius.sm).`,
  );
  console.error(
    'Use rounded-none ou rounded-sm — exceção única: avatares e o símbolo do logo (documentar em scripts/lint-radius.mjs EXCEPTIONS).',
  );
  process.exitCode = 1;
} else {
  console.log('✓ lint-radius: nenhum radius fora do sistema de cantos retos.');
}
