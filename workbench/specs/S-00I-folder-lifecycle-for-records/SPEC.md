# S-00I - Retirement Lifecycle By Folder For Records

**Spec ID:** S-00I
**Status:** active
**Priority:** 3
**Owner:** DISPATCHER
**Stance:** Builder
**Updated:** 2026-09-23
**Catalog description:** Express ADR, Spec and Task lifecycle by folder location, reconcile completed Specs and Tasks into readable durable owners before retiring them, and discard retired records only through a verified gate; permanent `archive` is never cleared.
**Blockers:** none; S-00H is `complete` (integration `49c671e`).
**Latest event:** Owner clarified on 2026-09-23 that Human QA has been underway since 2026-09-19 and its reviews have failed. The earlier 51-check/source-review PASS is separate proof; no owner approval is recorded.
**Next gate:** Reconcile the ongoing Human QA findings against this Spec, carry attributable corrections or a return to Align, and inspect a fresh result. Do not request that the owner start Human QA again.

> **Citation anchors.** pre=`e3c5c8f343ec36d411bb6b9ea656e0f53c7406cb` post=`e3c5c8f343ec36d411bb6b9ea656e0f53c7406cb`.

## Outcome

The active roster of any record collection is its top-level directory listing.
Superseded and deprecated ADRs live permanently in `archive`. A completed Spec
and its Tasks are reconciled into readable durable owners, the Wiki holding
current capability knowledge, and then retired into `retired`, out of ordinary
discovery but reachable by an explicit historical route. After the exact
change is verified on `main`, a retired record may be discarded through a gate
that proves nothing current depends on it and Git still recovers it. Folder
location is the source of lifecycle truth, so lifecycle `status` frontmatter
goes away and two places cannot disagree. Specs and Tasks are transient
working artifacts; they are not kept as the product documentation.

## Why It Matters

Lifecycle is invisible until a record is opened. An agent cannot read the active
roster off a directory listing, and nothing prevents a record whose location and
status disagree. Completed Specs accumulate in the same directory as active
ones, so a cold-start agent loads finished work as if it were current. The
owner settled on 2026-09-16 that the enduring surfaces are the Blueprint, the
Wiki and the Taskboard, that a Spec closes when its destination is actually
there, and that once its useful content is readable documentation the Spec and
its Tasks are clutter to throw away, with Git preserving history. Two
deliberately opposite retentions keep that disposal from ever being pointed at
permanent ADR history.

## Current Verified State

At the pre anchor, `workbench/docs/adr/` is flat: 52 record files plus
`REGISTER.md` and `HISTORY.md`, no subdirectories. Lifecycle is read from
frontmatter `status`; `workbench/tools/adr.mjs` lists the directory flat,
filters `accepted` to build `REGISTER.md`, and writes `HISTORY.md` unfiltered.
`adr.mjs` requires `superseded_by` to be one whole-record filename with no
path, so successor resolution is not folder-aware. 30 record files carry a
relative link to another ADR record, which breaks when a target moves, and 19
accepted records name a live `workbench/specs/S-*` path. `workbench/specs/`
holds 64 `S-*` directories, so the moving unit for a Spec is a directory, not
a file. Every count here was taken at the pre anchor and is a floor for the
build, which re-counts before it migrates; `spec-workbench.mjs`
loads only top-level directories, and `CATALOG.md` says it "includes completed
history". `AGENTS.md` still requires a declared Spec path never to move between
active, done and archive folders, the direct inverse of this model. No command
reconciles a completed Spec into the Wiki; `workbench/tools/wiki.mjs` validates
that the Wiki holds no copied task state. ADR-000I is `proposed`; its text
ties clearing to the held FND-Q07/FND-Q08 gate, which the WF answers have
since settled.

## Desired Behavior

Moving a record between lifecycle folders is a supported operation that leaves
every link correct. Reachability comes from links being maintained, not from
paths never changing. A tool resolving a successor finds it wherever it lives.
`doctor` reports a record whose location and content disagree.

The lifecycle runs in the locked WF-8E order: assembled-Spec review passes,
the Spec reaches `integration`, owner Human QA confirms the destination is
there, the Spec closes, its surviving current claims are transformed into
readable durable owners (Wiki capability knowledge and guidebooks, ADRs for
consequential decisions, source, tests and assets for implemented actuality,
the Blueprint where direction changed), and `SPEC.md` with its Tasks enters
`retired`. A Task is reconciled into its Spec and retired as soon as its
result and proof are carried, and its contained branch and worktree are
cleaned up. No Git merge closes anything by itself.

Discard is separate and gated: only after the exact change is verified on
`main`, only when a complete reference and link scan finds nothing current
pointing at the record, only when the immutable commit and historical path
remain recoverable from Git, and never for `archive`. A later gap against a
retired Spec's destination is a corrective Task that updates the reconciled
Wiki record; `SPEC.md` is never resurrected.

## Decisions And Contracts

