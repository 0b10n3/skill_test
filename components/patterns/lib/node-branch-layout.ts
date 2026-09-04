export type NodeBranchDensity = 'sparse' | 'default' | 'dense';
export type NodeBranchAnchor = 'corner' | 'field';

export interface NodeBranchLayout {
  /**
   * Uma única string de path SVG, concatenando um subpath (`M...`) por
   * segmento reto e um subpath (`M...A...`) por arco terminal. Funciona
   * como `<path d={layout.d} />` em SVG e como `new Path2D(layout.d)` em
   * Canvas — a mesma geometria pura alimenta os dois consumidores
   * (`PatternNodeBranch.tsx` e `ShareRadarButton.tsx`).
   */
  d: string;
  viewBox: string;
}

const WIDTH = 200;
const HEIGHT = 200;
const MODULE = 40;

const DEPTH_BY_DENSITY: Record<NodeBranchDensity, number> = {
  sparse: 2,
  default: 3,
  dense: 4,
};

const BRANCHES_BY_DENSITY: Record<NodeBranchDensity, number> = {
  sparse: 2,
  default: 2,
  dense: 3,
};

/**
 * Turnos relativos permitidos a partir da direção do galho-pai, em graus —
 * sempre múltiplos de 45°, para que todo segmento fique na grade de 0°,
 * 45°, 90°, 135° (equivalente a 0°/90°/±45° como orientação de reta,
 * DESIGN.md §6.2). Dois galhos ecoam o próprio chevron do símbolo (duas
 * diagonais a ±45° a partir de um ponto); a densidade "dense" acrescenta
 * uma continuação reta.
 */
const TURNS_BY_BRANCH_COUNT: Record<number, number[]> = {
  2: [-45, 45],
  3: [-45, 0, 45],
};

/**
 * PRNG determinístico (mulberry32) com seed fixa — a mesma combinação de
 * density/anchor sempre gera exatamente a mesma geometria, exigido pelo
 * teste de snapshot (critério de aceite do Épico 15, mantido no 26).
 * Nunca usar Math.random/Date.now aqui.
 */
function mulberry32(seed: number): () => number {
  let state = seed;
  return function random() {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

interface RootSpec {
  x: number;
  y: number;
  /** Direção inicial, já na grade de 45°. */
  angle: number;
}

// Ângulos das raízes redefinidos na grade de 45° (eram -70°/-20°/-60°,
// sem relação com o símbolo — Épico 26). Posições preservadas.
const FIELD_ROOTS: RootSpec[] = [
  { x: WIDTH * 0.2, y: HEIGHT * 0.85, angle: -90 },
  { x: WIDTH * 0.75, y: HEIGHT * 0.3, angle: -45 },
];

const CORNER_ROOTS: RootSpec[] = [{ x: 12, y: HEIGHT - 12, angle: -45 }];

/**
 * Ponto final de um quarto de arco de raio `radius`, saindo do ponto
 * `(x, y)` na direção `dirDeg` e virando 90° para o lado `sweep` indica.
 * Corda = radius·√2 — a condição geométrica exata de um arco de 90°
 * (DESIGN.md §6.1). `sweep` segue a convenção do atributo SVG
 * `sweep-flag`: 1 = sentido horário na tela.
 */
function quarterArcEnd(
  x: number,
  y: number,
  dirDeg: number,
  radius: number,
  sweep: 0 | 1,
): { x: number; y: number } {
  const rad = (dirDeg * Math.PI) / 180;
  const dirX = Math.cos(rad);
  const dirY = Math.sin(rad);
  // perp = dir virado 90°; o sinal do turno decide o lado do centro do arco.
  const turnSign = sweep === 1 ? 1 : -1;
  const perpX = -dirY * turnSign;
  const perpY = dirX * turnSign;
  return {
    x: round(x + radius * (dirX + perpX)),
    y: round(y + radius * (dirY + perpY)),
  };
}

export function generateNodeBranchLayout(
  density: NodeBranchDensity = 'default',
  anchor: NodeBranchAnchor = 'field',
): NodeBranchLayout {
  const random = mulberry32(42);
  const depth = DEPTH_BY_DENSITY[density];
  const branchesPerNode = BRANCHES_BY_DENSITY[density];
  const turns = TURNS_BY_BRANCH_COUNT[branchesPerNode];

  const subpaths: string[] = [];

  function branch(x: number, y: number, dirDeg: number, remainingDepth: number): void {
    const rad = (dirDeg * Math.PI) / 180;
    const endX = round(x + MODULE * Math.cos(rad));
    const endY = round(y + MODULE * Math.sin(rad));

    if (endX < 0 || endX > WIDTH || endY < 0 || endY > HEIGHT) return;

    subpaths.push(`M ${x},${y} L ${endX},${endY}`);

    if (remainingDepth <= 1) {
      const sweep: 0 | 1 = random() < 0.5 ? 0 : 1;
      const arcEnd = quarterArcEnd(endX, endY, dirDeg, MODULE, sweep);
      if (arcEnd.x >= 0 && arcEnd.x <= WIDTH && arcEnd.y >= 0 && arcEnd.y <= HEIGHT) {
        subpaths.push(
          `M ${endX},${endY} A ${MODULE},${MODULE} 0 0 ${sweep} ${arcEnd.x},${arcEnd.y}`,
        );
      }
      return;
    }

    for (const turn of turns) {
      // Ordem de sorteio fixa (mesma lista, mesma sequência de random())
      // para determinismo — não embaralhar turns por índice aleatório.
      if (random() < 0.15) continue; // ocasionalmente poda um galho — mesma densidade visual do gerador anterior, sem ruído de ângulo
      branch(endX, endY, dirDeg + turn, remainingDepth - 1);
    }
  }

  const roots = anchor === 'corner' ? CORNER_ROOTS : FIELD_ROOTS;
  for (const root of roots) {
    branch(root.x, root.y, root.angle, depth);
  }

  return { d: subpaths.join(' '), viewBox: `0 0 ${WIDTH} ${HEIGHT}` };
}
