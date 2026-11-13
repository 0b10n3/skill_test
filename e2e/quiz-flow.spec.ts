import { expect, test } from '@playwright/test';
import questionsBank from '../content/questions.json';

const TOTAL_QUESTIONS = 15;

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
  test('responder a senioridade + 15 perguntas em sequência leva a /lead, sem scroll e sem dados em storage', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/quiz');

    // q00 (senioridade) é uma etapa prévia, sem contador "N de 15".
    await assertNoVerticalScroll(page);
    await page.getByRole('radio').first().click();
    const seniorityNextButton = page.getByRole('button', { name: 'Próxima' });
    await expect(seniorityNextButton).toBeEnabled();
    await seniorityNextButton.click();

    // após responder a senioridade, o app busca o resto da sessão via Server Action
    await expect(page.getByText(`Pergunta 1 de ${TOTAL_QUESTIONS}`)).toBeVisible({
      timeout: 10_000,
    });

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

// Épico 45 (F3/F10): a pergunta mais longa do banco (enunciado + alternativas) é o pior caso.
const maisLonga = questionsBank
  .filter((q) => q.type === 'knowledge')
  .sort(
    (a, b) =>
      b.question.length +
      b.options.reduce((n, o) => n + o.text.length, 0) -
      (a.question.length + a.options.reduce((n, o) => n + o.text.length, 0)),
  )[0];

test.describe('/quiz — chassi (Épico 45)', () => {
  for (const viewport of [
    { width: 360, height: 640 },
    { width: 375, height: 667 },
    { width: 390, height: 844 },
  ]) {
    test(`pergunta mais longa em ${viewport.width}×${viewport.height}: página não rola e "Próxima" fica visível`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto('/quiz');
      await page.getByRole('radio').first().click();
      await page.getByRole('button', { name: 'Próxima' }).click();
      await expect(page.getByText(`Pergunta 1 de ${TOTAL_QUESTIONS}`)).toBeVisible({
        timeout: 10_000,
      });

      // Troca o texto da pergunta sorteada pelo da mais longa: o layout é o mesmo para todas.
      await page.evaluate(
        ({ question, options }) => {
          document.querySelector('[data-slot="card-title"]')!.textContent = question;
          document.querySelectorAll('[data-slot="radio-group"] label').forEach((label, i) => {
            label.lastChild!.textContent = options[i];
          });
        },
        { question: maisLonga.question, options: maisLonga.options.map((o) => o.text) },
      );

      await assertNoVerticalScroll(page);
      await expect(page.getByRole('button', { name: 'Próxima' })).toBeInViewport({ ratio: 1 });
      // Só a faixa do meio rola: a última alternativa é alcançável rolando ela.
      const ultima = page.locator('[data-slot="radio-group"] label').last();
      await ultima.scrollIntoViewIfNeeded();
      await expect(ultima).toBeInViewport();
      await assertNoVerticalScroll(page);
    });
  }

  test('o logo não é link dentro do funil', async ({ page }) => {
    await page.goto('/quiz');
    await expect(page.getByRole('banner').getByRole('img', { name: 'Syntaxis' })).toBeVisible();
    await expect(page.getByRole('banner').getByRole('link')).toHaveCount(0);
  });

  test('recarregar no meio do quiz pede confirmação', async ({ page }) => {
    await page.goto('/quiz');
    await page.getByRole('radio').first().click();
    await page.getByRole('button', { name: 'Próxima' }).click();
    await expect(page.getByText(`Pergunta 1 de ${TOTAL_QUESTIONS}`)).toBeVisible({
      timeout: 10_000,
    });

    const dialogo = page.waitForEvent('dialog');
    void page.reload().catch(() => {});
    const d = await dialogo;
    expect(d.type()).toBe('beforeunload');
    await d.dismiss();
  });

  test('a senioridade aparece na ordem de carreira', async ({ page }) => {
    await page.goto('/quiz');
    await expect(page.getByText('Antes de começar')).toBeVisible();
    await expect(page.locator('[data-slot="radio-group"] label')).toHaveText([
      /Aspirante/,
      'Estagiário',
      'Analista Júnior',
      'Analista Pleno',
      'Analista Sênior',
    ]);
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
    await expect(page.getByText(`Pergunta 1 de ${TOTAL_QUESTIONS}`)).toBeVisible({
      timeout: 10_000,
    });

    const card = page.getByTestId('quiz-question');
    const runningAnimations = await card.evaluate((el) => el.getAnimations().length);

    expect(runningAnimations, 'não deveria haver animação rodando com reduced-motion').toBe(0);
  });
});

test.describe('/quiz — acessibilidade de teclado', () => {
  test('o quiz inteiro é completável só com Tab + Enter/Space, sem mouse', async ({ page }) => {
    await page.goto('/quiz');

    async function answerCurrentQuestionByKeyboard() {
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

    // q00 (senioridade) é uma etapa prévia, sem contador "N de 15".
    await answerCurrentQuestionByKeyboard();
    await expect(page.getByText(`Pergunta 1 de ${TOTAL_QUESTIONS}`)).toBeVisible({
      timeout: 10_000,
    });

    for (let questionNumber = 1; questionNumber <= TOTAL_QUESTIONS; questionNumber += 1) {
      await expect(page.getByText(`Pergunta ${questionNumber} de ${TOTAL_QUESTIONS}`)).toBeVisible({
        timeout: 10_000,
      });
      await answerCurrentQuestionByKeyboard();
    }

    await expect(page).toHaveURL(/\/lead$/);
  });
});
