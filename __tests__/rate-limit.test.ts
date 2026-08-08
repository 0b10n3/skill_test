import { describe, expect, it } from 'vitest';
import { checkRateLimit } from '@/lib/rate-limit';

describe('checkRateLimit', () => {
  it('permite até o limite de requisições na janela e bloqueia a próxima', () => {
    const ip = `test-ip-${Math.random()}`;
    const now = Date.now();

    for (let i = 0; i < 10; i += 1) {
      expect(checkRateLimit(ip, now).allowed).toBe(true);
    }

    expect(checkRateLimit(ip, now).allowed).toBe(false);
  });

  it('libera novamente depois que a janela desliza para frente', () => {
    const ip = `test-ip-${Math.random()}`;
    const start = Date.now();

    for (let i = 0; i < 10; i += 1) {
      checkRateLimit(ip, start);
    }
    expect(checkRateLimit(ip, start).allowed).toBe(false);

    const later = start + 61_000;
    expect(checkRateLimit(ip, later).allowed).toBe(true);
  });

  it('IPs diferentes têm contadores independentes', () => {
    const now = Date.now();
    const ipA = `ip-a-${Math.random()}`;
    const ipB = `ip-b-${Math.random()}`;

    for (let i = 0; i < 10; i += 1) checkRateLimit(ipA, now);

    expect(checkRateLimit(ipA, now).allowed).toBe(false);
    expect(checkRateLimit(ipB, now).allowed).toBe(true);
  });
});
