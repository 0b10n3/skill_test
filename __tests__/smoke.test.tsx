import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('smoke — landing page', () => {
  it('renderiza a headline e o CTA "Iniciar avaliação" sem quebrar', () => {
    render(<Home />);
    expect(
      screen.getByRole('heading', { name: /descubra seu nível técnico em finanças/i }),
    ).toBeInTheDocument();
    // Épico 38: o CTA final repete o do hero — os dois levam ao quiz.
    const ctas = screen.getAllByRole('link', { name: /iniciar avaliação/i });
    expect(ctas).toHaveLength(2);
    for (const cta of ctas) expect(cta).toHaveAttribute('href', '/quiz');
  });
});
