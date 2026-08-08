import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('smoke — landing page', () => {
  it('renderiza a headline e o CTA "Iniciar avaliação" sem quebrar', () => {
    render(<Home />);
    expect(
      screen.getByRole('heading', { name: /descubra seu nível técnico em finanças/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /iniciar avaliação/i })).toHaveAttribute(
      'href',
      '/quiz',
    );
  });
});
