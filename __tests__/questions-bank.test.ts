import { describe, expect, it } from 'vitest';
import { questionsBank } from '@/lib/questions-bank';

describe('questionsBank', () => {
  it('carrega e valida content/questions.json contra o schema Zod sem lançar erro', () => {
    expect(questionsBank.length).toBe(30);
  });

  it('contém exatamente 1 pergunta de senioridade, 28 de conhecimento e 1 de autoavaliação', () => {
    expect(questionsBank.filter((q) => q.type === 'seniority')).toHaveLength(1);
    expect(questionsBank.filter((q) => q.type === 'knowledge')).toHaveLength(28);
    expect(questionsBank.filter((q) => q.type === 'self_assessment')).toHaveLength(1);
  });
});
