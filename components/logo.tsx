import { cn } from '@/lib/utils';

/**
 * PLACEHOLDER — nenhum arquivo de imagem da marca foi recebido nesta
 * sessão (DESIGN.md §8, "Lacunas Abertas" #1: "nenhum arquivo de imagem foi
 * recebido"). Renderiza um wordmark tipográfico até o SVG/PNG oficial
 * chegar; troque a implementação quando o asset existir (ver
 * docs/design-system.md §5 para a convenção de nomes esperada em
 * public/brand/).
 *
 * A "variante por tema" exigida pelo Épico 14 já funciona aqui via
 * `text-link-foreground`: resolve para Forest-500 no light e Grove-500 no
 * dark (design/tokens.json → color.theme.*.linkForeground — não
 * --primary, que no Dark Mode é Grove-700, escurecido para preenchimento
 * de botão, e só atinge 3.62:1 como texto direto; achado do Épico 15),
 * puramente por CSS — sem JS, sem risco de flash/mismatch de hidratação.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn('font-display text-xl text-link-foreground italic', className)}
      role="img"
      aria-label="Syntaxis"
    >
      Syntaxis
    </span>
  );
}
