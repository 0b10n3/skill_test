import { describe, expect, it } from 'vitest';
import { buildQuizSession } from '@/lib/quiz-selection';
import type { SeniorityLevel } from '@/lib/types';

const ALL_SENIORITY_LEVELS: SeniorityLevel[] = [
  'aspirante',
  'estagiario',
  'junior',
  'pleno',
  'senior',
];

describe('buildQuizSession', () => {
  it.each(ALL_SENIORITY_LEVELS)(
    'monta uma sessão válida de 14 perguntas para seniority "%s"',
    (seniority) => {
      const session = buildQuizSession(seniority);

      expect(session.seniorityQuestion.type).toBe('seniority');
      expect(session.selfAssessmentQuestion.type).toBe('self_assessment');
      expect(session.knowledgeQuestions).toHaveLength(12);
      expect(session.knowledgeQuestions.every((q) => q.type === 'knowledge')).toBe(true);
    },
  );

  it.each(ALL_SENIORITY_LEVELS)(
    'retorna exatamente 3 perguntas por categoria, todas elegíveis, para seniority "%s"',
    (seniority) => {
      const session = buildQuizSession(seniority);
      const categories = [...new Set(session.knowledgeQuestions.map((q) => q.category))];

      expect(categories).toHaveLength(4);
      for (const category of categories) {
        const inCategory = session.knowledgeQuestions.filter((q) => q.category === category);
        expect(inCategory).toHaveLength(3);
      }
    },
  );

  it.each(ALL_SENIORITY_LEVELS)('não lança erro para seniority "%s"', (seniority) => {
    expect(() => buildQuizSession(seniority)).not.toThrow();
  });

  it('nunca inclui correctOptionId em nenhuma pergunta da sessão (objeto client)', () => {
    const session = buildQuizSession('senior');
    const allQuestions = [
      session.seniorityQuestion,
      ...session.knowledgeQuestions,
      session.selfAssessmentQuestion,
    ];

    for (const question of allQuestions) {
      expect(question).not.toHaveProperty('correctOptionId');
      expect(JSON.stringify(question)).not.toContain('correctOptionId');
    }
  });

  it('embaralha a ordem das alternativas entre sessões diferentes', () => {
    const orders = new Set<string>();

    for (let i = 0; i < 30; i += 1) {
      const session = buildQuizSession('pleno');
      const q = session.knowledgeQuestions[0];
      orders.add(q.options.map((o) => o.id).join(','));
    }

    expect(orders.size).toBeGreaterThan(1);
  });
});
