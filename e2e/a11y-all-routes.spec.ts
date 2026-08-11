import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * Cobertura de axe-core que faltava nas rotas públicas restantes — /quiz e
 * /resultado já têm suítes próprias (quiz-flow, design-system, resultado-a11y);
 * esta cobre "/" e "/lead" para fechar as 4 rotas públicas do Épico 9.
 */

test('/ — sem violações de acessibilidade (axe-core, wcag2aa)', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).withTags(['wcag2aa']).analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toHaveLength(0);
});

test('/quiz — sem violações de acessibilidade (axe-core, wcag2aa)', async ({ page }) => {
  await page.goto('/quiz');
  await page.waitForSelector('[data-slot="card-title"]');
  // Aguarda a animação de entrada (motion-safe:animate-in, 300ms) assentar —
  // medir contraste em meio a um fade-in captura uma cor efetiva transitória,
  // não a real (o axe-core lê a cor renderizada, não o valor final da CSS var).
  await page.waitForTimeout(400);
  const results = await new AxeBuilder({ page }).withTags(['wcag2aa']).analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toHaveLength(0);
});

test('/lead — sem violações de acessibilidade (axe-core, wcag2aa)', async ({ page }) => {
  await page.goto('/quiz');
  for (let i = 0; i < 16; i += 1) {
    await page.waitForSelector('[data-slot="card-title"]', { timeout: 10_000 });
    await page.getByRole('radio').first().click();
    await page.getByRole('button', { name: 'Próxima' }).click();
  }
  await page.waitForURL('**/lead', { timeout: 10_000 });
  await page.waitForTimeout(400);

  const results = await new AxeBuilder({ page }).withTags(['wcag2aa']).analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toHaveLength(0);
});

test.describe('navegação manual por teclado (além do /quiz, já coberto no Épico 5)', () => {
  test('/ — CTA alcançável e ativável só com Tab + Enter', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const isCtaFocused = await page.evaluate(
      () => document.activeElement?.textContent?.trim() === 'Iniciar avaliação',
    );
    expect(isCtaFocused).toBe(true);
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/quiz$/);
  });

  test('/lead — formulário inteiro preenchível e enviável só com teclado', async ({ page }) => {
    await page.goto('/quiz');
    for (let i = 0; i < 16; i += 1) {
      await page.waitForSelector('[data-slot="card-title"]', { timeout: 10_000 });
      await page.getByRole('radio').first().click();
      await page.getByRole('button', { name: 'Próxima' }).click();
    }
    await page.waitForURL('**/lead', { timeout: 10_000 });

    await page.locator('#lead-name').focus();
    await page.keyboard.type('Teste Teclado');
    await page.keyboard.press('Tab');
    await page.keyboard.type(`teclado-${Date.now()}@example.com`);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space'); // marca o opt-in
    await page.keyboard.press('Tab');

    const isSubmitFocused = await page.evaluate(
      () => document.activeElement?.getAttribute('type') === 'submit',
    );
    expect(isSubmitFocused).toBe(true);

    await Promise.all([
      page.waitForResponse((response) => response.url().includes('/api/submit')),
      page.keyboard.press('Enter'),
    ]);
    await expect(page).toHaveURL(/\/resultado$/);
  });
});
