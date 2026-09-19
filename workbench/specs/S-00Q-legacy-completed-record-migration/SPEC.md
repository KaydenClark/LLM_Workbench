# S-00Q - Legacy Completed Record Migration

**Spec ID:** S-00Q
**Status:** active
**Priority:** 2
**Owner:** unassigned
**Stance:** Reconciler
**Updated:** 2026-09-19
**Catalog description:** Transform the 50 legacy completed Specs still on the active roster into one durable Wiki article per legacy Spec, redirect current consumers, retire the records, and discard them only after verified default-branch containment and recovery proof.
**Blockers:** Article inventory and authoring are authorized now. Retirement waits for S-00I/S-00J/S-00P completion, an explicit legacy retirement QA rule, concrete review/approval and TK-0Q1 repair proof; discard additionally waits for default-branch containment.
**Latest event:** Independent semantic review passed all 50 individual articles after correcting S-051 architecture and S-053 capability-floor omissions; hashes and bounded review are recorded in the migration inventory.
**Next gate:** Resolve the legacy retirement QA rule and reconcile current consumers before any lifecycle move; individual article preparation has passed bounded review.

> **Citation anchors.** pre=`8dc257eb9b9615c9e6a26beda95209dbcdb4f05f` post=`8dc257eb9b9615c9e6a26beda95209dbcdb4f05f`.

## Outcome

The 50 completed Specs that predate the current reconciliation lifecycle stop
serving as current capability documentation. Their useful current meaning is
rewritten into exactly one Wiki article per legacy Spec and linked to the existing
ADR, source, test, asset, control and procedure owners. Current consumers point
to those owners. Each reconciled record then moves through `retired` and, only
after exact default-branch containment, a clean current-reference scan and a
tested Git recovery command, is discarded. Frozen evidence, ADR history,
attribution and the record's immutable Git history survive.

This is a semantic migration, not deletion by age, name similarity, byte
equality, reference count or passing tests. A record with zero incoming links
still receives the same claim inventory and destination decision as one with
many consumers.

## Why It Matters

The Blueprint now makes `SPEC.md` and `TASK.md` transient working artifacts:
Wiki owns readable capability knowledge, ADRs own consequential decisions,
source/tests/assets own implementation and proof, and Git owns recoverable
history (`BLUEPRINT.md:72-78`). The desired lifecycle transforms a closed Spec
into those owners, retires it, and permits discard only after default-branch
verification (`BLUEPRINT.md:117-137`).

At the pre anchor, that lifecycle has been exercised on one real Spec, S-00H,
but 50 older completed Specs remain in the top-level active roster. Keeping all
50 as current reading material contradicts the destination; deleting them
mechanically would destroy useful meaning and route readers into gaps. This
Spec owns the missing migration programme without reopening their completed
work or duplicating S-00I's lifecycle mechanism and S-00P's control rewrite.

## Current Verified State

At the pre anchor:

- A live parse of top-level `workbench/specs/S-*/SPEC.md` finds exactly 50
  records whose header status is `complete`. `referencesToPath` finds 89
  current references to their directories; 19 of the 50 have none. Those
  counts describe navigation only, not content value or discard eligibility.
- The 50 records have no current assembled-Spec review verdict or owner Human
  QA recorded under the later S-00J contract. Their historical review and test
  rows remain evidence; they are not silently relabelled as the newer gates.
- S-00I defines transformation before retirement and default-branch,
  reference-scan and Git-recovery gates before discard
  (`workbench/specs/S-00I-folder-lifecycle-for-records/SPEC.md:63-85`), and its
  planned implementation slices distinguish reconciliation from discard
  (`workbench/specs/S-00I-folder-lifecycle-for-records/SPEC.md:189-215`).
- S-00H is the sole real retired Spec. Its Wiki owner is readable, but the
  current scan still finds 16 references to its retired directory, including
  two sanctioned citations in its Wiki article; excluding those two leaves 14
  current consumers. Its retirement commit is not verified contained in the
  locally recorded `origin/main` at this anchor.
