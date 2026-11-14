import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { offers } from '@/content/offers';
import { track } from '@/lib/analytics/track';
import type { Classification, SeniorityLevel } from '@/lib/types';

interface OfferBlockProps {
  classification: Classification;
  seniority: SeniorityLevel;
}

function isPlaceholderLink(href: string): boolean {
  return href.startsWith('[');
}

export function OfferBlock({ classification, seniority }: OfferBlockProps) {
  const offer = offers[classification];
  const hasRealLink = !isPlaceholderLink(offer.ctaHref);

  function handleCtaClick() {
    // cta_offer_click: clique que sai para o Substack — nunca PII. `posicao` desde o Épico 42.
    track('cta_offer_click', {
      nivel: seniority,
      classificacao: classification,
      posicao: 'resultado',
    });
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="font-display text-lg text-foreground">{offer.title}</CardTitle>
        <CardDescription>{offer.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {hasRealLink ? (
          <Button
            size="lg"
            onClick={handleCtaClick}
            render={<Link href={offer.ctaHref} target="_blank" rel="noopener noreferrer" />}
          >
            {offer.ctaLabel}
          </Button>
        ) : (
          <Button size="lg" disabled title="Link da oferta ainda não definido">
            {offer.ctaLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
