import { expect, test } from '@playwright/test';

/**
 * Teste visual de referência do funil redesenhado (Épico 17): screenshots
 * de Landing/Quiz/Lead × claro/escuro × 375/768/1440px — baseline sucessor
 * do catálogo do Épico 15 (e2e/dev-ui-catalog.spec.ts), agora cobrindo as
 * páginas reais do produto, não só a biblioteca de componentes. 768px
 * (tablet) adicionado no Épico 19 — e2e/cross-device.spec.ts já cobre esse
 * breakpoint para overflow horizontal, mas não para regressão visual
 * pixel a pixel.
 */
async function reachLeadPage(page: import('@playwright/test').Page) {
  await page.goto('/quiz');
  for (let i = 0; i < 16; i += 1) {
    await page.waitForSelector('[data-slot="card-title"]', { timeout: 10_000 });
    await page.getByRole('radio').first().click();
    await page.getByRole('button', { name: 'Próxima' }).click();
  }
  await page.waitForURL('**/lead', { timeout: 10_000 });
}

const VIEWPORTS = [
  { name: '375', width: 375, height: 1400 },
  { name: '768', width: 768, height: 1400 },
  { name: '1440', width: 1440, height: 1200 },
];

for (const colorScheme of ['light', 'dark'] as const) {
  for (const viewport of VIEWPORTS) {
    test(`landing — ${colorScheme} @ ${viewport.name}px`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);

      await expect(page).toHaveScreenshot(`landing-${colorScheme}-${viewport.name}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.02,
      });
    });

    test(`quiz — ${colorScheme} @ ${viewport.name}px`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
      await page.goto('/quiz');
      await page.waitForSelector('[data-slot="card-title"]');
      await page.evaluate(() => document.fonts.ready);

      await expect(page).toHaveScreenshot(`quiz-${colorScheme}-${viewport.name}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.02,
      });
    });

    test(`lead — ${colorScheme} @ ${viewport.name}px`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
      await reachLeadPage(page);
      await page.evaluate(() => document.fonts.ready);

      await expect(page).toHaveScreenshot(`lead-${colorScheme}-${viewport.name}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.02,
      });
    });
  }
}
