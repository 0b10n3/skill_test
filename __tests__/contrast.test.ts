import { describe, expect, it } from 'vitest';
import { AA_LARGE_TEXT_OR_UI, AA_NORMAL_TEXT, contrastRatio } from '../scripts/lib/contrast.mjs';

describe('contrastRatio', () => {
  it('preto sobre branco é o contraste máximo (21:1)', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 0);
  });

  it('uma cor contra ela mesma é o contraste mínimo (1:1)', () => {
    expect(contrastRatio('#1B6A45', '#1B6A45')).toBeCloseTo(1, 5);
  });

  it('é simétrico (ordem dos argumentos não importa)', () => {
    expect(contrastRatio('#1B6A45', '#F7F7F5')).toBeCloseTo(contrastRatio('#F7F7F5', '#1B6A45'), 5);
  });

  it('Forest-500 sobre Chalk passa AA de texto normal (4.5:1)', () => {
    expect(contrastRatio('#1B6A45', '#F7F7F5')).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
  });

  it('Lime-500 sobre Chalk falha até o limiar de texto grande/UI (3:1) — achado conhecido (DESIGN.md v2.0: lime-500 nunca é texto pequeno sobre claro)', () => {
    const ratio = contrastRatio('#CDF163', '#F7F7F5');
    expect(ratio).toBeLessThan(AA_LARGE_TEXT_OR_UI);
  });
});
