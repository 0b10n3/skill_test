import { describe, expect, it } from 'vitest';
import { generateCss, kebabCase, resolveValue } from '../scripts/lib/generate-tokens.mjs';

/** Fixture mínima, no mesmo formato DTCG de design/tokens.json v1.1.0. */
function makeFixtureTokens() {
  return {
    color: {
      forest: {
        500: { $value: '#1B6A45', $type: 'color' },
      },
      grove: {
        500: { $value: '#2D9E67', $type: 'color' },
      },
      amber: {
        500: { $value: '#C9832A', $type: 'color' },
      },
      neutral: {
        chalk: { $value: '#F7F7F5', $type: 'color' },
        ink: { $value: '#141414', $type: 'color' },
      },
      semantic: {
        error: { $value: '#EF4444', $type: 'color' },
      },
      theme: {
        light: {
          background: { $value: '{color.neutral.chalk}', $type: 'color' },
          foreground: { $value: '{color.neutral.ink}', $type: 'color' },
          primary: { $value: '{color.forest.500}', $type: 'color' },
        },
        dark: {
          background: { $value: '#00120A', $type: 'color' },
          foreground: { $value: '{color.neutral.chalk}', $type: 'color' },
          primary: { $value: '{color.grove.500}', $type: 'color' },
        },
      },
    },
    typography: {
      fontFamily: {
        display: { $value: ['DM Serif Display', 'Georgia', 'serif'], $type: 'fontFamily' },
      },
      fontWeight: {
        regular: { $value: 400, $type: 'fontWeight' },
      },
      scale: {
        displayXl: {
          $type: 'typography',
          $value: {
            fontFamily: '{typography.fontFamily.display}',
            fontWeight: '{typography.fontWeight.regular}',
            fontStyle: 'italic',
            fontSize: '48px',
            lineHeight: '1.1',
          },
        },
      },
    },
    spacing: {
      xs: { $value: '8px', $type: 'dimension' },
    },
    radius: {
      lg: { $value: '10px', $type: 'dimension' },
    },
    shadow: {
      syntaxis: {
        $type: 'shadow',
        $value: {
          color: 'rgba(27, 106, 69, 0.08)',
          offsetX: '0px',
          offsetY: '4px',
          blur: '16px',
          spread: '0px',
        },
      },
    },
    pattern: {
      nodeBranch: {
        nodeRadius: { $value: '2.5px', $type: 'dimension' },
        color: { $value: '{color.grove.500}', $type: 'color' },
      },
    },
  };
}

describe('resolveValue', () => {
  const tokens = makeFixtureTokens();

  it('retorna valores literais sem alteração', () => {
    expect(resolveValue(tokens, '#1B6A45')).toBe('#1B6A45');
    expect(resolveValue(tokens, 400)).toBe(400);
  });

  it('resolve um alias direto {color.forest.500}', () => {
    expect(resolveValue(tokens, '{color.forest.500}')).toBe('#1B6A45');
  });

  it('resolve aliases encadeados (theme.light.background → neutral.chalk)', () => {
    expect(resolveValue(tokens, '{color.theme.light.background}')).toBe('#F7F7F5');
  });

  it('lança erro para um alias que não existe na árvore de tokens', () => {
    expect(() => resolveValue(tokens, '{color.nao.existe}')).toThrow('Alias não resolvido');
  });
});

describe('kebabCase', () => {
  it('converte camelCase para kebab-case', () => {
    expect(kebabCase('primaryForeground')).toBe('primary-foreground');
    expect(kebabCase('nodeBranch')).toBe('node-branch');
    expect(kebabCase('background')).toBe('background');
  });
});

describe('generateCss', () => {
  const css = generateCss(makeFixtureTokens());

  it('inclui o aviso de arquivo gerado e a fonte', () => {
    expect(css).toContain('ARQUIVO GERADO');
    expect(css).toContain('design/tokens.json');
  });

  it('gera primitivos de cor com aliases já resolvidos (nunca {a.b.c} cru na saída)', () => {
    expect(css).toContain('--color-forest-500: #1B6A45;');
    expect(css).toContain('--color-grove-500: #2D9E67;');
    expect(css).not.toMatch(/\{color\.[a-zA-Z.]+\}/);
  });

  it('gera a camada semântica :root (light) e .dark com os aliases resolvidos', () => {
    expect(css).toContain('--background: #F7F7F5;');
    expect(css).toContain('--primary: #1B6A45;');

    const darkBlockStart = css.indexOf('.dark {');
    const darkBlock = css.slice(darkBlockStart);
    expect(darkBlock).toContain('--background: #00120A;');
    expect(darkBlock).toContain('--primary: #2D9E67;');
    expect(darkBlock).toContain('--foreground: #F7F7F5;');
  });

  it('gera radius e tokens de padrão com nomes em kebab-case', () => {
    expect(css).toContain('--radius-lg: 10px;');
    expect(css).toContain('--pattern-node-branch-node-radius: 2.5px;');
    expect(css).toContain('--pattern-node-branch-color: #2D9E67;');
  });

  it('NÃO gera --spacing-* nomeado: colide com o namespace que o Tailwind v4 usa para max-w-*/w-* (achado real do Épico 14 — grid de 8px já é representável pela escala numérica padrão do Tailwind: xs=2, sm=4, md=6, lg=8, xl=12, 2xl=16)', () => {
    expect(css).not.toMatch(/--spacing-[a-z0-9]+:/);
  });

  it('gera a sombra com a cor rgba embutida', () => {
    expect(css).toContain('--shadow-syntaxis: 0px 4px 16px 0px rgba(27, 106, 69, 0.08);');
  });

  it('gera uma classe utilitária por token de typography.scale', () => {
    expect(css).toContain('.text-display-xl {');
    expect(css).toContain('font-family: "DM Serif Display", Georgia, serif;');
    expect(css).toContain('font-weight: 400;');
    expect(css).toContain('font-style: italic;');
  });

  it('é determinístico: mesma entrada produz exatamente a mesma saída', () => {
    const second = generateCss(makeFixtureTokens());
    expect(second).toBe(css);
  });
});
