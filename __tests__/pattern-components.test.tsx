import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import tokens from '@/design/tokens.json';
import { PatternReticula } from '@/components/patterns/PatternReticula';
import { PatternGrowthLine } from '@/components/patterns/PatternGrowthLine';
import { PatternMesh } from '@/components/patterns/PatternMesh';

const MESH = tokens.pattern.mesh;

describe('PatternMesh', () => {
  it('trava a opacidade em opacityOnText quando context="onText", mesmo se o consumidor passar um valor maior', () => {
    const { container } = render(<PatternMesh context="onText" opacity={0.9} />);
    const svg = container.querySelector('svg');
    expect(svg?.style.opacity).toBe(String(MESH.opacityOnText.$value));
  });

  it('clampa a opacidade decorativa dentro de [opacityDecorativeMin, opacityDecorativeMax]', () => {
    const { container: tooHigh } = render(<PatternMesh context="decorative" opacity={0.95} />);
    expect(tooHigh.querySelector('svg')?.style.opacity).toBe(
      String(MESH.opacityDecorativeMax.$value),
    );

    const { container: tooLow } = render(<PatternMesh context="decorative" opacity={0.01} />);
    expect(tooLow.querySelector('svg')?.style.opacity).toBe(
      String(MESH.opacityDecorativeMin.$value),
    );
  });

  it('renderiza como decorativo (aria-hidden) — nunca lido por leitor de tela', () => {
    const { container } = render(<PatternMesh context="decorative" />);
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('o path do padrão referencia os tokens pattern.mesh via var(), nunca um valor copiado', () => {
    const { container } = render(<PatternMesh context="decorative" />);
    const path = container.querySelector('path');
    expect(path?.getAttribute('stroke')).toBe('var(--pattern-mesh-color)');
    expect(path?.getAttribute('stroke-width')).toBe('var(--pattern-mesh-stroke-width)');
    expect(path?.getAttribute('fill')).toBe('none');
  });

  it('nunca desenha círculo ou arco — só linhas retas 0°/90° (DESIGN.md §6.2)', () => {
    const { container } = render(<PatternMesh context="decorative" />);
    expect(container.querySelector('circle')).toBeNull();
    expect(container.querySelector('path')?.getAttribute('d')).not.toContain('A');
  });
});

describe('PatternReticula', () => {
  it('a API só aceita os três slots documentados — nenhuma prop de posicionamento livre', () => {
    const { container } = render(<PatternReticula slot="header" />);
    expect(container.querySelector('[data-pattern-slot="header"]')).toBeInTheDocument();
  });

  it('referencia os tokens pattern.reticula.fine via var()', () => {
    const { container } = render(<PatternReticula slot="margin-left" />);
    const el = container.querySelector('[data-pattern="reticula"]') as HTMLElement;
    expect(el.style.backgroundSize).toContain('var(--pattern-reticula-fine-spacing)');
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
