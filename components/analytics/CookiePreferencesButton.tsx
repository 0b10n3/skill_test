'use client';

import { resetConsent } from '@/lib/analytics/consent';

/** Rodapé (Épico 42): reabre a escolha de cookies. O reload tira scripts já carregados e traz o banner de volta. */
export function CookiePreferencesButton() {
  return (
    <button
      type="button"
      className="text-left text-foreground hover:underline"
      onClick={() => {
        resetConsent();
        window.location.reload();
      }}
    >
      Preferências de cookies
    </button>
  );
}
