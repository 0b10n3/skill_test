import { GeneratedImage } from '@/components/generated-image';
import { PatternDataGrid } from '@/components/patterns';
import { CATEGORY_LABEL } from '@/content/relatorio';
import { DIMENSAO_ASSET_SLUG, DIMENSAO_LANDING_DESCRICAO } from '@/content/landing';
import type { KnowledgeCategory } from '@/lib/types';

const DIMENSIONS: KnowledgeCategory[] = [
  'mercados-produtos',
  'matematica-quant',
  'dados-programacao',
  'ia-aplicada',
  'risco-regulacao',
];

/**
 * Seção "o que o diagnóstico avalia" (Épico 17). Grade de dados só nas
 * margens (slot fixo do componente — DESIGN.md §5.2, nunca atrás do
 * conteúdo). Duas das 5 dimensões ainda não têm asset aprovado
 * (content/landing.ts DIMENSAO_ASSET_SLUG) — a seção funciona igual, só
 * sem imagem nesses dois cards, até serem regeneradas.
 */
export function DimensionsSection() {
  return (
    <section className="relative flex w-full flex-col gap-6 px-6 py-14 sm:px-10">
      <PatternDataGrid slot="margin-left" />
      <PatternDataGrid slot="margin-right" />

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 text-center">
        <h2 className="font-display text-2xl text-foreground">O que o diagnóstico avalia</h2>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          15 questões, 3 por dimensão, calibradas para a expectativa do seu nível declarado.
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {DIMENSIONS.map((category) => {
          const slug = DIMENSAO_ASSET_SLUG[category];
          return (
            <div
              key={category}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-syntaxis-sm"
            >
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
                {slug && (
                  <GeneratedImage
                    slug={slug}
                    widths={[400, 800]}
                    sizes="(min-width: 1024px) 18vw, (min-width: 640px) 45vw, 90vw"
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <h3 className="font-display text-sm text-foreground">{CATEGORY_LABEL[category]}</h3>
              <p className="text-xs text-muted-foreground">
                {DIMENSAO_LANDING_DESCRICAO[category]}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
