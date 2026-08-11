import { NextRequest } from 'next/server';
import { POST } from '@/app/api/submit/route';
import { questionsBank } from '@/lib/questions-bank';
import type { AnswerMap, SeniorityLevel } from '@/lib/types';

function buildKnowledgeCategoriesFor(seniority: SeniorityLevel) {
  const categories = [
    ...new Set(questionsBank.filter((q) => q.type === 'knowledge').map((q) => q.category)),
  ];

  return categories.map((category) =>
    questionsBank
      .filter(
        (q) =>
          q.type === 'knowledge' &&
          q.category === category &&
          q.targetSeniority?.includes(seniority),
      )
      .slice(0, 3),
  );
}

/** Monta um payload legítimo (formato de sessão real) com exatamente `correctCount` acertos. */
export function buildAnswers(seniority: SeniorityLevel, correctCount: number): AnswerMap {
  const seniorityQuestion = questionsBank.find((q) => q.type === 'seniority')!;
  const categoriesOfThree = buildKnowledgeCategoriesFor(seniority);

  const answers: AnswerMap = { [seniorityQuestion.id]: seniority };
  let remainingCorrect = correctCount;

  for (const questionsInCategory of categoriesOfThree) {
    for (const question of questionsInCategory) {
      const shouldBeCorrect = remainingCorrect > 0;
      if (shouldBeCorrect) remainingCorrect -= 1;
      answers[question.id] = shouldBeCorrect
        ? question.correctOptionId!
        : question.options.find((o) => o.id !== question.correctOptionId)!.id;
    }
  }

  return answers;
}

export function postSubmit(body: unknown) {
  const request = new NextRequest('http://localhost/api/submit', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': `10.0.0.${Math.random()}` },
    body: JSON.stringify(body),
  });
  return POST(request);
}
