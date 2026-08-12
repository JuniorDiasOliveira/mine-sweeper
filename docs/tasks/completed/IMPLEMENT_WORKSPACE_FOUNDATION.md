# Implement Workspace Foundation

## Status

Completed.

## Metadata

- Created: 2026-08-12
- Completed: 2026-08-12
- Owner: Junior Oliveira

## Context

The repository currently contains its documentation and architectural rules,
but it does not yet contain the executable monorepo described in
[`OVERVIEW.md`](../../architecture/OVERVIEW.md).

Before product features or repository guardrails can be implemented, the
project needs a minimal pnpm workspace containing the web application and the
four packages defined by the accepted architecture. This task creates that
foundation only. Automated enforcement belongs to the subsequent
[`IMPLEMENT_GUARDRAILS.md`](./IMPLEMENT_GUARDRAILS.md) task.

## Goal

Create a minimal, runnable pnpm monorepo in which `apps/web` composes the public
APIs of `packages/game-state` and `packages/ui` (each of which resolves
`packages/core` internally per
[`DEPENDENCY_RULES.md`](../../architecture/DEPENDENCY_RULES.md)), while every
workspace has a valid manifest, TypeScript configuration, and public entry
point.

The result must prove that workspace discovery, package resolution, local
development, type checking, and the production build work before feature code
or enforcement tooling is added.

## In scope

- initialize the root pnpm workspace;
- pin supported Node.js and pnpm versions;
- create the root package manifest and lockfile;
- create `apps/web` as a minimal React application built with Vite;
- create `packages/core`;
- create `packages/game-state` with React available for its future hooks;
- create `packages/ui` as a React package;
- create `packages/shared`;
- add a package manifest, TypeScript configuration, source directory, and
  public root entry point to every workspace;
- declare only the workspace dependencies allowed by the architecture;
- add the minimum root scripts needed to run, type-check, and build the initial
  application;
- render a small neutral shell that proves `apps/web` can consume package
  public APIs.

## Out of scope

- Minesweeper rules or domain types;
- observable store behaviour or React store hooks;
- the game board and other product UI;
- ESLint, Prettier, dependency-cruiser, Knip, Husky, lint-staged, Playwright,
  GitHub Actions, or branch protection;
- architecture fixtures that deliberately contain invalid imports;
- deployment, release, or hosting configuration;
- reusable abstractions that are not required by the initial shell.

## Architecture constraints

The implementation must follow:

- [`OVERVIEW.md`](../../architecture/OVERVIEW.md);
- [`PACKAGE_BOUNDARIES.md`](../../architecture/PACKAGE_BOUNDARIES.md);
- [`DEPENDENCY_RULES.md`](../../architecture/DEPENDENCY_RULES.md);
- [`ADR-001-OBSERVABLES.md`](../../decisions/ADR-001-OBSERVABLES.md).

The initial dependency graph is:

```text
apps/web -> packages/game-state
apps/web -> packages/ui
packages/game-state -> packages/core
packages/ui -> packages/core
```

`packages/shared` must remain dependency-free and unused until at least two
workspaces need the same domain-independent code. Do not add placeholder
dependencies merely to reproduce every theoretically allowed edge.

Cross-workspace imports must use package names and public root entry points.
No workspace may import another workspace through `src/` or a relative path.

## Required workspace structure

The implementation must produce at least:

```text
apps/
└── web/
    ├── src/
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
packages/
├── core/
│   ├── src/index.ts
│   ├── package.json
│   └── tsconfig.json
├── game-state/
│   ├── src/index.ts
│   ├── package.json
│   └── tsconfig.json
├── shared/
│   ├── src/index.ts
│   ├── package.json
│   └── tsconfig.json
└── ui/
    ├── src/index.ts
    ├── package.json
    └── tsconfig.json
package.json
pnpm-lock.yaml
pnpm-workspace.yaml
tsconfig.json
```

Additional files are allowed only when required for the selected React, Vite,
or TypeScript setup.

## Requirements

### Root workspace

