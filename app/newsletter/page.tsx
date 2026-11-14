import type { Metadata } from 'next';
import { NewsletterPage } from '@/components/newsletter/NewsletterPage';
import { SiteFooter } from '@/components/site-footer';
import { HERO } from '@/content/newsletter';
import { perfilDaQuery } from '@/lib/newsletter-perfil';

const title = 'Newsletter Syntaxis — finanças do mercado brasileiro, com rigor e sem hype';

export const metadata: Metadata = {
  title,
  description: HERO.generico.apoio,
  alternates: { canonical: '/newsletter' },
  robots: { index: true, follow: true },
  openGraph: { title, description: HERO.generico.apoio, type: 'website' },
};

/** Página final do funil (Épico 44). A query `?n&d&c` personaliza; o canonical é sempre sem query. */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <>
      <NewsletterPage perfilQuery={perfilDaQuery(await searchParams)} />
      <SiteFooter />
    </>
  );
}
