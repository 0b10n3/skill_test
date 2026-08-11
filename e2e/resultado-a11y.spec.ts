import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
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
}

const bank = questionsBank as BankQuestion[];
const seniorityOptionText = bank.find((q) => q.type === 'seniority')!.options[0].text;

test('/resultado — sem violações de contraste (axe-core)', async ({ page }) => {
  await page.goto('/quiz');
  await page.waitForSelector('[data-slot="card-title"]', { timeout: 10_000 });
  await page.locator('label').filter({ hasText: seniorityOptionText }).getByRole('radio').click();
  await page.getByRole('button', { name: 'Próxima' }).click();

  for (let i = 0; i < 15; i += 1) {
    await page.waitForSelector('[data-slot="card-title"]', { timeout: 10_000 });
    await page.getByRole('radio').first().click();
    await page.getByRole('button', { name: 'Próxima' }).click();
  }

  await page.waitForURL('**/lead', { timeout: 10_000 });
  await page.locator('#lead-name').fill('Teste A11y');
  await page.locator('#lead-email').fill(`e2e-a11y-${Date.now()}@example.com`);
  await page.getByRole('checkbox').click();
  await Promise.all([
    page.waitForResponse((response) => response.url().includes('/api/submit')),
    page.getByRole('button', { name: 'Ver meu resultado' }).click(),
  ]);
  await page.waitForURL('**/resultado', { timeout: 10_000 });

  const results = await new AxeBuilder({ page }).include('main').withTags(['wcag2aa']).analyze();
  const contrastViolations = results.violations.filter((v) => v.id === 'color-contrast');

  expect(contrastViolations, JSON.stringify(contrastViolations, null, 2)).toHaveLength(0);
});
