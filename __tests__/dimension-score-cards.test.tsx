import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DimensionScoreCards } from '@/components/result/DimensionScoreCards';
import { CATEGORY_LABEL, SCORE_CARD_COPY } from '@/content/relatorio';
import type { DimensaoDiagnostico } from '@/lib/diagnostico';

function makeDimensoes(): DimensaoDiagnostico[] {
  return [
    { category: 'mercados-produtos', acertos: 3, total: 3, score: 1, etiqueta: 'forte' },
    { category: 'matematica-quant', acertos: 2, total: 3, score: 0.67, etiqueta: 'forte' },
    { category: 'dados-programacao', acertos: 1, total: 3, score: 0.33, etiqueta: 'atencao' },
    { category: 'ia-aplicada', acertos: 0, total: 3, score: 0, etiqueta: 'atencao' },
    { category: 'risco-regulacao', acertos: 2, total: 3, score: 0.67, etiqueta: 'forte' },
  ];
}

describe('DimensionScoreCards', () => {
  it('renderiza as 5 dimensões com N/total, etiqueta e a microcopy correta da faixa', () => {
    const dimensoes = makeDimensoes();
    render(<DimensionScoreCards dimensoes={dimensoes} />);

    for (const dimensao of dimensoes) {
      expect(screen.getByText(CATEGORY_LABEL[dimensao.category])).toBeInTheDocument();
      expect(
        screen.getAllByText(`${dimensao.acertos}/${dimensao.total}`).length,
      ).toBeGreaterThanOrEqual(1);
      expect(
        screen.getByText(SCORE_CARD_COPY[dimensao.category][dimensao.etiqueta]),
      ).toBeInTheDocument();
    }
  });

  it('score ≥ 0.67 recebe a etiqueta "Ponto forte" e score ≤ 0.33 recebe "Ponto de atenção"', () => {
    const dimensoes = makeDimensoes();
    render(<DimensionScoreCards dimensoes={dimensoes} />);

    expect(screen.getAllByText('Ponto forte')).toHaveLength(3);
    expect(screen.getAllByText('Ponto de atenção')).toHaveLength(2);
  });
});
