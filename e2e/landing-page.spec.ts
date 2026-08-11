import { expect, test } from '@playwright/test';

test.describe('/ — landing page', () => {
  // Épico 17: a landing ganhou seções de conteúdo (dimensões, método) que
  // tornam a PÁGINA inteira naturalmente maior que um viewport — normal
  // para uma landing com conteúdo, e diferente da regra de "single-
  // viewport por seção" (REDESIGN.md §2 invariante #8), que aqui vale
  // para a tela de entrada (hero: título + promessa + CTA, a etapa que o
  // visitante precisa completar sem rolar), não para o scroll de conteúdo
  // abaixo dela.
  test('o hero (título, promessa e CTA) cabe em um viewport mobile 375×667, sem exigir scroll', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const heroHeight = await page
      .locator('main > section')
      .first()
      .evaluate((el) => el.getBoundingClientRect().height);

    expect(heroHeight).toBeLessThanOrEqual(667);
  });

  test('CTA "Iniciar avaliação" navega para /quiz', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Iniciar avaliação' }).click();

    await expect(page).toHaveURL(/\/quiz$/);
  });
});
