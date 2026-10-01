# S-00I - Retirement Lifecycle By Folder For Records

**Spec ID:** S-00I
**Status:** active
**Priority:** 3
**Owner:** codex-close-directory-recovery
**Stance:** Builder
**Updated:** 2026-10-01
**Catalog description:** Express ADR, Spec and Task lifecycle by folder location, reconcile completed Specs and Tasks into readable durable owners before retiring them, and discard retired records only through a verified gate; permanent `archive` is never cleared.
**Blockers:** none; S-00H is `complete` (integration `49c671e`).
**Latest event:** TK-004L claimed by codex-close-directory-recovery.
**Next gate:** Close TK-004L with verification and documentation proof.

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
  [ADR-000I](../../docs/adr/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md),
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

On 2026-09-26 this Spec consumes the
[S-00J closure-capture transition contract](../S-00J-spec-qa-gate-at-integration/SPEC.md):
`complete` (T3) is gated on reviewed delivery, owner approval and main
verification, not on capture; features capture (T4) follows `complete` and
precedes retirement (T5) and discard (T6); Task records are not discarded
before capture. [TK-01U](tasks/TK-01U/TASK.md) delivers the `features`
collection, retirement eligibility and capture preconditions and is `done`
(delivered through integration 53545c27). S-00J TK-01S is also `done`;
these are satisfied prerequisites, not deferred work. [TK-01V](tasks/TK-01V/TASK.md)
retains the earlier continuous proof as limited: the assembled review reproduced
a T6 merge-restoration bypass after the same T0-T5 chain. Its strengthened proof now passes after the implementation of
[TK-003M](tasks/TK-003M/TASK.md), which followed verified
[TK-003L](tasks/TK-003L/TASK.md) manifest-reference correction.
Exact 89c938d passed the full aggregate and independent implementation/safety review, enabling the administrative Task closeout. Final closeout metadata still needs frozen validation and independent assembled review.
The Director assigns these two existing corrective records to S-00I as the
assembled capability owner; TK-003M restores the unchanged latest-incarnation
and whole-directory recovery contract of [S-00T](../S-00T-lifecycle-discard-repair/SPEC.md).
No duplicate corrective owner or S-00U approval repair is opened.

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


Acceptance 8 is proved by the exact 89c938d disposable Git fixtures: verified
main and complete reference-scan gates, immutable whole-directory recovery,
archive preservation, merge-incarnation/merge-only sibling negatives,
no-write refusal and post-discard correction all pass. These are capability
proofs; no real record disposal or owner approval is asserted.

Acceptance 9 is supported by the same clean immutable full51 result and
`doctor` exit 0 with no blocking finding, using the registered AGENTS/Runbook
diagnostic effects. Seven pre-existing informational findings remain explicit;
this is not a global zero-findings or clean Workbench update claim. The two
conservative inline scanner examples also remain visible. Administrative
metadata must pass its own frozen full51 gate before publication.

