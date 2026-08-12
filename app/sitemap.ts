import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site-url';

/**
 * sitemap.xml gerado pelo framework (Épico 21). Só `/` entra — `/quiz`,
 * `/lead` e `/resultado` são `noindex` (conteúdo transacional/pessoal, ver
 * robots.ts e o `metadata.robots` de cada rota) e nunca deveriam aparecer
 * num sitemap, mesmo `noindex`: um sitemap é uma lista de "páginas que
 * queremos indexadas", não um mapa completo de rotas.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: getSiteUrl(),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
