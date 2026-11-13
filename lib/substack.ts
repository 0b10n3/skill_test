/**
 * Links para o Substack com atribuição (Épico 42). Nunca recebem e-mail: o
 * endereço iria para a URL de página vista pelo Pixel e pelo GA4 do próprio
 * Substack.
 *
 * `posicao` identifica o botão ou link: resultado, newsletter-hero,
 * newsletter-meio, newsletter-final, newsletter-header, post-<n>.
 */
export function comUtm(url: string, posicao: string): string {
  const destino = new URL(url);
  destino.searchParams.set('utm_source', 'skill-check');
  destino.searchParams.set('utm_medium', 'app');
  destino.searchParams.set('utm_campaign', 'diagnostico');
  destino.searchParams.set('utm_content', posicao);
  return destino.toString();
}

/** Inscrição: cai em /subscribe, não na home da publicação. */
export function substackSubscribeUrl(posicao: string): string {
  return comUtm('https://syntaxis.substack.com/subscribe', posicao);
}
