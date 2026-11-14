import { expect, test, type Page } from '@playwright/test';

/**
 * Acessibilidade do go-live (Épico 47, DESIGN.md §8): funil inteiro só com
 * teclado, foco nunca escondido (SC 2.4.11), reduced-motion e zoom de 200%.
 */

/** Tab até o elemento focado satisfazer `alvo` (função autocontida: roda no navegador). */
async function tabAte(page: Page, alvo: (el: Element | null) => boolean, limite = 60) {
  for (let i = 0; i < limite; i += 1) {
    await page.keyboard.press('Tab');
    const focado = await page.evaluateHandle(() => document.activeElement);
    if (await focado.evaluate(alvo)) return;
  }
  throw new Error('Tab não alcançou o alvo');
}

// new Function: o texto entra no corpo, porque o Playwright serializa a função sem o closure.
const textoE = (texto: string) =>
  new Function(
    'el',
    `return !!el && (el.textContent || '').trim().startsWith(${JSON.stringify(texto)})`,
  ) as (el: Element | null) => boolean;

test('funil completo só com teclado: da landing ao botão de inscrição da /newsletter', async ({
  page,
}) => {
  await page.goto('/');
  // Banner de cookies resolvido por teclado.
  await tabAte(page, textoE('Recusar'));
  await page.keyboard.press('Enter');

  await page.keyboard.press('Home');
  await page.locator('body').focus();
  await tabAte(page, textoE('Iniciar avaliação'));
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/quiz$/);

  // 1 senioridade + 15 questões: Tab até o grupo, Espaço marca, Tab até "Próxima", Enter.
  for (let i = 0; i < 16; i += 1) {
    await expect(page.locator('[data-slot="card-title"]')).toBeFocused({ timeout: 10_000 });
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await tabAte(page, textoE('Próxima'), 6);
    await page.keyboard.press('Enter');
  }
  await expect(page).toHaveURL(/\/lead$/, { timeout: 10_000 });

  await tabAte(page, (el) => el?.id === 'lead-name');
  await page.keyboard.type('Teclado Apenas');
  await page.keyboard.press('Tab');
  await page.keyboard.type('teclado@example.com');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await tabAte(page, textoE('Ver meu resultado'), 4);
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/resultado$/, { timeout: 15_000 });

  await tabAte(page, textoE('Ver o próximo passo'), 80);
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/newsletter$/);

  await tabAte(
    page,
    (el) => !!el && (el.getAttribute('href') ?? '').includes('utm_content=newsletter-hero'),
  );
  const [aba] = await Promise.all([
    page.context().waitForEvent('page'),
    page.keyboard.press('Enter'),
  ]);
  expect(aba.url()).toContain('syntaxis.substack.com/subscribe');
  await aba.close();
});

test('foco nunca fica escondido pelo cabeçalho fixo nem pelo banner de cookies (SC 2.4.11)', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 667 });
  for (const rota of ['/', '/newsletter?n=junior&d=matematica-quant&c=baixo', '/privacidade']) {
    await page.goto(rota);
    const banner = page.getByRole('region', { name: /consentimento/i });
    await expect(banner).toBeVisible();
    for (let i = 0; i < 80; i += 1) {
      await page.keyboard.press('Tab');
      const r = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;
        const box = el.getBoundingClientRect();
        const dentroDoChrome = !!el.closest('header, [role="region"]');
        const topoBanner =
          document.querySelector('[role="region"] > div')?.getBoundingClientRect().top ??
          window.innerHeight;
        return {
          nome: `${el.tagName} ${el.textContent?.trim().slice(0, 30)}`,
          dentroDoChrome,
          escondido: box.bottom <= 56 || box.top >= topoBanner,
        };
      });
      if (!r || r.dentroDoChrome) continue;
      expect(r.escondido, `${rota}: foco escondido em ${r.nome}`).toBe(false);
    }
  }
});

test('prefers-reduced-motion: nenhuma animação rodando nas rotas', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const rota of ['/', '/quiz', '/newsletter', '/privacidade']) {
    await page.goto(rota);
    await page.waitForTimeout(300);
    const rodando = await page.evaluate(
      () => document.getAnimations().filter((a) => a.playState === 'running').length,
    );
    expect(rodando, rota).toBe(0);
  }
});

test('zoom de 200% em 1280px (viewport CSS de 640px): sem rolagem horizontal e botão principal alcançável', async ({
  page,
}) => {
  await page.setViewportSize({ width: 640, height: 400 });
  for (const [rota, botao] of [
    ['/', 'Iniciar avaliação'],
    ['/quiz', 'Próxima'],
    ['/newsletter', 'Assinar a newsletter'],
    ['/privacidade', null],
  ] as const) {
    await page.goto(rota);
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scrollWidth, rota).toBeLessThanOrEqual(clientWidth);
    if (botao) {
      const alvo = page.getByRole(rota === '/quiz' ? 'button' : 'link', { name: botao }).first();
      await alvo.scrollIntoViewIfNeeded();
      await expect(alvo).toBeInViewport();
    }
  }
});
