import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site-url';

/**
 * robots.txt gerado pelo framework (Épico 21). Coerente com as regras de
 * indexação da spec: só `/` é rastreável — `/quiz`, `/lead`, `/resultado`
 * (conteúdo transacional/pessoal) e `/api` ficam de fora, reforçando a
 * meta `robots: noindex` de cada rota (defesa em profundidade — um
 * crawler que ignore `noindex` ainda encontra o disallow aqui).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/quiz', '/lead', '/resultado', '/api', '/dev'],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
