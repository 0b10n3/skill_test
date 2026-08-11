import { beforeAll, describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { RadarSection } from '@/components/result/RadarSection';
import { CATEGORY_LABEL, RADAR_SUMMARY } from '@/content/relatorio';
import type { DimensaoDiagnostico } from '@/lib/diagnostico';

const dimensoes: DimensaoDiagnostico[] = [
  { category: 'mercados-produtos', acertos: 3, total: 3, score: 1, etiqueta: 'forte' },
  { category: 'matematica-quant', acertos: 2, total: 3, score: 0.67, etiqueta: 'forte' },
  { category: 'dados-programacao', acertos: 1, total: 3, score: 0.33, etiqueta: 'atencao' },
  { category: 'ia-aplicada', acertos: 0, total: 3, score: 0, etiqueta: 'atencao' },
  { category: 'risco-regulacao', acertos: 2, total: 3, score: 0.67, etiqueta: 'forte' },
];

beforeAll(() => {
  // jsdom não implementa ResizeObserver — o ResponsiveContainer do Recharts depende dele.
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).ResizeObserver = ResizeObserverStub;
});

describe('RadarSection', () => {
  it('a tabela acessível (visually-hidden) reflete exatamente os mesmos valores das props, dimensão × score × expectativa', () => {
    render(<RadarSection dimensoes={dimensoes} dimensaoDominante="mercados-produtos" />);

    const table = screen.getByRole('table', { hidden: true });
    const rows = within(table).getAllByRole('row', { hidden: true }).slice(1); // pula o cabeçalho
    expect(rows).toHaveLength(dimensoes.length);

    rows.forEach((row, index) => {
      const dimensao = dimensoes[index];
      expect(row).toHaveTextContent(CATEGORY_LABEL[dimensao.category]);
      expect(row).toHaveTextContent(`${Math.round(dimensao.score * 100)}%`);
      expect(row).toHaveTextContent('67%'); // expectativa fixa do nível
    });
  });

  it('exibe a frase-resumo correspondente à dimensão dominante informada', () => {
    render(<RadarSection dimensoes={dimensoes} dimensaoDominante="dados-programacao" />);
    expect(screen.getByText(RADAR_SUMMARY['dados-programacao'])).toBeInTheDocument();
  });

  // A cor da série "Seu perfil" (Grove fixo — S2, Épico 18) não é
  // testável aqui: jsdom não mede layout, então o ResponsiveContainer do
  // Recharts renderiza 0×0 e nem monta o SVG interno (mesma limitação que
  // já vale para os outros testes deste arquivo, que por isso testam a
  // tabela acessível, não o gráfico). Verificado visualmente via
  // screenshot nos dois temas — ver PR do Épico 18.
});
