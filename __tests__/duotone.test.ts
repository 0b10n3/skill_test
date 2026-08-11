import { describe, expect, it } from 'vitest';
import { applyDuotone, hexToRgb, lerpColor, luminance } from '../scripts/lib/duotone.mjs';

describe('hexToRgb', () => {
  it('converte hex para {r,g,b}', () => {
    expect(hexToRgb('#1B6A45')).toEqual({ r: 27, g: 106, b: 69 });
    expect(hexToRgb('F7F7F5')).toEqual({ r: 247, g: 247, b: 245 });
  });
});

describe('luminance', () => {
  it('preto é 0, branco é 1', () => {
    expect(luminance(0, 0, 0)).toBe(0);
    expect(luminance(255, 255, 255)).toBeCloseTo(1, 5);
  });
});

describe('lerpColor', () => {
  it('t=0 retorna a cor a, t=1 retorna a cor b', () => {
    const a = { r: 0, g: 0, b: 0 };
    const b = { r: 255, g: 255, b: 255 };
    expect(lerpColor(a, b, 0)).toEqual(a);
    expect(lerpColor(a, b, 1)).toEqual(b);
  });

  it('clampa t fora de [0,1]', () => {
    const a = { r: 0, g: 0, b: 0 };
    const b = { r: 100, g: 100, b: 100 };
    expect(lerpColor(a, b, -1)).toEqual(a);
    expect(lerpColor(a, b, 2)).toEqual(b);
  });
});

describe('applyDuotone', () => {
  it('remapeia um pixel preto para o hex escuro e um pixel branco para o hex claro', () => {
    const raw = Buffer.from([0, 0, 0, 255, 255, 255]);
    const result = applyDuotone(raw, '#1B6A45', '#F7F7F5');
    expect([result[0], result[1], result[2]]).toEqual([27, 106, 69]);
    expect([result[3], result[4], result[5]]).toEqual([247, 247, 245]);
  });

  it('todo pixel de saída fica exatamente na reta entre os dois hexes — nunca fora da paleta por construção', () => {
    const raw = Buffer.from([10, 40, 90, 128, 128, 128, 200, 200, 10]);
    const result = applyDuotone(raw, '#000000', '#FFFFFF');
    for (let i = 0; i < result.length; i += 3) {
      // Em escala de cinza pura, r=g=b sempre que dark/light são preto/branco.
      expect(result[i]).toBe(result[i + 1]);
      expect(result[i + 1]).toBe(result[i + 2]);
    }
  });
});
