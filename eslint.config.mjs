import { defineConfig, globalIgnores } from 'eslint/config';

/**
 * Root ESLint configuration for the monorepo.
 * This is required for ESLint v9 to work from the root directory.
 * Individual projects have their own ESLint configurations.
 */
export default defineConfig([
  globalIgnores([
    '**/node_modules/**',
    '**/dist/**',
    '**/.next/**',
    '**/out/**',
    '**/build/**',
    '**/coverage/**',
    '**/*.config.js',
    '**/*.config.mjs',
    '**/*.config.ts',
    '**/pnpm-lock.yaml',
    '**/package-lock.json',
    '**/yarn.lock',
  ]),
]);
