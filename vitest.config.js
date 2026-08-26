import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.{test,spec}.{js,jsx}'],
    exclude: ['tests/e2e/**'],
  },
});