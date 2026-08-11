# Coding Rules

## Scope

These rules apply to code, tests, configuration, scripts, and generated files.
More specific package documentation may add rules but may not weaken these
ones.

## Architecture

- Put each change in the workspace that owns the responsibility.
- Keep Minesweeper rules in `packages/core` and independent from React, the
  DOM, browser storage, and network access.
- Keep observable game-session state and its React hooks in
  `packages/game-state`.
- Keep `packages/ui` presentational: it receives values and callbacks and must
  not import, subscribe to, or mutate the game store.
- Let `apps/web` create the store and compose state with UI.
- Add code to `packages/shared` only when it is domain-independent and already
  needed by at least two workspaces.
- Follow the dependency allowlist in
  [`DEPENDENCY_RULES.md`](../architecture/DEPENDENCY_RULES.md).

## Imports and public APIs

- Import another workspace only through its public package entry point.
- Do not use cross-package deep imports.
- Do not use relative paths that escape the current workspace.
- Do not introduce circular dependencies.
- Type-only imports follow the same boundary rules as runtime imports.
- Do not expand a public API solely to let another package reach an internal
  implementation detail.

## State and React

- Treat snapshots exposed by a store as immutable.
- Keep the same snapshot reference until observable state changes.
- Publish the new snapshot before notifying subscribers.
- Ensure every subscription returns a working cleanup function.
- Preserve method context when passing store functions to
  `useSyncExternalStore`.
- Keep authoritative game state in the store; use local React state only for
  temporary presentation concerns.
- Do not duplicate Minesweeper rules in stores, hooks, components, or selectors.
- Do not use React Context as a second state store.

## TypeScript and implementation quality

- Follow the configured TypeScript, linting, formatting, and testing rules.
- Do not bypass checks or weaken rules to make a change pass.
- Prefer explicit domain names over generic abstractions.
- Keep functions and modules focused on one responsibility.
- Handle invalid or impossible inputs deliberately; do not hide failures.
- Avoid unsafe type assertions. When one is unavoidable, keep it narrow and
  explain why runtime behaviour makes it safe.
- Do not leave commented-out code, debugging output, or unexplained
  placeholders.

## Tests

- Test observable behaviour through public behaviour, not private internals.
- Add a regression test when fixing a reproducible defect.
- Keep `core` tests independent from React.
- Verify store snapshot identity, notification order, and unsubscribe behaviour
  where those contracts are affected.
- Test UI through rendered behaviour and user interaction rather than
  implementation details.
- Do not weaken, skip, or delete a test merely to obtain a passing result.

## Dependencies and scope

- Use the platform or an existing dependency before adding a new dependency.
- Add a dependency only to the workspace that uses it.
- Do not introduce Redux or an equivalent state-management framework.
- Do not invent requirements that are absent from the task or documentation.
- Do not perform unrelated refactors while implementing a focused task.

Exact tool commands will be added when the workspace tooling is configured.
