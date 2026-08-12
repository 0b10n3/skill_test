import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReportHeader } from '@/components/result/ReportHeader';
import type { Classification } from '@/lib/types';

function renderHeader(classificacao: Classification) {
  return render(
    <ReportHeader
      participantName="Fulano de Tal"
      seniority="pleno"
      submittedAt="2026-08-11T12:00:00.000Z"
      classificacao={classificacao}
      scoreGlobal={0.6}
    />,
  );
}

/**
 * S1 (Épico 18, cor de conquista atualizada para Lime no Épico 22),
 * critério de aceite: MÉDIO/BAIXO nunca usam achievement (Lime) nem
 * destructive para qualificar o resultado da pessoa; ALTO usa Lime com
 * shadow.lime — única aparição de Lime "de conquista" fora da S5.
 */
describe('ReportHeader — regra de Lime/destructive por classificação (S1)', () => {
  it.each(['baixo', 'medio'] as const)(
    'classificação "%s" não usa achievement (Lime) nem destructive',
    (classificacao) => {
      renderHeader(classificacao);
      const badge = screen.getByTestId('score-classificacao');
      expect(badge.dataset.variant).not.toBe('achievement');
      expect(badge.dataset.variant).not.toBe('destructive');
    },
  );

  it('classificação "alto" usa a variante achievement (Lime) com shadow-lime', () => {
    renderHeader('alto');
    const badge = screen.getByTestId('score-classificacao');
    expect(badge.dataset.variant).toBe('achievement');
    expect(badge.className).toContain('shadow-lime');
  });

  it('classificações não-alto nunca têm a classe shadow-lime', () => {
    for (const classificacao of ['baixo', 'medio'] as const) {
      const { unmount } = renderHeader(classificacao);
      const badge = screen.getByTestId('score-classificacao');
      expect(badge.className).not.toContain('shadow-lime');
      unmount();
    }
  });

  it('renderiza o logo (wordmark por tema) no topo do cabeçalho', () => {
    renderHeader('medio');
    expect(screen.getByRole('img', { name: 'Syntaxis' })).toBeInTheDocument();
  });
});
