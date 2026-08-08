#!/usr/bin/env node
// Audita Lighthouse contra uma URL já servida (build de produção) e falha
// (exit code 1) se Performance, Acessibilidade ou SEO ficarem abaixo do
// limiar exigido pelo Épico 4. Reaproveita o Chromium já baixado pelo
// Playwright em vez de depender de um Chrome do sistema.
import { chromium } from '@playwright/test';
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';

const url = process.argv[2] ?? 'http://localhost:3000/';
const THRESHOLD = 90;
const CATEGORIES = ['performance', 'accessibility', 'seo'];

const chrome = await launch({
  chromePath: chromium.executablePath(),
  chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
});

try {
  const result = await lighthouse(url, {
    port: chrome.port,
    output: 'json',
    onlyCategories: CATEGORIES,
    formFactor: 'mobile',
    screenEmulation: { mobile: true, width: 375, height: 667, deviceScaleFactor: 2 },
  });

  const { categories } = result.lhr;
  let failed = false;

  console.log(`\nLighthouse — ${url}\n`);
  for (const key of CATEGORIES) {
    const score = Math.round(categories[key].score * 100);
    const status = score >= THRESHOLD ? 'OK ' : 'FAIL';
    if (score < THRESHOLD) failed = true;
    console.log(`  [${status}] ${categories[key].title}: ${score}`);
  }
  console.log('');

  if (failed) {
    console.error(`Uma ou mais categorias ficaram abaixo do limiar de ${THRESHOLD}.`);
    process.exitCode = 1;
  }
} finally {
  await chrome.kill();
}
