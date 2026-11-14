import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/eyebrow';

// Épico 45 (F9): 404 da marca, sem imagem.
export const metadata: Metadata = {
  title: 'Página não encontrada — Syntaxis Skill Check',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-center gap-4 px-4 pt-14 sm:px-6">
      <Eyebrow>Erro 404</Eyebrow>
      <h1 className="font-display text-3xl font-bold text-balance text-foreground">
        Esta página não existe.
      </h1>
      <Button size="lg" className="w-full sm:w-fit" render={<Link href="/" />}>
        Ir para o Skill Check
      </Button>
    </main>
  );
}
