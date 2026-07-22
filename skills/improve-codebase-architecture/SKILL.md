---
name: improve-codebase-architecture
description: Identify and prioritize structural improvements that make future changes safer and more local.
---

# Improve Codebase Architecture

Inspect real change paths, coupling, repeated knowledge, and test seams. Name
the highest-leverage improvements with evidence, expected benefit, affected
boundaries, and migration risk. Prefer a small reversible slice over a broad
refactor.

Present alternatives and a recommendation; do not implement without approval.
Persist an accepted cross-cutting direction in `BLUEPRINT.md` or scoped work in
the owning `SPEC.md`, then create executable slices through the normal flow.
