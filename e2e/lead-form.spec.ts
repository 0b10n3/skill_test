import { expect, test } from '@playwright/test';

async function completeQuiz(page: import('@playwright/test').Page) {
  await page.goto('/quiz');
  for (let question = 1; question <= 16; question += 1) {
    await page.waitForSelector('[data-slot="card-title"]', { timeout: 10_000 });
    await page.getByRole('radio').first().click();
    await page.getByRole('button', { name: 'Próxima' }).click();
  }
  await page.waitForURL('**/lead', { timeout: 10_000 });
}

test.describe('/lead', () => {
  test('mostra a senioridade pré-preenchida vinda do quiz', async ({ page }) => {
    await completeQuiz(page);
    await expect(page.getByText('Seu momento no mercado')).toBeVisible();
  });

  test('bloqueia o envio sem opt-in marcado (revalidado no servidor)', async ({ page }) => {
    await completeQuiz(page);

    await page.locator('#lead-name').fill('Fulano de Tal');
    await page.locator('#lead-email').fill('fulano@example.com');
    await page.getByRole('button', { name: 'Ver meu resultado' }).click();

    await expect(page).toHaveURL(/\/lead$/);
    await expect(page.getByText(/aceitar receber/i)).toBeVisible();
  });

  test('e-mail inválido bloqueia o envio com mensagem de erro', async ({ page }) => {
    await completeQuiz(page);

    await page.locator('#lead-name').fill('Fulano de Tal');
    await page.locator('#lead-email').fill('nao-e-email');
    await page.getByRole('checkbox').click();
    await page.getByRole('button', { name: 'Ver meu resultado' }).click();

    await expect(page).toHaveURL(/\/lead$/);
    await expect(page.getByText(/e-mail inválido/i)).toBeVisible();
  });

  test('formulário válido com opt-in navega para /resultado sem deixar dados em storage', async ({
    page,
  }) => {
    await completeQuiz(page);

    await page.locator('#lead-name').fill('Fulano de Tal');
    await page.locator('#lead-email').fill('fulano@example.com');
    await page.getByRole('checkbox').click();

    const [response] = await Promise.all([
      page.waitForResponse((res) => res.url().includes('/api/submit')),
      page.getByRole('button', { name: 'Ver meu resultado' }).click(),
    ]);

    expect(response.status()).toBe(200);
    await expect(page).toHaveURL(/\/resultado$/);

    // Em deployments de preview da Vercel, a própria toolbar da plataforma
    // grava algumas chaves em sessionStorage (vc-*, __vtkb-*) — não são
    // respostas do quiz, são infraestrutura da Vercel que só existe em
    // preview. Filtradas para testar o que o app de fato grava.
    const isPlatformKey = (key: string) => key.startsWith('vc-') || key.startsWith('__vtkb');
    const storage = await page.evaluate(() => ({
      localStorage: Object.keys(window.localStorage),
      sessionStorage: Object.keys(window.sessionStorage),
    }));
    expect(storage.localStorage.filter((k) => !isPlatformKey(k))).toHaveLength(0);
    expect(storage.sessionStorage.filter((k) => !isPlatformKey(k))).toHaveLength(0);
  });

  test('acesso direto a /lead sem ter feito o quiz redireciona para /', async ({ page }) => {
    await page.goto('/lead');
    await expect(page).toHaveURL(/\/$/, { timeout: 10_000 });
  });
});
