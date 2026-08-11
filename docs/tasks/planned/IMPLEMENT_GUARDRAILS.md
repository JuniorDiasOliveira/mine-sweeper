# Implement Repository Guardrails

## Status

Planned.

## Context

This repository is intended to be used by a junior developer with optional AI
assistance. Written conventions are necessary, but they are not sufficient:
violations must produce fast, objective feedback and must not be mergeable into
the protected branch.

The repository does not yet have an initialized workspace toolchain. This task
defines the guardrails that must be implemented when the monorepo is created.
It does not claim that any command or check described below currently exists.

## Goal

Create layered, automated enforcement for code quality, type safety, package
boundaries, tests, and repository hygiene.

The layers must serve different purposes:

| Layer | Purpose | Authority |
| --- | --- | --- |
| Editor | Give immediate feedback while writing code | Advisory |
| Pre-commit | Check changed files quickly | Local feedback |
| Pre-push | Run broader repository checks before upload | Local feedback |
| CI | Verify the repository from a clean installation | Authoritative |
| Branch protection | Prevent merging when CI fails | Authoritative |

Local hooks are not security boundaries because they can be skipped with
`--no-verify`. CI and branch protection are the final enforcement layer.

## In scope

- shared TypeScript configuration with strict safety options;
- ESLint rules for TypeScript, React, hooks, imports, and package boundaries;
- formatting verification;
- dependency-graph validation and cycle detection;
- unused file, export, and dependency detection;
- unit, component, build, and end-to-end validation commands;
- staged-file checks in a pre-commit hook;
- repository checks in a pre-push hook;
- CI executed from a clean dependency installation;
- documentation of every command developers and agents must run;
- branch-protection requirements that make CI blocking.

## Out of scope

- implementing Minesweeper product features;
- choosing product behaviour or game rules;
- deployment of the web application;
- automatic dependency upgrades;
- release automation;
- enforcing subjective conventions that cannot be expressed reliably by a
  tool;
- weakening a check to accommodate code that violates the documented rules.

## Proposed toolchain

The initial implementation should use:

| Concern | Tool |
| --- | --- |
| Package manager | pnpm workspaces |
| Language safety | TypeScript |
| Static analysis | ESLint with flat configuration |
| Formatting | Prettier |
| Package boundaries | ESLint boundary rules and dependency-cruiser |
| Dead code and unused dependencies | Knip |
| Unit and component tests | Vitest and Testing Library |
| End-to-end tests | Playwright |
| Git hooks | Husky |
| Changed-file checks | lint-staged |
| Continuous integration | GitHub Actions |

If a tool must be replaced, the replacement must preserve the acceptance
criteria in this document. A replacement that changes architecture policy or
weakens enforcement requires an explicit documentation update.

## Required repository commands

The root `package.json` must expose stable commands so humans, agents, hooks,
and CI use the same entry points. Exact tool arguments belong in configuration
files, not duplicated across hooks and workflows.

The following command contracts are required:

| Command | Responsibility |
| --- | --- |
| `pnpm format` | Write supported files using the configured formatter |
| `pnpm format:check` | Fail when supported files are not formatted |
| `pnpm lint` | Run all configured static-analysis rules |
| `pnpm typecheck` | Type-check every workspace without emitting output |
| `pnpm test` | Run unit and component tests |
| `pnpm test:e2e` | Run end-to-end tests |
| `pnpm check:architecture` | Check dependency directions, public entry points, and cycles |
| `pnpm check:unused` | Detect unused files, exports, and dependencies |
| `pnpm build` | Build every production workspace |
| `pnpm check` | Run all non-E2E checks required before push |

`pnpm check` must be suitable for local use and must not modify tracked files.
CI may invoke the individual commands to produce clearer failure reporting.

## TypeScript guardrails

All workspaces must extend a shared strict configuration. It must enable at
least:

- `strict`;
- `noUncheckedIndexedAccess`;
- `exactOptionalPropertyTypes`;
- `noImplicitOverride`;
- `noFallthroughCasesInSwitch`;
- `noEmit` for type-check configurations;
- consistent module and module-resolution settings for all workspaces.

Individual workspaces may add settings required by their runtime, but they may
not disable a shared safety option without an approved architectural reason.

## ESLint guardrails

ESLint must check JavaScript, TypeScript, and React source as applicable. The
configuration must enforce at least:

- no ignored TypeScript errors through unsafe `any` usage or suppression
  comments without an explicit, justified exception;
- React Hooks rules;
- consistent type-only imports;
- no unresolved imports;
- no circular module dependencies where the configured graph checker can
  determine them;
- no cross-workspace relative imports;
- no deep imports into another workspace;
- no imports that violate
  [`DEPENDENCY_RULES.md`](../../architecture/DEPENDENCY_RULES.md);
- no debug statements in committed production code;
- no disabling of lint rules without a local explanation.

Generated files, build output, coverage, and dependency directories must be
ignored explicitly. Source directories must not be excluded merely to make the
check pass.

## Architecture enforcement

Automated checks must encode the dependency allowlist rather than relying on
reviewers to remember it.

At minimum, the checks must reject:

- any package importing from `apps/web`;
- `packages/core` importing React, browser APIs, or another domain package;
- `packages/ui` importing `packages/game-state`;
- a cross-workspace import that bypasses the target package's public entry
  point;
- a relative import that escapes its workspace;
- a dependency cycle between workspaces;
- a dependency not present in the allowlist;
- a package using an external dependency that is declared only in another
  workspace.

Architecture fixtures or focused validation tests must demonstrate at least
one accepted and one rejected import for each package boundary. A configuration
that has never been shown to reject an invalid example is not considered
verified.

## Git hooks

### Pre-commit

