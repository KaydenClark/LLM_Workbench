---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Seeded from the current answers of the Harness Feedback Review landmark's question cards (landmark record revision 1), 2026-10-04
source_paths:
  - workbench/landmark-tracker/landmarks
  - workbench/landmark-tracker/destination-questions
  - workbench/docs/adr/0038-setup-proof-precedes-feedback-reporting.md
  - workbench/docs/adr/000K-every-feedback-finding-carries-one-of-four-dispositions.md
  - workbench/feedback/REPORT_FORMAT.md
  - workbench/skills/improve-harness/SKILL.md
  - workbench/docs/ddr/001I-harness-improvement-is-one-playbook-not-a-family-of-review-skills.md
parent: none
authorized_by: the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages)
last_verified: 2026-10-04
---

# Landmark: Harness Feedback Review

This page is the evolving synthesis of the Harness Feedback Review landmark
(landmark ["Harness Feedback Review" (LMK-000W)](../../landmark-tracker/landmarks/LMK-000W.json)).
It sums up, in prose, what the landmark's four question cards currently say and
is updated whenever one of them changes. The cards and the landmark record keep
the structured account and the lineage; the decision records and Specs named
below govern.

## What the landmark is

Harness Feedback Review is how observed friction becomes investigated findings
and supported improvements, with real outcomes kept distinct from static scores.
It matters because a report that repairs what it evaluates, a finding left in no
state at all, or a static improvement presented as an agent-outcome gain would
each make the feedback loop assert more than the evidence shows.

## Current accepted answers

For all four cards the source answers were settled by the owner in their
grilling sessions (the last one partly recovered from the owner's own chat
messages); the cards' grouping and titles are agent work and were not separately
confirmed. This page states the settled answers as claims and the grouping as
structure only.

**Setup proof comes first, in chat only.** The redesigned workflow is built
first, then a setup-only Round One runs: a fresh agent uses the reduced entry
route, the Wiki and the relevant decision records to confirm the Workbench is
set up correctly, and returns to the current chat. Only the four stance skills,
the reduced entry route and the feedback-report workflow and format are built
before the first report. Round One is not a feedback or review test and creates
no report, handoff, checkpoint, self-created task or other prose artifact;
passing it is its mission success. Only after it succeeds is a reviewed,
evidence-backed report produced and cold continuation shown to its accepted next
action, and the report must not authorize or include a repair to the harness it
evaluates (card [DQC-005Q: "What should a setup-only Round One establish?"](../../landmark-tracker/destination-questions/DQC-005Q.json), revision 8).
The decision is recorded in
[Chat-only setup proof precedes feedback reporting](../../docs/adr/0038-setup-proof-precedes-feedback-reporting.md).

**Where reports and follow-up live.** Reports go in the manifest-declared
feedback lane, never loose, in the Wiki or in an ad-hoc folder. Accepted
follow-up work goes in its owning linked Spec, and a report neither repairs its
target nor authorizes automated repair
(card [DQC-005R: "Where should feedback reports and their accepted follow-up live?"](../../landmark-tracker/destination-questions/DQC-005R.json), revision 6).

**Every finding gets one disposition.** Each finding receives exactly one
disposition in its owning Spec, and the report format requires the field. The
card names four classes: diagnostic (a doctor code with mandatory remediation
text), test, declined with a reason, and accepted-open (real, unscheduled, and
naming the owning Spec). A suite test must fail if a registered doctor finding
lacks remediation text
(card [DQC-005S: "How should every feedback finding be dispositioned?"](../../landmark-tracker/destination-questions/DQC-005S.json), revision 5).

**Context cost and outcomes are measured elsewhere.** The owner's answer was
"No budget limit, but budget grading": artifact sizes are recorded on each
project during each Workbench update and monitored, aiming for artifacts that
say the same thing in fewer words and stay readable. The mechanism belongs to
the audit and evaluation workbench, not LLM Workbench, and the direction is a
per-update size measurement plus a separate agent-outcome evaluation, owned
elsewhere (card [DQC-005T: "How should context cost and agent outcomes be evaluated?"](../../landmark-tracker/destination-questions/DQC-005T.json), revision 8).
The same card appears under the Verification landmark; see
[Landmark: Verification](landmark-verification.md).

