import { describe, expect, it } from 'vitest';
import { generateGrowthLineLayout } from '@/components/patterns/lib/growth-line-layout';
import { generateNodeBranchLayout } from '@/components/patterns/lib/node-branch-layout';

/** Comprimento euclidiano de um segmento `M x1,y1 L x2,y2`. */
function lineLength(x1: number, y1: number, x2: number, y2: number): number {
  return Math.hypot(x2 - x1, y2 - y1);
}

const MODULE = 40;
const ALLOWED_ANGLES_MOD_180 = [0, 45, 90, 135];

/** Ângulo de uma reta (mod 180°, orientação — não direção) em graus, 0-179.99. */
function lineAngleMod180(x1: number, y1: number, x2: number, y2: number): number {
  const deg = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return ((deg % 180) + 180) % 180;
}

describe('generateNodeBranchLayout', () => {
  it('é determinístico: a mesma density/anchor produz sempre a mesma geometria', () => {
    const a = generateNodeBranchLayout('default', 'field');
    const b = generateNodeBranchLayout('default', 'field');
    expect(a).toEqual(b);
  });

  it('density maior produz path mais longo (sparse < default < dense)', () => {
    const sparse = generateNodeBranchLayout('sparse', 'field');
    const defaultDensity = generateNodeBranchLayout('default', 'field');
    const dense = generateNodeBranchLayout('dense', 'field');
    expect(sparse.d.length).toBeLessThan(defaultDensity.d.length);
    expect(defaultDensity.d.length).toBeLessThan(dense.d.length);
  });

  it('todo segmento reto tem ângulo 0°, 45°, 90° ou 135° (mod 180°) e comprimento igual ao módulo', () => {
    const layout = generateNodeBranchLayout('dense', 'field');
    const lineSubpaths = layout.d.split(' M ').filter((sub) => !sub.includes('A'));
    expect(lineSubpaths.length).toBeGreaterThan(0);
    for (const sub of lineSubpaths) {
      const match = sub.match(/(-?[\d.]+),(-?[\d.]+)\s+L\s+(-?[\d.]+),(-?[\d.]+)/);
      expect(match).not.toBeNull();
      const [, x1, y1, x2, y2] = match!.map(Number) as unknown as [
        never,
        number,
        number,
        number,
        number,
      ];
      const angle = lineAngleMod180(x1, y1, x2, y2);
      const closest = ALLOWED_ANGLES_MOD_180.reduce((a, b) =>
        Math.abs(b - angle) < Math.abs(a - angle) ? b : a,
      );
      expect(Math.abs(angle - closest)).toBeLessThan(0.01);
      expect(lineLength(x1, y1, x2, y2)).toBeCloseTo(MODULE, 1);
    }
  });

  it('toda terminação em arco tem corda = módulo·√2 (arco de exatos 90°, raio = módulo)', () => {
    const layout = generateNodeBranchLayout('dense', 'field');
    const arcSubpaths = layout.d.split(' M ').filter((sub) => sub.includes('A'));
    expect(arcSubpaths.length).toBeGreaterThan(0);
    for (const sub of arcSubpaths) {
      const match = sub.match(
        /(-?[\d.]+),(-?[\d.]+)\s+A\s+[\d.]+,[\d.]+\s+0\s+0\s+[01]\s+(-?[\d.]+),(-?[\d.]+)/,
      );
      expect(match).not.toBeNull();
      const [, x1, y1, x2, y2] = match!.map(Number) as unknown as [
        never,
        number,
        number,
        number,
        number,
      ];
      expect(lineLength(x1, y1, x2, y2)).toBeCloseTo(MODULE * Math.sqrt(2), 1);
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
