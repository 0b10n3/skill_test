import { describe, expect, it } from 'vitest';
import { diffTokens, flattenTokens } from '../scripts/lib/check-tokens-additive.mjs';

describe('flattenTokens', () => {
  it('achata nós folha ($value) em paths com ponto, ignorando metadados', () => {
    const tree = {
      color: {
        forest: { 500: { $value: '#1B6A45', $type: 'color', $description: 'ignorado' } },
      },
    };
    const flat = flattenTokens(tree);
    expect(flat.get('color.forest.500')).toBe('"#1B6A45"');
    expect(flat.size).toBe(1);
  });
});

describe('diffTokens', () => {
  it('não reporta nada quando a nova árvore só acrescenta tokens', () => {
    const oldTokens = { radius: { lg: { $value: '10px' } } };
    const newTokens = {
      radius: { lg: { $value: '10px' }, xl: { $value: '16px' } },
    };
    const result = diffTokens(oldTokens, newTokens);
    expect(result.ok).toBe(true);
    expect(result.changed).toEqual([]);
    expect(result.removed).toEqual([]);
    expect(result.added).toEqual(['radius.xl']);
  });

  it('falha quando um token pré-existente muda de valor', () => {
    const oldTokens = {
      color: { theme: { light: { secondary: { $value: '{color.grove.700}' } } } },
    };
    const newTokens = {
      color: { theme: { light: { secondary: { $value: '{color.grove.500}' } } } },
    };
    const result = diffTokens(oldTokens, newTokens);
    expect(result.ok).toBe(false);
    expect(result.changed).toEqual([
      {
        path: 'color.theme.light.secondary',
        old: '"{color.grove.700}"',
        new: '"{color.grove.500}"',
      },
    ]);
  });

  it('falha quando um token pré-existente é removido', () => {
    const oldTokens = { color: { semantic: { errorText: { $value: '#B91C1C' } } } };
    const newTokens = { color: { semantic: {} } };
    const result = diffTokens(oldTokens, newTokens);
    expect(result.ok).toBe(false);
    expect(result.removed).toEqual(['color.semantic.errorText']);
  });

  // A verificação real de design/tokens.json não é mais "puramente aditivo"
  // desde o Épico 22: a v2.0.0 é um bump MAIOR declarado (Amber→Lime,
  // cantos retos, tipografia). `diffTokens` continua sendo a lógica de
  // comparação usada — mas quem decide "esse diff é esperado?" agora é
  // scripts/check-tokens-breaking.mjs (allowlist contra o changelog), não
  // mais "zero diff". Ver esse script (rodado via `npm run
  // check:tokens-breaking`, parte do prebuild) para a verificação real
  // contra o design/tokens.json do repositório.
});
