import { describe, expect, it } from 'vitest';
import tokens from '@/design/tokens.json';
import { generateGrowthLineLayout } from '@/components/patterns/lib/growth-line-layout';
import { generateNodeBranchLayout } from '@/components/patterns/lib/node-branch-layout';

describe('generateNodeBranchLayout', () => {
  const MODULE = Number.parseFloat(tokens.pattern.nodeBranch.module.$value);

  it('é determinístico: a mesma density/anchor produz sempre a mesma geometria', () => {
    const a = generateNodeBranchLayout('default', 'field');
    const b = generateNodeBranchLayout('default', 'field');
    expect(a).toEqual(b);
  });

  it('density maior produz mais galhos (sparse < default < dense)', () => {
    const sparse = generateNodeBranchLayout('sparse', 'field');
    const defaultDensity = generateNodeBranchLayout('default', 'field');
    const dense = generateNodeBranchLayout('dense', 'field');
    expect(sparse.paths.length).toBeLessThan(defaultDensity.paths.length);
    expect(defaultDensity.paths.length).toBeLessThan(dense.paths.length);
  });

  // A regra que a v2.1 não permitia afirmar: o pattern gerava galhos em ângulo
  // pseudoaleatório e nenhum deles coincidia com a geometria do símbolo.
  it('todo galho está em 0°, 90° ou ±45° e tem comprimento múltiplo do módulo', () => {
    for (const density of ['sparse', 'default', 'dense'] as const) {
      for (const { paths } of [generateNodeBranchLayout(density, 'field')]) {
        const linhas = paths.filter((d) => d.includes(' L '));
        expect(linhas.length).toBeGreaterThan(0);
        for (const d of linhas) {
          const [, x1, y1, x2, y2] = d.match(/M (\S+) (\S+) L (\S+) (\S+)/)!.map(Number);
          const dx = Math.abs(x2 - x1);
          const dy = Math.abs(y2 - y1);
          // ortogonal (um delta zero) ou diagonal exata (deltas iguais)
          expect(dx === 0 || dy === 0 || dx === dy).toBe(true);
          expect(Math.max(dx, dy)).toBe(MODULE);
        }
      }
    }
  });

  it('todo galho terminal acaba em quarto de arco de raio igual ao módulo', () => {
    const { paths } = generateNodeBranchLayout('default', 'field');
    const arcos = paths.filter((d) => d.includes(' A '));
    expect(arcos.length).toBeGreaterThan(0);
    for (const d of arcos) {
      expect(d).toContain(`A ${MODULE} ${MODULE} 0 0 1`);
    }
  });

  // Regressão: a primeira versão não normalizava o vetor de direção, e num
  // galho diagonal a corda saía com 2·módulo — um semicírculo, não um quarto.
  it('a corda de todo arco é módulo·√2 — quarto de arco, nunca meia-volta', () => {
    for (const density of ['sparse', 'default', 'dense'] as const) {
      const { paths } = generateNodeBranchLayout(density, 'field');
      for (const d of paths.filter((p) => p.includes(' A '))) {
        const [, x1, y1, x2, y2] = d
          .match(/M (\S+) (\S+) A \S+ \S+ 0 0 1 (\S+) (\S+)/)!
          .map(Number);
        expect(Math.hypot(x2 - x1, y2 - y1)).toBeCloseTo(MODULE * Math.SQRT2, 1);
      }
    }
  });

  it('nenhum galho é desenhado duas vezes', () => {
    const { paths } = generateNodeBranchLayout('dense', 'field');
    const linhas = paths.filter((d) => d.includes(' L '));
    const canonicas = linhas.map((d) => {
      const [, ...n] = d.match(/M (\S+) (\S+) L (\S+) (\S+)/)!;
      return n.map(Number).sort().join(':');
    });
    expect(new Set(canonicas).size).toBe(canonicas.length);
  });

  it('não existe nenhum comando de curva além do quarto de arco — nem C, nem Q, nem S', () => {
    const { paths } = generateNodeBranchLayout('dense', 'field');
    for (const d of paths) {
      expect(d).not.toMatch(/[CQSTcqst]/);
    }
  });

  it('nada sai do viewBox', () => {
    const { paths, viewBox } = generateNodeBranchLayout('dense', 'field');
    const [, , w, h] = viewBox.split(' ').map(Number);
    for (const d of paths) {
      for (const [, x, y] of d.matchAll(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)(?= |$)/g)) {
        expect(Number(x)).toBeGreaterThanOrEqual(0);
        expect(Number(x)).toBeLessThanOrEqual(w);
        expect(Number(y)).toBeGreaterThanOrEqual(0);
        expect(Number(y)).toBeLessThanOrEqual(h);
      }
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
