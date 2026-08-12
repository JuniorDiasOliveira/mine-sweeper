import { defineConfig } from 'vitest/config';

// Shared testing configuration for unit and component tests in every workspace.
export default defineConfig({
  test: {
    environment: 'jsdom',
    include: [
      'packages/*/src/**/*.test.{ts,tsx}',
      'apps/*/src/**/*.test.{ts,tsx}',
    ],
  },
});
