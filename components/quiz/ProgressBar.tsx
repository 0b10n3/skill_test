import { Progress } from '@/components/ui/progress';

const TOTAL_QUESTIONS = 14;

interface ProgressBarProps {
  currentQuestionNumber: number;
}

export function ProgressBar({ currentQuestionNumber }: ProgressBarProps) {
  const value = (currentQuestionNumber / TOTAL_QUESTIONS) * 100;

  return (
    <div className="w-full max-w-lg" aria-live="polite">
      <Progress value={value} aria-label="Progresso do quiz" />
      <p className="mt-2 font-mono text-sm text-text-medium">
        Pergunta {currentQuestionNumber} de {TOTAL_QUESTIONS}
      </p>
    </div>
  );
}
