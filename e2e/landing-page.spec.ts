import { expect, test } from '@playwright/test';

test.describe('/ — landing page', () => {
  test('não exige scroll vertical em viewport mobile 375×667', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const { scrollHeight, clientHeight } = await page.evaluate(() => ({
      scrollHeight: document.documentElement.scrollHeight,
      clientHeight: document.documentElement.clientHeight,
    }));

    expect(scrollHeight).toBeLessThanOrEqual(clientHeight);
  });

  test('CTA "Iniciar avaliação" navega para /quiz', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Iniciar avaliação' }).click();

    await expect(page).toHaveURL(/\/quiz$/);
  });
});
