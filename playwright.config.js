import { defineConfig } from '@playwright/test';

export default defineConfig({
  // ✅ onde ficam os testes
  testDir: './tests',

  // ✅ timeout geral por teste
  timeout: 30 * 1000,

  // ✅ retries (importante em CI)
  retries: 1,

  // ✅ paralelismo interno do Playwright (opcional)
  workers: 4,

  // ✅ reporter principal (ESSENCIAL pro Jenkins funcionar)
  reporter: [
    ['blob'] // 👉 gera arquivos que o merge usa depois
  ],

  use: {
    // ✅ baseURL da sua API
    baseURL: 'http://localhost:3000/api',

    // ✅ timeout de requests
    actionTimeout: 15 * 1000,

    // ✅ logs melhores
    trace: 'retain-on-failure',

    // ✅ screenshot automática em falha
    screenshot: 'only-on-failure',

    // ✅ vídeo (profissional 🔥)
    video: 'retain-on-failure'
  },

  // ✅ config para CI (Jenkins)
  fullyParallel: false, // importante evitar conflito com Jenkins parallel

  // ✅ output padrão
  outputDir: 'test-results',

});