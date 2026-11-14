'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { SubscribeButton } from '@/components/newsletter/SubscribeButton';
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
 *
 * Épico 40: menu C1 (`brand/APLICACAO.md` §1.2) — marca, links e um CTA, borda
 * inferior como hairline, sem sombra. Só links que existem (âncoras da landing).
 * No funil (quiz, lead, resultado) o menu some: lá o CTA levaria a recomeçar.
 */
const FUNIL = ['/quiz', '/lead', '/resultado'];
const LINKS = [
  { href: '/#o-que-avaliamos', rotulo: 'O que avaliamos' },
  { href: '/#metodologia', rotulo: 'Metodologia' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const noFunil = FUNIL.some((rota) => pathname.startsWith(rota));
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-card px-4 print:hidden sm:px-6">
      <Link href="/" aria-label="Syntaxis — página inicial" className="flex items-center">
        <Logo />
      </Link>
      <div className="flex items-center gap-6">
        {pathname === '/newsletter' && (
          // Épico 44: na página final o CTA do cabeçalho é a inscrição, não recomeçar o quiz.
          <SubscribeButton posicao="newsletter-header" size="default" className="h-9 w-fit px-4">
            <span className="sm:hidden">Assinar</span>
            <span className="hidden sm:inline">Assinar a newsletter</span>
          </SubscribeButton>
        )}
        {!noFunil && pathname !== '/newsletter' && (
          <>
            <nav aria-label="Principal" className="hidden gap-6 text-sm md:flex">
              {LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="text-foreground hover:underline">
                  {link.rotulo}
                </Link>
              ))}
            </nav>
            <Button variant="default" className="h-9 px-4" render={<Link href="/quiz" />}>
              Iniciar avaliação
            </Button>
          </>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
