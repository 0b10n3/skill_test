import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

// Roda o script real (não uma reimplementação) — é a mesma verificação que
// `npm run check:tokens-breaking` faz parte do prebuild: o diff entre
// design/archive/tokens-v2.7.0.json e design/tokens.json bate exatamente
// com o changelog 3.0.0 (Épico 37; allowlist em scripts/check-tokens-breaking.mjs).
describe('check-tokens-breaking.mjs', () => {
  it('sai com status 0 — o diff v2.7.0 → v3.x coincide com o changelog declarado', () => {
    const rootDir = path.resolve(__dirname, '..');
    expect(() =>
      execFileSync('node', ['scripts/check-tokens-breaking.mjs'], { cwd: rootDir }),
    ).not.toThrow();
  });
});
