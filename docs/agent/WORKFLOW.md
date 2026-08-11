# Agent Workflow

## 1. Understand the task

Before editing files, the agent must:

1. Restate the requested outcome and identify the acceptance criteria.
2. Separate explicit requirements from assumptions.
3. Read the relevant architecture documents and accepted ADRs.
4. Inspect the affected code, public APIs, tests, and configuration.
5. Check the current workspace state and preserve unrelated changes.

If acceptance criteria are missing but the change can be interpreted in
materially different ways, ask for clarification.

## 2. Plan the smallest complete change

For a non-trivial task, identify:

- files and workspaces expected to change;
- package boundaries involved;
- tests needed for the requested behaviour;
- documentation that may need an update;
- validation commands that will provide evidence.

The plan must stay within the requested scope. Do not add abstractions,
dependencies, refactors, or features merely because they may be useful later.

## 3. Implement incrementally

- Respect package ownership and public APIs.
- Follow [Coding Rules](./CODING_RULES.md).
- Keep the change limited to the requested scope.
- Prefer small changes that can be verified independently.
- Add or update tests with the behaviour they protect.
- Update documentation when a contract, decision, or workflow changes.
- Reinspect the diff during implementation to catch accidental changes.

Do not alter a lint rule, type-safety rule, test, or architecture check simply
to make an implementation pass. Correct the implementation or report the
conflict.

## 4. Stop when authority is missing

Stop and ask before continuing when:

- the task requires an undocumented product or architecture decision;
- two authoritative documents conflict;
- the requested change would violate an accepted ADR or package boundary;
- an external dependency or public API change is required but not authorized;
- unrelated existing changes make a safe edit unclear;
- required validation cannot be run and the result cannot be established by a
  narrower check.

When stopping, explain the concrete conflict and the smallest decision needed
to proceed.

## 5. Verify

Run the narrowest relevant checks during implementation, then run every
available repository check required by the changed scope. Verification should
cover, when applicable:

- focused unit or component tests;
- type checking;
- linting and formatting;
- package-boundary and dependency checks;
- production build;
- end-to-end behaviour.

Do not claim a check passed unless it was executed successfully. If tooling is
not configured yet, state that limitation explicitly.

## 6. Report the result

The final report must state:

- the outcome and important files changed;
- validation commands run and their results;
- checks not run and why;
- remaining risks, assumptions, or follow-up decisions.

Use [Definition of Done](./DEFINITION_OF_DONE.md) before describing a task as
complete.