- S-00O records four material discard hazards: the sanctioned Wiki citation
  becomes a `discarded-reference` immediately after discard, orphan corrective
  Task creation is not idempotent, removing the last retired Task can silently
  flip a Spec back to table-backed interpretation, and moving-commit recovery
  chooses the first path add rather than the last
  (`workbench/specs/S-00O-workbench-v4-0-0-release/SPEC.md:330`).
- `next-id --prefix S --json` proposes already-retired S-00H. The owner reserved
  S-00Q and TK-0Q0 through TK-0Q9 explicitly, so this plan does not reuse the
  colliding proposal.
- S-014 and S-022 are `blocked`, not complete, and S-050 is `active`; none is
  part of the 50-record inventory. S-00K owns their stale current-facing
  release disposition (`workbench/specs/S-00K-workbench-self-drift-check/SPEC.md:23-57,100-103`).
  S-052 still owns the unproved live private-repository and Mac/Windows
  Claude/Codex round trip (`workbench/specs/S-052-private-session-transport/SPEC.md:3-12`).

### Complete migration inventory

The inventory is complete and intentionally grouped by reader-facing
capability, with exactly one article per Spec; batches organize execution and review only:

| Batch | Legacy completed Specs | Capability destination to establish |
|---|---|---|
| A | S-001, S-002, S-004, S-005, S-006, S-007, S-008, S-009, S-010, S-012, S-013, S-015 | Work selection, evaluation, feedback, portability and baseline release-proof behavior |
| B | S-020, S-021, S-023, S-024, S-025, S-026 | Portable room architecture, schema, governance, Wiki and composed workflow |
| C | S-027, S-028, S-029, S-030, S-031, S-032, S-033, S-034, S-035 | v3.1.1-v3.1.2 operating boundaries, installation, diagnostics and release lineage |
| D | S-036, S-037, S-038, S-039, S-040, S-041, S-042, S-043, S-044, S-045 | Upgrade correction, runtime integrity, repair and legacy-room diagnosis |
| E | S-046, S-047, S-048, S-049, S-051, S-053 | Continuity, visible identity, checkpoint transition, execution ownership, core ownership and configured hosts |
| F | S-00A, S-00B, S-00C, S-00D, S-00E, S-00F, S-00L | Blueprint/ADR routing, Template, evidence-to-Genesis journey, release gate and Lexicon freshness |

## Desired Behavior

1. A checked inventory assigns every useful current claim from all 50 Specs to
   exactly one durable destination, marks historical-only material explicitly,
   and records uncertainty without inferring a destination from filenames,
   dates, byte equality, references or green tests.
2. Exactly one Wiki article per legacy Spec explains its useful capability knowledge,
   decisions, limitations and proof references, citing current ADR/source/test/control
   owners. It transforms meaning rather than pasting Task state or evidence tables.
3. Current consumers move from active or retired Spec paths to the actual
   Wiki, ADR, source, test, control or procedure owner. Frozen evidence rows,
   ADR history and attribution keep their meaning through immutable
   commit/path identity or the discard register; they are not rewritten as
   current claims and do not disappear.
4. Each batch proves semantic completeness, current-consumer coherence and the
   chosen legacy-QA rule before retirement. `retire-spec` performs the move;
   hand edits or bulk filesystem moves do not substitute.
5. Each retired batch waits for the exact retirement commit to be verified on
   the declared default branch. Only then may `discard` run, in bounded waves,
   after its complete scan is clean and its recovery identity is captured.
   Every recovery command is exercised from a disposable clean checkout before
   the next wave.
6. After each wave, a memoryless reader reaches the current capability from
   the Context Map and Wiki router, `CATALOG.md` and `TASKBOARD.md` are coherent,
   no selection-blocking `discarded-reference` remains, and a corrective Task
   can target the Wiki claim without resurrecting a Spec.

## Decisions And Contracts

### Owner gate: legacy QA

No legacy Spec receives fabricated retrospective assembled-Spec review or
Human QA. The owner requested durable transformation, then explicitly clarified exactly one
Wiki article per Spec. This authorizes article preparation. It does not select
one of the retirement QA alternatives below or approve any concrete digest.
The earlier alternatives remain proposals and decision lineage:

