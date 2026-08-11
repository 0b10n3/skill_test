import { beforeAll, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PriorityCareerSkills } from '@/components/result/PriorityCareerSkills';
import type { PrioridadeDimensao } from '@/lib/diagnostico';

const prioridades: PrioridadeDimensao[] = [
  { category: 'dados-programacao', prioridade: 0.5 },
  { category: 'matematica-quant', prioridade: 0.3 },
  { category: 'mercados-produtos', prioridade: 0.1 },
  { category: 'ia-aplicada', prioridade: 0.05 },
  { category: 'risco-regulacao', prioridade: 0.02 },
];

beforeAll(() => {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).ResizeObserver = ResizeObserverStub;
});

describe('PriorityCareerSkills (S5, Épico 18)', () => {
  it('nunca promete promoção/salário — usa "próximo degrau", nunca "promoção" (DESIGN.md §1.3, linha vermelha)', () => {
    render(<PriorityCareerSkills prioridades={prioridades} seniority="pleno" />);
    expect(screen.queryByText(/promoção/i)).not.toBeInTheDocument();
    expect(screen.getByText('Impacto no próximo degrau, por dimensão')).toBeInTheDocument();
  });

  it('marca as 2 prioridades de topo com marcador numerado (#1/#2)', () => {
    render(<PriorityCareerSkills prioridades={prioridades} seniority="pleno" />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
