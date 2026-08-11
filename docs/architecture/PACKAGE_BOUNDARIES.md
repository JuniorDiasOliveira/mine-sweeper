# Package Boundaries

## Purpose

Define where code belongs and prevent responsibilities from leaking across
workspace boundaries.

## `apps/web`

Owns:

- the browser entry point;
- application-level providers and initialization;
- creation and lifetime of the game store;
- composition of `game-state` with `ui`;
- application-only styles and configuration.

Must not own:

- Minesweeper rules;
- reusable UI primitives;
- a duplicate representation of game state.

## `packages/core`

Owns:

- board and cell domain types;
- board creation;
- mine placement rules;
- cell reveal and flag rules;
- neighbouring-mine calculations;
- win and loss evaluation.

Must remain deterministic and independent from React, DOM APIs, browser
storage, network access, and application rendering.

## `packages/game-state`

Owns:

- the observable store contract and implementation;
- immutable snapshots exposed to consumers;
- commands that coordinate `core` operations;
- subscription and notification behaviour;
- React hooks based on `useSyncExternalStore`.

It may coordinate domain operations, but it must not reimplement game rules.
React-specific exports belong here because they directly adapt this store; a
separate adapter package is unnecessary for the current project.

## `packages/ui`

Owns:

- visual components;
- layout and presentation styles;
- accessible interaction elements;
- display-only UI state local to a component when appropriate.

Components receive values and callbacks through props. This package must not
create, import, subscribe to, or mutate the game store directly. It must not
contain Minesweeper rule calculations.

## `packages/shared`

Owns only code that is:

- independent from the Minesweeper domain;
- useful in at least two workspaces;
- too general to have a clearer existing owner.

Code must not be placed here merely because its owner is unclear. A utility
used by one workspace remains in that workspace until sharing is real.

## Public APIs

Every package exposes its supported cross-package API from its root entry
point. Consumers must import from the package name, not from internal source
paths.

```ts
// Allowed
import { createGame } from '@mine-sweeper/core';

// Forbidden
import { createGame } from '@mine-sweeper/core/src/game/create-game';
```

An export is not made public only to bypass a boundary. If a consumer needs an
internal detail, first decide whether that detail belongs to the consumer, the
provider's public contract, or a new explicit abstraction.
