# Architecture

This section defines the structure of the system and the rules between its parts.
These documents are normative: implementations must follow them unless an
accepted Architecture Decision Record (ADR) changes the rule.

## Documents

- [Overview](./OVERVIEW.md): system shape and responsibility flow.
- [Package boundaries](./PACKAGE_BOUNDARIES.md): what belongs in each workspace.
- [State management](./STATE_MANAGEMENT.md): observable stores and React usage.
- [Dependency rules](./DEPENDENCY_RULES.md): allowed imports and dependency direction.

## Reading order

1. Read the overview to understand the system.
2. Check package boundaries before choosing where code belongs.
3. Read the state rules when changing stores, hooks, or UI integration.
4. Check dependency rules before adding a cross-package import.

If a requested change conflicts with these documents, do not silently work
around the rule. Propose an architectural change and record the accepted
decision in `docs/decisions/` first.
