import { expect, test, type Page } from '@playwright/test';
import questionsBank from '../content/questions.json';

interface BankOption {
  id: string;
  text: string;
}
interface BankQuestion {
  id: string;
  type: 'seniority' | 'knowledge' | 'self_assessment';
  question: string;
  options: BankOption[];
  correctOptionId?: string;
  category: string;
}

const bank = questionsBank as BankQuestion[];

const SENIORITY_OPTION_TEXT: Record<string, string> = Object.fromEntries(
  bank.find((q) => q.type === 'seniority')!.options.map((option) => [option.id, option.text]),
);

async function clickOptionWithText(page: Page, text: string) {
  await page.locator('label').filter({ hasText: text }).getByRole('radio').click();
}

/**
 * Responde o quiz inteiro pela UI real (sem nunca ler correctOptionId do
 * client — o teste só sabe o gabarito porque lê o mesmo content/questions.json
 * que o servidor usa, fora de banda). `correctCount` determina quantas das
 * 12 perguntas de conhecimento respondemos certo, para produzir um score
 * previsível e conferir contra o que a página de resultado exibe.
 */
async function answerQuizDeterministically(
  page: Page,
  seniority: string,
  correctCount: number,
): Promise<void> {
  await page.goto('/quiz');

  await page.waitForSelector('[data-slot="card-title"]', { timeout: 10_000 });
  await clickOptionWithText(page, SENIORITY_OPTION_TEXT[seniority]);
  await page.getByRole('button', { name: 'Próxima' }).click();

  let remainingCorrect = correctCount;

  for (let i = 0; i < 13; i += 1) {
    await page.waitForSelector('[data-slot="card-title"]', { timeout: 10_000 });
    const questionText = (await page.locator('[data-slot="card-title"]').textContent())?.trim();
    const question = bank.find((q) => q.question.trim() === questionText);
    if (!question) throw new Error(`Pergunta não encontrada no banco: ${questionText}`);

    if (question.type === 'self_assessment') {
      await clickOptionWithText(page, question.options[0].text);
    } else {
      const shouldBeCorrect = remainingCorrect > 0;
      if (shouldBeCorrect) remainingCorrect -= 1;
      const option = shouldBeCorrect
        ? question.options.find((o) => o.id === question.correctOptionId)!
        : question.options.find((o) => o.id !== question.correctOptionId)!;
      await clickOptionWithText(page, option.text);
    }

    await page.getByRole('button', { name: 'Próxima' }).click();
  }

  await page.waitForURL('**/lead', { timeout: 10_000 });
}

async function submitLead(page: Page, email: string) {
  await page.locator('#lead-name').fill('Teste E2E Resultado');
  await page.locator('#lead-email').fill(email);
  await page.getByRole('checkbox').click();
  await Promise.all([
    page.waitForResponse((response) => response.url().includes('/api/submit')),
    page.getByRole('button', { name: 'Ver meu resultado' }).click(),
  ]);
  await page.waitForURL('**/resultado', { timeout: 10_000 });
}

test.describe('Fluxo completo — Landing → Quiz → Lead → Resultado', () => {
  test('8 acertos em 12 exibe 66.67% e classificação Médio', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Iniciar avaliação' }).click();
    await expect(page).toHaveURL(/\/quiz$/);

    await answerQuizDeterministically(page, 'pleno', 8);
    await submitLead(page, `e2e-medio-${Date.now()}@example.com`);

    await expect(page.getByTestId('score-geral')).toHaveText('66.67%');
    await expect(page.getByTestId('score-classificacao')).toHaveText('Médio');
  });

  test('0 acertos em 12 exibe 0% e classificação Baixo', async ({ page }) => {
    await answerQuizDeterministically(page, 'aspirante', 0);
    await submitLead(page, `e2e-baixo-${Date.now()}@example.com`);

    await expect(page.getByTestId('score-geral')).toHaveText('0%');
    await expect(page.getByTestId('score-classificacao')).toHaveText('Baixo');
  });

  test('12 acertos em 12 exibe 100% e classificação Alto, com oferta de mentoria', async ({
    page,
  }) => {
    await answerQuizDeterministically(page, 'senior', 12);
    await submitLead(page, `e2e-alto-${Date.now()}@example.com`);

    await expect(page.getByTestId('score-geral')).toHaveText('100%');
    await expect(page.getByTestId('score-classificacao')).toHaveText('Alto');
    await expect(page.getByText('Aplicar para mentoria')).toBeVisible();
  });
});

test.describe('/resultado — acesso direto sem sessão', () => {
  test('redireciona para / em vez de mostrar um resultado vazio', async ({ page }) => {
    await page.goto('/resultado');
    await expect(page).toHaveURL(/\/$/, { timeout: 10_000 });
  });
});
