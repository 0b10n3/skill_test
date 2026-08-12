import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getConsent, setConsent, subscribeToConsent } from '../lib/analytics/consent';

describe('consent', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('começa como "unset" antes de qualquer escolha', () => {
    expect(getConsent()).toBe('unset');
  });

  it('persiste a escolha em localStorage e getConsent reflete', () => {
    setConsent('granted');
    expect(getConsent()).toBe('granted');

    setConsent('denied');
    expect(getConsent()).toBe('denied');
  });

  it('ignora valor corrompido em localStorage e trata como "unset"', () => {
    window.localStorage.setItem('syntaxis-consent', 'algo-invalido');
    expect(getConsent()).toBe('unset');
  });

  it('notifica assinantes na troca de consentimento', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToConsent(listener);

    setConsent('granted');
    expect(listener).toHaveBeenCalledWith('granted');

    unsubscribe();
    setConsent('denied');
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
