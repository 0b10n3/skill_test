import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/submit/route';
import { questionsBank } from '@/lib/questions-bank';
import { buildAnswers, postSubmit } from './test-helpers';

const VALID_LEAD = { name: 'Maria Teste', email: 'maria@example.com', optIn: true as const };

describe('POST /api/submit — cenários de scoring', () => {
  it('9 acertos em 15 → scoreGeral 60% e classificação "medio"', async () => {
    const answers = buildAnswers('pleno', 9);
    const response = await postSubmit({ answers, lead: VALID_LEAD });
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.scoreGeral).toBe(60);
    expect(body.classification).toBe('medio');
    expect(body.scorePorCategoria).toHaveLength(5);
  });

  it('0 acertos em 15 → scoreGeral 0% e classificação "baixo"', async () => {
    const answers = buildAnswers('aspirante', 0);
    const response = await postSubmit({ answers, lead: VALID_LEAD });
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.scoreGeral).toBe(0);
    expect(body.classification).toBe('baixo');
  });

  it('15 acertos em 15 → scoreGeral 100% e classificação "alto"', async () => {
    const answers = buildAnswers('senior', 15);
    const response = await postSubmit({ answers, lead: VALID_LEAD });
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.scoreGeral).toBe(100);
    expect(body.classification).toBe('alto');
  });

  it('ignora um score/classificação forjado no payload — recalcula do zero pelo question.id', async () => {
    const answers = buildAnswers('junior', 2);
    const response = await postSubmit({
      answers,
      lead: VALID_LEAD,
      scoreGeral: 100,
      classification: 'alto',
    });
    const body = await response.json();

    expect(body.scoreGeral).not.toBe(100);
    expect(body.classification).toBe('baixo');
  });

  it('retorna narrativa personalizada além do score', async () => {
    const answers = buildAnswers('pleno', 9);
    const response = await postSubmit({ answers, lead: VALID_LEAD });
    const body = await response.json();

    expect(body.narrative).toBeDefined();
    expect(typeof body.narrative.headline).toBe('string');
    expect(body.narrative.headline.length).toBeGreaterThan(0);
  });
});

describe('POST /api/submit — segurança: gabarito nunca vaza na resposta', () => {
  it('a resposta HTTP não contém correctOptionId em nenhum lugar', async () => {
    const answers = buildAnswers('pleno', 9);
    const response = await postSubmit({ answers, lead: VALID_LEAD });
    const rawText = JSON.stringify(await response.json());

    expect(rawText).not.toContain('correctOptionId');
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
