import { cn } from '@/lib/utils';

export type PatternReticulaSlot = 'margin-left' | 'margin-right' | 'header';

export interface PatternReticulaProps {
  /**
   * A API só oferece slots fixos de margem/cabeçalho — nunca uma prop de
   * posicionamento livre. Isso torna estruturalmente impossível usar o
   * padrão atrás de uma área de texto denso (DESIGN.md §6.4: "nunca atrás
   * de texto denso, apenas em áreas de respiro ou cabeçalhos").
   */
  slot: PatternReticulaSlot;
  className?: string;
}

const SLOT_CLASS: Record<PatternReticulaSlot, string> = {
  'margin-left': 'absolute inset-y-0 left-0 w-16',
  'margin-right': 'absolute inset-y-0 right-0 w-16',
  header: 'absolute inset-x-0 top-0 h-16',
};

/**
 * Retícula — escala fina, camada de sistema (DESIGN.md §6.3). Substitui
 * `PatternDataGrid` (Épico 27): mesmo desenho, mesmos valores, só o nome
 * muda — `pattern.reticula.fine` é o mesmo grupo que `pattern.dataGrid`
 * era, byte a byte, agora com a escala como grupo explícito no token
 * (`fine`/`coarse`) em vez de implícita no nome do componente.
 */
export function PatternReticula({ slot, className }: PatternReticulaProps) {
  return (
    <div
      aria-hidden="true"
      data-pattern="reticula"
      data-pattern-slot={slot}
      className={cn('pointer-events-none', SLOT_CLASS[slot], className)}
      style={{
        backgroundImage:
          'radial-gradient(circle var(--pattern-reticula-fine-dot-radius), var(--pattern-reticula-fine-color) var(--pattern-reticula-fine-dot-radius), transparent var(--pattern-reticula-fine-dot-radius))',
        backgroundSize: 'var(--pattern-reticula-fine-spacing) var(--pattern-reticula-fine-spacing)',
        opacity: 'var(--pattern-reticula-fine-opacity-max)',
      }}
    />
  );
}
