# State Management

## Purpose

Document how application state is represented, changed, observed, and consumed by React.

## Decision

Game session state is managed by an observable store in `packages/game-state`.
React consumes that store through `useSyncExternalStore`. Redux and equivalent
state-management frameworks are outside the project architecture.

## Store contract

The store must offer the semantics represented by this minimal contract:

```ts
export interface ObservableStore<TSnapshot> {
  getSnapshot(): TSnapshot;
  subscribe(listener: () => void): () => void;
}
```

The concrete store may expose domain commands such as starting a game,
revealing a cell, or toggling a flag. Components must not mutate snapshot data
directly.

## Snapshot rules

- `getSnapshot()` returns the same object reference while observable state has
  not changed.
- A state change creates a new snapshot reference before subscribers are
  notified.
- Snapshots are treated as immutable by all consumers.
- Snapshot data contains the information needed to render; components should
  not derive Minesweeper rules from it.
- Repeated calls to `getSnapshot()` must not themselves change state.

These rules are required for correct `useSyncExternalStore` behaviour and to
avoid unnecessary render loops.

## Subscription rules

- `subscribe(listener)` registers the listener and returns an unsubscribe
  function.
- Unsubscribing is safe and prevents future notifications to that listener.
- One completed logical state transition produces one notification cycle.
- Subscriptions do not contain React-specific behaviour.
- Methods passed to `useSyncExternalStore` must preserve their required
  context; store methods should not accidentally lose `this` binding.

## React integration

The React hook belongs in `packages/game-state` next to the store it adapts:

```ts
export function useGameStore(store: GameStore): GameSnapshot {
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  );
}
```

The final implementation may provide an explicit server snapshot function if
server rendering requires a different value.

`apps/web` owns the store instance and uses the hook. It then passes snapshot
values and command callbacks to `packages/ui`.

## Update lifecycle

1. A UI event reports user intent through a callback.
2. `apps/web` delegates that intent to a store command.
3. The store invokes rules from `packages/core`.
4. The store creates and publishes a new snapshot.
5. Subscribers are notified.
6. React reads the snapshot again and renders the affected UI.

## Local component state

Temporary presentation state that has no meaning outside one component may use
React state. Examples include whether a local popover is open or which element
currently has visual focus.

Game state, game status, board contents, flags, and revealed cells belong to
the game store, not to local component state.

## Forbidden patterns

- Mutable snapshot objects.
- Calling subscribers before the new snapshot is available.
- Importing the game store from `packages/ui`.
- Reimplementing `core` rules in store commands or selectors.
- Using React Context as a second state store.
- Storing the same authoritative game value in multiple places.
