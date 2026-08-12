import { expect, test, type Page, type Route } from '@playwright/test';

// GA4 (gtag.js) e Meta Pixel (fbevents.js) são sempre carregados desses
// hosts, independente do measurement/pixel ID — testável mesmo com os IDs
// falsos injetados só para teste (playwright.config.ts webServer.env).
const ANALYTICS_HOST_PATTERN = /googletagmanager\.com|google-analytics\.com|facebook\.net/;

/** Intercepta e aborta toda requisição a domínios de analytics — nunca depende de rede real, e ainda assim prova a tentativa. */
async function trackAnalyticsRequests(page: Page): Promise<string[]> {
  const requests: string[] = [];
  await page.route('**/*', (route: Route) => {
    const url = route.request().url();
    if (ANALYTICS_HOST_PATTERN.test(url)) {
      requests.push(url);
      route.abort();
      return;
    }
    route.continue();
  });
  return requests;
}

test.describe('Consentimento LGPD (Épico 21) — GA4/Meta Pixel só carregam depois do aceite', () => {
  test('sem nenhuma escolha, nenhuma requisição sai para Google/Meta e o banner aparece', async ({
    page,
  }) => {
    const requests = await trackAnalyticsRequests(page);

    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Aceitar' })).toBeVisible();

    await page.waitForTimeout(1000);
    expect(requests).toEqual([]);
  });

  test('recusar mantém zero requisições, some o banner e persiste entre reloads', async ({
    page,
  }) => {
    const requests = await trackAnalyticsRequests(page);

    await page.goto('/');
    await page.getByRole('button', { name: 'Recusar' }).click();
    await expect(page.getByRole('button', { name: 'Recusar' })).toHaveCount(0);

    await page.waitForTimeout(1000);
    expect(requests).toEqual([]);

    // Reload: a escolha "denied" já foi persistida — o banner não pode voltar.
    await page.reload();
    await page.waitForTimeout(500);
    await expect(page.getByRole('button', { name: 'Recusar' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Aceitar' })).toHaveCount(0);
    expect(requests).toEqual([]);
  });

  test('aceitar carrega GA4 e Meta Pixel, e a escolha persiste entre reloads', async ({ page }) => {
    const requests = await trackAnalyticsRequests(page);

    await page.goto('/');
    await page.getByRole('button', { name: 'Aceitar' }).click();
    await expect(page.getByRole('button', { name: 'Aceitar' })).toHaveCount(0);

    // page.waitForRequest não dispara para requisições abortadas via
    // route() antes do evento 'request' propagar (achado real deste
    // teste) — o próprio array populado dentro do handler de route() é o
    // sinal confiável de que a requisição foi de fato iniciada.
    await expect.poll(() => requests.length, { timeout: 5000 }).toBeGreaterThan(0);

    expect(requests.some((url) => url.includes('googletagmanager.com'))).toBe(true);
    expect(requests.some((url) => url.includes('facebook.net'))).toBe(true);

    // Reload: a escolha "granted" persistiu — os scripts recarregam sem o banner.
    requests.length = 0;
    await page.reload();
    await expect(page.getByRole('button', { name: 'Aceitar' })).toHaveCount(0);
    await expect.poll(() => requests.length, { timeout: 5000 }).toBeGreaterThan(0);
    expect(requests.some((url) => url.includes('googletagmanager.com'))).toBe(true);
  });

  test('nenhum evento do funil carrega parâmetro com formato de PII (varredura de payload)', async ({
    page,
  }) => {
    const gtagEventPayloads: unknown[] = [];

    await page.goto('/');
    await page.getByRole('button', { name: 'Aceitar' }).click();
    await page.waitForRequest((request) => ANALYTICS_HOST_PATTERN.test(request.url()), {
      timeout: 5000,
    });

    // Intercepta chamadas subsequentes a window.gtag registrando os params.
    await page.exposeFunction('__recordGtagCall', (args: unknown[]) => {
      gtagEventPayloads.push(args);
    });
    await page.evaluate(() => {
      const originalGtag = window.gtag;
      window.gtag = (...args: unknown[]) => {
        (window as unknown as { __recordGtagCall: (a: unknown[]) => void }).__recordGtagCall(args);
        originalGtag?.(...args);
      };
    });

    await page.getByRole('link', { name: 'Iniciar avaliação' }).click();
    await page.getByRole('radio').first().click();
    await page.getByRole('button', { name: 'Próxima' }).click();
    await expect(page.getByText('Pergunta 1 de 15')).toBeVisible({ timeout: 10_000 });

    const serialized = JSON.stringify(gtagEventPayloads);
    expect(serialized).not.toMatch(/@/); // nenhum e-mail
    expect(serialized.toLowerCase()).not.toContain('"name"');
    expect(serialized.toLowerCase()).not.toContain('"nome"');
  });
});
