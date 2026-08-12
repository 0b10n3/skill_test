/**
 * Consentimento LGPD para analytics/ads (Épico 21) — nos moldes do Google
 * Consent Mode v2: `analytics_storage`/`ad_storage` negados por padrão,
 * persistidos e revogáveis. GA4/Meta Pixel só carregam depois do aceite
 * explícito (components/analytics/AnalyticsProvider.tsx) — a escolha
 * "unset" nunca é tratada como aceite implícito.
 */

export type ConsentValue = 'granted' | 'denied' | 'unset';

const STORAGE_KEY = 'syntaxis-consent';
const CONSENT_EVENT = 'syntaxis-consent-change';

export function getConsent(): ConsentValue {
  if (typeof window === 'undefined') return 'unset';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'granted' || stored === 'denied' ? stored : 'unset';
}

/** Persiste a escolha e notifica os ouvintes na mesma aba (storage events só disparam em outras abas). */
export function setConsent(value: 'granted' | 'denied'): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, value);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

/** Assina mudanças de consentimento (aceite/recusa/revogação) — devolve a função de cleanup. */
export function subscribeToConsent(listener: (value: ConsentValue) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = (event: Event) => {
    listener((event as CustomEvent<ConsentValue>).detail);
  };
  window.addEventListener(CONSENT_EVENT, handler);
  return () => window.removeEventListener(CONSENT_EVENT, handler);
}
