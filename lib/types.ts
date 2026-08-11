import type { Diagnostico } from '@/lib/diagnostico';

export type QuestionType = 'seniority' | 'knowledge';

export type SeniorityLevel = 'aspirante' | 'estagiario' | 'junior' | 'pleno' | 'senior';

/**
 * As 5 dimensões de competência do banco v2 (AVALIACAO.md §3) — eixos do
 * radar de resultado e unidade de seleção do quiz (3 itens por dimensão).
 */
export type Category =
  | 'mercados-produtos'
  | 'matematica-quant'
  | 'dados-programacao'
  | 'ia-aplicada'
  | 'risco-regulacao'
  | 'perfil-senioridade';

export type KnowledgeCategory = Exclude<Category, 'perfil-senioridade'>;

export type Difficulty = 'easy' | 'medium' | 'hard';

/** Nível cognitivo do item (Bloom revisado), AVALIACAO.md §2.2. */
export type CognitiveLevel = 'compreender' | 'aplicar' | 'analisar';

export interface Option {
  id: string;
  text: string;
  profileTag?: string;
}

/**
 * Representação interna completa de uma pergunta, incluindo o gabarito.
 * Nunca deve ser enviada ao client antes da submissão — ver ClientQuestion.
 */
export interface Question {
  id: string;
  type: QuestionType;
  category: Category;
  difficultyLevel?: Difficulty;
  cognitiveLevel?: CognitiveLevel;
  targetSeniority?: SeniorityLevel[];
  question: string;
  options: Option[];
  correctOptionId?: string;
  explanation?: string;
}

/**
 * Versão segura para o client: nunca carrega correctOptionId, mesmo em runtime.
 * Construída explicitamente em lib/quiz-selection.ts (não é um cast de tipo).
 */
export type ClientQuestion = Omit<Question, 'correctOptionId'>;

export interface QuizSession {
  seniorityQuestion: ClientQuestion;
  knowledgeQuestions: ClientQuestion[];
}

export type AnswerMap = Record<string, string>;

export type Classification = 'baixo' | 'medio' | 'alto';

/**
 * Item do gabarito comentado (S6 do relatório) — só existe pós-submissão:
 * revelar o gabarito e a explicação aqui é o produto (revisão de prova),
 * não um vazamento (ClientQuestion, usado antes da submissão, nunca leva
 * correctOptionId).
 */
export interface QuestionReviewItem {
  questionId: string;
  category: KnowledgeCategory;
  question: string;
  options: Option[];
  selectedOptionId: string | undefined;
  correctOptionId: string;
  explanation: string;
  correct: boolean;
}

/** Shape retornado por POST /api/submit — o que /resultado (Épico 12) consome. */
export interface SubmitResult {
  seniority: SeniorityLevel;
  participantName: string;
  submittedAt: string;
  diagnostico: Diagnostico;
  gabarito: QuestionReviewItem[];
}