The [supplied independent implementation review](reviews/IMPLEMENTATION-89C938D.md)
binds the prior implementation identity. Final assembled closeout review,
bound Spec verdict and integration delivery remain separate pending gates.

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
| 2026-09-26 | d16ef63 | Lane H planning: TK-01U (features capture, `deferred`, released by Lane H when S-00J TK-01S is done on integration) and TK-01V (continuous T0-T6 demonstration, `blocked` on TK-01U) authored from the Dispatcher drafts to consume the S-00J closure-capture transition contract; after `git fetch origin`, `next-id` proposed TK-01U then TK-01V in order, clear of S-01U TK-01Q and S-00J TK-01R..TK-01T | Read the contract at 60849d2, both drafts and the Dispatcher report; traced `retireSpec`, `discardRetiredTask`, `wikiContractFiles` and `fidelityTargets` at d16ef63; render and doctor | Planning only; no runtime change, no owner approval, no closure; root-control and `templates/` control wording stays with S-00P |
| 2026-09-26 | review | Review verdict: pass at a626fc939b2d1bc22bb4a7b554531b2a1ae0ea03 [9ebc2aa41c67] #3 | none; TK-01U/TK-01V consume the S-00J closure-capture contract (capture at T4 after complete, before retirement/discard), source claims spot-checked, write lane bounded, IDs unique; full suite 48/48 on a626fc9, fresh-clone doctor clean | Codex CLI codex exec -s read-only -m gpt-5.5, separate context | 3 |
| 2026-09-29 | TK-01U | Task closed | Red observed on the e0c7ef1 tree with the new tests only: tools/test-workbench-layout.mjs failed 'init declares the features collection' (actual undefined, expected workbench/wiki/features); tools/test-wiki.mjs failed 'a complete, placed feature article validates with no finding' (invalid-note: type feature is not one of memory, project, person, machine, guidebook, design-concept, meta); tools/test-spec-workbench.mjs failed 'retireSpec refuses an invalid type by name' because every feature-owner refusal collapsed into 'must declare type design-concept or guidebook', and 'Task discard refuses before the parent Spec is captured' was a missing expected exception (discard removed the retired Task of an uncaptured Spec); tools/test-diagnostics.mjs failed 'uncaptured-complete must stay registered' and the PINNED_EFFECTS registry pin. Green at baae19a3 and re-verified on the integration merge 7f448f9a: layout - the additive features collection resolves, is created and seeded by init, and every pre-feature collection shape still validates and migrates additively; wiki - a feature article validates in the features collection, normalize infers its type, and a misplaced, malformed or copied one is refused; spec-workbench - retireSpec refuses a feature owner for a not-complete Spec, a missing article, an invalid type, role or path, no historical route, a malformed or copied article, a missing MEMORY.md route and an absent owner approval, each by name with the tree and index unchanged; retireSpec accepts a validated, routed features article on a complete, approved Spec and its receipt names the owner and the historical route; discard --task refuses by name, writing nothing, until the parent Spec has a captured features article (a legacy owner or an unrouted article is not a capture); doctor reports a contract-completed Spec with no captured article as attention, stays silent for a pre-contract complete Spec, and the Spec stays complete; diagnostics pins and control-fidelity's contract list green. Full suite 48/48 on 7f448f9a (log /private/tmp/claude-501/-Users-kayden-LLM-Workbench/468c56fc-a5be-4a2e-844d-d6acc4dc8740/scratchpad/logs/H-tk01u-7f448f9.log); doctor no blocking finding. Guardrail 106.6/113 before (1450e7a8) and after (7f448f9a), remaining recommendation Team coordination manager/subagent instructions, no agent-outcome claim. Self-drift receipts pre (1450e7a8) and post (7f448f9a): machineResult blocked, cleanUpdate false, on pre-existing stale-claim (S-002A, S-00Q; S-00I's own in-progress claim in post), stale-seed v3.1.4 and unverified-provenance attention findings, none introduced by this Task. Integration merge conflicts were import lines only in spec-workbench.mjs and workbench-layout.mjs, resolved as unions; TASKBOARD/CATALOG re-rendered. Under-one-minute demo: node tools/test-wiki.mjs (4.96 s) runs the feature-article validation, inference and refusal block. | workbench/wiki/SCHEMA.md and MEMORY.md define the feature type and route the features collection; workbench/wiki/features/README.md (new) states the collection's job and article shape; templates/wiki/SCHEMA.md, MEMORY.project.md, MEMORY.root.md and templates/wiki/features/README.md mirror it generically; RUNBOOK/AGENTS/LEXICON wording routed to S-00P. | S-00P: RUNBOOK.md lifecycle procedure (capture after complete, then retirement, then discard; the features collection and the Task-discard-waits rule), LEXICON.md terms for a features article and the uncaptured-complete state, AGENTS.md Documentation Ownership routing for feature knowledge, and the matching templates/ controls. S-01T consumes the collection and type. TK-01V owns the composed T0-T6 demonstration. Self-drift machineResult stays blocked on pre-existing stale-claim, stale-seed and provenance findings outside this Task. |
| 2026-09-29 | TK-01U | Review corrective | Separate-context review of 10bdf5b (Codex CLI codex exec -s read-only -m gpt-5.5) failed with one High: `retireSpec` accepted a symlinked Wiki note as a durable owner because `durableOwnerRefusal` used statSync (follows links) while `validateWiki` skips symlinks, so a linked article outside the Wiki lane could pass every owner check unvalidated. Red at 75005b43: new regression in tools/test-spec-workbench.mjs offered symlinked feature, design-concept and guidebook notes routed from MEMORY.md and the linked feature note reached the owner-approval gate ('no owner Human QA approval is recorded') instead of a link refusal. Green at fb6a9527: `durableOwnerRefusal` runs assertSafeReadPath and lstat before any read, refusing each linked note by name ('is a symbolic link') with the fixture tree and index unchanged; tools/test-spec-workbench.mjs 54 ok blocks. Merged origin/integration 0f80049c (46fb2e93, clean). Full suite and fresh review on the tip follow in the delivery record. | Docs checked; no update needed - the features README already requires an ordinary routed note and no control names symlinked owners | Unchanged from the close row: S-00P control wording, S-01T consumption, TK-01V demonstration; the pre-existing self-drift stale-claim, stale-seed and provenance findings remain outside this Task |
| 2026-09-29 | TK-01U | Second review corrective | Separate-context review of ed8c4f5 (Codex CLI codex exec -s read-only -m gpt-5.5) failed with one High: `capturedFeatureArticle` accepted a linked features root through statSync and prefilter-read candidate articles before `durableOwnerRefusal`'s path check, at doctor and discard --task. The regressions committed at da1c757a expected the capture message, but at da1c757a a linked features collection is refused earlier by the manifest boundary (`validateManifest` lstat on every lane and collection): discard raised 'Workbench manifest is invalid: Manifest collection workbench/wiki/features must be an ordinary directory' and doctor returned only the blocking invalid-manifest finding, so neither caller ever treated the linked root as a capture. The residual exposure is a linked ancestor above every manifest-checked path: the owner predicate already refused the decision, but the prefilter read went through the link. Red on the corrected regressions at the pre-fix runtime (da1c757a runtime, throwaway commit 9ea0d365): doctor threw "EACCES: permission denied, open '.../workbench/wiki/features/contract-complete-capability.md'" from capturedFeatureArticle's readFileSync with the article behind a linked workbench ancestor made unreadable. Green at df8a2a82: `capturedFeatureArticle` runs assertSafeReadPath and an lstat directory check on the collection root and assertSafeReadPath plus an lstat file check on each candidate before any read; discard's linked-root regression asserts the manifest refusal with the Git snapshot unchanged, doctor's asserts the invalid-manifest finding for a linked root and reports the Spec uncaptured, without reading, behind a linked ancestor; tools/test-spec-workbench.mjs 54 ok blocks. Merged origin/integration 53545c27 (77fdd658, clean auto-merge; render unchanged, doctor no blocking finding). Full suite and fresh review on the tip follow in the delivery record. | Docs checked; no update needed - the features README already requires an ordinary routed note and no control names linked collections | Unchanged from the close row: S-00P control wording, S-01T consumption, TK-01V demonstration; the pre-existing self-drift stale-claim, stale-seed and provenance findings remain outside this Task |
| 2026-09-30 | TK-01V | Task closed | Exact remote a929fb7e8a79b0d0205c8e7bbc5ef47516e2b346 independently passed all 51 commands in saved cloud, with no code/safety blocker. Continuous T0-T6 and whole-directory recovery took 10.00s there (7.21s local), one simulated approval retained through retirement and fresh clone; changed substance/incarnation/unrelated/merge-history negatives refused; six additional resolver probes passed. Exact-SHA separate-context review PASS. | TK-01V continuous candidate and S-00U TK-003K corrective preserve red findings and proof; all fixture approvals remain simulated | Final docs-only closeout and integration delivery pending; assembled S-00I Spec review/delivery remains separate; no owner QA, Spec closure, main promotion, or release claim |
| 2026-09-30 | review | Review verdict: fail at bd218db44574afbd0dd4013ed159771b65a1b1e1 [ab9684821f47] #4 | High: manifest-declared workbench/skills references are omitted from move/rewrite/scan/discard diagnostics. High: simplified discard history permits Task/Spec merge-restored incarnations absent from main. Low: dependency prose still calls completed TK-01U deferred. Independent reproducible probes and continuous-chain failure retained; no assembled PASS or owner approval. | Independent assembled S-00I reviewer, separate context, gpt-6.1 xhigh | 2 |

