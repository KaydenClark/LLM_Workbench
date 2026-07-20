---
name: tracer-bullet
description: Cut a capability into vertical tracer-bullet slices that each pierce every layer of a project's stack, then order, scope, and assign them.
disable-model-invocation: true
---

# Tracer Bullet

A tracer bullet is a lean but complete slice that pierces every horizontal layer
of the stack at once — schema, service, interface, and test — for one narrow
behavior. Because it crosses the whole stack, it is demoable on its own and
returns end-to-end feedback immediately. A slice that touches one layer is a
horizontal shard: it compiles but proves nothing, and integration risk stays
hidden until the last shard lands. Fire tracer bullets, not shards into the dark.

Use this discipline when defining a spec's `Vertical Implementation Slices`,
when a proposed slice names only one layer, and before assigning a slice to an
Engineer.

## 1. Map the stack

Name the project's real horizontal layers from its own source, not a generic
template. Read the nearest `AGENTS.md`, `RUNBOOK.md`, and existing source to fix
the layer list a finished feature must cross. A web feature usually crosses
persistence → service → interface → automated test; a CLI crosses input parsing
→ core logic → output → test. The map is done when every layer this project's
capability must pierce is named for this project.

## 2. Cut the narrowest complete path

Pick the thinnest end-to-end behavior a user or caller can observe, and cut one
slice that crosses every mapped layer for exactly that behavior. Hold the width
to one behavior; take full depth through all layers. State each slice as an
observable outcome ("a caller saves one record and reads it back"), never as a
layer ("add the table").

A sound tracer bullet:

- **Complete path** — crosses every layer named in step 1.
- **Demoable alone** — its proof is a check Kayden can run in under a minute.
- **One context** — fits a single fresh context window; when it will not, cut a
  thinner behavior, not a horizontal shard.
- **Real seam** — verified at a public seam, the way `/tdd` and `/implement`
  drive behavior, not at internal wiring.

## 3. Order by dependency, first bullet independent

Sequence slices so the first has no blockers and lands a working end-to-end
skeleton; later slices widen it one behavior at a time. When a wide refactor
cannot stay green as a single slice, use expand-contract: add the new path
beside the old, migrate callers slice by slice, then remove the old path once it
is unused.

## 4. Scope and assign

Hand these ordered slices to `/to-tickets` to write into the assigned spec's
`Vertical Implementation Slices` table, or to `/to-spec` when the spec itself is
still being written. Assign one slice to one durable Engineer writer at the
lowest capable tier, each with explicit blockers. When a proposed slice names a
single layer, re-cut it into a complete path before it is assigned. The
assignment is sound when the Engineer receives a complete-path, demoable,
one-context slice.

## Slice smell test

Before approving any slice, ask: does completing this slice alone light up the
whole path end to end? If nothing runs until a later slice lands, it is a
horizontal shard — re-cut it into a tracer bullet.
