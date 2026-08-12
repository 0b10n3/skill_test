import type { Metadata } from 'next';
import { getSeniorityQuestion } from '@/lib/quiz-selection';
import { QuizFlow } from './quiz-flow';

// Épico 21: conteúdo transacional (o quiz em andamento não deve ranquear).
export const metadata: Metadata = {
  title: 'Quiz — Syntaxis Skill Check',
  robots: { index: false, follow: false },
};

export default function QuizPage() {
  const seniorityQuestion = getSeniorityQuestion();

  return <QuizFlow seniorityQuestion={seniorityQuestion} />;
}
