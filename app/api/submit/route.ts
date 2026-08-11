import { NextResponse, type NextRequest } from 'next/server';
import { questionsBank } from '@/lib/questions-bank';
import { calculateScore } from '@/lib/scoring';
import { buildResultNarrative } from '@/lib/narrative';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { submitPayloadSchema } from '@/lib/validations';
import { syncLeadToMailerLite } from '@/lib/mailerlite';
import { computeDiagnostico, persistDiagnostico } from '@/lib/diagnostico';
import type { Question, SeniorityLevel } from '@/lib/types';

const EXPECTED_KNOWLEDGE_PER_CATEGORY = 3;
const EXPECTED_KNOWLEDGE_CATEGORIES = 5;

function badRequest(message: string, extra?: Record<string, unknown>) {
  return NextResponse.json({ error: message, ...extra }, { status: 400 });
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(clientIp);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Muitas submissões em pouco tempo. Tente novamente em instantes.' },
      { status: 429 },
    );
  }

  let rawPayload: unknown;
  try {
    rawPayload = await request.json();
  } catch {
    return badRequest('JSON inválido');
  }

  const parsed = submitPayloadSchema.safeParse(rawPayload);
  if (!parsed.success) {
    return badRequest('Payload inválido', { issues: parsed.error.issues });
  }

  const { answers, lead } = parsed.data;

  // --- Senioridade: derivada da resposta a q00, nunca de um campo solto que
  // o client poderia enviar dessincronizado das respostas de fato marcadas.
  const seniorityQuestion = questionsBank.find((question) => question.type === 'seniority');
  if (!seniorityQuestion) {
    return NextResponse.json({ error: 'Erro interno de configuração' }, { status: 500 });
  }

  const submittedSeniority = answers[seniorityQuestion.id];
  const isValidSeniority = seniorityQuestion.options.some(
    (option) => option.id === submittedSeniority,
  );
  if (!submittedSeniority || !isValidSeniority) {
    return badRequest(`Resposta de senioridade ausente ou inválida (${seniorityQuestion.id})`);
  }
  // Seguro: acabamos de validar que submittedSeniority é um dos option.id de
  // q00, que são exatamente os valores de SeniorityLevel (ver content/questions.json).
  const seniority = submittedSeniority as SeniorityLevel;

  // --- Cada resposta é recalculada contra o gabarito real do servidor, por
  // question.id — o client nunca é a fonte de verdade sobre o que é correto,
  // nem sobre quais perguntas ele "deveria" ter recebido.
  const knowledgeQuestionsAnswered: Question[] = [];

  for (const [questionId, optionId] of Object.entries(answers)) {
    if (questionId === seniorityQuestion.id) continue;

    const question = questionsBank.find((q) => q.id === questionId);
    if (!question) {
      return badRequest(`questionId inexistente: ${questionId}`);
    }

    if (question.type !== 'knowledge') continue;

    const optionExists = question.options.some((option) => option.id === optionId);
    if (!optionExists) {
      return badRequest(`optionId inválido para a pergunta ${questionId}`);
    }

    if (!question.targetSeniority?.includes(seniority)) {
      return badRequest(
        `Pergunta ${questionId} não é elegível para a senioridade declarada (${seniority})`,
      );
    }

    knowledgeQuestionsAnswered.push(question);
  }

  // --- Integridade da sessão: exatamente 3 perguntas por categoria, nas 4
  // categorias de conhecimento — protege contra payloads manipulados que
  // tentem inflar ou distorcer o denominador do score.
  const countByCategory = new Map<string, number>();
  for (const question of knowledgeQuestionsAnswered) {
    countByCategory.set(question.category, (countByCategory.get(question.category) ?? 0) + 1);
  }
  const sessionIsWellFormed =
    countByCategory.size === EXPECTED_KNOWLEDGE_CATEGORIES &&
    [...countByCategory.values()].every((count) => count === EXPECTED_KNOWLEDGE_PER_CATEGORY);

  if (!sessionIsWellFormed) {
    return badRequest(
      `Conjunto de respostas de conhecimento incompleto: esperado ${EXPECTED_KNOWLEDGE_PER_CATEGORY} por categoria em ${EXPECTED_KNOWLEDGE_CATEGORIES} categorias`,
    );
  }

  const score = calculateScore(answers, knowledgeQuestionsAnswered);

  const narrative = buildResultNarrative({
    classification: score.classification,
    scorePorCategoria: score.scorePorCategoria,
  });

  // Motor de diagnóstico v2 (Épico 11) — computado e persistido em paralelo
  // ao cálculo "antigo" acima. A resposta HTTP abaixo continua no formato
  // consumido pelo /resultado atual; o relatório que consome o diagnóstico
  // completo é o Épico 12.
  const diagnostico = computeDiagnostico(answers, seniority, knowledgeQuestionsAnswered);
  persistDiagnostico({ seniority, diagnostico });

  // Aguardamos a sincronização (a especificação prevê essa ordem: sincroniza
  // e só então libera o resultado), mas syncLeadToMailerLite nunca rejeita —
  // qualquer falha é tratada e logada internamente, sem propagar para cá.
  // Isso evita tanto bloquear o resultado por causa de um erro quanto o
  // risco de a chamada ser interrompida no meio por causa da função
  // serverless encerrar após a resposta (fire-and-forget sem await).
  await syncLeadToMailerLite({
    email: lead.email,
    name: lead.name,
    seniority,
    scoreGeral: score.scoreGeral,
    classification: score.classification,
  });

  return NextResponse.json({
    scoreGeral: score.scoreGeral,
    scorePorCategoria: score.scorePorCategoria,
    classification: score.classification,
    narrative,
  });
}
