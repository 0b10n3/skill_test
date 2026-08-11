/**
 * Verificação de aderência de paleta (Épico 16): amostra pixels de um
 * asset publicado e confere se cada um cai perto o bastante de alguma
 * cor da paleta da marca. Usado tanto pelo script de CI
 * (verify-asset-palette.mjs) quanto testável isoladamente aqui.
 */
import { hexToRgb } from './duotone.mjs';

/** Distância euclidiana em RGB — mesma métrica simples usada no resto do projeto (ver scripts/lib/contrast.mjs para o análogo de contraste). */
export function colorDistance(a, b) {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

export function nearestPaletteDistance(rgb, paletteHexes) {
  let min = Infinity;
  for (const hex of paletteHexes) {
    const distance = colorDistance(rgb, hexToRgb(hex));
    if (distance < min) min = distance;
  }
  return min;
}

/**
 * Distância de um pixel ao SEGMENTO de reta entre duas cores RGB (não à
 * reta infinita, e não ao ponto mais próximo entre as duas
 * extremidades). É a métrica certa para validar um asset corrigido por
 * duotone (scripts/lib/duotone.mjs): todo pixel de um duotone correto
 * fica EXATAMENTE sobre esse segmento — a maioria dos pixels de um
 * gradiente fica longe das duas cores individualmente (dark/light), mas
 * perto do segmento entre elas. Checar contra `nearestPaletteDistance`
 * aqui reprovaria um duotone perfeito.
 */
export function pointToSegmentDistance(point, a, b) {
  const ab = { r: b.r - a.r, g: b.g - a.g, b: b.b - a.b };
  const ap = { r: point.r - a.r, g: point.g - a.g, b: point.b - a.b };
  const abLengthSquared = ab.r ** 2 + ab.g ** 2 + ab.b ** 2;
  const t =
    abLengthSquared === 0
      ? 0
      : Math.min(1, Math.max(0, (ap.r * ab.r + ap.g * ab.g + ap.b * ab.b) / abLengthSquared));
  const closest = { r: a.r + ab.r * t, g: a.g + ab.g * t, b: a.b + ab.b * t };
  return colorDistance(point, closest);
}

/**
 * Amostra uma lista de pixels {r,g,b} contra a paleta e retorna a
 * proporção que fica dentro da tolerância (distância euclidiana em RGB,
 * escala 0-441 = distância máxima possível entre preto e branco).
 *
 * Tolerância documentada: 24 (~5.4% da distância máxima) — cobre
 * variação de compressão AVIF/WebP sem aceitar cor claramente fora da
 * paleta. minMatchRatio documentado: 0.9 — 10% dos pixels podem ser
 * anti-aliasing/borda entre duas cores da paleta, o que naturalmente cai
 * fora da tolerância mesmo em uma imagem corretamente processada.
 */
export const PALETTE_TOLERANCE = 24;
export const MIN_MATCH_RATIO = 0.9;

export function sampleAdherence(pixels, paletteHexes, tolerance = PALETTE_TOLERANCE) {
  if (pixels.length === 0) {
    return { matchRatio: 1, sampleCount: 0, tolerance };
  }
  let matched = 0;
  for (const pixel of pixels) {
    if (nearestPaletteDistance(pixel, paletteHexes) <= tolerance) matched += 1;
  }
  return { matchRatio: matched / pixels.length, sampleCount: pixels.length, tolerance };
}

export function passesAdherence(adherence, minMatchRatio = MIN_MATCH_RATIO) {
  return adherence.matchRatio >= minMatchRatio;
}

/**
 * Mesma ideia de `sampleAdherence`, mas contra o segmento darkHex↔lightHex
 * em vez de uma lista de cores discretas — usar para assets processados
 * por `applyDuotone` (scripts/lib/duotone.mjs), onde o resultado esperado
 * é um gradiente contínuo entre as duas cores, não pixels concentrados
 * perto de uma das duas extremidades.
 */
export function sampleSegmentAdherence(pixels, darkHex, lightHex, tolerance = PALETTE_TOLERANCE) {
  if (pixels.length === 0) {
    return { matchRatio: 1, sampleCount: 0, tolerance };
  }
  const dark = hexToRgb(darkHex);
  const light = hexToRgb(lightHex);
  let matched = 0;
  for (const pixel of pixels) {
    if (pointToSegmentDistance(pixel, dark, light) <= tolerance) matched += 1;
  }
  return { matchRatio: matched / pixels.length, sampleCount: pixels.length, tolerance };
}