- The design this Spec implements is the set of locked WF-8D, WF-8E, WF-8F,
  WF-8A and WF-8G answers in the WF grilling note at revision 57, carried by
  [S-00O](../S-00O-workbench-v4-0-0-release/SPEC.md) and promoted into the
  controls by [S-00P](../S-00P-workflow-canon-rework/SPEC.md). The note is
  untracked working material named as origin, not durable evidence.
- Folder lifecycle, the two opposite retentions and the stable-path
  retirement are described by
  [ADR-000I](../../docs/adr/proposed/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md),
  which is `proposed` and is evidence, not instruction. Where its text and
  the locked answers disagree (clearing tied to the FND-Q07/FND-Q08 hold;
  `retired` cleared by folder movement alone), the locked answers govern this
  Spec, and S-00P TK-004 accepts, amends or supersedes the record to match.
  ADR acceptance is not a blocker of this Spec.
- Complete ADR history stays reachable with original bodies preserved, which
  `archive` must never violate:
  [ADR-000A](../../docs/adr/000A-active-adr-decisions-and-destination-blueprints.md).
- A Task must be a record before it can occupy a folder:
  [ADR-000H](../../docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md),
  delivered by [S-00H](../retired/S-00H-task-artifact-and-terminology-migration/SPEC.md).
- Reconciliation transforms; it does not copy. The Wiki's copied-task-state
  validation stays in force, so a reconciliation that pastes a Spec into the
  Wiki fails.
- The `AGENTS.md` stable-path rule is retired by TK-004 in the same change
  that makes moves link-safe, with its reason stated; S-00P phase two
  preserves that change.
- The bootstrap route: each Task lands as its own reviewed PR into
  `integration` under S-00O exemption 2.

## Non-Goals

- Deleting or rewriting any ADR body, or clearing `archive` under any gate.
- Re-anchoring citations in completed Specs.
- Keeping completed Specs as the maintained current capability documentation.
- Discarding anything before the gate in TK-006 exists and passes.
- The assembled-Spec review, corrective-Task creation and Human QA approval
  that precede closure; those are S-00J. This Spec starts at a closed Spec.

## Dependencies And Blockers

S-00H is `complete` (integration `49c671e`), so nothing blocks this Spec
externally; the sequencing below was written while it was pending. TK-004
needs the standalone Task record S-00H TK-001 delivers, and `claim`'s blocker
model resolves whole completed Spec IDs and this Spec's own done Task IDs, so
the dependency is expressed at Spec granularity and the owner's two-lane limit
is respected. The earlier
FND-Q07 and FND-Q08 HELD blockers are dropped: decision-079 (WF-8E) and
decision-080 (WF-8F) answered them, settling that Specs and Tasks are transient
and the Wiki owns current capability knowledge. The FND note's own register
still reads `held`; that stale register is untracked working material, not a
blocker, and nothing in this Spec depends on it.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Make ADR successor and link resolution folder-aware | done | S-00H | Red at the pre anchor 956c6a4 in tools/test-adr.mjs: a superseded record whose successor lives in a lifecycle subfolder fails (listAdrs returned one record, not two; validateAdrs reported a missing superseded_by target), and a fixture record with a wrong relative link produced no finding. Green: ADR_LIFECYCLE_FOLDERS = ['proposed', 'archive'] exported (retired excluded per ADR-000I); listAdrs enumerates the top level and those folders, tagging each record's folder; superseded_by resolves by bare record name across them while a path or fragment is still refused and a successor found nowhere is invalid-adr, never a throw; register rows link the successor's real relative path; validateAdrs raises invalid-adr naming the record and the missing target for a body link inside the collection that does not exist; a corpus test walks the real workbench/docs/adr and pins 33 files carrying 58 intra-ADR link edges, all resolving literally; flat collections list identically to before; REGISTER.md and HISTORY.md byte-identical at the candidate; test-adr 20/20. Full 43-command suite on the committed tip 4a3b583, reproduced by the reviewer on a clean worktree; doctor no blocking finding; render no-op. Separate-context review (Claude Opus 5): 856a31f FAIL on two Highs (a basename fallback in the corpus test let a planted wrong link in the real corpus stay green with adr validate and doctor clean; identity resolution for links lived only in the test), corrected in 4a3b583 and re-reviewed PASS with the real-corpus mutation red in both the test and adr validate (exit 1), a correct cross-folder link clean, links outside the collection unchanged, and mutations A-C caught. Built by Claude Sonnet 5 from the lane handoff. Landed by PR #116; integration 731f28a contains 4a3b583 |

### TK-001 - Make ADR successor and link resolution folder-aware

**Stance:** Builder

`adr.mjs` rejects a `superseded_by` containing a path separator today. Add the
failing test first: a superseded record whose successor lives in another folder.
Then implement resolution that finds a record by identity rather than by
assumed location, and prove every relative intra-ADR link still resolves; 30
record files carry one at the anchor, and the build re-counts first.

### TK-002 - Move ADR lifecycle from frontmatter status to folder location

