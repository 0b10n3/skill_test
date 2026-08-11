// Cálculo de contraste WCAG 2.1 (relative luminance / contrast ratio) —
// lógica pura, sem I/O, para ser testável e reutilizável.

function srgbChannel(value) {
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex) {
  const clean = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(clean.slice(i, i + 2), 16) / 255);
  const [rs, gs, bs] = [r, g, b].map(srgbChannel);
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function contrastRatio(hexA, hexB) {
  const l1 = relativeLuminance(hexA);
  const l2 = relativeLuminance(hexB);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export const AA_NORMAL_TEXT = 4.5;
export const AA_LARGE_TEXT_OR_UI = 3.0;