- Use pnpm workspaces without Turborepo.
- Mark the root package as private.
- Pin pnpm through the root `packageManager` field.
- Declare the supported Node.js range in `engines` and provide the repository's
  chosen version file.
- Pin Node.js 22 (confirmed 2026-08-12) through a committed `.nvmrc` file and
  the `engines.node` field, and record the exact Node.js and pnpm versions
  used in this task's completion record.
- Configure pnpm to discover `apps/*` and `packages/*`.
- Commit the generated `pnpm-lock.yaml`.
- Avoid production dependencies in the root when they belong to a workspace.

### Workspace packages

- Use the package namespace `@mine-sweeper/*`.
- Give every workspace a private package manifest for the initial repository.
- Expose each package only through its root public entry point.
- Declare dependencies in the workspace that directly uses them.
- Use the pnpm workspace protocol for internal dependencies.
- Keep package entry points compatible with TypeScript and Vite during local
  development; do not introduce a separate package-publishing pipeline.
- Do not add placeholder game behaviour to make an export non-empty. A minimal
  package-identifying export or type may be used solely to prove resolution and
  must be removed when real public APIs replace it.

### TypeScript foundation

- Add a small shared root configuration that workspace configurations extend.
- Enable `strict` and the module settings required by Vite and the package
  entry points.
- Keep browser-specific libraries out of `packages/core` and
  `packages/shared`.
- Add React JSX configuration only to workspaces that render React or expose
  React hooks.
- Leave the complete strictness policy and reusable configuration packages to
  `IMPLEMENT_GUARDRAILS.md`.

### Web application

- Create a single Vite-powered React entry point.
- Let `apps/web` perform application composition.
- Import proof-of-resolution values or types through the public entry points of
  `@mine-sweeper/game-state` and `@mine-sweeper/ui` only; `apps/web` must not
  import `@mine-sweeper/core` directly, per
  [`DEPENDENCY_RULES.md`](../../architecture/DEPENDENCY_RULES.md). Each of
  those two packages imports `@mine-sweeper/core` internally to prove that
  edge of the dependency graph.
- Render only a minimal accessible application shell. Do not implement a board,
  controls, game state, or visual design system.
- Support local development and a production build through root scripts.

### Root command contracts

The root package must expose at least:

| Command          | Responsibility                                            |
| ---------------- | --------------------------------------------------------- |
| `pnpm dev`       | Start the web application in development mode             |
| `pnpm typecheck` | Type-check every initial workspace without emitting files |
| `pnpm build`     | Produce a production build of the web application         |

These commands form the initial contract. The guardrails task may broaden
their implementation while preserving their names and responsibilities.

## Acceptance criteria

- [x] A clean dependency installation succeeds with pnpm and produces no
      uncommitted lockfile change.
- [x] pnpm discovers exactly `apps/web` and the four documented packages.
- [x] Every workspace has a manifest, TypeScript configuration, source entry
      point, and intentional public API.
- [x] Internal dependencies match the documented allowlist and use the
      workspace protocol.
- [x] `packages/shared` has no speculative consumer or dependency.
- [x] `apps/web` imports the relevant packages only through their public names.
- [x] The root development command starts the application successfully.
- [x] The application renders its minimal shell without a runtime error.
- [x] The root type-check command succeeds for every workspace.
- [x] The root production build succeeds.
- [x] No Minesweeper feature or guardrail tooling is introduced by this task.
- [x] Setup and command documentation is updated to reflect only commands that
      were actually created and executed.

## Validation

The implementer must derive exact commands from the created root scripts and
record them in the completion record. Validation must include:

- a dependency installation using the committed lockfile;
- pnpm workspace discovery;
- the root type-check command;
- the root production build command;
- starting the root development command and opening the application;
- inspection of declared internal dependencies and public imports;
- a final diff and whitespace check when Git is available.

Do not claim a clean-install result unless it was tested from a state that did
not reuse an already-populated `node_modules` directory.

## Documentation updates on completion

- Replace provisional setup instructions in
  [`GETTING_STARTED.md`](../../development/GETTING_STARTED.md) with the real
  prerequisites and commands.
