import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PatternTruchet } from '@/components/patterns';

/**
 * CTA final da landing (C14, `brand/APLICACAO.md` §1.2 — Épico 38): quem
 * rolou até o fim não precisa voltar ao hero. Banda Ink logo depois da banda
 * Deep Forest da metodologia (transição por degrau de luminância), com o
 * mosaico Truchet como bloco próprio ao lado do texto; o Lime só no botão.
 */
export function FinalCtaSection() {
  return (
    <section className="on-dark grid w-full bg-neutral-ink lg:grid-cols-[1fr_600px]">
      <div className="flex flex-col gap-6 px-6 py-16 sm:px-10 lg:py-24 lg:pl-30">
        <h2 className="font-display text-3xl font-bold text-balance text-neutral-chalk sm:text-5xl">
          Descubra onde você está — e o próximo passo.
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="default" size="lg" render={<Link href="/quiz" />}>
            Iniciar avaliação
          </Button>
          <p className="font-mono text-sm text-neutral-chalk/80">
            10–15 min · 15 perguntas · múltipla escolha
          </p>
        </div>
      </div>
      <PatternTruchet cols={5} rows={3} className="hidden h-full w-full lg:block" />
      {/* no celular, depois do texto: em cima, o Deep Forest do mosaico colaria na banda da metodologia */}
      <PatternTruchet cols={6} rows={2} className="block h-32 w-full lg:hidden" />
    </section>
  );
}
