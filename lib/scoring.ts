import type {
  AnswerMap,
  CategoryScore,
  Classification,
  KnowledgeCategory,
  Question,
  ScoreResult,
} from './types';

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

function percentage(correct: number, total: number): number {
  if (total === 0) return 0;
  return roundToTwoDecimals((correct / total) * 100);
}

/**
 * Régua única de classificação (seção 4.3 da especificação v2): a mesma faixa
 * para todos os níveis de senioridade, já que a dificuldade do conteúdo é
 * calibrada por targetSeniority, não por um corte diferente por nível.
 * Baixo: 0–39% | Médio: 40–69% | Alto: 70–100%
 */
export function classifyScore(scorePercentage: number): Classification {
  if (scorePercentage < 40) return 'baixo';
  if (scorePercentage < 70) return 'medio';
  return 'alto';
}

/**
 * Calcula o score sempre a partir do gabarito do servidor — `answers` nunca é
 * uma fonte de confiança para o resultado, apenas para saber o que foi marcado.
 * `questionsBank` deve ser a versão interna completa (com correctOptionId) das
 * perguntas de conhecimento apresentadas na sessão sendo avaliada.
 */
export function calculateScore(answers: AnswerMap, questionsBank: Question[]): ScoreResult {
  const knowledgeQuestions = questionsBank.filter((question) => question.type === 'knowledge');

  const categories = [...new Set(knowledgeQuestions.map((q) => q.category))] as KnowledgeCategory[];

  const scorePorCategoria: CategoryScore[] = categories.map((category) => {
    const questionsInCategory = knowledgeQuestions.filter((q) => q.category === category);
    const correct = questionsInCategory.filter(
      (q) => answers[q.id] !== undefined && answers[q.id] === q.correctOptionId,
    ).length;

    return {
      category,
      correct,
      total: questionsInCategory.length,
      percentage: percentage(correct, questionsInCategory.length),
    };
  });

  const totalCorrect = scorePorCategoria.reduce((sum, cat) => sum + cat.correct, 0);
  const totalQuestions = knowledgeQuestions.length;
  const scoreGeral = percentage(totalCorrect, totalQuestions);

  return {
    scoreGeral,
    scorePorCategoria,
    classification: classifyScore(scoreGeral),
  };
}
