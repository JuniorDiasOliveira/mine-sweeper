import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const SRC_FILES = ['packages/*/src/**/*.{ts,tsx}', 'apps/*/src/**/*.{ts,tsx}'];

// ESLint's no-restricted-imports keeps only the last config that sets it for
// a given file (options do not merge across config objects), so every
// workspace's forbidden-import patterns are combined into one rule block per
// workspace below rather than split across overlapping `files` globs.
const DEEP_IMPORT = {
  group: ['@mine-sweeper/*/src/*', '@mine-sweeper/*/dist/*'],
  message:
    'Import another workspace through its public root entry point, not a deep path.',
};
const NO_APPS_WEB = {
  group: ['@mine-sweeper/web', '@mine-sweeper/web/*'],
  message: 'A package must never import from apps/web.',
};
const NO_REACT = {
  group: ['react', 'react-dom', 'react-dom/*'],
  message: 'packages/core must not depend on React.',
};
const NO_DOMAIN_PACKAGE_FROM_CORE = {
  group: ['@mine-sweeper/game-state', '@mine-sweeper/ui'],
  message: 'packages/core must not depend on another domain package.',
};
const NO_GAME_STATE_FROM_UI = {
  group: ['@mine-sweeper/game-state'],
  message:
    'packages/ui must not import packages/game-state (ADR-001, PACKAGE_BOUNDARIES.md).',
};
const NO_CORE_FROM_WEB = {
  group: ['@mine-sweeper/core'],
  message:
    'apps/web must depend on packages/core only through packages/game-state or packages/ui (DEPENDENCY_RULES.md).',
};

function boundaryRule(patterns) {
  return {
    'no-restricted-imports': ['error', { patterns }],
  };
}

export default tseslint.config(
  {
    ignores: [
      'node_modules',
      '**/dist/**',
      '**/coverage/**',
      '**/playwright-report/**',
      '**/test-results/**',
      'pnpm-lock.yaml',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: SRC_FILES,
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    files: ['**/*.{ts,tsx,js,mjs,cjs}'],
    rules: {
      'no-console': 'error',
      'no-debugger': 'error',
    },
  },
  {
    files: ['apps/web/**/*.{ts,tsx}', 'packages/ui/**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ['*.config.{js,ts,mjs}'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  // Package boundaries (DEPENDENCY_RULES.md). Each workspace gets exactly
  // one `no-restricted-imports` block combining every pattern that applies
  // to it.
  {
    files: ['packages/core/**/*.{ts,tsx}'],
    rules: boundaryRule([
      DEEP_IMPORT,
      NO_APPS_WEB,
      NO_REACT,
      NO_DOMAIN_PACKAGE_FROM_CORE,
    ]),
  },
  {
    files: ['packages/ui/**/*.{ts,tsx}'],
    rules: boundaryRule([DEEP_IMPORT, NO_APPS_WEB, NO_GAME_STATE_FROM_UI]),
  },
  {
    files: ['packages/game-state/**/*.{ts,tsx}'],
    rules: boundaryRule([DEEP_IMPORT, NO_APPS_WEB]),
  },
  {
    files: ['packages/shared/**/*.{ts,tsx}'],
    rules: boundaryRule([DEEP_IMPORT, NO_APPS_WEB]),
  },
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    rules: boundaryRule([DEEP_IMPORT, NO_CORE_FROM_WEB]),
  },
);
