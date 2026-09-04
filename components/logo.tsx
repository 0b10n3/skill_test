import { cn } from '@/lib/utils';

/**
 * Símbolo oficial — geometria idêntica a `brand/LOGO/symbol-master.svg`
 * (viewBox e paths copiados literalmente; cor trocada de `#1B6A45` fixo
 * para `currentColor`, exatamente como o comentário do arquivo-fonte
 * instrui: "recolorir com um CSS/attr override, nunca hardcode outra cor
 * dentro do path"). Inline em vez de `<img>`/`next/image` para herdar cor
 * do texto ao redor sem gerar um segundo arquivo por tema.
 */
function Symbol({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 15.798396" fill="currentColor" className={className} aria-hidden="true">
      <g transform="matrix(0.05011035,0,0,0.05011035,0.39952,0.3814727)">
        <g transform="matrix(1.5057838,0,0,1.5057838,-84.846384,407.39333)">
          <path d="m 136.36523,-230.55273 -40.171871,40.17187 40.171871,40.16992 v -41.41992 h 40.44532 a 38.921356,38.921356 0 0 0 38.92187,-38.92187 z" />
          <path d="m 177.78515,-111.28908 40.17188,-40.17186 -40.17188,-40.16992 v 41.41992 h -40.44532 a 38.921356,38.921356 0 0 0 -38.921877,38.92186 z" />
        </g>
      </g>
    </svg>
  );
}

/**
 * Símbolo + wordmark, um único lockup. O símbolo e o texto compartilham a
 * mesma cor via `text-link-foreground` (Forest-500 no light, Grove-500 no
 * dark, `design/tokens.json` → `color.theme.*.linkForeground` — achado do
 * Épico 15: `--primary` é escurecido para preenchimento de botão e só
 * atinge 3.62:1 como texto direto), puramente por CSS — sem JS, sem risco
 * de flash/mismatch de hidratação. Nenhum call site precisa mudar: a API
 * do componente (`<Logo className? />`) é a mesma desde o Épico 14.
 * v2.0.0: sem itálico — Space Grotesk não tem variante itálica; peso bold
 * assume o papel que o itálico tinha de diferenciar o wordmark do corpo.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn('inline-flex items-center gap-2 text-link-foreground', className)}
      role="img"
      aria-label="Syntaxis"
    >
      <Symbol className="h-6 w-6 shrink-0" />
      <span className="font-display text-xl font-bold">Syntaxis</span>
    </span>
  );
}
