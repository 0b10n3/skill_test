'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/eyebrow';
import { CATEGORY_LABEL, CTA_HEADLINE, PROXIMO_PASSO } from '@/content/relatorio';
import { track } from '@/lib/analytics/track';
import type { Diagnostico } from '@/lib/diagnostico';
import type { SeniorityLevel } from '@/lib/types';

interface NextStepProps {
  diagnostico: Diagnostico;
  seniority: SeniorityLevel;
}

const DESTINO = '/newsletter';

function trackClick({ diagnostico, seniority }: NextStepProps, posicao: 'meio' | 'fim') {
  track('next_step_click', {
    nivel: seniority,
    classificacao: diagnostico.classificacao,
    posicao,
  });
}

/**
 * Ponte do relatório para a página final (S7, Épico 43). Banda Ink logo depois
 * da banda Deep Forest das prioridades — transição por degrau de luminância,
 * como na landing. Um único botão Lime; navegação de cliente, para o
 * diagnóstico em memória chegar a /newsletter.
 */
export function NextStepBand(props: NextStepProps) {
  const { diagnostico, seniority } = props;
  const headline = CTA_HEADLINE[seniority][diagnostico.classificacao](
    CATEGORY_LABEL[diagnostico.prioridades[0].category],
  );

  return (
    <section
      aria-labelledby="next-step-heading"
      className="flex w-full flex-col gap-4 bg-neutral-ink px-6 py-10 print:hidden sm:px-10 sm:py-12"
    >
      <Eyebrow onDark>{PROXIMO_PASSO.eyebrow}</Eyebrow>
      <h2
        id="next-step-heading"
        className="max-w-2xl font-display text-xl text-pretty text-neutral-chalk sm:text-3xl sm:text-balance"
      >
        {headline}
      </h2>
      <p className="max-w-xl text-base text-neutral-chalk/80">{PROXIMO_PASSO.apoio}</p>
      <Button
        size="lg"
        className="w-full sm:w-fit"
        onClick={() => trackClick(props, 'meio')}
        render={<Link href={DESTINO} />}
      >
        {PROXIMO_PASSO.cta}
      </Button>
    </section>
  );
}

/** Repetição do convite no fim do relatório (Épico 43): outline, sem Lime — a página já tem o botão da ponte. */
export function NextStepRepeat(props: NextStepProps) {
  return (
    <div className="flex w-full flex-col gap-3 border-t border-border pt-6 print:hidden sm:flex-row sm:items-center sm:justify-between">
      <p className="text-base text-foreground">{PROXIMO_PASSO.repeticao}</p>
      <Button
        variant="outline"
        className="w-full sm:w-fit"
        onClick={() => trackClick(props, 'fim')}
        render={<Link href={DESTINO} />}
      >
        {PROXIMO_PASSO.cta}
      </Button>
    </div>
  );
}
