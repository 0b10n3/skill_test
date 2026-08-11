import { CAREER_IMPACT_WEIGHT } from './career-impact-weights';
import type {
  DimensaoDiagnostico,
  DimensionEtiqueta,
  Diagnostico,
  PrioridadeDimensao,
  RespostaItemDiagnostico,
} from './types';
import type {
  AnswerMap,
  Classification,
  KnowledgeCategory,
  Question,
  SeniorityLevel,
} from '@/lib/types';

const FORTE_THRESHOLD = 0.67;
const ATENCAO_THRESHOLD = 0.33;
const MAX_SELECTED_DIMENSIONS = 2;

/**
 * Ordem canônica das dimensões — mesma ordem de content/relatorio.ts
 * (CATEGORY_LABEL) e career-impact-weights.ts. `dimensoes`/`prioridades`
 * precisam ser deterministas para um mesmo perfil de score: sem isso, a
 * ordem herdava a sequência embaralhada de perguntas da sessão
 * (lib/quiz-selection.ts), fazendo os cards de dimensão/prioridade
 * trocarem de posição entre sessões com notas idênticas (achado real ao
 * baselinar o teste visual de /resultado no Épico 18).
 */
const CATEGORY_ORDER: readonly KnowledgeCategory[] = [
  'mercados-produtos',
  'matematica-quant',
  'dados-programacao',
  'ia-aplicada',
  'risco-regulacao',
];

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function scoreToEtiqueta(score: number): DimensionEtiqueta {
  if (score >= FORTE_THRESHOLD) return 'forte';
  if (score <= ATENCAO_THRESHOLD) return 'atencao';
  return 'neutro';
}

function computeDimensoes(
  respostas: AnswerMap,
  knowledgeQuestions: Question[],
): DimensaoDiagnostico[] {
  const categoriesPresent = new Set(knowledgeQuestions.map((q) => q.category));
  const categories = CATEGORY_ORDER.filter((category) => categoriesPresent.has(category));

  return categories.map((category) => {
    const items = knowledgeQuestions.filter((q) => q.category === category);
    const acertos = items.filter(
      (q) => respostas[q.id] !== undefined && respostas[q.id] === q.correctOptionId,
    ).length;
    const total = items.length;
    const score = total === 0 ? 0 : round(acertos / total, 2);

    return { category, acertos, total, score, etiqueta: scoreToEtiqueta(score) };
  });
}

/**
 * Classificação global — AVALIACAO.md §5.2. As faixas são definidas em
 * percentual (≥80% alto, 47–79% médio, ≤46% baixo); o percentual é
 * arredondado antes de comparar para não deixar a fronteira sensível a
 * erro de ponto flutuante (ex.: 7/15 = 46.66...% deve cair em "médio",
 * não em "baixo").
 */
function classifyDiagnostico(acertos: number, totalQuestoes: number): Classification {
  const percentage = totalQuestoes === 0 ? 0 : Math.round((acertos / totalQuestoes) * 100);
  if (percentage >= 80) return 'alto';
  if (percentage >= 47) return 'medio';
  return 'baixo';
}

/**
 * Desempate por peso de impacto (AVALIACAO.md §5.5: "empate: maior peso de
 * impacto primeiro"), aplicado simetricamente a fortes e a pontos de
 * atenção. `ranking` já vem ordenado (melhor-primeiro para fortes,
 * pior-primeiro para atenção); dentro de cada lista, o desempate por peso
 * segue a mesma direção (maior peso primeiro).
 */
function selectByThreshold(
  dimensoes: DimensaoDiagnostico[],
  weights: Record<KnowledgeCategory, number>,
  qualifies: (score: number) => boolean,
  order: 'melhor-primeiro' | 'pior-primeiro',
): KnowledgeCategory[] {
  const direction = order === 'melhor-primeiro' ? -1 : 1;
  const ranking = [...dimensoes].sort((a, b) => {
    const byScore = direction * (a.score - b.score);
    if (byScore !== 0) return byScore;
    return weights[b.category] - weights[a.category];
  });

  const qualifying = ranking.filter((d) => qualifies(d.score)).slice(0, MAX_SELECTED_DIMENSIONS);

  // Nunca vazio: se nenhuma dimensão cruza o limiar (ex.: todas empatadas
  // fora da faixa), cai no topo do ranking geral como única selecionada.
  const selected = qualifying.length > 0 ? qualifying : [ranking[0]];
  return selected.map((d) => d.category);
}

