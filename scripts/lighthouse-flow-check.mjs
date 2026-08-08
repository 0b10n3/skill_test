#!/usr/bin/env node
// Audita Lighthouse nas 4 rotas públicas dirigindo um navegador real pelo
// fluxo completo (Landing → Quiz → Lead → Resultado) via Puppeteer, usando a
// User Flow API do Lighthouse.
//
// /lead e /resultado redirecionam para "/" quando acessados a frio (sem ter
// passado pelo quiz — guarda contra dado fictício/vazio), então um
// lighthouse(url) comum nunca veria o conteúdo real dessas páginas. Em vez
// disso, medimos a TRANSIÇÃO client-side que leva a cada uma delas via
// flow.startTimespan()/endTimespan() — é também a forma correta de medir
// performance de uma navegação client-side (não há "carregamento de página"
// tradicional para essas rotas em uso real, elas só existem depois de
// interação). "/" e "/quiz" são navegáveis diretamente, então usam
// flow.navigate() normal (dá métricas completas de carregamento).
import { chromium as playwrightChromium } from '@playwright/test';
import { launch } from 'chrome-launcher';
import { startFlow } from 'lighthouse';
import puppeteer from 'puppeteer-core';
import content from '../content/questions.json' with { type: 'json' };

const BASE_URL = process.argv[2] ?? 'http://localhost:3000';
const THRESHOLD = 90;
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];

const seniorityQuestion = content.find((q) => q.type === 'seniority');

async function clickRadioWithText(page, text) {
  const labels = await page.$$('label');
  for (const label of labels) {
    const labelText = await label.evaluate((el) => el.textContent?.trim());
    if (labelText === text.trim()) {
      const radio = await label.$('[role="radio"]');
      await radio.click();
      return;
    }
  }
  throw new Error(`Opção com texto "${text}" não encontrada`);
}

async function clickNext(page) {
  await page.waitForSelector('[data-testid="quiz-next-button"]:not([disabled])', {
    timeout: 10_000,
  });
  await page.click('[data-testid="quiz-next-button"]');
}

async function runFlow() {
  const chrome = await launch({
    chromePath: playwrightChromium.executablePath(),
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
  });

  const browser = await puppeteer.connect({ browserURL: `http://localhost:${chrome.port}` });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });

  const flow = await startFlow(page, { name: 'Syntaxis Skill Check — fluxo completo' });

  try {
    await flow.navigate(`${BASE_URL}/`, { name: '/ (landing)' });

    await flow.navigate(`${BASE_URL}/quiz`, { name: '/quiz' });
    await page.waitForSelector('[data-slot="card-title"]', { timeout: 10_000 });

    await clickRadioWithText(page, seniorityQuestion.options[0].text);
    await clickNext(page);

    for (let i = 0; i < 13; i += 1) {
      await page.waitForSelector('[data-slot="card-title"]', { timeout: 10_000 });
      const firstRadio = await page.$('[role="radio"]');
      await firstRadio.click();

      const isLastQuestion = i === 12;
      if (isLastQuestion) {
        await flow.startTimespan({ name: 'transição /quiz → /lead' });
        await page.click('[data-testid="quiz-next-button"]');
        await page.waitForFunction(() => location.pathname === '/lead', { timeout: 10_000 });
        await page.waitForSelector('#lead-name', { timeout: 10_000 });
        await flow.endTimespan();
        await flow.snapshot({ name: '/lead (a11y/best-practices/seo)' });
      } else {
        await clickNext(page);
      }
    }

    await page.type('#lead-name', 'QA Lighthouse Flow');
    await page.type('#lead-email', `qa-lighthouse-${Date.now()}@example.com`);
    await page.click('[role="checkbox"]');

    await flow.startTimespan({ name: 'transição /lead → /resultado (inclui POST /api/submit)' });
    await page.click('button[type="submit"]');
    await page.waitForFunction(() => location.pathname === '/resultado', { timeout: 15_000 });
    await page.waitForSelector('[data-testid="score-geral"]', { timeout: 10_000 });
    await flow.endTimespan();
    await flow.snapshot({ name: '/resultado (a11y/best-practices/seo)' });
  } finally {
    const flowResult = await flow.createFlowResult();
    await browser.disconnect();
    await chrome.kill();
    return flowResult;
  }
}

// Cada modo de coleta do Lighthouse só produz um subconjunto válido de
// categorias — as demais aparecem com score 0/null e não são um resultado
// real, não devem ser tratadas como falha.
const CATEGORIES_BY_GATHER_MODE = {
  navigation: CATEGORIES,
  timespan: ['performance', 'best-practices'],
  snapshot: ['accessibility', 'best-practices', 'seo'],
};

function printAndCheck(flowResult) {
  let anyFailed = false;

  console.log(`\nLighthouse User Flow — ${BASE_URL}\n`);

  for (const step of flowResult.steps) {
    console.log(`## ${step.name} (${step.lhr.gatherMode})`);
    const relevantCategories = CATEGORIES_BY_GATHER_MODE[step.lhr.gatherMode] ?? CATEGORIES;

    for (const key of CATEGORIES) {
      if (!relevantCategories.includes(key)) continue;
      const category = step.lhr.categories[key];
      if (!category || category.score === null) {
        console.log(`  [--] ${key}: sem score`);
        continue;
      }
      const score = Math.round(category.score * 100);
      const status = score >= THRESHOLD ? 'OK ' : 'FAIL';
      if (score < THRESHOLD) anyFailed = true;
      console.log(`  [${status}] ${category.title}: ${score}`);
    }
    console.log('');
  }

  if (anyFailed) {
    console.error(`Uma ou mais categorias, em uma ou mais rotas, ficaram abaixo de ${THRESHOLD}.`);
    process.exitCode = 1;
  }
}

const flowResult = await runFlow();
printAndCheck(flowResult);