**Stance:** Builder

Migrate every record (52 at the anchor; re-count first). `REGISTER.md` must be byte-stable across the migration for
every record whose lifecycle does not change; that is the proof the projection
reads location correctly rather than coincidentally. Superseded and deprecated
records go to permanent `archive` with bodies untouched. Records still
`proposed` go to `proposed`.

### TK-003 - Apply folder lifecycle to Spec directories and repair every live reference

**Stance:** Builder

The moving unit is a directory across every spec (64 at the anchor). Every
accepted ADR that names a live spec path (19 at the anchor) must still resolve
afterward. Run a complete reference and link scan
as the green proof, not as a spot check. `spec-workbench.mjs` loads only
top-level directories, so decide and prove what `CATALOG.md` says about a
retired Spec: name it by its historical route, or stop claiming to include
completed history. Move no real Spec in this slice; the fixture proves the
path, and TK-005 performs the first real retirement.

### TK-004 - Apply folder lifecycle to Task records and retire the stable-path rule

**Stance:** Builder

Depends on the standalone Task from S-00H. Retire the `AGENTS.md` stable-path
rule with its reason stated in the same change, since the locked WF-8F answer
reversed the premise that rule served. Do not reinterpret it as a rule about
absolute paths. This is the one control edit this Spec makes; the wider
`AGENTS.md` rewrite is S-00P TK-002 and must preserve it.

### TK-005 - Reconcile a closed Spec and its Tasks into durable owners and retire them

**Stance:** Builder

Implement the reconciliation step at the point WF-8E places it: after owner
Human QA has closed the Spec (S-00J records that closure). Transform surviving
current claims into their named durable owners; the Wiki capability record is
readable prose about what the capability is and why it is trusted, not a copy
of the Spec, and `wiki.mjs` validation must still pass. Then move `SPEC.md`
and its Task records into `retired`, clean up contained branches and
worktrees after proving containment, and prove `next`, `render` and ordinary
traversal no longer surface them while an explicit historical route still
does. Retire a reconciled Task the same way as soon as its result and proof
are carried into the Spec.

### TK-006 - Gate discard of retired records on verified `main`, a clean reference scan and recoverable Git identity

**Stance:** Builder

Discard is `git rm` of a retired record, never of `archive`. It refuses unless
the exact change is verified contained on `main`, a complete reference and
link scan finds nothing current pointing at the record, and the immutable
commit plus historical path are recorded so Git recovers it. Prove a later
corrective Task loads the reconciled Wiki capability claim and updates it
without restoring the retired `SPEC.md`. This slice honors the locked WF-8D
caveat: it approves no irreversible evidence deletion, because Git history and
the reconciled owners preserve the evidence.

## Acceptance Criteria

- [x] The active roster of each collection is its top-level directory listing.
- [x] Superseded and deprecated ADRs live in `archive` with bodies unmodified
      and complete history still reachable; nothing ever clears `archive`.
- [x] Lifecycle `status` frontmatter is removed from records whose lifecycle
      folders now carry it.
- [x] Successor resolution and every intra-ADR link work across folders,
      counted at build time.
- [x] Every ADR-to-spec path reference resolves after Spec directories move,
      and `CATALOG.md` is truthful about retired Specs.
- [x] Task records move between lifecycle folders and the `AGENTS.md`
      stable-path rule is retired with a stated reason.
- [x] A closed Spec and its Tasks are reconciled into readable durable owners
      without copying task state into the Wiki, then retired out of ordinary
      discovery with an explicit historical route.
- [x] Discard refuses before verified `main`, a clean complete reference scan
      and recoverable Git identity, and always for `archive`; after every gate
      it succeeds and a corrective Task still works against the Wiki record.
- [x] The full verification suite passes and `doctor` is clean.

## Testing Seams

`workbench/tools/adr.mjs` listing, validation and register generation; the
spec and Task resolution paths in `workbench/tools/spec-workbench.mjs`; the
manifest collection resolution in `workbench/tools/workbench-paths.mjs`;
`workbench/tools/wiki.mjs` copied-task-state validation; the retirement and
discard refusal seams; and the complete reference and link scan.

## Verification Procedure

Run the targeted test for the touched seam, then the full verification suite
named in `AGENTS.md`, then
`node workbench/tools/spec-workbench.mjs doctor`, then a complete reference and
link scan across the repository. Each Task lands as its own reviewed PR into
`integration` under S-00O exemption 2.

## Documentation Impact

TK-004 retires the `AGENTS.md` stable-path rule with its reason. Everything
else this Spec changes in `AGENTS.md`, `RUNBOOK.md` (move, reconciliation,
retirement and discard procedures) and `LEXICON.md` (`archive`, `retired`,
`proposed` with their opposite retentions) is written by S-00P phase two,
which is blocked on this Spec, so that the procedures name only commands that
exist. The generic `templates/` mirror changes in S-00P TK-005.

## Append-Only Evidence And Execution Log

