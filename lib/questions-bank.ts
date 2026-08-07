import questionsData from '@/content/questions.json';
import { parseQuestionsBank } from './questions-schema';
import type { Question } from './types';

/**
 * Validado contra o schema Zod na importação do módulo — qualquer divergência
 * de content/questions.json com o contrato lança erro imediatamente (falha os
 * testes/build que dependem deste módulo, em vez de falhar silenciosamente em runtime).
 */
export const questionsBank: Question[] = parseQuestionsBank(questionsData);
