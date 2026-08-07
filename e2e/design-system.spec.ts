import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('/dev/design-system — contraste (axe-core)', () => {
  test('não tem violações de contraste (color-contrast)', async ({ page }) => {
    await page.goto('/dev/design-system');

    const results = await new AxeBuilder({ page }).include('main').withTags(['wcag2aa']).analyze();

    const contrastViolations = results.violations.filter((v) => v.id === 'color-contrast');

    expect(contrastViolations, JSON.stringify(contrastViolations, null, 2)).toHaveLength(0);
  });

  test('não tem nenhuma violação de acessibilidade WCAG2AA', async ({ page }) => {
    await page.goto('/dev/design-system');

    const results = await new AxeBuilder({ page }).include('main').withTags(['wcag2aa']).analyze();

    expect(results.violations, JSON.stringify(results.violations, null, 2)).toHaveLength(0);
  });
});

test.describe('/dev/design-system — carregamento de fontes', () => {
  test('Space Grotesk, Inter e JetBrains Mono carregam de fato (sem fallback de sistema)', async ({
    page,
  }) => {
    await page.goto('/dev/design-system');
    await page.evaluate(() => document.fonts.ready);

    const loadedFamilies = await page.evaluate(() =>
      [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family),
    );

    expect(loadedFamilies.some((f) => f.includes('Space Grotesk'))).toBe(true);
    expect(loadedFamilies.some((f) => f.includes('Inter'))).toBe(true);
    expect(loadedFamilies.some((f) => f.includes('JetBrains Mono'))).toBe(true);
  });

  test('elementos usam as fontes de marca no computed style, não um fallback genérico', async ({
    page,
  }) => {
    await page.goto('/dev/design-system');
    await page.evaluate(() => document.fonts.ready);

    const heading = page.getByRole('heading', { level: 1 });
    const headingFont = await heading.evaluate((el) => getComputedStyle(el).fontFamily);
    expect(headingFont).toContain('Space Grotesk');

    const mono = page.getByText('JetBrains Mono — dados numéricos');
    const monoFont = await mono.evaluate((el) => getComputedStyle(el).fontFamily);
    expect(monoFont).toContain('JetBrains Mono');
  });
});

test.describe('/dev/design-system — snapshot visual', () => {
  test('componentes-base batem com o snapshot de referência', async ({ page }) => {
    await page.goto('/dev/design-system');
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await expect(page).toHaveScreenshot('design-system-full-page.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });
});
