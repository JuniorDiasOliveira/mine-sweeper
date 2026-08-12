# Adding a Feature

## Purpose

Describe the expected workflow for implementing a feature without breaking package boundaries.

## 1. Define the behaviour

Before editing code, write down:

- the user-visible or domain behaviour being added;
- explicit acceptance criteria;
- relevant edge cases;
- behaviour that is intentionally outside the task.

If a material requirement is ambiguous, stop and request a decision. Do not
choose product behaviour merely to unblock implementation.

## 2. Find the owner

Assign every part of the change to the package that owns that responsibility:

| Change                                                        | Owner                 |
| ------------------------------------------------------------- | --------------------- |
| Minesweeper rules or domain types                             | `packages/core`       |
| Observable state, commands, snapshots, or React store hooks   | `packages/game-state` |
| Presentational components and styles                          | `packages/ui`         |
| Application composition and store lifetime                    | `apps/web`            |
| Proven domain-independent utility used by multiple workspaces | `packages/shared`     |

A feature may require changes in more than one package. That does not permit a
responsibility to be implemented in the wrong package.

## 3. Check dependency direction

Plan the required imports before implementation. Cross-package consumers must
use public package entry points. Do not:

- import internal source paths from another package;
- add a reverse dependency to access a convenient helper;
- make an internal symbol public solely to bypass a boundary;
- move uncertain code into `shared` without a demonstrated shared use.

If the intended design conflicts with the documented dependency rules, propose
an architecture decision before implementing it.

## 4. Plan the smallest complete change

Identify:

- files that need to change;
- public contracts that need to be added or modified;
- tests required at each affected layer;
- documentation affected by the feature.

Avoid unrelated refactors, speculative abstractions, and dependencies that are
not necessary for the acceptance criteria.

## 5. Implement from the inside out

When several layers are involved, use this order where practical:

1. implement or extend pure rules in `core`;
2. expose state and commands through `game-state`;
3. build presentational behaviour in `ui`;
4. compose the pieces in `web`.

This order is guidance, not a reason to create unused abstractions. Each step
should be supported by a real requirement from the feature.

## 6. Add tests

Add tests at the layer that owns each behaviour. Follow the
[testing strategy](./TESTING.md). Do not rely only on an end-to-end test when a
domain or store test can locate a failure more precisely.

## 7. Validate the change

Run every configured check applicable to the change, such as formatting, lint,
type checking, architecture validation, tests, and build. Inspect the final
diff for accidental or unrelated changes.

Commands must come from committed repository configuration. If a check is not
available, report it as unavailable rather than claiming that the change is
fully verified.

## 8. Update documentation

Update documentation when the feature changes:

- a public contract;
- package ownership or dependency direction;
- the state-management model;
- a developer workflow;
- an accepted architectural decision.

Create a new ADR for a new architectural decision. Do not rewrite an accepted
ADR to make history appear different.

## Completion checklist

- Acceptance criteria are satisfied.
- Responsibilities remain in their owning packages.
- Cross-package imports use public APIs.
- Relevant tests exist and pass.
- All available checks pass.
- Documentation reflects changed contracts or decisions.
- The final diff contains only intended changes.

The complete completion standard is defined in the agent
[Definition of Done](../agent/DEFINITION_OF_DONE.md) and applies equally to
human- and agent-authored changes.
