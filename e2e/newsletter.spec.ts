import { expect, test, type Page } from '@playwright/test';
import { CURADORIA, DO_DIAGNOSTICO_AO_HABITO, HERO, POSTS } from '../content/newsletter';

/** Página final /newsletter (Épico 44). */

const UTM = 'utm_source=skill-check&utm_medium=app&utm_campaign=diagnostico';

async function recusarCookies(page: Page) {
  const recusar = page.getByRole('button', { name: 'Recusar' });
  if (await recusar.isVisible()) await recusar.click();
}

test('acesso direto mostra a versão genérica e o link para o Skill Check', async ({ page }) => {
  await page.goto('/newsletter');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(HERO.generico.titulo);
  await expect(page.getByText(/Seu diagnóstico ·/)).toHaveCount(0);
  await expect(page.getByRole('link', { name: HERO.linkSkillCheck })).toHaveAttribute('href', '/');
  await expect(page.getByText(DO_DIAGNOSTICO_AO_HABITO.generico.titulo)).toBeVisible();
});

test('query n/d/c mostra a variante #GENZ-FEAR e a curadoria de Quant', async ({ page }) => {
  await page.goto('/newsletter?n=junior&d=matematica-quant&c=baixo');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(HERO.comDiagnostico.titulo);
  await expect(
    page.getByText('Seu diagnóstico · Analista Júnior · prioridade: Matemática & Quant'),
  ).toBeVisible();
  await expect(page.getByText(DO_DIAGNOSTICO_AO_HABITO['genz-fear'].titulo)).toBeVisible();
  const lista = page.getByRole('complementary', { name: HERO.tituloPosts });
  for (const id of CURADORIA['matematica-quant']) {
    await expect(lista.getByRole('link', { name: new RegExp(POSTS[id].titulo) })).toBeVisible();
  }
});

test('o canonical não leva a query', async ({ page }) => {
  await page.goto('/newsletter?n=junior&d=matematica-quant&c=baixo');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/newsletter$/);
});

test('cada botão de inscrição vai para /subscribe com os UTMs e a sua posição', async ({
  page,
}) => {
  await page.goto('/newsletter');
  await recusarCookies(page);
  for (const posicao of [
    'newsletter-header',
    'newsletter-hero',
    'newsletter-meio',
    'newsletter-final',
  ]) {
    const link = page.locator(`a[href$="utm_content=${posicao}"]`);
    await expect(link).toHaveCount(1);
    const href = await link.getAttribute('href');
    expect(href).toBe(`https://syntaxis.substack.com/subscribe?${UTM}&utm_content=${posicao}`);
    await expect(link).toHaveAttribute('target', '_blank');
  }
});

test('vindo do resultado, a página mostra o diagnóstico e o clique dispara cta_offer_click', async ({
  page,
}) => {
  await page.goto('/quiz');
  for (let i = 0; i < 16; i += 1) {
    await page.waitForSelector('[data-slot="card-title"]', { timeout: 10_000 });
    await page.getByRole('radio').first().click();
    await page.getByRole('button', { name: 'Próxima' }).click();
  }
  await page.waitForURL('**/lead');
  await page.locator('#lead-name').fill('Teste Newsletter');
  await page.locator('#lead-email').fill(`e2e-newsletter-${Date.now()}@example.com`);
  await page.getByRole('checkbox').click();
  await page.getByRole('button', { name: 'Ver meu resultado' }).click();
  await page.waitForURL('**/resultado', { timeout: 20_000 });

  await page.getByRole('link', { name: 'Ver o próximo passo' }).first().click();
  await page.waitForURL('**/newsletter');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(HERO.comDiagnostico.titulo);
  await expect(page.getByText(/Seu diagnóstico · .+ · prioridade: /)).toBeVisible();

  // Registra as chamadas a track() via gtag falso, sem rede.
  await page.evaluate(() => {
    const w = window as unknown as { eventos: unknown[][]; gtag: (...a: unknown[]) => void };
    w.eventos = [];
    w.gtag = (...args) => w.eventos.push(args);
  });
  await page
    .context()
    .route('https://syntaxis.substack.com/**', (route) => route.fulfill({ status: 200, body: '' }));
  await page.locator('a[href$="utm_content=newsletter-hero"]').click();
  const eventos = await page.evaluate(
    () => (window as unknown as { eventos: unknown[][] }).eventos,
  );
  expect(eventos).toContainEqual([
    'event',
    'cta_offer_click',
    expect.objectContaining({ posicao: 'newsletter-hero', origem: 'resultado' }),
  ]);
});
