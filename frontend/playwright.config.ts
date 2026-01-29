import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: {
    timeout: 10_000
  },
  use: {
    baseURL: 'http://localhost',
    viewport: { width: 1280, height: 720 },
    trace: 'on-first-retry'
  }
});
