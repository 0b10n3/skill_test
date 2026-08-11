import type { Metadata } from 'next';
import { DimensionsSection } from '@/components/landing/DimensionsSection';
import { HeroSection } from '@/components/landing/HeroSection';
import { MethodSection } from '@/components/landing/MethodSection';

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
    <main className="flex flex-col">
      <HeroSection />
      <DimensionsSection />
      <MethodSection />
    </main>
  );
}
