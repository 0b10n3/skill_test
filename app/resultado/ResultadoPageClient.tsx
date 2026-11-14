'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { AnswerReview } from '@/components/result/AnswerReview';
import { DimensionScoreCards } from '@/components/result/DimensionScoreCards';
import { MethodFooter } from '@/components/result/MethodFooter';
import { NextStepBand, NextStepRepeat } from '@/components/result/NextStepBand';
import { ReportHeader } from '@/components/result/ReportHeader';
import { SaveShareRow } from '@/components/result/SaveShareRow';
import { StrengthsAndFocus } from '@/components/result/StrengthsAndFocus';
import { Eyebrow } from '@/components/ui/eyebrow';
import { track } from '@/lib/analytics/track';
import { useQuizAnswers } from '@/lib/quiz-context';

// Recharts é o maior contribuinte de JS da página — code-split dos dois
// consumidores (Radar e barras de prioridade) tira esse peso do caminho
// crítico da transição /lead → /resultado (achado de Lighthouse do Épico 13).
const RadarSection = dynamic(
  () => import('@/components/result/RadarSection').then((mod) => mod.RadarSection),
  { loading: () => <div className="h-[26rem] w-full" aria-hidden /> },
);
const PriorityCareerSkills = dynamic(
  () => import('@/components/result/PriorityCareerSkills').then((mod) => mod.PriorityCareerSkills),
  { loading: () => <div className="h-96 w-full" aria-hidden /> },
);

export function ResultadoPageClient() {
  const router = useRouter();
  const { result, leadEmail } = useQuizAnswers();
  const { theme, setTheme } = useTheme();
  const themeRef = useRef(theme);
  themeRef.current = theme;

  // Acesso direto (URL sem ter passado pelo fluxo real, ou refresh que
  // perdeu o estado em memória) nunca mostra um resultado vazio/fictício.
  useEffect(() => {
    if (!result) {
      router.replace('/');
    }
  }, [result, router]);

  // report_viewed (epico-21): nível e classificação — nunca nome/e-mail.
  const reportViewedTracked = useRef(false);
  useEffect(() => {
    if (!result || reportViewedTracked.current) return;
    reportViewedTracked.current = true;
    track('report_viewed', {
      nivel: result.seniority,
      classificacao: result.diagnostico.classificacao,
    });
  }, [result]);

  // S8 (Épico 18): impressão sempre em fundo claro, mesmo com o app no
  // tema escuro — trocar o tema de verdade via next-themes (não duplicar
  // os hexes do tema claro num override de CSS, que teria que ser mantido
  // manualmente em sincronia com design/tokens.json). Restaura o tema
  // anterior ao sair do modo de impressão.
  useEffect(() => {
    const query = window.matchMedia('print');
    let themeBeforePrint: string | undefined;

    const listener = (event: MediaQueryListEvent) => {
      if (event.matches) {
        themeBeforePrint = themeRef.current;
        setTheme('light');
      } else if (themeBeforePrint) {
        setTheme(themeBeforePrint);
      }
    };

    query.addEventListener('change', listener);
    return () => query.removeEventListener('change', listener);
  }, [setTheme]);

  if (!result) {
    return null;
  }

  const { diagnostico } = result;

  // Ordem do Épico 43: veredito e radar → prioridades → ponte para a página final → detalhe
  // (dimensões, fortes e atenção, gabarito) → guardar → repetição do convite → metodologia.
  // Uma largura só (max-w-4xl); pt-24 deixa o topo fora do cabeçalho fixo de 56 px.
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col gap-10 px-6 pt-20 pb-16 sm:gap-12 sm:pt-24 sm:px-10 lg:px-0 print:gap-4 print:px-0 print:pt-0">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-12">
        <ReportHeader
          participantName={result.participantName}
          seniority={result.seniority}
          submittedAt={result.submittedAt}
          classificacao={diagnostico.classificacao}
          scoreGlobal={diagnostico.scoreGlobal}
          acertos={diagnostico.acertos}
          totalQuestoes={diagnostico.totalQuestoes}
        />
        <RadarSection dimensoes={diagnostico.dimensoes} dimensaoDominante={diagnostico.fortes[0]} />
      </div>

      {/* Prioridades (Deep Forest) e ponte (Ink) coladas: degrau de luminância, sem vão. */}
      <div className="flex flex-col">
        <PriorityCareerSkills prioridades={diagnostico.prioridades} seniority={result.seniority} />
        <NextStepBand diagnostico={diagnostico} seniority={result.seniority} />
      </div>

      <DimensionScoreCards dimensoes={diagnostico.dimensoes} />

      <StrengthsAndFocus diagnostico={diagnostico} seniority={result.seniority} />

      <AnswerReview gabarito={result.gabarito} />

      <SaveShareRow
        diagnostico={diagnostico}
        seniority={result.seniority}
        participantName={result.participantName}
        leadEmail={leadEmail}
      />

      <NextStepRepeat diagnostico={diagnostico} seniority={result.seniority} />

      <div className="flex w-full flex-col gap-2">
        <Eyebrow>Metodologia</Eyebrow>
        <MethodFooter />
      </div>
    </main>
  );
}
