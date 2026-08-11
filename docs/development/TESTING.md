# Testing

## Purpose

Define the testing strategy and the expected coverage for each project layer.

Tests must verify observable behaviour at the narrowest layer that owns it.
They must not depend on implementation details merely to increase coverage.

## Testing by layer

### `packages/core`

Use unit tests for pure game rules, including:

- board creation and mine placement;
- neighbouring-mine counts;
- revealing empty, numbered, and mined cells;
- propagation when an empty cell is revealed;
- placing and removing flags;
- invalid or ignored actions;
- win and loss evaluation;
- boundary cases such as corners and edges.

Randomness must be controlled so tests remain deterministic. Prefer injecting a
seeded or fixed source of randomness instead of asserting against unpredictable
boards.

### `packages/game-state`

Test the store without rendering React whenever the behaviour belongs to the
store. Verify:

- the initial snapshot;
- action results;
- notification of subscribers after a real change;
- no notification for ignored actions when the snapshot does not change;
- stable snapshot identity between changes;
- new snapshot identity after a change;
- unsubscribe behaviour;
- command delegation to `core` rather than duplicated game rules.

Test the React hook separately only for integration behaviour required by
`useSyncExternalStore`.

### `packages/ui`

Use component tests for behaviour visible to a user:

- rendered values and states;
- accessible names, roles, and interaction semantics;
- callbacks emitted by clicks or keyboard interaction;
- disabled, hidden, loading, or terminal states when applicable.

UI tests must pass values and callbacks through props. They must not create or
reach into the game store.

### `apps/web`

Use integration or end-to-end tests for behaviour created by composing
packages, including essential flows such as:

- starting a game;
- revealing a cell;
- placing and removing a flag;
- winning a game;
- losing by revealing a mine;
- starting a new game after a terminal state.

Do not duplicate every `core` edge case at this level.

## Regression tests

A reproducible defect fix must include a test that fails before the fix and
passes after it. Place the test in the layer that owns the faulty behaviour.

## Test quality rules

- Each test must have a clear reason to exist.
- Tests must be independent and repeatable.
- Tests must not depend on execution order, real time, or uncontrolled
  randomness.
- Prefer public APIs and user-visible behaviour over internal implementation
  details.
- Avoid snapshots that obscure the behaviour being verified.
- A test must not be weakened or removed only to make a change pass.

## Required commands

The test runner and commands have not been configured yet. Add the exact local
and CI commands here only after they exist in the repository. Until then, a
change must report which narrower checks were performed and which verification
remains unavailable.
