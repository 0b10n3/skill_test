import * as React from 'react';

import { cn } from '@/lib/utils';

interface EyebrowProps extends React.ComponentProps<'p'> {
  /** Sobre banda Deep Forest ou outro fundo escuro — força Lime-300 nos dois temas (component.eyebrow.colorOnDark). */
  onDark?: boolean;
}

/**
 * Eyebrow mono (DESIGN.md v2.0 §4.4.1, tokens.json typography.scale.eyebrow):
 * rótulo curto em Space Mono caixa alta acima de todo título de seção — a
 * "impressão digital técnica" da marca em cada dobra. component.eyebrow:
 * Grove-700 sobre claro / Lime-300 sobre escuro ou banda (v2.0.0: era
 * Grove-300 — sobre fundo escuro o eyebrow vira sinal lime).
 */
export function Eyebrow({ children, onDark, className, ...props }: EyebrowProps) {
  return (
    <p
      className={cn(
        'text-eyebrow',
        onDark ? 'text-lime-300' : 'text-grove-700 dark:text-lime-300',
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}
