import tokens from '@/design/tokens.json';
import { cn } from '@/lib/utils';
import {
  generateNodeBranchLayout,
  type NodeBranchAnchor,
  type NodeBranchDensity,
} from './lib/node-branch-layout';

const NODE_BRANCH = tokens.pattern.nodeBranch;
const OPACITY_ON_TEXT = NODE_BRANCH.opacityOnText.$value;
const OPACITY_DECORATIVE_MIN = NODE_BRANCH.opacityDecorativeMin.$value;
const OPACITY_DECORATIVE_MAX = NODE_BRANCH.opacityDecorativeMax.$value;

export interface PatternNodeBranchProps {
  /**
   * "onText": atrás de texto corrido — opacidade travada em
   * `pattern.nodeBranch.opacityOnText` (0.12), a prop `opacity` é ignorada
   * (DESIGN.md §5.4: "nunca compita com o texto"). "decorative": elemento
   * isolado (moldura, canto, campo) — `opacity` é aceita, mas sempre
   * clampada entre `opacityDecorativeMin` e `opacityDecorativeMax`.
   */
  context: 'onText' | 'decorative';
  density?: NodeBranchDensity;
  anchor?: NodeBranchAnchor;
  opacity?: number;
  className?: string;
}

function resolveOpacity(
  context: PatternNodeBranchProps['context'],
  opacity: number | undefined,
): number {
  if (context === 'onText') return OPACITY_ON_TEXT;
  const requested = opacity ?? OPACITY_DECORATIVE_MAX;
  return Math.min(OPACITY_DECORATIVE_MAX, Math.max(OPACITY_DECORATIVE_MIN, requested));
}

/** Padrão primário do sistema — nós conectados por galhos (DESIGN.md §5.1-5.2). */
export function PatternNodeBranch({
  context,
  density = 'default',
  anchor = 'field',
  opacity,
  className,
}: PatternNodeBranchProps) {
  const layout = generateNodeBranchLayout(density, anchor);
  const computedOpacity = resolveOpacity(context, opacity);

  return (
    <svg
      viewBox={layout.viewBox}
      className={cn('pointer-events-none', className)}
      aria-hidden="true"
      data-pattern="node-branch"
      data-pattern-context={context}
      style={{ opacity: computedOpacity }}
    >
      {layout.edges.map((edge) => {
        const from = layout.nodes[edge.from];
        const to = layout.nodes[edge.to];
        return (
          <line
            key={`edge-${edge.from}-${edge.to}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="var(--pattern-node-branch-color)"
            strokeWidth="var(--pattern-node-branch-stroke-width)"
          />
        );
      })}
      {layout.nodes.map((node, index) => (
        <circle
          key={`node-${index}`}
          cx={node.x}
          cy={node.y}
          r="var(--pattern-node-branch-node-radius)"
          fill="var(--pattern-node-branch-color)"
        />
      ))}
    </svg>
  );
}
