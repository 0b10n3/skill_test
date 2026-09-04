export type MeshDensity = 'sparse' | 'default' | 'dense';
export type MeshAnchor = 'corner' | 'field';

export interface MeshLayout {
  /**
   * Uma única string de path SVG, um subpath (`M...L...`) por linha reta.
   * Funciona como `<path d={layout.d} />` em SVG e como `new Path2D(layout.d)`
   * em Canvas — a mesma geometria pura alimenta os dois consumidores
   * (`PatternMesh.tsx` e `ShareRadarButton.tsx`). Substitui
   * `node-branch-layout.ts` (Épico 31 — DESIGN.md §6.2, REVOGACOES.md H9).
   */
  d: string;
  viewBox: string;
}

const WIDTH = 200;
const HEIGHT = 200;
/** Espelha `pattern.mesh.cellSize` ({spacing.lg} = 32px) — mesma correspondência
 * 1 unidade de viewBox = 1px real que `node-branch-layout.ts` já usava para o módulo.
 * Fixo: density nunca muda o tamanho da célula, só quantas linhas da grade aparecem. */
const CELL = 32;
/** Região do anchor="corner" — sempre este tamanho, independente de density
 * (é o que garante corner < field em qualquer densidade, não só por sorte). */
const CORNER_CELLS = 5;

/**
 * "Passo" de linhas desenhadas: 1 = toda linha da grade (dense), 2 = uma
 * sim uma não (default), 3 = uma a cada três (sparse). Malha é regular por
 * natureza — não há aleatoriedade a fixar aqui (diferente do nodeBranch,
 * que precisava de um PRNG determinístico pra escolher galho/turno/arco);
 * density aqui é sub-amostragem da mesma grade, nunca uma grade diferente.
 */
const STRIDE_BY_DENSITY: Record<MeshDensity, number> = {
  sparse: 3,
  default: 2,
  dense: 1,
};

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

interface Region {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

function regionFor(anchor: MeshAnchor): Region {
  if (anchor === 'field') return { x0: 0, y0: 0, x1: WIDTH, y1: HEIGHT };
  const size = CORNER_CELLS * CELL;
  return { x0: 0, y0: HEIGHT - size, x1: size, y1: HEIGHT };
}

export function generateMeshLayout(
  density: MeshDensity = 'default',
  anchor: MeshAnchor = 'field',
): MeshLayout {
  const stride = STRIDE_BY_DENSITY[density];
  const region = regionFor(anchor);
  const subpaths: string[] = [];

  let column = 0;
  for (let x = region.x0; x <= region.x1; x += CELL, column += 1) {
    if (column % stride !== 0) continue;
    subpaths.push(`M ${round(x)},${round(region.y0)} L ${round(x)},${round(region.y1)}`);
  }
  let row = 0;
  for (let y = region.y0; y <= region.y1; y += CELL, row += 1) {
    if (row % stride !== 0) continue;
    subpaths.push(`M ${round(region.x0)},${round(y)} L ${round(region.x1)},${round(y)}`);
  }

  return { d: subpaths.join(' '), viewBox: `0 0 ${WIDTH} ${HEIGHT}` };
}
