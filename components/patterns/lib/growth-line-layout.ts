export interface GrowthLineLayout {
  points: string;
  viewBox: string;
}

const STEP_WIDTH = 30;
const STEP_HEIGHT = 15;
const PADDING = 10;

/**
 * Gera uma polilinha em degraus retos ascendentes (nunca curva, nunca
 * candlestick — DESIGN.md §5.2/§5.4). Determinístico por construção: sem
 * aleatoriedade, então nem precisa de seed.
 */
export function generateGrowthLineLayout(steps: number = 4): GrowthLineLayout {
  const safeSteps = Math.max(1, Math.round(steps));
  const startY = safeSteps * STEP_HEIGHT + PADDING;

  let x = PADDING;
  let y = startY;
  const coords: Array<[number, number]> = [[x, y]];

  for (let i = 0; i < safeSteps; i += 1) {
    x += STEP_WIDTH;
    coords.push([x, y]);
    y -= STEP_HEIGHT;
    coords.push([x, y]);
  }

  const width = x + PADDING;
  const height = startY + PADDING;
  const points = coords.map(([px, py]) => `${px},${py}`).join(' ');

  return { points, viewBox: `0 0 ${width} ${height}` };
}
