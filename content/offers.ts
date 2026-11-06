import type { Classification } from '@/lib/types';

export interface Offer {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

/**
 * Decisão de 05/11/2026 (`strategy/DECISOES_2026-11.md`, decisões 11 e 12): o
 * Skill Check é captura gratuita e convida os leads ao Substack. Enquanto a
 * isca e o FVDT não estão à venda, a newsletter é a única oferta disponível.
 */
const newsletter = {
  description:
    'A newsletter da Syntaxis conecta instrumentos financeiros ao dia a dia do mercado brasileiro e à progressão de carreira, com rigor e sem hype. É gratuita.',
  ctaLabel: 'Assinar a newsletter',
  ctaHref: 'https://syntaxis.substack.com',
};

export const offers: Record<Classification, Offer> = {
  baixo: { title: 'Comece pelo essencial', ...newsletter },
  medio: { title: 'Siga reforçando a base técnica', ...newsletter },
  alto: { title: 'Continue aprofundando', ...newsletter },
};
