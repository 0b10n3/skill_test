import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { cn } from '../lib/utils';

/**
 * Regressão real (Épico 20): tailwind-merge, por padrão, trata qualquer
 * classe `text-<palavra>` sem sufixo de escala numérica como candidata a
 * cor de texto — então `cn('text-eyebrow', 'text-grove-700')` descartava
 * silenciosamente `text-eyebrow` (o componente Eyebrow renderizava sem
 * nenhuma propriedade do token: sem Space Mono, sem caixa alta, sem
 * tracking — só a cor sobrava). lib/utils.ts registra as classes de
 * typography.scale num grupo próprio para essa colisão nunca mais
 * acontecer; este teste prova isso para toda classe gerada, não só para
 * `text-eyebrow`.
 */
describe('cn — classes de typography.scale nunca colidem com cor de texto', () => {
  it('preserva text-eyebrow ao lado de uma cor de texto', () => {
    expect(cn('text-eyebrow', 'text-grove-700')).toContain('text-eyebrow');
  });

  it('preserva text-data-xl ao lado de text-foreground', () => {
    expect(cn('text-data-xl', 'text-foreground')).toContain('text-data-xl');
  });

  it('ainda resolve conflito entre duas classes da MESMA escala (a última vence)', () => {
    expect(cn('text-eyebrow', 'text-caption')).toBe('text-caption');
  });

  it('cobre toda classe de typography.scale de design/tokens.json — nenhuma some ao lado de uma cor', () => {
    const rootDir = path.resolve(__dirname, '..');
    const tokens = JSON.parse(readFileSync(path.join(rootDir, 'design/tokens.json'), 'utf-8'));
    const scaleNames = Object.keys(tokens.typography.scale).filter((key) => !key.startsWith('$'));

    for (const name of scaleNames) {
      const className = `text-${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;
      const result = cn(className, 'text-foreground');
      expect(
        result,
        `${className} não deveria ser descartada ao lado de text-foreground`,
      ).toContain(className);
    }
  });
});
