---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed one-article-per-Spec migration, 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task Move And Retype The Remaining Per-Spec Articles (TK-002) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-037-line-ending-agnostic-records/SPEC.md
  - workbench/tools/adr.mjs
  - workbench/tools/wiki.mjs
  - tools/workbench-adoption.mjs
  - tools/test-adr.mjs
  - tools/test-wiki.mjs
  - tools/test-workbench-adoption.mjs
last_verified: 2026-10-04
---

# Line-Ending-Aware Records

Portable record readers accept ordinary LF and CRLF checkouts without
requiring each adopted repository to change Git settings. The
Line-Ending-Agnostic Record Parsing Spec (S-037) delivered that behavior.

## What It Does

- **One parser seam.** ADR and Wiki parsing share parseFrontmatter, so a
  correction at that seam applies consistently to both. Parsing normalizes a
  copy.
- **Terminator-aware writing.** Writers preserve the destination's terminator
  to avoid an unrelated whole-file diff.
- **What was corrected.** The Spec corrected parser boundaries and the Adoption
  memory-field writer. A review also caught a mixed-ending writer regression
  that had omitted required metadata; preserving read semantics alone was
  insufficient.

## Why It Matters

The original defect made a simulated CRLF corpus appear to contain invalid
records and a stale register. The useful contract is structural parsing plus
terminator-aware writing, not an assumption that all Windows editor output is
equivalent.

## Limits

- Historical probes still rejected a byte-order mark (UTF-8 BOM) before the
  opening fence and whitespace after a delimiter. Those adjacent cases were
  outside the ordinary autocrlf scenario and should not be silently reported as
  covered.
- The Spec's proof was a byte-faithful CRLF simulation on the development host,
  not a native Windows run.
- Reporting-only split sites were not comprehensively audited, and unrelated
  Windows failures were outside the Spec.
- Current parser and writer tests are the route for verifying present behavior;
  old finding counts and release results remain historical measurements.

## Evidence and Sources

- [Historical Line-Ending-Agnostic Record Parsing Spec (S-037)](../../specs/S-037-line-ending-agnostic-records/SPEC.md). Original decisions, corrections, acceptance and evidence retain their own scope; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `b38509d`](https://github.com/KaydenClark/LLM_Workbench/blob/b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb/workbench/specs/S-037-line-ending-agnostic-records/SPEC.md). Recover the original with `git show b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb:workbench/specs/S-037-line-ending-agnostic-records/SPEC.md`. The 2026-09-19 article's inspection of source used that same commit; the links below provide the route for renewed verification, and historical runtime or host limits are identified as such rather than promoted to fresh measurements.
- [workbench/tools/adr.mjs](../../../workbench/tools/adr.mjs) - the ADR parser that shares parseFrontmatter.
- [workbench/tools/wiki.mjs](../../../workbench/tools/wiki.mjs) - the Wiki parser.
- [tools/workbench-adoption.mjs](../../../tools/workbench-adoption.mjs) - the Adoption memory-field writer.
- [tools/test-adr.mjs](../../../tools/test-adr.mjs), [tools/test-wiki.mjs](../../../tools/test-wiki.mjs) and [tools/test-workbench-adoption.mjs](../../../tools/test-workbench-adoption.mjs) - the verification seams.

## History

- 2026-09-19: Created on explicit owner direction for one Wiki article per legacy Spec. Preserved useful knowledge, correction lineage and proof limitations; no source record retired or discarded.
- 2026-10-04: Moved from `design-concepts/spec-S-037-line-ending-agnostic-records.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task Move And Retype The Remaining Per-Spec Articles (TK-002). The title lost its Spec identifier suffix; the identifier now sits beside the Spec's name in the introduction. Every live link to it was rewritten by the move; no claim was changed. Checked the Spec name, that every listed source path exists and that the ADR source exports parseFrontmatter; the other claims were not re-verified.
