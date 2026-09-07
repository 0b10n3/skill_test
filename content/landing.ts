/**
 * Promessa de suporte da landing — DESIGN.md §1.3, verbatim. Nunca
 * substituir por formulação genérica ("aprenda finanças", "domine
 * investimentos") nem por número de salário/promoção que a Syntaxis não
 * controla (regra de verificabilidade, mesma seção).
 */
export const HERO_PROMISE =
  'Skills e ferramentas de trabalho real — incluindo IA — para o próximo nível da sua carreira.';

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
