#!/usr/bin/env node
// Lint de cor hardcoded (Épico 14, REDESIGN.md §2 invariante #1): nenhuma
// cor no app deve ser um literal hex/rgb/hsl fora dos arquivos que definem
// os tokens — toda cor resolve para um token de design/tokens.json.
//
// Épico 20 (DESIGN.md v1.1 §4.5) estende a proibição aos cinzas default de
// framework: mesmo sem literal hex, uma classe Tailwind como `text-gray-500`
// ou `border-slate-300` renderiza a escala default do Tailwind — que não é
// Slate (`#4A5568`, o único cinza de texto permitido pela marca) nem nenhum
// primitivo de design/tokens.json. Essas classes são banidas mesmo que a
// escala não apareça como hex no código-fonte.
//
// Épico 22 (DESIGN.md v2.0 §4.5) estende a mesma lógica à família Amber
// (aposentada — vira Lime) e ao Cream (aposentado — vira lime-100): mesmo
// sem literal hex, uma classe como `bg-amber-500` ainda renderiza — não o
// nosso token de marca aposentado, mas a escala AMBER DEFAULT do próprio
// Tailwind (que coexiste com nomes de escala custom, mesmo mecanismo que já
// vale para `lime`/`forest`/`grove` hoje), o que é sempre um erro: ou é um
// resquício não migrado, ou é uma cor equivocada que não tem relação
// nenhuma com o token real.
//
// Varre app/, components/, lib/, content/ (código-fonte real) por literais
// de cor e por classes de cinza/amber/cream de framework em arquivos
// .ts/.tsx. Não varre .css (os arquivos gerados e o globals.css são
// exatamente onde essas cores DEVEM aparecer).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const SCAN_DIRS = ['app', 'components', 'lib', 'content'];
const COLOR_PATTERN = /#[0-9a-fA-F]{3,8}\b|\brgba?\([^)]*\)|\bhsla?\([^)]*\)/g;
// Classes utilitárias Tailwind sobre a escala de cinza default do framework
// (gray/slate/zinc/neutral/stone) — DESIGN.md v1.1 §4.5. `slate` aqui é o
// nome da escala default do Tailwind, não o token de marca `Slate`
// (`--color-slate`/`text-slate` resolvem para `{color.neutral.slate}` e não
// batem neste padrão, que exige um sufixo numérico `-50`..`-950`).
const FRAMEWORK_GRAY_PATTERN =
  /\b(?:text|bg|border|ring|fill|stroke|divide|from|via|to|outline|decoration|accent|caret)-(?:gray|slate|zinc|neutral|stone)-(?:50|100|200|300|400|500|600|700|800|900|950)\b/g;
// Amber/cream aposentados (DESIGN.md v2.0 §4.1/§4.5) — qualquer classe
// Tailwind sobre essas escalas é proibida, mesmo sem hex literal (mesma
// lógica do FRAMEWORK_GRAY_PATTERN acima). `cream` não é uma escala default
// do Tailwind, então basta banir o nome sozinho, sem sufixo numérico.
const RETIRED_BRAND_COLOR_PATTERN =
  /\b(?:text|bg|border|ring|fill|stroke|divide|from|via|to|outline|decoration|accent|caret)-(?:amber-(?:50|100|200|300|400|500|600|700|800|900|950)|cream)\b/g;

/**
 * Exceções conhecidas e justificadas — cada uma precisa de um motivo, não
 * apaga a regra silenciosamente. Vazio por enquanto: nenhum arquivo
 * atualmente precisa de cor hardcoded fora dos tokens.
 */
const EXCEPTIONS = [];

function listSourceFiles() {
  const output = execSync(`git ls-files -- ${SCAN_DIRS.map((d) => `'${d}'`).join(' ')}`, {
    cwd: rootDir,
    encoding: 'utf-8',
  });
  return output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((file) => /\.tsx?$/.test(file))
    .filter((file) => !EXCEPTIONS.some((exception) => file === exception.path));
}

function findHardcodedColors(filePath) {
  const content = readFileSync(path.join(rootDir, filePath), 'utf-8');
  const lines = content.split('\n');
  const findings = [];

  lines.forEach((line, index) => {
    // Ignora a própria definição de EXCEPTIONS/comentários de justificativa.
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;

    const colorMatches = line.match(COLOR_PATTERN) ?? [];
    const grayMatches = line.match(FRAMEWORK_GRAY_PATTERN) ?? [];
    const retiredMatches = line.match(RETIRED_BRAND_COLOR_PATTERN) ?? [];
    const matches = [...colorMatches, ...grayMatches, ...retiredMatches];
    if (matches.length > 0) {
      findings.push({ line: index + 1, text: line.trim(), matches });
    }
  });

  return findings;
}

const files = listSourceFiles();
let totalFindings = 0;

for (const file of files) {
  const findings = findHardcodedColors(file);
  for (const finding of findings) {
    totalFindings += 1;
    console.error(`${file}:${finding.line}: ${finding.matches.join(', ')}`);
    console.error(`  ${finding.text}`);
  }
}

if (totalFindings > 0) {
  console.error(
    `\n✗ lint-hardcoded-colors: ${totalFindings} ocorrência(s) de cor hardcoded fora dos tokens.`,
  );
  console.error(
    'Use um token de design/tokens.json (classe Tailwind ou var(--nome)) em vez de um literal.',
  );
  process.exitCode = 1;
} else {
  console.log('✓ lint-hardcoded-colors: nenhuma cor hardcoded fora dos tokens.');
}
