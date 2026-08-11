export type NodeBranchDensity = 'sparse' | 'default' | 'dense';
export type NodeBranchAnchor = 'corner' | 'field';

export interface NodeBranchPoint {
  x: number;
  y: number;
}

export interface NodeBranchEdge {
  from: number;
  to: number;
}

export interface NodeBranchLayout {
  nodes: NodeBranchPoint[];
  edges: NodeBranchEdge[];
  viewBox: string;
}

const WIDTH = 200;
const HEIGHT = 200;

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
 * PRNG determinístico (mulberry32) com seed fixa — a mesma combinação de
 * density/anchor sempre gera exatamente a mesma geometria, o que é
 * exigido para o teste de snapshot do SVG (critério de aceite do Épico 15).
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
  angle: number;
}

const FIELD_ROOTS: RootSpec[] = [
  { x: WIDTH * 0.2, y: HEIGHT * 0.85, angle: -70 },
  { x: WIDTH * 0.75, y: HEIGHT * 0.3, angle: -20 },
];

const CORNER_ROOTS: RootSpec[] = [{ x: 12, y: HEIGHT - 12, angle: -60 }];

/**
 * Gera nós (círculos) conectados por galhos (linhas) em estrutura
 * ramificada — referência a árvore sintática / AST / árvore de decisão
 * (DESIGN.md §5.1-5.2). Determinístico: sempre a mesma seed.
 */
export function generateNodeBranchLayout(
  density: NodeBranchDensity = 'default',
  anchor: NodeBranchAnchor = 'field',
): NodeBranchLayout {
  const random = mulberry32(42);
  const depth = DEPTH_BY_DENSITY[density];
  const branchesPerNode = BRANCHES_BY_DENSITY[density];

  const nodes: NodeBranchPoint[] = [];
  const edges: NodeBranchEdge[] = [];

  function addNode(x: number, y: number): number {
    nodes.push({ x: round(x), y: round(y) });
    return nodes.length - 1;
  }

  function branch(
    parentIndex: number,
    x: number,
    y: number,
    angle: number,
    length: number,
    remainingDepth: number,
  ): void {
    if (remainingDepth <= 0) return;

    for (let i = 0; i < branchesPerNode; i += 1) {
      const spread = (random() - 0.5) * 50;
      const childAngle = angle + spread + (i - (branchesPerNode - 1) / 2) * 35;
      const radians = (childAngle * Math.PI) / 180;
      const childX = x + Math.cos(radians) * length;
      const childY = y + Math.sin(radians) * length;

      if (childX < 0 || childX > WIDTH || childY < 0 || childY > HEIGHT) continue;

      const childIndex = addNode(childX, childY);
      edges.push({ from: parentIndex, to: childIndex });
      branch(childIndex, childX, childY, childAngle, length * 0.72, remainingDepth - 1);
    }
  }

  const roots = anchor === 'corner' ? CORNER_ROOTS : FIELD_ROOTS;
  for (const root of roots) {
    const rootIndex = addNode(root.x, root.y);
    branch(rootIndex, root.x, root.y, root.angle, 42, depth);
  }

  return { nodes, edges, viewBox: `0 0 ${WIDTH} ${HEIGHT}` };
}
