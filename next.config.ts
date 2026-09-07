import type { NextConfig } from 'next';

// Épico 36 (revisão de segurança) — cabeçalhos de resposta ausentes até
// então: nenhum era enviado, nem os que a Vercel não define por padrão.
// Content-Security-Policy fica fora desta lista de propósito: os scripts
// inline de GA4/Meta Pixel (components/analytics/AnalyticsProvider.tsx)
// exigiriam 'unsafe-inline' (esvazia boa parte do valor de CSP contra XSS)
// ou nonce por requisição via middleware (mudança estrutural maior) — ver
// specs/epicos/epico-36-revisao-seguranca.md, decisão em aberto.
const securityHeaders = [
  // Navegador não deve advinhar o tipo de um arquivo por conteúdo — mitiga
  // ataques de MIME-sniffing (ex.: um upload sendo interpretado como JS).
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Este app nunca precisa ser embutido em <iframe> de outro site.
  { key: 'X-Frame-Options', value: 'DENY' },
  // Envia a origem completa só para requisições same-origin; cross-origin
  // recebe apenas o schema+host, nunca o path (pode carregar dado sensível
  // de query string, ex.: e-mail no referrer de um link externo).
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Nenhuma API de hardware sensível é usada nesta app.
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  // HSTS: força HTTPS por 2 anos, incluindo subdomínios; a Vercel já serve
  // só HTTPS, isto impede downgrade mesmo se um link http:// for seguido.
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