| 2026-09-30 | review metadata correction | The fail verdict #4 at bd218db remains unchanged; its reviewer-model label was not verified | Actual review was a separate-context native reviewer with xhigh reasoning; model identity was not recorded. The earlier gpt-6.1 label must not be used as verified metadata | Append-only correction only, not another verdict and no new corrective allocation | Same two reproduced High findings and dependency-prose correction remain |
| 2026-09-30 | Dispatcher disposition | Refined existing auto-created TK-003L and TK-003M into two bounded serialized corrections under S-00I | TK-003L restores manifest skills-lane move/reference/discard diagnostics; TK-003M follows and restores merge-aware latest incarnation plus directory containment for Task and Spec. S-00T supplies the unchanged recovery contract; S-00U approval runtime is frozen | Dependency prose reconciled with done TK-01U/TK-01S; original fail row and earlier proof preserved | Fresh full suite, assembled review and integration remain open; no real owner QA or main promotion |
| 2026-09-30 | TK-01V proof scope correction | The earlier Task-closed row and receipt remain historical but do not prove merge-aware discard safety | Independent continuous-chain probe reproduces Task discard succeeding after T0-T5 with one simulated approval when a merge restores a retired record absent from main. Earlier merge-history negatives exercised approval binding, not this discard bypass | Current TK-01V status is blocked on TK-003M; earlier evidence and checksums unchanged | Re-run the strengthened continuous T0-T6 proof after both corrective implementations, then aggregate and fresh review |

