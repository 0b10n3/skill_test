import { describe, expect, it } from 'vitest';
import { substackSubscribeUrl } from '@/lib/substack';

describe('substackSubscribeUrl (Épico 42)', () => {
  it('aponta para /subscribe com os quatro UTMs', () => {
    const url = new URL(substackSubscribeUrl('resultado'));
    expect(url.origin + url.pathname).toBe('https://syntaxis.substack.com/subscribe');
    expect(Object.fromEntries(url.searchParams)).toEqual({
      utm_source: 'skill-check',
      utm_medium: 'app',
      utm_campaign: 'diagnostico',
      utm_content: 'resultado',
    });
  });

  it('codifica a posição', () => {
    const url = new URL(substackSubscribeUrl('newsletter hero&x=1'));
    expect(url.searchParams.get('utm_content')).toBe('newsletter hero&x=1');
    expect(url.searchParams.get('x')).toBeNull();
  });
});
