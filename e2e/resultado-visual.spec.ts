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

/**
 * O banco tem mais perguntas por dimensão do que as 3 sorteadas por sessão
 * (lib/quiz-selection.ts embaralha o pool elegível) — mesmo com score
 * 100% determinístico (baixo/alto), o TEXTO literal de pergunta/opção/
 * explicação no gabarito, e a lista específica de tópicos em "Vale
 * revisitar", variam a cada execução. Mascarados na comparação de pixel
 * (achado real ao baselinar este teste: o diff mostrava só essas duas
 * áreas mudando) — o resto da página (S1/S2/S3/S5 estrutural, padrões,
 * cores) continua verificado pixel a pixel.
 */
async function randomContentMasks(page: Page) {
  const masks = [page.locator('section[aria-labelledby="answer-review-heading"]')];
  const valeRevisitar = page.getByText('Vale revisitar').locator('..');
  if ((await valeRevisitar.count()) > 0) masks.push(valeRevisitar);
  return masks;
}

async function submitLead(page: Page, email: string) {
  await page.locator('#lead-name').fill('Teste Visual Resultado');
  await page.locator('#lead-email').fill(email);
  await page.getByRole('checkbox').click();
  await Promise.all([
    page.waitForResponse((response) => response.url().includes('/api/submit')),
    page.getByRole('button', { name: 'Ver meu resultado' }).click(),
  ]);
  await page.waitForURL('**/resultado', { timeout: 10_000 });
}

// Só baixo (0/15) e alto (15/15): únicos resultados 100% determinísticos
// independente da ordem de perguntas sorteada por sessão
// (lib/quiz-selection.ts embaralha categoria e opções) — 9/15 (médio) tem
// muitas combinações possíveis de quais dimensões acertam/erram, o que
// muda "vale revisitar"/o gráfico de prioridades entre execuções. A
// persona médio já está coberta funcionalmente (texto, não pixel) em
// e2e/full-flow-resultado.spec.ts, que é robusto a essa variação por
// design (só confere o % geral e a presença das seções, não o layout
// exato).
const PERSONAS = [
  { seniority: 'aspirante', correctCount: 0, label: 'baixo' },
  { seniority: 'senior', correctCount: 15, label: 'alto' },
] as const;

/**
 * Baseline visual do relatório (S1–S8, Épico 18): as 2 personas
 * determinísticas do Épico 12 (aspirante/baixo, sênior/alto) × claro/
 * escuro — sucessor de e2e/funnel-visual.spec.ts (Épico 17) para
 * /resultado.
 */
for (const colorScheme of ['light', 'dark'] as const) {
  for (const persona of PERSONAS) {
    test(`resultado — ${persona.label} — ${colorScheme}`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1200 });
      await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
      await answerQuizDeterministically(page, persona.seniority, persona.correctCount);
      await submitLead(
        page,
        `resultado-visual-${persona.label}-${colorScheme}-${Date.now()}@example.com`,
      );
      await page.evaluate(() => document.fonts.ready);

      // RadarSection e PriorityCareerSkills são carregadas via next/dynamic
      // (achado de performance do Épico 13) — sem esperar o chunk montar,
      // a screenshot corre risco de capturar o placeholder de loading
      // (h-64/h-40) em vez do conteúdo real, mudando a altura da página
      // entre execuções (achado real ao baselinar este teste).
      await expect(page.getByText('Radar de competências')).toBeVisible();
      await expect(page.getByText(/Onde investir primeiro/)).toBeVisible();

      await expect(page).toHaveScreenshot(`resultado-${persona.label}-${colorScheme}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.02,
        mask: await randomContentMasks(page),
      });
    });
  }
}

/**
 * Tablet (768px, Épico 19): checagem visual única (não o cross-product
 * completo de tema × persona acima) — cross-device.spec.ts já cobre esse
 * breakpoint para overflow horizontal nas 4 rotas; aqui o objetivo é só
 * confirmar que os cards de dimensão/prioridade não quebram o layout de
 * single-viewport nessa largura intermediária. Persona "alto" (não
 * "baixo"): com 0/15 TODAS as dimensões viram "atencao" e a lista "Vale
 * revisitar" (mascarada, mas não com altura fixa) varia de altura em
 * pixels conforme o texto aleatório das perguntas sorteadas, quebrando o
 * match de dimensão do screenshot mesmo mascarado — achado real ao
 * baselinar este teste. "Alto" (15/15) não tem "Vale revisitar" (nada de
 * errado a revisar), então não tem esse vetor de variância de altura.
 */
test('resultado — tablet 768px — light', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1400 });
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
  await answerQuizDeterministically(page, 'senior', 15);
  await submitLead(page, `resultado-visual-tablet-${Date.now()}@example.com`);
  await page.evaluate(() => document.fonts.ready);

  await expect(page.getByText('Radar de competências')).toBeVisible();
  await expect(page.getByText(/Onde investir primeiro/)).toBeVisible();

  await expect(page).toHaveScreenshot('resultado-tablet-768-light.png', {
    fullPage: true,
    maxDiffPixelRatio: 0.02,
    mask: await randomContentMasks(page),
  });
});

/**
 * S8 (Épico 18): impressão sempre em fundo claro (mesmo partindo do tema
 * escuro) — a troca de tema real via next-themes (app/resultado/page.tsx)
 * é o mecanismo, não um recálculo de cor duplicado em CSS.
 */
test('resultado — impressão força tema claro mesmo partindo do tema escuro', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  // aspirante/0 acertos (persona "baixo"): único resultado 100%
  // determinístico independente da ordem de perguntas sorteada por sessão
  // (lib/quiz-selection.ts embaralha as questões) — este teste verifica o
  // mecanismo de forçar tema claro na impressão, não o conteúdo do
  // relatório, então evita a variância de conteúdo de personas parciais.
  await answerQuizDeterministically(page, 'aspirante', 0);
  await submitLead(page, `resultado-print-dark-${Date.now()}@example.com`);

  await expect(page.locator('html')).toHaveClass(/dark/);

  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('html')).not.toHaveClass(/dark/);

  await expect(page.getByText('Radar de competências')).toBeVisible();
  await expect(page.getByText(/Onde investir primeiro/)).toBeVisible();

  await expect(page).toHaveScreenshot('resultado-print.png', {
    fullPage: true,
    maxDiffPixelRatio: 0.02,
    mask: await randomContentMasks(page),
  });
});
