---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Diagnostic
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/tools/diagnostics.mjs
  - workbench/docs/adr/0029-diagnostics-carry-registered-blocking-semantics.md
last_verified: 2026-10-07
---

# Diagnostic: a registered finding with its own blocking effect

A diagnostic is a registered finding a Workbench tool emits. Each has a stable code, a severity of `error` or `attention`, a scope, and a blocking effect of `all`, `selection`, `selected-slice` or `none`. The canonical definition is the [glossary entry](../../GLOSSARY.md#governance-core).

**What it means here.** The consuming command enforces the effect; no artifact chooses whether its own finding blocks ([ADR-0029](../docs/adr/0029-diagnostics-carry-registered-blocking-semantics.md)).

**Neighbouring words.** A feedback finding whose [Feedback disposition](dictionary-feedback-disposition.md) is `diagnostic` becomes one. A diagnostic is an [automated check](dictionary-automated-check.md): no judgement is in it. `doctor` fails on `all` and `selection`.

**In use.** `workbench/tools/diagnostics.mjs` registers `integration-branch-undeclared` as an `error` with scope `git` and effect `none`: `doctor` reports a manifest with no declared integration branch but still lets work be selected. `tools-receipt-drift`, an installed runtime tool that differs from its receipt hash, has effect `all` and blocks everything until repaired.

## Sources

- [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core): the canonical definition.
- [The diagnostics decision (ADR-0029)](../docs/adr/0029-diagnostics-carry-registered-blocking-semantics.md): diagnostics carry registered blocking semantics.
- [Diagnostics Ordered By Consequence](features/diagnostics-ordered-by-consequence.md): how `doctor` groups findings by effect.
- [workbench/tools/diagnostics.mjs](../tools/diagnostics.mjs): the registry.
