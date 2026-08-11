'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnswerReview } from '@/components/result/AnswerReview';
import { CtaSection } from '@/components/result/CtaSection';
import { DimensionScoreCards } from '@/components/result/DimensionScoreCards';
import { MethodFooter } from '@/components/result/MethodFooter';
import { PriorityCareerSkills } from '@/components/result/PriorityCareerSkills';
import { RadarSection } from '@/components/result/RadarSection';
import { ReportHeader } from '@/components/result/ReportHeader';
import { StrengthsAndFocus } from '@/components/result/StrengthsAndFocus';
import { useQuizAnswers } from '@/lib/quiz-context';

export default function ResultadoPage() {
  const router = useRouter();
  const { result, leadEmail } = useQuizAnswers();

  // Acesso direto (URL sem ter passado pelo fluxo real, ou refresh que
  // perdeu o estado em memória) nunca mostra um resultado vazio/fictício.
  useEffect(() => {
    if (!result) {
      router.replace('/');
    }
  }, [result, router]);

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
