import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    watch: false,
    setupFiles: ['./test/setup/base.setup.ts'],
    globalSetup: ['./test/setup/globalSetup.ts', './test/setup/globalTeardown.ts'],
    exclude: ['**/node_modules/**', '**/old/**', '**/.external/**'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@test': path.resolve(__dirname, './test'),
    },
  },
});
