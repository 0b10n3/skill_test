import { expect, test } from '@playwright/test';

const TOTAL_QUESTIONS = 14;

async function assertNoVerticalScroll(page: import('@playwright/test').Page) {
  const { scrollHeight, clientHeight } = await page.evaluate(() => ({
    scrollHeight: document.documentElement.scrollHeight,
    clientHeight: document.documentElement.clientHeight,
  }));
  expect(scrollHeight, 'não deveria haver scroll vertical em nenhuma pergunta').toBeLessThanOrEqual(
    clientHeight,
  );
}

test.describe('/quiz — fluxo completo (mouse)', () => {
  test('responder as 14 perguntas em sequência leva a /lead, sem scroll e sem dados em storage', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/quiz');

    for (let questionNumber = 1; questionNumber <= TOTAL_QUESTIONS; questionNumber += 1) {
      await expect(
        page.getByText(`Pergunta ${questionNumber} de ${TOTAL_QUESTIONS}`),
      ).toBeVisible();
      await assertNoVerticalScroll(page);

      const options = page.getByRole('radio');
      await options.first().click();

      const nextButton = page.getByRole('button', { name: 'Próxima' });
      await expect(nextButton).toBeEnabled();
      await nextButton.click();

      if (questionNumber === 1) {
        // após responder a senioridade, o app busca o resto da sessão via Server Action
        await expect(page.getByText(`Pergunta 2 de ${TOTAL_QUESTIONS}`)).toBeVisible({
          timeout: 10_000,
        });
      }
    }

    await expect(page).toHaveURL(/\/lead$/);

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

  test('não é possível avançar sem selecionar uma alternativa', async ({ page }) => {
    await page.goto('/quiz');
    await expect(page.getByRole('button', { name: 'Próxima' })).toBeDisabled();
  });

  test('não há opção de voltar', async ({ page }) => {
    await page.goto('/quiz');
    await expect(page.getByRole('button', { name: /voltar/i })).toHaveCount(0);
  });
});

test.describe('/quiz — prefers-reduced-motion', () => {
  test('nenhuma animação de transição é aplicada entre perguntas quando reduced-motion está ativo', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/quiz');

    await page.getByRole('radio').first().click();
    await page.getByRole('button', { name: 'Próxima' }).click();
    await expect(page.getByText(`Pergunta 2 de ${TOTAL_QUESTIONS}`)).toBeVisible({
      timeout: 10_000,
    });

    const card = page.locator('[data-slot="card"]');
    const runningAnimations = await card.evaluate((el) => el.getAnimations().length);

    expect(runningAnimations, 'não deveria haver animação rodando com reduced-motion').toBe(0);
  });
});

test.describe('/quiz — acessibilidade de teclado', () => {
  test('o quiz inteiro é completável só com Tab + Enter/Space, sem mouse', async ({ page }) => {
    await page.goto('/quiz');

    for (let questionNumber = 1; questionNumber <= TOTAL_QUESTIONS; questionNumber += 1) {
      await expect(page.getByText(`Pergunta ${questionNumber} de ${TOTAL_QUESTIONS}`)).toBeVisible({
        timeout: 10_000,
      });

      // Tab a partir do heading (que recebe foco automaticamente) até o radiogroup,
      // seleciona com Espaço, depois Tab até "Próxima" ficar focado e confirma com Enter.
      await page.keyboard.press('Tab');
      await page.keyboard.press('Space');

      const nextButton = page.getByRole('button', { name: 'Próxima' });
      let isNextButtonFocused = await nextButton.evaluate((el) => el === document.activeElement);
      let guard = 0;
      while (!isNextButtonFocused && guard < 5) {
        await page.keyboard.press('Tab');
        isNextButtonFocused = await nextButton.evaluate((el) => el === document.activeElement);
        guard += 1;
      }

      expect(isNextButtonFocused, 'Tab deveria alcançar o botão Próxima').toBe(true);
      await expect(nextButton).toBeEnabled();
      await page.keyboard.press('Enter');
    }

    await expect(page).toHaveURL(/\/lead$/);
  });
});
