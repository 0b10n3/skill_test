'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { ClientQuestion } from '@/lib/types';

interface QuestionCardProps {
  question: ClientQuestion;
  onAnswer: (optionId: string) => void;
}

const APOIO_SENIORIDADE = 'Sua resposta calibra as perguntas para o seu nível.';

/**
 * Faixas do meio e da base do quiz (Épico 45, F3/F10): a pergunta ocupa o
 * espaço restante e só ela rola, quando não cabe; "Próxima" fica fixa na base,
 * no alcance do polegar, sem nunca sair da tela.
 */
export function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Move o foco de teclado para a nova pergunta a cada avanço, em vez de
  // deixá-lo cair para <body> quando a pergunta anterior é desmontada.
  useEffect(() => {
    headingRef.current?.focus();
  }, [question.id]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        data-testid="quiz-question"
        className="min-h-0 flex-1 overflow-y-auto px-4 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-200 sm:px-6"
      >
        <div className="mx-auto flex w-full max-w-lg flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            {/* h1 real: /quiz é uma única rota SPA e a pergunta atual é o
                conteúdo canônico da "página" em cada passo (Épico 21).
                data-slot="card-title" é o seletor dos testes E2E. */}
            <h1
              ref={headingRef}
              tabIndex={-1}
              data-slot="card-title"
              className="font-display text-lg leading-snug text-balance text-foreground outline-none sm:text-xl"
            >
              {question.question}
            </h1>
            {question.type === 'seniority' && (
              <p className="text-sm text-muted-foreground">{APOIO_SENIORIDADE}</p>
            )}
          </div>
          <RadioGroup
            value={selected ?? undefined}
            onValueChange={(value) => setSelected(String(value))}
            aria-label={question.question}
            className="gap-2"
          >
            {question.options.map((option) => (
              <label
                key={option.id}
                className="flex min-h-11 cursor-pointer items-center gap-3 rounded-sm border border-border bg-card px-3 py-2 text-sm text-foreground transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring has-[:focus-visible]:outline-solid has-[[data-checked]]:border-primary has-[[data-checked]]:bg-primary/10 sm:text-base"
              >
                {/* O anel de foco fica na linha inteira, não no círculo de 16px. */}
                <RadioGroupItem value={option.id} className="focus-visible:outline-none" />
                {option.text}
              </label>
            ))}
          </RadioGroup>
        </div>
      </div>
      <div className="border-t border-border bg-background px-4 py-3 sm:px-6">
        <div className="mx-auto flex w-full max-w-lg justify-end">
          <Button
            data-testid="quiz-next-button"
            disabled={!selected}
            onClick={() => {
              if (selected) onAnswer(selected);
            }}
            className="w-full sm:w-auto"
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  );
}
