import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemedGeneratedImage } from '@/components/generated-image';
import { PatternNodeBranch } from '@/components/patterns';
import { HERO_PROMISE } from '@/content/landing';

/**
 * Hero da landing (Épico 17): asset gerado do Épico 16 (variante por
 * tema) como painel visual, mais um <PatternNodeBranch/> decorativo no
 * canto oposto ao asset — não se sobrepõem, então não competem entre si
 * nem violam "um padrão por peça" (o asset gerado não é um dos três
 * padrões geométricos programáticos, só a decoração SVG é).
 */
export function HeroSection() {
  return (
    <section className="relative flex min-h-dvh flex-col justify-center gap-6 overflow-hidden px-6 py-8 sm:px-10 sm:py-10 lg:flex-row lg:items-center lg:gap-12">
      <PatternNodeBranch
        context="decorative"
        anchor="corner"
        density="sparse"
        opacity={0.3}
        className="pointer-events-none absolute top-0 right-0 -z-10 h-64 w-64 -scale-x-100"
      />

      <div className="flex max-w-xl flex-col gap-5 lg:flex-1">
        <p className="font-mono text-xs tracking-widest text-link-foreground uppercase">
          Syntaxis Skill Check
        </p>
        <h1 className="font-display text-3xl text-balance text-foreground sm:text-4xl">
          Descubra seu nível técnico em finanças em alguns minutos
        </h1>
        <p className="text-base text-pretty text-foreground">{HERO_PROMISE}</p>
        <p className="text-sm text-pretty text-muted-foreground">
          Uma avaliação adaptativa sobre renda fixa, matemática financeira, dados e IA aplicada ao
          mercado — calibrada para o seu momento de carreira.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="secondary" size="lg" render={<Link href="/quiz" />}>
            Iniciar avaliação
          </Button>
          <p className="font-mono text-sm text-muted-foreground">
            10–15 min · 15 perguntas · múltipla escolha
          </p>
        </div>
      </div>

      {/* Escondido no menor breakpoint: com título + promessa + CTA, o hero
          já ultrapassa um viewport de 667px de altura se a imagem também
          empilhar embaixo do texto — a tela de entrada do funil precisa
          caber sem rolagem (regra "single-viewport por seção", app desde
          o Épico 4); a partir de sm ela cabe. */}
      <div className="relative hidden aspect-video w-full overflow-hidden rounded-xl sm:block lg:max-w-md">
        <ThemedGeneratedImage
          slug="hero-landing"
          widths={[640, 1024, 1920]}
          sizes="(min-width: 1024px) 28rem, 100vw"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  );
}
