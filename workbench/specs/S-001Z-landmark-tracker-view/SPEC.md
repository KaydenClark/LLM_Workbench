# S-001Z - Landmark Tracker

**Spec ID:** S-001Z
**Status:** active
**Priority:** 1
**Owner:** codex-tracker-evidence-worker
**Stance:** Builder
**Updated:** 2026-09-26
**Catalog description:** Rebuild and inspect evidence-backed documentation distributions from existing DQC and landmark records.
**Blockers:** none
**Latest event:** TK-002U claimed by codex-tracker-evidence-worker.
**Next gate:** Close TK-002U with verification and documentation proof.

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

Actual captureQuestion -> reviseRecord -> showTracker operations preserve
assessment evidence fixture-article@immutable-revision in JSON, while
formatTracker omits it. Existing readable show prints fractions and basis but
not assessment evidence/revisions. JSON already contains these facts. The
DQC Task exclusively owns Result mutation and readable Result output.

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
Primary accountability proposal: Tracker owns 4 and 5, DQC owns 2 and 9,
Records owns 3, 7, 10, 11 and 12. Shared rows are decomposed by claim: 1 and 13
apply independently to every successor; 6 assigns source-write safety to DQC
and arithmetic outcomes to Tracker; 8 assigns source change/evidence to DQC,
actual article claim assessment to Records and reconciliation visibility to
Tracker. Existing done Tasks and append-only proof stay in the original owner.
Final transfer changes its current-facing broad ownership only after Director
coordinates the active lane-J and successor obligations.

## Dependencies And File Writers

Retain manifest.landmarkTracker, declaredTracker/trackerCollectionPath,
allocateArtifactId, destination-question@2 with @1 compatibility and landmark@1.
Membership remains the DQC landmark edge. No generic envelope or schema reset.
DQC has the first exclusive mutation lease for landmark-tracker.mjs and returns
a clean seam commit before Tracker changes its formatter. This is a file-level
serialization point, not a whole-Spec barrier. Independent Tracker tests/planning
can proceed. Existing S-00I/S-00P control, Wiki and lifecycle writers retain
those lanes; no root control edit is assigned here without coordinated release.

## Vertical Implementation Slices

[TK-002U](tasks/TK-002U/TASK.md) exposes supporting assessment evidence and
revisions through the readable public view. It uses persisted actual records,
existing projection fields, and its own test lane. Red test/inspection may
proceed concurrently; runtime writes wait only for the DQC module lease.

Further Tasks require a demonstrated remaining acceptance gap. Reuse existing
23-test arithmetic coverage; do not invent replacement implementation Tasks.

## Acceptance Criteria

- [ ] Human-readable public show for one DQC and the whole Tracker exposes existing own/related assessment evidence, basis and revisions on demand, surviving restart and rebuild without changing default compact output.
- [ ] Rebuilding the projection changes no source record and preserves schema compatibility, lineage and previous evidence.
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

## Documentation Impact

Update the Tracker README and assigned Task proof for delivered readable
behavior. Generic controls are exempt from a formatter-only change: public
schema, commands and shared behavior contract are unchanged. Existing S-00P
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