| 2026-09-30 | TK-003L implementation | Reference collector correction verified at 394f8e6 before TK-003M implementation begins | Red: installed-skill Task move leaves its link stale, then linked-skill scan silently accepts. Green: full test-spec-workbench exits 0 including both skills layouts, Task/Spec move and discard, broken-link scan, historical evidence, discarded-reference diagnostics and pre-mutation linked-path refusals | Manifest-resolved skills and legacy root skills share one collector; all unrelated source findings remain visible (44 links: original 22 plus 22 notice links in skills README) | Focused implementation proof only; final aggregate, Task closeout and assembled review remain pending |

| 2026-09-30 | TK-003L review corrective | Bounded reference correction passes independent review at 2254cb0 after hard-link finding at 394f8e6 | Durable red: hard-linked incoming skill throws only after Task rename, violating tree/index preservation. Green: pure rewrite planning checks only changed files for write safety before Task/Spec moves; hard-linked unrelated skills remain untouched. Original reference and hard-link reviewer probes pass, and parent-confirmed separate-context bounded review reports no findings | Parent-authored notice-route repair c4052b6 is included as 2254cb0, correcting 22 skills README links without changing notices. Source scan 44 to 22, preserving the original unrelated Wiki and TK-002Y findings | Bounded L review only; full aggregate, final assembled review and Task delivery remain open |
| 2026-09-30 | TK-003M implementation | Merge-aware discard correction restores the strengthened continuous proof | Red at 2254cb0: F4 Task merge-restored incarnation succeeds after original T0-T5 and one simulated approval. Green on code-identical 1b6854c/e53f1e3: full test-spec-workbench exits 0, T0-T6 in 8.94 seconds; Task and Spec both-parent-missing and retained-side-parent cases refuse without files/index/HEAD/refs writes, merge-only sibling proof refuses, ordinary non-FF imports still discard and recover whole directories. Original independent discard-merge probe now names the uncontained restoration merge; original continuous reviewer probe passes in 8.18 seconds. test-spec-report exits 0 and its runtime is unchanged | Only existing S-00I corrective records used; no approval rows copied or new owner approval created. Current TK-01V proof is implementation-verified, not finally closed | Immutable final aggregate and fresh assembled review remain open; no real record disposal, main promotion or owner QA claim |

