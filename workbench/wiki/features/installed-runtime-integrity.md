---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed one-article-per-Spec migration, 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task Move And Retype The Remaining Per-Spec Articles (TK-002) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-039-installed-runtime-integrity/SPEC.md
  - workbench/tools/workbench-layout.mjs
  - tools/workbench-tools.mjs
  - workbench/tools/spec-workbench.mjs
  - tools/test-workbench-tools.mjs
  - tools/test-diagnostics.mjs
  - workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md
last_verified: 2026-10-04
---

# Installed Runtime Integrity

An installed room can compare its runtime files with the hashes in its
managed-tools receipt. The Installed Managed-Runtime Integrity Spec (S-039)
delivered that check. The installed workbench-layout runtime owns it so the
room does not need the product's root tools directory to inspect itself.

## What It Does

- **Expected file set.** The authoritative expected file set matters: an empty
  map, omitted file or unsafe receipt key cannot be allowed to shrink
  verification silently.
- **Drift classification.** When a trusted release source is available, drift
  can be classified as receipt-stale, runtime-modified, runtime-authentic with a
  mode difference, or source-unavailable.
- **Verify reports; repair is separate.** Verify reports, and repair stays
  behind explicit update or recovery.
- **Blocking effect.** Registered all-blocking runtime drift is consumed by
  doctor, selection and claim, rather than existing only as a diagnostic
  aspiration.

## Why It Matters

A room with managed runtime files needs to be able to say whether those files
still match what its receipt recorded, without depending on the product's root
tools directory.

## Limits

- A missing receipt historically means no managed installation to inspect, so
  deleting the receipt can remove that path's evidence; Genesis validation is
  separate.
- A missing imported module may fail the loader before a friendly finding is
  emitted.
- Matching a locally rewritten receipt to altered bytes is not a trusted
  authenticity proof. Receipt hashes are consistency evidence, not a signed
  trust root.
- The shipped bare citations of the
  Installed Managed-Runtime Integrity Spec (S-039) became stale after
  integration. The v3.1.2 Follow-Ups Left Without An Owner Spec (S-045)
  introduced anchored citations and repaired that documentation; the original
  limitation is not a fresh unresolved task here. Read current symbols and
  tests through the sources below.
- No already-drifted downstream room was automatically repaired by this
  capability.

## Evidence and Sources

- [Historical Installed Managed-Runtime Integrity Spec (S-039)](../../specs/S-039-installed-runtime-integrity/SPEC.md). Original decisions, corrections, acceptance and evidence retain their own scope; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `b38509d`](https://github.com/KaydenClark/LLM_Workbench/blob/b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb/workbench/specs/S-039-installed-runtime-integrity/SPEC.md). Recover the original with `git show b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb:workbench/specs/S-039-installed-runtime-integrity/SPEC.md`. The 2026-09-19 article's inspection of source used that same commit; the links below provide the route for renewed verification, and historical runtime or host limits are identified as such rather than promoted to fresh measurements.
- [Historical v3.1.2 Follow-Ups Left Without An Owner Spec (S-045)](../../specs/S-045-v3-1-2-follow-ups/SPEC.md). Its record at the same commit is the [immutable source at `b38509d`](https://github.com/KaydenClark/LLM_Workbench/blob/b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb/workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md).
- [workbench/tools/workbench-layout.mjs](../../../workbench/tools/workbench-layout.mjs) - the installed-layout runtime that owns the check.
- [tools/workbench-tools.mjs](../../../tools/workbench-tools.mjs) - the managed-tools receipt and verify tool.
- [workbench/tools/spec-workbench.mjs](../../../workbench/tools/spec-workbench.mjs) - the selection and claim consumer.
- [tools/test-workbench-tools.mjs](../../../tools/test-workbench-tools.mjs) and [tools/test-diagnostics.mjs](../../../tools/test-diagnostics.mjs) - the verification seams.

## History

- 2026-09-19: Created on explicit owner direction for one Wiki article per legacy Spec. Preserved useful knowledge, correction lineage and proof limitations; no source record retired or discarded.
- 2026-10-04: Moved from `design-concepts/spec-S-039-installed-runtime-integrity.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task Move And Retype The Remaining Per-Spec Articles (TK-002). The title lost its Spec identifier suffix; the identifier now sits beside the Spec's name in the introduction. Every live link to it was rewritten by the move; no claim was changed. Checked the Spec names, that every listed source path exists, and that the layout source carries the receipt-stale, runtime-modified and source-unavailable classifications; the other claims were not re-verified.
