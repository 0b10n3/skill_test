import { expect, test } from '@playwright/test';

test.describe('/ — landing page', () => {
  // Épico 17: a landing ganhou seções de conteúdo (dimensões, método) que
  // tornam a PÁGINA inteira naturalmente maior que um viewport — normal
  // para uma landing com conteúdo, e diferente da regra de "single-
  // viewport por seção" (regra de layout do app desde o Épico 4), que aqui vale
  // para a tela de entrada (hero: título + promessa + CTA, a etapa que o
  // visitante precisa completar sem rolar), não para o scroll de conteúdo
  // abaixo dela.
  // Épico 46 (L1): título, promessa, botão e "Gratuito" na primeira tela de 375×667, acima do
  // banner de cookies quando ele está aberto.
  for (const comBanner of [true, false]) {
    test(`primeira tela em 375×667 ${comBanner ? 'com' : 'sem'} o banner de cookies`, async ({
      page,
    }) => {
      if (!comBanner) {
        await page.addInitScript(() => localStorage.setItem('syntaxis-consent', 'denied'));
      }
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      const banner = page.getByRole('region', { name: /consentimento/i });
      await expect(banner).toHaveCount(comBanner ? 1 : 0);
      const limite = comBanner ? (await banner.locator('> div').boundingBox())!.y : 667;

      const hero = page.locator('main > section').first();
      for (const alvo of [
        hero.getByRole('heading', { level: 1 }),
        hero.getByText(/Skills e ferramentas de trabalho real/),
        hero.getByRole('link', { name: 'Iniciar avaliação' }),
        hero.getByText(/Gratuito/),
      ]) {
        const box = (await alvo.boundingBox())!;
        expect(box.y).toBeGreaterThanOrEqual(0);
        expect(box.y + box.height).toBeLessThanOrEqual(limite);
      }
    });
  }

  test('as seções novas existem e as âncoras do menu levam a elas (Épico 46)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    await expect(page.locator('#como-funciona')).toBeVisible();
    await expect(page.locator('#perguntas')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Silvano Junior' })).toBeVisible();

    const menu = page.getByRole('navigation', { name: 'Principal' });
    for (const [rotulo, id] of [
      ['Como funciona', 'como-funciona'],
      ['O que avaliamos', 'o-que-avaliamos'],
      ['Metodologia', 'metodologia'],
    ]) {
      await menu.getByRole('link', { name: rotulo }).click();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect(page.locator(`#${id}`)).toBeInViewport();
    }
  });

  test('CTA "Iniciar avaliação" navega para /quiz', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Iniciar avaliação' }).first().click();

    await expect(page).toHaveURL(/\/quiz$/);
  });
});
