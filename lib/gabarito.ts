import type { RespostaItemDiagnostico } from './diagnostico';
import type { Question, QuestionReviewItem } from './types';

/**
 * Monta o gabarito comentado (S6 do relatório) a partir do vetor
 * item-a-item já computado pelo motor de diagnóstico — evita recalcular
 * certo/errado duas vezes a partir de `answers`.
 */
export function buildGabarito(
  respostasVector: RespostaItemDiagnostico[],
  banco: Question[],
): QuestionReviewItem[] {
  return respostasVector.map((resposta) => {
    const question = banco.find((q) => q.id === resposta.questionId);
    if (!question || !question.correctOptionId || !question.explanation) {
      throw new Error(`Item de conhecimento incompleto no banco: "${resposta.questionId}"`);
    }

    return {
      questionId: resposta.questionId,
      category: resposta.category,
      question: question.question,
      options: question.options,
      selectedOptionId: resposta.optionId,
      correctOptionId: question.correctOptionId,
      explanation: question.explanation,
      correct: resposta.correct,
    };
  });
}
