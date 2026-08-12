# Mine Sweeper

An architecture-first Minesweeper project built as a TypeScript monorepo with
React, Vite, and pnpm. The repository separates game rules, observable state,
presentational UI, and application composition so that each layer can evolve
and be tested independently.

> [!NOTE]
> The repository currently contains the workspace foundation and local quality
> guardrails. The playable game is not implemented yet: the web app renders a
> small shell that verifies package resolution, while the rules, store, board,
> and full game flow remain planned work.

## Workspaces and responsibilities

| Workspace                                      | Package                    | Responsibility                                                                                                                                                                                                               | Current state                                                            |
| ---------------------------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [`apps/web`](./apps/web)                       | `@mine-sweeper/web`        | Starts the browser application, creates the game store, and composes state with UI components. It is the only application assembly layer.                                                                                    | Vite/React entry point and placeholder shell implemented.                |
| [`packages/core`](./packages/core)             | `@mine-sweeper/core`       | Owns pure Minesweeper domain types and rules: board creation, mine placement, reveal and flag behavior, neighbour counts, and win/loss evaluation. It must remain deterministic and independent from React and browser APIs. | Public entry-point placeholder implemented; game rules are planned.      |
| [`packages/game-state`](./packages/game-state) | `@mine-sweeper/game-state` | Owns the observable game store, immutable snapshots, commands that coordinate `core`, subscriptions, and React hooks based on `useSyncExternalStore`.                                                                        | Public entry-point placeholder implemented; store and hooks are planned. |
| [`packages/ui`](./packages/ui)                 | `@mine-sweeper/ui`         | Owns accessible, presentational React components and their styles. Components receive values and callbacks through props and never access the game store directly.                                                           | Public entry-point placeholder implemented; game UI is planned.          |
| [`packages/shared`](./packages/shared)         | `@mine-sweeper/shared`     | Holds domain-independent utilities only after they are needed by at least two workspaces. It is not a catch-all package.                                                                                                     | Intentionally unused, with only a resolution placeholder.                |

## Architecture

The intended runtime flow is:

```text
user interaction
       │
       ▼
packages/ui ──callback──▶ apps/web ──command──▶ packages/game-state
                                                     │
                                                     ▼
                                                packages/core
                                                     │
                                  new immutable snapshot + notification
                                                     │
                                                     ▼
                              React reads with useSyncExternalStore
```

The dependency allowlist is deliberately small:

```text
apps/web ───────────────▶ packages/game-state ──────▶ packages/core
    └──────────────────▶ packages/ui ──────────────▶ packages/core

packages/shared may be used only by packages that have a proven shared need.
```

Important boundaries:

- `core` contains game rules and has no React, DOM, storage, or network
  dependency.
- `game-state` coordinates `core`; it does not reimplement domain rules.
- `ui` receives data and callbacks through props; it does not import or
  subscribe to `game-state`.
- `web` wires the packages together; it does not become another domain layer.
- Workspace imports use public package entry points. Cross-package deep
  imports and circular dependencies are forbidden.

See the [architecture overview](./docs/architecture/OVERVIEW.md),
[package boundaries](./docs/architecture/PACKAGE_BOUNDARIES.md), and
[dependency rules](./docs/architecture/DEPENDENCY_RULES.md) for the normative
rules. The observable-state decision is recorded in
[ADR-001](./docs/decisions/ADR-001-OBSERVABLES.md).

## Repository structure

```text
.
├── apps/
│   └── web/                 React application and composition root
├── packages/
│   ├── core/                Pure Minesweeper rules
│   ├── game-state/          Observable store and React integration
│   ├── ui/                  Presentational React components
│   └── shared/              Proven domain-independent utilities
├── e2e/                     Playwright end-to-end tests
├── configs/                 Shared repository configuration
│   ├── code-quality/        ESLint and Prettier
│   ├── static-analysis/     Dependency rules and unused-code checks
│   ├── testing/             Vitest and Playwright
│   └── typescript/          Shared TypeScript compiler options
└── docs/                    Architecture, ADRs, guides, and task records
```

## Tooling and configuration

The `configs/` directory is the central location for configuration shared
across the monorepo. Application-specific configuration stays with its owning
workspace; for example, Vite is configured in `apps/web` because no other
workspace builds a Vite application.

The complete placement rules are documented in the
[repository configuration guide](./docs/development/CONFIGURATION.md).

