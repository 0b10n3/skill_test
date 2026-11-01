import type { Metadata } from 'next';
import { Analytics as VercelAnalytics } from '@vercel/analytics/next';
import { SpeedInsights as VercelSpeedInsights } from '@vercel/speed-insights/next';
import { preload } from 'react-dom';
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider';
import { ConsentBanner } from '@/components/analytics/ConsentBanner';
import { SiteHeader } from '@/components/site-header';
import { ThemeProvider } from '@/components/theme-provider';
import { QuizAnswersProvider } from '@/lib/quiz-context';
import { getSiteUrl } from '@/lib/site-url';
import './globals.css';

const FONTES = [
  'montserrat-latin.woff2',
  'source-sans-3-latin.woff2',
  'ibm-plex-mono-400-latin.woff2',
  'ibm-plex-mono-700-latin.woff2',
];

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: 'Syntaxis Skill Check',
  description:
    'Descubra seu nível técnico em finanças em alguns minutos — avaliação adaptativa por senioridade.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fontes servidas do repo (public/fonts, @font-face em globals.css — Épico 39): o build não
  // depende mais do Google Fonts. Preload dos quatro arquivos, como o next/font fazia.
  for (const arquivo of FONTES) {
    preload(`/fonts/${arquivo}`, { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });
  }
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <SiteHeader />
          <QuizAnswersProvider>{children}</QuizAnswersProvider>
          <AnalyticsProvider />
          <ConsentBanner />
        </ThemeProvider>
        {/*
          Vercel Web Analytics + Speed Insights: produto nativo da
          plataforma (não um SDK de terceiros como GA4/Meta) — sem
          cookies, sem PII, sem tracking entre sites (documentação da
          Vercel). Por isso ficam FORA do gate de consentimento LGPD do
          AnalyticsProvider acima, que existe especificamente para GA4 e
          Meta Pixel. Cada componente já faz nada em ambiente local/dev
          por padrão; em produção na Vercel, ativa automaticamente sem
          nenhuma variável de ambiente própria.
        */}
        <VercelAnalytics />
        <VercelSpeedInsights />
      </body>
    </html>
  );
}
