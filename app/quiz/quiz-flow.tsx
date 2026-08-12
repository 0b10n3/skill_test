'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { fetchRestOfSession } from './actions';
import { ProgressBar } from '@/components/quiz/ProgressBar';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { Eyebrow } from '@/components/ui/eyebrow';
import { useQuizAnswers } from '@/lib/quiz-context';
import type { ClientQuestion, SeniorityLevel } from '@/lib/types';

interface QuizFlowProps {
  seniorityQuestion: ClientQuestion;
}

export function QuizFlow({ seniorityQuestion }: QuizFlowProps) {
  const router = useRouter();
  const { setAnswer } = useQuizAnswers();
  const [questions, setQuestions] = useState<ClientQuestion[]>([seniorityQuestion]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoadingRest, setIsLoadingRest] = useState(false);

  const currentQuestion = questions[currentIndex];

  async function handleAnswer(optionId: string) {
    setAnswer(currentQuestion.id, optionId);

    if (currentQuestion.type === 'seniority') {
      setIsLoadingRest(true);
      const seniority = optionId as SeniorityLevel;
      const rest = await fetchRestOfSession(seniority);
      setQuestions([seniorityQuestion, ...rest.knowledgeQuestions]);
      setIsLoadingRest(false);
      setCurrentIndex(1);
      return;
    }

    const isLastQuestion = currentIndex === questions.length - 1;
    if (isLastQuestion) {
      router.push('/lead');
      return;
    }

    setCurrentIndex((index) => index + 1);
  }

  if (isLoadingRest) {
    return (
      <main className="flex h-dvh flex-col items-center justify-center gap-4 px-6">
        <p className="font-mono text-sm text-muted-foreground" role="status" aria-live="polite">
          Preparando suas próximas perguntas…
        </p>
      </main>
    );
  }

  // q00 (senioridade) é uma etapa prévia, fora da contagem "N de 15" — as 15
  // questões do blueprint (AVALIACAO.md §3) começam a contar a partir dela.
  const isSeniorityStep = currentQuestion.type === 'seniority';

  return (
    <main className="flex h-dvh flex-col items-center justify-center gap-3 px-6 py-3">
      <Eyebrow className="text-center">Avaliação Syntaxis</Eyebrow>
      {!isSeniorityStep && <ProgressBar currentQuestionNumber={currentIndex} />}
      <QuestionCard key={currentQuestion.id} question={currentQuestion} onAnswer={handleAnswer} />
    </main>
  );
}