| File                                                                                                               | Responsibility                                                                                      |
| ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| [`configs/typescript/tsconfig.base.json`](./configs/typescript/tsconfig.base.json)                                 | Shared strict TypeScript options inherited by every workspace.                                      |
| [`configs/code-quality/eslint.config.js`](./configs/code-quality/eslint.config.js)                                 | TypeScript, React Hooks, refresh, browser globals, debug-code, and workspace import-boundary rules. |
| [`configs/code-quality/prettier.config.js`](./configs/code-quality/prettier.config.js)                             | Repository formatting conventions such as quotes, semicolons, trailing commas, and line width.      |
| [`configs/code-quality/prettier.ignore`](./configs/code-quality/prettier.ignore)                                   | Files and generated directories excluded from formatting.                                           |
| [`configs/testing/vitest.config.ts`](./configs/testing/vitest.config.ts)                                           | Unit and component test discovery across `apps/*` and `packages/*`, using jsdom.                    |
| [`configs/testing/playwright.config.ts`](./configs/testing/playwright.config.ts)                                   | End-to-end test directory, local base URL, reporter, and automatic Vite development server.         |
| [`configs/static-analysis/dependency-cruiser.config.mjs`](./configs/static-analysis/dependency-cruiser.config.mjs) | Dependency allowlist, cross-workspace boundary validation, and cycle detection.                     |
| [`configs/static-analysis/knip.json`](./configs/static-analysis/knip.json)                                         | Workspace-aware detection of unused files, exports, and dependencies.                               |
| [`apps/web/vite.config.ts`](./apps/web/vite.config.ts)                                                             | Vite and React configuration specific to the web application.                                       |
| [`tsconfig.json`](./tsconfig.json)                                                                                 | Root TypeScript entry point that extends the shared base configuration.                             |
| [`package.json`](./package.json)                                                                                   | Root scripts, tool versions, lint-staged rules, Node.js range, and pinned pnpm version.             |

Files such as `package.json`, `pnpm-workspace.yaml`, `tsconfig.json`, `.nvmrc`,
and `.gitignore` remain at the repository root because they are conventional
workspace entry points discovered directly by their respective tools.

Git-hook entry points live in [`.husky/`](./.husky): pre-commit delegates to
lint-staged, while pre-push delegates to `pnpm check`. Keeping each tool's
detailed options in its configuration file ensures that developers, hooks,
and future CI use the same rules.

## Getting started

### Prerequisites

- Node.js 22 (the repository includes an [`.nvmrc`](./.nvmrc))
- pnpm 11.21.0, pinned in [`package.json`](./package.json)

### Install and run

```bash
nvm use
pnpm install
pnpm dev
```

The development server is provided by Vite and normally runs at
`http://localhost:5173`.

## Commands

| Command                   | Purpose                                                         |
| ------------------------- | --------------------------------------------------------------- |
| `pnpm dev`                | Start the web application in development mode.                  |
| `pnpm build`              | Type-check and build the web application for production.        |
| `pnpm typecheck`          | Type-check every workspace without emitting files.              |
| `pnpm lint`               | Run ESLint, including React and package-boundary rules.         |
| `pnpm format`             | Format supported files with Prettier.                           |
| `pnpm format:check`       | Verify formatting without changing files.                       |
| `pnpm test`               | Run unit and component tests with Vitest.                       |
| `pnpm test:e2e`           | Run the Playwright end-to-end suite.                            |
| `pnpm check:architecture` | Validate dependency direction, public entry points, and cycles. |
| `pnpm check:unused`       | Detect unused files, exports, and dependencies with Knip.       |
| `pnpm check`              | Run all configured non-E2E checks.                              |

Before pushing a change, run:

```bash
pnpm check
```

End-to-end tests are currently a separate manual check:

```bash
pnpm test:e2e
```

Local Git hooks format and lint staged files before commits and run
`pnpm check` before pushes. CI and branch protection are not configured yet
because the repository does not currently have a GitHub remote.

## Development status

Completed:

- pnpm monorepo with the web app and four packages;
- strict TypeScript configuration;
- formatting, linting, architecture, unused-code, unit/component, build, and
  Playwright checks;
- local pre-commit and pre-push hooks;
- documented package boundaries and observable-state architecture.

Planned:

- pure Minesweeper rules in `packages/core`;
- the observable store and React integration in `packages/game-state`;
- the game board and controls in `packages/ui`;
- full composition in `apps/web`;
- end-to-end coverage for starting, playing, winning, losing, and restarting a
  game;
- CI and protected-branch enforcement after a GitHub remote exists.

The task records in [`docs/tasks`](./docs/tasks/README.md) are the source of
truth for implementation status and acceptance criteria.

## Contributing

Start with the [development setup guide](./docs/development/GETTING_STARTED.md)
and [feature workflow](./docs/development/ADDING_A_FEATURE.md). Changes must
respect the package ownership rules, use public package APIs, include tests at
the layer that owns the behavior, and pass every applicable repository check.

AI agents must also follow [`AGENTS.md`](./AGENTS.md) and the instructions in
[`docs/agent`](./docs/agent/README.md).