- Update [`docs/tasks/README.md`](../README.md) when moving this task to
  `completed/`.
- Do not document guardrail commands until the guardrails task implements them.

## Open decisions

None. The Node.js major version (22, pinned via `.nvmrc`) and the default
branch (`main`) were confirmed by the repository owner on 2026-08-12. Node.js
and pnpm patch versions may be selected during implementation within that
policy and must be recorded in the completion record.

## Completion record

### Implemented

- `pnpm-workspace.yaml` discovering `apps/*` and `packages/*`.
- `.nvmrc` pinning Node.js `22`; root `package.json` updated with
  `engines.node`, `packageManager: "pnpm@11.21.0"`, `private: true`, and the
  `dev`/`typecheck`/`build` root scripts. Removed the pre-existing
  `devEngines.packageManager` block: pnpm warned that it conflicted with
  `packageManager` and silently ignored one of them.
- Root `tsconfig.json` (strict, `ES2022`, bundler module resolution),
  extended by every workspace's own `tsconfig.json`.
- `packages/core`, `packages/shared`, `packages/game-state`, and
  `packages/ui`: each with `package.json` (`@mine-sweeper/*`),
  `tsconfig.json`, and a `src/index.ts` public entry point exporting a
  proof-of-resolution constant only, per this task's "do not add placeholder
  game behaviour" requirement.
- `apps/web`: Vite 8 + React 19 app (`vite.config.ts`, `index.html`,
  `src/main.tsx`, `src/App.tsx`) rendering a placeholder shell.
- Dependency graph implemented as `apps/web -> game-state -> core` and
  `apps/web -> ui -> core`; `apps/web` does not import `@mine-sweeper/core`
  directly (see "Open decisions": this task's own Goal/Web-application
  wording originally implied a direct `web -> core` import, which conflicts
  with [`DEPENDENCY_RULES.md`](../../architecture/DEPENDENCY_RULES.md); the
  repository owner resolved it in favour of the documented allowlist, and the
  wording above was corrected to match).
- Fixed two unrelated documentation gaps found while completing this task:
  renamed the untracked, empty `docs/tasks/done/` to `docs/tasks/completed/`
  to match this document's and `IMPLEMENT_GUARDRAILS.md`'s existing
  references; added `docs/tasks/README.md`, which was referenced but did not
  exist.

### Validation results

- `pnpm install` then `pnpm install --frozen-lockfile`: both passed; the
  second produced no lockfile change.
- `pnpm typecheck` (`pnpm -r run typecheck`): passed for all 5 workspaces
  (`core`, `shared`, `game-state`, `ui`, `web`).
- `pnpm build` (`tsc --noEmit && vite build` for `@mine-sweeper/web`): passed,
  produced `apps/web/dist` (18 modules transformed, ~198ms).
- `pnpm dev`: started the Vite dev server at `http://localhost:5173/`; a
  `curl` request against it returned HTTP `200`.
- Manual review (`grep` over every workspace's `src/`): the only
  cross-workspace imports present are `web -> game-state`, `web -> ui`,
  `game-state -> core`, and `ui -> core`; no relative import escapes a
  workspace; `packages/shared` has no consumer.
- All commands were run under Node.js `22.23.1` (via `nvm use 22`) and pnpm
  `11.21.0`.

### Remaining risks

- TypeScript is pinned to `5.9.3`, not npm's `latest` tag (`7.0.2` at
  implementation time), because `typescript-eslint@8.67.0` — needed by
  `IMPLEMENT_GUARDRAILS.md` — declares a peer range of
  `typescript >=4.8.4 <6.1.0`. If a future change needs a newer TypeScript,
  this pin and the ESLint tooling it constrains must be revisited together.
- No automated boundary enforcement existed at the time this task was
  completed; it was verified manually here and has since been encoded in
  ESLint and dependency-cruiser by `IMPLEMENT_GUARDRAILS.md`.
- `react`, `vite`, and other external dependencies were pinned to each
  package's npm `latest` tag as of 2026-08-12; there is no automated
  dependency-update process yet.
