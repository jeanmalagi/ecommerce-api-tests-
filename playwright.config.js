import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  retries: 1,

  reporter: [
    ['html', { open: 'never' }]
  ],

  use: {
    baseURL: 'http://localhost:3000/api',

    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  }
});