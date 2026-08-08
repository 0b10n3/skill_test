import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { questionsBank } from '@/lib/questions-bank';
import type { AnswerMap, SeniorityLevel } from '@/lib/types';

const createOrUpdateMock = vi.fn();

vi.mock('@mailerlite/mailerlite-nodejs', () => ({
  default: vi.fn().mockImplementation(function MockMailerLite() {
    return { subscribers: { createOrUpdate: createOrUpdateMock } };
  }),
}));

const ORIGINAL_ENV = { ...process.env };

function buildAnswers(seniority: SeniorityLevel): AnswerMap {
  const seniorityQuestion = questionsBank.find((q) => q.type === 'seniority')!;
  const selfAssessmentQuestion = questionsBank.find((q) => q.type === 'self_assessment')!;
  const categories = [
    ...new Set(questionsBank.filter((q) => q.type === 'knowledge').map((q) => q.category)),
  ];

  const answers: AnswerMap = { [seniorityQuestion.id]: seniority };
  for (const category of categories) {
    const eligible = questionsBank
      .filter(
        (q) =>
          q.type === 'knowledge' &&
          q.category === category &&
          q.targetSeniority?.includes(seniority),
      )
      .slice(0, 3);
    for (const question of eligible) {
      answers[question.id] = question.correctOptionId!;
    }
  }
  answers[selfAssessmentQuestion.id] = selfAssessmentQuestion.options[0].id;
  return answers;
}

describe('POST /api/submit — falha simulada na MailerLite não bloqueia o resultado', () => {
  beforeEach(() => {
    createOrUpdateMock.mockReset();
    process.env.MAILERLITE_API_KEY = 'test-key';
    process.env.MAILERLITE_GROUP_ID_BAIXO = 'g-baixo';
    process.env.MAILERLITE_GROUP_ID_MEDIO = 'g-medio';
    process.env.MAILERLITE_GROUP_ID_ALTO = 'g-alto';
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    vi.resetModules();
  });

  it('erro de rede simulado na MailerLite não impede a resposta 200 com o score correto', async () => {
    createOrUpdateMock.mockRejectedValue(new Error('Falha de rede simulada'));
    vi.resetModules();
    const { POST } = await import('@/app/api/submit/route');

    const answers = buildAnswers('pleno');
    const request = new NextRequest('http://localhost/api/submit', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': `10.1.1.${Math.random()}` },
      body: JSON.stringify({
        answers,
        lead: { name: 'Teste Falha', email: 'falha@example.com', optIn: true },
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.scoreGeral).toBe(100);
    expect(body.classification).toBe('alto');
    expect(createOrUpdateMock).toHaveBeenCalledTimes(1);
  });
});
