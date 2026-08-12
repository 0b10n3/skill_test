'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { getConsent, subscribeToConsent, type ConsentValue } from '@/lib/analytics/consent';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/**
 * Dispara um page_view (GA4) / PageView (Meta) a cada troca de rota via SPA
 * navigation — o `gtag('config', ...)`/`fbq('init', ...)` inicial só cobre o
 * primeiro carregamento real de página (epico-21 §"Instalação GA4":
 * "send_page_view automático nas 4 rotas, SPA navigation incluída").
 */
function PageviewTracker() {
  const pathname = usePathname();
  // A primeira rota já é coberta pelo `gtag('config', ...)`/`fbq('track',
  // 'PageView')` do script de inicialização — só as trocas de rota
  // seguintes (SPA navigation) precisam do evento manual, senão a
  // primeira página conta pageview em dobro.
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.gtag?.('event', 'page_view', { page_path: pathname });
    window.fbq?.('track', 'PageView');
  }, [pathname]);

  return null;
}

/**
 * GA4 + Meta Pixel atrás de consentimento (Épico 21, LGPD): nada é montado
 * — logo, nenhuma requisição de rede sai — enquanto `getConsent() !==
 * 'granted'`. Não implementamos o par completo "consent default
 * denied/update" do Google Consent Mode v2 porque o efeito prático é
 * idêntico e mais simples de auditar: em vez de carregar o gtag.js sempre e
 * bloquear storage via `consent: 'default'`, simplesmente não carregamos
 * script nenhum antes do aceite (coberto por teste E2E interceptando
 * rede — nenhuma chamada a Google/Meta sem consentimento).
 */
export function AnalyticsProvider() {
  const [consent, setConsentState] = useState<ConsentValue>('unset');

  useEffect(() => {
    setConsentState(getConsent());
    return subscribeToConsent(setConsentState);
  }, []);

  const granted = consent === 'granted';
  const hasIds = Boolean(GA_MEASUREMENT_ID || META_PIXEL_ID);

  if (!granted || !hasIds) return null;

  return (
    <>
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'granted' });
              gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: true });`}
          </Script>
        </>
      )}
      {META_PIXEL_ID && (
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
              n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
              document,'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');`}
        </Script>
      )}
      <PageviewTracker />
    </>
  );
}
