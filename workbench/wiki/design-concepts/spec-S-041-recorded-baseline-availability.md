---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed one-article-per-Spec migration, 2026-09-19
source_paths:
  - workbench/specs/S-041-recorded-baseline-availability/SPEC.md
  - workbench/tools/spec-packet.mjs
  - templates/ADOPTION.md
  - skills/update-harness/SKILL.md
  - tools/test-spec-workbench.mjs
  - AGENTS.md
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# Recorded Baseline Availability (S-041)

A harness-only change may encounter a target with no reproducible green application baseline for a reason the harness change cannot affect. The owner selected record-and-proceed: the owning Spec records an unavailable baseline with evidence and one of the closed reasons host-restricted, product-broken-as-found or owner-declined-on-boundary. An unknown reason is refused.

This is an explicit tradeoff. Recorded absence is weaker than a successful run, and cannot lower verification requirements for the harness change itself. A host spawn restriction is not evidence that either the application or harness is defective. A baseline known to fail remains subject to the written stop and authorized scope rules.

The parser exposes proceeds and stop, but this feature is a record, not comprehensive enforcement by next, claim or doctor. The historical red owner-expanded qualifier also accepted less evidence than unavailable, so the field itself cannot authenticate owner authorization. Current instructions and actual evidence remain necessary.

S-041 deliberately aligned the Adoption template and update-harness contract wording. Tests establish the accepted vocabulary and parser behavior. Two original red cases demonstrated missing API rather than changed public behavior; only the out-of-vocabulary case showed the corresponding observable refusal. Neither the schema nor a valid entry proves that a more capable operator could not have obtained a baseline, and no downstream retry was performed merely by adding the contract.

## Evidence and Sources

Historical source: `git show b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb:workbench/specs/S-041-recorded-baseline-availability/SPEC.md`.
Its original decisions, corrections, acceptance and evidence retain their own
scope. Current source inspection for this article used that same commit; the
links below provide the route for renewed verification. Historical runtime or
host limits are identified as such rather than promoted to fresh measurements.

- [workbench/tools/spec-packet.mjs](../../tools/spec-packet.mjs)
- [templates/ADOPTION.md](../../../templates/ADOPTION.md)
- [skills/update-harness/SKILL.md](../../../skills/update-harness/SKILL.md)
- [tools/test-spec-workbench.mjs](../../../tools/test-spec-workbench.mjs)
- [AGENTS.md](../../../AGENTS.md)

## History

- 2026-09-19: Created on explicit owner direction for one Wiki article per legacy Spec. Preserved useful knowledge, correction lineage and proof limitations; no source record retired or discarded.
