import type { Metadata } from 'next';
import { CredibilityBand } from '@/components/landing/CredibilityBand';
import { DimensionsSection } from '@/components/landing/DimensionsSection';
import { HeroSection } from '@/components/landing/HeroSection';
import { StatsStripSection } from '@/components/landing/StatsStripSection';
import { getSiteUrl } from '@/lib/site-url';

export function generateMetadata(): Metadata {
  const title = 'Syntaxis Skill Check — Descubra seu nível técnico em finanças';
  const description =
    'Avaliação adaptativa de 10 a 15 minutos sobre renda fixa, matemática financeira, dados e IA aplicada ao mercado financeiro. Descubra seu nível e receba uma trilha personalizada.';

  return {
    title,
    description,
    // Épico 21: única rota pública indexável — canonical explícito aponta
    // para o domínio final (metadataBase, app/layout.tsx) mesmo que o
    // visitante chegue por um domínio de preview.
    alternates: { canonical: '/' },
    robots: { index: true, follow: true },
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

/**
 * Organization + WebSite (Épico 21, JSON-LD): dados apenas do que já é
 * verificável neste repositório (README.md, este próprio app) — nunca CNPJ,
 * endereço ou telefone que não foram fornecidos. `url` resolve para o
 * domínio final via metadataBase (app/layout.tsx), coerente com o
 * canonical acima.
 */
function organizationJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'Syntaxis',
        url: siteUrl,
      },
      {
        '@type': 'WebSite',
        name: 'Syntaxis Skill Check',
        url: siteUrl,
        inLanguage: 'pt-BR',
      },
    ],
  };
}

export default function Home() {
  return (
    <main className="flex flex-col">
      {/* JSON-LD estático, sem entrada do usuário — nada a sanitizar. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
      />
      <HeroSection />
      <DimensionsSection />
      <StatsStripSection />
      <CredibilityBand />
    </main>
  );
}
