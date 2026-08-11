import { describe, expect, it } from 'vitest';
import { splitCodeTerms } from '@/lib/highlight-code-terms';

describe('splitCodeTerms', () => {
  it('texto sem termo técnico volta como um único segmento não-código', () => {
    expect(splitCodeTerms('LCI e LCA têm isenção de IR para pessoa física.')).toEqual([
      { text: 'LCI e LCA têm isenção de IR para pessoa física.', isCode: false },
    ]);
  });

  it('reconhece palavras-chave SQL como código', () => {
    const segments = splitCodeTerms('SELECT define as colunas; FROM, a tabela.');
    expect(segments).toContainEqual({ text: 'SELECT', isCode: true });
    expect(segments).toContainEqual({ text: 'FROM', isCode: true });
  });

  it('reconhece chamada de função como um único termo de código', () => {
    const segments = splitCodeTerms('HAVING AVG(taxa) > 0.12 filtra grupos.');
    expect(segments).toContainEqual({ text: 'HAVING', isCode: true });
    expect(segments).toContainEqual({ text: 'AVG(taxa)', isCode: true });
  });

  it('reconhece identificador snake_case', () => {
    const segments = splitCodeTerms('relaciona tabelas por id_emissor.');
    expect(segments).toContainEqual({ text: 'id_emissor', isCode: true });
  });

  it('preserva a ordem e o conteúdo total do texto original ao concatenar os segmentos', () => {
    const text =
      'O JOIN relaciona tabelas por colunas-chave (ex.: id_emissor), enriquecendo a base.';
    const segments = splitCodeTerms(text);
    expect(segments.map((s) => s.text).join('')).toBe(text);
  });
});
