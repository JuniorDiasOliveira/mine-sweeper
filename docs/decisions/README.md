# Architecture Decisions

This directory contains the project's Architecture Decision Records (ADRs).

An ADR records a significant technical decision, why it was made, which
alternatives were considered, and which consequences the team accepts. It is
not a tutorial or an implementation plan.

## Decision index

| ADR                                 | Decision                                                            | Status   |
| ----------------------------------- | ------------------------------------------------------------------- | -------- |
| [ADR-001](./ADR-001-OBSERVABLES.md) | Manage game state with observable stores and `useSyncExternalStore` | Accepted |

## When to create an ADR

Create an ADR when a decision:

- affects more than one package or feature;
- establishes a long-term architectural constraint;
- selects one approach while rejecting meaningful alternatives;
- would be difficult to understand later from the code alone; or
- changes a previously accepted architectural decision.

Small implementation details, temporary experiments, and task instructions do
not require an ADR.

## File naming

Use the next sequential number and a short uppercase title:

```text
ADR-002-SHORT-DESCRIPTION.md
```

Numbers are never reused, even if a decision is later rejected or superseded.

## Required sections

Every ADR must contain:

- **Status**: Proposed, Accepted, Rejected, Deprecated, or Superseded.
- **Date**: the date on which the current status was established.
- **Context**: the problem and relevant constraints.
- **Decision**: the chosen approach and its boundaries.
- **Alternatives considered**: meaningful options that were not selected.
- **Consequences**: positive and negative results of the decision.

## Changing a decision

Accepted ADRs are historical records. Do not rewrite an accepted decision to
make it describe a new architecture.

When the architecture changes:

1. Create a new ADR.
2. Mark the previous ADR as `Superseded by ADR-XXX`.
3. Link both records to each other.
4. Update this index.

Minor corrections that do not change the decision, such as spelling fixes or
clarifications, may be applied directly.
