---
name: codebase-design
description: Reason about module boundaries, seams, ownership, and change locality before structural work.
---

# Codebase Design

Map the behavior, callers, data ownership, and public seams before proposing
structure. Prefer modules with one clear responsibility, explicit adapters at
external boundaries, and changes that remain local. Compare alternatives by
the context required to understand and safely change them.

Validate the proposed boundary against real call paths and tests. Route durable
architecture choices to `BLUEPRINT.md` or the assigned `SPEC.md`; then use
`/tracer-bullet` or `/implement` for approved execution.
