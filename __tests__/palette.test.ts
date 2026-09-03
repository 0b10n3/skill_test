import { describe, expect, it } from 'vitest';
import {
  colorDistance,
  nearestPaletteDistance,
  passesAdherence,
  pointToSegmentDistance,
  sampleAdherence,
  sampleSegmentAdherence,
} from '../scripts/lib/palette.mjs';

const PALETTE = ['#1B6A45', '#2D9E67', '#CDF163', '#F7F7F5', '#141414'];

describe('colorDistance', () => {
  it('é 0 para a mesma cor', () => {
    expect(colorDistance({ r: 10, g: 20, b: 30 }, { r: 10, g: 20, b: 30 })).toBe(0);
  });

  it('é positiva para cores diferentes', () => {
    expect(colorDistance({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 })).toBeGreaterThan(0);
  });
});

describe('nearestPaletteDistance', () => {
  it('é 0 quando o pixel é exatamente uma cor da paleta', () => {
    expect(nearestPaletteDistance({ r: 27, g: 106, b: 69 }, PALETTE)).toBe(0);
  });

  it('encontra a cor mais próxima, não a primeira da lista', () => {
    // Próximo de #141414 (ink), bem longe das outras.
    const distance = nearestPaletteDistance({ r: 20, g: 20, b: 20 }, PALETTE);
    expect(distance).toBeLessThan(10);
  });
});

describe('sampleAdherence / passesAdherence', () => {
  it('matchRatio=1 quando todos os pixels são exatamente cores da paleta', () => {
    const pixels = [
      { r: 27, g: 106, b: 69 },
      { r: 247, g: 247, b: 245 },
    ];
    const adherence = sampleAdherence(pixels, PALETTE);
    expect(adherence.matchRatio).toBe(1);
    expect(passesAdherence(adherence)).toBe(true);
  });

  it('falha quando a maioria dos pixels está longe da paleta (cor fora do sistema)', () => {
    const pixels = Array.from({ length: 100 }, () => ({ r: 255, g: 0, b: 255 })); // magenta, não está na paleta
    const adherence = sampleAdherence(pixels, PALETTE);
    expect(passesAdherence(adherence)).toBe(false);
  });

  it('array vazio de pixels não quebra e retorna matchRatio=1 (nada para reprovar)', () => {
    const adherence = sampleAdherence([], PALETTE);
    expect(adherence.matchRatio).toBe(1);
    expect(adherence.sampleCount).toBe(0);
  });
});

describe('pointToSegmentDistance', () => {
  const a = { r: 0, g: 0, b: 0 };
  const b = { r: 100, g: 0, b: 0 };

  it('é 0 para um ponto sobre o segmento', () => {
    expect(pointToSegmentDistance({ r: 50, g: 0, b: 0 }, a, b)).toBe(0);
  });

  it('é 0 nas duas extremidades', () => {
    expect(pointToSegmentDistance(a, a, b)).toBe(0);
    expect(pointToSegmentDistance(b, a, b)).toBe(0);
  });

  it('projeta no ponto mais próximo do segmento, não da reta infinita — ponto "antes" de A clampa em A', () => {
    expect(pointToSegmentDistance({ r: -50, g: 0, b: 0 }, a, b)).toBe(50);
  });

  it('mede a distância perpendicular para um ponto fora do segmento', () => {
    expect(pointToSegmentDistance({ r: 50, g: 30, b: 0 }, a, b)).toBe(30);
  });
});

describe('sampleSegmentAdherence — motivado por um caso real: duotone de gradiente reprova em sampleAdherence', () => {
  it('um gradiente correto entre duas cores passa no segmento mesmo estando longe das duas cores individualmente', () => {
    // Pixels no meio do caminho entre #000000 e #FFFFFF — nearestPaletteDistance
    // reprovaria isso (longe de ambas as pontas), mas é exatamente o
    // resultado ESPERADO de um duotone correto.
    const midPixels = [
      { r: 60, g: 60, b: 60 },
      { r: 128, g: 128, b: 128 },
      { r: 200, g: 200, b: 200 },
    ];
    const wrongCheck = sampleAdherence(midPixels, ['#000000', '#FFFFFF']);
    expect(passesAdherence(wrongCheck)).toBe(false);

    const rightCheck = sampleSegmentAdherence(midPixels, '#000000', '#FFFFFF');
    expect(passesAdherence(rightCheck)).toBe(true);
  });

  it('reprova um pixel fora do segmento (cor não relacionada ao duotone)', () => {
    const pixels = Array.from({ length: 100 }, () => ({ r: 255, g: 0, b: 255 })); // magenta, fora do segmento preto-branco
    const adherence = sampleSegmentAdherence(pixels, '#000000', '#FFFFFF');
    expect(passesAdherence(adherence)).toBe(false);
  });
});
