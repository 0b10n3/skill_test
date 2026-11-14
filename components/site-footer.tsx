import Link from 'next/link';
import { CookiePreferencesButton } from '@/components/analytics/CookiePreferencesButton';
import { Logo } from '@/components/logo';

/**
 * Rodapé (C15, `brand/APLICACAO.md` §1.2 — Épico 38): marca, essência
 * (DESIGN.md §1.1) e só os links que existem no app. Fica nas páginas de
 * conteúdo (landing, privacidade), não no funil — quiz, lead e resultado
 * cabem numa tela.
 */
export function SiteFooter() {
  return (
    <footer className="w-full border-t border-border px-6 py-12 sm:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="text-sm text-muted-foreground">Estrutura que vira competência.</p>
        </div>
        <nav
          aria-label="Rodapé"
          className="flex flex-wrap gap-x-8 gap-y-3 text-sm whitespace-nowrap"
        >
          <Link href="/" className="text-foreground hover:underline">
            Skill Check
          </Link>
          <Link href="/newsletter" className="text-foreground hover:underline">
            Newsletter
          </Link>
          <Link href="/privacidade" className="text-foreground hover:underline">
            Privacidade
          </Link>
          <CookiePreferencesButton />
        </nav>
      </div>
      <p className="mx-auto mt-8 w-full max-w-6xl font-mono text-xs text-muted-foreground">
        © {new Date().getFullYear()} Syntaxis
      </p>
    </footer>
  );
}
