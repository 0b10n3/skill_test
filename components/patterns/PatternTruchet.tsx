import { cn } from '@/lib/utils';
import { generateTruchetLayout } from './lib/truchet-layout';

export interface PatternTruchetProps {
  cols: number;
  rows: number;
  seed?: number;
  /**
   * "escuro": `grove.500` sobre Deep Forest em qualquer tema (banda fixa, como o CTA final).
   * "tema": segue o tema — `forest.500` sobre Chalk no claro, `grove.500` sobre Deep Forest no escuro.
   */
  tom?: 'escuro' | 'tema';
  className?: string;
}

/**
 * Mosaico Truchet (DESIGN.md v4.1 §6.6, Épicos 38 e 40) — bloco próprio, como uma
 * imagem: nunca atrás de texto, nunca junto de mesh/retícula no mesmo bloco. Sem
 * Lime: o acento é do CTA.
 */
export function PatternTruchet({
  cols,
  rows,
  seed,
  tom = 'escuro',
  className,
}: PatternTruchetProps) {
  const layout = generateTruchetLayout(cols, rows, seed);
  const tema = tom === 'tema';
  return (
    <svg
      viewBox={layout.viewBox}
      preserveAspectRatio="xMidYMid slice"
      className={cn(
        'pointer-events-none',
        tema ? 'bg-neutral-chalk dark:bg-neutral-deep-forest' : 'bg-neutral-deep-forest',
        className,
      )}
      aria-hidden="true"
      data-pattern="truchet"
    >
      <path
        d={layout.d}
        className={tema ? 'fill-forest-500 dark:fill-grove-500' : 'fill-grove-500'}
      />
      <path d={layout.dRaro} className="fill-grove-300" />
    </svg>
  );
}
