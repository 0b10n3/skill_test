'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { CATEGORY_LABEL } from '@/content/relatorio';
import { splitCodeTerms } from '@/lib/highlight-code-terms';
import type { KnowledgeCategory, QuestionReviewItem } from '@/lib/types';

const GABARITO_VALUE = 'gabarito';

/** Termos técnicos/código embutidos na explicação (S6, Épico 18) em Space Mono. */
function ExplanationText({ text }: { text: string }) {
  return (
    <>
      {splitCodeTerms(text).map((segment, index) =>
        segment.isCode ? (
          <code key={index} className="font-data text-foreground">
            {segment.text}
          </code>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </>
  );
}

/**
 * O gabarito abre automaticamente na impressão. CSS não resolve isso: o
 * atributo HTML `hidden` (usado pelo painel do accordion quando fechado)
 * tem uma regra `!important` na folha de estilo do próprio navegador que
 * nenhum `!important` de autor consegue sobrepor — a única forma real de
 * "expandir para impressão" é abrir o accordion de fato via estado.
 *
 * Usa `matchMedia('print')`, não os eventos `beforeprint`/`afterprint`:
 * esses eventos só disparam numa impressão real (window.print()/Ctrl+P), e
 * não são acionados por `page.emulateMedia({ media: 'print' })` do
 * Playwright — o que tornaria o comportamento impossível de testar em E2E.
 * `matchMedia('print').matches` reflete corretamente o media emulado.
 */
function usePrintOpensAccordion(): [string[], (value: string[]) => void] {
  const [openValues, setOpenValues] = useState<string[]>([]);

  useEffect(() => {
    const query = window.matchMedia('print');
    if (query.matches) setOpenValues([GABARITO_VALUE]);

    const listener = (event: MediaQueryListEvent) => {
      setOpenValues(event.matches ? [GABARITO_VALUE] : []);
    };
    query.addEventListener('change', listener);
    return () => query.removeEventListener('change', listener);
  }, []);

  return [openValues, setOpenValues];
}

interface AnswerReviewProps {
  gabarito: QuestionReviewItem[];
}

/** Agrupa por dimensão e ordena os grupos com mais erros primeiro (superfície os pontos de atenção). */
function groupByDimension(
  gabarito: QuestionReviewItem[],
): { category: KnowledgeCategory; items: QuestionReviewItem[] }[] {
  const categories = [...new Set(gabarito.map((item) => item.category))];

  return categories
    .map((category) => {
      const items = gabarito
        .filter((item) => item.category === category)
        .sort((a, b) => Number(a.correct) - Number(b.correct));
      return { category, items };
    })
    .sort((a, b) => {
      const wrongInA = a.items.filter((item) => !item.correct).length;
      const wrongInB = b.items.filter((item) => !item.correct).length;
      return wrongInB - wrongInA;
    });
}

export function AnswerReview({ gabarito }: AnswerReviewProps) {
  const groups = groupByDimension(gabarito);
  const [openValues, setOpenValues] = usePrintOpensAccordion();

  return (
    <section aria-labelledby="answer-review-heading" className="w-full max-w-4xl">
      <h2 id="answer-review-heading" className="sr-only">
        Gabarito comentado
      </h2>
      <Accordion value={openValues} onValueChange={setOpenValues}>
        <AccordionItem value={GABARITO_VALUE}>
          <AccordionTrigger className="font-display text-base text-foreground">
            Revisar minhas respostas
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-4">
              {groups.map((group) => (
                <div key={group.category} className="flex flex-col gap-2">
                  <h3 className="font-display text-sm text-foreground">
                    {CATEGORY_LABEL[group.category]}
                  </h3>
                  {group.items.map((item) => {
                    const selectedOption = item.options.find(
                      (option) => option.id === item.selectedOptionId,
                    );
                    const correctOption = item.options.find(
                      (option) => option.id === item.correctOptionId,
                    );

                    return (
                      <Card key={item.questionId} size="sm" className="gap-2">
                        <div className="flex items-start gap-2 px-(--card-spacing)">
                          {item.correct ? (
                            <CheckCircle2
                              aria-hidden
                              className="mt-0.5 size-4 shrink-0 text-semantic-success"
                            />
                          ) : (
                            <XCircle
                              aria-hidden
                              className="mt-0.5 size-4 shrink-0 text-semantic-warning"
                            />
                          )}
                          <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium text-foreground">{item.question}</p>
                            <p className="text-xs text-muted-foreground">
                              <span className="sr-only">Status: </span>
                              {item.correct ? 'Correta' : 'Incorreta'} — sua resposta:{' '}
                              {selectedOption?.text ?? 'não respondida'}
                              {!item.correct && correctOption && (
                                <>
                                  {' '}
                                  · resposta correta: <strong>{correctOption.text}</strong>
                                </>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              <ExplanationText text={item.explanation} />
                            </p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
