import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { primeiroNome, ReportHeader } from '@/components/result/ReportHeader';
import { CLASSIFICATION_LABEL_LONGO, VEREDITO_TITULO } from '@/content/relatorio';
import type { Classification } from '@/lib/types';

function renderHeader(classificacao: Classification, participantName = 'Fulano de Tal') {
  return render(
    <ReportHeader
      participantName={participantName}
      seniority="pleno"
      submittedAt="2026-08-11T12:00:00.000Z"
      classificacao={classificacao}
      scoreGlobal={0.6}
      acertos={9}
      totalQuestoes={15}
    />,
  );
}

/**
 * S1 — Lime (achievement) só no selo "Acima da expectativa"; nunca destructive para
 * qualificar o resultado da pessoa. Épico 43: veredito com o primeiro nome, número
 * "N de 15" e selo com rótulo relativo ao nível.
 */
describe('ReportHeader', () => {
  it.each(['baixo', 'medio'] as const)(
    'classificação "%s" não usa achievement (Lime) nem destructive',
    (classificacao) => {
      renderHeader(classificacao);
      const badge = screen.getByTestId('score-classificacao');
      expect(badge.dataset.variant).not.toBe('achievement');
      expect(badge.dataset.variant).not.toBe('destructive');
    },
  );

  it('classificação "alto" usa a variante achievement (Lime)', () => {
    renderHeader('alto');
    expect(screen.getByTestId('score-classificacao').dataset.variant).toBe('achievement');
  });

  it('nenhuma classificação usa sombra (DESIGN.md v4.0)', () => {
    for (const classificacao of ['baixo', 'medio', 'alto'] as const) {
      const { unmount } = renderHeader(classificacao);
      expect(screen.getByTestId('score-classificacao').className).not.toMatch(/shadow/);
      unmount();
    }
  });

  it.each(['baixo', 'medio', 'alto'] as const)(
    'veredito "%s": primeiro nome, frase da classificação e rótulo longo',
    (classificacao) => {
      renderHeader(classificacao);
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent(`Fulano, ${VEREDITO_TITULO[classificacao]('Analista Pleno')}`);
      expect(screen.getByTestId('score-classificacao')).toHaveTextContent(
        CLASSIFICATION_LABEL_LONGO[classificacao],
      );
    },
  );

  it('mostra o número como "N/total" e o percentual', () => {
    renderHeader('medio');
    expect(screen.getByTestId('score-geral')).toHaveTextContent(
      '9/15questões certas · 60% de acerto',
    );
  });

  it('o logo existe só para a impressão', () => {
    renderHeader('medio');
    expect(screen.getByRole('img', { name: 'Syntaxis' }).className).toMatch(/hidden print:/);
  });
});

describe('primeiroNome', () => {
  it('usa a primeira palavra, sem espaços nas pontas', () => {
    expect(primeiroNome('  Maria   da Silva ')).toBe('Maria');
  });

  it('corta em 24 caracteres', () => {
    expect(primeiroNome('A'.repeat(40))).toHaveLength(24);
  });
});
