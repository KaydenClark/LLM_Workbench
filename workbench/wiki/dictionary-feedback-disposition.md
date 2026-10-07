---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Feedback disposition
provenance:
  - The Lexicon Retirement Spec (S-004O), its Wiki-only reference pages Task (TK-009K), moved the Lexicon Feedback Dispositions paragraph's explanatory sentences here, 2026-10-07
source_paths:
  - workbench/docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md
  - workbench/feedback/REPORT_FORMAT.md
  - workbench/wiki/design-concepts/landmark-harness-feedback-review.md
  - workbench/wiki/features/source-checked-finding-disposition.md
last_verified: 2026-10-07
---

# Feedback disposition: the one outcome each finding gets

Every feedback finding gets exactly one disposition from a closed set, recorded in its owning Spec. The report points to that owner and the supporting evidence. The set is defined in the glossary: `diagnostic`, `test`, `repaired`, `declined` and `accepted-open`.

**What it means here.** A disposition describes the supported outcome; it neither schedules a repair nor grants permission. A report and finding ID together identify an occurrence. The same finding seen again in a later report is a second occurrence with its own disposition, which is how recurrence shows.

**Where the Workbench depends on it.** Harness Feedback Review reports never repair their target: each finding's disposition routes the work to an owner. `accepted-open` must name the owning Spec, and when no owner exists the report states that gap instead of inventing one.

## Sources

- [GLOSSARY.md: Feedback disposition](../../GLOSSARY.md#feedback-disposition): the canonical definition and the closed set of dispositions; this page explains them ([the Lexicon retirement decision (DDR-001E)](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)).
- [The feedback report format](../feedback/REPORT_FORMAT.md): the required Disposition field and its owning evidence route.
- [Landmark: Harness Feedback Review](design-concepts/landmark-harness-feedback-review.md): every finding gets one disposition, and reports never repair their target.
- [Source-checked finding disposition](features/source-checked-finding-disposition.md): the feature article on dispositioning findings against their source.
