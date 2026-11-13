import Link from 'next/link';
import { Eyebrow } from '@/components/ui/eyebrow';
import { PERGUNTA_DADOS, PERGUNTAS_LANDING } from '@/content/landing';

/** Perguntas frequentes (C12, Épico 46): details/summary nativos, coluna de leitura, sem pattern. */
export function FaqSection() {
  return (
    <section
      id="perguntas"
      aria-labelledby="perguntas-heading"
      className="w-full scroll-mt-14 px-6 py-14 sm:px-10 sm:py-20"
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-2">
        <Eyebrow>Perguntas</Eyebrow>
        <h2 id="perguntas-heading" className="font-display text-3xl text-foreground sm:text-4xl">
          Perguntas frequentes
        </h2>
        <div className="mt-4 flex flex-col">
          {PERGUNTAS_LANDING.map((item) => (
            <details key={item.pergunta} className="border-b border-border">
              <summary className="cursor-pointer py-4 font-display text-base text-foreground">
                {item.pergunta}
              </summary>
              <p className="pb-4 text-base text-muted-foreground">{item.resposta}</p>
            </details>
          ))}
          <details className="border-b border-border">
            <summary className="cursor-pointer py-4 font-display text-base text-foreground">
              {PERGUNTA_DADOS}
            </summary>
            <p className="pb-4 text-base text-muted-foreground">
              Está na{' '}
              <Link
                href="/privacidade"
                className="text-link-foreground underline underline-offset-2"
              >
                política de privacidade
              </Link>
              .
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}
