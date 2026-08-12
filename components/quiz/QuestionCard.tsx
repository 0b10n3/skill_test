'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { ClientQuestion } from '@/lib/types';

interface QuestionCardProps {
  question: ClientQuestion;
  onAnswer: (optionId: string) => void;
}

export function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Move o foco de teclado para a nova pergunta a cada avanço, em vez de
  // deixá-lo cair para <body> quando o card anterior é desmontado.
  useEffect(() => {
    headingRef.current?.focus();
  }, [question.id]);

  return (
    <Card
      size="sm"
      className="flex w-full max-w-lg flex-col gap-3 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-200"
    >
      <CardHeader>
        {/* h1 real (não a CardTitle padrão, que é um <div>) — /quiz é uma
            única rota SPA, e a pergunta atual é o conteúdo canônico da
            "página" em cada passo (Épico 21, higiene técnica: 1 h1 por
            rota). O foco já pousava aqui a cada troca de pergunta; agora a
            hierarquia de heading reflete isso também para leitor de tela. */}
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-base leading-snug text-balance text-foreground outline-none sm:text-xl"
        >
          {question.question}
        </h1>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <RadioGroup
          value={selected ?? undefined}
          onValueChange={(value) => setSelected(String(value))}
          aria-label={question.question}
          className="gap-1.5"
        >
          {question.options.map((option) => (
            <label
              key={option.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-border px-3 py-1.5 text-xs text-foreground transition-colors has-[[data-checked]]:border-primary has-[[data-checked]]:bg-primary/10 sm:text-sm"
            >
              <RadioGroupItem value={option.id} />
              {option.text}
            </label>
          ))}
        </RadioGroup>
        <Button
          data-testid="quiz-next-button"
          disabled={!selected}
          onClick={() => {
            if (selected) onAnswer(selected);
          }}
          className="self-end"
        >
          Próxima
        </Button>
      </CardContent>
    </Card>
  );
}
