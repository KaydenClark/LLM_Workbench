---
name: save-work
description: Commit and push the current implementation progress as a truthful checkpoint — complete or not — so work is never local-only.
---

Save the work as it truthfully is. Commit the code, tests, owning docs, and
spec evidence for the slice being worked, state plainly whether it is complete
or in progress, and push, following the version-control steps in the project
`RUNBOOK.md`.

- An incomplete slice gets a truthful checkpoint commit, never a claim of
  completion.
- Verify the remote branch resolves to the pushed commit; the remote is the
  recovery point.
- One writer lane per commit: never sweep another agent's unrelated dirty
  files into it.
