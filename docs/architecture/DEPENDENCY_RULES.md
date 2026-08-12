# Dependency Rules

## Purpose

Define and enforce the allowed dependency direction between applications and packages.

## Allowed workspace dependencies

| Consumer              | May depend on                                                              |
| --------------------- | -------------------------------------------------------------------------- |
| `apps/web`            | `packages/game-state`, `packages/ui`, and their public contracts           |
| `packages/game-state` | `packages/core`; `packages/shared` when justified                          |
| `packages/ui`         | public domain types from `packages/core`; `packages/shared` when justified |
| `packages/core`       | `packages/shared` when justified                                           |
| `packages/shared`     | external dependencies that preserve its domain-independent role            |

The table is an allowlist. A dependency not described here is forbidden until
the architecture documentation is intentionally changed.

## Global rules

- A package must never import from `apps/web`.
- `packages/core` must not import React or browser-specific APIs.
- `packages/ui` must not import `packages/game-state`.
- Cross-package imports must use public package entry points.
- Relative imports must not escape the current workspace.
- Circular dependencies are forbidden between workspaces and between modules.
- Type-only dependencies follow the same boundary rules as runtime imports.
- Tests may not bypass boundaries to make production internals convenient to
  access. Test through public behaviour or keep the test inside the owner
  package.

## Examples

```ts
// Allowed: state coordinates domain logic.
import { revealCell } from '@mine-sweeper/core';

// Allowed: UI consumes an intentionally public domain type.
import type { CellView } from '@mine-sweeper/core';

// Forbidden: UI reaches into the state layer.
import { gameStore } from '@mine-sweeper/game-state';

// Forbidden: deep import bypasses the public API.
import { revealCell } from '@mine-sweeper/core/src/board/reveal-cell';
```

## External dependencies

Before adding a dependency:

1. Confirm the platform or an existing dependency does not already provide the
   required capability.
2. Add it to the workspace that directly uses it, not automatically to the
   monorepo root.
3. Avoid exposing third-party types through a package's public API unless that
   coupling is intentional.
4. Document dependencies that materially change the architecture in an ADR.

## Enforcement

These boundaries are checked automatically by `pnpm lint` (ESLint
`no-restricted-imports`, in [`eslint.config.js`](../../eslint.config.js)) and
`pnpm check:architecture` (dependency-cruiser, in
[`dependency-cruiser.config.mjs`](../../dependency-cruiser.config.mjs)), both
added by [`IMPLEMENT_GUARDRAILS.md`](../tasks/planned/IMPLEMENT_GUARDRAILS.md).
The pre-commit hook runs ESLint on staged files; the pre-push hook runs
`pnpm check`, which includes both checks.

Local hooks can be skipped with `--no-verify`, so they provide early feedback,
not the authoritative check. CI is meant to be that authoritative layer, but
it is not configured yet: there is no GitHub remote for it to run against.
Until CI exists, code review must still apply this document manually — a
passing local check does not guarantee the same check ran before merge.
