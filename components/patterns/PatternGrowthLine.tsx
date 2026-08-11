import { cn } from '@/lib/utils';
import { generateGrowthLineLayout } from './lib/growth-line-layout';

export interface PatternGrowthLineProps {
  /** Número de degraus ascendentes. */
  steps?: number;
  className?: string;
}

/**
 * Linha em degraus ascendentes — sempre protagonista, nunca decoração de
 * fundo (DESIGN.md §5.2/§5.4). Por isso o componente não aceita prop de
 * opacidade: usar em certificados, badges de conclusão e indicadores de
 * progresso ligados a uma conquista real, nunca como textura ambiente.
 */
export function PatternGrowthLine({ steps = 4, className }: PatternGrowthLineProps) {
  const layout = generateGrowthLineLayout(steps);

  return (
    <svg
      viewBox={layout.viewBox}
      className={cn('pointer-events-none', className)}
      role="img"
      aria-label="Linha de conquista em degraus ascendentes"
      data-pattern="growth-line"
    >
      <polyline
        points={layout.points}
        fill="none"
        stroke="var(--pattern-growth-line-color)"
        strokeWidth="var(--pattern-growth-line-stroke-width)"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ opacity: 'var(--pattern-growth-line-opacity)' }}
      />
    </svg>
  );
}
