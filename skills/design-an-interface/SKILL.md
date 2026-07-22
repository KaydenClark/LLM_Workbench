---
name: design-an-interface
description: Compare distinct public interface shapes before selecting one to implement.
---

# Design an Interface

Read the nearest controls and collect the callers, constraints, failure modes,
and invariants. Generate two or more meaningfully different interface shapes,
not cosmetic variants. Compare them against clarity, safety, change cost, and
testability; include a recommendation and the trade-off it accepts.

Record the settled interface decision in the owning `SPEC.md` or
`BLUEPRINT.md`, then hand the approved choice to `/implement`. Do not invent a
new requirements store.
