import Link from 'next/link';
import { Logo } from '@/components/logo';

/**
 * Identidade fixa no topo, em toda tela do funil (Épico 29) — antes só
 * existia dentro do card de `/resultado` (`ReportHeader.tsx`, que
 * continua como está: é conteúdo do relatório em si, relevante também
 * quando impresso/compartilhado, não navegação). `print:hidden`: é chrome
 * de navegação, nunca deveria aparecer numa impressão do relatório.
 *
 * Épico 30: superfície sólida (`bg-card` + hairline) — sem fundo, o
 * header `fixed` deixava o texto da página por trás visível através dele
 * ao rolar. Mesmo padrão de `Card` (`DESIGN.md`: radius.none, borda 1px,
 * nunca sombra) aplicado aqui em vez de um componente novo.
 */
export function SiteHeader() {
  return (
    <div className="fixed top-3 left-3 z-50 print:hidden">
      <Link
        href="/"
        aria-label="Syntaxis — página inicial"
        className="flex items-center rounded-none border border-border bg-card px-3 py-2"
      >
        <Logo />
      </Link>
    </div>
  );
}
