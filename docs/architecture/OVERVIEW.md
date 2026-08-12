# Architecture Overview

## Goal

The project is a Minesweeper application and a learning environment. Its
architecture keeps game rules, state coordination, presentation, and
application composition separate so each concern can be understood and tested
in isolation.

## System structure

```text
mine-sweeper/
├── apps/
│   └── web/
└── packages/
    ├── core/
    ├── game-state/
    ├── ui/
    └── shared/
```

| Workspace             | Responsibility                                                               |
| --------------------- | ---------------------------------------------------------------------------- |
| `apps/web`            | Start the browser application and compose state with UI.                     |
| `packages/core`       | Implement pure Minesweeper rules and domain types.                           |
| `packages/game-state` | Coordinate game state, expose observable snapshots, and provide React hooks. |
| `packages/ui`         | Render presentational React components from props.                           |
| `packages/shared`     | Hold small, domain-independent utilities used by more than one workspace.    |

## Responsibility flow

1. `core` defines and executes the game rules.
2. `game-state` owns the current game session and calls `core` operations.
3. React reads stable snapshots from `game-state` through
   `useSyncExternalStore`.
4. `web` passes snapshot data and actions into `ui` components.
5. `ui` renders the game and reports user intent through callbacks.

## Architectural principles

- Dependencies point toward logic with fewer runtime assumptions.
- Game rules do not depend on React, the DOM, or browser storage.
- State coordination does not duplicate rules already owned by `core`.
- UI components receive data and callbacks instead of locating global state.
- The application layer wires packages together; it does not become a second
  domain layer.
- Cross-package access happens through deliberate public APIs.
- A package is added only when it has a distinct responsibility and a real
  boundary to enforce.

## Out of scope

- Redux or an equivalent state-management framework.
- Business logic inside React components.
- A separate package containing only React adapters for stores.
- Premature abstractions intended for hypothetical future applications.
