import { cn } from '@/lib/utils';

export type PatternDataGridSlot = 'margin-left' | 'margin-right' | 'header';

export interface PatternDataGridProps {
  /**
   * A API só oferece slots fixos de margem/cabeçalho — nunca uma prop de
   * posicionamento livre. Isso torna estruturalmente impossível usar o
   * padrão atrás de uma área de texto denso (DESIGN.md §5.2: "nunca atrás
   * de texto denso, apenas em áreas de respiro ou cabeçalhos").
   */
  slot: PatternDataGridSlot;
  className?: string;
}

const SLOT_CLASS: Record<PatternDataGridSlot, string> = {
  'margin-left': 'absolute inset-y-0 left-0 w-16',
  'margin-right': 'absolute inset-y-0 right-0 w-16',
  header: 'absolute inset-x-0 top-0 h-16',
};

/** Grade de pontos evocando planilha/dataframe — fundos técnicos (DESIGN.md §5.2). */
export function PatternDataGrid({ slot, className }: PatternDataGridProps) {
  return (
    <div
      aria-hidden="true"
      data-pattern="data-grid"
      data-pattern-slot={slot}
      className={cn('pointer-events-none', SLOT_CLASS[slot], className)}
      style={{
        backgroundImage:
          'radial-gradient(circle var(--pattern-data-grid-dot-radius), var(--pattern-data-grid-color) var(--pattern-data-grid-dot-radius), transparent var(--pattern-data-grid-dot-radius))',
        backgroundSize: 'var(--pattern-data-grid-spacing) var(--pattern-data-grid-spacing)',
        opacity: 'var(--pattern-data-grid-opacity-max)',
      }}
    />
  );
}
