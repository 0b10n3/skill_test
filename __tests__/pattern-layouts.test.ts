import { describe, expect, it } from 'vitest';
import { generateGrowthLineLayout } from '@/components/patterns/lib/growth-line-layout';
import { generateMeshLayout } from '@/components/patterns/lib/mesh-layout';

const CELL = 32;

/** Extrai [x1,y1,x2,y2] de um subpath `M x1,y1 L x2,y2`. */
function parseSegment(sub: string): [number, number, number, number] {
  const match = sub.match(/(-?[\d.]+),(-?[\d.]+)\s+L\s+(-?[\d.]+),(-?[\d.]+)/);
  expect(match).not.toBeNull();
  const [, x1, y1, x2, y2] = match!.map(Number) as unknown as [never, number, number, number, number];
  return [x1, y1, x2, y2];
}

describe('generateMeshLayout', () => {
  it('é determinístico: a mesma density/anchor produz sempre a mesma geometria', () => {
    const a = generateMeshLayout('default', 'field');
    const b = generateMeshLayout('default', 'field');
    expect(a).toEqual(b);
  });

  it('density maior produz mais linhas (sparse < default < dense)', () => {
    const sparse = generateMeshLayout('sparse', 'field');
    const defaultDensity = generateMeshLayout('default', 'field');
    const dense = generateMeshLayout('dense', 'field');
    expect(sparse.d.length).toBeLessThan(defaultDensity.d.length);
    expect(defaultDensity.d.length).toBeLessThan(dense.d.length);
  });

  it('todo segmento é puramente horizontal ou vertical — nenhuma diagonal, nenhuma curva (DESIGN.md §6.2)', () => {
    const layout = generateMeshLayout('dense', 'field');
    const subpaths = layout.d.split(' M ').filter(Boolean);
    expect(subpaths.length).toBeGreaterThan(0);
    expect(layout.d.includes('A')).toBe(false); // sem arco — mesh não disputa a exceção de curva do símbolo
    for (const sub of subpaths) {
      const [x1, y1, x2, y2] = parseSegment(sub);
      const isHorizontal = y1 === y2;
      const isVertical = x1 === x2;
      expect(isHorizontal || isVertical).toBe(true);
    }
  });

  it('linhas verticais consecutivas distam exatamente uma célula (pattern.mesh.cellSize = 32px)', () => {
    const layout = generateMeshLayout('dense', 'field');
    const subpaths = layout.d.split(' M ').filter(Boolean);
    const verticalXs = subpaths
      .map(parseSegment)
      .filter(([x1, y1, x2, y2]) => x1 === x2 && y1 !== y2)
      .map(([x1]) => x1)
      .sort((a, b) => a - b);
    for (let i = 1; i < verticalXs.length; i += 1) {
      expect(verticalXs[i] - verticalXs[i - 1]).toBeCloseTo(CELL, 5);
    }
  });

  it('anchor=corner confina a malha a uma região menor que field', () => {
    const corner = generateMeshLayout('default', 'corner');
    const field = generateMeshLayout('default', 'field');
    expect(corner.d.length).toBeLessThan(field.d.length);
    expect(corner).not.toEqual(field);
  });

  it('snapshot de geometria — density=default, anchor=field', () => {
    expect(generateMeshLayout('default', 'field')).toMatchSnapshot();
  });

  it('snapshot de geometria — anchor=corner produz layout diferente de field', () => {
    expect(generateMeshLayout('default', 'corner')).toMatchSnapshot();
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
