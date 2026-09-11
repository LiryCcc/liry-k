import { defineConfig, devices } from '@playwright/test';
import { resolve } from 'node:path';

const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const PROJECT_ROOT = resolve(import.meta.dirname, '..');

const playwrightConfig = defineConfig({
  testDir: import.meta.dirname,
  testMatch: '**/*.spec.ts',
  tsconfig: resolve(import.meta.dirname, 'tsconfig.json'),
  outputDir: resolve(import.meta.dirname, 'test-results'),
  fullyParallel: true,
  forbidOnly: process.env['CI'] !== undefined,
  retries: process.env['CI'] === undefined ? 0 : 2,
  reporter: [['list'], ['html', { open: 'never', outputFolder: resolve(import.meta.dirname, 'playwright-report') }]],
  use: {
    baseURL: BASE_URL,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chromium' }
    }
  ],
  webServer: {
    command: 'pnpm build && pnpm start',
    cwd: PROJECT_ROOT,
    env: { PORT: String(PORT) },
    reuseExistingServer: process.env['CI'] === undefined,
    timeout: 120_000,
    url: `${BASE_URL}/healthz`
  }
});

export default playwrightConfig;