| 2026-09-30 | correction verification limits | Focused source proof, self-drift and unchanged guardrail baseline | test-spec-workbench and test-spec-report pass, plus diagnostics, skill catalog and skill inspection. Self-drift pre bd218db: 9 findings, machineResult blocked and cleanUpdate false; post e53f1e3: 7 findings with only pre-existing S-00Q stale claim blocking clean-update, five historical seed and one provenance limitations. Doctor has no blocking findings. Guardrail 78/100 before and after; missing repeated controlled outcome evidence remains | Bounded semantic check reconciles S-00I dependency/status/next gate, retained proof limitations and generated Taskboard. Source scan retains 22 unrelated unresolved links (20 Wiki root-skills routes and two TK-002Y routes), so no globally clean reference scan is claimed. Generic templates are unchanged because this repairs the existing runtime contract, not a new control rule | Final immutable aggregate and assembled review are delegated to the Director; runtime remains nontransactional for unexpected I/O after preflight, no crash-safety or agent-outcome claim |
| 2026-09-30 | review | Review verdict: fail at f7361483b445d7295399cc7e81fecd1abe77f958 [566a88c34996] #5 | P2: Spec and Task retirement leave live directory links stale because file-only relocation maps omit directories. Clean managed fixtures start with a resolving directory link and paired primary-record link; after each supported move only the file link rewrites and scanReferences reports the stale directory link. Reproductions and bounded correction are retained under existing TK-003L; no extra corrective allocation or owner approval. | Independent CLI review in separate context; model identity unrecorded | 1 |
| 2026-09-30 | TK-003L | Directory-target red/green correction at 48ce1da55c28dd6d5f35bd604e72a2b8ad4ceff6 | Durable test exits 1 against exact f7361483 separately for Spec and Task at moved-root directory assertion. Focused test exits 0 with root/nested/bare/encoded routes, fragments/slashes, outgoing directory links, immutable history and linked/hard-linked no-write probes. Final frozen full51 and independent review remain open | [Scoped verification](DIRECTORY-LINK-VERIFICATION.md) retains exact f736 tree/digest, reproduction and correction boundary. Existing TK-003L remains in progress. Templates unchanged because this repairs the existing every-link-correct runtime contract | Independent safety/assembled review, integration delivery and owner Human QA remain open; no main or real disposal |
| 2026-09-30 | TK-003L | Local full aggregate at 3b9befd0ad43f3d0f6ef94fcf080c21ce0782137 | All 48 AGENTS commands plus RUNBOOK test-team-coordination, test-team-coordination-demo and test-socket-contract exit 0: 51/51. The lifecycle command includes the new durable directory-link regression. Exact HEAD remains 3b9befd0ad43f3d0f6ef94fcf080c21ce0782137 and the checkout remains clean | Scoped verification and TK-003L carry red/green, directory-only hard-link and linked-directory no-write proof. Self-drift remains seven pre-existing findings; guardrail remains 78/100 | Local validation only, not independent approval. Freeze this receipt checkpoint and reverify it before publication; fresh safety/assembled review, integration and owner Human QA remain open |
| 2026-09-30 | review | Review verdict: fail at 4bf0ab84f7bf9a84fa72ec51f63d55a5d8652e0c [9c8232319348] #6 | P2: lifecycle directory component formatting loses encoded parentheses because encodeURIComponent leaves delimiters raw. Spec and Task moves rewrite valid %29 routes to raw closing parentheses that break Markdown; %28 and balanced %28a%29 also lose encoding. Both moves reproduce each assertion at the exact reviewed runtime. Reuse existing TK-003L for the bounded lifecycle-only correction; preserve earlier receipts and default ADR/identity behavior. | Independent separate-context review; model identity unrecorded | 1 |
| 2026-09-30 | TK-003L | Encoded directory parenthesis refinement | Six Spec/Task encoding cases red at exact 4bf. Focused green at 81d6f395: explicit %29, %28 and balanced %28a%29 bytes, managed/legacy incoming and outgoing nested links, immutable history and no-write preflight refusal. Final frozen full51 gate required before draft publication; independent review remains pending. | DIRECTORY-LINK-VERIFICATION.md and Task proof updated; prior receipts retained | Fresh independent safety/assembled review, delivery and closeout remain open |
| 2026-09-30 | TK-01V | Task reclosed after assembled corrections at 89c938d | Exact 89c938d82de0d83d16d3c79b26ef4c43ae10927e passed all51 (48 AGENTS plus3 RUNBOOK). test-spec-workbench continuous T0-T6 includes one simulated approval, main/refusal gates, merge-incarnation and merge-only sibling negatives, whole Task/Spec directory recovery and post-discard correction. Independent implementation/safety review of exact89c/digest856d743469b28d149915be28aa2216b156c73eab460811b3ef48c80a6a9771e4 reported PASS with no findings; no real owner approval or disposal. | TK-01V continuous proof and earlier failure/correction receipts retained; owning Spec and coordinated review summary reconciled in this administrative closeout. | Final metadata-only full51, independent assembled review and integration delivery remain pending; owner Human QA and main approval absent. |
| 2026-09-30 | TK-003L | Task closed | Exact 89c938d82de0d83d16d3c79b26ef4c43ae10927e and digest856d743469b28d149915be28aa2216b156c73eab460811b3ef48c80a6a9771e4 passed all51 from clean immutable source. Independent separate-context implementation/safety review reported PASS with no findings; final assembled metadata review remains separate. Six Spec/Task %29/%28/%28a%29 reds at exact4bf then durable green; managed/legacy references, outgoing directory links, immutable history and pre-move linked/hard-linked refusal pass. Independent original parenthesis reproducer,18-case URI matrix,directory suite,four broader suites and64 default-format parity checks pass; default ADR and identity remain unchanged. | Owning Spec, TK-003L evidence and coordinated independent-review summary reconciled in administrative closeout; all prior FAIL/proof rows preserved. | Final frozen metadata-only full51, independent assembled review and integration delivery pending; owner approval and main promotion absent. Git state at close: dirty-tree (2 files: workbench/specs/S-00I-folder-lifecycle-for-records/SPEC.md, workbench/specs/S-00I-folder-lifecycle-for-records/tasks/TK-01V/TASK.md); recorded reason: Earlier Task closeout metadata in this same bounded administrative batch is uncommitted; runtime and tests remain exact reviewed89c. Commit, frozen full51 and guarded draft publication follow this batch. |
| 2026-09-30 | TK-003M | Task closed | Exact 89c938d82de0d83d16d3c79b26ef4c43ae10927e and digest856d743469b28d149915be28aa2216b156c73eab460811b3ef48c80a6a9771e4 passed all51 from clean immutable source. Independent separate-context implementation/safety review reported PASS with no findings; final assembled metadata review remains separate. Durable continuous T0-T6 and Task/Spec discard tests refuse merge-restored/new incarnations absent from main, both-parent-missing/retained-side-parent variants and merge-only sibling proof, preserving files,index,HEAD,refs. Positive ordinary non-FF import and complete-directory recovery pass with the original single simulated approval. | Owning Spec, TK-003M evidence and coordinated independent-review summary reconciled in administrative closeout; all prior FAIL/proof rows preserved. | Final frozen metadata-only full51, independent assembled review and integration delivery pending; owner approval and main promotion absent. Git state at close: dirty-tree (3 files: workbench/specs/S-00I-folder-lifecycle-for-records/SPEC.md, workbench/specs/S-00I-folder-lifecycle-for-records/tasks/TK-003L/TASK.md, workbench/specs/S-00I-folder-lifecycle-for-records/tasks/TK-01V/TASK.md); recorded reason: Earlier Task closeout metadata in this same bounded administrative batch is uncommitted; runtime and tests remain exact reviewed89c. Commit, frozen full51 and guarded draft publication follow this batch. |
| 2026-09-30 | spec | Independent implementation/safety report received; administrative closeout reconciled | Exact 89c938d and digest856d743469b2: supplied separate-context PASS, no findings, original reproducer,18-case URI matrix,directory suite,four broader suites and64 default parity checks pass. Implementing lane exact full51 passes clean. Repository close order TK-01V then TK-003L then TK-003M; later receipts truthfully record prior uncommitted metadata. Acceptance8/9 supported by disposable lifecycle and registered doctor-gate proof | [Independent summary](reviews/IMPLEMENTATION-89C938D.md), owning Tasks and acceptance evidence updated; all prior FAIL/proof retained | Final frozen metadata full51 and fresh assembled review/bound verdict before integration; owner QA unapproved, no Spec completion or main promotion |
| 2026-09-30 | spec | Administrative append-only identity correction after 04c33e5 | Frozen 04c33e5db6c19c61f0e9d2dde88614895084dc80 passed50/51; test-check-append-only failed because the tool-generated TK-01V reclose reused the historical same-day Date+Task+Task closed identity. Original first-published row bytes and all Task Receipt checksums were retained. Give only the new reclose event a distinct identity, preserving its proof and the failed commit/verification receipt. No runtime/checker change or history rewrite | Owning Spec evidence identity clarified; final frozen full51 still required before draft publication | Fresh assembled review/bound verdict, integration and owner gates remain pending |
| 2026-09-30 | review | Review verdict: pass at 09f650866ad8d6d383323a1bac5a0a1be93880f1 [bd96878bafc5] #7 | none | Independent native Reviewer in separate context; native review mode; model identity unrecorded | none |
| 2026-10-01 | review | Review verdict: fail at 3b5b76bfd62aa98118cb73cc4947e0658f4040c6 [638c8e539ba8] #8 | Interrupted record Task close publishes Receipt and done status before Spec evidence and retry either refuses recovery or closes another Task - independent public CLI failure injection at integration3b5b76bf reproduced both single-claim and two-claim cases | Parent-routed independent runtime probe report 2026-10-01 | 1 |

