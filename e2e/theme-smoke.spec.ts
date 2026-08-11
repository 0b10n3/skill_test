import { expect, test } from '@playwright/test';

/**
 * Fumaça do fluxo completo nos dois temas (Épico 14): nada quebra
 * funcionalmente com a nova fundação de tokens, e a alternância de tema de
 * fato muda --primary (Forest no light, Grove no dark) sem flash incorreto
 * no primeiro paint.
 */
for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`tema ${colorScheme}`, () => {
    test.use({ colorScheme });

    test(`/ carrega com --primary correto para o tema (${colorScheme})`, async ({ page }) => {
      await page.goto('/');
      await expect(
        page.getByRole('heading', { name: /descubra seu nível técnico/i }),
      ).toBeVisible();

      const primary = await page.evaluate(() =>
        getComputedStyle(document.documentElement)
          .getPropertyValue('--primary')
          .trim()
          .toLowerCase(),
      );
      const expected = colorScheme === 'dark' ? '#1e7a4f' : '#1b6a45';
      expect(primary).toBe(expected);
    });

    test(`fluxo completo (Landing → Quiz → Lead → Resultado) funciona no tema ${colorScheme}`, async ({
      page,
    }) => {
      await page.goto('/');
      await page.getByRole('link', { name: 'Iniciar avaliação' }).click();
      await expect(page).toHaveURL(/\/quiz$/);

      await page.waitForSelector('[data-slot="card-title"]');
      await page.getByRole('radio').first().click();
      await page.getByRole('button', { name: 'Próxima' }).click();

      for (let i = 0; i < 15; i += 1) {
        await page.waitForSelector('[data-slot="card-title"]', { timeout: 10_000 });
        await page.getByRole('radio').first().click();
        await page.getByRole('button', { name: 'Próxima' }).click();
      }
      await page.waitForURL('**/lead', { timeout: 10_000 });

      await page.locator('#lead-name').fill('Teste Tema');
      await page.locator('#lead-email').fill(`e2e-tema-${colorScheme}-${Date.now()}@example.com`);
      await page.getByRole('checkbox').click();
      await Promise.all([
        page.waitForResponse((response) => response.url().includes('/api/submit')),
        page.getByRole('button', { name: 'Ver meu resultado' }).click(),
      ]);
      await page.waitForURL('**/resultado', { timeout: 10_000 });

      await expect(page.getByTestId('score-classificacao')).toBeVisible();
    });
  });
}
