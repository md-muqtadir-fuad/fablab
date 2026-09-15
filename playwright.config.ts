import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', timeout: 60000, workers: 1, fullyParallel: false,
  use: { baseURL: 'http://localhost:3100', browserName: 'chromium', channel: 'chrome', headless: true, screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  webServer: { command: 'node scripts/test-server.cjs', url: 'http://localhost:3100', reuseExistingServer: false, timeout: 120000 },
});