| Date | Commit | Claim | Method | Result |
|---|---|---|---|---|
| 2026-09-12 | c0ac60a | Spec authored; no implementation performed | Read-only structural survey | ADR dir flat with 44 records; `superseded_by` rejects paths; 22 intra-ADR links and 16 ADR-to-spec references confirmed; 56 spec directories |
| 2026-09-12 | b4edb20 | Review found Documentation Impact retired the stable-path rule "at ADR acceptance", before TK-001/TK-003 make moves link-safe | Re-read this Spec's own ticket sequencing against its Documentation Impact claim | Corrected Documentation Impact to keep the stable-path rule in force until TK-001 and TK-003 land; `LEXICON.md`'s vocabulary definitions remain landable at ADR acceptance; no implementation performed |
| 2026-09-12 | f2d2e87 | The 2026-09-12 `c0ac60a` row above overstates its own survey: it reports 22 intra-ADR links, 16 ADR-to-spec references and 56 spec directories | Re-counted at `c0ac60a`; `git ls-tree -d --name-only c0ac60a workbench/specs/` returns 54 `S-*` directories | Verified counts at `c0ac60a` are 20 intra-ADR links, 15 ADR-to-spec references and 54 spec directories. The body of this Spec and ADR-000I already carry the corrected figures. The row above is left at its first-published text because evidence rows are append-only; this row is the correction of record |
| 2026-09-16 | e3c5c8f | Rewritten against the WF grilling note at revision 57 under directive-018: retirement follows Wiki reconciliation (WF-8D, WF-8E, WF-8F), corrective Tasks work against the Wiki record (WF-8A), discard is gated on verified `main` (WF-8F) and never touches `archive`; ADR-000I acceptance and the FND-Q07/FND-Q08 hold removed as blockers; TK-005 and TK-006 added; no implementation performed | Read decisions 070, 073, 079, 080, 081 and correction-023 against every section; `git ls-tree -d --name-only e3c5c8f workbench/specs/` returns 56 `S-*` directories; ADR-000I confirmed `proposed` at the anchor | Status `blocked` on S-00H only; anchors moved to the integration tip the rewrite read at; TK-001 to TK-004 kept with the stable-path retirement now owned by TK-004 alone |
| 2026-09-16 | e3c5c8f | The row above and the rewrite it describes re-asserted the `c0ac60a` survey counts (44 records, 20 links, 15 references, 56 directories) at the new anchor without re-counting, and stated that `git ls-tree -d --name-only e3c5c8f workbench/specs/` returns 56 `S-*` directories, which it does not | Separate-context review of PR #94 re-counted at `e3c5c8f`: that command returns 64 `S-*` directories; the ADR directory holds 52 record files; 30 record files carry a relative link to another record; 19 accepted records name a `workbench/specs/S-*` path | Current Verified State, TK-001 to TK-003 and the acceptance criteria now carry the anchor counts with their method and require a re-count at build time; the row above is left as first published because evidence rows are append-only, and this row is the correction of record |
| 2026-09-18 | TK-001 | Task closed | Red at the pre anchor 956c6a4 in tools/test-adr.mjs: a superseded record whose successor lives in a lifecycle subfolder fails (listAdrs returned one record, not two; validateAdrs reported a missing superseded_by target), and a fixture record with a wrong relative link produced no finding. Green: ADR_LIFECYCLE_FOLDERS = ['proposed', 'archive'] exported (retired excluded per ADR-000I); listAdrs enumerates the top level and those folders, tagging each record's folder; superseded_by resolves by bare record name across them while a path or fragment is still refused and a successor found nowhere is invalid-adr, never a throw; register rows link the successor's real relative path; validateAdrs raises invalid-adr naming the record and the missing target for a body link inside the collection that does not exist; a corpus test walks the real workbench/docs/adr and pins 33 files carrying 58 intra-ADR link edges, all resolving literally; flat collections list identically to before; REGISTER.md and HISTORY.md byte-identical at the candidate; test-adr 20/20. Full 43-command suite on the committed tip 4a3b583, reproduced by the reviewer on a clean worktree; doctor no blocking finding; render no-op. Separate-context review (Claude Opus 5): 856a31f FAIL on two Highs (a basename fallback in the corpus test let a planted wrong link in the real corpus stay green with adr validate and doctor clean; identity resolution for links lived only in the test), corrected in 4a3b583 and re-reviewed PASS with the real-corpus mutation red in both the test and adr validate (exit 1), a correct cross-folder link clean, links outside the collection unchanged, and mutations A-C caught. Built by Claude Sonnet 5 from the lane handoff. Landed by PR #116; integration 731f28a contains 4a3b583 | Docs checked; no update needed: RUNBOOK.md Architecture Decision Records already describes adr validate and register, no verb or option was added, and the lifecycle folders are documented by ADR-000I; the S-00I TK-002 lane handoff records that links are literal and its migration must rewrite every link to a moved record | invalid-adr is registered with effect none (error, non-blocking), so the blocking safety net for a broken intra-ADR link is adr validate (exit 1), not doctor; TK-002 must not rely on doctor alone. The pinned 33/58 link count is re-asserted per candidate and must be re-pinned after TK-002 moves records. The Spec's TK-001 text said 30 files at its anchor; the live count is 33 |
| 2026-09-18 | TK-002 | Task closed | Red at the pre anchor df73041 in tools/test-adr.mjs: a fixture collection placed in lifecycle folders with the status key removed renders REGISTER.md and HISTORY.md differently and fails validation, and a record physically moved to proposed/ that still says accepted raises nothing. Green: adr.mjs derives lifecycle from location (top level accepted, proposed/, archive/ for superseded and deprecated, using ADR_LIFECYCLE_FOLDERS from TK-001), keeps superseded_by and deprecation_reason as facts, accepts a leftover status key only when it agrees and otherwise raises the new attention finding disagreeing-status (pinned in tools/test-diagnostics.mjs), writes new records into the implied folder with no status key, and never moves a file in normalizeAdrs; a one-shot migrate-folders command refuses a dirty tree and a second run, moves records with git mv semantics, strips the status key and rewrites every live Markdown link to a moved record across the repository, counting historical references it leaves; run on this room in its own commit it moved nine records (two to archive/, seven to proposed/), stripped 52 keys, rewrote links in ten ADRs and the Decisions sections of five Specs (S-00G, S-00H, S-00I, S-00J, S-024) and left zero historical references because no append-only row links a moved record by path; REGISTER.md byte-identical, HISTORY.md differing only in the nine moved rows' link cells, bodies untouched beyond the key and link targets, the intra-ADR link count re-pinned at 33 files and 58 edges, test-adr 27/27, adr validate clean, check-append-only CLEAN. Full 44-command suite on the committed tips 2eb16fd and acb792b, reproduced by the reviewer on clean worktrees; doctor no blocking finding, no adr-scope finding, no new broken-link; render no-op. Separate-context review (Claude Opus 5): 2eb16fd PASS with one Medium (newAdr still wrote status: proposed into a proposed/ record) and Lows, five mutations behaving as expected (disagreeing-status raised, second run and dirty tree refused, a reverted link red in adr validate and the corpus test, a hand-moved accepted record dropped from the register but reported loudly); corrective acb792b re-reviewed PASS with the red proven at 2eb16fd. Built by Claude Sonnet 5 from the lane handoff. Landed by PR #122; integration 3e4fea4 contains acb792b | RUNBOOK.md Architecture Decision Records gains the migrate-folders line and the folder-lifecycle sentence in this state PR; the Documentation Impact of this Spec defers the archive, retired and proposed vocabulary in LEXICON.md and the lifecycle procedures to S-00P phase two; ADR-000I itself now lives under proposed/ with its links repaired; templates untouched | The rejected lifecycle has no folder in STATUS_TO_FOLDER, so such a record would keep its status key at the top level (the corpus holds none). Two frozen JSON artifacts in completed Specs (S-048 checkpoint inventory, S-00A claim disposition) still carry pre-migration ADR paths as historical snapshots. A hand-moved accepted record drops from REGISTER.md and is reported by adr validate and doctor rather than prevented. Fresh rooms generated by the harness do not yet create proposed/ and archive/ (created on first use; S-00O release surface). The acceptance line about the active roster of each collection stays open until TK-003 and TK-004 cover Specs and Tasks |
| 2026-09-18 | TK-003 | Task closed | Red at the pre anchor 672e354: tools/test-spec-workbench.mjs fails to load on the missing exports, and with them stubbed a fixture Spec moved by hand into retired/ vanishes from loadSpecs with no finding while references to its old path stay stale; tools/test-adr.mjs fails twice because normalize still inserts a status key. Green: moveSpecDirectory(rootDir, specId, folder) and the move-spec verb move a complete Spec's directory into the specs lane's retired/ with git mv semantics after refusing a dirty tree, a non-complete Spec, a folder outside SPEC_LIFECYCLE_FOLDERS (retired only; archive stays ADR-only per ADR-000I) and a room without Git; every live Markdown reference across the repository is rewritten from a complete map (every referencing file mapped to itself, the moving files layered on top) so the moved Spec's own outgoing links recompute and untouched files stay byte-identical, ADR canonicalized_in frontmatter is rewritten, REGISTER.md and HISTORY.md are regenerated in the same operation, append-only rows are left and counted, and everything is staged; loadSpecs keeps the top level as the active roster while loadRetiredSpecs and a findSpec fallback give the historical route (show finds a retired Spec; next, claim, render and the hot board ignore it); CATALOG.md gains a Retired heading only when populated; the attention finding retired-not-complete flags a retired Spec whose status is not complete; duplicate-id refuses reuse of a retired id; scanReferences is a complete evidence-aware scan over Markdown links, canonicalized_in targets and the register's path cells, with planted stale references found by test; 20 accepted ADR files carrying 23 resolving Spec links pinned; adr normalize inserts only the date. Full 44-command suite on the committed tips c930bbb, 451df4f and 07ef26c, reproduced by the reviewer on clean worktrees; a real-room dry run on a copy moving S-00H rewrote six outgoing links in the moved Spec and ten references in six files, touched no unrelated file, left scan and adr validate empty and doctor after render deep-equal to the unmoved baseline; the room itself is byte-identical with no real Spec moved. Separate-context review (Claude Opus 5): c930bbb FAIL on two Highs (the moved Spec's own links and canonicalized_in unrewritten; a scan filtered to the fixture hid both), 451df4f PASS with one Medium (register left stale after a move), 07ef26c re-reviewed PASS with every mutation red. Built by Claude Sonnet 5 from the lane handoff. Landed by PR #126; integration 963ef92 contains 07ef26c | RUNBOOK.md Architecture Decision Records: the normalize paragraph now says only the date is inserted, in this state PR; Spec Lifecycle And Retrieval gains the move-spec line; the AGENTS.md stable-path sentence stays until TK-004 retires it; retirement procedure prose is S-00P phase two | The AGENTS.md stable-path rule is still in force while move-spec makes a violating move one command away; TK-004 retires the rule with its reason. ADR-000I's promotion text still describes a flat collection with live status frontmatter (S-00P TK-004). historicalReferencesLeft is exercised only by the fixture because this room has no evidence-row link to a Spec path. The retired Spec is reachable by show but not yet by TASKBOARD or a wiki route; TK-005 performs the first real retirement and TK-006 gates discard on scanReferences |
| 2026-09-18 | TK-004 | Task closed | Red at the pre anchor dc667ae: tools/test-spec-workbench.mjs fails to load on the missing exports and, with them stubbed, listTaskRecords throws on a record moved by hand into tasks/retired/ and references to its old path stay stale; tools/test-control-fidelity.mjs fails because AGENTS.md still carries the stable-path sentence. Green: moveTaskRecord(rootDir, specId, taskId, folder) and the move-task verb move a done Task record into its Spec's tasks/retired/ with git mv semantics (TASK_LIFECYCLE_FOLDERS = ['retired']) after refusing a dirty tree, a Task that is not done, another folder and a Task with neither Proof nor a Receipt row; every live reference is rewritten with TK-003's complete map and the ADR register regenerated; the top-level tasks/ stays the active roster while listRetiredTaskRecords and the retiredTasks key on show give the historical route; next, claim, close, receipt and render ignore retired Tasks and report lists them as history; the attention finding retired-task-not-done flags a retired record that is not done; duplicate-id refuses id reuse; moveSpecDirectory carries unretired Tasks with the directory; the AGENTS.md Edit Scope stable-path sentence is replaced by the folder-lifecycle rule (ADR-000I, WF-8F) naming move-spec and move-task and the reason the old rule is retired, mirrored generically in templates/AGENTS.md and held by a control-fidelity assertion that failed first; no real Task moved. Full 44-command suite on the committed tips 118e667 and 800f194, reproduced by the reviewer on clean worktrees; guardrail 106.6/113 equal to the base; a real-room dry run on a copy moving S-00H/TK-003 (Proof, no Receipt row) succeeded with doctor unchanged; the room byte-identical apart from the two control sentences. Separate-context review (Claude Opus 5): 118e667 PASS with one Medium (the nothing-to-carry guard was OR while its comments and message said AND, leaving S-00H/TK-003 unretireable) and Lows; the keep-both merge of S-00J TK-004 plus corrective 800f194 re-reviewed PASS with ten of ten mutations behaving. Built by Claude Sonnet 5 from the lane handoff; the original builder was rate-limited after committing and a fresh builder did the merge and corrective pass. Landed by PR #130 through the gated recipe; integration 69ab33b contains 800f194 | AGENTS.md Edit Scope and templates/AGENTS.md carry the folder-lifecycle sentence from the lane (the one control edit this Spec makes); RUNBOOK.md Spec Lifecycle And Retrieval gains the move-task line in this state PR; retirement procedure prose is S-00P phase two | One duplicated comment block sits above writeRegister in moveTaskRecord (cosmetic). The template mirror carries no bracketed token; it is generic and asserted so. move-task makes a real move one command away; TK-005 performs the first real retirement and TK-006 gates discard. The active roster of each collection is now its top-level listing for ADRs, Specs and Tasks, and ADR lifecycle frontmatter is gone; Specs and Tasks keep their header Status field as the record's own state, which the folder does not replace |
| 2026-09-18 | TK-005 | Task closed | Red at the pre anchor 0ba9bc4: tools/test-wiki.mjs accepted a note that pasted a Spec evidence row; tools/test-spec-workbench.mjs failed to load on the missing retireSpec export and, with it stubbed, a retired Spec vanished from loadSpecs with no finding and showed no historical route. Green: retireSpec(rootDir, specId, { wikiNote }) and the retire-spec verb refuse by name before any write unless the Spec is complete, every Task record done, every acceptance box checked with a real Completion Result, the latest owner Human QA for the current content digest is an approval, and the Wiki note exists under the Wiki lane with a design-concept or guidebook type and a canonical or curated role, names the retired route in source_paths, passes validateWiki with no copied-task-state and is linked from MEMORY.md; then one six-cell retirement row is appended before the move so it travels, the directory moves into retired/ through moveSpecDirectory with its Tasks, branches named in Receipt rows are cleaned only after proving containment (local git branch -d and worktree removal; remotes listed), unmerged branches naming the Spec are listed and never deleted, render and the ADR register run, and a JSON receipt returns; show prints a Retired route banner, report still assembles a retired Spec, a pasted evidence row trips copied-task-state, and the attention finding retired-wiki-owner-stale flags a retired Spec whose Wiki note is missing or not active. The first real retirement landed in its own commit: S-00H moved to workbench/specs/retired/ with seventeen references rewritten in seven files, the register and catalog regenerated, no branch left to clean and the three unmerged S-00H state branches listed, and the Wiki article workbench/wiki/design-concepts/task-artifact-and-lifecycle.md routed from MEMORY.md; S-00H completed and was retired before the owner-approval gate existed, so its receipt records ownerApproval required false and the gate applies to every later retirement. Full 44-command suite on the committed tips 2694e54 and 4f0a2aa, reproduced by the reviewer on clean worktrees; check-append-only CLEAN with no existing row moved; 255 links audited with none broken; next, doctor and the board unchanged. Separate-context review (Claude Opus 5): 2694e54 PASS with one Medium (adopt the approval gate at merge) and Lows; the keep-both merge of S-00J TK-005 plus corrective 4f0a2aa re-reviewed PASS with six mutations red and the refusals reproduced live on the real room. Built by Claude Sonnet 5 from the lane handoff. Landed by PR #134 through the gated recipe; integration abfeaa2 contains 4f0a2aa | workbench/wiki/design-concepts/task-artifact-and-lifecycle.md authored and routed from workbench/wiki/MEMORY.md in the lane; LEXICON.md, ADR-000H, REGISTER.md, HISTORY.md, CATALOG.md and the Decisions sections of S-00I, S-00J, S-00M and S-00O carry the rewritten S-00H route; RUNBOOK.md Spec Lifecycle And Retrieval gains the retire-spec line and its sentence in this state PR; retirement procedure prose is S-00P phase two | The MEMORY.md routing check is a substring test on the note's path. tools/test-wiki.mjs no longer requires design-concepts to ship empty; it asserts each entry's shape. Three unmerged S-00H state branches (claude/v4-dispatch-close-S-00H-TK-003-claim-TK-004, its -b successor and claude/v4-dispatch-close-S-00H-TK-005-006) await owner deletion. Discard of a retired record is TK-006. S-00J's third acceptance line still needs the retired-folder case, assigned to the TK-006 lane |
| 2026-09-19 | TK-006 | Task closed | Red at the pre anchor bd74139: tools/test-check-append-only.py new retired-folder case failed (in-place rewrite inside a retired Specs evidence log went undetected, checker exited 0) and tools/test-spec-workbench.mjs failed to load on the missing discardRetiredSpec export. Green at e024f59: discard S-### [--task TK-###] (git rm of a retired Spec or Task record, never archive) refuses by name before any write when the record is on the active roster or outside retired/, the tree is dirty, the retiring commit is not verified contained in origin/<git.defaultBranch>, a complete reference and link scan still finds a live pointer, or a Specs durable Wiki owner is missing or inactive; a successful discard appends one row to the new tracked, append-only workbench/specs/DISCARDS.md register (Date, Kind, ID, Historical Path, Retiring Commit, Discard Parent, Recovery Command) with its recovery command exercised by the test; a discarded Specs gap routes to a corrective Task under workbench/specs/corrective/tasks/<TK-id>/TASK.md carrying Destination: wiki-claim: <note>#<heading>, selectable by next, claimable and closable, with close appending to the notes provenance:; doctor gains the new blocking finding discarded-reference (error, specs, selection); tools/check-append-only.py now enumerates a Specs retired/ lifecycle folder, which is the retired-folder assertion S-00J third acceptance line needs, pinned at tools/test-spec-workbench.mjs:4309-4386 at e024f59. Files touched: tools/check-append-only.py, tools/test-check-append-only.py, tools/test-diagnostics.mjs, tools/test-spec-workbench.mjs, workbench/tools/diagnostics.mjs, workbench/tools/spec-report.mjs, workbench/tools/spec-workbench.mjs; no Spec, Wiki, control, skill or template touched. Suite: 44-command suite at e024f59 with dirty: [], PASS_COUNT=44, SUITE_FAILURES=0 by the builder and reproduced by a separate-context Opus reviewer on a detached worktree; git merge-tree --write-tree dc28c32 e024f59 clean. Review verdict PASS on gates 1-11 (Claude Opus 5, separate context, 2026-09-18), no blockers. Landed by PR #138; integration 49ec7444f155ed8c2618fa028b791e5492561ab7 contains candidate e024f59f8073f14d5155efb409e02dad62df5f2d (two commits over bd74139: b44ca38 enumerates a Specs retired/ lifecycle folder in tools/check-append-only.py; e024f59 the discard gate). Built by Claude Sonnet 5 from the lane handoff workbench/sessions/handoffs/v4-lane-S-00I-TK-006-discard-gate-2026-09-18.md. | This state PR records the discard verb, its five refusal gates, the DISCARDS.md register and its recovery command, the corrective route against the Wiki claim, the discarded-reference finding, and check-append-only.pys retired/ enumeration in RUNBOOK.md Spec Lifecycle And Retrieval (the discard command line and a describing sentence) and in workbench/specs/S-00O-workbench-v4-0-0-release/SPEC.md as a release-surface evidence row. The DISCARDS.md register itself is tool-owned: it is created and appended only by discardRetiredSpec/discardRetiredTask, never authored by hand, and is not created by this state PR since no real discard has occurred in this room yet. S-00I acceptance line (discard gate) is checked at completion; S-00Js retired-folder acceptance line cites this assertion at its completion. | Four carried gaps from the review, none fixed in this PR: (1) discard excludes the durable Wiki owner note from its own pre-discard scan, so doctor reports discarded-reference (selection-blocking) immediately after a real discard until the note is corrected, and the receipt does not say this is the intended corrective-Task trigger; (2) createOrphanCorrectiveTasks has no duplicate-Task guard, so a second call creates two Tasks for one finding; (3) discarding the last Task under a Spec removes the emptied tasks/, flipping the record-backed check to fall back to the retained table silently (fixture-only today, no room holds a retired Task); (4) resolveMovingCommit takes the first --diff-filter=A commit for a path, an ordering bypass if a path is removed and re-added (a fix would take the last add instead). Nits: orphan next candidates omit priority/owner/nextGate; appendProvenanceRows regex is not frontmatter-bounded; git add -A after render ignores its exit status. S-00I completion and S-00Js third acceptance line remain for the completion pass. |

| 2026-09-19 | assembled verification | Full source proof and independent review passed at `58a1b3b2caaaa0ece5414d4c027d97c388ab1b1c` | All 51 commands passed in a detached clean tree; before/after HEAD and status identical; separate-context reviewer reran retired-corrective and unfinished-discard probes | Shared S-00U VERIFICATION.md plus owning documentation | Final metadata review and integration delivery pending; owner Human QA, retirement, release and native/external proof are not supplied |
| 2026-09-19 | review | Review verdict: pass at 75a565aa40d62f93903a396079bb2051bc1692ad [ed5ee32dd378] #1 | none; source and proof-state delivery reviewed, owner QA and disclosed native/external/recovery limits remain separate | independent_review; separate Codex context; inherited model not separately identified; code-review mode | 2 |
| 2026-09-19 | review | Review verdict: pass at 0c34d05c479f4a434f6b102954f9fd2768549baf [ed5ee32dd378] #2 | none | independent_review; separate Codex context; inherited model not separately identified; code-review mode; corrects prior receipt count: zero review findings | none |

| 2026-09-23 | owner correction | Human QA has been underway since 2026-09-19; the owner reports failed reviews, not a review waiting to start | Direct owner clarification on 2026-09-23; 2026-09-19 S-00I/S-00J approval audit records a failed readiness verdict on its pinned candidates; earlier 51-check and independent source PASS rows prove a different gate | Corrected current header and Taskboard projection; retained earlier evidence unchanged | No owner approval recorded; exact current findings still need per-Spec reconciliation and corrective proof |

## Completion Result

Folder lifecycle and audited discard/corrective repairs are implemented and fixture-verified. Source `58a1b3b2caaaa0ece5414d4c027d97c388ab1b1c` passed the full 51-command suite and separate-context source review. Shared [verification](../S-00U-approval-binding-and-lifecycle-digest/VERIFICATION.md) records commands, red/green cases and limits. Task delivery proof is complete; **whole-Spec closure is not approved**. Final proof-state review and integration delivery remain open; owner approval remains outstanding after ongoing Human QA. No real record was retired/discarded and no main promotion or native-host proof is inferred.

## Remaining Limitations Or Follow-Up Specs

TK-003 already corrected `adr normalize` to insert only the date, never a
lifecycle key; the earlier current-facing limitation was stale. The `rejected`
lifecycle has no folder. S-00T owns the disclosed discard/recovery/corrective
repairs and the remaining unexpected-I/O recovery limitation; S-00U owns the
completion-to-retirement digest repair. The order of closure that precedes reconciliation (assembled-Spec review,
integration, owner Human QA) is S-00J. Control and template prose for the
lifecycle is S-00P phase two. A Wiki guidebook explaining the lifecycle to
readers is optional owner-directed work.

## Supersession

None.
