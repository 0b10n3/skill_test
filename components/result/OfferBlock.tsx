import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { offers } from '@/content/offers';
import type { Classification } from '@/lib/types';

interface OfferBlockProps {
  classification: Classification;
}

function isPlaceholderLink(href: string): boolean {
  return href.startsWith('[');
}

export function OfferBlock({ classification }: OfferBlockProps) {
  const offer = offers[classification];
  const hasRealLink = !isPlaceholderLink(offer.ctaHref);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="font-display text-lg text-foreground">{offer.title}</CardTitle>
        <CardDescription>{offer.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {hasRealLink ? (
          <Button size="lg" render={<Link href={offer.ctaHref} />}>
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
