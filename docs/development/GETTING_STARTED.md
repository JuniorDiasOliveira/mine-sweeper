# Getting Started

## Purpose

Explain how to prepare the local environment and make a first contribution.

## Before starting

Read the repository instructions before changing code:

1. Read the root `README.md` and `AGENTS.md` when they exist.
2. Read the [architecture overview](../architecture/OVERVIEW.md).
3. Read the [package boundaries](../architecture/PACKAGE_BOUNDARIES.md).
4. Read the [dependency rules](../architecture/DEPENDENCY_RULES.md).
5. Read any task document associated with the work.

Do not start implementation while requirements, acceptance criteria, or the
owning package are unclear.

## Repository structure

The intended top-level structure is:

```text
apps/
  web/                 Application composition and browser entry point
packages/
  core/                Pure Minesweeper rules
  game-state/          Observable store and React integration
  ui/                  Presentational components
  shared/              Proven cross-package utilities
docs/                  Architecture, decisions, guides, and tasks
```

The directories describe responsibility, not merely file organization. Review
the package boundary documentation before deciding where new code belongs.

## Local setup

The pnpm workspace was initialized by
[`IMPLEMENT_WORKSPACE_FOUNDATION.md`](../tasks/completed/IMPLEMENT_WORKSPACE_FOUNDATION.md),
and the quality tooling below was added by
[`IMPLEMENT_GUARDRAILS.md`](../tasks/planned/IMPLEMENT_GUARDRAILS.md). CI and
branch-protection enforcement are not yet implemented, because they require a
GitHub remote that does not exist yet; do not invent those.

- Node.js: 22, pinned in [`.nvmrc`](../../.nvmrc). Run `nvm use` (or your
  Node version manager's equivalent) before installing dependencies.
- Package manager: pnpm, pinned in the root `package.json`
  `packageManager` field.
- Install dependencies: `pnpm install`.
- Start the web app in development mode: `pnpm dev`.

| Command                   | Responsibility                                               |
| ------------------------- | ------------------------------------------------------------ |
| `pnpm format`             | Write supported files using Prettier                         |
| `pnpm format:check`       | Fail when supported files are not formatted                  |
| `pnpm lint`               | Run ESLint (TypeScript, React, hooks, package boundaries)    |
| `pnpm typecheck`          | Type-check every workspace without emitting output           |
| `pnpm test`               | Run unit and component tests (Vitest + Testing Library)      |
| `pnpm test:e2e`           | Run the Playwright end-to-end suite (starts the dev server)  |
| `pnpm check:architecture` | Check dependency directions, public entry points, and cycles |
| `pnpm check:unused`       | Detect unused files, exports, and dependencies (Knip)        |
| `pnpm build`              | Build the web app for production                             |
| `pnpm check`              | Run every non-E2E check above; safe to run before pushing    |

A pre-commit hook (Husky + lint-staged) formats and lints staged files. A
pre-push hook runs `pnpm check`. Both can be skipped with `--no-verify`, but
CI is not configured yet to catch what a skipped hook would have caught — see
[`IMPLEMENT_GUARDRAILS.md`](../tasks/planned/IMPLEMENT_GUARDRAILS.md) for the
remaining CI and branch-protection work.

Recommended editor extensions and settings are still pending.

## First-change checklist

Before making a first code change:

- confirm the expected behaviour and acceptance criteria;
- identify the package that owns the behaviour;
- inspect the package's public API and existing conventions;
- determine which tests can prove the change;
- keep the proposed change within the requested scope.

Continue with [Adding a feature](./ADDING_A_FEATURE.md) for the implementation
workflow and [Testing](./TESTING.md) for the testing strategy.
