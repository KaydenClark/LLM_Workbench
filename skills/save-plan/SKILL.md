---
name: save-plan
description: Commit and push the current planning state — control docs, specs, tickets, and the rendered Taskboard — so the plan is remotely recoverable and discoverable by the Captain before any execution starts.
---

Save the plan, not the code. Commit the edited control files — docs routed by
`/to-docs`, specs, tickets, and the rendered `TASKBOARD.md` — and push them,
following the version-control steps in the project `RUNBOOK.md`.

- Verify the remote branch resolves to the pushed commit.
- Pushed tickets are what the Captain's discovery pass schedules. Confirm the
  project is enrolled in the Captain's active portfolio; say so visibly if it
  is not.
- One writer lane per commit: never sweep another agent's unrelated dirty
  files into the plan commit.
