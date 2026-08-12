# Definition of Done

## Completion rule

A task may be described as complete only when every applicable item below is
satisfied. An item is not satisfied merely because the agent expects it to
pass.

## Behaviour

- Its acceptance criteria are satisfied.
- The requested behaviour has been exercised at the appropriate level.
- Edge cases introduced or affected by the change are handled.
- No unrelated product behaviour was added or changed.

## Architecture and code

- Package and dependency boundaries are respected.
- Public APIs are used for all cross-package access.
- Game rules, state coordination, application composition, and presentation
  remain with their documented owners.
- The implementation contains no known debug code, dead code, or unexplained
  workaround.
- New dependencies and public exports are intentional and justified.

## Tests and automated checks

- Relevant tests exist and pass.
- A defect fix includes a regression test when the defect is reproducible in an
  automated test.
- Every configured check applicable to the change passes, including type
  checking, linting, formatting, architecture validation, build, and end-to-end
  tests where relevant.
- Failed or skipped checks are not reported as successful.

## Documentation and delivery

- Documentation reflects any new or changed decision.
- Accepted architecture changes have an ADR that records their rationale and
  consequences.
- The final diff contains only intended changes.
- No known issue is hidden from the final report.
- The final report states what changed and lists the checks actually run.

## When full verification is unavailable

If a required check cannot be run because its tooling is not yet configured or
because of an external blocker, the task may be handed off, but it must not be
reported as fully verified. The final report must identify:

- the unavailable check;
- the reason it was unavailable;
- the narrower validation that was performed;
- the remaining risk.

The exact validation commands are documented in
[`GETTING_STARTED.md`](../development/GETTING_STARTED.md). CI is not
configured yet (no GitHub remote exists), so it cannot be one of the checks
reported as run until
[`IMPLEMENT_GUARDRAILS.md`](../tasks/planned/IMPLEMENT_GUARDRAILS.md)'s CI
section is complete.
