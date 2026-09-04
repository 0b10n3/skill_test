import Link from 'next/link';
import { Logo } from '@/components/logo';

/**
 * Identidade fixa no topo, em toda tela do funil (Épico 29) — antes só
 * existia dentro do card de `/resultado` (`ReportHeader.tsx`, que
 * continua como está: é conteúdo do relatório em si, relevante também
 * quando impresso/compartilhado, não navegação). `print:hidden`: é chrome
 * de navegação, nunca deveria aparecer numa impressão do relatório.
 */
export function SiteHeader() {
  return (
    <div className="fixed top-3 left-3 z-50 print:hidden">
      <Link href="/" aria-label="Syntaxis — página inicial">
        <Logo />
      </Link>
    </div>
  );
}
