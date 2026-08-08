'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { AnswerMap, SubmitResult } from './types';

interface QuizAnswersContextValue {
  answers: AnswerMap;
  setAnswer: (questionId: string, optionId: string) => void;
  result: SubmitResult | null;
  setResult: (result: SubmitResult) => void;
  reset: () => void;
}

/**
 * Guarda as respostas do quiz e, depois, o resultado da submissão em memória
 * (React state) para sobreviver à navegação client-side entre
 * /quiz → /lead → /resultado sem tocar em localStorage/sessionStorage. Um
 * refresh de página perde o estado — isso é intencional, coerente com a
 * regra de não persistir respostas no navegador.
 */
const QuizAnswersContext = createContext<QuizAnswersContextValue | null>(null);

export function QuizAnswersProvider({ children }: { children: React.ReactNode }) {
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [result, setResultState] = useState<SubmitResult | null>(null);

  const setAnswer = useCallback((questionId: string, optionId: string) => {
    setAnswers((previous) => ({ ...previous, [questionId]: optionId }));
  }, []);

  const setResult = useCallback((newResult: SubmitResult) => {
    setResultState(newResult);
  }, []);

  const reset = useCallback(() => {
    setAnswers({});
    setResultState(null);
  }, []);

  const value = useMemo(
    () => ({ answers, setAnswer, result, setResult, reset }),
    [answers, setAnswer, result, setResult, reset],
  );

  return <QuizAnswersContext.Provider value={value}>{children}</QuizAnswersContext.Provider>;
}

export function useQuizAnswers(): QuizAnswersContextValue {
  const context = useContext(QuizAnswersContext);
  if (!context) {
    throw new Error('useQuizAnswers precisa estar dentro de <QuizAnswersProvider>');
  }
  return context;
}
