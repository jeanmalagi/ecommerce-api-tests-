import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // ✅ Relatório HTML oficial (correto)
  reporter: [
    ['html', { open: 'never' }]
  ],

  use: {
    baseURL: 'http://localhost:3000',

    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  },

  // ✅ importante em CI
  retries: 1
});