/**
 * Link de inscrição na newsletter com atribuição (Épico 42). Cai em /subscribe,
 * não na home da publicação, e leva UTMs para o Substack registrar a origem.
 * Nunca recebe e-mail: o endereço iria para a URL de página vista pelo Pixel
 * e pelo GA4 do próprio Substack.
 *
 * `posicao` identifica o botão: resultado, newsletter-hero, newsletter-meio,
 * newsletter-final, newsletter-header.
 */
export function substackSubscribeUrl(posicao: string): string {
  const url = new URL('https://syntaxis.substack.com/subscribe');
  url.searchParams.set('utm_source', 'skill-check');
  url.searchParams.set('utm_medium', 'app');
  url.searchParams.set('utm_campaign', 'diagnostico');
  url.searchParams.set('utm_content', posicao);
  return url.toString();
}
