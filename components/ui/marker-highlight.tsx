import * as React from 'react';

import { cn } from '@/lib/utils';

interface MarkerHighlightProps extends React.ComponentProps<'span'> {
  /** Amber apenas quando o destaque é conquista real (component.highlight.colorAchievement) — nunca decoração neutra. */
  achievement?: boolean;
}

/**
 * Marcador de ênfase (DESIGN.md v1.1 §4.4.3, tokens.json component.highlight):
 * sublinhado espesso (7px, offset 4px) sob UMA palavra do headline — nunca a
 * frase inteira, nunca combinado com a palavra-acento itálica (§4.4.2) na
 * mesma palavra. Grove por padrão; Amber só quando o destaque é conquista.
 */
export function MarkerHighlight({
  achievement,
  className,
  children,
  ...props
}: MarkerHighlightProps) {
  return (
    <span
      className={cn(
        'bg-no-repeat',
        achievement
          ? 'bg-[linear-gradient(var(--color-amber-500),var(--color-amber-500))]'
          : 'bg-[linear-gradient(var(--color-grove-500),var(--color-grove-500))]',
        'bg-[length:100%_7px] bg-[position:0_100%] pb-1',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
