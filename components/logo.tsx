import { cn } from '@/lib/utils';

/**
 * Símbolo nó-e-galho + wordmark (DESIGN.md §5.1).
 *
 * A geometria do símbolo é copiada verbatim de brand/LOGO/symbol-master.svg
 * (revisão de 02/09/2026, item 2a — fecha o placeholder que ainda citava a
 * lacuna §8.1, resolvida em 31/08/2026). Não redesenhar aqui: editar o master
 * em brand/LOGO/ e recopiar os dois paths.
 *
 * A "variante por tema" do Épico 14 continua funcionando pelo mesmo mecanismo,
 * agora carregando também o símbolo: `text-link-foreground` resolve para
 * Forest-500 no light e Grove-500 no dark (design/tokens.json →
 * color.theme.*.linkForeground — não --primary, que no Dark Mode é Grove-700,
 * escurecido para preenchimento de botão, e só atinge 3.62:1 como texto
 * direto; achado do Épico 15), e o símbolo herda por `fill="currentColor"`.
 * Puramente CSS — sem JS, sem risco de flash/mismatch de hidratação.
 *
 * v2.0.0: sem itálico — Space Grotesk não tem variante itálica; peso bold
 * assume o papel que o itálico tinha de diferenciar o wordmark do corpo.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 font-display text-xl font-bold text-link-foreground',
        className,
      )}
      role="img"
      aria-label="Syntaxis"
    >
      <svg
        viewBox="0 0 16 15.798396"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        className="size-[1em] shrink-0"
      >
        <g transform="matrix(0.05011035,0,0,0.05011035,0.39952,0.3814727)">
          <g transform="matrix(1.5057838,0,0,1.5057838,-84.846384,407.39333)">
            <path d="m 136.36523,-230.55273 -40.171871,40.17187 40.171871,40.16992 v -41.41992 h 40.44532 a 38.921356,38.921356 0 0 0 38.92187,-38.92187 z" />
            <path d="m 177.78515,-111.28908 40.17188,-40.17186 -40.17188,-40.16992 v 41.41992 h -40.44532 a 38.921356,38.921356 0 0 0 -38.921877,38.92186 z" />
          </g>
        </g>
      </svg>
      Syntaxis
    </span>
  );
}
