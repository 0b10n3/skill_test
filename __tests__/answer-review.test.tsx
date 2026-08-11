import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { AnswerReview } from '@/components/result/AnswerReview';
import type { QuestionReviewItem } from '@/lib/types';

function makeItem(overrides: Partial<QuestionReviewItem>): QuestionReviewItem {
  return {
    questionId: 'q01',
    category: 'dados-programacao',
    question: 'Pergunta de exemplo',
    options: [
      { id: 'a', text: 'Opção A' },
      { id: 'b', text: 'Opção B' },
    ],
    selectedOptionId: 'a',
    correctOptionId: 'a',
    explanation: 'SELECT define as colunas; HAVING AVG(taxa) > 0.12 filtra grupos.',
    correct: true,
    ...overrides,
  };
}

describe('AnswerReview (S6, Épico 18)', () => {
  it('termos técnicos/código na explicação renderizam como <code> em Space Mono', () => {
    render(<AnswerReview gabarito={[makeItem({})]} />);

    // O gabarito abre ao clicar no trigger do accordion.
    fireEvent.click(screen.getByRole('button', { name: 'Revisar minhas respostas' }));

    const codeElements = screen.getAllByText(/SELECT|AVG\(taxa\)/);
    expect(codeElements.some((el) => el.tagName === 'CODE')).toBe(true);
  });

  it('resposta correta/incorreta é sinalizada por ícone E texto, nunca só cor', () => {
    render(
      <AnswerReview
        gabarito={[
          makeItem({ questionId: 'q01', correct: true }),
          makeItem({ questionId: 'q02', correct: false, selectedOptionId: 'b' }),
        ]}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Revisar minhas respostas' }));

    expect(screen.getByText(/Correta/)).toBeInTheDocument();
    expect(screen.getByText(/Incorreta/)).toBeInTheDocument();
  });
});
