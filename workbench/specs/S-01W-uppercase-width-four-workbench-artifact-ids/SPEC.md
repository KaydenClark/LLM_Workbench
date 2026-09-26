# S-01W - Uppercase Width-Four Workbench Artifact IDs

**Spec ID:** S-01W
**Status:** active
**Priority:** 1
**Owner:** claude-lane-I
**Stance:** Builder
**Updated:** 2026-09-26
**Catalog description:** Allocate uppercase width-four artifact identifiers, resolve legacy aliases and preserve identities through bounded touch-and-update migration.
**Blockers:** none
**Latest event:** TK-002Q claimed by claude-lane-I.
**Next gate:** Close TK-002Q with verification and documentation proof.

> **Citation anchors.** pre=`89d4042` post=`89d4042`.

## Outcome

New artifact WBIDs use uppercase `0-9A-Z` suffixes of minimum width four.
Existing and widened spellings reach one identity, and allocation reserves both.
Eligible records widen when touched through supported operations, preserving
former IDs, live references and historical evidence. Completed records remain
unchanged. This is the WBID capability owner in the v4 delivery sequence governed
by [S-00O](../S-00O-workbench-v4-0-0-release/SPEC.md).

## Why It Matters

The owner selected two separate build Specs and the order WBID -> board ->
S-00P controls -> S-00O release. The board needs consistent identities before
its own records and consumers are built. A bulk rename would contradict the
owner's touch-and-update rule and endanger recoverable historical references.
Durable source: [destination audit ledger](../../wiki/grilling-destination-audit-ledger.json),
rows E-6, E-7 and E-8, including their decision/correction lineage.

## Current Verified State

Read these source observations at the pre anchor:

- `workbench/tools/visible-ids.mjs` exports a mixed-case base62 alphabet and
  defaults artifact allocation to width three. Its collision key already folds
  case and removes leading zeros, so `S-00Q` and `S-000Q` occupy one key.
- That module also uses the base62 encoder for random 22-character Workbench
  connection identities. Changing its codec globally would change another
  mechanism outside this capability.
- `workbench/tools/spec-workbench.mjs` exposes read-only `next-id` through
  `nextIdentity`; several parent/task selectors compare literal IDs. Equivalent
  collision keys therefore do not yet prove dual-form public lookup.
- `moveSpecDirectory` and `moveTaskRecord` support lifecycle moves of complete
  Specs and done Tasks. E-8 prohibits renaming completed records. Those APIs
  cannot automatically be treated as the eligible next-touch widening trigger.
- `tools/test-visible-ids.mjs` and `tools/test-visible-id-consumers.mjs` provide
  allocation, collision, CLI and legacy preservation seams.
- [ADR-0041](../../docs/adr/0041-visible-base62-workbench-identifiers.md) still
  describes width/alphabet as unapproved; E-8 now settles those artifact details.

The S-00O draft (unmerged candidate 34dfa2f on 89d4042) allocated this record
as S-01U, but PR #161 landed a different S-01U first. The Lane I rebuild on
integration 1a6f6e0 re-ran the supported `next-id` operation, which returned
S-01W. Retain this identity until supported touch migration applies. This planning record delivers no runtime.

## Desired Behavior

1. New artifact allocations contain only `0-9A-Z`, have minimum suffix width
   four and grow without truncation or recycling.
2. Preserve prefixes and identity scopes. TT-Q10 keeps the `TK` Task prefix;
   its answer does not supersede E-8's later alphabet/width decision.
3. Allocation treats short/widened and case aliases as occupied identities;
   ambiguous duplicate records refuse selection rather than choosing a winner.
4. Public Spec and Task operations accept supported legacy/widened selectors
   and report the stored canonical identity/path. Historical numerical Task
   labels retain Spec-qualified scope; letter-bearing Tasks retain whole-room
   inventory checks.
