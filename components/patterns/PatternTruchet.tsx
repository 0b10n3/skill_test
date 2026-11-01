import { cn } from '@/lib/utils';
import { generateTruchetLayout } from './lib/truchet-layout';

export interface PatternTruchetProps {
  cols: number;
  rows: number;
  seed?: number;
  className?: string;
}

/**
 * Mosaico Truchet (DESIGN.md v4.1 §6.6, Épico 38) — bloco próprio, como uma
 * imagem: nunca atrás de texto, nunca junto de mesh/retícula no mesmo bloco.
 * Só a versão escura (`grove.500` sobre Deep Forest), sem Lime: o acento é do CTA.
 */
export function PatternTruchet({ cols, rows, seed, className }: PatternTruchetProps) {
  const layout = generateTruchetLayout(cols, rows, seed);
  return (
    <svg
      viewBox={layout.viewBox}
      preserveAspectRatio="xMidYMid slice"
      className={cn('pointer-events-none bg-neutral-deep-forest', className)}
      aria-hidden="true"
      data-pattern="truchet"
    >
      <path d={layout.d} fill="var(--color-grove-500)" />
      <path d={layout.dRaro} fill="var(--color-grove-300)" />
    </svg>
  );
}
