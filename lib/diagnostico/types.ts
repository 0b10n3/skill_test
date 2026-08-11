import type { Classification, KnowledgeCategory } from '@/lib/types';

export type DimensionEtiqueta = 'forte' | 'neutro' | 'atencao';

export interface DimensaoDiagnostico {
  category: KnowledgeCategory;
  acertos: number;
  total: number;
  /** Fração de acertos na dimensão, arredondada a 2 casas (AVALIACAO.md §5.1: 0, 0.33, 0.67, 1). */
  score: number;
  etiqueta: DimensionEtiqueta;
}

export interface PrioridadeDimensao {
  category: KnowledgeCategory;
  /** (1 − score) × pesoDeImpacto[nível][dimensão] — AVALIACAO.md §5.4. */
  prioridade: number;
}

export interface RespostaItemDiagnostico {
  questionId: string;
  category: KnowledgeCategory;
  optionId: string | undefined;
  correct: boolean;
}

export interface Diagnostico {
  scoreGlobal: number;
  acertos: number;
  totalQuestoes: number;
  classificacao: Classification;
  dimensoes: DimensaoDiagnostico[];
  /** 1–2 dimensões, nunca vazio — AVALIACAO.md §5.5. */
  fortes: KnowledgeCategory[];
  /** 1–2 dimensões, nunca vazio — AVALIACAO.md §5.5. */
  atencao: KnowledgeCategory[];
  /** As 5 dimensões, ordenadas por prioridade decrescente. */
  prioridades: PrioridadeDimensao[];
  /** Temas das questões erradas nas dimensões de atenção — nunca "questão X". */
  topicosParaRevisar: string[];
  /** Vetor item-a-item, para telemetria (AVALIACAO.md §6 / Épico 13). */
  respostas: RespostaItemDiagnostico[];
}
