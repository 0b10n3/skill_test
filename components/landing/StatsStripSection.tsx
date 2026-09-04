import { Eyebrow } from '@/components/ui/eyebrow';
import { METODO_STATS_ITEMS } from '@/content/landing';

/**
 * Faixa de números (DESIGN.md v1.1 §4.4.5, assinatura 5): 2-4 métricas
 * grandes em `statNumber` (IBM Plex Mono) sobre Mint — os números são o
 * argumento da Syntaxis, exibidos como protagonistas, não como legenda.
 */
export function StatsStripSection() {
  return (
    <section className="w-full bg-muted px-6 py-14 sm:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8">
        <Eyebrow>O diagnóstico em números</Eyebrow>
        <dl className="flex w-full flex-wrap items-baseline justify-center gap-x-12 gap-y-6 sm:gap-x-20">
          {METODO_STATS_ITEMS.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1">
              <dd className="font-data text-[32px] leading-none font-bold tracking-tight text-foreground sm:text-[44px]">
                {item.value}
              </dd>
              <dt className="text-xs text-muted-foreground uppercase">{item.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
