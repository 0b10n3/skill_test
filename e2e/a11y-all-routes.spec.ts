import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

/**
 * Cobertura de axe-core que faltava nas rotas públicas restantes — /quiz e
 * /resultado já têm suítes próprias (quiz-flow, design-system, resultado-a11y);
 * esta cobre "/" e "/lead" para fechar as 4 rotas públicas do Épico 9.
 *
 * Claro e escuro (Épico 19): os pares de contraste diferem entre temas
 * (design/tokens.json → color.theme.light|dark), então uma varredura em um
 * único tema não prova nada sobre o outro — repetida para os dois.
 */
async function reachLead(page: Page) {
  await page.goto('/quiz');
  for (let i = 0; i < 16; i += 1) {
    await page.waitForSelector('[data-slot="card-title"]', { timeout: 10_000 });
    await page.getByRole('radio').first().click();
    await page.getByRole('button', { name: 'Próxima' }).click();
  }
  await page.waitForURL('**/lead', { timeout: 10_000 });
}

for (const colorScheme of ['light', 'dark'] as const) {
  test(`/ — sem violações de acessibilidade (axe-core, wcag2aa) — ${colorScheme}`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/');
    const results = await new AxeBuilder({ page }).withTags(['wcag2aa']).analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toHaveLength(0);
  });

  test(`/quiz — sem violações de acessibilidade (axe-core, wcag2aa) — ${colorScheme}`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/quiz');
    await page.waitForSelector('[data-slot="card-title"]');
    // Aguarda a animação de entrada (motion-safe:animate-in, 300ms) assentar —
    // medir contraste em meio a um fade-in captura uma cor efetiva transitória,
    // não a real (o axe-core lê a cor renderizada, não o valor final da CSS var).
    await page.waitForTimeout(400);
    const results = await new AxeBuilder({ page }).withTags(['wcag2aa']).analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toHaveLength(0);
  });

  test(`/lead — sem violações de acessibilidade (axe-core, wcag2aa) — ${colorScheme}`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme });
    await reachLead(page);
    await page.waitForTimeout(400);

    const results = await new AxeBuilder({ page }).withTags(['wcag2aa']).analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toHaveLength(0);
  });
}

test.describe('navegação manual por teclado (além do /quiz, já coberto no Épico 5)', () => {
  test('/ — CTA alcançável e ativável só com Tab + Enter', async ({ page }) => {
    await page.goto('/');
    // Épico 29: SiteHeader (logo, link para "/") e ThemeToggle agora vêm
    // antes do conteúdo da página no DOM, nessa ordem — três Tabs, não
    // um, chegam ao CTA. Mudança correta de ordem de navegação, não
    // regressão: os dois elementos precisam ser alcançáveis por teclado
    // tanto quanto o CTA (confirmado manualmente, tab order estável:
    // header → toggle → CTA).
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
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
