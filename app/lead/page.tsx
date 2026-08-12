import type { Metadata } from 'next';
import { LeadPageClient } from './LeadPageClient';

// Épico 21: conteúdo transacional/pessoal (dados do lead em preenchimento) — nunca deve ranquear.
export const metadata: Metadata = {
  title: 'Últimos dados — Syntaxis Skill Check',
  robots: { index: false, follow: false },
};

export default function LeadPage() {
  return <LeadPageClient />;
}
