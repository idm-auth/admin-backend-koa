import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      '@idm-auth/backend-communications-schema':
        '/workspace/.external/backend-communications-schema/dist',
    },
  },
  test: {
    globals: true, // habilita describe, it, expect
    environment: 'node',

    include: ['tests/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'html'],
    },
  },
});
