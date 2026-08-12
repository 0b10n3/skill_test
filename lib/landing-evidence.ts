import { questionsBank } from './questions-bank';
import type { KnowledgeCategory, Option } from './types';

/**
 * Tiles de evidência da landing (DESIGN.md v1.1 §4.4.6, Épico 20): a seção
 * "o que o diagnóstico avalia" mostra conteúdo real do banco de perguntas
 * em vez de ícone+título+parágrafo — mas nunca pode expor `correctOptionId`
 * (mesma regra de `toClientQuestion`, lib/quiz-selection.ts) nem indicar
 * visualmente qual alternativa é a correta: uma questão do banco pode ser
 * sorteada para o quiz real de um visitante, e a landing não pode
 * "entregar o gabarito" antes da prova.
 */
export interface EvidenceQuestion {
  id: string;
  category: KnowledgeCategory;
  question: string;
  options: Option[];
}

/** Busca uma pergunta do banco pelo id e devolve só o que é seguro exibir (nunca correctOptionId). */
export function getEvidenceQuestion(id: string): EvidenceQuestion {
  const found = questionsBank.find((q) => q.id === id);
  if (!found || found.type !== 'knowledge') {
    throw new Error(
      `getEvidenceQuestion: pergunta "${id}" não encontrada ou não é do tipo knowledge`,
    );
  }
  return {
    id: found.id,
    category: found.category as KnowledgeCategory,
    question: found.question,
    options: found.options,
  };
}

/** Trecho real de `explanation` do banco — prova de que o gabarito comentado é substância, não enfeite. */
export function getEvidenceExplanation(id: string): string {
  const found = questionsBank.find((q) => q.id === id);
  if (!found?.explanation) {
    throw new Error(`getEvidenceExplanation: pergunta "${id}" não encontrada ou sem explanation`);
  }
  return found.explanation;
}

/** Quantidade real de itens do banco para uma dimensão — número do blueprint, nunca um valor inventado. */
export function countBankItemsByCategory(category: KnowledgeCategory): number {
  return questionsBank.filter((q) => q.type === 'knowledge' && q.category === category).length;
}
