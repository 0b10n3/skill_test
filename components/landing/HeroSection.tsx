import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/eyebrow';
import { MarkerHighlight } from '@/components/ui/marker-highlight';
import { PatternTruchet } from '@/components/patterns';
import { HERO_APOIO, HERO_MICROCOPY, HERO_PROMISE } from '@/content/landing';

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
 *
 * Épico 37 (DESIGN.md v4.1 §5.1 regra 4): fotografia em cor natural, nunca
 * duotone — um arquivo só para os dois temas, sem variante light/dark.
 *
 * Épico 40: pedido do founder — o hero passa ao formato do CTA final (H11/C14,
 * `brand/APLICACAO.md` §1.1–1.2): texto à esquerda e o mosaico Truchet como bloco
 * próprio à direita, seguindo o tema; a foto e o gradiente de ambiente saíram
 * (o Truchet nunca divide o bloco com outro padrão). Abaixo de `sm` o mosaico some,
 * como a foto sumia: o hero precisa caber em 375×667 sem rolagem.
 *
 * Épico 46: botão antes do parágrafo de apoio; microcopy com o custo ("Gratuito").
 */
export function HeroSection() {
  // Épico 46 (L1): no celular a seção tem altura natural e o texto começa no topo — h1, promessa
  // e botão cabem em 375×667 acima do banner de cookies aberto.
  return (
    <section className="grid pt-14 sm:min-h-dvh lg:grid-cols-[1fr_600px]">
      <div className="flex flex-col gap-5 px-6 py-8 sm:justify-center sm:px-10 sm:py-10 lg:pl-30">
        <Eyebrow>Syntaxis Skill Check</Eyebrow>
        <h1 className="font-display text-[32px] leading-[1.05] text-balance text-foreground sm:text-[64px]">
          Descubra seu <MarkerHighlight>nível</MarkerHighlight> técnico em finanças em alguns
          minutos
        </h1>
        <p className="max-w-xl text-base text-pretty text-foreground">{HERO_PROMISE}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <Button variant="default" size="lg" render={<Link href="/quiz" />}>
            Iniciar avaliação
          </Button>
          <p className="font-mono text-sm text-muted-foreground">{HERO_MICROCOPY}</p>
        </div>
        <p className="max-w-xl text-sm text-pretty text-muted-foreground">{HERO_APOIO}</p>
      </div>
      <PatternTruchet
        cols={5}
        rows={7}
        seed={11}
        tom="tema"
        className="hidden h-full w-full lg:block"
      />
      <PatternTruchet
        cols={8}
        rows={2}
        seed={11}
        tom="tema"
        className="hidden h-40 w-full sm:block lg:hidden"
      />
      {/* celular: faixa de uma célula (~68px, DESIGN.md §6.6) depois do texto */}
      <PatternTruchet
        cols={6}
        rows={1}
        seed={11}
        tom="tema"
        className="h-[68px] w-full sm:hidden"
      />
    </section>
  );
}
