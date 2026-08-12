/** Static analysis for workspace boundaries. @type {import('dependency-cruiser').IConfiguration} */
export default {
  forbidden: [
    {
      name: 'no-package-imports-apps-web',
      severity: 'error',
      comment: 'A package must never import from apps/web.',
      from: { path: '^packages' },
      to: { path: '^apps/web' },
    },
    {
      name: 'core-independent-from-react-and-dom',
      severity: 'error',
      comment:
        'packages/core must remain deterministic and independent from React, the DOM, and browser storage.',
      from: { path: '^packages/core' },
      to: {
        // pnpm resolves npm dependencies into the shared `.pnpm` store, so
        // the resolved path never starts with the bare package name.
        path: 'node_modules/\\.pnpm/react(-dom)?@',
      },
    },
    {
      name: 'core-independent-from-other-domain-packages',
      severity: 'error',
      comment: 'packages/core must not depend on another domain package.',
      from: { path: '^packages/core' },
      to: { path: '^packages/(game-state|ui)' },
    },
    {
      name: 'ui-must-not-import-game-state',
      severity: 'error',
      comment:
        'packages/ui must not import, subscribe to, or mutate the game store in packages/game-state.',
      from: { path: '^packages/ui' },
      to: { path: '^packages/game-state' },
    },
    {
      name: 'web-must-not-import-core-directly',
      severity: 'error',
      comment:
        'apps/web must depend on packages/core only through packages/game-state or packages/ui.',
      from: { path: '^apps/web' },
      to: { path: '^packages/core' },
    },
    {
      name: 'no-circular-dependencies',
      severity: 'error',
      comment:
        'Circular dependencies are forbidden between workspaces and between modules.',
      from: {},
      to: { circular: true },
    },
    ...['core', 'shared', 'game-state', 'ui'].map((name) => ({
      name: `no-relative-import-escaping-packages-${name}`,
      severity: 'error',
      comment:
        'A relative import must not escape its own workspace; use the target workspace public entry point instead.',
      from: { path: `^packages/${name}/src` },
      to: {
        pathNot: `^packages/${name}/src`,
        dependencyTypes: ['local'],
      },
    })),
    {
      name: 'no-relative-import-escaping-apps-web',
      severity: 'error',
      comment:
        'A relative import must not escape its own workspace; use the target workspace public entry point instead.',
      from: { path: '^apps/web/src' },
      to: {
        pathNot: '^apps/web/src',
        dependencyTypes: ['local'],
      },
    },
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.json',
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
    },
    reporterOptions: {
      text: {
        highlightFocused: true,
      },
    },
  },
};
