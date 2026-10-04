---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed one-article-per-Spec migration, 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task Move And Retype The Remaining Per-Spec Articles (TK-002) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-036-v3-1-2-evidence-corrections/SPEC.md
  - tools/control-fidelity.mjs
  - tools/workbench-tools.mjs
  - workbench/tools/workbench-layout.mjs
  - tools/test-control-fidelity.mjs
  - tools/test-workbench-upgrade.mjs
last_verified: 2026-10-04
---

# Evidence-Bounded Upgrade Claims

Upgrade reports distinguish what a check observes from what an operator might
infer. The Workbench v3.1.2 Evidence Corrections Spec (S-036) corrected an
unpublished v3.1.2 candidate where permission visibility, control fidelity and
source identity had been overstated.

## What It Does

- **Uncertainty, not a writable lane.** A bounded matcher that cannot
  interpret a restriction reports uncertainty; it does not establish that a
  lane is writable.
- **Control fidelity.** Control fidelity compares filled controls with their
  source templates. Fixed wording must survive placeholder substitution for a
  line to count as filled. Similarity or token overlap is not proof of that
  relationship.
- **Source identity.** A source identity requires a verifiable checkout and
  bytes; caller-supplied release or commit strings cannot authenticate a
  relocated partial copy.
- **Provenance and generation kept apart.** Historical adoption provenance and
  current managed-component generation answer different questions. The former
  describes how the room originated; runtime receipts and skill markers
  describe what is installed.
- **Maintenance proof.** Its disposable already-v3 maintenance test preserved
  project-owned bytes.

## Why It Matters

Replacing adoption provenance with current managed-component generation, or the
reverse, would erase useful history or misrepresent current state.

## Limits

- The Spec records four candidate-review rounds before its correction landed.
  That is bounded historical evidence of defects caught, not a universal review
  requirement or today's release status.
- Native permission behavior and downstream deployment were separately bounded;
  static fixtures did not establish them.
- Later corrections belong to linked successors rather than rewriting completed
  evidence.

## Evidence and Sources

- [Historical Workbench v3.1.2 Evidence Corrections Spec (S-036)](../../specs/S-036-v3-1-2-evidence-corrections/SPEC.md). Original decisions, corrections, acceptance and evidence retain their own scope; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `b38509d`](https://github.com/KaydenClark/LLM_Workbench/blob/b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb/workbench/specs/S-036-v3-1-2-evidence-corrections/SPEC.md). Recover the original with `git show b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb:workbench/specs/S-036-v3-1-2-evidence-corrections/SPEC.md`. The 2026-09-19 article's inspection of source used that same commit; the links below provide the route for renewed verification, and historical runtime or host limits are identified as such rather than promoted to fresh measurements.
- [tools/control-fidelity.mjs](../../../tools/control-fidelity.mjs) - the control fidelity comparison.
- [tools/workbench-tools.mjs](../../../tools/workbench-tools.mjs) - the shared managed-tools source identity.
- [workbench/tools/workbench-layout.mjs](../../../workbench/tools/workbench-layout.mjs) - the installed-layout owner.
- [tools/test-control-fidelity.mjs](../../../tools/test-control-fidelity.mjs) and [tools/test-workbench-upgrade.mjs](../../../tools/test-workbench-upgrade.mjs) - the verification seams.

## History

- 2026-09-19: Created on explicit owner direction for one Wiki article per legacy Spec. Preserved useful knowledge, correction lineage and proof limitations; no source record retired or discarded.
- 2026-10-04: Moved from `design-concepts/spec-S-036-evidence-corrections.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task Move And Retype The Remaining Per-Spec Articles (TK-002). The title lost its Spec identifier suffix; the identifier now sits beside the Spec's name in the introduction. Every live link to it was rewritten by the move; no claim was changed. Checked the Spec name, that every listed current source path exists (the first entry names the Spec's eventual retired route, which does not exist yet) and that the immutable commit holds the Spec; the other claims were not re-verified.
