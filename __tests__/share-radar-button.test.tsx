import { describe, expect, expectTypeOf, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ShareRadarButton, type ShareRadarButtonProps } from '@/components/result/ShareRadarButton';

/**
 * S7 (Épico 18): o card compartilhável nunca pode carregar dado de
 * contato do lead. A garantia é estrutural — a assinatura do componente
 * só aceita dimensoes/classificacao — verificada tanto em tipo (não
 * compila se alguém adicionar participantName/leadEmail) quanto em
 * runtime (o componente renderiza normalmente sem essas props).
 */
describe('ShareRadarButtonProps — sem PII por construção', () => {
  it('a interface de props não tem campo de nome ou e-mail do lead', () => {
    expectTypeOf<ShareRadarButtonProps>().not.toHaveProperty('participantName');
    expectTypeOf<ShareRadarButtonProps>().not.toHaveProperty('leadEmail');
    expectTypeOf<ShareRadarButtonProps>().not.toHaveProperty('email');
    expectTypeOf<ShareRadarButtonProps>().not.toHaveProperty('name');
  });

  it('a interface de props só aceita dimensoes e classificacao', () => {
    expectTypeOf<ShareRadarButtonProps>().toEqualTypeOf<{
      dimensoes: ShareRadarButtonProps['dimensoes'];
      classificacao: ShareRadarButtonProps['classificacao'];
    }>();
  });
});

function makeDimensoes(): ShareRadarButtonProps['dimensoes'] {
  return [
    { category: 'mercados-produtos', acertos: 3, total: 3, score: 1, etiqueta: 'forte' },
    { category: 'matematica-quant', acertos: 2, total: 3, score: 0.67, etiqueta: 'neutro' },
    { category: 'dados-programacao', acertos: 1, total: 3, score: 0.33, etiqueta: 'atencao' },
    { category: 'ia-aplicada', acertos: 0, total: 3, score: 0, etiqueta: 'atencao' },
    { category: 'risco-regulacao', acertos: 2, total: 3, score: 0.67, etiqueta: 'neutro' },
  ];
}

describe('ShareRadarButton', () => {
  it('renderiza normalmente só com dimensoes e classificacao', () => {
    render(<ShareRadarButton dimensoes={makeDimensoes()} classificacao="alto" />);
    expect(screen.getByRole('button', { name: 'Compartilhar meu radar' })).toBeInTheDocument();
  });
});
