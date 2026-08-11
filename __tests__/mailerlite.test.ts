import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const createOrUpdateMock = vi.fn();

vi.mock('@mailerlite/mailerlite-nodejs', () => ({
  default: vi.fn().mockImplementation(function MockMailerLite() {
    return { subscribers: { createOrUpdate: createOrUpdateMock } };
  }),
}));

const ORIGINAL_ENV = { ...process.env };

async function importFreshMailerLiteModule() {
  vi.resetModules();
  return import('@/lib/mailerlite');
}

describe('syncLeadToMailerLite', () => {
  beforeEach(() => {
    createOrUpdateMock.mockReset();
    createOrUpdateMock.mockResolvedValue({ data: {} });
    process.env.MAILERLITE_API_KEY = 'test-api-key';
    process.env.MAILERLITE_GROUP_ID = 'group-syntaxis-skill-app';
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it('envia email, fields e groups no formato esperado pela API do MailerLite', async () => {
    const { syncLeadToMailerLite } = await importFreshMailerLiteModule();

    await syncLeadToMailerLite({
      email: 'lead@example.com',
      name: 'Lead Teste',
      seniority: 'pleno',
      scoreGeral: 66.67,
      classification: 'medio',
      topPriorityCategory: 'dados-programacao',
    });

    expect(createOrUpdateMock).toHaveBeenCalledTimes(1);
    const [payload] = createOrUpdateMock.mock.calls[0];

    expect(payload.email).toBe('lead@example.com');
    expect(payload.groups).toEqual(['group-syntaxis-skill-app']);
    expect(payload.fields).toMatchObject({
      name: 'Lead Teste',
      seniority: 'pleno',
      score_geral: 66.67,
      classificacao: 'medio',
      perfil_tecnico: 'dados-programacao',
    });
  });

  it('todas as classificações vão para o mesmo grupo único', async () => {
    const { syncLeadToMailerLite } = await importFreshMailerLiteModule();

    await syncLeadToMailerLite({
      email: 'a@example.com',
      name: 'A',
      seniority: 'senior',
      scoreGeral: 90,
      classification: 'alto',
    });
    expect(createOrUpdateMock.mock.calls[0][0].groups).toEqual(['group-syntaxis-skill-app']);

    await syncLeadToMailerLite({
      email: 'b@example.com',
      name: 'B',
      seniority: 'aspirante',
      scoreGeral: 10,
      classification: 'baixo',
    });
    expect(createOrUpdateMock.mock.calls[1][0].groups).toEqual(['group-syntaxis-skill-app']);
  });

  it('nunca lança erro para o chamador quando a chamada à API falha (não-bloqueante)', async () => {
    createOrUpdateMock.mockRejectedValue(new Error('Falha de rede simulada'));
    const { syncLeadToMailerLite } = await importFreshMailerLiteModule();

    await expect(
      syncLeadToMailerLite({
        email: 'falha@example.com',
        name: 'Falha',
        seniority: 'junior',
        scoreGeral: 50,
        classification: 'medio',
      }),
    ).resolves.toBeUndefined();
  });

  it('sem MAILERLITE_API_KEY configurada, não chama a API e não lança erro', async () => {
    delete process.env.MAILERLITE_API_KEY;
    const { syncLeadToMailerLite } = await importFreshMailerLiteModule();

    await expect(
      syncLeadToMailerLite({
        email: 'sem-key@example.com',
        name: 'Sem Key',
        seniority: 'estagiario',
        scoreGeral: 30,
        classification: 'baixo',
      }),
    ).resolves.toBeUndefined();

    expect(createOrUpdateMock).not.toHaveBeenCalled();
  });
});
