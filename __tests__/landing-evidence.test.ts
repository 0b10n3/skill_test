import { describe, expect, it } from 'vitest';
import {
  countBankItemsByCategory,
  getEvidenceExplanation,
  getEvidenceQuestion,
} from '../lib/landing-evidence';

describe('getEvidenceQuestion', () => {
  it('devolve pergunta/alternativas reais do banco sem correctOptionId', () => {
    const q = getEvidenceQuestion('q16');
    expect(q.question).toContain('correlação');
    expect(q.options.length).toBeGreaterThan(1);
    expect(q).not.toHaveProperty('correctOptionId');
    expect(JSON.stringify(q)).not.toContain('correctOptionId');
  });

  it('lança erro para um id inexistente', () => {
    expect(() => getEvidenceQuestion('q999')).toThrow();
  });

  it('lança erro para a pergunta de senioridade (q00, não é knowledge)', () => {
    expect(() => getEvidenceQuestion('q00')).toThrow();
  });
});

describe('getEvidenceExplanation', () => {
  it('devolve o texto real de explanation do banco', () => {
    const explanation = getEvidenceExplanation('q34');
    expect(explanation.length).toBeGreaterThan(20);
  });
});

describe('countBankItemsByCategory', () => {
  it('conta itens reais do banco, não um valor fixo inventado', () => {
    const count = countBankItemsByCategory('risco-regulacao');
    expect(count).toBeGreaterThanOrEqual(3);
  });
});
