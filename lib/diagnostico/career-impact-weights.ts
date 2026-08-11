import type { KnowledgeCategory, SeniorityLevel } from '@/lib/types';

/**
 * Peso de impacto de cada dimensão para o próximo degrau de carreira, por
 * nível declarado — fonte: AVALIACAO.md §5.3 (matriz "Dimensão × nível
 * atual → nível seguinte"). Cada nível soma 1.00; a coluna do nível
 * representa a importância da dimensão para a *promoção a partir dele*,
 * não para o desempenho no nível atual.
 */
export const CAREER_IMPACT_WEIGHT: Record<SeniorityLevel, Record<KnowledgeCategory, number>> = {
  aspirante: {
    'mercados-produtos': 0.3,
    'matematica-quant': 0.25,
    'dados-programacao': 0.2,
    'ia-aplicada': 0.1,
    'risco-regulacao': 0.15,
  },
  estagiario: {
    'mercados-produtos': 0.25,
    'matematica-quant': 0.25,
    'dados-programacao': 0.25,
    'ia-aplicada': 0.1,
    'risco-regulacao': 0.15,
  },
  junior: {
    'mercados-produtos': 0.2,
    'matematica-quant': 0.25,
    'dados-programacao': 0.25,
    'ia-aplicada': 0.15,
    'risco-regulacao': 0.15,
  },
  pleno: {
    'mercados-produtos': 0.15,
    'matematica-quant': 0.2,
    'dados-programacao': 0.25,
    'ia-aplicada': 0.2,
    'risco-regulacao': 0.2,
  },
  senior: {
    'mercados-produtos': 0.15,
    'matematica-quant': 0.15,
    'dados-programacao': 0.2,
    'ia-aplicada': 0.25,
    'risco-regulacao': 0.25,
  },
};
