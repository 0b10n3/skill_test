import { expect, test, type Page, type Request } from '@playwright/test';

/**
 * Contagem de eventos com os IDs REAIS de GA4/Meta (Épico 42). Só roda com
 * ANALYTICS_REAL_IDS=1 contra um build feito com os IDs de produção — ver
 * GOLIVE.md, "Verificação de contagem de eventos". Com IDs falsos o
 * fbevents.js não dispara nada e o GA4 não recebe a configuração do fluxo
 * (Medição Otimizada), então duplicidade de page_view não aparece.
 *
 * Nada chega às plataformas: toda requisição de COLETA é respondida
 * localmente com 200 vazio (não abortada — um abort faz o fbevents.js tentar
 * outro transporte e a contagem sairia em dobro sem ser real). Só passam os
 * scripts e a configuração do fluxo, que não registram evento.
 */
test.skip(!process.env.ANALYTICS_REAL_IDS, 'só com ANALYTICS_REAL_IDS=1 (ver GOLIVE.md)');

const LEAD_NAME = 'Contagem Analytics';
const LEAD_EMAIL = 'analytics-count@example.com';

interface Hit {
  plataforma: 'ga4' | 'meta';
  evento: string;
  rota: string;
  bruto: string;
}

function isCollect(url: URL): boolean {
  const host = url.hostname;
  if (host.endsWith('google-analytics.com') || host.endsWith('analytics.google.com')) return true;
  if (host.endsWith('doubleclick.net') || host.endsWith('facebook.com')) return true;
  // Pings do GTM que não são o script em si (ex.: /a?…).
  if (host === 'www.googletagmanager.com' && !url.pathname.startsWith('/gtag/js')) return true;
  return false;
}

function parseHits(request: Request, rota: string): Hit[] {
  const url = new URL(request.url());
  const body = request.postData() ?? '';
  const bruto = `${request.url()}\n${body}`;

  if (url.hostname.endsWith('facebook.com')) {
    const ev = url.searchParams.get('ev') ?? new URLSearchParams(body).get('ev');
    return ev ? [{ plataforma: 'meta', evento: ev, rota, bruto }] : [];
  }
  if (url.pathname.endsWith('/collect')) {
    // GA4 agrupa eventos: o primeiro pode vir na query (en=), os demais um por linha no corpo.
    const nomes = [
      url.searchParams.get('en'),
      ...body.split('\n').map((linha) => new URLSearchParams(linha).get('en')),
    ].filter((nome): nome is string => Boolean(nome));
    return nomes.map((evento) => ({ plataforma: 'ga4' as const, evento, rota, bruto }));
  }
  return [];
}

async function registrarColetas(page: Page): Promise<Hit[]> {
  const hits: Hit[] = [];
  await page.route('**/*', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (isCollect(url)) {
      hits.push(...parseHits(request, new URL(page.url()).pathname));
      await route.fulfill({ status: 200, body: '' });
      return;
    }
    await route.continue();
  });
  return hits;
}

function contar(hits: Hit[], plataforma: Hit['plataforma'], evento: string): number {
  return hits.filter((hit) => hit.plataforma === plataforma && hit.evento === evento).length;
}

test('funil completo: um evento por ação, em cada plataforma, sem PII', async ({ page }) => {
  test.setTimeout(120_000);
  const hits = await registrarColetas(page);

  await page.goto('/');
  await page.getByRole('button', { name: 'Aceitar' }).click();
  await page.waitForTimeout(3000);

  await page.getByRole('link', { name: 'Iniciar avaliação' }).first().click();
  for (let i = 0; i < 16; i += 1) {
    await page.waitForSelector('[data-slot="card-title"]');
    await page.getByRole('radio').first().click();
    await page.getByRole('button', { name: 'Próxima' }).click();
  }

  await page.waitForURL('**/lead');
  // Tempo de uma pessoa real lendo o formulário: a Medição Otimizada do GA4
  // descarta uma troca de rota seguida de outra em menos de ~1 s.
  await page.waitForTimeout(4000);
  await page.locator('#lead-name').fill(LEAD_NAME);
  await page.locator('#lead-email').fill(LEAD_EMAIL);
  await page.getByRole('checkbox').click();
  await page.getByRole('button', { name: 'Ver meu resultado' }).click();
  await page.waitForURL('**/resultado', { timeout: 20_000 });
  // O GA4 envia em lote: dá tempo para o último lote sair.
  await page.waitForTimeout(8000);
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  await page.waitForTimeout(1000);

  const resumo = hits.map((hit) => `${hit.plataforma} ${hit.rota} ${hit.evento}`).join('\n');
  console.log(`--- eventos registrados ---\n${resumo}`);

  // Rotas visitadas: /, /quiz, /lead, /resultado.
  expect(contar(hits, 'ga4', 'page_view'), resumo).toBe(4);
  expect(contar(hits, 'meta', 'PageView'), resumo).toBe(4);

  expect(contar(hits, 'ga4', 'quiz_start')).toBe(1);
  expect(contar(hits, 'ga4', 'question_answered')).toBe(15);
  expect(contar(hits, 'ga4', 'quiz_complete')).toBe(1);
  expect(contar(hits, 'ga4', 'generate_lead')).toBe(1);
  expect(contar(hits, 'ga4', 'report_viewed')).toBe(1);

  expect(contar(hits, 'meta', 'quiz_start')).toBe(1);
  expect(contar(hits, 'meta', 'question_answered')).toBe(0);
  expect(contar(hits, 'meta', 'quiz_complete')).toBe(1);
  expect(contar(hits, 'meta', 'Lead')).toBe(1);
  expect(contar(hits, 'meta', 'report_viewed')).toBe(1);

  for (const hit of hits) {
    const texto = decodeURIComponent(hit.bruto.replace(/\+/g, ' '));
    expect(texto).not.toContain(LEAD_EMAIL);
    expect(texto).not.toContain(LEAD_NAME);
  }
});