1. **Recommended:** approve a current capability-batch migration digest. The
   digest inventories claims and destinations, verifies current behavior at
   source/test seams, and approves the resulting durable documentation. It is
   explicitly migration approval, not a claim that the old Spec passed the
   later S-00J lifecycle when it originally completed.
2. Require new per-Spec assembled review and Human QA for all 50 records before
   retirement. This is strongest but recreates a large historical ceremony and
   may require unavailable old environments.
3. Permit transformation and retirement but defer discard for legacy records
   indefinitely. This reduces active-roster drift but does not reach the
   Blueprint's intended transient-record end state.

TK-0Q0 records the exact owner direction below, prepares the inventory and concrete
batch digests, and retains an explicit QA-method decision and concrete review before retirement. Silence, old test
evidence or the mere `complete` header never supplies approval of a batch.

### Migration and preservation contracts

- `promote -> to-docs -> save` is the intended composition: reconcile supported
  claims into the named durable owners, author readable documentation, verify
  it, then preserve the achieved state. It grants no additional implementation
  or release authority.
- A batch migration matrix has one row per source claim group with: source Spec
  and immutable anchor, classification (`current`, `decision`, `proof`,
  `historical`, `superseded`, `uncertain`), destination owner, consumer changes,
  verification, preservation route and owner-gate result.
- Historical release results are not current readiness. S-014/S-022 disposition
  and their hot-projection correction remain S-00K work. S-00O remains the v4
  release owner. S-052 remains the live cross-device/private-transport proof
  owner. S-050 stays outside this migration while active; if its owner later
  closes it, it enters a separately approved corrective Task, not this frozen
  50-record inventory.
- ADR bodies and append-only evidence remain frozen. When a frozen reference
  must survive record deletion, its durable identity is the immutable retiring
  commit plus historical path and attribution; the implementation must make
  that identity readable without weakening the zero-current-reference gate.
- Retirement and discard are separate commits and review units. Before
  retirement, preserve a complete inventory and rollback point. Before discard,
  verify the retiring commit on the declared default branch and test the exact
  recovery command. A failed migration restores the batch from its pre-change
  branch/commit; a post-discard correction uses the recorded Git recovery route
  on a new branch, never an unrecorded manual reconstruction.
- TK-0Q1 is a prerequisite delivered once by [S-00T](../S-00T-lifecycle-discard-repair/SPEC.md), not a second lifecycle implementation. It closes
  the allocator collision and the four disclosed discard hazards at their
  existing seams, with regression tests, before any real legacy record is
  retired or discarded.

## Non-Goals

- Implementing or rewriting S-00I's general folder lifecycle, S-00J's normal
  QA gate, S-00P's control/template reconciliation, S-00K's self-drift
  capability, S-00N's feedback dispositions, or S-00O's v4 release.
- Editing S-00I, S-00J, S-00K, S-00N, S-00O, S-00P, S-014, S-022, S-050 or
  S-052 as part of this planning change. Their owners receive precise handoffs;
  their history and state are not silently rewritten here.
- Treating all similarly named Specs as one capability, merging multiple Specs into one article,
  or deleting zero-reference records without semantic review.
- Re-approving old releases, manufacturing unavailable host proof, inspecting
  an external repository, or touching Dungeon Friends.
- Deleting or rewriting ADR archive/history, append-only evidence, attribution,
  recovery records, or Git history.

## Dependencies And Blockers

- Inventory, source verification and one-article-per-Spec authoring may proceed now under the explicit owner direction. They do not depend on whole-Spec I/J/P completion or runtime discard repair.
- TK-0Q0 establishes the shared inventory and article routes before article batches fan out.
- Retirement still requires S-00I, S-00J and S-00P completion, TK-0Q1 repair proof delivered by S-00T, semantic completeness and concrete batch review.
- Every discard additionally requires its exact retirement and current recovery content verified on the declared default branch. A later batch inherits none of that proof.

## Vertical Implementation Slices

This Spec is record-backed. Its ten approved Tasks live under `tasks/`; this
table intentionally carries no live rows.

| Task | Slice | Status | Blockers | Proof |
|---|---|---|---|---|

## Acceptance Criteria

- [ ] A revision-checked 50-record inventory covers every Spec named in batches
      A-F, with claim classification, durable destination, consumer set,
      preservation route and uncertainty; no active/blocked record is smuggled
      into the completed inventory.
