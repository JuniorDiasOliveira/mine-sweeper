# Repository Instructions for Agents

## Purpose

This file is the entry point for AI agents working in this repository. Agents
may assist with implementation, but they must follow the same architecture,
quality requirements, and review standards as human contributors.

## Required reading

Before changing files, read:

1. The current task and its acceptance criteria.
2. [`docs/agent/WORKFLOW.md`](./docs/agent/WORKFLOW.md).
3. [`docs/agent/CODING_RULES.md`](./docs/agent/CODING_RULES.md).
4. [`docs/agent/DEFINITION_OF_DONE.md`](./docs/agent/DEFINITION_OF_DONE.md).
5. The architecture documents relevant to the change.
6. Any accepted ADRs and task documents relevant to the change.

Start with [`docs/README.md`](./docs/README.md) when the relevant document is
not known.

## Order of authority

When instructions conflict, follow this order:

1. The current task and its explicit acceptance criteria.
2. Accepted records in [`docs/decisions`](./docs/decisions/README.md).
3. Architecture rules in [`docs/architecture`](./docs/architecture/README.md).
4. Agent instructions in [`docs/agent`](./docs/agent/README.md).
5. Development guides in [`docs/development`](./docs/development/README.md).
6. Existing implementation patterns.

Existing code is evidence of the current implementation, not proof that a
pattern is correct. Stop and report a conflict instead of silently overriding
a higher-authority instruction.

## Non-negotiable architecture

- Keep pure Minesweeper rules in `packages/core`.
- Keep observable game state and its React hooks in `packages/game-state`.
- Keep `packages/ui` presentational and independent from the game store.
- Let `apps/web` create the store and compose state with UI.
- Add code to `packages/shared` only when it is domain-independent and already
  needed by at least two workspaces.
- Use observables with `useSyncExternalStore`; do not introduce Redux or an
  equivalent state-management framework.
- Import other workspaces only through their public package entry points.
- Follow the dependency allowlist in
  [`docs/architecture/DEPENDENCY_RULES.md`](./docs/architecture/DEPENDENCY_RULES.md).

## Working rules

- Inspect the affected files and preserve unrelated changes before editing.
- Make the smallest complete change that satisfies the task.
- Do not invent product behaviour, architecture, contracts, or tooling policy.
- Ask for clarification when a missing decision could materially change the
  implementation.
- Do not bypass or weaken types, lint rules, tests, hooks, or architecture
  checks to make a change pass.
- Add or update tests for changed behaviour at the layer that owns it.
- Update documentation when a public contract, decision, boundary, or workflow
  changes.
- Do not claim that a check passed unless it was executed successfully.

## Validation and completion

Run every configured check applicable to the change. The repository commands
are documented in
[`docs/development/GETTING_STARTED.md`](./docs/development/GETTING_STARTED.md);
do not invent commands that do not exist there. `pnpm check` runs every
non-E2E check and is safe to run before pushing; CI is not configured yet
(see
[`docs/tasks/planned/IMPLEMENT_GUARDRAILS.md`](./docs/tasks/planned/IMPLEMENT_GUARDRAILS.md)).

Before reporting completion, apply
[`docs/agent/DEFINITION_OF_DONE.md`](./docs/agent/DEFINITION_OF_DONE.md). Report
what changed, which checks ran, which checks could not run, and any remaining
risk or unresolved decision.
