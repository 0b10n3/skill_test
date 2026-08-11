'use server';

import { buildQuizSession } from '@/lib/quiz-selection';
import type { ClientQuestion, SeniorityLevel } from '@/lib/types';

export interface RestOfSession {
  knowledgeQuestions: ClientQuestion[];
}

/**
 * Roda só no servidor: monta a sessão adaptada à senioridade escolhida em q00
 * e devolve ao client apenas as 15 perguntas de conhecimento já filtradas e
 * sem gabarito. O módulo com o banco completo (lib/quiz-selection.ts →
 * lib/questions-bank.ts) nunca é importado por um componente client, então
 * nunca entra no bundle.
 */
export async function fetchRestOfSession(seniority: SeniorityLevel): Promise<RestOfSession> {
  const session = buildQuizSession(seniority);

  return {
    knowledgeQuestions: session.knowledgeQuestions,
  };
}
