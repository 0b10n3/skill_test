'use client';

import { Button } from '@/components/ui/button';
import { CTA_INSCRICAO } from '@/content/newsletter';
import { track, type TrackParams } from '@/lib/analytics/track';
import { substackSubscribeUrl } from '@/lib/substack';
import { cn } from '@/lib/utils';

interface SubscribeButtonProps {
  posicao: string;
  params?: TrackParams;
  variant?: 'default' | 'outline';
  size?: 'default' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

/**
 * Botão de inscrição (Épico 44): link para /subscribe com UTMs, em nova aba
 * (o diagnóstico continua aberto na aba original), e `cta_offer_click`.
 */
export function SubscribeButton({
  posicao,
  params,
  variant = 'default',
  size = 'lg',
  className,
  children = CTA_INSCRICAO,
}: SubscribeButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn('w-full sm:w-fit', className)}
      onClick={() => track('cta_offer_click', { ...params, posicao })}
      render={<a href={substackSubscribeUrl(posicao)} target="_blank" rel="noopener noreferrer" />}
    >
      {children}
      <span className="sr-only"> (abre em nova aba)</span>
    </Button>
  );
}
