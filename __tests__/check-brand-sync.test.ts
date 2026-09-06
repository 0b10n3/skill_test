import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

// Roda o script real (não uma reimplementação) — mesmo padrão de
// check-tokens-breaking.test.ts. Em CI/build de produção (Vercel), onde o
// monorepo não está ao lado deste repositório, o script sai verde sem
// comparar nada (ver scripts/check-brand-sync.mjs) — este teste passa nos
// dois ambientes.
describe('check-brand-sync.mjs', () => {
  it('sai com status 0 — cópia local em sincronia com brand/, ou brand/ ausente (build de produção)', () => {
    const rootDir = path.resolve(__dirname, '..');
    expect(() =>
      execFileSync('node', ['scripts/check-brand-sync.mjs'], { cwd: rootDir }),
    ).not.toThrow();
  });
});