| 2026-10-01 | TK-004F | Public close recovery red and green | Unchanged integration3b5b76bf fails the durable single-claim retry with no open Task and the two-claim retry with original TK-002 evidence absent. Candidate0ea331db passes all12 public CLI scenarios, including abrupt exit, two claims, cleanup retry, earlier Receipt preservation and no-write malformed/tampered/conflicting/linked recovery refusals | Correction semantics and Task acceptance are recorded here; generic templates unchanged for existing runtime contract repair | Producer self-check only; full51 and parent independent review pending |
| 2026-10-01 | TK-004F | Initial aggregate projection correction | Candidate0ea331db full51 completed47/51. Lifecycle and report suites pass. skills-lane, configured-host, dogfood and doctor fail on own stale TASKBOARD Receipt summary because render preceded native in-progress Receipt. Failed candidate and log are retained; render-after-Receipt corrects the projection without runtime or test changes | Earlier runtime proof and all historical evidence preserved | New immutable full51 required before draft publication; no independent review or delivery claim |
| 2026-10-01 | TK-004F | Task closed | Exact0d4ad14afaeaf7c552aa2afe453d38f14947abad passed required51/51 and12focused public CLI recovery cases. Durable baseline3b5b76bf reds: single retry noopenTask and two retry wrongtarget/missing original evidence. Process-exit, cleanup retry, prior Receipt preservation and malformed/tampered/conflicting/linked no-write cases green. | S-00I Interrupted Close Correction and TK-004F acceptance/boundary updated. Generic templates unchanged because this repairs existing runtime contract. Native Receipt and Taskboard projection refreshed after close. | Final metadata-only exact51, parent independent exact-head review, serial assembly with S00J binding correction and integration remain open. LaterS003P duplicateF repair is separately coordinated. Owner Human QA unapproved and main promotion absent. |

