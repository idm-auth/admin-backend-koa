import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true, // habilita describe, it, expect
    environment: 'node',
    pool: 'threads', // Opções: 'threads' | 'forks' | 'vmThreads' | false
    poolOptions: {
      threads: {
        minThreads: 6,
        maxThreads: 10, // Recomendado: número de CPUs
        useAtomics: true, // Melhor performance
        isolate: true, // Isolamento entre testes
      },
      // Para pool: 'forks'
      // forks: {
      //   minForks: 1,
      //   maxForks: 4,
      //   isolate: true,
      // },
    },
    env: {
      NODE_ENV: 'test',
      LOGGER_LEVEL: process.env.LOGGER_LEVEL || 'error',
    },
    setupFiles: [
      'tests/setup/base.setup.ts',
      'tests/setup/integration.setup.ts',
    ],

    include: ['tests/**/*.test.ts'],
    // Configurações de performance
    testTimeout: 30000, // 30s timeout
    hookTimeout: 30000, // 30s para hooks
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
