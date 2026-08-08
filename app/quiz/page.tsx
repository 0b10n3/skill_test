import type { Metadata } from 'next';
import { getSeniorityQuestion } from '@/lib/quiz-selection';
import { QuizFlow } from './quiz-flow';

export const metadata: Metadata = {
  title: 'Quiz — Syntaxis Skill Check',
};

export default function QuizPage() {
  const seniorityQuestion = getSeniorityQuestion();

  return <QuizFlow seniorityQuestion={seniorityQuestion} />;
}
