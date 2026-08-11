/**
 * Correção de cor por duotone (Épico 16, REDESIGN.md §4 item 4): remapeia
 * cada pixel para um ponto na reta entre duas cores exatas dos tokens,
 * pela luminância do pixel original. Isso garante aderência EXATA à
 * paleta por construção — não "aproximado", nunca uma cor fora dos
 * hexes dos tokens (verificável por scripts/verify-asset-palette.mjs).
 */

export function hexToRgb(hex) {
  const normalized = hex.replace('#', '');
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

/** Luminância perceptual (Rec. 601), 0-1, de um pixel RGB (0-255). */
export function luminance(r, g, b) {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/** Interpola linearmente entre duas cores RGB, t em [0,1]. */
export function lerpColor(a, b, t) {
  const clamped = Math.min(1, Math.max(0, t));
  return {
    r: Math.round(a.r + (b.r - a.r) * clamped),
    g: Math.round(a.g + (b.g - a.g) * clamped),
    b: Math.round(a.b + (b.b - a.b) * clamped),
  };
}

/**
 * Remapeia um buffer RGB bruto (raw, 3 canais) para um duotone entre
 * darkHex (luminância 0) e lightHex (luminância 1). Retorna um novo
 * Buffer do mesmo tamanho.
 */
export function applyDuotone(rawBuffer, darkHex, lightHex) {
  const dark = hexToRgb(darkHex);
  const light = hexToRgb(lightHex);
  const output = Buffer.alloc(rawBuffer.length);

  for (let i = 0; i < rawBuffer.length; i += 3) {
    const t = luminance(rawBuffer[i], rawBuffer[i + 1], rawBuffer[i + 2]);
    const { r, g, b } = lerpColor(dark, light, t);
    output[i] = r;
    output[i + 1] = g;
    output[i + 2] = b;
  }

  return output;
}
