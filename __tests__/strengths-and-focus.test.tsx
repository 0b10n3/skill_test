import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StrengthsAndFocus } from '@/components/result/StrengthsAndFocus';
import { ATENCAO_VAZIO, CATEGORY_LABEL, FORTES_VAZIO } from '@/content/relatorio';
import type { Diagnostico, DimensaoDiagnostico } from '@/lib/diagnostico';
import type { KnowledgeCategory } from '@/lib/types';

const CATEGORIAS: KnowledgeCategory[] = [
  'mercados-produtos',
  'matematica-quant',
  'dados-programacao',
  'ia-aplicada',
  'risco-regulacao',
];

function diagnosticoUniforme(acertos: number): Diagnostico {
  const score = Math.round((acertos / 3) * 100) / 100;
  const etiqueta = score >= 0.67 ? 'forte' : score <= 0.33 ? 'atencao' : 'neutro';
  const dimensoes: DimensaoDiagnostico[] = CATEGORIAS.map((category) => ({
    category,
    acertos,
    total: 3,
    score,
    etiqueta,
  }));
  return {
    scoreGlobal: score,
    acertos: acertos * 5,
    totalQuestoes: 15,
    classificacao: acertos === 3 ? 'alto' : 'baixo',
    dimensoes,
    // Como o motor faz quando ninguém cruza o limiar: cai no topo do ranking.
    fortes: ['mercados-produtos'],
    atencao: ['matematica-quant'],
    prioridades: CATEGORIAS.map((category) => ({ category, prioridade: 0.1 })),
    topicosParaRevisar: acertos === 0 ? ['Pergunta A...', 'Pergunta B...'] : [],
    respostas: [],
  };
}

describe('StrengthsAndFocus (Épico 43)', () => {
  it('com zero acertos, nenhuma dimensão aparece como destaque', () => {
    render(<StrengthsAndFocus diagnostico={diagnosticoUniforme(0)} seniority="junior" />);
    expect(screen.getByText(FORTES_VAZIO)).toBeInTheDocument();
    expect(screen.queryByText(CATEGORY_LABEL['mercados-produtos'])).not.toBeInTheDocument();
  });

  it('com 15 de 15, nenhuma dimensão aparece como o que trava', () => {
    render(<StrengthsAndFocus diagnostico={diagnosticoUniforme(3)} seniority="junior" />);
    expect(screen.getByText(ATENCAO_VAZIO)).toBeInTheDocument();
    expect(screen.queryByText(CATEGORY_LABEL['matematica-quant'])).not.toBeInTheDocument();
  });

  it('"Vale revisitar" é uma lista, um tópico por item', () => {
    render(<StrengthsAndFocus diagnostico={diagnosticoUniforme(0)} seniority="junior" />);
    const itens = screen.getAllByRole('listitem');
    expect(itens.map((li) => li.textContent)).toEqual(['Pergunta A...', 'Pergunta B...']);
  });
});
