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

/**
 * Padrão primário do sistema (DESIGN.md v3.0 §6.2). A malha é construída sobre
 * a gramática medida do símbolo: só 0°, 90° e ±45°, comprimento em múltiplos do
 * módulo, o nó é a dobra — não existe `<circle>` aqui, porque o símbolo não
 * contém nenhum — e todo galho terminal acaba em quarto de arco.
 */
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
      {layout.paths.map((d, index) => (
        <path
          key={`branch-${index}`}
          d={d}
          fill="none"
          stroke="var(--pattern-node-branch-color)"
          strokeWidth="var(--pattern-node-branch-stroke-width)"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      ))}
    </svg>
  );
}
