# TK-01Y - Inspect documentation distributions across source types and scopes

**Task ID:** TK-01Y
**Spec ID:** S-01T
**Slice:** Inspect documentation distributions across source types and scopes
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: Exact eight-step vocabulary, the 30/20/50 example, shared identity deduplication, mixed-question contribution and Workbench-wide aggregation pass deterministic examples without filtering or flattening away meaning; empty, unknown, missing-assessment, invalid-fraction and cyclic dependency cases terminate with explicit outcomes and invalid writes preserve prior data; changed understanding exposes evidence-backed affected claims and preserves earlier proof
**Planned verification:** Red: at the TK-01X public persistence and projection seam, persisted source-type by scope tables (grilling question, Spec, ADR, Task, DQC at DQC, landmark and Workbench scope) fail for shared-identity deduplication, mixed-DQC contribution, incomplete and invalid outcomes, arithmetic versus navigation cycles and claim revisions. Green: each passes through persist, restart and rebuild; invalid updates leave bytes unchanged. Targeted tests, then the full AGENTS suite; the TK-01X demo extended in under a minute.

## Outcome

Extend the Foundation runtime and test serially (same files, one writer).
Related grilling questions, Specs, ADRs, Tasks and DQCs contribute with the
same evidence-bearing documentation meaning and typed room-scoped identity,
preserving legacy Spec-qualified numeric Task labels.

## Required Behavior

- Keep the exact order Idea, Aligning, Confirmed, Mapped, Planned, Journey,
  Review, Verified. Each distinct declared constituent contributes one unit;
  a mixed item's fractions sum to one and state their basis.
- Deduplicate shared identity in each aggregate while keeping every
  relationship visible for navigation. A mixed DQC stays one item; expanding
  its lineage never flattens children into the aggregate. No
  supporting-reference exclusion and no effort weighting.
- Empty input shows no items. Unknown identities and missing assessments
  report incomplete; nonfinite, negative, unknown-step and wrong-sum fractions
  report invalid. Never drop a bad record to make totals pass.
- Preserve navigation cycles; refuse arithmetic dependency cycles naming the
  identity chain.
- Inspect numerator, denominator, evidence revision and fraction rationale at
  DQC, landmark and Workbench scope, including the 30/20/50 example.
- On changed understanding, record what changed, why and the revision; assess
  specific affected claims; keep original proof and unaffected claims. A
  relation alone does not make a target stale. A done Task or accepted ADR
  never yields Verified by itself.

## Paths

`workbench/tools/landmark-tracker.mjs`, `tools/test-landmark-tracker.mjs`,
`workbench/landmark-tracker/README.md`. No second assessment store. Runbook
wording goes to Remaining Gaps for S-00P (root controls stay out of lane).

## Done Criteria And Closing Proof

Red and green SHAs, targeted tallies, full suite on the committed candidate,
doctor, extended demo command, README update and Remaining Gaps.

## Delivered Shape (implementation choices within the Task's latitude)

- **Constituents.** DQC records move to schema 2 with `related` and `claims`
  lists; schema 1 records still load and upgrade on their next write, with
  the upgrade recorded in history. `relate ID --item TYPE:IDENTITY[@REVISION]`
  declares a constituent (`dqc`, `grilling-question`, `spec`, `adr`, `task`),
  optionally assessed; re-running it re-assesses or records a newer revision.
  Assessments of non-DQC items live on the relating DQC's record (no second
  store); a related DQC contributes its own record's assessment. Letter-bearing
  Task labels are room-unique; legacy numeric ones must be Spec-qualified
  (`S-00H/TK-003`) and keep their bytes.
- **Resolution.** Specs, Tasks (record folders and legacy table rows) and
  ADRs resolve by identity alone against the room's declared lanes in any
  lifecycle folder, so no status is read and the view does not drift when a
  Task becomes done. Grilling questions are `declared` (their notes are
  untracked); an unresolved identity is `unknown`.
- **Scopes.** Card scope is the DQC plus its declared related items; landmark
  scope is the union of its cards' scopes; Workbench scope is the union of all.
  Every aggregate carries `numerators`, `denominator`, `counted`,
  `bySourceType` and per-item `contributions` (fractions, basis, evidence,
  assessed revision, holder, item revision); the projection adds an `items`
  identity index with holders and `relatedBy`, per-card `lineage` and a
  `reconciliation` list.
- **Outcomes.** `empty`, `incomplete` (unassessed or unknown items stay in the
  denominator), `invalid` (nonfinite, negative, unknown-step or wrong-sum
  fractions, or two different assessments of one identity; the distribution is
  withheld and the item named) and `complete`. The pure seam is the exported
  `distribution(items)`.
- **Arithmetic dependencies.** A DQC's own assessment may be `--assess
  derived`: the mean of its related items' fractions (unit weights),
  `derived-incomplete` while any is missing. Cycles of derived dependencies
  are refused with the new `dependency-cycle` code naming the chain, at write
  and at rebuild; plain relations may cycle and are marked `cycle` in lineage.
- **Claims.** `--claim KEY=TEXT`, `--claim-evidence KEY=REF` and `--affects
  KEY=ASSESSMENT`; evidence is kept per revision, `--affects` requires changed
  understanding in the same revision, and only named claims become `affected`.
- **Demo.** `node tools/landmark-tracker-demo.mjs` gains steps 7-12 (scoped
  30/20/50, shared identity, lineage, navigation and dependency cycles,
  incomplete and invalid outcomes, reconciliation).

## Remaining Gaps

- Claims and `--affects` reach only the changing card's own claims; a change
  that affects a claim on another card is recorded by revising that card.
- Resolving a conflicting shared assessment takes one `relate` per holder;
  between those writes the aggregates holding it are `invalid`.
- Grilling-question constituents cannot be verified from tracked state and
  are taken as declared.
- No doctor-level Tracker drift finding (unchanged from TK-01X);
  `rebuild --check` remains the seam, and a discarded referenced Spec, Task or
  ADR becomes `unknown` only after a rebuild. Live reference rewriting through
  moves remains TK-02A.
- Owed to S-00P (root controls, not edited here), in addition to TK-01X's
  items: in RUNBOOK "Landmark Tracker: accepted design and available
  operations", after the paragraph TK-01X owes, add: "Declare a DQC's related
  grilling questions, Specs, ADRs, Tasks and DQCs with `relate ID --item
  TYPE:IDENTITY[@REVISION] --expect-revision N --reason ...` (optionally with
  `--assess`, `--basis` and `--evidence`); legacy numeric Task labels are
  written Spec-qualified, for example `S-00H/TK-003`. `TRACKER.json` shows
  distributions at card, landmark and Workbench scope with their numerators,
  denominator and per-item evidence; unknown or unassessed items make an
  aggregate incomplete and bad or conflicting fractions make it invalid.
  Derived assessments that depend on themselves are refused with
  `dependency-cycle`. Record claims with `--claim` and `--claim-evidence`,
  and name the claims a change affects with `--affects`."
