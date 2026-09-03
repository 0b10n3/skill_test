import { cn } from '@/lib/utils';

export type PatternReticulaSlot = 'margin-left' | 'margin-right' | 'header';

export interface PatternReticulaProps {
  /**
   * A API só oferece slots fixos de margem/cabeçalho — nunca uma prop de
   * posicionamento livre. Isso torna estruturalmente impossível usar o padrão
   * atrás de uma área de texto denso (DESIGN.md v3.0 §6.4: "nunca compita com
   * o texto").
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
 * Retícula na escala FINA — camada de sistema (DESIGN.md v3.0 §6.2).
 *
 * Substitui `PatternDataGrid`: é o mesmo primitivo, e o que era um segundo
 * padrão virou um parâmetro de escala. A escala grossa (`reticula.coarse`) é
 * matéria de papel na camada de ilustração e **não tem componente de UI**, de
 * propósito — dentro de produto só existe a fina.
 */
export function PatternReticula({ slot, className }: PatternReticulaProps) {
  return (
    <div
      aria-hidden="true"
      data-pattern="reticula"
      data-pattern-scale="fine"
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
