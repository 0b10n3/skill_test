import Link from 'next/link';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';

export function generateMetadata(): Metadata {
  const title = 'Syntaxis Skill Check — Descubra seu nível técnico em finanças';
  const description =
    'Avaliação adaptativa de 10 a 15 minutos sobre renda fixa, matemática financeira, dados e IA aplicada ao mercado financeiro. Descubra seu nível e receba uma trilha personalizada.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function Home() {
  return (
    <main className="flex h-dvh flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="flex flex-col gap-4">
        <p className="font-mono text-xs tracking-widest text-primary uppercase">
          Syntaxis Skill Check
        </p>
        <h1 className="font-display text-3xl font-bold text-balance text-foreground sm:text-4xl">
          Descubra seu nível técnico em finanças em alguns minutos
        </h1>
        <p className="mx-auto max-w-md text-base text-pretty text-muted-foreground">
          Uma avaliação adaptativa sobre renda fixa, matemática financeira, dados e IA aplicada ao
          mercado — calibrada para o seu momento de carreira.
        </p>
      </div>
      <p className="font-mono text-sm text-muted-foreground">
        10–15 min · 15 perguntas · múltipla escolha
      </p>
      <Button size="lg" render={<Link href="/quiz" />}>
        Iniciar avaliação
      </Button>
    </main>
  );
}
