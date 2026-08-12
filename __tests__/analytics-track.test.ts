import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { sanitizeParams, track } from '../lib/analytics/track';

describe('sanitizeParams', () => {
  it('remove chaves de PII conhecidas (case-insensitive)', () => {
    const result = sanitizeParams({ Name: 'Maria', Email: 'maria@example.com', nivel: 'pleno' });
    expect(result).toEqual({ nivel: 'pleno' });
  });

  it('remove valores com formato de e-mail mesmo sob uma chave "segura"', () => {
    const result = sanitizeParams({ contato: 'alguem@dominio.com', classificacao: 'alto' });
    expect(result).toEqual({ classificacao: 'alto' });
  });

  it('preserva params sem PII intactos', () => {
    const params = { nivel: 'pleno', classificacao: 'alto', numero_questao: 5 };
    expect(sanitizeParams(params)).toEqual(params);
  });

  it('devolve objeto vazio para undefined', () => {
    expect(sanitizeParams(undefined)).toEqual({});
  });
});

describe('track', () => {
  let gtag: (...args: unknown[]) => void;
  let fbq: (...args: unknown[]) => void;

  beforeEach(() => {
    gtag = vi.fn();
    fbq = vi.fn();
    window.gtag = gtag;
    window.fbq = fbq;
  });

  afterEach(() => {
    delete window.gtag;
    delete window.fbq;
    vi.restoreAllMocks();
  });

  it('despacha para gtag e fbq com o nome de evento mapeado da taxonomia', () => {
    track('lead_submitted', { nivel: 'pleno' });
    expect(gtag).toHaveBeenCalledWith('event', 'generate_lead', { nivel: 'pleno' });
    expect(fbq).toHaveBeenCalledWith('track', 'Lead', { nivel: 'pleno' });
  });

  it('usa trackCustom (não track) para eventos que não são padrão do Meta', () => {
    track('quiz_start');
    expect(fbq).toHaveBeenCalledWith('trackCustom', 'quiz_start', {});
  });

  it('não chama fbq quando a taxonomia não prevê o evento no Meta (question_answered)', () => {
    track('question_answered', { numero: 3, dimensao: 'dados-programacao' });
    expect(gtag).toHaveBeenCalledWith('event', 'question_answered', {
      numero: 3,
      dimensao: 'dados-programacao',
    });
    expect(fbq).not.toHaveBeenCalled();
  });

  it('nunca envia PII para gtag/fbq mesmo se o chamador passar por engano', () => {
    track('lead_submitted', { name: 'Maria Teste', email: 'maria@example.com', nivel: 'pleno' });
    expect(gtag).toHaveBeenCalledWith('event', 'generate_lead', { nivel: 'pleno' });
    expect(fbq).toHaveBeenCalledWith('track', 'Lead', { nivel: 'pleno' });
  });

  it('não lança e não faz nada quando gtag/fbq ainda não existem (pré-consentimento)', () => {
    delete window.gtag;
    delete window.fbq;
    expect(() => track('quiz_complete')).not.toThrow();
  });
});