- [ ] The per-Spec article direction and a separately selected retirement QA rule are recorded without fabricating
      retrospective S-00J review or Human QA.
- [ ] `next-id` never proposes a used active, retired, corrective or
      remote-tracking-visible ID, and the four disclosed discard hazards are
      closed or explicitly proven harmless before the first real migration.
- [x] Every legacy Spec has exactly one Wiki article preserving useful capability
      knowledge, decisions, limitations and proof references with links to actual
      ADR/source/test/control/procedure owners; copied Task state is rejected.
- [ ] Every current consumer points to the durable owner rather than a retired
      record before discard; frozen evidence, ADR history and attribution remain
      readable through immutable identity.
- [ ] S-014/S-022 current-facing disposition is handed to S-00K, v4 readiness
      remains S-00O, and live transport proof remains S-052; S-050 is not
      treated as completed migration input while active.
- [ ] Every record retires only through `retire-spec` after batch approval, and
      every discard waits for exact default-branch containment, a clean complete
      reference scan and a tested recovery command.
- [ ] After each discard wave, Wiki validation, reference/link scans, render,
      catalog/Taskboard checks, append-only validation, `doctor`, the full suite
      and a cold-route read are green with no `discarded-reference` residue.
- [ ] A corrective Task against one discarded capability updates its Wiki claim
      without restoring `SPEC.md`, and a sampled recovery command restores the
      complete historical directory from Git in a disposable checkout.
- [ ] The final migration report accounts for all 50 original paths, every
      retirement and discard commit, every durable destination, limitations and
      remaining non-migrated records.

## Testing Seams

- `loadSpecs`, `loadRetiredSpecs`, `referencesToPath`, `scanReferences`,
  `retireSpec`, `discardRetiredSpec`, `createOrphanCorrectiveTasks`,
  `resolveMovingCommit` and `nextIdentity` in
  `workbench/tools/spec-workbench.mjs`.
- `workbench/tools/wiki.mjs` validation and `workbench/wiki/MEMORY.md` routing.
- `tools/test-spec-workbench.mjs` disposable repositories for allocator,
  retirement, discard, recovery and corrective-Task red/green cases.
- `tools/test-wiki.mjs`, `tools/test-adr.mjs`,
  `tools/test-spec-citation-anchors.mjs`, `tools/test-controls-vocabulary-sweep.mjs`
  and `tools/test-check-append-only.py` for content and preservation boundaries.
- The real-room reference inventory, `render`, `doctor`, catalog/Taskboard
  projection and a fresh-reader route check for each batch.

## Verification Procedure

For TK-0Q1 and any behavior repair, first add a failing fixture at the named
stable seam and confirm the expected red result; implement the smallest repair
and turn it green. For each content batch, first produce a failing migration
matrix showing an unowned current claim or current consumer; then transform the
claims, redirect consumers and prove the matrix complete before retirement.

Run targeted seams for the touched batch, then the complete verification suite
named in `AGENTS.md`, `node workbench/tools/wiki.mjs validate`,
`node workbench/tools/spec-workbench.mjs render`, and
`node workbench/tools/spec-workbench.mjs doctor`. Before every discard, refresh
the declared default-branch remote-tracking ref, prove exact containment, run
the complete current-reference scan, and exercise the printed recovery command
in a disposable clean checkout. After discard, repeat link/reference scans and
the cold-route read; do not accept a transient selection-blocking diagnostic as
an expected end state.

## Documentation Impact

The implementation creates exactly one article per legacy Spec in
the manifest-declared Wiki collections and routes them from
`workbench/wiki/MEMORY.md`. Existing ADR/source/test/control/Runbook owners are
updated only when a migrated current claim belongs there. `CATALOG.md` and
`TASKBOARD.md` are regenerated projections. `DISCARDS.md` is tool-owned and is
created/appended by successful discard operations, never hand-authored.

Article preparation is now authorized; runtime repairs are delivered by S-00T.
This clarification performs no real retirement or discard.

## Append-Only Evidence And Execution Log

