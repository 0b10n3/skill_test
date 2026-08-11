import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/submit/route';
import { questionsBank } from '@/lib/questions-bank';
import { buildAnswers, postSubmit } from './test-helpers';

const VALID_LEAD = { name: 'Maria Teste', email: 'maria@example.com', optIn: true as const };

describe('POST /api/submit — cenários de diagnóstico', () => {
  it('9 acertos em 15 → scoreGlobal 0.6 e classificação "medio"', async () => {
    const answers = buildAnswers('pleno', 9);
    const response = await postSubmit({ answers, lead: VALID_LEAD });
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.diagnostico.scoreGlobal).toBe(0.6);
    expect(body.diagnostico.acertos).toBe(9);
    expect(body.diagnostico.classificacao).toBe('medio');
    expect(body.diagnostico.dimensoes).toHaveLength(5);
  });

  it('0 acertos em 15 → scoreGlobal 0 e classificação "baixo"', async () => {
    const answers = buildAnswers('aspirante', 0);
    const response = await postSubmit({ answers, lead: VALID_LEAD });
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.diagnostico.scoreGlobal).toBe(0);
    expect(body.diagnostico.classificacao).toBe('baixo');
  });

  it('15 acertos em 15 → scoreGlobal 1 e classificação "alto"', async () => {
    const answers = buildAnswers('senior', 15);
    const response = await postSubmit({ answers, lead: VALID_LEAD });
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.diagnostico.scoreGlobal).toBe(1);
    expect(body.diagnostico.classificacao).toBe('alto');
  });

  it('ignora diagnóstico forjado no payload — recalcula do zero pelo question.id', async () => {
    const answers = buildAnswers('junior', 2);
    const response = await postSubmit({
      answers,
      lead: VALID_LEAD,
      diagnostico: { scoreGlobal: 1, classificacao: 'alto' },
    });
    const body = await response.json();

    expect(body.diagnostico.scoreGlobal).not.toBe(1);
    expect(body.diagnostico.classificacao).toBe('baixo');
  });

  it('retorna o gabarito comentado com as 15 perguntas de conhecimento', async () => {
    const answers = buildAnswers('pleno', 9);
    const response = await postSubmit({ answers, lead: VALID_LEAD });
    const body = await response.json();

    expect(body.gabarito).toHaveLength(15);
    expect(
      body.gabarito.every((item: { explanation: string }) => item.explanation.length > 0),
    ).toBe(true);
  });
});

describe('POST /api/submit — gabarito comentado', () => {
  it('o correctOptionId do gabarito é revelado de propósito (pós-submissão) e bate com o gabarito real', async () => {
    const answers = buildAnswers('pleno', 9);
    const response = await postSubmit({ answers, lead: VALID_LEAD });
    const body = await response.json();

    for (const item of body.gabarito) {
      const question = questionsBank.find((q) => q.id === item.questionId)!;
      expect(item.correctOptionId).toBe(question.correctOptionId);
      expect(item.correct).toBe(item.selectedOptionId === question.correctOptionId);
    }
  });
});

describe('POST /api/submit — validação de payloads malformados', () => {
  it('e-mail malformado retorna 400, não 500', async () => {
    const answers = buildAnswers('pleno', 8);
    const response = await postSubmit({
      answers,
      lead: { ...VALID_LEAD, email: 'nao-e-um-email' },
    });

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBeDefined();
  });

  it('optIn ausente/false retorna 400', async () => {
    const answers = buildAnswers('pleno', 8);
    const response = await postSubmit({ answers, lead: { ...VALID_LEAD, optIn: false } });

    expect(response.status).toBe(400);
  });

  it('questionId inexistente no mapa de respostas retorna 400', async () => {
    const answers = buildAnswers('pleno', 8);
    answers['q-nao-existe'] = 'a';
    const response = await postSubmit({ answers, lead: VALID_LEAD });

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('q-nao-existe');
  });

  it('optionId que não existe na pergunta retorna 400', async () => {
    const answers = buildAnswers('pleno', 8);
    const [firstKnowledgeId] = Object.keys(answers).filter((id) => id !== 'q00');
    answers[firstKnowledgeId] = 'opcao-inexistente-xyz';
    const response = await postSubmit({ answers, lead: VALID_LEAD });

    expect(response.status).toBe(400);
  });

  it('pergunta fora da senioridade declarada (payload adulterado) retorna 400', async () => {
    const answers = buildAnswers('aspirante', 3);
    // injeta uma pergunta "hard" que não é elegível para aspirante
    const seniorOnlyQuestion = questionsBank.find(
      (q) =>
        q.type === 'knowledge' &&
        q.targetSeniority?.includes('senior') &&
        !q.targetSeniority?.includes('aspirante'),
    )!;
    answers[seniorOnlyQuestion.id] = seniorOnlyQuestion.correctOptionId!;

    const response = await postSubmit({ answers, lead: VALID_LEAD });
    expect(response.status).toBe(400);
  });

  it('sessão incompleta (faltando perguntas de conhecimento) retorna 400', async () => {
    const seniorityQuestion = questionsBank.find((q) => q.type === 'seniority')!;
    const response = await postSubmit({
      answers: { [seniorityQuestion.id]: 'pleno' },
      lead: VALID_LEAD,
    });

    expect(response.status).toBe(400);
  });

  it('JSON quebrado retorna 400 sem stack trace exposto', async () => {
    const request = new NextRequest('http://localhost/api/submit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{ isso não é json',
    });
    const response = await POST(request);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(JSON.stringify(body)).not.toMatch(/at\s+.*\.(ts|js):\d+/);
  });

  it('answers vazio retorna 400', async () => {
    const response = await postSubmit({ answers: {}, lead: VALID_LEAD });
    expect(response.status).toBe(400);
  });
});
