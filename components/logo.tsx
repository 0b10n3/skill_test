import { cn } from '@/lib/utils';

/**
 * PLACEHOLDER — nenhum arquivo de imagem da marca foi recebido nesta
 * sessão (DESIGN.md §8, "Lacunas Abertas" #1: "nenhum arquivo de imagem foi
 * recebido"). Renderiza um wordmark tipográfico até o SVG/PNG oficial
 * chegar; troque a implementação quando o asset existir (ver
 * REDESIGN.md §3.1 para a convenção de nomes esperada em public/brand/).
 *
 * A "variante por tema" exigida pelo Épico 14 já funciona aqui via
 * `text-primary`: --primary resolve para Forest-500 no light e Grove-500
 * no dark (design/tokens.json → color.theme.*), puramente por CSS — sem
 * JS, sem risco de flash/mismatch de hidratação.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn('font-display text-xl text-primary italic', className)}
      role="img"
      aria-label="Syntaxis"
    >
      Syntaxis
    </span>
  );
}