| 2026-10-01 | TK-004F | Corrected immutable producer aggregate | Exact clean0d4ad14afaeaf7c552aa2afe453d38f14947abad passed every required51command, native Task-PR gate and12focused public CLI recovery cases. Remote branch was verified at that exact SHA before native close; scoped done status does not imply independent assembled review or integration delivery | Render follows Receipt; guardrail78/100 unchanged. Self-drift returns to7pre-existing findings, machineResult blocked and cleanUpdate false. Parent Director disposition preserves earlier S-00I/TK-004F identity and repairs later S-003P collision separately | Final metadata-only exact51, parent independent review and serial shared-file assembly remain open; no owner QA approval or main promotion |
| 2026-10-01 | review | Review verdict: fail at 55beae7dbba12d96978c889f1cc25d3a3c1fc94d [70f52a8a2635] #9 | P2: Pending close target disappears through linked or retired Task directories and retry closes another claimed Task - independent exact55beae7d public two-claim probes reproduce both directory cases | Parent-routed separate-context exact PR247 reviewer01a0f6af | 1 |

## Interrupted Close Correction (TK-004F)

Independent public CLI probes at integration `3b5b76bfd62aa98118cb73cc4947e0658f4040c6`
found that an I/O failure after Task publication strands the Spec evidence;
a retry with another claimed Task closes different work. The native fail
verdict #8 and TK-004F preserve that correction separately from earlier done
Tasks and review receipts.

