'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/eyebrow';
import { ShareRadarButton } from '@/components/result/ShareRadarButton';
import type { Diagnostico } from '@/lib/diagnostico';
import type { SeniorityLevel } from '@/lib/types';

interface SaveShareRowProps {
  diagnostico: Diagnostico;
  seniority: SeniorityLevel;
  participantName: string;
  leadEmail: string | null;
}

type ResendStatus = 'idle' | 'enviando' | 'enviado' | 'erro';

/**
 * Guardar e compartilhar (Épico 43): reenvio por e-mail (mesma chamada e
 * payload de antes — MailerLite fora de escopo), card do radar e impressão.
 */
export function SaveShareRow({
  diagnostico,
  seniority,
  participantName,
  leadEmail,
}: SaveShareRowProps) {
  const [resendStatus, setResendStatus] = useState<ResendStatus>('idle');

  async function handleResend() {
    if (!leadEmail) return;
    setResendStatus('enviando');
    try {
      const response = await fetch('/api/resend-report', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: participantName,
          email: leadEmail,
          seniority,
          scoreGeral: diagnostico.scoreGlobal * 100,
          classification: diagnostico.classificacao,
        }),
      });
      setResendStatus(response.ok ? 'enviado' : 'erro');
    } catch {
      setResendStatus('erro');
    }
  }

  return (
    <section
      aria-labelledby="save-share-heading"
      className="flex w-full flex-col gap-3 print:hidden"
    >
      <h2 id="save-share-heading" className="sr-only">
        Guardar e compartilhar
      </h2>
      <Eyebrow>Guardar e compartilhar</Eyebrow>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button
          variant="outline"
          onClick={handleResend}
          disabled={!leadEmail || resendStatus === 'enviando'}
        >
          {resendStatus === 'enviado'
            ? 'Enviado!'
            : resendStatus === 'enviando'
              ? 'Enviando…'
              : 'Receber por e-mail'}
        </Button>
        <ShareRadarButton
          dimensoes={diagnostico.dimensoes}
          classificacao={diagnostico.classificacao}
        />
        <Button variant="outline" onClick={() => window.print()}>
          Salvar em PDF
        </Button>
      </div>
      {resendStatus === 'erro' && (
        <p role="alert" className="text-sm text-error-text">
          Não foi possível reenviar agora. Tente novamente em instantes.
        </p>
      )}
    </section>
  );
}
