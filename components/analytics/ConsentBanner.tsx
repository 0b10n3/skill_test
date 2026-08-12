'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getConsent, setConsent } from '@/lib/analytics/consent';

// /quiz e /lead são telas de tarefa única em viewport fixo (h-dvh, sem
// scroll — regra do app desde o Épico 4/5), com o CTA principal
// frequentemente perto do rodapé. Um banner fixo no rodapé colidiria
// visualmente com esse botão (achado real: "Próxima" ficava inacessível
// em 375px) — "foco absoluto na tarefa" (epico-20) também vale para
// consentimento. O consentimento é resolvido na landing (`/`) antes do
// visitante entrar no quiz, na esmagadora maioria dos casos; se ele pular
// direto para o quiz, o banner volta a aparecer em `/resultado`.
const ROUTES_WITHOUT_BANNER = ['/quiz', '/lead'];

/**
 * Banner de consentimento LGPD (Épico 21): aparece só enquanto o
 * consentimento está "unset" — recusar não é um estado transitório, é uma
 * escolha persistida (`setConsent('denied')`), tão definitiva quanto
 * aceitar, até o usuário revisitar a preferência (ver Rodapé — link "gerir
 * preferências" ainda não tem uma página própria, ver GOLIVE.md).
 */
export function ConsentBanner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getConsent() === 'unset');
  }, []);

  if (!visible || ROUTES_WITHOUT_BANNER.includes(pathname)) return null;

  function handleChoice(value: 'granted' | 'denied') {
    setConsent(value);
    setVisible(false);
  }

  return (
    <div
      role="region"
      aria-label="Consentimento de cookies e analytics"
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4"
    >
      <div className="flex w-full max-w-2xl flex-col gap-3 rounded-sm border border-border bg-card p-4 text-sm shadow-syntaxis sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <p className="text-foreground">
          Usamos analytics para entender como o diagnóstico é usado. Nenhum dado pessoal é
          compartilhado antes do seu aceite — veja nossa{' '}
          <Link href="/privacidade" className="text-link-foreground underline underline-offset-2">
            política de privacidade
          </Link>
          .
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleChoice('denied')}>
            Recusar
          </Button>
          <Button variant="default" size="sm" onClick={() => handleChoice('granted')}>
            Aceitar
          </Button>
        </div>
      </div>
    </div>
  );
}
