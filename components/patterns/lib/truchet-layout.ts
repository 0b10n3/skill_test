export interface TruchetLayout {
  viewBox: string;
  /** Faixas em `grove.500`: dois quartos de anel por célula, em cantos opostos. */
  d: string;
  /** Faixas raras em `grove.300` — no máximo 1 célula em 12 (DESIGN.md §6.6). */
  dRaro: string;
}

/** Unidade de viewBox = 1 célula de 120: o SVG escala para o tamanho real do bloco. */
const K = 120;
/** Faixa = 22% da célula, centrada no raio de meia célula (DESIGN.md §6.6). */
const W = K * 0.22;

// PRNG determinístico (mulberry32) — semente fixa, o mosaico é reprodutível.
function prng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r = (n: number) => Math.round(n * 100) / 100;

/** Quarto de anel com centro no canto (cx, cy), raios r1 < r2, no quadrante (sx, sy). */
function quartoAnel(cx: number, cy: number, sx: number, sy: number) {
  const r1 = K / 2 - W / 2;
  const r2 = K / 2 + W / 2;
  const v = sx * sy > 0 ? 1 : 0;
  return (
    `M${r(cx + sx * r2)} ${cy} A${r(r2)} ${r(r2)} 0 0 ${v} ${cx} ${r(cy + sy * r2)} ` +
    `L${cx} ${r(cy + sy * r1)} A${r(r1)} ${r(r1)} 0 0 ${1 - v} ${r(cx + sx * r1)} ${cy} Z`
  );
}

/**
 * Mosaico Truchet (DESIGN.md v4.1 §6.6): cada célula leva dois quartos de
 * anel em cantos opostos, girada por sorteio de semente fixa — as vizinhas
 * se ligam em curvas contínuas. A única curva é o quarto de arco do símbolo.
 */
export function generateTruchetLayout(cols: number, rows: number, seed = 4): TruchetLayout {
  const rand = prng(seed);
  const tetoRaro = Math.floor((cols * rows) / 12);
  let raros = 0;
  const d: string[] = [];
  const dRaro: string[] = [];
  for (let l = 0; l < rows; l++) {
    for (let c = 0; c < cols; c++) {
      const x = c * K;
      const y = l * K;
      const girar = rand() > 0.5;
      const raro = rand() > 0.92 && raros < tetoRaro;
      if (raro) raros++;
      const cantos: [number, number, number, number][] = girar
        ? [
            [x, y, 1, 1],
            [x + K, y + K, -1, -1],
          ]
        : [
            [x + K, y, -1, 1],
            [x, y + K, 1, -1],
          ];
      (raro ? dRaro : d).push(...cantos.map(([cx, cy, sx, sy]) => quartoAnel(cx, cy, sx, sy)));
    }
  }
  return { viewBox: `0 0 ${cols * K} ${rows * K}`, d: d.join(' '), dRaro: dRaro.join(' ') };
}
