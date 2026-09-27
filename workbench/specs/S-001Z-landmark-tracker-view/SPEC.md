# S-001Z - Landmark Tracker

**Spec ID:** S-001Z
**Status:** active
**Priority:** 1
**Owner:** codex-tracker-evidence-worker
**Stance:** Builder
**Updated:** 2026-09-27
**Catalog description:** Rebuild and inspect evidence-backed documentation distributions from existing DQC and landmark records.
**Blockers:** none
**Latest event:** 2026-09-27 planning and existing Task receipts reconciled from `c1813ba9c21b8b2e089963bcac0524e957a931d6`; implementation remains off integration.
**Next gate:** Reconcile and independently review the implementing lane candidate before its code enters integration; preserve named unresolved gates below.

## Integration Visibility

This record was reconciled from lane candidate `c1813ba9c21b8b2e089963bcac0524e957a931d6` on 2026-09-27.
Its requirements, existing Task identities and append-only receipts are now
available from integration. Implementation files were not imported with this
planning reconciliation. Statements below that a Task is done, behavior is
delivered, or tests pass describe the named lane candidate, not this integration
tree. Checked acceptance reflects that candidate's evidence only; assembled
integration verification and independent review remain open. Existing Task
states preserve the actual hand-back rather than inventing new execution.
The Dispatcher retains its lane and pending gates. Do not reimplement completed
branch work or infer permission to bypass a pending approval/review.

## Outcome

Rebuild and inspect evidence-backed documentation distributions from existing DQC and landmark records.

## Scope

Own the generated Tracker view, arithmetic and inspectability. Consume existing
DQC and landmark sources; never author a competing stage or reset lifecycle.
DQCs and workflow source maintenance belong to [Destination Question Cards](../S-002B-destination-question-cards/SPEC.md).
Landmark relationships, article checks and record lifecycle belong to
[Landmark Records](../S-002A-landmark-records/SPEC.md).

## Current Verified State

Read at `git show b00a2e338436ef7b281b0cc53e74f891af32f18c:workbench/tools/landmark-tracker.mjs`.
S-01T TK-01X/TK-01Y already deliver persistent sources, rebuild/show, exact
step arithmetic, mixed contributions, identity deduplication, explicit outcomes,
cycles and claim reconciliation. Targeted tests passed 23/23; the actual demo
passed in 1.64 seconds; rebuild --check reported current.

The baseline omitted existing assessment evidence from readable output.
TK-002U now delivers `show --expand` at runtime candidate
`e2b532d6dedb9fddf712bd3804a58508df138dd2`: saved evidence, basis, fractions,
assessment revision, holder and item revision are inspectable. Dedicated
tests pass 8/8, inherited Tracker 23/23, DQC Result 5/5, AGENTS checks 48/48
and additional Runbook checks 3/3. A fresh local clone reproduces targeted
checks and the demo. Compact and JSON bytes match the released DQC seam.
The DQC Task owns Result mutation/display; its exact seam
`912563f981ad89045635ef6c5b6cc9eb96f104f8` was imported before Tracker edits.
These are runtime-candidate results; later metadata and composed delivery need
their own checks. Existing self-drift remains, with no clean-update claim.

## Desired Behavior And Contracts

- Rebuild deterministically from source records; show meaningful titles,
  ungrouped cards, lineage, rationale, evidence and affected claims.
- Preserve exact ordered steps Idea, Aligning, Confirmed, Mapped, Planned,
  Journey, Review, Verified. Each distinct related item contributes one unit;
  mixed items split that unit. Shared identities count once at each aggregate,
  and mixed DQCs remain one contribution without flattening child counts.
- Preserve the 30/20/50 example at DQC, landmark and Workbench scopes; keep
  numerator, denominator, source type, identities and evidence inspectable.
- Retain explicit empty, incomplete and invalid outcomes. Preserve navigation
  cycles and refuse arithmetic cycles without publishing a partial projection.
- Offer human-readable inspection of each counted item's existing fractions,
  basis, supporting evidence, assessment revision, holder and item revision.
  Preserve default compactness with an explicit detail option if useful; do not
  invent evidence, resolved status or fractions for unassessed/unknown items.
- Consume DQC-owned Expected result/Result output unchanged. It never
  manufactures completion or a Verified assessment.
