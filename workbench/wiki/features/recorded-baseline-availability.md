---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed one-article-per-Spec migration, 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task Move And Retype The Remaining Per-Spec Articles (TK-002) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-041-recorded-baseline-availability/SPEC.md
  - workbench/tools/spec-packet.mjs
  - templates/ADOPTION.md
  - workbench/skills/update-harness/SKILL.md
  - tools/test-spec-workbench.mjs
  - AGENTS.md
last_verified: 2026-10-04
---

# Recorded Baseline Availability

A harness-only change may encounter a target with no reproducible green
application baseline for a reason the harness change cannot affect. The Recorded
Baseline Availability Spec (S-041) delivered the owner-selected route for that
case: record-and-proceed.

## What It Does

- **Closed reasons.** The owning Spec records an unavailable baseline with
  evidence and one of the closed reasons host-restricted,
  product-broken-as-found or owner-declined-on-boundary. An unknown reason is
  refused.
- **Parser.** The parser exposes proceeds and stop.
- **Aligned contract wording.** The Spec deliberately aligned the Adoption
  template and update-harness contract wording. Tests establish the accepted
  vocabulary and parser behavior.

## Why It Matters

A harness-only change may meet a target with no reproducible green application
baseline for a reason the harness change cannot affect. A host spawn
restriction is not evidence that either the application or harness is
defective.

## Limits

- This is an explicit tradeoff. Recorded absence is weaker than a successful
  run, and cannot lower verification requirements for the harness change
  itself.
- A baseline known to fail remains subject to the written stop and authorized
  scope rules.
- This feature is a record, not comprehensive enforcement by next, claim or
  doctor.
- The historical red owner-expanded qualifier also accepted less evidence than
  unavailable, so the field itself cannot authenticate owner authorization.
  Current instructions and actual evidence remain necessary.
- Two original red cases demonstrated missing API rather than changed public
  behavior; only the out-of-vocabulary case showed the corresponding observable
  refusal.
- Neither the schema nor a valid entry proves that a more capable operator could
  not have obtained a baseline, and no downstream retry was performed merely by
  adding the contract.

## Evidence and Sources

- [Historical Recorded Baseline Availability Spec (S-041)](../../specs/S-041-recorded-baseline-availability/SPEC.md). Original decisions, corrections, acceptance and evidence retain their own scope; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `b38509d`](https://github.com/KaydenClark/LLM_Workbench/blob/b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb/workbench/specs/S-041-recorded-baseline-availability/SPEC.md). Recover the original with `git show b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb:workbench/specs/S-041-recorded-baseline-availability/SPEC.md`. The 2026-09-19 article's inspection of source used that same commit; the links below provide the route for renewed verification, and historical runtime or host limits are identified as such rather than promoted to fresh measurements.
- [workbench/tools/spec-packet.mjs](../../../workbench/tools/spec-packet.mjs) - the parser of the closed reasons.
- [templates/ADOPTION.md](../../../templates/ADOPTION.md) - the Adoption template wording.
- [workbench/skills/update-harness/SKILL.md](../../skills/update-harness/SKILL.md) - the update-harness contract wording.
- [tools/test-spec-workbench.mjs](../../../tools/test-spec-workbench.mjs) - the verification seam for the accepted vocabulary and parser behavior.
- [AGENTS.md](../../../AGENTS.md) - the agent contract holding the written stop and scope rules.

## History

- 2026-09-19: Created on explicit owner direction for one Wiki article per legacy Spec. Preserved useful knowledge, correction lineage and proof limitations; no source record retired or discarded.
- 2026-09-30: Repaired live skill links and source_paths after relocation to workbench/skills; verified destinations only, without revalidating historical capability claims.
- 2026-10-04: Moved from `design-concepts/spec-S-041-recorded-baseline-availability.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task Move And Retype The Remaining Per-Spec Articles (TK-002). The title lost its Spec identifier suffix; the identifier now sits beside the Spec's name in the introduction. Every live link to it was rewritten by the move; no claim was changed. Checked the Spec name, that every listed source path exists, and that the spec-packet source carries the three closed reasons; the other claims were not re-verified.
