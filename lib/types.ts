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

export interface CategoryScore {
  category: KnowledgeCategory;
  correct: number;
  total: number;
  percentage: number;
}

export interface ScoreResult {
  scoreGeral: number;
  scorePorCategoria: CategoryScore[];
  classification: Classification;
}

export interface ResultNarrative {
  headline: string;
  body: string;
}

/** Shape retornado por POST /api/submit — o que /resultado (Épico 8) consome. */
export interface SubmitResult extends ScoreResult {
  narrative: ResultNarrative;
}
