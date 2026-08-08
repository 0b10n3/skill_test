import type { Classification } from '@/lib/types';

export interface Offer {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

/**
 * Conteúdo definido em prompt-syntaxis-skill-check.md, seção 6 — os textos e
 * links reais de cada oferta ainda não foram fornecidos; os placeholders
 * abaixo são exatamente os marcados na especificação, não inventados aqui.
 */
export const offers: Record<Classification, Offer> = {
  baixo: {
    title: 'Comece pelo essencial',
    description: '[placeholder] curso introdutório gratuito da Syntaxis',
    ctaLabel: 'Começar grátis',
    ctaHref: '[placeholder-link]',
  },
  medio: {
    title: 'Avance na trilha técnica',
    description: '[placeholder] curso pago da Syntaxis',
    ctaLabel: 'Ver curso',
    ctaHref: '[placeholder-link]',
  },
  alto: {
    title: 'Você está pronto para o próximo nível',
    description: '[placeholder] mentoria avançada Syntaxis',
    ctaLabel: 'Aplicar para mentoria',
    ctaHref: '[placeholder-link]',
  },
};
