import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'], 
    include: [
      'src/**/*.test.ts',
      'tests/**/*.test.ts',
    ],
    exclude: [
      'src/config/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['src/server.ts', 'src/config/**'],
    },
  },
});