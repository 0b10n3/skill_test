import tokens from '@/design/tokens.json';

export type NodeBranchDensity = 'sparse' | 'default' | 'dense';
export type NodeBranchAnchor = 'corner' | 'field';

export interface NodeBranchLayout {
  /** Comandos SVG, um por galho ou terminação. Só M/L/H/V/A aparecem aqui. */
  paths: string[];
  viewBox: string;
}

const WIDTH = 200;
const HEIGHT = 200;

/**
 * Módulo da gramática, lido do token — não copiado. `arcRadius` é alias de
 * `module` no tokens.json (a proporção é a do próprio símbolo: raio do arco
 * = 0,97 M), então o raio do arco é o mesmo número.
 */
const MODULE = Number.parseFloat(tokens.pattern.nodeBranch.module.$value);

/**
 * As únicas direções que a gramática do símbolo permite: 0°, 90° e ±45°
 * (DESIGN.md v3.0 §6.2). Nenhum ângulo arbitrário — era exatamente isso que a
 * versão anterior deste arquivo produzia, com ruído pseudoaleatório de ±25°
 * sobre raízes em −70°, −20° e −60°.
 */
const DIRECTIONS = [
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
] as const;

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
 * density/anchor sempre gera exatamente a mesma geometria, o que é exigido
 * pelo teste de snapshot. Nunca usar Math.random/Date.now aqui.
 *
 * A diferença para a versão anterior: o sorteio escolhe **entre as quatro
 * direções permitidas**, em vez de somar ruído a um ângulo. Aleatoriedade
 * discreta não consegue produzir um galho fora da gramática.
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

const round = (value: number): number => Math.round(value * 100) / 100;
const inside = (x: number, y: number): boolean => x >= 0 && x <= WIDTH && y >= 0 && y <= HEIGHT;

type Dir = readonly [number, number];

interface Root {
  x: number;
  y: number;
  dir: Dir;
}

const FIELD_ROOTS: Root[] = [
  { x: MODULE, y: HEIGHT, dir: [0, -1] },
  { x: WIDTH - MODULE, y: HEIGHT, dir: [0, -1] },
];

const CORNER_ROOTS: Root[] = [{ x: MODULE, y: HEIGHT, dir: [0, -1] }];

/** Direções que não voltam por onde vieram: no máximo 90° de virada. */
function successors(dir: Dir): Dir[] {
  return DIRECTIONS.filter(([dx, dy]) => dx * dir[0] + dy * dir[1] > 0);
}

/**
 * Terminação: quarto de arco de raio igual ao módulo, virando 90° para o lado.
 * É a assinatura do símbolo e a única curva que o sistema permite.
 */
function arc(x: number, y: number, dir: Dir): string | null {
  // O vetor de direção precisa ser NORMALIZADO antes de virar corda: numa
  // diagonal, |dir| é √2, e usá-lo cru produzia uma corda de 2·módulo — ou
  // seja, um semicírculo, não um quarto de arco. A corda de um quarto de
  // arco de raio r é sempre r√2.
  const length = Math.hypot(dir[0], dir[1]);
  const ux = dir[0] / length;
  const uy = dir[1] / length;
  const endX = x + (ux - uy) * MODULE;
  const endY = y + (uy + ux) * MODULE;
  if (!inside(endX, endY)) return null;
  return `M ${round(x)} ${round(y)} A ${MODULE} ${MODULE} 0 0 1 ${round(endX)} ${round(endY)}`;
}

/**
 * Gera a malha nó-e-galho sobre a gramática medida de
 * `brand/LOGO/symbol-master.svg` (DESIGN.md v3.0 §6.1–6.2): todo segmento em
 * 0°, 90° ou ±45°, todo comprimento múltiplo do módulo, o nó é a dobra (não
 * existe círculo), e todo galho terminal acaba em quarto de arco.
 */
export function generateNodeBranchLayout(
  density: NodeBranchDensity = 'default',
  anchor: NodeBranchAnchor = 'field',
): NodeBranchLayout {
  const random = mulberry32(42);
  const depth = DEPTH_BY_DENSITY[density];
  const branches = BRANCHES_BY_DENSITY[density];
  const paths: string[] = [];
  const vistos = new Set<string>();

  function grow(x: number, y: number, dir: Dir, remaining: number): void {
    if (remaining <= 0) {
      const terminal = arc(x, y, dir);
      if (terminal) paths.push(terminal);
      return;
    }

    const candidates = successors(dir)
      .map((d) => ({ d, key: random() }))
      .sort((a, b) => a.key - b.key)
      .slice(0, branches)
      .map(({ d }) => d);

    for (const next of candidates) {
      const endX = x + next[0] * MODULE;
      const endY = y + next[1] * MODULE;
      if (!inside(endX, endY)) continue;
      // Duas raízes vizinhas alcançam os mesmos vértices, e sem isto o mesmo
      // galho era desenhado duas vezes, às vezes em sentido contrário.
      const chave = [x, y, endX, endY].map(round).sort().join(':');
      if (!vistos.has(chave)) {
        vistos.add(chave);
        paths.push(`M ${round(x)} ${round(y)} L ${round(endX)} ${round(endY)}`);
      }
      grow(endX, endY, next, remaining - 1);
    }
  }

  for (const root of anchor === 'corner' ? CORNER_ROOTS : FIELD_ROOTS) {
    grow(root.x, root.y, root.dir, depth);
  }

  return { paths, viewBox: `0 0 ${WIDTH} ${HEIGHT}` };
}
