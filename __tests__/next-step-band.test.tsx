import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { NextStepBand, NextStepRepeat } from '@/components/result/NextStepBand';
import { CATEGORY_LABEL, CTA_HEADLINE } from '@/content/relatorio';
import type { Diagnostico } from '@/lib/diagnostico';

const track = vi.fn();
vi.mock('@/lib/analytics/track', () => ({ track: (...args: unknown[]) => track(...args) }));

const diagnostico = {
  classificacao: 'baixo',
  prioridades: [{ category: 'matematica-quant', prioridade: 0.25 }],
} as unknown as Diagnostico;

describe('NextStepBand / NextStepRepeat (Épico 43)', () => {
  beforeEach(() => track.mockClear());

  it('título vem de CTA_HEADLINE com a dimensão prioritária; link para /newsletter', () => {
    render(<NextStepBand diagnostico={diagnostico} seniority="junior" />);
    expect(
      screen.getByRole('heading', {
        name: CTA_HEADLINE.junior.baixo(CATEGORY_LABEL['matematica-quant']),
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver o próximo passo' })).toHaveAttribute(
      'href',
      '/newsletter',
    );
  });

  it.each([
    [NextStepBand, 'meio'],
    [NextStepRepeat, 'fim'],
  ] as const)('um clique dispara next_step_click uma vez (posicao %#)', (Componente, posicao) => {
    render(<Componente diagnostico={diagnostico} seniority="junior" />);
    fireEvent.click(screen.getByRole('link', { name: 'Ver o próximo passo' }));
    expect(track).toHaveBeenCalledTimes(1);
    expect(track).toHaveBeenCalledWith('next_step_click', {
      nivel: 'junior',
      classificacao: 'baixo',
      posicao,
    });
  });
});
