import type { Metadata } from 'next';
import { Analytics as VercelAnalytics } from '@vercel/analytics/next';
import { SpeedInsights as VercelSpeedInsights } from '@vercel/speed-insights/next';
import { Hanken_Grotesk, Space_Grotesk, Space_Mono } from 'next/font/google';
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider';
import { ConsentBanner } from '@/components/analytics/ConsentBanner';
import { SiteHeader } from '@/components/site-header';
import { ThemeProvider } from '@/components/theme-provider';
import { QuizAnswersProvider } from '@/lib/quiz-context';
import { getSiteUrl } from '@/lib/site-url';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['500', '700'],
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: '--font-hanken-grotesk',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});

const spaceMono = Space_Mono({
  variable: '--font-space-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  fallback: ['Courier New', 'monospace'],
});

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
  return (
    <html
      lang="pt-BR"
      className={`${spaceGrotesk.variable} ${hankenGrotesk.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
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
