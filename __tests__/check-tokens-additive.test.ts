import { readFileSync } from 'node:fs';
import path from 'node:path';
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

  it('design/tokens.json v1.2.0 real é puramente aditivo sobre o snapshot congelado da v1.1.0', () => {
    const rootDir = path.resolve(__dirname, '..');
    const oldTokens = JSON.parse(
      readFileSync(path.join(rootDir, 'design/archive/tokens-v1.1.0.json'), 'utf-8'),
    );
    const newTokens = JSON.parse(readFileSync(path.join(rootDir, 'design/tokens.json'), 'utf-8'));
    const result = diffTokens(oldTokens, newTokens);
    expect(result.changed).toEqual([]);
    expect(result.removed).toEqual([]);
    expect(result.ok).toBe(true);
    expect(result.added.length).toBeGreaterThan(0);
  });
});