| Date | Commit | Claim | Method | Result |
|---|---|---|---|---|
| 2026-09-18 | 8dc257e | S-00Q planning baseline established from the owner-directed review | Parsed every top-level Spec header, ran `referencesToPath` across each completed directory, inspected the lifecycle and release owners, and ran `doctor --json` plus `next-id --prefix S --json` | 50 completed active-roster Specs, 19 with zero incoming references and 89 references total; S-00H is the sole retired Spec; next-id incorrectly proposes used S-00H; four discard hazards remain disclosed; no migration or lifecycle mutation performed |
| 2026-09-18 | planning tree | S-00Q and ten Tasks are valid, collision-free planning records and remain unactivated | Rendered catalog; ran `show`, `report`, `next`, `doctor`, citation anchors, Wiki/ADR/control/spec-report and the full AGENTS suite; scanned 109 local and remote-tracking refs for S-00Q/TK-0Q0-TK-0Q9 | Render/show/report/citations and 42 of 44 suite commands passed; `next --json` remained null and doctor retained the same 48 nonblocking baseline findings. `test-spec-workbench` hit its pre-existing UTC-date-sensitive S-602 fixture (2026-09-17 became stale while the assertion expects clean). `test-check-append-only.py` did not finish under concurrent copies and was stopped without a result. No ID collision found and no implementation activated |

| 2026-09-19 | owner direction in implementation session | Legacy migration approach clarified | Owner first said "I guess we should review some things, but I figured adding them all to the wiki or somewhere else durable would be good, like we do with current specs we get rid of"; then corrected "No like each spec should be a spec artical in the wiki please" | Exactly one Wiki article per legacy Spec; batches organize work and review only. Preserve useful capability knowledge, decisions, limitations and proof references. This supersedes the initial grouped-article plan; concrete batch approval and default-branch discard gates remain open. S-00T delivers TK-0Q1 runtime repairs once |

| 2026-09-19 | source baseline bc370fe742d5ddb8348bf361fccea31205f6cee7; article byte identities in MIGRATION_INVENTORY.json | Prepared exactly 50 individual article routes and frozen claim-group inventory | Compared baseline complete Spec IDs against article IDs; hashed baseline/current source, articles and linked owners; checked local article links; indexed each level-two source section and captured referencesToPath consumer snapshot | 50/50 IDs, no duplicate or extra article; linked paths resolve. S-027/S-028 current source differs by later evidence, recorded separately. Section coverage is not atomic claim completeness; semantic review and consumer reconciliation remain open. Owner clarification does not select a retirement QA mechanism; no retirement/discard performed |

| 2026-09-19 | original baseline bc370fe742d5ddb8348bf361fccea31205f6cee7; initial articles e7b0906; corrected article hashes in MIGRATION_INVENTORY.json | Independent semantic review of all 50 individual articles | Article reviewer did not author articles; compared core capabilities, decisions and limitations with pinned records, spot-checked evolved runtime/test seams, then read back S-051 single-source/compatibility and S-053 five-check corrections; verified article hashes and local links | PASS for per-Spec article preparation. Two omissions corrected; no other material misrepresentation found in reviewed scope. Not exhaustive atomic-claim certification, fresh host proof, consumer migration or retirement/discard approval |

## Completion Result

All 50 individual Wiki articles are authored. The [readable matrix](MIGRATION_MATRIX.md)
and [machine inventory](MIGRATION_INVENTORY.json) pin the original 50 complete
records at `bc370fe742d5ddb8348bf361fccea31205f6cee7`, their article hashes,
section-level claim groups, linked owners and consumer snapshot. Structural
coverage and bounded independent article semantic review pass. Consumer migration,
retirement QA and lifecycle gates remain open; exhaustive atomic-claim equivalence
and fresh native-host proof are not claimed. No real legacy record has retired or been discarded.

## Remaining Limitations Or Follow-Up Specs

S-014 and S-022 need current-facing disposition by S-00K's owner-led planning;
S-050 remains active and its live external proof stays with S-052. They are not
part of the 50-record batch and no result here closes them. Actual default-
branch containment must be refreshed at execution time; the planning baseline
uses local tracking refs and performed no fetch.

## Supersession

- Supersedes: none.
- Superseded by: none.
