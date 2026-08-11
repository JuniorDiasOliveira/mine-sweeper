# Agent Instructions

## Purpose

This directory defines how an AI agent must work in this repository. The agent
may help write code, but it must follow the same architecture, quality checks,
and review standards as a human contributor.

These documents are instructions, not suggestions:

1. [Workflow](./WORKFLOW.md) — how to inspect, plan, implement, verify, and
   report a task.
2. [Coding rules](./CODING_RULES.md) — rules every implementation must follow.
3. [Definition of done](./DEFINITION_OF_DONE.md) — evidence required before a
   task may be called complete.

## Order of authority

When instructions conflict, use this order:

1. The current task and its explicit acceptance criteria.
2. Accepted records in [`docs/decisions`](../decisions/README.md).
3. Architecture rules in [`docs/architecture`](../architecture/README.md).
4. The agent instructions in this directory.
5. Existing implementation patterns.

Existing code is evidence of the current implementation, not automatic proof
that a pattern is correct. When code conflicts with a higher-authority
document, stop and report the conflict instead of silently choosing one.

## Missing decisions

An agent must not invent product behaviour, architecture, public contracts, or
tooling policy. If the task depends on a decision that is not documented, it
must ask for clarification before implementing that part.

The root [`AGENTS.md`](../../AGENTS.md) is the repository entry point. This
directory contains the detailed workflow, coding rules, and completion
criteria referenced from it.
