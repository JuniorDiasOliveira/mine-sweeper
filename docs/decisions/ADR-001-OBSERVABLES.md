# ADR-001: Observable State

- Status: Accepted
- Date: 2026-08-11

## Context

The application needs a single authoritative source for mutable game-session
state, including the board, revealed cells, flags, game status, and elapsed
session information.

The state-management approach
must expose the important mechanics instead of hiding them behind a large
framework. It must also keep Minesweeper rules independent from React and make
architectural boundaries enforceable.

React requires a safe subscription contract when consuming state held outside
its own state system. The chosen approach must behave correctly with concurrent
rendering and must avoid duplicated state between the store and components.

## Decision

Game-session state will be managed by an observable store in
`packages/game-state`. React will consume the store through
`useSyncExternalStore`.

The store and its React hook will live in the same package. A separate package
for a thin React adapter would add a boundary without providing meaningful
independence in this project.

The minimum observable contract is:

```ts
export interface ObservableStore<TSnapshot> {
  getSnapshot(): TSnapshot;
  subscribe(listener: () => void): () => void;
}
```

The store may expose commands that represent user intent, such as revealing a
cell or toggling a flag. It delegates game rules to `packages/core`, publishes
immutable snapshots, and notifies subscribers after a completed transition.

`apps/web` owns the store instance and connects it to presentational components
from `packages/ui`. The UI package does not import or subscribe to the store.

React-local state remains allowed for temporary visual concerns that are not
part of the game session, such as whether a popover is open.

Redux and equivalent state-management frameworks are outside the accepted
architecture.

## Decision drivers

- Keep game rules testable without React.
- Teach the subscription and snapshot model explicitly.
- Use React's supported API for external stores.
- Prevent UI components from becoming coupled to application state.
- Avoid a framework whose abstractions are disproportionate to this project.
- Keep the number of packages and indirection layers justified by real
  responsibilities.

## Alternatives considered

### React component state

Keeping the entire game in `useState` or `useReducer` would reduce initial
setup, but it would couple application state to the component tree and make the
separation between state orchestration and presentation less explicit.

### React Context as the state container

Context can distribute a value, but it does not define the state model or
subscription semantics on its own. Using it as the authoritative store would
also encourage state access directly from UI components.

### Redux or a similar framework

These tools provide mature conventions and developer tooling. They were not
selected because the project is intentionally small and should teach the core
mechanics of external state instead of a framework-specific API.

### Separate store and React-adapter packages

This would make the framework boundary more explicit, but the adapter would be
too small to justify its own package. Store implementation and React
integration therefore remain together in `packages/game-state`.

## Consequences

- Game rules remain independent from both the store and React.
- Store behavior can be tested without rendering components.
- UI components remain presentational and receive data and callbacks through
  props.
- Snapshot identity, immutability, subscription cleanup, and notification order
  become correctness requirements owned by `game-state`.
- The team must implement and maintain a small amount of store infrastructure.
- Developers must understand when state belongs to the game store and when
  local React state is appropriate.
- The dependency rules must prevent `packages/ui` from importing
  `packages/game-state`.
- Replacing this approach with another state architecture requires a new ADR
  that supersedes this one.

## Related documentation

- [State Management](../architecture/STATE_MANAGEMENT.md)
- [Package Boundaries](../architecture/PACKAGE_BOUNDARIES.md)
- [Dependency Rules](../architecture/DEPENDENCY_RULES.md)
