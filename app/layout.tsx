import type { Metadata } from 'next';
import { DM_Sans, DM_Serif_Display, Space_Mono } from 'next/font/google';
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider';
import { ConsentBanner } from '@/components/analytics/ConsentBanner';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { QuizAnswersProvider } from '@/lib/quiz-context';
import { getSiteUrl } from '@/lib/site-url';
import './globals.css';

const dmSerifDisplay = DM_Serif_Display({
  variable: '--font-dm-serif-display',
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
  fallback: ['Georgia', 'serif'],
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
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
      className={`${dmSerifDisplay.variable} ${dmSans.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <ThemeProvider>
          <div className="fixed top-3 right-3 z-50">
            <ThemeToggle />
          </div>
          <QuizAnswersProvider>{children}</QuizAnswersProvider>
          <AnalyticsProvider />
          <ConsentBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
