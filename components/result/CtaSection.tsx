'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eyebrow } from '@/components/ui/eyebrow';
import { OfferBlock } from '@/components/result/OfferBlock';
import { ShareRadarButton } from '@/components/result/ShareRadarButton';
import { CATEGORY_LABEL, CTA_HEADLINE } from '@/content/relatorio';
import type { Diagnostico } from '@/lib/diagnostico';
import type { SeniorityLevel } from '@/lib/types';

interface CtaSectionProps {
  diagnostico: Diagnostico;
  seniority: SeniorityLevel;
  participantName: string;
  leadEmail: string | null;
}

type ResendStatus = 'idle' | 'enviando' | 'enviado' | 'erro';

export function CtaSection({
  diagnostico,
  seniority,
  participantName,
  leadEmail,
}: CtaSectionProps) {
  const [resendStatus, setResendStatus] = useState<ResendStatus>('idle');
  const priorityCategory = diagnostico.prioridades[0].category;
  const headline = CTA_HEADLINE[seniority][diagnostico.classificacao](
    CATEGORY_LABEL[priorityCategory],
  );

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
    <section aria-labelledby="cta-heading" className="flex w-full max-w-md flex-col gap-3">
      <h2 id="cta-heading" className="sr-only">
        Próximos passos
      </h2>
      <Eyebrow>Próximo passo</Eyebrow>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base text-foreground">{headline}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <OfferBlock classification={diagnostico.classificacao} seniority={seniority} />

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={handleResend}
              disabled={!leadEmail || resendStatus === 'enviando'}
            >
              {resendStatus === 'enviado'
                ? 'Enviado!'
                : resendStatus === 'enviando'
                  ? 'Enviando…'
                  : 'Receber este relatório por e-mail'}
            </Button>
            <ShareRadarButton
              dimensoes={diagnostico.dimensoes}
              classificacao={diagnostico.classificacao}
            />
          </div>
          {resendStatus === 'erro' && (
            <p className="text-xs text-error-text">
              Não foi possível reenviar agora. Tente novamente em instantes.
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
