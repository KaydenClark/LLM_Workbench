---
name: to-tickets
description: Break an assigned Workbench spec into dependency-aware tracer-bullet tickets.
disable-model-invocation: true
---

# To Tickets

The assigned `SPEC.md` is the only ticket store. `TASKBOARD.md` is a generated
projection, not a second tracker.

## Process

1. Read the assigned `SPEC.md` and the relevant source and tests. Do not select
   an unassigned spec.
2. Propose vertical slices that each deliver a checkable behavior in one context.
   Give each a short outcome-oriented title, real blockers, done criteria, and
   closing proof. Prefer an independent first tracer bullet; use expand-contract
   when a wide refactor cannot stay green by vertical slice.
3. Present the proposed table and ask for approval before changing durable
   work state. Confirm that slice size and blocking edges are right. When the
   caller supplies explicit prior authorization through grilling's exact
   `make it so` passphrase, treat that as approval of the agreed decomposition
   and do not ask again; preserve any unresolved owner decision as a blocker.
4. After approval, update only the assigned spec's `Vertical Implementation Slices`
   table. Preserve completed rows and append-only evidence. Keep unresolved
   owner decisions visible as blockers. Create no parallel ticket or proof store.
5. Run `node tools/spec-workbench.mjs render` to refresh the generated
   `TASKBOARD.md`, then run `node tools/spec-workbench.mjs doctor`. Execution
   later uses the claim and close commands in `RUNBOOK.md` one eligible ticket
   at a time.
