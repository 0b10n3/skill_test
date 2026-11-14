import { expect, test, type Locator, type Page } from '@playwright/test';
import questionsBank from '../content/questions.json';
import { CATEGORY_LABEL } from '../content/relatorio';
import type { KnowledgeCategory } from '../lib/types';

/**
 * Matriz visual do Épico 47: a PRIMEIRA TELA de cada rota nos tamanhos reais de
 * celular, tablet e desktop (funnel-visual.spec.ts guarda a página inteira).
 * Cada captura também afirma: sem rolagem horizontal, h1 fora do cabeçalho fixo
 * e, onde o épico de origem exige, o botão principal inteiro na tela (acima do
 * banner de cookies, quando ele está aberto).
 */

interface BankQuestion {
  id: string;
  type: string;
  category: string;
  question: string;
  options: { id: string; text: string }[];
  correctOptionId?: string;
}
const bank = questionsBank as BankQuestion[];
const tamanho = (q: BankQuestion) =>
  q.question.length + q.options.reduce((n, o) => n + o.text.length, 0);
const conhecimento = bank
  .filter((q) => q.type === 'knowledge')
  .sort((a, b) => tamanho(b) - tamanho(a));
const PERGUNTAS_FIXAS = {
  longa: bank.find((q) => q.id === 'q27')!,
  curta: conhecimento[conhecimento.length - 1],
};

type Tema = 'light' | 'dark';
const CELULARES = [
  { width: 360, height: 640 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
];
const TODOS = [...CELULARES, { width: 768, height: 1024 }, { width: 1440, height: 900 }];
const AMBOS: Tema[] = ['light', 'dark'];

async function preparar(page: Page, viewport: { width: number; height: number }, tema: Tema) {
  await page.setViewportSize(viewport);
  await page.emulateMedia({ colorScheme: tema, reducedMotion: 'reduce' });
}

async function conferir(page: Page, nome: string, principal?: Locator) {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => window.scrollTo(0, 0));

  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth, 'rolagem horizontal').toBeLessThanOrEqual(clientWidth);

  const h1 = (await page.locator('h1').first().boundingBox())!;
  expect(h1.y, 'h1 atrás do cabeçalho fixo').toBeGreaterThanOrEqual(56);

  if (principal) {
    const banner = page.getByRole('region', { name: /consentimento/i }).locator('> div');
    const limite =
      (await banner.count()) > 0 ? (await banner.boundingBox())!.y : page.viewportSize()!.height;
    const botao = (await principal.boundingBox())!;
    expect(botao.y + botao.height, 'botão principal fora da primeira tela').toBeLessThanOrEqual(
      limite,
    );
  }

  await expect(page).toHaveScreenshot(nome, { maxDiffPixelRatio: 0.02 });
}

async function responder(page: Page, escolher: (q: BankQuestion) => string) {
  for (let i = 1; i <= 15; i += 1) {
    await expect(page.getByText(`Pergunta ${i} de 15`)).toBeVisible({ timeout: 10_000 });
    const texto = (await page.locator('[data-slot="card-title"]').textContent())!.trim();
    const q = bank.find((b) => b.question.trim() === texto)!;
    const opcao = q.options.find((o) => o.id === escolher(q))!;
    await page.locator('label').filter({ hasText: opcao.text }).getByRole('radio').click();
    await page.getByRole('button', { name: 'Próxima' }).click();
  }
  await page.waitForURL('**/lead', { timeout: 10_000 });
}

async function irAoLead(page: Page) {
  await page.goto('/quiz');
  await page.locator('label').filter({ hasText: 'Analista Júnior' }).getByRole('radio').click();
  await page.getByRole('button', { name: 'Próxima' }).click();
  await responder(page, (q) => q.options[0].id);
}