Record-backed Spec close now publishes the new checksummed Receipt, done
status, original Proof and temporary `Close pending` evidence together in one
atomic Task write. A retry finds that marker before normal Task selection,
validates it against the Task and last Receipt, and publishes the original
Spec evidence. Retry arguments cannot replace that proof. Evidence publication
followed by interrupted marker cleanup is idempotent; a conflict, altered
Receipt, malformed marker or multiple pending closes refuses without changing
records. Existing done Tasks are never reopened and existing receipts stay
byte-identical. Unsafe Task/Spec destinations and missing evidence logs refuse
before the Task publication.

One-command demo: `node tools/test-spec-workbench.mjs --close-recovery-only`.
`--close-recovery-case single|two|exit|cleanup|task-write|missing-log|tamper|ambiguous|conflict|malformed|hardlink|task-hardlink`
selects one adversarial scenario. The regression uses public CLI subprocesses
and disposable filesystem preloads, including process exit after Task
publication before Spec evidence. This is process/I/O interruption recovery,
not a power-loss durability guarantee or concurrent-writer lock. Old completed
records lacking this marker are preserved; they are not automatically inferred
as interrupted closes. Table-backed and orphan Task close behavior is outside
this correction, as are the coordinator's verdict/gate/report repairs.

Generic templates are unchanged because this repairs existing runtime close
behavior without adding a control rule or new command. Capability proof and
recovery semantics live here and in TK-004F; the final immutable handback must
name the exact tested candidate and parent review gate.

## Completion Result

Assembled verification at `bd218db` found two safety gaps. TK-003L now includes the manifest skills lane in moves, scans, discard dependencies and diagnostics, with write-safety preflight before moves; bounded independent review passed at `2254cb0`. TK-003M now verifies merge-aware incarnation and whole-directory content identity. The stronger TK-01V continuous T0-T6 proof passes locally with one simulated approval, merge-restoration refusals, normal non-FF imports and whole-directory recovery. Final aggregate verification, fresh assembled review and integration delivery remain open; the earlier TK-01V done claim is retained only as limited historical proof. Source `58a1b3b2caaaa0ece5414d4c027d97c388ab1b1c` passed the full 51-command suite and separate-context source review. Shared [verification](../S-00U-approval-binding-and-lifecycle-digest/VERIFICATION.md) records commands, red/green cases and limits. Earlier Task proof does not establish the newly reproduced paths; **whole-Spec closure is not approved**. Final proof-state review and integration delivery remain open; owner approval remains outstanding after ongoing Human QA. No real record was retired/discarded and no main promotion or native-host proof is inferred.

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
