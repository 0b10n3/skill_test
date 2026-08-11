'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

/**
 * Toggle de tema global (Épico 14). Posicionamento/estilo são provisórios —
 * a composição final por página é dos Épicos 17–18; aqui só a função
 * (alternar + persistir) precisa existir e funcionar nos dois temas.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // A preferência de tema só é conhecida no client (localStorage/matchMedia);
  // evita mismatch de hidratação renderizando um placeholder neutro até montar.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div aria-hidden className="size-8" />;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? <Sun aria-hidden /> : <Moon aria-hidden />}
    </Button>
  );
}
