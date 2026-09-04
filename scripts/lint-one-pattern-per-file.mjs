#!/usr/bin/env node
// Lint de composição de padrões (Épico 15, DESIGN.md §6.5 "um pattern por
// peça"): nenhum arquivo pode importar mais de uma das três famílias de
// padrão geométrico (components/patterns) — misturar malha com grade
// de dados, por exemplo, "lê como ruído, não como sistema".
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const SCAN_DIRS = ['app', 'components'];
// Épico 27: PatternDataGrid renomeado para PatternReticula — esta lista já
// ficou desatualizada uma vez (achado do Épico 29) por não ter sido
// atualizada junto com o rename. Épico 31: PatternNodeBranch → PatternMesh
// (REVOGACOES.md H9), lista atualizada no mesmo commit da troca desta vez.
// GradientAmbient (Épico 29) não entra aqui: não é um dos dois padrões
// geométricos, é a exceção de camada de ambiente (DESIGN.md §4.5) — pode
// conviver com um pattern no mesmo arquivo sem violar "um pattern por peça".
const PATTERN_NAMES = ['PatternMesh', 'PatternReticula', 'PatternGrowthLine'];

// O próprio diretório de definição dos padrões não conta — só composições
// (páginas/componentes que os consomem). O catálogo /dev/ui também é
// excluído: seu propósito é justamente exibir os três padrões lado a lado
// como referência, não compor uma peça real do produto.
const EXCLUDED_FILES = ['app/dev/ui/page.tsx'];
const EXCLUDED_PREFIX = 'components/patterns/';

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
    .filter((file) => !file.startsWith(EXCLUDED_PREFIX))
    .filter((file) => !EXCLUDED_FILES.includes(file));
}

function findPatternImports(source) {
  const importBlockMatch = source.match(
    /import\s*\{([^}]*)\}\s*from\s*['"]@\/components\/patterns['"]/,
  );
  if (!importBlockMatch) return [];
  const names = importBlockMatch[1]
    .split(',')
    .map((name) => name.trim().split(/\s+as\s+/)[0])
    .filter(Boolean);
  return PATTERN_NAMES.filter((pattern) => names.includes(pattern));
}

const violations = [];
for (const file of listSourceFiles()) {
  const source = readFileSync(path.join(rootDir, file), 'utf-8');
  const used = findPatternImports(source);
  if (used.length > 1) {
    violations.push({ file, used });
  }
}

if (violations.length > 0) {
  console.error('✗ lint-one-pattern-per-file: mais de um padrão geométrico na mesma peça:\n');
  for (const violation of violations) {
    console.error(`  ${violation.file}: ${violation.used.join(', ')}`);
  }
  console.error(
    '\nDESIGN.md §5.4 — "um padrão por peça": nunca combine nó-e-galho com grade de dados (ou qualquer outra combinação) na mesma composição.',
  );
  process.exit(1);
}

console.log('✓ lint-one-pattern-per-file: nenhuma peça combina mais de um padrão geométrico.');