for (const tema of AMBOS) {
  for (const vp of TODOS) {
    const sufixo = `${tema}-${vp.width}x${vp.height}.png`;

    test(`/ — ${sufixo}`, async ({ page }) => {
      await preparar(page, vp, tema);
      await page.goto('/');
      const hero = page.locator('main > section').first();
      await conferir(page, `home-${sufixo}`, hero.getByRole('link', { name: 'Iniciar avaliação' }));
    });

    test(`/quiz senioridade — ${sufixo}`, async ({ page }) => {
      await preparar(page, vp, tema);
      await page.goto('/quiz');
      await conferir(
        page,
        `quiz-senioridade-${sufixo}`,
        page.getByRole('button', { name: 'Próxima' }),
      );
    });

    for (const [rotulo, q] of Object.entries(PERGUNTAS_FIXAS)) {
      test(`/quiz pergunta ${rotulo} — ${sufixo}`, async ({ page }) => {
        await preparar(page, vp, tema);
        await page.goto('/quiz');
        await page.getByRole('radio').first().click();
        await page.getByRole('button', { name: 'Próxima' }).click();
        await expect(page.getByText('Pergunta 1 de 15')).toBeVisible({ timeout: 10_000 });
        // A sessão é sorteada: o texto da pergunta fixa entra no lugar da sorteada (mesmo layout).
        await page.evaluate(
          ({ eyebrow, question, options }) => {
            document.querySelector('[data-testid="quiz-eyebrow"]')!.textContent = eyebrow;
            document.querySelector('[data-slot="card-title"]')!.textContent = question;
            document.querySelectorAll('[data-slot="radio-group"] label').forEach((label, i) => {
              label.lastChild!.textContent = options[i];
            });
          },
          {
            eyebrow: CATEGORY_LABEL[q.category as KnowledgeCategory],
            question: q.question,
            options: q.options.map((o) => o.text),
          },
        );
        await conferir(
          page,
          `quiz-${rotulo}-${sufixo}`,
          page.getByRole('button', { name: 'Próxima' }),
        );
      });
    }

    for (const estado of ['vazio', 'erros'] as const) {
      test(`/lead ${estado} — ${sufixo}`, async ({ page }) => {
        await preparar(page, vp, tema);
        await irAoLead(page);
        const enviar = page.getByRole('button', { name: 'Ver meu resultado' });
        if (estado === 'erros') {
          await enviar.click();
          await expect(page.locator('#lead-name-error')).toBeVisible();
        }
        await conferir(page, `lead-${estado}-${sufixo}`, estado === 'vazio' ? enviar : undefined);
      });
    }
  }
}

// Resultado: alto (tudo certo), baixo (só Mercados & Produtos certo) e zero acertos. Determinístico.
const RESULTADOS: Record<string, (q: BankQuestion) => string> = {
  alto: (q) => q.correctOptionId!,
  baixo: (q) =>
    q.category === 'mercados-produtos'
      ? q.correctOptionId!
      : q.options.find((o) => o.id !== q.correctOptionId)!.id,
  zero: (q) => q.options.find((o) => o.id !== q.correctOptionId)!.id,
};
const RESULTADO_VPS: [{ width: number; height: number }, Tema[]][] = [
  [{ width: 375, height: 667 }, AMBOS],
  [{ width: 768, height: 1024 }, ['light']],
  [{ width: 1440, height: 900 }, AMBOS],
];
for (const [nivel, escolher] of Object.entries(RESULTADOS)) {
  for (const [vp, temas] of RESULTADO_VPS) {
    for (const tema of temas) {
      test(`/resultado ${nivel} — ${tema}-${vp.width}`, async ({ page }) => {
        await preparar(page, vp, tema);
        await page.goto('/quiz');
        await page
          .locator('label')
          .filter({ hasText: 'Analista Júnior' })
          .getByRole('radio')
          .click();
        await page.getByRole('button', { name: 'Próxima' }).click();
        await responder(page, escolher);
        await page.locator('#lead-name').fill('Teste Matriz');
        await page.locator('#lead-email').fill(`matriz-${nivel}@example.com`);
        await page.getByRole('checkbox').click();
        await page.getByRole('button', { name: 'Ver meu resultado' }).click();
        await page.waitForURL('**/resultado', { timeout: 15_000 });
        await expect(page.getByTestId('report-participant-name')).toBeVisible();
        await expect(page.getByText('Radar de competências')).toBeVisible();
        await page.locator('.recharts-surface').first().waitFor();
        await conferir(page, `resultado-${nivel}-${tema}-${vp.width}x${vp.height}.png`);
      });
    }
  }
}

const NEWSLETTER: Record<string, string> = {
  generica: '/newsletter',
  'genz-fear': '/newsletter?n=junior&d=matematica-quant&c=baixo',
  'genz-greed': '/newsletter?n=junior&d=dados-programacao&c=alto',
  'millennials-fear': '/newsletter?n=pleno&d=risco-regulacao&c=baixo',
  'millennials-greed': '/newsletter?n=senior&d=ia-aplicada&c=alto',
};
for (const [variante, rota] of Object.entries(NEWSLETTER)) {
  for (const [vp, temas] of RESULTADO_VPS) {
    for (const tema of temas) {
      test(`/newsletter ${variante} — ${tema}-${vp.width}`, async ({ page }) => {
        await preparar(page, vp, tema);
        await page.goto(rota);
        await conferir(
          page,
          `newsletter-${variante}-${tema}-${vp.width}x${vp.height}.png`,
          page.locator('a[href*="utm_content=newsletter-hero"]'),
        );
      });
    }
  }
}

for (const [rota, nome] of [
  ['/privacidade', 'privacidade'],
  ['/pagina-que-nao-existe', '404'],
] as const) {
  for (const vp of [
    { width: 375, height: 667 },
    { width: 1440, height: 900 },
  ]) {
    test(`${rota} — light-${vp.width}`, async ({ page }) => {
      await preparar(page, vp, 'light');
      await page.goto(rota);
      await conferir(page, `${nome}-light-${vp.width}x${vp.height}.png`);
    });
  }
}
