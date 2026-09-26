---
name: tracer-bullet
description: Cut a capability into vertical tracer-bullet slices that each pierce every layer of a project's stack, then order, scope, and assign them.
---

# Tracer Bullet

A tracer bullet is a lean but complete slice that pierces every horizontal layer
of the stack at once — schema, service, interface, and test, plus its
documentation and proof seams — for one narrow behavior. Because it crosses the
whole stack, it is demoable on its own and returns end-to-end feedback
immediately. A slice that touches one layer is a
horizontal shard: it compiles but proves nothing, and integration risk stays
hidden until the last shard lands. Fire tracer bullets, not shards into the dark.

Use this discipline when defining a spec's `Vertical Implementation Slices`,
when a proposed slice names only one layer, and before a slice becomes an
assigned Task.

When the capability belongs to a v3 project, read `workbench/manifest.json`
before assigning the slice so its durable `SPEC.md` and evidence paths use the
declared lanes.

## 1. Map the stack

Name the project's real horizontal layers from its own source, not a generic
template. Read the nearest `AGENTS.md`, `RUNBOOK.md`, and existing source to fix
the layer list a finished feature must cross. A web feature usually crosses
persistence → service → interface → automated test; a CLI crosses input parsing
→ core logic → output → test. Every map also carries two seams that are not
code: the documentation owner whose meaning the behavior changes (or a recorded
`Docs checked; no update needed` with its reason), and the proof seam, the named
check that shows the behavior working. The map is done when every layer this
project's capability must pierce is named for this project.

## 2. Cut the narrowest complete path

Pick the thinnest end-to-end behavior a user or caller can observe, and cut one
slice that crosses every mapped layer for exactly that behavior. Hold the width
to one behavior; take full depth through all layers. State each slice as an
observable outcome ("a caller saves one record and reads it back"), never as a
layer ("add the table").

A sound tracer bullet:

- **Complete path** — crosses every layer named in step 1, including its
  documentation and proof seams.
- **Demoable alone** — its proof is a named check the owner can run in under a
  minute.
- **One context** — fits the context unit declared in `workbench/manifest.json`;
  when it will not, cut a thinner behavior, not a horizontal shard.
- **Real seam** — verified at a public seam, the way `/tdd` and `/implement`
  drive behavior, not at internal wiring.

## 3. Order by dependency, first bullet independent

Sequence slices so the first has no blockers and lands a working end-to-end
skeleton; later slices widen it one behavior at a time. When a wide refactor
cannot stay green as a single slice, use expand-contract: add the new path
beside the old, migrate callers slice by slice, then remove the old path once it
is unused.

## 4. Scope and assign

Hand these ordered slices to `/to-tasks` to write as Task records (or into the
assigned spec's `Vertical Implementation Slices` table when it is not yet
record-backed), or to `/to-spec` when the spec itself is still being written.
Each approved slice becomes one Task with one durable writer and explicit
blockers; the normal stance (usually Builder) is set in the Task and its Spec,
not chosen by the arriving agent. When a proposed slice names a single layer, or
is code-only with no documentation or proof seam, re-cut it into a complete path
before it becomes an assigned Task. The assignment is sound when the Task holds a
complete-path, demoable, one-context slice.

## Slice smell test

Before approving any slice, ask: does completing this slice alone light up the
whole path end to end? If nothing runs until a later slice lands, or the
code runs but its documentation stays stale and no check proves it, it is a
horizontal shard — re-cut it into a tracer bullet.
