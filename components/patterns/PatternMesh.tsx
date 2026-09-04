import tokens from '@/design/tokens.json';
import { cn } from '@/lib/utils';
import { generateMeshLayout, type MeshAnchor, type MeshDensity } from './lib/mesh-layout';

const MESH = tokens.pattern.mesh;
const OPACITY_ON_TEXT = MESH.opacityOnText.$value;
const OPACITY_DECORATIVE_MIN = MESH.opacityDecorativeMin.$value;
const OPACITY_DECORATIVE_MAX = MESH.opacityDecorativeMax.$value;

export interface PatternMeshProps {
  /**
   * "onText": atrás de texto corrido — opacidade travada em
   * `pattern.mesh.opacityOnText` (0.12), a prop `opacity` é ignorada
   * (DESIGN.md §6.4: "nunca compita com o texto"). "decorative": elemento
   * isolado (moldura, canto, campo) — `opacity` é aceita, mas sempre
   * clampada entre `opacityDecorativeMin` e `opacityDecorativeMax`.
   */
  context: 'onText' | 'decorative';
  density?: MeshDensity;
  anchor?: MeshAnchor;
  opacity?: number;
  className?: string;
}

function resolveOpacity(context: PatternMeshProps['context'], opacity: number | undefined): number {
  if (context === 'onText') return OPACITY_ON_TEXT;
  const requested = opacity ?? OPACITY_DECORATIVE_MAX;
  return Math.min(OPACITY_DECORATIVE_MAX, Math.max(OPACITY_DECORATIVE_MIN, requested));
}

/**
 * Padrão primário do sistema — malha quadriculada, célula = `{spacing.lg}`
 * (DESIGN.md §6.2). Substitui `PatternNodeBranch` (Épico 31,
 * REVOGACOES.md H9): só linhas retas 0°/90°, nenhuma diagonal.
 */
export function PatternMesh({
  context,
  density = 'default',
  anchor = 'field',
  opacity,
  className,
}: PatternMeshProps) {
  const layout = generateMeshLayout(density, anchor);
  const computedOpacity = resolveOpacity(context, opacity);

  return (
    <svg
      viewBox={layout.viewBox}
      className={cn('pointer-events-none', className)}
      aria-hidden="true"
      data-pattern="mesh"
      data-pattern-context={context}
      style={{ opacity: computedOpacity }}
    >
      <path
        d={layout.d}
        fill="none"
        stroke="var(--pattern-mesh-color)"
        strokeWidth="var(--pattern-mesh-stroke-width)"
        strokeLinecap="square"
      />
    </svg>
  );
}
