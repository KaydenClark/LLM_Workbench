---
name: to-tickets
description: Break an assigned LLM Workbench spec into approved, dependency-aware tracer-bullet tickets stored only in that spec's Vertical Implementation Slices table.
disable-model-invocation: true
---

# To Tickets

Turn one assigned Workbench capability into small, dependency-aware tracer-bullet
tickets. The assigned `SPEC.md` is the only ticket store; `TASKBOARD.md` is a generated projection, not a second tracker.

## Process

1. Read the assigned `SPEC.md`, then only the relevant source, tests, and
   `LEXICON.md` terms. Use `BLUEPRINT.md` only when the slice changes
   cross-cutting architecture. Do not select an unassigned spec.
2. Propose vertical slices that each deliver a checkable behavior in one context.
   Give every slice a short outcome-oriented title, its real blockers, done
   criteria, and the proof that will close it. Prefer an independent first
   tracer bullet; use expand-contract when a wide refactor cannot stay green by
   vertical slice.
3. Present the proposed table and ask for approval before changing durable
   work state. Confirm that slice size and blocking edges are right.
4. After approval, update only the assigned spec's `Vertical Implementation Slices`
   table. Preserve completed rows and append-only evidence. Do not
   create ticket files, publish tracker records, or create parallel
   requirements, decisions, or proof stores.
5. Run `node tools/spec-workbench.mjs render` to refresh the generated
   `TASKBOARD.md`, then run `node tools/spec-workbench.mjs doctor`. Use the
   claim and close commands in `RUNBOOK.md` when execution starts; work one
   eligible ticket at a time.

## Ticket Rules

- A ticket is a temporary implementation slice; its assigned `SPEC.md` owns
  intent, decisions, acceptance, and evidence.
- Use the project's accepted `LEXICON.md` vocabulary and name the user-visible
  behavior, not a layer-by-layer task.
- A ticket with no blockers is ready; do not invent dependencies or rewrite a
  completed slice to make a new plan fit.
- Keep owner-only gates and unresolved product decisions visible as blockers
  rather than silently assuming an answer.
