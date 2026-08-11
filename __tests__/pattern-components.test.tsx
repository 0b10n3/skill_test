import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import tokens from '@/design/tokens.json';
import { PatternDataGrid } from '@/components/patterns/PatternDataGrid';
import { PatternGrowthLine } from '@/components/patterns/PatternGrowthLine';
import { PatternNodeBranch } from '@/components/patterns/PatternNodeBranch';

const NODE_BRANCH = tokens.pattern.nodeBranch;

describe('PatternNodeBranch', () => {
  it('trava a opacidade em opacityOnText quando context="onText", mesmo se o consumidor passar um valor maior', () => {
    const { container } = render(<PatternNodeBranch context="onText" opacity={0.9} />);
    const svg = container.querySelector('svg');
    expect(svg?.style.opacity).toBe(String(NODE_BRANCH.opacityOnText.$value));
  });

  it('clampa a opacidade decorativa dentro de [opacityDecorativeMin, opacityDecorativeMax]', () => {
    const { container: tooHigh } = render(
      <PatternNodeBranch context="decorative" opacity={0.95} />,
    );
    expect(tooHigh.querySelector('svg')?.style.opacity).toBe(
      String(NODE_BRANCH.opacityDecorativeMax.$value),
    );

    const { container: tooLow } = render(<PatternNodeBranch context="decorative" opacity={0.01} />);
    expect(tooLow.querySelector('svg')?.style.opacity).toBe(
      String(NODE_BRANCH.opacityDecorativeMin.$value),
    );
  });

  it('renderiza como decorativo (aria-hidden) — nunca lido por leitor de tela', () => {
    const { container } = render(<PatternNodeBranch context="decorative" />);
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('cada nó e galho referencia os tokens pattern.nodeBranch via var(), nunca um valor copiado', () => {
    const { container } = render(<PatternNodeBranch context="decorative" />);
    const circle = container.querySelector('circle');
    const line = container.querySelector('line');
    expect(circle?.getAttribute('r')).toBe('var(--pattern-node-branch-node-radius)');
    expect(circle?.getAttribute('fill')).toBe('var(--pattern-node-branch-color)');
    expect(line?.getAttribute('stroke-width')).toBe('var(--pattern-node-branch-stroke-width)');
  });
});

describe('PatternDataGrid', () => {
  it('a API só aceita os três slots documentados — nenhuma prop de posicionamento livre', () => {
    const { container } = render(<PatternDataGrid slot="header" />);
    expect(container.querySelector('[data-pattern-slot="header"]')).toBeInTheDocument();
  });

  it('referencia os tokens pattern.dataGrid via var()', () => {
    const { container } = render(<PatternDataGrid slot="margin-left" />);
    const el = container.querySelector('[data-pattern="data-grid"]') as HTMLElement;
    expect(el.style.backgroundSize).toContain('var(--pattern-data-grid-spacing)');
  });
});

describe('PatternGrowthLine', () => {
  it('não aceita prop de opacidade — nunca pode ser usado como fundo decorativo', () => {
    // @ts-expect-error — opacity não existe em PatternGrowthLineProps, de propósito.
    const props: React.ComponentProps<typeof PatternGrowthLine> = { opacity: 0.1 };
    expect(props).toBeDefined();
  });

  it('a opacidade renderizada é sempre o token pattern.growthLine.opacity (1.0)', () => {
    const { container } = render(<PatternGrowthLine steps={3} />);
    const polyline = container.querySelector('polyline') as SVGPolylineElement;
    expect(polyline.style.opacity).toBe('var(--pattern-growth-line-opacity)');
  });

  it('não é aria-hidden — é conteúdo protagonista, não decoração de fundo', () => {
    const { container } = render(<PatternGrowthLine />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('aria-hidden')).toBeNull();
    expect(svg?.getAttribute('role')).toBe('img');
  });
});
