#!/usr/bin/env node
/**
 * Valida content/questions.json (banco v2) contra o blueprint de senioridade
 * definido em AVALIACAO.md §3–§4. Roda em CI, bloqueante (Épico 10).
 *
 * Checa:
 * - JSON válido, ids únicos.
 * - Todo item "knowledge" tem 4 alternativas, correctOptionId existente
 *   entre as alternativas e explanation não vazia.
 * - Para cada um dos 5 níveis de senioridade, exatamente 3 itens por
 *   dimensão (15 no total).
 * - Distribuição de dificuldade por nível igual à tabela do AVALIACAO.md §4.2.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const QUESTIONS_PATH = fileURLToPath(new URL('../content/questions.json', import.meta.url));

const SENIORITY_LEVELS = ['aspirante', 'estagiario', 'junior', 'pleno', 'senior'];
const DIMENSIONS = [
  'mercados-produtos',
  'matematica-quant',
  'dados-programacao',
  'ia-aplicada',
  'risco-regulacao',
];
const QUESTIONS_PER_DIMENSION = 3;

// AVALIACAO.md §4.2
const EXPECTED_DIFFICULTY_DISTRIBUTION = {
  aspirante: { easy: 9, medium: 6, hard: 0 },
  estagiario: { easy: 6, medium: 7, hard: 2 },
  junior: { easy: 2, medium: 8, hard: 5 },
  pleno: { easy: 0, medium: 6, hard: 9 },
  senior: { easy: 0, medium: 4, hard: 11 },
};

const errors = [];

function fail(message) {
  errors.push(message);
}

function loadQuestions() {
  let raw;
  try {
    raw = readFileSync(QUESTIONS_PATH, 'utf-8');
  } catch (error) {
    fail(`Não foi possível ler ${QUESTIONS_PATH}: ${error.message}`);
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    fail(`JSON inválido em ${QUESTIONS_PATH}: ${error.message}`);
    return null;
  }
}

function validateIds(questions) {
  const seen = new Map();
  for (const question of questions) {
    if (!question.id) {
      fail('Item sem "id" encontrado');
      continue;
    }
    if (seen.has(question.id)) {
      fail(`id duplicado: "${question.id}"`);
    }
    seen.set(question.id, true);
  }
}

function validateKnowledgeItem(question) {
  const label = `item "${question.id}"`;

  if (!Array.isArray(question.options) || question.options.length !== 4) {
    fail(`${label}: esperado 4 alternativas, encontrado ${question.options?.length ?? 0}`);
  }

  const optionIds = (question.options ?? []).map((option) => option.id);
  if (!question.correctOptionId || !optionIds.includes(question.correctOptionId)) {
    fail(
      `${label}: correctOptionId "${question.correctOptionId}" não existe entre as options (${optionIds.join(', ')})`,
    );
  }

  if (!question.explanation || question.explanation.trim().length === 0) {
    fail(`${label}: explanation vazia ou ausente`);
  }
}

function validateBlueprint(questions) {
  const knowledgeQuestions = questions.filter((question) => question.type === 'knowledge');

  for (const level of SENIORITY_LEVELS) {
    const eligible = knowledgeQuestions.filter((question) =>
      question.targetSeniority?.includes(level),
    );

    for (const dimension of DIMENSIONS) {
      const inDimension = eligible.filter((question) => question.category === dimension);
      if (inDimension.length !== QUESTIONS_PER_DIMENSION) {
        fail(
          `nível "${level}", dimensão "${dimension}": esperado ${QUESTIONS_PER_DIMENSION} itens elegíveis, encontrado ${inDimension.length}`,
        );
      }
    }

    if (eligible.length !== QUESTIONS_PER_DIMENSION * DIMENSIONS.length) {
      fail(
        `nível "${level}": esperado ${QUESTIONS_PER_DIMENSION * DIMENSIONS.length} itens no total, encontrado ${eligible.length}`,
      );
    }

    const expectedDifficulty = EXPECTED_DIFFICULTY_DISTRIBUTION[level];
    const actualDifficulty = { easy: 0, medium: 0, hard: 0 };
    for (const question of eligible) {
      if (question.difficultyLevel in actualDifficulty) {
        actualDifficulty[question.difficultyLevel] += 1;
      }
    }

    for (const difficulty of Object.keys(expectedDifficulty)) {
      if (actualDifficulty[difficulty] !== expectedDifficulty[difficulty]) {
        fail(
          `nível "${level}", dificuldade "${difficulty}": esperado ${expectedDifficulty[difficulty]}, encontrado ${actualDifficulty[difficulty]} (AVALIACAO.md §4.2)`,
        );
      }
    }
  }
}

function main() {
  const questions = loadQuestions();
  if (!questions) {
    printResult();
    return;
  }
  if (!Array.isArray(questions)) {
    fail('O banco de questões deve ser um array JSON');
    printResult();
    return;
  }

  validateIds(questions);

  for (const question of questions) {
    if (question.type === 'knowledge') {
      validateKnowledgeItem(question);
    }
  }

  validateBlueprint(questions);

  printResult();
}

function printResult() {
  if (errors.length > 0) {
    console.error(`✗ validate-questions: ${errors.length} problema(s) encontrado(s)\n`);
    for (const error of errors) {
      console.error(`  - ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('✓ validate-questions: banco de questões válido contra o blueprint');
}

main();
