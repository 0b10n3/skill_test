/**
 * Camada única de tracking (Épico 21, DESIGN.md/epico-21 §"Testes
 * obrigatórios"): componentes nunca chamam `gtag`/`fbq` diretamente, só
 * `track(evento, params)` — mantém a taxonomia consistente entre GA4 e Meta
 * e torna trocar/adicionar destinos um PR pequeno (lib/analytics/track.ts
 * é o único lugar que conhece os dois SDKs).
 *
 * Regra de privacidade dura: nenhum parâmetro de evento pode conter PII
 * (nome, e-mail, telefone) — a lista de chaves proibidas é verificada em
 * runtime; uma chave proibida é removida do payload (nunca derruba o
 * evento inteiro) e reportada via console.error, para que o problema
 * apareça em desenvolvimento/QA sem quebrar a experiência do usuário real.
 */

export type FunnelEvent =
  | 'quiz_start'
  | 'question_answered'
  | 'quiz_complete'
  | 'lead_submitted'
  | 'report_viewed'
  | 'cta_offer_click'
  | 'radar_shared';

export type TrackParams = Record<string, string | number | boolean>;

interface EventMapping {
  /** Nome do evento no GA4 — sempre disparado (evento custom, salvo quando documentado como padrão GA4). */
  ga4: string;
  /** Nome do evento no Meta Pixel, ou `null` quando a taxonomia não prevê disparo no Meta (ex.: question_answered). */
  meta: string | null;
  /** true quando `meta` é um evento padrão do Meta (ex.: "Lead") — despachado via `fbq('track', ...)` em vez de `fbq('trackCustom', ...)`. */
  metaStandard?: boolean;
}

/**
 * Taxonomia do funil (epico-21-seo-analytics-pixel.md, tabela de eventos):
 * nomes canônicos e para onde cada um vai. `lead_submitted` é o único
 * mapeado para eventos padrão nas duas plataformas (generate_lead/Lead) —
 * "habilita otimização de campanha" no Meta. `quiz_start` usa nome custom
 * neutro no Meta em vez de "InitiateCheckout" (a spec permite: "custom se
 * preferir neutralidade") — o produto não é e-commerce.
 */
const EVENT_MAP: Record<FunnelEvent, EventMapping> = {
  quiz_start: { ga4: 'quiz_start', meta: 'quiz_start' },
  question_answered: { ga4: 'question_answered', meta: null },
  quiz_complete: { ga4: 'quiz_complete', meta: 'quiz_complete' },
  lead_submitted: { ga4: 'generate_lead', meta: 'Lead', metaStandard: true },
  report_viewed: { ga4: 'report_viewed', meta: 'report_viewed' },
  cta_offer_click: { ga4: 'cta_offer_click', meta: 'cta_offer_click' },
  radar_shared: { ga4: 'radar_shared', meta: 'radar_shared' },
};

// Chaves de parâmetro que nunca podem sair do dispositivo do usuário —
// comparação case-insensitive, cobre PT e EN (o codebase mistura os dois
// em nomes de campo: `participantName`, `leadEmail`, `nome`, `telefone`).
const PII_KEY_DENYLIST = [
  'name',
  'nome',
  'participantname',
  'email',
  'e-mail',
  'leademail',
  'phone',
  'telefone',
  'cpf',
  'address',
  'endereco',
  'endereço',
];

// Backstop por formato de valor — mesmo uma chave "segura" (ex.: `contato`)
// não deve conseguir carregar um e-mail se alguém errar na chamada.
const EMAIL_LIKE_VALUE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isPiiKey(key: string): boolean {
  return PII_KEY_DENYLIST.includes(key.toLowerCase());
}

/** Remove chaves/valores de PII de um payload de evento — nunca lança, sempre devolve um payload seguro de enviar. */
export function sanitizeParams(params: TrackParams | undefined): TrackParams {
  if (!params) return {};

  const safe: TrackParams = {};
  for (const [key, value] of Object.entries(params)) {
    const isPii = isPiiKey(key) || (typeof value === 'string' && EMAIL_LIKE_VALUE.test(value));
    if (isPii) {
      console.error(
        `[analytics] track(): parâmetro "${key}" descartado — parece conter PII e nunca deve ir para GA4/Meta.`,
      );
      continue;
    }
    safe[key] = value;
  }
  return safe;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Único ponto de disparo de evento de analytics do produto. Não faz nada
 * (silenciosamente) se `gtag`/`fbq` ainda não existirem — é exatamente o
 * estado antes do consentimento (components/analytics/AnalyticsProvider
 * só define essas funções depois do aceite), então nenhuma chamada aqui
 * precisa checar consentimento por conta própria.
 */
export function track(event: FunnelEvent, params?: TrackParams): void {
  if (typeof window === 'undefined') return;

  const mapping = EVENT_MAP[event];
  const safeParams = sanitizeParams(params);

  window.gtag?.('event', mapping.ga4, safeParams);

  if (mapping.meta) {
    const method = mapping.metaStandard ? 'track' : 'trackCustom';
    window.fbq?.(method, mapping.meta, safeParams);
  }
}
