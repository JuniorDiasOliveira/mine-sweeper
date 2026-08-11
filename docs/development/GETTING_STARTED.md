# Getting Started

## Purpose

Explain how to prepare the local environment and make a first contribution.

## Before starting

Read the repository instructions before changing code:

1. Read the root `README.md` and `AGENTS.md` when they exist.
2. Read the [architecture overview](../architecture/OVERVIEW.md).
3. Read the [package boundaries](../architecture/PACKAGE_BOUNDARIES.md).
4. Read the [dependency rules](../architecture/DEPENDENCY_RULES.md).
5. Read any task document associated with the work.

Do not start implementation while requirements, acceptance criteria, or the
owning package are unclear.

## Repository structure

The intended top-level structure is:

```text
apps/
  web/                 Application composition and browser entry point
packages/
  core/                Pure Minesweeper rules
  game-state/          Observable store and React integration
  ui/                  Presentational components
  shared/              Proven cross-package utilities
docs/                  Architecture, decisions, guides, and tasks
```

The directories describe responsibility, not merely file organization. Review
the package boundary documentation before deciding where new code belongs.

## Local setup

The workspace and its toolchain have not been initialized yet. The following
details are therefore intentionally pending:

- required runtime and package manager versions;
- dependency installation command;
- development server command;
- validation and build commands;
- recommended editor extensions and settings.

Add those instructions only after the corresponding configuration exists in
the repository. Until then, do not invent commands or present unconfigured
tools as requirements.

## First-change checklist

Before making a first code change:

- confirm the expected behaviour and acceptance criteria;
- identify the package that owns the behaviour;
- inspect the package's public API and existing conventions;
- determine which tests can prove the change;
- keep the proposed change within the requested scope.

Continue with [Adding a feature](./ADDING_A_FEATURE.md) for the implementation
workflow and [Testing](./TESTING.md) for the testing strategy.
