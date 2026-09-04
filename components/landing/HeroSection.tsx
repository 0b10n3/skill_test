import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/eyebrow';
import { MarkerHighlight } from '@/components/ui/marker-highlight';
import { ThemedGeneratedImage } from '@/components/generated-image';
import { GradientAmbient } from '@/components/patterns';
import { HERO_PROMISE } from '@/content/landing';

/**
 * Hero da landing (Épico 17, redesign Épico 20, tipografia/cor Épico 22 —
 * DESIGN.md v2.0 §4.3/§4.4): asset gerado (variante por tema) como
 * elemento de evidência ao lado do headline — nunca o layout "centrado +
 * dois botões" proibido pelo §4.5. Eyebrow (assinatura 1), palavra-destaque
 * lime sob "nível" (assinatura 2), hairline estrutural entre as colunas
 * (assinatura 3) — as três obrigatórias no hero.
 *
 * Épico 29: o `<PatternNodeBranch/>` decorativo de canto saiu — substituído
 * por `<GradientAmbient/>` (DESIGN.md §4.5, exceção nomeada de gradiente de
 * ambiente). Fica no canto oposto ao asset, na camada mais baixa (-z-10);
 * nenhum texto se apoia diretamente nele — a coluna de texto tem o fundo
 * sólido da página por baixo, não o gradiente. O asset também trocou:
 * `hero-landing-pessoas` (fotografia real de pessoa estudando, duotone)
 * substitui `hero-landing` (composição abstrata de nó-e-galho) — pedido
 * direto do founder, `assets/prompts/hero-landing-pessoas.md`.
 *
 * Épico 30: `aspect-video` (16:9) trocado por `aspect-[4/5]` — a caixa
 * lateral estava baixa e larga ao lado de uma coluna de texto bem mais
 * alta; a foto (v3, ver histórico do prompt) já foi enquadrada em vertical
 * para essa proporção. Duotone escuro corrigido também aqui (achado real:
 * o par publicado no Épico 29 estava invertido — sombra virava um tom mais
 * claro que o fundo da página, luz virava mais escura que o fundo — ver
 * `assets/prompts/hero-landing-pessoas.md` e o par correto de
 * `hero-landing` dark, reaproveitado).
 */
export function HeroSection() {
  return (
    <section className="relative flex min-h-dvh flex-col justify-center gap-6 overflow-hidden px-6 py-8 sm:px-10 sm:py-10 lg:flex-row lg:items-center lg:gap-12">
      <GradientAmbient tone="forest" corner="top-right" />

      <div className="flex max-w-xl flex-col gap-5 lg:flex-1 lg:border-r lg:border-border lg:pr-12">
        <Eyebrow>Syntaxis Skill Check</Eyebrow>
        <h1 className="font-display text-[40px] leading-[1.05] text-balance text-foreground sm:text-[64px]">
          Descubra seu <MarkerHighlight>nível</MarkerHighlight> técnico em finanças em alguns
          minutos
        </h1>
        <p className="text-base text-pretty text-foreground">{HERO_PROMISE}</p>
        <p className="text-sm text-pretty text-muted-foreground">
          Uma avaliação adaptativa sobre renda fixa, matemática financeira, dados e IA aplicada ao
          mercado — calibrada para o seu momento de carreira.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="default" size="lg" render={<Link href="/quiz" />}>
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
      <div className="relative hidden aspect-[4/5] w-full overflow-hidden sm:block lg:max-w-md">
        <ThemedGeneratedImage
          slug="hero-landing-pessoas"
          widths={[640, 1024, 1920]}
          sizes="(min-width: 1024px) 28rem, 100vw"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  );
}
