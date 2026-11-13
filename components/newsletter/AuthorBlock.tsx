import Image from 'next/image';
import { Eyebrow } from '@/components/ui/eyebrow';
import { LogoSymbol } from '@/components/logo';
import type { Author } from '@/content/author';

/**
 * Quem escreve (C8, Épicos 44 e 46). Moldura reta com hairline, sem sombra.
 * Sem retrato real, o símbolo da marca ocupa o lugar — nunca a foto de outra
 * pessoa (DESIGN.md §5.1, regra 8).
 */
export function AuthorBlock({ author }: { author: Author }) {
  return (
    <section aria-labelledby="autor-heading" className="w-full px-6 py-14 sm:px-10 sm:py-20">
      <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-8 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-12">
        <div className="relative aspect-[4/5] w-32 border border-border sm:w-40">
          {author.foto ? (
            <Image
              src={author.foto.src}
              alt={author.foto.alt}
              fill
              sizes="160px"
              className="object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-neutral-deep-forest">
              <LogoSymbol className="size-16 text-lime-500" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <Eyebrow>Quem escreve</Eyebrow>
          <div className="flex flex-col gap-1">
            <h2 id="autor-heading" className="font-display text-2xl text-foreground">
              {author.nome}
            </h2>
            <p className="font-mono text-sm text-muted-foreground">{author.papel}</p>
          </div>
          {author.bio.map((paragrafo) => (
            <p key={paragrafo.slice(0, 32)} className="text-base text-pretty text-foreground">
              {paragrafo}
            </p>
          ))}
          <p className="text-sm text-muted-foreground">{author.nota}</p>
        </div>
      </div>
    </section>
  );
}
