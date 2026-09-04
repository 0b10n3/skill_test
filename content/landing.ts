import type { KnowledgeCategory } from '@/lib/types';

/**
 * Promessa de suporte da landing — DESIGN.md §1.3, verbatim. Nunca
 * substituir por formulação genérica ("aprenda finanças", "domine
 * investimentos") nem por número de salário/promoção que a Syntaxis não
 * controla (regra de verificabilidade, mesma seção).
 */
export const HERO_PROMISE =
  'Skills e ferramentas de trabalho real — incluindo IA — para o próximo nível da sua carreira.';

/**
 * Seção "o que o diagnóstico avalia" (Épico 17) — descrição neutra de
 * cada dimensão, ANTES do quiz (sem framing de resultado/score, ao
 * contrário de RADAR_SUMMARY/SCORE_CARD_COPY em content/relatorio.ts).
 */
export const DIMENSAO_LANDING_DESCRICAO: Record<KnowledgeCategory, string> = {
  'mercados-produtos':
    'Renda fixa, crédito e a leitura de produtos que sustentam qualquer mesa — não a definição de manual, mas como o produto se comporta na prática.',
  'matematica-quant':
    'Duration, convexidade, estatística aplicada — o ferramental quantitativo que separa quem calcula risco de quem só repete jargão.',
  'dados-programacao':
    'SQL, Python e pipeline de dados como ferramenta de trabalho, não curiosidade — hoje já esperado de qualquer analista.',
  'ia-aplicada':
    'Onde a IA de fato ajuda na rotina de mercado, e onde só parece ajudar — critério, não hype.',
  'risco-regulacao':
    'Marcação a mercado, governança e o arcabouço regulatório brasileiro (CVM, BCB, ANBIMA) que qualquer decisão real precisa respeitar.',
};

/**
 * Slug do asset gerado (Épico 16) por dimensão — só as dimensões com
 * asset aprovado e publicado aparecem aqui. dimensao-matematica-quant e
 * dimensao-dados-programacao ficam de fora até serem regeneradas (achado
 * de marca: Amber fora de contexto de conquista, ver PR #20) — a seção
 * usa esse mapa parcial para decidir onde mostrar imagem e onde mostrar
 * só o texto, sem quebrar quando as duas faltantes forem publicadas.
 */
export const DIMENSAO_ASSET_SLUG: Partial<Record<KnowledgeCategory, string>> = {
  'mercados-produtos': 'dimensao-mercados-produtos',
  'ia-aplicada': 'dimensao-ia-aplicada',
  'risco-regulacao': 'dimensao-risco-regulacao',
};

/**
 * Faixa de números da landing (DESIGN.md v1.1 §4.4.5) — cada item vira um
 * bloco `statNumber` (IBM Plex Mono) individual, não uma única linha de texto.
 * Os 5 níveis são os `SeniorityLevel` reais do produto (aspirante,
 * estagiário, júnior, pleno, sênior — lib/types.ts).
 */
export const METODO_STATS_ITEMS: { value: string; label: string }[] = [
  { value: '15', label: 'questões' },
  { value: '5', label: 'dimensões' },
  { value: '5', label: 'níveis' },
];
