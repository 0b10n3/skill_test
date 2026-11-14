import { Eyebrow } from '@/components/ui/eyebrow';
import { COMO_FUNCIONA } from '@/content/landing';

/** Como funciona (C5, Épico 46): três passos em Plex Mono, hairline entre eles, sem ícone. */
export function HowItWorksSection() {
  return (
    <section
      id="como-funciona"
      aria-labelledby="como-funciona-heading"
      className="w-full scroll-mt-14 px-6 py-14 sm:px-10"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Eyebrow>Como funciona</Eyebrow>
          <h2
            id="como-funciona-heading"
            className="font-display text-3xl text-foreground sm:text-4xl"
          >
            Três passos até o seu diagnóstico
          </h2>
        </div>
        <ol className="grid grid-cols-1 divide-y divide-border border-y border-border md:grid-cols-3 md:divide-x md:divide-y-0">
          {COMO_FUNCIONA.map((passo, i) => (
            <li key={passo.titulo} className="flex flex-col gap-2 py-6 md:px-6 md:first:pl-0">
              <span className="font-data text-sm text-grove-700 dark:text-grove-300">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display text-lg text-foreground">{passo.titulo}</h3>
              <p className="text-base text-pretty text-muted-foreground">{passo.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
