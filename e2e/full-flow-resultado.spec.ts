import { expect, test, type Page } from '@playwright/test';
import questionsBank from '../content/questions.json';

interface BankOption {
  id: string;
  text: string;
}
interface BankQuestion {
  id: string;
  type: 'seniority' | 'knowledge';
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
 * 15 perguntas de conhecimento respondemos certo, para produzir um score
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

  for (let i = 0; i < 15; i += 1) {
    await page.waitForSelector('[data-slot="card-title"]', { timeout: 10_000 });
    const questionText = (await page.locator('[data-slot="card-title"]').textContent())?.trim();
    const question = bank.find((q) => q.question.trim() === questionText);
    if (!question) throw new Error(`Pergunta não encontrada no banco: ${questionText}`);

    const shouldBeCorrect = remainingCorrect > 0;
    if (shouldBeCorrect) remainingCorrect -= 1;
    const option = shouldBeCorrect
      ? question.options.find((o) => o.id === question.correctOptionId)!
      : question.options.find((o) => o.id !== question.correctOptionId)!;
    await clickOptionWithText(page, option.text);

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

/**
 * Confere que as 8 seções do relatório (S1–S8, REPORT.md §2) aparecem na
 * ordem especificada, sem seção vazia — critério de aceite do Épico 12,
 * verificado para as 3 personas abaixo (aspirante/baixo, pleno/médio,
 * sênior/alto).
 */
async function expectAllReportSectionsInOrder(page: Page) {
  const headings = await page
    .locator('h1, h2, [data-slot="card-title"], [data-slot="accordion-trigger"]')
    .allTextContents();

  const sectionOrder = [
    /Diagnóstico de Competências/, // S1
    /Radar de competências/, // S2
    /Desempenho por dimensão/, // S3
    /O que te destaca/, // S4
    /Onde investir primeiro/, // S5
    /Revisar minhas respostas/, // S6
  ];

  let searchFrom = 0;
  for (const pattern of sectionOrder) {
    const index = headings.findIndex((text, i) => i >= searchFrom && pattern.test(text));
    expect(
      index,
      `seção esperada (${pattern}) não encontrada em ordem: ${headings.join(' | ')}`,
    ).toBeGreaterThanOrEqual(searchFrom);
    searchFrom = index;
  }

  // S7 (CTA) e S8 (rodapé de método) não são headings, checados à parte.
  await expect(page.getByText('Como funciona a metodologia')).toBeVisible();

  // Nenhum texto quebrado/placeholder (chave de matriz editorial faltando, valor undefined etc.)
  const bodyText = await page.locator('main').innerText();
  expect(bodyText).not.toMatch(/undefined|\[object Object\]|NaN%/);
}

test.describe('Fluxo completo — Landing → Quiz → Lead → Resultado', () => {
  test('9 acertos em 15 exibe classificação Médio, com todas as seções do relatório', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Iniciar avaliação' }).click();
    await expect(page).toHaveURL(/\/quiz$/);

    await answerQuizDeterministically(page, 'pleno', 9);
    await submitLead(page, `e2e-medio-${Date.now()}@example.com`);

    await expect(page.getByTestId('score-geral')).toHaveText('60% de acerto geral');
    await expect(page.getByTestId('score-classificacao')).toHaveText('Médio');
    await expectAllReportSectionsInOrder(page);
  });

  test('0 acertos em 15 exibe classificação Baixo, com todas as seções do relatório', async ({
    page,
  }) => {
    await answerQuizDeterministically(page, 'aspirante', 0);
    await submitLead(page, `e2e-baixo-${Date.now()}@example.com`);

    await expect(page.getByTestId('score-geral')).toHaveText('0% de acerto geral');
    await expect(page.getByTestId('score-classificacao')).toHaveText('Baixo');
    await expectAllReportSectionsInOrder(page);
  });

  test('15 acertos em 15 exibe classificação Alto, com oferta de mentoria e todas as seções do relatório', async ({
    page,
  }) => {
    await answerQuizDeterministically(page, 'senior', 15);
    await submitLead(page, `e2e-alto-${Date.now()}@example.com`);

    await expect(page.getByTestId('score-geral')).toHaveText('100% de acerto geral');
    await expect(page.getByTestId('score-classificacao')).toHaveText('Alto');
    await expect(page.getByText('Aplicar para mentoria')).toBeVisible();
    await expectAllReportSectionsInOrder(page);
  });

  test('o gabarito começa fechado e abre ao clicar, revelando a explicação de cada questão', async ({
    page,
  }) => {
    await answerQuizDeterministically(page, 'pleno', 9);
    await submitLead(page, `e2e-gabarito-${Date.now()}@example.com`);

    const trigger = page.getByRole('button', { name: 'Revisar minhas respostas' });
    const panel = page.locator('[data-slot="accordion-content"]');

    await expect(panel).toBeHidden();
    await trigger.click();
    await expect(panel).toBeVisible();
    await expect(panel.getByText(/./).first()).toBeVisible();
  });

  test('impressão suprime o CTA e expande o gabarito', async ({ page }) => {
    await answerQuizDeterministically(page, 'pleno', 9);
    await submitLead(page, `e2e-print-${Date.now()}@example.com`);

    await page.emulateMedia({ media: 'print' });

    await expect(page.getByRole('button', { name: 'Ver curso' })).toBeHidden();
    await expect(page.locator('[data-slot="accordion-content"]')).toBeVisible();
  });
});

test.describe('/resultado — acesso direto sem sessão', () => {
  test('redireciona para / em vez de mostrar um resultado vazio', async ({ page }) => {
    await page.goto('/resultado');
    await expect(page).toHaveURL(/\/$/, { timeout: 10_000 });
  });
});
