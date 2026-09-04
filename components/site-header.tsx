import Link from 'next/link';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';

/**
 * Identidade fixa no topo, em toda tela do funil (Épico 29) — antes só
 * existia dentro do card de `/resultado` (`ReportHeader.tsx`, que
 * continua como está: é conteúdo do relatório em si, relevante também
 * quando impresso/compartilhado, não navegação). `print:hidden`: é chrome
 * de navegação, nunca deveria aparecer numa impressão do relatório.
 *
 * Épico 30: barra de ponta a ponta (`inset-x-0`), não mais uma caixa só
 * em torno do logo — o founder viu a caixa isolada e pediu aspecto de
 * menu bar. Superfície sólida (`bg-card` + hairline inferior, mesmo
 * padrão de `Card`: radius.none, borda 1px, nunca sombra) em vez de
 * transparente, senão o texto da página por trás fica visível ao rolar.
 * `ThemeToggle` migrou para dentro da barra (antes um `fixed` separado em
 * `app/layout.tsx`) — um elemento de chrome só, não dois flutuando em
 * cantos diferentes. Continua `fixed` (não `sticky`/em fluxo): a regra de
 * single-viewport do `/quiz` (Épico 4) depende de `h-dvh` não ganhar
 * altura extra por causa do header — um elemento fora do fluxo do
 * documento não conta pra `scrollHeight`.
 */
export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-border bg-card px-4 py-3 print:hidden sm:px-6">
      <Link href="/" aria-label="Syntaxis — página inicial" className="flex items-center">
        <Logo />
      </Link>
      <ThemeToggle />
    </header>
  );
}
