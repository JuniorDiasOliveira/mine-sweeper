# Repository Configuration

## Purpose

Document where configuration belongs, how the directories are grouped, and
which commands consume each file. This convention prevents tool configuration
from spreading across the repository or creating a separate directory for
every file.

## Organization rule

Configuration shared across the monorepo belongs in `configs/` and is grouped
by responsibility. A directory represents a concern, not an individual tool.

```text
configs/
├── code-quality/
│   ├── eslint.config.js
│   ├── prettier.config.js
│   └── prettier.ignore
├── static-analysis/
│   ├── dependency-cruiser.config.mjs
│   └── knip.json
├── testing/
│   ├── playwright.config.ts
│   └── vitest.config.ts
└── typescript/
    └── tsconfig.base.json
```

| Directory          | Responsibility                                                                      |
| ------------------ | ----------------------------------------------------------------------------------- |
| `code-quality/`    | Source analysis and formatting rules applied while code is written or reviewed.     |
| `static-analysis/` | Repository-wide structural checks, including dependency boundaries and unused code. |
| `testing/`         | Test discovery, environments, reporters, and test-server behavior.                  |
| `typescript/`      | Compiler rules inherited by every TypeScript workspace.                             |

Knip lives with dependency-cruiser because both analyze repository structure
without executing product behavior. ESLint remains in `code-quality` because
it provides source-level feedback and automatic fixes, even though some of its
rules also reinforce package boundaries.

## Configuration files

| File                                                                                                           | Consumer                                                        |
| -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| [`code-quality/eslint.config.js`](../../configs/code-quality/eslint.config.js)                                 | `pnpm lint` and lint-staged JavaScript/TypeScript checks.       |
| [`code-quality/prettier.config.js`](../../configs/code-quality/prettier.config.js)                             | `pnpm format`, `pnpm format:check`, and lint-staged formatting. |
| [`code-quality/prettier.ignore`](../../configs/code-quality/prettier.ignore)                                   | The Prettier commands above.                                    |
| [`static-analysis/dependency-cruiser.config.mjs`](../../configs/static-analysis/dependency-cruiser.config.mjs) | `pnpm check:architecture`.                                      |
| [`static-analysis/knip.json`](../../configs/static-analysis/knip.json)                                         | `pnpm check:unused`.                                            |
| [`testing/vitest.config.ts`](../../configs/testing/vitest.config.ts)                                           | `pnpm test`.                                                    |
| [`testing/playwright.config.ts`](../../configs/testing/playwright.config.ts)                                   | `pnpm test:e2e`.                                                |
| [`typescript/tsconfig.base.json`](../../configs/typescript/tsconfig.base.json)                                 | Root and workspace `tsconfig.json` files.                       |

The root scripts in [`package.json`](../../package.json) pass configuration
paths explicitly. Do not depend on a tool discovering a configuration file in
the repository root. The lint-staged commands must use the same explicit paths
so local hooks and direct commands enforce the same rules.

## What stays outside `configs/`

Workspace-specific configuration stays with the workspace that owns it. For
example, [`apps/web/vite.config.ts`](../../apps/web/vite.config.ts) belongs to
the web application because no other workspace builds a Vite application.

Conventional repository entry points also stay at the root when their tools
discover or require them there:

- `package.json` for scripts, dependencies, and package-manager metadata;
- `pnpm-workspace.yaml` for workspace discovery;
- `tsconfig.json` as the root TypeScript entry point;
- `.nvmrc` for the supported Node.js version;
- `.gitignore` for Git exclusions;
- `.husky/` for Git-hook entry points.

## Adding or changing configuration

When adding a repository-wide tool or rule:

1. Choose the existing responsibility directory that owns it.
2. Add a new responsibility directory only when none of the existing groups
   describes the concern; do not create one directory per file.
3. Keep workspace-specific configuration with its owning workspace.
4. Update the root scripts and lint-staged commands with explicit paths when
   applicable.
5. Update this guide and any normative document that references the changed
   configuration.
6. Run `pnpm check`; also run `pnpm test:e2e` when testing configuration or the
   application startup contract changes.
