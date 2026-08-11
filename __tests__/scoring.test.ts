import { describe, expect, it } from 'vitest';
import { calculateScore, classifyScore } from '@/lib/scoring';
import type { AnswerMap, Question } from '@/lib/types';

function makeKnowledgeQuestion(overrides: Partial<Question>): Question {
  return {
    id: 'qx',
    type: 'knowledge',
    category: 'mercados-produtos',
    targetSeniority: ['aspirante'],
    question: 'pergunta',
    options: [
      { id: 'a', text: 'A' },
      { id: 'b', text: 'B' },
      { id: 'c', text: 'C' },
      { id: 'd', text: 'D' },
    ],
    correctOptionId: 'a',
    explanation: 'explicação',
    ...overrides,
  };
}

describe('classifyScore — fronteiras exatas', () => {
  it('39% é "baixo" e 40% já é "medio"', () => {
    expect(classifyScore(39)).toBe('baixo');
    expect(classifyScore(39.99)).toBe('baixo');
    expect(classifyScore(40)).toBe('medio');
  });

  it('69% é "medio" e 70% já é "alto"', () => {
    expect(classifyScore(69)).toBe('medio');
    expect(classifyScore(69.99)).toBe('medio');
    expect(classifyScore(70)).toBe('alto');
  });

  it('0% é "baixo" e 100% é "alto"', () => {
    expect(classifyScore(0)).toBe('baixo');
    expect(classifyScore(100)).toBe('alto');
  });
});

describe('calculateScore', () => {
  it('calcula 9 acertos em 15 como 60% e classificação "medio"', () => {
    const categories = [
      'mercados-produtos',
      'matematica-quant',
      'dados-programacao',
      'ia-aplicada',
      'risco-regulacao',
    ] as const;

    const questionsBank: Question[] = [];
    const answers: AnswerMap = {};
    let correctCount = 0;

    categories.forEach((category) => {
      for (let i = 0; i < 3; i += 1) {
        const id = `${category}-${i}`;
        questionsBank.push(makeKnowledgeQuestion({ id, category, correctOptionId: 'a' }));

        const shouldBeCorrect = correctCount < 9;
        answers[id] = shouldBeCorrect ? 'a' : 'b';
        if (shouldBeCorrect) correctCount += 1;
      }
    });

    const result = calculateScore(answers, questionsBank);

    expect(result.scoreGeral).toBe(60);
    expect(result.classification).toBe('medio');
  });

  it('nunca confia em respostas para perguntas fora do banco (score calculado só a partir do gabarito)', () => {
    const questionsBank = [makeKnowledgeQuestion({ id: 'q1', correctOptionId: 'a' })];
    const answers: AnswerMap = { q1: 'a', 'pergunta-inexistente': 'a' };

    const result = calculateScore(answers, questionsBank);

    expect(result.scoreGeral).toBe(100);
  });

  it('ignora perguntas de type diferente de "knowledge" no cálculo', () => {
    const questionsBank: Question[] = [
      makeKnowledgeQuestion({ id: 'q1', correctOptionId: 'a' }),
      {
        id: 'q00',
        type: 'seniority',
        category: 'perfil-senioridade',
        question: 'senioridade?',
        options: [{ id: 'aspirante', text: 'Aspirante' }],
      },
    ];
    const answers: AnswerMap = { q1: 'a', q00: 'aspirante' };

    const result = calculateScore(answers, questionsBank);

    expect(result.scoreGeral).toBe(100);
    expect(result.scorePorCategoria).toHaveLength(1);
  });

  it('trata resposta ausente como erro, não lança exceção', () => {
    const questionsBank = [makeKnowledgeQuestion({ id: 'q1', correctOptionId: 'a' })];
    const result = calculateScore({}, questionsBank);

    expect(result.scoreGeral).toBe(0);
    expect(result.classification).toBe('baixo');
  });
});