5. Eligible touched records widen once through supported move/reference
   machinery, keep former IDs reachable and preserve immutable evidence.
   Untouched and completed records are not renamed or re-statused.
6. Connection IDs, collision safety, reservation inventories, path/link safety,
   retirement recovery and stored-ID versus filename selectors remain intact.

## Decisions And Contracts

- E-6 establishes this separate capability before board delivery and S-00P's
  controls rewrite. E-7/E-8 prohibit mass status and ID sweeps. A read-only QA
  inventory may identify omissions; it does not authorize bulk mutation.
- Each Task is allocated with `next-id` when cut. The first slice is TK-02B;
  the other proposed slices below are unallocated.
- Artifact allocation needs a separate uppercase codec/policy; preserve the
  exported base62 connection-ID codec unless an independently assigned change
  expressly requires otherwise.
- **Former-ID metadata (settled in TK-002O, an implementation design choice,
  not a recovered owner answer):** a widened Spec or Task record keeps its
  previous spelling in one `**Former ID:**` header field directly under its ID
  field, with parser/serializer round-trip coverage. The field shape, digest
  treatment and staging choice are recorded in the
  [TK-002O](tasks/TK-002O/TASK.md) Decisions table and ADR-0041.
- **Identity touch decision (Director, 2026-09-26, derived from E-8; owner-vetoable):**
  E-8 names `move-spec`/`move-task` as the touch, but both move only complete
  Specs and done Tasks (into `retired/`), which E-8 also forbids renaming. The
  touch is therefore an explicit identity-only `widen-id S-###|TK-###` verb: it
  reuses the move machinery's live-reference rewrite, records the former ID in
  explicit record metadata, refuses complete, done and retired records, dirty
  trees and occupied aliases, and is run by an agent starting substantive work
  on an active record; a read-only inventory at QA/verify time finds records
  it missed. Rejected: (B) widening automatically inside `claim`, which adds a
  repo-wide rename side effect to claim and merge conflicts for parallel lanes;
  (C) no widening at all, which leaves mixed widths in live folders
  indefinitely. Built in the touch-and-update slice, after allocation and
  dual-form lookup.
- **Director-confirmed boundary:** preserve the completed-record exclusion and
  design identity-only touch separately from lifecycle moves. Reuse supported
  reference-preservation machinery where appropriate, without treating retirement
  as identity normalization. The eligible active-record trigger is the explicit `widen-id` verb above.
- Sol handles normal delivery; Luna handles deterministic checks; Astra handles
  ambiguous or consequential review. Integration review uses separate context;
  no additional different-model ceremony is imposed.

## Non-Goals

- JSON board, sitrep, direct-Task home or Landmark Tracker implementation.
- Bulk renumbering, re-statusing, completed-record renaming or ID recycling.
- Altering Workbench connection identity format or allocating Tasks here.
- Version stamping, downstream upgrades or integration-to-main promotion.

## Dependencies And Blockers

S-00O dispatches this capability before the board capability, which then unblocks
S-00P controls work. Release preparation must distinguish reviewed delivery from
post-main closure using reconciled live controls. No completion gate is bypassed
by this proposal. Implementation waits for Director release of named shared lanes
and Dispatcher allocation of real Tasks through `next-id` on the current
integration tip immediately before each commit (no Task-ID lease holds).
The migration slice builds the `widen-id` verb decided above; its exact
former-ID field shape is settled in that slice.

## Vertical Implementation Slices

These are proposed slices; an allocated slice links its Task record under
`tasks/`, and the rest are not selectable until cut.

### First slice - Public new-ID proposal

Allocated as [TK-02B](tasks/TK-02B/TASK.md).

**Stance:** Builder

Candidate lane: `workbench/tools/visible-ids.mjs`,
`tools/test-visible-ids.mjs`, `tools/test-visible-id-consumers.mjs`,
`workbench/docs/adr/0041-visible-base62-workbench-identifiers.md`.
Deliver artifact-only uppercase minimum-width-four allocation through existing
public `next-id --prefix S` and `next-id <spec> --prefix TK`.
Trace explicit-width callers before changing shared defaults.

