import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('/dev/ui — acessibilidade (axe-core)', () => {
  test('zero violações críticas/sérias, nos dois temas', async ({ page }) => {
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme });
      await page.goto('/dev/ui');

      const results = await new AxeBuilder({ page })
        .include('main')
        .withTags(['wcag2aa'])
        .analyze();
      const criticalViolations = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious',
      );

      expect(
        criticalViolations,
        `tema ${colorScheme}: ${JSON.stringify(criticalViolations, null, 2)}`,
      ).toHaveLength(0);
    }
  });

  test('o dialog aberto também não tem violações', async ({ page }) => {
    await page.goto('/dev/ui');
    await page.getByRole('button', { name: 'Abrir dialog' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    const results = await new AxeBuilder({ page }).withTags(['wcag2aa']).analyze();
    const criticalViolations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    );

    expect(criticalViolations, JSON.stringify(criticalViolations, null, 2)).toHaveLength(0);
  });
});

test.describe('/dev/ui — badge de conquista', () => {
  test('Lime (achievement) só aparece na classificação Alto', async ({ page }) => {
    await page.goto('/dev/ui');

    const alto = page.getByText('Alto', { exact: true });
    const baixo = page.getByText('Baixo', { exact: true });
    const medio = page.getByText('Médio', { exact: true });

    const altoColor = await alto.evaluate((el) => getComputedStyle(el).color);
    const baixoColor = await baixo.evaluate((el) => getComputedStyle(el).color);
    const medioColor = await medio.evaluate((el) => getComputedStyle(el).color);

    expect(altoColor).not.toBe(baixoColor);
    expect(altoColor).not.toBe(medioColor);
  });
});

test.describe('/dev/ui — snapshot visual', () => {
  for (const colorScheme of ['light', 'dark'] as const) {
    for (const viewport of [
      { name: '375', width: 375, height: 1200 },
      { name: '1440', width: 1440, height: 1200 },
    ]) {
      test(`catálogo completo — ${colorScheme} @ ${viewport.name}px`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
        await page.goto('/dev/ui');
        await page.evaluate(() => document.fonts.ready);

        await expect(page).toHaveScreenshot(`dev-ui-${colorScheme}-${viewport.name}.png`, {
          fullPage: true,
          maxDiffPixelRatio: 0.02,
        });
      });
    }
  }
});
