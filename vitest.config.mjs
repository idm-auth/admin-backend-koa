import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true, // habilita describe, it, expect
    environment: 'node',
    setupFiles: [
      'tests/setup/base.setup.ts',
      'tests/setup/integration.setup.ts',
    ],

    include: ['tests/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'html'],
    },
  },
});
