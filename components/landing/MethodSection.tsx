import { MethodFooter } from '@/components/result/MethodFooter';
import { METODO_STATS } from '@/content/landing';

/**
 * Seção de método/credibilidade (Épico 17): números em Space Mono +
 * link para a metodologia. Reaproveita o MethodFooter já usado em
 * /resultado (mesmo conteúdo de content/relatorio.ts, mesma fonte de
 * verdade) em vez de duplicar a prosa da metodologia aqui.
 */
export function MethodSection() {
  return (
    <section className="flex w-full flex-col items-center gap-6 px-6 py-14 sm:px-10">
      <p className="font-mono text-lg text-foreground sm:text-xl">{METODO_STATS}</p>
      <MethodFooter />
    </section>
  );
}
