'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LeadForm } from '@/components/lead/LeadForm';
import { SENIORITY_LABEL } from '@/components/lead/seniority-label';
import { Eyebrow } from '@/components/ui/eyebrow';
import { useQuizAnswers } from '@/lib/quiz-context';
import type { SeniorityLevel } from '@/lib/types';

export function LeadPageClient() {
  const router = useRouter();
  const { answers } = useQuizAnswers();
  const seniority = answers.q00 as SeniorityLevel | undefined;

  // Quem chega em /lead sem ter respondido o quiz (acesso direto à URL, ou
  // refresh que perdeu o estado em memória) volta para o início do fluxo.
  useEffect(() => {
    if (!seniority) {
      router.replace('/');
    }
  }, [seniority, router]);

  if (!seniority) {
    return null;
  }

  return (
    <main className="flex h-dvh flex-col items-center justify-center gap-3 px-6 py-4">
      <Eyebrow className="text-center">Último passo</Eyebrow>
      <LeadForm seniorityLabel={SENIORITY_LABEL[seniority]} />
    </main>
  );
}
