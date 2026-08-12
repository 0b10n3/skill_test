import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// Hover de default/secondary mistura a cor com preto (color-mix) em vez de
// reduzir opacidade: opacidade clareia o botão em direção ao fundo da
// página, o que derruba o contraste do texto abaixo do AA com a paleta
// Forest/Grove (mais escura que o verde vibrante do sistema anterior) —
// achado real do Épico 14 (axe-core em /lead). Escurecer sempre aumenta o
// contraste contra texto claro, em qualquer fundo/tema.
//
// Botão-pílula (DESIGN.md v1.1 §4.4.7/§4.6, tokens.json component.button):
// radius.pill em todos os tamanhos — "nunca o retângulo default de
// framework" é regra geral do componente, não só das CTAs default/secondary.
// O outline (botão secundário do sistema) usa --link-foreground como cor de
// texto/borda, não --primary: --primary no Dark Mode resolve a Grove-700,
// que só atinge 3.62:1 como texto direto (abaixo do AA); --link-foreground
// já existe calibrado para exatamente esse uso (Grove-500/5.68:1 no Dark
// Mode, Forest-500 no Light Mode) — mesmo achado do Épico 15 que motivou o
// token, ver design/tokens.json color.theme.dark.linkForeground.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-pill border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-[color-mix(in_oklch,var(--primary),black_20%)]',
        outline:
          'border-[1.5px] border-link-foreground bg-transparent text-link-foreground hover:bg-link-foreground/10 aria-expanded:bg-link-foreground/10',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),black_20%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
        ghost:
          'hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50',
        // text-destructive (#EF4444/#D54444, pensado para superfície de
        // botão preenchido) não atinge AA sobre o fundo tingido
        // bg-destructive/10-20 — usa text-error-text, calibrado para essa
        // combinação (achado real do Épico 15, axe-core em /dev/ui).
        destructive:
          'bg-destructive/10 text-error-text hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40',
        link: 'rounded-none text-link-foreground underline-offset-4 hover:underline',
      },
      size: {
        // component.button.heightMd (44px) / paddingX (spacing.md, 24px).
        default:
          'h-11 gap-1.5 px-6 has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5',
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        // component.button.heightLg (52px) — CTA de hero e de banda.
        lg: 'h-[52px] gap-1.5 px-7 has-data-[icon=inline-end]:pr-6 has-data-[icon=inline-start]:pl-6',
        icon: 'size-8',
        'icon-xs':
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        'icon-sm':
          'size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg',
        'icon-lg': 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
