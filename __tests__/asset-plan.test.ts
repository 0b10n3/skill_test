import { describe, expect, it } from 'vitest';
import {
  largestBudgetedFileSize,
  planAssetOutputs,
  withinBudget,
} from '../scripts/lib/asset-plan.mjs';

describe('planAssetOutputs', () => {
  it('gera um output por combinação de largura × formato', () => {
    const outputs = planAssetOutputs({
      slug: 'hero-landing',
      variant: 'light',
      widths: [400, 800],
      formats: ['avif', 'webp'],
    });
    expect(outputs).toHaveLength(4);
    expect(outputs).toContainEqual({
      path: 'public/img/hero-landing/light-400.avif',
      width: 400,
      format: 'avif',
    });
    expect(outputs).toContainEqual({
      path: 'public/img/hero-landing/light-800.webp',
      width: 800,
      format: 'webp',
    });
  });

  it('sem variante, o caminho não inclui o sufixo de variante', () => {
    const outputs = planAssetOutputs({
      slug: 'dimensao-ia-aplicada',
      variant: undefined,
      widths: [800],
      formats: ['avif'],
    });
    expect(outputs).toEqual([
      { path: 'public/img/dimensao-ia-aplicada/800.avif', width: 800, format: 'avif' },
    ]);
  });
});

describe('withinBudget', () => {
  it('true quando o tamanho real está dentro do orçamento em KB', () => {
    expect(withinBudget(100 * 1024, 120)).toBe(true);
    expect(withinBudget(120 * 1024, 120)).toBe(true);
  });

  it('false quando excede o orçamento', () => {
    expect(withinBudget(121 * 1024, 120)).toBe(false);
  });
});

describe('largestBudgetedFileSize', () => {
  it('ignora arquivos PNG (fallback legado isento de orçamento) no cálculo do maior arquivo', () => {
    const files = [
      { path: 'a.avif', width: 800, format: 'avif', sizeBytes: 10_000 },
      { path: 'a.webp', width: 800, format: 'webp', sizeBytes: 12_000 },
      { path: 'a.png', width: 800, format: 'png', sizeBytes: 300_000 },
    ];
    expect(largestBudgetedFileSize(files)).toBe(12_000);
  });

  it('retorna 0 quando só existem arquivos isentos', () => {
    expect(
      largestBudgetedFileSize([{ path: 'a.png', width: 800, format: 'png', sizeBytes: 999 }]),
    ).toBe(0);
  });
});
