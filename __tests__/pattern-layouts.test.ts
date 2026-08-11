import { describe, expect, it } from 'vitest';
import { generateGrowthLineLayout } from '@/components/patterns/lib/growth-line-layout';
import { generateNodeBranchLayout } from '@/components/patterns/lib/node-branch-layout';

describe('generateNodeBranchLayout', () => {
  it('é determinístico: a mesma density/anchor produz sempre a mesma geometria', () => {
    const a = generateNodeBranchLayout('default', 'field');
    const b = generateNodeBranchLayout('default', 'field');
    expect(a).toEqual(b);
  });

  it('density maior produz mais nós (sparse < default < dense)', () => {
    const sparse = generateNodeBranchLayout('sparse', 'field');
    const defaultDensity = generateNodeBranchLayout('default', 'field');
    const dense = generateNodeBranchLayout('dense', 'field');
    expect(sparse.nodes.length).toBeLessThan(defaultDensity.nodes.length);
    expect(defaultDensity.nodes.length).toBeLessThan(dense.nodes.length);
  });

  it('todo edge referencia índices de nós existentes', () => {
    const layout = generateNodeBranchLayout('dense', 'field');
    for (const edge of layout.edges) {
      expect(layout.nodes[edge.from]).toBeDefined();
      expect(layout.nodes[edge.to]).toBeDefined();
    }
  });

  it('snapshot de geometria — density=default, anchor=field', () => {
    expect(generateNodeBranchLayout('default', 'field')).toMatchSnapshot();
  });

  it('snapshot de geometria — anchor=corner produz layout diferente de field', () => {
    const corner = generateNodeBranchLayout('default', 'corner');
    const field = generateNodeBranchLayout('default', 'field');
    expect(corner).toMatchSnapshot();
    expect(corner).not.toEqual(field);
  });
});

describe('generateGrowthLineLayout', () => {
  it('gera degraus retos (sem curvas): todo segmento é puramente horizontal ou vertical', () => {
    const layout = generateGrowthLineLayout(5);
    const coords = layout.points.split(' ').map((pair) => pair.split(',').map(Number));
    for (let i = 1; i < coords.length; i += 1) {
      const [x1, y1] = coords[i - 1];
      const [x2, y2] = coords[i];
      const isHorizontal = y1 === y2;
      const isVertical = x1 === x2;
      expect(isHorizontal || isVertical).toBe(true);
    }
  });

  it('é ascendente: y diminui a cada degrau (SVG cresce para baixo)', () => {
    const layout = generateGrowthLineLayout(4);
    const coords = layout.points.split(' ').map((pair) => pair.split(',').map(Number));
    const firstY = coords[0][1];
    const lastY = coords[coords.length - 1][1];
    expect(lastY).toBeLessThan(firstY);
  });

  it('snapshot de geometria — 4 degraus', () => {
    expect(generateGrowthLineLayout(4)).toMatchSnapshot();
  });
});
