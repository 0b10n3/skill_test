import { describe, expect, it } from 'vitest';
import {
  CATEGORY_LABEL,
  CATEGORY_LABEL_SHORT,
  CLASSIFICATION_CONTEXT,
  CTA_HEADLINE,
  NEXT_LEVEL_LABEL,
  POR_QUE_IMPORTA,
  PRIMEIRO_PASSO,
  RADAR_SUMMARY,
  SCORE_CARD_COPY,
  SENIORITY_LABEL,
} from '@/content/relatorio';
import type { Classification, KnowledgeCategory, SeniorityLevel } from '@/lib/types';

const DIMENSIONS: KnowledgeCategory[] = [
  'mercados-produtos',
  'matematica-quant',
  'dados-programacao',
  'ia-aplicada',
  'risco-regulacao',
];
const LEVELS: SeniorityLevel[] = ['aspirante', 'estagiario', 'junior', 'pleno', 'senior'];
const CLASSIFICATIONS: Classification[] = ['baixo', 'medio', 'alto'];
const ETIQUETAS = ['forte', 'neutro', 'atencao'] as const;

/**
 * Matriz editorial 100% preenchida (REPORT.md §4, gate do Épico 12): nenhuma
 * combinação dimensão × nível × faixa cai em fallback/placeholder — todo
 * bloco existe e não é uma string vazia.
 */
describe('content/relatorio — matriz editorial completa', () => {
  it('15 microcopies de score card (5 dimensões × 3 faixas)', () => {
    for (const category of DIMENSIONS) {
      for (const etiqueta of ETIQUETAS) {
        expect(SCORE_CARD_COPY[category][etiqueta].length).toBeGreaterThan(0);
      }
    }
  });

  it('25 textos de "por que importa" (5 dimensões × 5 níveis)', () => {
    for (const category of DIMENSIONS) {
      for (const level of LEVELS) {
        expect(POR_QUE_IMPORTA[category][level].length).toBeGreaterThan(0);
      }
    }
  });

  it('25 "primeiros passos" (5 dimensões × 5 níveis)', () => {
    for (const category of DIMENSIONS) {
      for (const level of LEVELS) {
        expect(PRIMEIRO_PASSO[category][level].length).toBeGreaterThan(0);
      }
    }
  });

  it('15 copies de CTA (5 níveis × 3 classificações), interpoladas com a dimensão de prioridade', () => {
    for (const level of LEVELS) {
      for (const classification of CLASSIFICATIONS) {
        const headline = CTA_HEADLINE[level][classification]('Dados & Programação');
        expect(headline.length).toBeGreaterThan(0);
        expect(headline).toContain('Dados & Programação');
      }
    }
  });

  it('5 frases-resumo de radar (por dimensão dominante)', () => {
    for (const category of DIMENSIONS) {
      expect(RADAR_SUMMARY[category].length).toBeGreaterThan(0);
    }
  });

  it('rótulos de dimensão, nível e próximo degrau cobrem todas as chaves', () => {
    for (const category of DIMENSIONS) {
      expect(CATEGORY_LABEL[category].length).toBeGreaterThan(0);
      expect(CATEGORY_LABEL_SHORT[category].length).toBeGreaterThan(0);
    }
    for (const level of LEVELS) {
      expect(SENIORITY_LABEL[level].length).toBeGreaterThan(0);
      expect(NEXT_LEVEL_LABEL[level].length).toBeGreaterThan(0);
    }
  });

  it('microcopy de classificação (S1) sempre menciona o nível interpolado', () => {
    for (const classification of CLASSIFICATIONS) {
      const text = CLASSIFICATION_CONTEXT[classification]('Analista Pleno');
      expect(text).toContain('Analista Pleno');
    }
  });
});