- Preserve actual durable-content/gate assessment semantics when Records supplies
  that seam. A done Task never becomes Verified automatically. Earlier proof
  remains readable at its source revision; relations do not imply blanket staleness.

## Source Acceptance Mapping

The original 13 acceptance bullets remain in
[the foundation source](../S-01T-landmark-tracker-foundation/SPEC.md).
Transferred accountability: Tracker owns 4 and 5, DQC owns 2 and 9,
Records owns 3, 7, 10, 11 and 12. Shared rows are decomposed by claim: 1 and 13
apply independently to every successor; 6 assigns source-write safety to DQC
and arithmetic outcomes to Tracker; 8 assigns source change/evidence to DQC,
actual article claim assessment to Records and reconciliation visibility to
Tracker. Existing done Tasks and append-only proof stay in the original owner.
The source transfer is recorded at `4e68ca488fa258f7dce0161aeebcd2946e492990`;
original unfinished Tasks remain deferred as transfer context, with their
execution withdrawn. Completed Task bytes and earlier evidence remain preserved.

## Dependencies And File Writers

Retain manifest.landmarkTracker, declaredTracker/trackerCollectionPath,
allocateArtifactId, destination-question@2 with @1 compatibility and landmark@1.
Membership remains the DQC landmark edge. No generic envelope or schema reset.
DQC released the shared module and README at exact seam `912563f`, consumed
by TK-002U before formatter edits. This serialization dependency is resolved. Existing S-00I/S-00P control, Wiki and lifecycle writers retain
those lanes; no root control edit is assigned here without coordinated release.

## Vertical Implementation Slices

[TK-002U](tasks/TK-002U/TASK.md) exposes supporting assessment evidence and
revisions through the readable public view. It is closed with the tested
runtime proof above; it uses persisted records, existing projection fields and
its dedicated test lane. No runtime lease wait remains.

Further Tasks require a demonstrated remaining acceptance gap. Reuse existing
23-test arithmetic coverage; do not invent replacement implementation Tasks.

## Acceptance Criteria

- [x] Human-readable public show for one DQC and the whole Tracker exposes existing own/related assessment evidence, basis and revisions on demand, surviving restart and rebuild without changing default compact output.
- [x] Rebuilding the projection changes no source record and preserves schema compatibility, lineage and previous evidence.
- [ ] Existing exact eight-step, 30/20/50, shared-identity, mixed-DQC, empty/incomplete/invalid and cycle demonstrations remain passing at the assembled candidate.
- [ ] Reconciliation visibility consumes source and actual article assessments without inferring Verified from Task status or creating blanket invalidation.
- [ ] Fresh-clone discoverability, full checks, self-drift receipts and a sub-minute public demo prove this bounded view; the source acceptance transfer has no orphan obligations.
- [ ] Whole-Spec dispatcher QA and separate-context immutable integration review pass; owner Human QA is independently recorded and never inferred.

## Testing Seams And Verification

Use public capture/revise/rebuild/show and existing exported formatTracker in
disposable manifest-declared rooms. The worker records failing expected output
before changing the formatter; then targeted output checks, existing Tracker
suite/demo and the full AGENTS suite on a committed candidate. Invalid-state and
source immutability assertions use actual before/after bytes. Capture self-drift
and guardrail before/after with existing findings left visible.

## Verification Procedure — Composed Demonstration

This Spec owns the single under-one-minute reproducible composed recipe for the
assembled immutable candidate. Each successor contributes its own acceptance;
this is final combined QA proof, not another parent Spec or a prerequisite to
current independent slices. The Tracker dispatcher coordinates the proof and a
scoped worker authors any additive fixture/runner; the dispatcher does not
implement runtime or demo Tasks.

Run in one disposable manifest-declared room through the actual delivered public
CLI/API. Preserve this ordered scenario:

1. Capture an unanswered DQC with original question identities and revisions.
2. Connect it to a landmark that appears later, preserving origin and identity.
3. Retain Expected result while recording achieved Result, with source history.
4. Inspect actual supporting assessment evidence, rationale and revisions in
   the public readable view; no Task-completion proxy or fabricated proof.