Red cases: occupied numeric prefixes yield `S-000A` and `TK-000A`; base36 overflow
at explicit width one yields `10`, never lowercase; `S-00Q` reserves `S-000Q`;
duplicate aliases refuse. Disposable-room CLI results are uppercase width four,
`reserved:false`, with original legacy paths and bytes unchanged. Confirm those
new assertions fail before implementing. Green implements the smallest allocator
change and preserves connection-ID checks. The ADR distinguishes delivered
allocation from remaining lookup/migration work.

### Next slice - Dual-form selection

Allocated as [TK-002K](tasks/TK-002K/TASK.md).

Depends on the first slice. Candidate lane:
`workbench/tools/spec-workbench.mjs`, `tools/test-visible-id-consumers.mjs`,
`tools/test-spec-workbench.mjs`. Trace findSpec, parent next-id checks, task
selectors, blockers and retired explicit lookup. Red disposable fixtures require
show/claim/close to accept widened selectors for short stored IDs, preserve
returned stored paths, and refuse ambiguous records. Preserve numerical Task
scope. Split off QA/report consumers if tracing exceeds one bounded Task.

### Next slice - Safe touch-and-update

Allocated as [TK-002O](tasks/TK-002O/TASK.md).

Depends on dual-form selection and a resolved trigger/metadata proposal.
Candidate lane: `workbench/tools/spec-workbench.mjs`,
`tools/test-spec-workbench.mjs`. Disposable Git fixtures prove eligible records
widen once, former IDs survive, live links update and immutable historical
references remain anchored/countable. Reject completed-record renaming, occupied
aliases/destinations, dirty trees and unsafe paths without partial mutation.
Exercise repeat operations, recovery and cold-clone lookup. No live records are
used as test data.

### Next slice - Artifact consumer coverage

Allocated as [TK-002Q](tasks/TK-002Q/TASK.md).

Depends on prior policy/lookup delivery. Inventory actual imports and explicit
widths, then bound each Task to supported consumers. Known candidate lanes:
`workbench/tools/adr.mjs`, `workbench/tools/notepads.mjs`,
`tools/test-adr.mjs`, `tools/test-notepads.mjs`,
`tools/test-visible-id-consumers.mjs`. Additional paths require Director release.
Fixture public operations prove new-form allocation and legacy preservation;
future DQC/landmark integrations consume this contract when their runtime exists.

### Final slice - Assembled capability QA

Depends on delivered slices. Read-only inventory finds missed consumers and
alias collisions. Reconcile ADR-0041, relevant RUNBOOK procedures, generic
mirrors and managed receipts through released lanes; do not expand S-00P's
controls rewrite here. Run full verification and S-00K pre/post semantic drift
checks. Dispatcher verifies the complete capability; Director separately reviews
the immutable assembled candidate. Return exact delivered guarantees to the board
packet and S-00P; owner Human QA and closure follow live controls.

## Acceptance Criteria

- [x] Public new artifact allocation is uppercase, minimum width four, collision-safe and read-only when proposing an ID.
- [x] Legacy/widened public selectors resolve one record; ambiguity refuses and numerical Task scope remains intact.
- [x] Eligible touch migration preserves former IDs, live links and immutable history without renaming completed records.
- [ ] Supported artifact consumers follow the policy and connection identities remain compatible.
- [ ] ADR/procedures/generic mirrors describe actual delivery; full suite, drift receipts and assembled review are recorded.

## Testing Seams

- `allocateVisibleId` and `visibleIdKey` unit assertions.
- Disposable-room CLI `next-id`, show, claim and close fixtures.
- Disposable Git move/reference/recovery fixtures; connection identity checks.
- ADR/notepad public allocation and stored-ID selectors after caller tracing.

## Verification Procedure

For the first slice, record expected new failures before implementation:

