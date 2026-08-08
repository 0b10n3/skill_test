import { describe, expect, it } from 'vitest';
import { fetchRestOfSession } from '@/app/quiz/actions';
import type { SeniorityLevel } from '@/lib/types';

const ALL_SENIORITY_LEVELS: SeniorityLevel[] = [
  'aspirante',
  'estagiario',
  'junior',
  'pleno',
  'senior',
];

describe('fetchRestOfSession (Server Action usada por /quiz)', () => {
  it.each(ALL_SENIORITY_LEVELS)(
    'só retorna perguntas de conhecimento cujo targetSeniority inclui "%s"',
    async (seniority) => {
      const { knowledgeQuestions } = await fetchRestOfSession(seniority);

      expect(knowledgeQuestions).toHaveLength(12);
      for (const question of knowledgeQuestions) {
        expect(question.targetSeniority).toContain(seniority);
      }
    },
  );

  it('não inclui correctOptionId em nenhuma pergunta retornada', async () => {
    const { knowledgeQuestions, selfAssessmentQuestion } = await fetchRestOfSession('pleno');

    for (const question of [...knowledgeQuestions, selfAssessmentQuestion]) {
      expect(question).not.toHaveProperty('correctOptionId');
    }
  });
});
