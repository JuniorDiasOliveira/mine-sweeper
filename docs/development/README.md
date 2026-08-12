# Development

Practical guides for working on the project safely and consistently.

These documents are intended for both developers and coding agents. They
translate the architectural rules into day-to-day development practices.

- [Getting started](./GETTING_STARTED.md)
- [Repository configuration](./CONFIGURATION.md)
- [Testing](./TESTING.md)
- [Adding a feature](./ADDING_A_FEATURE.md)

## Reading order

For a first contribution, read the guides in the order listed above. Before
changing code, also read:

- [Architecture overview](../architecture/OVERVIEW.md);
- [Package boundaries](../architecture/PACKAGE_BOUNDARIES.md);
- [Dependency rules](../architecture/DEPENDENCY_RULES.md).

Coding agents must additionally follow the instructions in
[`docs/agent`](../agent/README.md).

## Current status

The workspace toolchain is initialized: pnpm workspaces, TypeScript, Prettier,
ESLint, dependency-cruiser, Vitest, Knip, Husky, and Playwright are all
configured. See [Getting started](./GETTING_STARTED.md) for the commands.
See [Repository configuration](./CONFIGURATION.md) for where each tool's
configuration lives and how new configuration should be organized.

CI and branch protection are not configured yet: there is no GitHub remote
for them to run against. See
[`IMPLEMENT_GUARDRAILS.md`](../tasks/planned/IMPLEMENT_GUARDRAILS.md).
