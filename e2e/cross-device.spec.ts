import { expect, test, type Page } from '@playwright/test';

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
] as const;

async function assertNoHorizontalOverflow(page: Page) {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(
    scrollWidth,
    'não deveria haver scroll horizontal em nenhum breakpoint',
  ).toBeLessThanOrEqual(clientWidth);
}

for (const viewport of VIEWPORTS) {
  test.describe(`cross-device — ${viewport.name} (${viewport.width}px)`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test('/ não tem overflow horizontal', async ({ page }) => {
      await page.goto('/');
      await assertNoHorizontalOverflow(page);
    });

    test('/quiz não tem overflow horizontal', async ({ page }) => {
      await page.goto('/quiz');
      await page.waitForSelector('[data-slot="card-title"]');
      await assertNoHorizontalOverflow(page);
    });

    test('/lead não tem overflow horizontal', async ({ page }) => {
      await page.goto('/quiz');
      for (let i = 0; i < 16; i += 1) {
        await page.waitForSelector('[data-slot="card-title"]', { timeout: 10_000 });
        await page.getByRole('radio').first().click();
        await page.getByRole('button', { name: 'Próxima' }).click();
      }
      await page.waitForURL('**/lead', { timeout: 10_000 });
      await assertNoHorizontalOverflow(page);
    });

    test('/resultado não tem overflow horizontal', async ({ page }) => {
      await page.goto('/quiz');
      for (let i = 0; i < 16; i += 1) {
        await page.waitForSelector('[data-slot="card-title"]', { timeout: 10_000 });
        await page.getByRole('radio').first().click();
        await page.getByRole('button', { name: 'Próxima' }).click();
      }
      await page.waitForURL('**/lead', { timeout: 10_000 });
      await page.locator('#lead-name').fill('Teste Cross-Device');
      await page.locator('#lead-email').fill(`cross-device-${Date.now()}@example.com`);
      await page.getByRole('checkbox').click();
      await Promise.all([
        page.waitForResponse((response) => response.url().includes('/api/submit')),
        page.getByRole('button', { name: 'Ver meu resultado' }).click(),
      ]);
      await page.waitForURL('**/resultado', { timeout: 10_000 });
      await assertNoHorizontalOverflow(page);
    });
  });
}
