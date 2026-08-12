# Tasks

This directory records implementation tasks: what was requested, the
acceptance criteria, and the evidence that those criteria were met.

## Sections

- [`planned/`](./planned/): tasks not yet completed. A planned task may still
  have open decisions; do not start implementation while a material decision
  is unresolved.
- [`completed/`](./completed/): tasks whose acceptance criteria and required
  checks have all succeeded, moved here without rewriting their history.
- [`TASK_TEMPLATE.md`](./TASK_TEMPLATE.md): the structure every task document
  must follow.

## Completed tasks

| Task                                                                               | Summary                                                       |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| [IMPLEMENT_WORKSPACE_FOUNDATION.md](./completed/IMPLEMENT_WORKSPACE_FOUNDATION.md) | pnpm workspace, Node 22 pin, and the five workspace skeletons |

## Moving a task to `completed/`

1. Verify every acceptance criterion and required check in the task document.
2. Fill in the task's `Completion record` section with what was implemented,
   the validation results, and any remaining risk.
3. Move the file into `completed/` with `git mv`; do not edit its earlier
   sections to rewrite history.
4. Add a row to the table above.
