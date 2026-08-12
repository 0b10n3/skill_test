import * as React from 'react';

import { cn } from '@/lib/utils';

type MarkerHighlightProps = React.ComponentProps<'span'>;

/**
 * Palavra-destaque lime (DESIGN.md v2.0 §4.4.2, tokens.json
 * component.highlight): sublinhado espesso (7px, offset 4px) sob UMA
 * palavra do headline — nunca a frase inteira. v2.0.0: sempre lime — não
 * existe mais variante separada de conquista (lime já É conquista; a
 * variante `achievement` da v1.1 foi removida junto com Amber). Substitui
 * também a antiga palavra-acento serif itálica (§4.4.2 da v1.1): Space
 * Grotesk não tem itálico, então este marcador passa a ser o único
 * dispositivo de ênfase de headline.
 */
export function MarkerHighlight({ className, children, ...props }: MarkerHighlightProps) {
  return (
    <span
      className={cn(
        'bg-no-repeat',
        'bg-[linear-gradient(var(--color-lime-500),var(--color-lime-500))]',
        'bg-[length:100%_7px] bg-[position:0_100%] pb-1',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