```bash
node tools/test-visible-ids.mjs
node tools/test-visible-id-consumers.mjs
```

After targeted green, verify connection identity preservation and run relevant
consumer/migration seams as assigned:

```bash
node tools/test-workbench-identity.mjs
node tools/test-spec-workbench.mjs
node tools/test-adr.mjs
node tools/test-notepads.mjs
node tools/test-spec-citation-anchors.mjs
```

Run the complete AGENTS full suite on the implemented candidate. Capture guardrail
baseline/after-score where harness changes require it, and S-00K read-only
pre/post receipts alongside RUNBOOK's bounded manual semantic check. Test results
prove exercised fixtures, not owner QA or complete project behavior. This planning
pass runs no behavioral tests and makes no green runtime claim.

## Documentation Impact

ADR-0041 owns identity decisions; RUNBOOK owns actual commands/policy; this Spec
owns requirements/proof. Coordinate generic mirrors, managed receipts and shared
controls with Director and S-00P. Preserve historical source claims and avoid
using ignored recovery material as durable evidence.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-26 | none allocated | Director-released capability packet authored under S-00O | Source inspection at 89d4042; no runtime tests | This Spec | Task allocation (the then-current S-00J lease was retired by the later Lane I rebuild), shared lanes, implementation and assembled verification |
| 2026-09-26 | none allocated | Lane I (claude-lane-I) rebuilt unmerged S-00O planning candidate 34dfa2f onto integration 1a6f6e0: PR #161 had taken S-01U, so supported `next-id` re-allocated the identity Spec as S-01W and then the board Spec as S-01X; every reference in S-00O, S-01W, S-01X and the direct-Task proposal was renumbered and the stale Task-ID lease wording removed (no lease holds). | `next-id --prefix S` returned S-01W on clean integration 1a6f6e0 and, with both records present, the next free Spec ID after S-01X; render then doctor (no blocking finding) on the committed candidate and in a fresh clone of the pushed branch; the full suite, separate-context review and verdict are recorded by the landing PR's own evidence, not claimed here | This Spec, S-01X, S-00O, TASKBOARD.md, CATALOG.md | Touch-versus-lifecycle semantics, first implementation Task and assembled verification |
| 2026-09-26 | TK-02B | Lane I recorded the Director's identity-touch decision (explicit `widen-id` verb; automatic widening in `claim` and no widening rejected; owner-vetoable) and cut TK-02B from the first slice, its ID proposed by `next-id S-01W --prefix TK` on integration d4ec0d6 immediately before the record was saved. | render; doctor no blocking finding; show S-01W lists TK-02B ready | This Spec (header, Decisions, Dependencies, first slice), TK-02B TASK.md, TASKBOARD.md, CATALOG.md | TK-02B implementation; dual-form selection, `widen-id` touch, consumer coverage and assembled QA slices remain unallocated |
| 2026-09-26 | TK-02B | Task closed | Red at b35a65a plus the new tests: test-visible-ids.mjs could not import allocateArtifactId; test-visible-id-consumers.mjs 6 of 17 failed (next-id returned width-three labels where width four was asserted; the two duplicate-alias-record refusal cases were already green through the record loaders); test-spec-report.mjs and test-spec-workbench.mjs corrective-Task assertions failed on width-three IDs. Green at 1bdc1a8: test-visible-ids.mjs 9/9, test-visible-id-consumers.mjs 17/17, test-spec-workbench.mjs, test-spec-report.mjs, test-workbench-identity.mjs (base62 connection IDs), test-adr.mjs, test-notepads.mjs and test-spec-citation-anchors.mjs pass; full AGENTS suite 48 pass 0 fail on 1bdc1a8 with a clean tree. Guardrail 106.6/113 before and after; S-00K self-drift pre and post both report the same 7 attention findings and no new one. | ADR-0041 amended: owner decision E-8 settles uppercase 0-9A-Z width four for artifact labels, delivered allocation is separated from remaining dual-form lookup and widen-id touch work, and the connection-ID account is kept. RUNBOOK Visible identifiers (alphabet 0-9 A-Z a-z, minimum width three) and the LEXICON WBID base-62 wording are now stale for Spec and Task allocation: routed to S-00P, which owns those controls and their templates mirrors. | Dual-form public selection, the explicit widen-id touch verb with former-ID metadata, moving ADR and notepad allocation onto the artifact policy, and assembled capability QA remain later S-01W slices (unallocated). RUNBOOK and LEXICON wording routed to S-00P. Separate-context integration review not yet run. |
| 2026-09-26 | review | Review verdict: pass at 69ab30d037b2da168dca5b56c11cba2e346fd398 [0a2b38ef5cf2] #1 | No blocking findings. Non-blocking: next-id folds an active-plus-retired alias pair as occupied inventory rather than refusing at allocation (doctor diagnoses it; active duplicate records refuse via the loaders); carried into the dual-form selection slice. Dispatcher accepts the worker's reading that spelling duplicates in reference text reserve one ID without refusing while duplicate records refuse, as consistent with Desired Behavior 3. Full AGENTS suite 48/48 at 69ab30d (read-only runner, dirty []). Reviewer ran doctor; did not run fixtures or the suite (read-only sandbox). | codex exec gpt-5.5, read-only sandbox, separate context from the Lane I dispatcher and its worker | 4 |
| 2026-09-26 | TK-02B | Acceptance line 1 checked and Completion Result updated for TK-02B's delivered allocation, before the landing review of this candidate. | TK-02B evidence above (red/green, suite 48/48 at 69ab30d, review PASS) | This Spec (Acceptance, Completion Result), TASKBOARD.md | Acceptance lines 2-5 |
| 2026-09-26 | review | Review verdict: pass at 884c5bb7fa04646a14f1f2c2c52bff2b3d08fbba [c12803d6f8d2] #2 | No findings. Landing candidate for TK-02B with acceptance line 1 checked and the Completion Result updated before review. Chain: 69ab30d full review PASS; 02202f6 delta review inconclusive (reviewer ran fixtures in the read-only sandbox, which cannot create temp dirs); d3b39d9 delta review FAIL on one stale Next gate sentence; 884c5bb fixes it and passed delta review. Full AGENTS suite 48/48 at d3b39d9 (read-only runner, dirty []); 884c5bb changes only the Next gate header and its projection. | codex exec gpt-5.5, read-only sandbox, separate context from the Lane I dispatcher and its worker | 5 |
| 2026-09-26 | TK-002K | Lane I cut TK-002K from the dual-form selection slice, its ID proposed by `next-id S-01W --prefix TK` on integration 4de4904 immediately before the record was saved; it carries TK-02B's non-blocking review note on active-plus-retired alias pairs. | render; doctor no blocking finding; show S-01W lists TK-002K ready | This Spec (header, dual-form slice), TK-002K TASK.md, TASKBOARD.md | TK-002K implementation; `widen-id` touch, consumer coverage and assembled QA slices remain unallocated |
| 2026-09-26 | TK-002K | Task closed | Red at 7d1282f runtime with the new tests: test-visible-id-consumers.mjs 5 of 23 failed (show of a widened selector for a short stored Spec ID answered Unknown spec ID; widened Spec and Task blocker spellings stayed unsatisfied; an active record plus a retired record sharing one collision key returned one of them instead of refusing; claim through a widened numeric Spec selector was unknown; a widened orphan corrective Task selector answered Unknown corrective Task ID); the test-spec-workbench.mjs dual-form block failed at its first widened receipt selector (Unknown spec ID). Green at 5bb6406: test-visible-id-consumers.mjs 23/23; test-spec-workbench.mjs including the dual-form receipt, gate, move-task and retired-show block; test-visible-ids, test-spec-report, test-workbench-identity, test-adr, test-notepads, test-spec-citation-anchors and test-diagnostics pass; full AGENTS suite 48 pass 0 fail on 5bb6406 (read-only runner, dirty []). Guardrail 106.6/113 before (7d1282f) and after (5bb6406); S-00K self-drift pre and post both report the same 7 attention findings and no new one. | ADR-0041 amended: dual-form lookup moves to delivered for the public Spec and Task selectors, the active-plus-retired alias refusal is stated, and the spec-report library pass-through is kept as remaining. RUNBOOK Visible Identifiers does not yet say that selectors accept any spelling sharing the stored record's collision key and that aliased records refuse by name: routed to S-00P with the TK-02B RUNBOOK and LEXICON wording. | Direct library callers of the spec-report.mjs functions (assembleSpecReport, recordReviewVerdict, recordOwnerApproval, createCorrectiveTasks) still echo or record the caller's selector spelling; the CLI entry points resolve it first. The widen-id touch verb, moving ADR and notepad allocation onto the artifact policy, and assembled capability QA remain later S-01W slices (unallocated). RUNBOOK and LEXICON wording routed to S-00P. Separate-context integration review not yet run. |
| 2026-09-26 | TK-002K | Acceptance line 2 checked and Completion Result updated for TK-002K's delivered dual-form selection, before the landing review; the direct `spec-report.mjs` library pass-through is recorded as a remaining limit. | TK-002K evidence above (red/green, suite 48/48 at 5bb6406) | This Spec (Acceptance, Completion Result, header), TASKBOARD.md | Acceptance lines 3-5 |
| 2026-09-26 | review | Review verdict: pass at 78843f1c83cbac98dbb43c23fa06e2c4b56d4ef2 [48666a95f2d3] #3 | No findings. TK-002K dual-form selection with acceptance line 2 checked and the Completion Result updated before review. Full AGENTS suite 48/48 at 78843f1 (read-only runner, dirty []). Reviewer read the tests and ran doctor; did not run fixtures (read-only sandbox). | codex exec gpt-5.5, read-only sandbox, separate context from the Lane I dispatcher and its worker | 2 |
| 2026-09-26 | TK-002O | Lane I cut TK-002O from the safe touch-and-update slice, implementing the Director's explicit `widen-id` decision; its ID was proposed by `next-id S-01W --prefix TK` on integration 52c64db immediately before the record was saved. | render; doctor no blocking finding; show S-01W lists TK-002O ready | This Spec (header, touch slice), TK-002O TASK.md, TASKBOARD.md | TK-002O implementation; consumer coverage and assembled QA slices remain unallocated |
| 2026-09-26 | TK-002O | Task closed | Red at 4c6c51d runtime with the new tests: test-visible-id-consumers.mjs 7 of 30 failed and the test-spec-workbench.mjs widen-id block failed at its first refusal, each because widen-id was an unknown command (the CLI answered with its usage error), and the Former ID round-trip assertion failed because formatTaskRecord wrote no Former ID line. Green at 9c0bf62: test-visible-id-consumers.mjs 30/30; test-spec-workbench.mjs including the widen-id journey (a short active Spec, then its open Task, widen once to width four with a Former ID field; live links in another Spec and AGENTS.md are rewritten; both evidence sections stay byte-identical with their old-path links counted as historical; former, widened and case-variant selectors resolve, also from a cold clone; repeat runs are no-ops; the result is staged, not committed; git reset --hard restores the pre-widen tree; complete, done, retired and dirty-tree cases refuse without mutation); the consumer file adds occupied Spec and Task alias, occupied destination, symlinked record, slice-table row, numeric label needing --spec, case-only rename and Former ID parse/format round-trip and mismatch cases. test-visible-ids, test-spec-report, test-workbench-identity, test-adr, test-notepads, test-spec-citation-anchors, test-diagnostics, test-sessions and test-check-append-only pass; full AGENTS suite 48 pass 0 fail on 9c0bf62 (read-only runner, dirty []). Guardrail 106.6/113 before (4c6c51d) and after (9c0bf62); S-00K self-drift pre and post both report the same 7 attention findings and no new one. | ADR-0041 amended: the widen-id touch moves to delivered with its Former ID field, eligibility, refusals, staging and digest treatment; remaining work is ADR and notepad allocation and the QA-time inventory. The S-01W former-ID Decisions bullet now points to the TK-002O Decisions table (four durable choices reconciled to ADR-0041) and the stale Remaining Limitations bullet is replaced. RUNBOOK Visible Identifiers does not yet document widen-id, the Former ID field or when to run it: routed to S-00P with the earlier TK-02B and TK-002K RUNBOOK and LEXICON wording. | Moving ADR and notepad allocation onto the artifact policy and the read-only QA-time inventory of records not yet widened remain later S-01W slices (unallocated); direct spec-report.mjs library callers still echo the caller's selector spelling; historical evidence links to a widened record's old path stay as written and doctor reports them as attention-only broken-link findings, as move-spec leaves them. RUNBOOK and LEXICON wording routed to S-00P. Acceptance line 3 and the Completion Result are left to the dispatcher; separate-context integration review not yet run. |
| 2026-09-26 | TK-002O | Acceptance line 3 checked and Completion Result updated for TK-002O's delivered `widen-id` touch, before the landing review; old-path links inside evidence rows are recorded as an attention-only limit. | TK-002O evidence above (red/green, suite 48/48 at 6ce7f3e) | This Spec (Acceptance, Completion Result, header), TASKBOARD.md | Acceptance lines 4-5 |
| 2026-09-26 | review | Review verdict: pass at a1b77f34df6a2600b24b96689714c6b8ec09b0c5 [4ceb26e49c7f] #4 | No findings. TK-002O explicit widen-id touch with acceptance line 3 checked and the Completion Result updated before review. Full AGENTS suite 48/48 at a1b77f3 (read-only runner, dirty []). Reviewer read the tests, ran git diff --check and doctor; did not run fixtures (read-only sandbox). | codex exec gpt-5.5, read-only sandbox, separate context from the Lane I dispatcher and its worker | 2 |
| 2026-09-26 | TK-002Q | Lane I cut TK-002Q from the artifact consumer coverage slice, including Lane F's observation that ADR allocation misses labels held only on remote tips; its ID was proposed by `next-id S-01W --prefix TK` on integration 761f1f5 immediately before the record was saved. | render; doctor no blocking finding; show S-01W lists TK-002Q ready | This Spec (header, consumer slice), TK-002Q TASK.md, TASKBOARD.md | TK-002Q implementation; assembled QA slice remains unallocated |

## Completion Result

Pending. TK-02B delivered public uppercase width-four allocation for new Spec and Task IDs (acceptance line 1). TK-002K delivered dual-form selection: every public Spec and Task command resolves short, widened and case-variant selectors to the one stored record, refuses ambiguous aliases and keeps numeric Task labels Spec-scoped (acceptance line 2); direct library callers of `spec-report.mjs` still echo the caller's spelling. TK-002O delivered the explicit `widen-id` touch: an open record widens once, keeps a `**Former ID:**` field, rewrites live links, leaves evidence bytes unchanged and refuses complete, done, retired and dirty-tree cases without partial mutation (acceptance line 3); evidence-row links to a widened record's old path stay as written and surface as attention-only findings. ADR and notepad consumer coverage and assembled QA remain; no owner approval.

## Remaining Limitations Or Follow-Up Specs

- The read-only QA-time inventory of records `widen-id` has not yet widened belongs to the assembled QA slice.
- Board and S-00P controls delivery consume this capability in E-6 order.
- Future artifact types need their own runtime integration; this Spec does not fabricate unavailable consumers.

## Supersession

- Supersedes: none; extends delivered identity compatibility with the newer E-8 policy.
- Superseded by: none.
