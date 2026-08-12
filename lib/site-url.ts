/**
 * URL canônica do domínio ativo — Vercel expõe a URL de produção real via
 * `VERCEL_PROJECT_PRODUCTION_URL` (estável entre deploys, ao contrário de
 * `VERCEL_URL`, que muda por deployment); cai para `VERCEL_URL` em preview
 * e para localhost fora da Vercel. Fonte única para metadataBase
 * (app/layout.tsx), sitemap.xml, robots.txt e JSON-LD — nunca hardcoded em
 * mais de um lugar (Épico 21).
 */
export function getSiteUrl(): string {
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}
