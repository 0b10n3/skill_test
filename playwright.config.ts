import { defineConfig, devices } from '@playwright/test';

// PLAYWRIGHT_BASE_URL permite rodar a suíte contra um deployment real (ex:
// preview da Vercel) em vez de subir um servidor local — usado no Épico 9
// para validar o fluxo completo contra o ambiente de preview, não só
// localhost. Sem essa var, comportamento padrão inalterado.
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';
const isRemoteTarget = Boolean(process.env.PLAYWRIGHT_BASE_URL);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: isRemoteTarget
    ? undefined
    : {
        command: 'npm run build && npm run start',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
      },
});
