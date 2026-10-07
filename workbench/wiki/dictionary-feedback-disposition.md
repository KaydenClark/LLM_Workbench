---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Feedback disposition
provenance:
  - The Lexicon Retirement Spec (S-004O), its Wiki-only reference pages Task (TK-009K), moved the Lexicon Feedback Dispositions paragraph's explanatory sentences here, 2026-10-07
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: each disposition code explained with its neighbouring terms and a recorded example
source_paths:
  - GLOSSARY.md
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

**The five dispositions.** Each code is a glossary entry of the [Feedback disposition grouping](../../GLOSSARY.md#feedback-disposition); this is what each one means in practice.

- **`diagnostic`**: the finding became a registered doctor code with mandatory remediation text, so the next room that meets the condition is told what is wrong and how to fix it. It is the strongest outcome for a condition a tool can detect ([Diagnostic](dictionary-diagnostic.md)).
- **`test`**: the finding became a check added at a stable testing seam ([Seam](dictionary-seam.md)), so the same defect fails the suite if it comes back.
- **`repaired`**: the finding got a direct code, configuration or documentation fix, named by its commit, that did not become a registered diagnostic or stable-seam test. The fix is real but nothing guards against a recurrence.
- **`declined`**: the finding was not pursued, and the reason is recorded where the next reader of the report will find it.
- **`accepted-open`**: the finding is real and accepted but not scheduled, and names the owning Spec that holds it. When no owner exists, the report says so rather than inventing one.

**Neighbouring words.** A [Diagnostic](dictionary-diagnostic.md) is what a `diagnostic` disposition produces; an [Auditor](dictionary-auditor.md) or a Harness Feedback Review reports findings and never repairs its target, and the disposition records where each one went. A disposition is not a [Decision Record](dictionary-decision-record.md): it records what happened to one occurrence, not a durable choice.

**In use.** The Workbench Boundaries feedback report of 2026-09-05 (`workbench/feedback/REPORT-boundaries-2026-09-05.md`) carries a Disposition Reconciliation addendum of 2026-09-19: its finding F-001 is dispositioned `test`, owned by the Harness Feedback Integrity Spec (S-028), with the fixtures that now check it named as evidence.

## Sources

- [GLOSSARY.md: Feedback disposition](../../GLOSSARY.md#feedback-disposition): the canonical definition and the closed set of dispositions; this page explains them ([the Lexicon retirement decision (DDR-001E)](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)).
- [The feedback report format](../feedback/REPORT_FORMAT.md): the required Disposition field and its owning evidence route.
- [Landmark: Harness Feedback Review](design-concepts/landmark-harness-feedback-review.md): every finding gets one disposition, and reports never repair their target.
- [Source-checked finding disposition](features/source-checked-finding-disposition.md): the feature article on dispositioning findings against their source.
