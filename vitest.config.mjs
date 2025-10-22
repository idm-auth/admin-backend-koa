import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true, // habilita describe, it, expect
    environment: 'node',
    env: {
      NODE_ENV: 'test',
    },
    setupFiles: [
      'tests/setup/base.setup.ts',
      'tests/setup/integration.setup.ts',
    ],

    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.test.ts',
        'src/**/*.spec.ts',
        'src/index.ts',
        'src/app.ts',
        'src/plugins/**',
        'src/utils/core/**',
        'src/middlewares/**',
        'node_modules/**',
        'tests/**',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
});
