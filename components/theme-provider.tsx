'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

/**
 * Alterna a classe `dark` em <html> (attribute="class", já esperado pelo
 * @custom-variant dark do Tailwind em app/globals.css). defaultTheme="system"
 * + enableSystem: respeita prefers-color-scheme quando não há preferência
 * salva; a preferência salva (localStorage) tem prioridade quando existe.
 * O script de bloqueio do next-themes evita o flash de tema incorreto no
 * primeiro paint (critério de aceite do Épico 14).
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
