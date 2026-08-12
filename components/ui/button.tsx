import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// Hover de secondary mistura a cor com preto (color-mix) em vez de reduzir
// opacidade: opacidade clareia o botão em direção ao fundo da página, o que
// derruba o contraste do texto abaixo do AA com a paleta Forest/Grove (mais
// escura que o verde vibrante do sistema anterior) — achado real do Épico
// 14 (axe-core em /lead). Escurecer sempre aumenta o contraste contra texto
// claro, em qualquer fundo/tema. O CTA primário (default) não usa esse
// truque: hover é lime-300, um tom mais claro do próprio lime (bg fixo nos
// dois temas, ver abaixo).
//
// Botão reto (DESIGN.md v2.0 §4.4.7/§4.6, tokens.json component.button):
// radius.none (revoga o pill da v1.2.0) em todos os tamanhos. O CTA
// primário é lime-500/Ink em qualquer tema — não usa --primary/
// --primary-foreground (que seguem Forest/Grove, usados em ring, foco e
// estados de formulário) porque a v2.0 transfere o papel de "cor de ação
// dos botões" para o lime; Grove concentra-se em links, progresso e
// padrões. O outline (botão secundário) usa --link-foreground como cor de
// texto/borda no Light Mode (Forest-500) e Chalk no Dark Mode — DESIGN.md
// v2.0 §4.6: "Secundário: outline 1.5px Forest (claro) / Chalk (escuro)"
// — diferente da v1.1, que usava Grove-500 no escuro (--link-foreground
// ainda serve outros usos, como o wordmark do Logo, por isso o dark:
// específico aqui em vez de mudar o token compartilhado).
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-none border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-lime-500 text-neutral-ink hover:bg-lime-300',
        outline:
          'border-[1.5px] border-link-foreground bg-transparent text-link-foreground hover:bg-link-foreground/10 aria-expanded:bg-link-foreground/10 dark:border-neutral-chalk dark:text-neutral-chalk dark:hover:bg-neutral-chalk/10 dark:aria-expanded:bg-neutral-chalk/10',
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
        xs: "h-6 gap-1 rounded-sm px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-sm px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        // component.button.heightLg (52px) — CTA de hero e de banda.
        lg: 'h-[52px] gap-1.5 px-7 has-data-[icon=inline-end]:pr-6 has-data-[icon=inline-start]:pl-6',
        icon: 'size-8',
        'icon-xs': "size-6 rounded-sm [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-7 rounded-sm',
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
