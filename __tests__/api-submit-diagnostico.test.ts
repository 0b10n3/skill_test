import { describe, expect, it, vi } from 'vitest';
import { buildAnswers, postSubmit } from './test-helpers';

const VALID_LEAD = { name: 'Maria Teste', email: 'maria@example.com', optIn: true as const };

describe('POST /api/submit — diagnóstico v2 (Épico 11) persistido e devolvido ao client (Épico 12)', () => {
  it('computa e loga o diagnóstico completo (5 dimensões + vetor item-a-item), sem PII no log, e devolve o diagnóstico na resposta HTTP', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const answers = buildAnswers('pleno', 9);
    const response = await postSubmit({ answers, lead: VALID_LEAD });
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.diagnostico).toBeDefined();
    expect(body.diagnostico.dimensoes).toHaveLength(5);

    const diagnosticoCall = logSpy.mock.calls.find(([label]) => label === '[diagnostico]');
    expect(diagnosticoCall).toBeDefined();

    const payload = JSON.parse(diagnosticoCall![1] as string);
    expect(payload.seniority).toBe('pleno');
    expect(payload.acertos).toBe(9);
    expect(payload.classificacao).toBe('medio');
    expect(payload.dimensoes).toHaveLength(5);
    expect(payload.respostas).toHaveLength(15);
    expect(
      payload.respostas.every(
        (r: { questionId: string; optionId: string }) =>
          typeof r.questionId === 'string' && typeof r.optionId === 'string',
      ),
    ).toBe(true);

    const loggedRaw = JSON.stringify(payload);
    expect(loggedRaw).not.toContain(VALID_LEAD.email);
    expect(loggedRaw).not.toContain(VALID_LEAD.name);

    logSpy.mockRestore();
  });
});