## Open and unresolved

- Revised by a newer decision: the disposition card records four classes. The
  decision record
  [Every feedback finding carries one of five dispositions](../../docs/adr/000K-every-feedback-finding-carries-one-of-four-dispositions.md)
  now has five, adding `repaired` for a finding fixed directly by a change named
  by its commit; its file name still says four. The report format also lists
  five. The card has not been updated, and the file name is itself a small
  stale-name defect.
- The card states the remediation-text suite test as an obligation, not a
  result. The diagnostics test file now holds a registry-wide remediation check,
  but whether that counts as the delivered ratchet is for the owning Spec to say,
  and that Spec's own header still reads active; do not cite it as done from here.
- The context-cost card quotes the owner that LLM Workbench does not itself do
  harness feedback reviews. Since 2026-10-06 the fifteen-skill host-installed
  review family is retired in favor of one core skill every room carries,
  [`improve-harness`](../skill-improve-harness.md), which improves one observed
  job through one loop and writes its result record in the room's feedback lane
  ([Harness improvement is one playbook, not a family of review skills](../../docs/ddr/001I-harness-improvement-is-one-playbook-not-a-family-of-review-skills.md),
  delivered by the [Harness Improvement Playbook Skill Spec (S-004L)](../../specs/S-004L-harness-improvement-playbook-skill/SPEC.md)).
  This repository keeps only its maintainer harvest and report steps around
  that loop. No card has been revised to say so yet.
- No measurement mechanism for context cost or agent outcomes exists in this
  repository by these answers; any claim that a harness change improved agent
  outcomes still needs repeated controlled trials, as the decision record
  [Evidence for claims of improved agent outcomes](../../docs/adr/0044-evidence-for-claims-of-improved-agent-outcomes.md)
  already says.

## Where the work lives

Delivered through [S-027 - Workbench Boundaries for v3.1.1](../../specs/S-027-workbench-v3-1-1-boundaries/SPEC.md)
for the route, the stance skills and the report workflow, and
[Feedback Finding Dispositions (S-00N)](../../specs/S-00N-feedback-finding-dispositions/SPEC.md)
for the disposition vocabulary and its ratchet test. The earlier integrity work
is [Harness Feedback Integrity (S-028)](../../specs/S-028-harness-feedback-integrity/SPEC.md),
and the one harness improvement skill was delivered by the
[Harness Improvement Playbook Skill Spec (S-004L)](../../specs/S-004L-harness-improvement-playbook-skill/SPEC.md),
which overtook the planned
[harness feedback review skill family alignment (S-003K)](../../specs/S-003K-harness-feedback-review-skill-family-alignment/SPEC.md).
The format is [REPORT_FORMAT](../../feedback/REPORT_FORMAT.md) in the feedback
lane. The decision is
[Every feedback finding carries one of five dispositions](../../docs/adr/000K-every-feedback-finding-carries-one-of-four-dispositions.md).
The procedures are in the [RUNBOOK](../../../RUNBOOK.md#manual-harness-feedback-reports)
and the vocabulary in the [LEXICON](../../../LEXICON.md).

## Related pages

- [Landmark: Verification](landmark-verification.md): checks, review and owner Human QA.
- [Landmark: Agent Stances](landmark-agent-stances.md): the four stances Round One depends on.

## Evidence and Sources

- [Landmark record "Harness Feedback Review" (LMK-000W)](../../landmark-tracker/landmarks/LMK-000W.json): title, summary, importance and history.
- The four question cards named above, each at the revision cited: they hold the answers, confirmation basis, open uncertainties and named claims this page summarizes.
- [The Wiki is the evolving synthesis every agent reads and updates](../../docs/adr/000R-the-wiki-is-the-evolving-synthesis-every-agent-reads-and-updates.md): why this page exists.

## History

- 2026-10-04: created by the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages), seeded from the cards' current answers.
- 2026-10-06: the Harness Improvement Playbook Skill Spec (S-004L), at its whole-Spec QA, replaced the stale "family is planned" statements with the retired family and the one `improve-harness` skill; the cards themselves are unchanged.
