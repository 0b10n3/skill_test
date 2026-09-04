import { Eyebrow } from '@/components/ui/eyebrow';
import { MethodFooter } from '@/components/result/MethodFooter';
import { GradientAmbient, PatternReticula } from '@/components/patterns';
import { METODOLOGIA_RESUMO } from '@/content/relatorio';

/**
 * Banda Deep Forest (DESIGN.md v1.1 §4.4.4, assinatura 4): seção-statement
 * full-bleed que quebra o ritmo do fundo Chalk — a metodologia/credibilidade
 * é o candidato natural apontado pelo Épico 20. Cores fixas (Chalk/Grove-300
 * sobre Deep Forest), independentes do tema ativo, como qualquer banda.
 *
 * Épico 29: `<PatternNodeBranch/>` full-bleed atrás do texto saiu — lia
 * como ruído competindo com o texto na própria opacidade que tentava
 * evitar isso. Substituído por `<GradientAmbient/>` num canto (glow sutil,
 * nunca atrás do texto — a banda Deep Forest é o fundo sólido do texto,
 * o gradiente só toca a borda) e `<PatternReticula/>` nas margens, mesmo
 * mecanismo já usado no catálogo `/dev/ui` (retícula fina, "respiro em
 * conteúdo denso", DESIGN.md §6.4) — continua sendo pattern de sistema,
 * não foi removida por este épico, só o `nodeBranch` full-bleed saiu.
 */
export function CredibilityBand() {
  return (
    <section className="relative w-full overflow-hidden bg-neutral-deep-forest px-6 py-24 sm:px-10 sm:py-32">
      <GradientAmbient tone="forest" corner="bottom-right" />
      <PatternReticula slot="margin-left" />
      <PatternReticula slot="margin-right" />
      <div className="relative mx-auto flex w-full max-w-3xl flex-col gap-6">
        <Eyebrow onDark>Metodologia</Eyebrow>
        <p className="font-display text-2xl text-pretty text-neutral-chalk sm:text-3xl">
          {METODOLOGIA_RESUMO[0]}
        </p>
        <p className="text-sm text-pretty text-neutral-chalk/80">{METODOLOGIA_RESUMO[2]}</p>
        <MethodFooter onDark />
      </div>
    </section>
  );
}
