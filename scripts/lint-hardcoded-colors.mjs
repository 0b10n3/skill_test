#!/usr/bin/env node
// Lint de cor hardcoded (Épico 14, REDESIGN.md §2 invariante #1): nenhuma
// cor no app deve ser um literal hex/rgb/hsl fora dos arquivos que definem
// os tokens — toda cor resolve para um token de design/tokens.json.
//
// Varre app/, components/, lib/, content/ (código-fonte real) por literais
// de cor em arquivos .ts/.tsx. Não varre .css (os arquivos gerados e o
// globals.css são exatamente onde essas cores DEVEM aparecer).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const SCAN_DIRS = ['app', 'components', 'lib', 'content'];
const COLOR_PATTERN = /#[0-9a-fA-F]{3,8}\b|\brgba?\([^)]*\)|\bhsla?\([^)]*\)/g;

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

    const matches = line.match(COLOR_PATTERN);
    if (matches) {
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
