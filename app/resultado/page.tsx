'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { AnswerReview } from '@/components/result/AnswerReview';
import { CtaSection } from '@/components/result/CtaSection';
import { DimensionScoreCards } from '@/components/result/DimensionScoreCards';
import { MethodFooter } from '@/components/result/MethodFooter';
import { ReportHeader } from '@/components/result/ReportHeader';
import { StrengthsAndFocus } from '@/components/result/StrengthsAndFocus';
import { useQuizAnswers } from '@/lib/quiz-context';

// Recharts é o maior contribuinte de JS da página — code-split dos dois
// consumidores (Radar e barras de prioridade) tira esse peso do caminho
// crítico da transição /lead → /resultado (achado de Lighthouse do Épico 13).
const RadarSection = dynamic(
  () => import('@/components/result/RadarSection').then((mod) => mod.RadarSection),
  { loading: () => <div className="h-64 w-full max-w-md" aria-hidden /> },
);
const PriorityCareerSkills = dynamic(
  () => import('@/components/result/PriorityCareerSkills').then((mod) => mod.PriorityCareerSkills),
  { loading: () => <div className="h-40 w-full max-w-4xl" aria-hidden /> },
);

export default function ResultadoPage() {
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

  return (
    <main className="flex min-h-dvh flex-col items-center gap-8 px-6 py-10 print:gap-4 print:px-0">
      <ReportHeader
        participantName={result.participantName}
        seniority={result.seniority}
        submittedAt={result.submittedAt}
        classificacao={diagnostico.classificacao}
        scoreGlobal={diagnostico.scoreGlobal}
      />

      <RadarSection dimensoes={diagnostico.dimensoes} dimensaoDominante={diagnostico.fortes[0]} />

      <DimensionScoreCards dimensoes={diagnostico.dimensoes} />

      <StrengthsAndFocus diagnostico={diagnostico} seniority={result.seniority} />

      <PriorityCareerSkills prioridades={diagnostico.prioridades} seniority={result.seniority} />

      <AnswerReview gabarito={result.gabarito} />

      <div className="print:hidden">
        <CtaSection
          diagnostico={diagnostico}
          seniority={result.seniority}
          participantName={result.participantName}
          leadEmail={leadEmail}
        />
      </div>

      <MethodFooter />
    </main>
  );
}
