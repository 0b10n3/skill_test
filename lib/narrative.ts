import type { CategoryScore, Classification, ResultNarrative } from './types';

/**
 * ⚠️ PLACEHOLDER — copy provisória, não é texto de marca final.
 *
 * Este módulo é o cálculo/narrativa "antigo" (pré-diagnóstico v2), mantido
 * de propósito neste épico — o motor de diagnóstico completo (scores por
 * dimensão, prioridades de carreira, pontos fortes/fracos) é o Épico 11, e
 * o relatório que o substitui de vez é o Épico 12 (ver REPORT.md).
 */
const CLASSIFICATION_HEADLINE: Record<Classification, string> = {
  baixo: 'Você está no começo da jornada técnica',
  medio: 'Você já tem uma base técnica sólida',
  alto: 'Você domina bem o conteúdo avaliado',
};

export function buildResultNarrative(params: {
  classification: Classification;
  scorePorCategoria: CategoryScore[];
}): ResultNarrative {
  const headline = CLASSIFICATION_HEADLINE[params.classification];

  const dadosProgramacao = params.scorePorCategoria.find(
    (category) => category.category === 'dados-programacao',
  );
  const iaAplicada = params.scorePorCategoria.find(
    (category) => category.category === 'ia-aplicada',
  );

  const bodyParts: string[] = [];

  if (dadosProgramacao && iaAplicada) {
    bodyParts.push(
      `Em dados e programação você acertou ${dadosProgramacao.correct} de ${dadosProgramacao.total}, e em IA aplicada, ${iaAplicada.correct} de ${iaAplicada.total}.`,
    );
  }

  return { headline, body: bodyParts.join(' ') };
}