5. Validate the actual bytes of a designated readable Landmark article without
   WBIDs; keep identity-bearing provenance in structured records.
6. Rebuild and inspect the exact 30/20/50 example and shared-item deduplication
   without flattening mixed DQC contributions or changing source records.

The existing verified foundation command is
`node tools/landmark-tracker-demo.mjs`. Reuse its disposable-room setup and
existing example proof where useful. Delivered Result authoring uses `revise ID --result TEXT --expect-revision N`;
readable detail uses `show [ID] --expand`. The article validation command and
combined runner must be taken from their delivered worker interfaces.

At the assembled candidate, record here the exact runnable recipe/runner,
immutable SHA, elapsed time, output, per-successor acceptance contribution and
limits. S-002B contributes source lineage/Expected result/Result preservation;
S-002A contributes landmark linkage and actual article byte validation;
S-001Z contributes readable evidence/revisions and deterministic projection
arithmetic. Actual durable-content comparison and applicable gates still need
their own named evidence; a no-WBID validator alone does not establish Verified.

Current status: Result and readable-detail operations are delivered in the
tested runtime candidate. Article validation and the exact combined command
remain pending assembly. No combined pass claimed.

## Documentation Impact

Update the Tracker README and assigned Task proof for delivered readable
behavior. Generic controls are exempt from a formatter-only change: public
schema and shared workflow policy are unchanged; the optional readable flag
is documented in the owning README. Existing S-00P
owns root/template procedure reconciliation. Later scope changes must revisit
this exemption. A clean suite alone is not a clean-update or Human QA claim.

## Non-Goals

Reimplementing delivered foundation behavior; changing schemas without a proved
gap; DQC mutation ownership; Wiki content authoring or lifecycle takeover;
version/release/main promotion; other rooms; one dispatcher owning all delivery.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-26 | none | Serial identity reservation under explicit owner three-Spec split | Live base b00a2e338436ef7b281b0cc53e74f891af32f18c; next-id proposal saved before next allocation | This minimal scaffold | Dispatcher scope/Tasks and source transfer mapping pending |

| 2026-09-26 | TK-002U | Director approved distinct readable evidence slice after Result display remained with DQC TK-002S | Persisted public fixture at 52ca38c preserves evidence in JSON and omits it in readable formatTracker; parseArgs rejects show --expand | Scoped Tracker requirement and worker packet; central IDs S/T preserved | Red/green worker and DQC runtime lease release pending |

| 2026-09-26 | none | Director assigns this Verification Procedure as the single composed-demo owner | One-room scenario covers DQC lineage, later landmark, separate Expected result/Result, readable assessment evidence, actual article byte validation, 30/20/50 and shared dedup | Named recipe owner linked from original source; commands await actual worker delivery | Scoped worker fixture/runner and exact assembled candidate proof pending; no completion claim |
| 2026-09-27 | TK-002U | Task closed | Runtime e2b532d6dedb9fddf712bd3804a58508df138dd2: red7bd0b8d and eight expected red checks at6e451c1; readable8/8, Tracker23/23, Result5/5; AGENTS48/48 and Runbook3/3; public demos1.92s/0.43s; fresh local clone all five checks pass. Dispatcher independently reproduced8/23/5 and demo1.91s from immutable archive; no actionable bounded formatter review finding. Merge9f9f2e7 preserves runtime bytes and source-transfer history; no full-suite claim for closeout metadata. | Tracker README documents show --expand and limits; assigned Spec and Task proof reconciled. Generic root/template controls exempt: optional formatter flag changes no schema or shared workflow policy. | Task implementation proved; S-001Z remains open for assembled demonstration, actual article-assessment seam, whole-Spec QA and separate-context integration review. Existing stale claim and seed/provenance drift remains; guardrails78/100, no clean-update or owner Human QA claim. Git state at close: unpushed (no upstream); recorded reason: Local isolated candidate retained after automatic review rejected worker push; Director owns publication under original authorization. No rejected push retried. |

| 2026-09-27 | none | Integration visibility reconciliation | Imported requirements and existing Task receipts from `c1813ba9c21b8b2e089963bcac0524e957a931d6`; no runtime files merged and no new Tasks cut | This owner and release reconciliation report | Implementing candidate review, integration delivery and applicable owner gates remain |