The pre-commit hook must remain fast and operate only on staged, supported
files. Through `lint-staged`, it must:

- run ESLint with automatic fixes where safe;
- format staged supported files;
- re-stage files modified by those tools;
- fail without creating a commit when an error cannot be fixed.

It must not run the full build or end-to-end suite.

### Pre-push

The pre-push hook must run `pnpm check`. It should catch repository-wide type,
lint, architecture, unused-code, unit-test, and build failures before code is
pushed.

End-to-end tests may remain CI-only if their local runtime makes the pre-push
feedback unreasonably slow. That choice must be recorded in the testing guide.

Hooks must call root package scripts. They must not contain separate copies of
the underlying tool commands.

## CI workflow

GitHub Actions must run for pull requests and pushes to the protected default
branch. The workflow must:

1. check out the repository;
2. install the pinned Node.js and pnpm versions;
3. restore only safe dependency or tool caches;
4. install with the frozen lockfile;
5. run formatting, lint, type checking, architecture, unused-code, tests, and
   production build;
6. run end-to-end tests in an appropriate job;
7. upload useful failure artifacts, such as Playwright reports, without
   exposing secrets;
8. fail when any required check fails.

Independent checks should use separate jobs when that materially improves
failure visibility or execution time. CI must not automatically rewrite or
commit source files.

The repository settings must require the CI checks before merging and must
prevent direct pushes to the protected default branch for contributors covered
by the project workflow.

## Implementation order

1. Initialize pnpm workspaces and pin supported Node.js and pnpm versions.
2. Add the shared TypeScript configuration and workspace type-check commands.
3. Configure Prettier and its root commands.
4. Configure ESLint, including React and import rules.
5. Encode the dependency allowlist and cycle checks.
6. Configure unit and component testing.
7. Configure unused-code and dependency checks.
8. Add the production build command.
9. Add Husky and lint-staged, then verify both hooks from a real Git repository.
10. Configure Playwright and a minimal end-to-end smoke test.
11. Add GitHub Actions using the same root commands.
12. Enable the required branch-protection checks.
13. Replace the provisional wording in the development and agent guides with
    the commands that were actually implemented.

Each step should be committed only when its configuration can be demonstrated
to pass and, where relevant, demonstrated to fail on a controlled violation.

## Expected files

The exact filenames may change when required by a selected tool, but the
implementation is expected to include equivalents of:

```text
.github/workflows/ci.yml
.husky/pre-commit
.husky/pre-push
configs/typescript/
dependency-cruiser.config.*
eslint.config.*
package.json
pnpm-lock.yaml
pnpm-workspace.yaml
prettier.config.*
tsconfig.json
```

Tool configuration shared by workspaces should live in `configs/` when it is a
real reusable configuration package or preset. Root-only configuration should
remain at the repository root.

## Acceptance criteria

- A clean checkout can install dependencies with a frozen lockfile.
- Every required root command exists and is documented.
- `pnpm check` passes on a valid repository without modifying tracked files.
- Pre-commit checks only staged supported files and blocks a known lint or
  formatting violation.
- Pre-push runs the complete non-E2E validation contract and blocks a known
  repository-wide violation.
- CI runs on pull requests and the default branch from a clean installation.
- CI includes formatting, lint, types, architecture, unused code, tests, build,
  and end-to-end coverage.
- A forbidden `ui -> game-state` import is rejected automatically.
- A deep import into another workspace is rejected automatically.
- A workspace dependency cycle is rejected automatically.
- A TypeScript strictness violation is rejected automatically.
- A failing unit test and a failing end-to-end test each fail their respective
  CI job.
- Required CI checks are configured as merge requirements on the protected
  branch.
- Documentation contains only commands that exist and were executed
  successfully during validation.

## Validation evidence

The implementation report must record:

- the Node.js and pnpm versions used;
- every root validation command executed and its result;
- controlled violations used to prove lint, type, architecture, hook, and CI
  enforcement;
- confirmation that hooks were exercised from an initialized Git repository;
- the CI run or pull request in which all required jobs passed;
- any check that could not be run and the remaining risk.

Do not report this task as completed based only on configuration files being
present.

## Documentation updates on completion

When this task is complete:

- add the real setup and validation commands to
  [`GETTING_STARTED.md`](../../development/GETTING_STARTED.md);
- add the real test commands and E2E policy to
  [`TESTING.md`](../../development/TESTING.md);
- replace provisional command wording in the agent guides;
- update the enforcement section in
  [`DEPENDENCY_RULES.md`](../../architecture/DEPENDENCY_RULES.md);
- move this document to `docs/tasks/completed/` without rewriting its history.

## Remaining decisions

Confirmed by the repository owner on 2026-08-12:

- Node.js version: 22, pinned via `.nvmrc` in
  [`IMPLEMENT_WORKSPACE_FOUNDATION.md`](./IMPLEMENT_WORKSPACE_FOUNDATION.md).
- Default branch name: `main`.
- End-to-end tests run in CI only. The pre-push hook stays limited to the
  non-E2E `pnpm check` contract defined above; `pnpm test:e2e` is not part of
  pre-push.

Still open, blocking the CI workflow and branch-protection sections of this
task:

- GitHub is not yet the repository host; no remote is configured. The CI
  workflow (`.github/workflows/ci.yml`) and branch-protection requirements
  cannot be implemented or validated until a GitHub repository exists and a
  remote is set. Treat those parts of this task as deferred, not skipped.
- Branch protection is configured in the GitHub repository itself (Settings →
  Branches → Branch protection rules, or
  `gh api repos/{owner}/{repo}/branches/{branch}/protection`) and requires
  admin access to that repository. Who performs this step is undecided until
  the repository exists.