function computePrioridades(
  dimensoes: DimensaoDiagnostico[],
  weights: Record<KnowledgeCategory, number>,
): PrioridadeDimensao[] {
  return dimensoes
    .map((d) => ({
      category: d.category,
      prioridade: round((1 - d.score) * weights[d.category], 4),
    }))
    .sort((a, b) => b.prioridade - a.prioridade);
}

function computeRespostas(
  respostas: AnswerMap,
  knowledgeQuestions: Question[],
): RespostaItemDiagnostico[] {
  return knowledgeQuestions.map((question) => {
    const optionId = respostas[question.id];
    return {
      questionId: question.id,
      category: question.category as KnowledgeCategory,
      optionId,
      correct: optionId !== undefined && optionId === question.correctOptionId,
    };
  });
}

/** Tema curto derivado do enunciado da questão — nunca "você errou a questão X". */
function deriveTopic(question: Question): string {
  const cleaned = question.question.trim().replace(/[?:.]+$/, '');
  return cleaned.length > 90 ? `${cleaned.slice(0, 87)}...` : cleaned;
}

function computeTopicosParaRevisar(
  atencao: KnowledgeCategory[],
  respostasVector: RespostaItemDiagnostico[],
  knowledgeQuestions: Question[],
): string[] {
  const atencaoSet = new Set(atencao);
  const topics = respostasVector
    .filter((r) => !r.correct && atencaoSet.has(r.category))
    .map((r) => {
      const question = knowledgeQuestions.find((q) => q.id === r.questionId);
      return question ? deriveTopic(question) : null;
    })
    .filter((topic): topic is string => topic !== null);

  return [...new Set(topics)];
}

/**
 * Motor de diagnóstico (Épico 11) — função pura: transforma as respostas de
 * conhecimento de uma sessão em score por dimensão, classificação global,
 * pontos fortes/atenção e ranking de prioridade de desenvolvimento.
 * `banco` é a lista de perguntas (com gabarito) efetivamente respondidas na
 * sessão. Fonte: AVALIACAO.md §5.
 */
export function computeDiagnostico(
  respostas: AnswerMap,
  nivel: SeniorityLevel,
  banco: Question[],
): Diagnostico {
  const knowledgeQuestions = banco.filter((q) => q.type === 'knowledge');
  const weights = CAREER_IMPACT_WEIGHT[nivel];

  const dimensoes = computeDimensoes(respostas, knowledgeQuestions);
  const acertos = dimensoes.reduce((sum, d) => sum + d.acertos, 0);
  const totalQuestoes = dimensoes.reduce((sum, d) => sum + d.total, 0);
  const scoreGlobal = totalQuestoes === 0 ? 0 : round(acertos / totalQuestoes, 2);
  const classificacao = classifyDiagnostico(acertos, totalQuestoes);

  const fortes = selectByThreshold(
    dimensoes,
    weights,
    (score) => score >= FORTE_THRESHOLD,
    'melhor-primeiro',
  );
  const atencao = selectByThreshold(
    dimensoes,
    weights,
    (score) => score <= ATENCAO_THRESHOLD,
    'pior-primeiro',
  );

  const prioridades = computePrioridades(dimensoes, weights);
  const respostasVector = computeRespostas(respostas, knowledgeQuestions);
  const topicosParaRevisar = computeTopicosParaRevisar(
    atencao,
    respostasVector,
    knowledgeQuestions,
  );

  return {
    scoreGlobal,
    acertos,
    totalQuestoes,
    classificacao,
    dimensoes,
    fortes,
    atencao,
    prioridades,
    topicosParaRevisar,
    respostas: respostasVector,
  };
}
