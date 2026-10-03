# S-003Y - Notepad Concurrent-Write Safety

**Spec ID:** S-003Y
**Status:** active
**Priority:** 2
**Owner:** claude-captain-dispatcher
**Stance:** Builder
**Updated:** 2026-10-03
**Catalog description:** Make overlapping writes to one JSON notepad impossible to lose silently: every write response says truthfully whether its entry landed.
**Blockers:** none. TK-006H, TK-006I and TK-006J carry every acceptance line; the `notepad` skill wording changed under TK-006J is visible to Notepad Skill Rebuild (S-00Y) at its owner gate.
**Latest event:** TK-006J claimed by claude-captain-dispatcher.
**Next gate:** Close TK-006J with verification and documentation proof.

> **Citation anchors.** pre=`5f3df1f99c04b4b75f1dc5ff585f9377ea2ff61a` post=`5f3df1f99c04b4b75f1dc5ff585f9377ea2ff61a`.

## Outcome

When two or more contexts write one notepad at the same moment, no entry is lost without the writer knowing. A write that reports success is present in the note at the revision the response states; a write that cannot be applied because another write landed first is refused as a stale revision, never reported as appended.

## Why It Matters

A notepad belongs to its objective and every context working that objective writes to it, so overlapping writers are an expected case, not a misuse. The runtime's revision check is a check, not a lock, so today overlapping writers can silently erase each other's entries while each is told it succeeded. The notepad exists so that context whose loss would impair continuation is not lost; a silent loss defeats that, and the owner's session-record rule is to save important context promptly. The accepted ownership decision names this as an unresolved runtime defect with no owning Spec and says closing it needs a new linked Spec; the notepad foundation Spec is complete.

## Current Verified State

At the pre anchor:

- In `workbench/tools/notepads.mjs`, `loadForWrite` reads the note and compares the caller's `--revision` with the note's revision before the update is built. The write then goes through `publish`, which calls `writeSafeFile` without the exclusive option, and `writeSafeFile` in `workbench/tools/workbench-paths.mjs` publishes with an unconditional `renameSync`. The check and the publication are separate steps, so two writers that read the same revision both pass the check and the last rename wins.
- The accepted decision [A notepad belongs to its objective and every chat working that objective writes to it](../../docs/adr/000L-a-notepad-belongs-to-its-objective-and-every-chat-working-that-objective-writes-to-it.md) records a reproduction of 2026-09-15: twelve barrier-synchronized appends at revision 1 returned nine `appended` responses at revision 2, and the resulting note held one entry.
- `tools/test-notepads.mjs` has no concurrency case.
- The `notepad` skill states its writer rule as one writer and keeps a "check, not a lock" paragraph, as the accepted decision requires while the defect stands.
- A failed write leaves the previous valid record unchanged; that property already exists and must be kept.

No implementation or agent-outcome proof for this capability is claimed by this Map record.

## Desired Behavior

1. Every notepad write path that is guarded by `--revision` publishes only if the note is still at the revision the writer read. If another write landed first, the writer receives `stale-revision` naming the current revision and nothing of the refused write reaches the file.
2. A response of `appended` (or the equivalent success of another write) is true: the entry or change is present in the note at the stated revision. A response is never a success for a write that was overwritten.
3. The guard is a real compare-and-swap or a short critical section inside the runtime. It is not a lease or lock held by the writing chat and adds no mandatory coordination service, so standalone local operation is unchanged.
4. A guard cannot wedge a note: a writer that stops mid-write leaves the previous valid record in place and does not block later writers indefinitely.
5. The reproduction is a regression test. The recorded reproduction used barrier-synchronized writers, so the racing writers here wait on a common barrier before calling the write and the test does not depend on process start-up timing; it is red before the fix and green after.
6. Other record writers that publish through the same `writeSafeFile` path and carry a revision, including the Landmark Tracker's, are inspected for the same check-then-act shape. A finding is recorded; it is fixed here only if it shares the repaired seam.

## Decisions And Contracts

- Objective-scoped ownership, several linked notes and the rule that overlapping writes must not overlap are unchanged. This Spec makes the runtime honest about overlap; it does not change who may own or resume a note.
- The accepted decision rejects a mandatory lease as the ownership mechanism and says that rejection does not judge a future compare-and-swap fix. The mechanism is the implementer's choice at Plan within behavior 3 and 4.
- Decided at Plan on 2026-10-03: the guard is a per-target-revision publish token. A writer that read revision N creates the exclusive directory `.<note>.rev<N+1>.publish/` beside the note, re-reads the note inside that token, refuses `stale-revision` unless the file still holds exactly the bytes it read (decided at review 3 on 2026-10-03: the revision number alone is not enough, because a note deleted and recreated at the same path starts at revision 1 again), publishes through the existing temporary-file-and-rename path, and removes the token. Every writer claiming N serializes through the one token for N+1, so the re-read inside it is a true compare-and-swap; a writer that finds the token held re-reads the note and is refused `stale-revision`. `mkdirSync` was chosen over a hard-link token because an exclusive directory create behaves the same on macOS, Linux and Windows and carries no content. A lock file held across the whole command, a lease held by the writing chat and any coordination process were rejected because behavior 3 forbids them and because a lock held across validation widens the window a crash can leave behind.
- Decided at Plan on 2026-10-03: a publish token older than ten seconds is abandoned. The next writer renames it aside and removes it, so only one reclaimer wins and later writers are never blocked indefinitely (behavior 4). The bytes a holder is about to publish are staged inside a nonce-named directory under its own token, so reclaiming a token removes the staged file with it and a holder stalled past the reclaim age fails its rename and is refused as `stale-revision`; a reclaimer's fresh token at the same path carries a different nonce, so a stalled holder's staging path is never satisfied by another writer's bytes. `delete` moves the note into that nonce directory instead of unlinking the live path, so a stale cleanup fails rather than removing a newer write. The publication is the rename of a file that exists only while the token is held, so no window separates the ownership check from the publication. (Decided at the first separate-context review on 2026-10-03, replacing the Plan's nonce-check-before-rename, whose residual stall window the reviewer showed was not bounded in microseconds under a suspended process.)
- Decided at Plan on 2026-10-03: a refusal at the token says `stale-revision` and names the revision on disk, exactly as a sequential mismatch does. It still does not say who wrote or whether the holder will publish; the accepted decision's reading of a refusal is unchanged.
- The `--revision` protocol stays: it is required, a missing or mismatched revision is refused as `stale-revision`, and a refusal does not say who wrote.
- The runtime stays portable Node JavaScript per [ADR-0052](../../docs/adr/0052-node-javascript-remains-the-portable-runtime.md) and uses file-system primitives that behave the same on macOS, Linux and Windows, or records any difference. Windows-host proof belongs to main-readiness testing and is not a blocker here.

## Non-Goals

Changing notepad ownership, the schema or the revision protocol; a mandatory lease, daemon or network coordination; cross-host synchronization, which the private session transport owns; recovering entries lost before the fix; making handoffs or other Markdown records concurrent-safe; implementing another capability.

## Dependencies And Blockers

- [JSON Notepad Foundation](../S-046-json-notepad-foundation/SPEC.md) is complete; this Spec builds on its runtime.
- [Notepad Skill Rebuild](../S-00Y-notepad-skill-rebuild/SPEC.md) is at its owner gate and owns the `notepad` skill's wording; coordinate any skill change rather than editing it independently.
- [Private Session Transport](../S-052-private-session-transport/SPEC.md) owns cross-host synchronization and is out of scope.

## Vertical Implementation Slices

Cut at Plan on 2026-10-03 as record-backed Tasks under `tasks/`; each `TASK.md` carries its state, acceptance and proof. The race was re-reproduced before the cut from a worker-thread barrier against integration 5fa2aab6: six rounds of twelve racers at revision 1 returned three to six `appended` responses each and left one entry.

1. TK-006H writes the barrier regression test red, then the publish-token guard for `append`, `current`, `trim` and `delete`, with the abandoned-token reclaim and the Runbook, template and Wiki sentences that describe it.
2. TK-006I inspects the other revision- or hash-checked `writeSafeFile` writers (the Landmark Tracker's `--expect-revision` moves, `sessions.mjs promote`, the transport's operation lock), fixes a shared seam here and routes a separate seam to a follow-up. It touches no notepad file, so it may run beside TK-006H.
3. TK-006J reconciles the `notepad` skill (coordinated with S-00Y), the Contract statements and the accepted ownership decision's defect paragraph through the decision-record lifecycle, with self-drift receipts. It waits on TK-006H.

## Acceptance Criteria

- [x] A barrier-synchronized race of N writers at one revision leaves the note with exactly the entries whose writers were told they succeeded; every other writer received `stale-revision`.
- [x] The test fails against the pre-fix runtime and passes against the fixed one, and it does not depend on process start-up timing.
- [x] A writer interrupted mid-write leaves the previous valid record and does not block later writers.
- [x] The guard adds no lease, daemon or service, and a note works with no coordination configured.
- [x] Every write path that takes `--revision` is covered, and the inspection of other `writeSafeFile` writers is recorded.
- [x] Source, the `notepad` skill, the accepted ownership decision's description of the defect and the writer rule in the Contract agree after delivery.
- [x] Named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

The public `notepads.mjs` write commands with a fixture note, driven by a harness whose racers wait on a shared barrier. Red/green cases cover the barrier race, the sequential stale refusal that already exists, an interrupted write, and each guarded write path. A one-command demo shows twelve racers and the truthful outcome in under a minute.

## Verification Procedure

Run the targeted notepad tests, then the full AGENTS suite, `render` and `doctor`. Pin the candidate before the source-identity checks. Capture self-drift pre and post receipts and the bounded semantic check, because the writer rule appears in the Contract and the skill. Obtain separate-context review of the immutable candidate before integration, and keep owner Human QA separate. This Map record claims none of that proof.

## Documentation Impact

Reconcile the writer-rule statements in `AGENTS.md`, `LEXICON.md`, the `notepad` skill and its routed Wiki article, with the generic mirrors in `templates/`. The accepted ownership decision is Canon: its statement of the defect changes through the decision-record lifecycle, not by editing history. Record the delivery in this Spec's evidence.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-02 | none | Authored at the Map step to own the defect recorded in the accepted notepad-ownership decision, at integration cbb3d5b81c0081c45d92e0d284078ca13fd54c03. | Map only; the pre-anchor write path was read, the race was not re-run. | This Spec. | Plan, the regression test, the guard and proof remain. |
| 2026-10-02 | none | Re-verified and re-anchored at integration 5f3df1f99c04b4b75f1dc5ff585f9377ea2ff61a after four PRs landed. | Map only; the asserted counts, tool commands, collections and the S-00M status were re-read at that tip; no runtime proof claimed. | This Spec. | Plan, implementation and proof remain. |
| 2026-10-03 | none | Planned at integration 5fa2aab657c8492da22980bfd0d70571600071af: Actuality inspected (`loadForWrite`, `publish`, `writeSafeFile`, the `wx` operation locks in `session-transport.mjs` and `workbench-layout.mjs`, the Tracker's `--expect-revision`, the test harness); the race re-reproduced from a worker-thread `Atomics` barrier (six rounds of twelve racers: 3, 3, 6, 4, 5 and 4 `appended` responses, one entry each round); Tasks TK-005B, TK-005C and TK-005D cut record-backed; the Spec activated; the publish-token guard and the ten-second reclaim decided. | Plan only; doctor and render after the cut; guardrail baseline 78/100 and self-drift pre receipt (8 pre-existing attention findings: blocked-slice, stale-claim, five stale-seed, unverified-provenance; machineResult blocked, cleanUpdate false) captured at 5fa2aab6; no runtime fix claimed. | This Spec and its three TASK.md records. | All implementation and proof remain; TK-005D waits on TK-005B and coordinates the skill with S-00Y. |
| 2026-10-03 | none | Renumbered the three Plan Tasks TK-005B, TK-005C and TK-005D to TK-006H, TK-006I and TK-006J after merging integration f59fce5bd (S-004C and S-004F had allocated TK-005B through TK-005W first; TK-005X through TK-006G are held on remote tips). Records moved with `git mv`; the Plan evidence row above keeps its original text as history. | render and doctor after the move; the claimed in-progress record is now TK-006H. | This Spec, the three TASK.md records, the Wiki article skill-notepad.md. | Suite rerun, close, review and integration merge remain. |
| 2026-10-03 | TK-006H | Task closed | Red 6cedbdf2 (test-notepads 53/4: twelve barrier-released appenders left one entry while four were told appended). Green 32828062: test-notepads 57/57, both race cases 10/10 repeats, demo 1 appended, 11 stale-revision, 0 lost every round. Full AGENTS suite 48/48 on clean 70409372 after merging integration f59fce5b; guardrail 78/100 unchanged; self-drift pre and post receipts unchanged at 8 pre-existing attention findings. | RUNBOOK JSON Notepads paragraph, templates/RUNBOOK.md mirror and Wiki article skill-notepad.md describe the publish-token guard; wiki validate ok. | Separate-context review of the final head, PR into integration and merge. TK-006I (other writeSafeFile writers) and TK-006J (skill, Contract, ADR-000L) remain. Limitation: a writer stalled inside its token beyond the ten-second reclaim age could publish over a newer write within the rename window. |
| 2026-10-03 | TK-006H | Separate-context review 1 (Codex gpt-5.5, read-only) of 7812c0bf9124fc62ced11dd3e3ab7dfa6bf7334b: FAIL with one P2: a holder suspended between its nonce check and the rename for longer than the reclaim age could publish over a newer write, and the Runbook sentence claimed it would refuse. Corrected at 2f06daafc082b47f64c64c7522c07e000e8f30f7: publish bytes are staged inside the token directory, so a reclaim removes them and the stalled rename fails; the Runbook, template, Spec decision and Task scope now describe that mechanism. The CAS path, tests, delete guard and scope boundaries were found sound. | test-notepads 57/57 and both race cases 5/5 repeats at 2f06daafc082b47f64c64c7522c07e000e8f30f7; full suite and fresh review follow. | RUNBOOK.md, templates/RUNBOOK.md, this Spec's Plan decision, TK-006H scope. | Fresh separate-context review of the corrected head, PR merge into integration. |
| 2026-10-03 | TK-006H | Separate-context review 2 (Codex gpt-5.5, read-only) of 213146c282f40f0530e7c892a6b0fdc74b34c096: FAIL with one P1 (`delete` kept the stall window between its byte check and `unlinkSync`, so a stalled cleanup could remove a newer successful write) and one P2 (the Wiki Limits paragraph still presented the pre-guard behavior as current). Corrected at 5cc6c8f68160f9cd66977e6885c6f030165c93c0: ownership is a nonce-named staging directory under the token, publish stages there, `delete` moves the note there instead of unlinking the live path, and the Wiki Limits paragraph dates its old statement and names this Spec. The staged-publish correction for append, current and trim was found sound. | test-notepads 57/57 and both race cases 5/5 repeats at 5cc6c8f68160f9cd66977e6885c6f030165c93c0; wiki validate ok; full suite and review 3 follow. | RUNBOOK.md and templates/RUNBOOK.md (delete sentence), this Spec's Plan decision, TK-006H scope, Wiki skill-notepad.md Limits. | Fresh separate-context review of the corrected head, PR merge into integration. |
| 2026-10-03 | TK-006H | Separate-context review 3 (Codex gpt-5.5, read-only) of 7cfc196ee6923bd808420d5f65f358799f04f9fe: FAIL with one P1: the compare under the token checked only the revision number, so a writer that read a note at revision 1, after that note was deleted and a new one created at the same path at revision 1, would publish its stale copy over the new record. Corrected at e6b234921e1f64cf8cc4d5af698ca7ef1bb1be75: `append`, `current` and `trim` compare the exact bytes they read under the token, as `delete` already did. The nonce-directory staging, the delete move, reclaim serialization and the documentation were found sound. | test-notepads 57/57 and both race cases 5/5 repeats at e6b234921e1f64cf8cc4d5af698ca7ef1bb1be75; the delete-and-recreate case is proven by inspection of the byte compare, because no public seam can stall a writer between its read and its publish deterministically; full suite and review 4 follow. | RUNBOOK.md and templates/RUNBOOK.md (bytes, not revision number), this Spec's Plan decision, TK-006H scope. | Fresh separate-context review of the corrected head, PR merge into integration. |
| 2026-10-03 | TK-006H | Separate-context review 4 (Codex gpt-5.5, read-only) of f2e699009e69d913f25211dfcc17174ab834372c: PASS with no findings; the reviewer found no path that can report a success for a write not in the file or remove a newer successful write, reclaim allows one rename winner, and the records describe the shipped guard. Full AGENTS suite 48/48 on clean f2e69900. This row and the regenerated projection are the only change after the reviewed head; PR #300 merges once a bounded confirmation review of that delta passes. | Full AGENTS suite 48/48 on f2e69900 (suite-s003y-6 log); test-notepads 57/57; both race cases 5/5 repeats. | This Spec evidence row and TASKBOARD.md. | PR #300 merge into integration, then TK-006I and TK-006J. |
| 2026-10-03 | TK-006I | Task closed | Inspection-only: every revision- or hash-checked writeSafeFile writer classified at integration e1b193ce; none shares the notepad publish seam. Scratch barrier reproduction showed Landmark Tracker revise losing 7-10 of 12 writes told revised per round. test-landmark-tracker 23/23, test-sessions 8/8, test-session-transport 18/18, test-notepads 57/57. | S-003Y Remaining Limitations carries the classification and three named follow-up seams; Tracker README already states the not-a-lock limit, so no README or Wiki change. | Follow-up Specs not created: Landmark Tracker concurrent-write safety; Session transport resume against a live notepad writer (S-052 or linked); Promotion destination compare-and-swap. TK-006J remains. |

## Completion Result

Overlapping writes to one notepad can no longer be lost silently. TK-006H added a compare-and-swap publish token to `notepads.mjs` for `append`, `current`, `trim` and `delete`. A writer publishes only if the note still holds exactly the bytes it read. Of writers that read the same revision, one lands and the rest are refused `stale-revision`, and an abandoned token is reclaimed after ten seconds. A barrier race test went red, then green (`tools/test-notepads.mjs`), after four separate-context reviews (PR #300). TK-006I inspected the other revision- or hash-checked `writeSafeFile` writers. None shares the repaired seam, and three separate seams are named below for their own follow-up Specs (PR #320). TK-006J reconciled the writer rule. The `notepad` skill now says an overlapping write is refused, not lost. [ADR-000Z](../../docs/adr/000Z-overlapping-notepad-writes-are-refused-not-lost.md) narrows ADR-000L's defect statement through the decision-record lifecycle and leaves ADR-000L's text unchanged. `AGENTS.md` and `LEXICON.md` keep "one writer at a time" unchanged, and a dated Wiki line no longer presents the pre-guard check as current. No owner approval or Human QA is claimed.

## Remaining Limitations Or Follow-Up Specs

Other revision-carrying writers are inspected here and fixed here only if they share the seam; a separate seam becomes its own Spec.

TK-006I inspected them at integration `e1b193ce3df98ad243b405850dca8f7b783e038d`. None shares the repaired seam. The guard lives in `notepads.mjs` (the per-revision token and byte compare), and `writeSafeFile` only offers the `stagingDir` hook that the guard uses. So no writer was fixed here. Three separate seams each need their own follow-up Spec. None has been created; each is named for the owner to cut:

1. **Landmark Tracker concurrent-write safety.** `revise`, `link` and `relate` compare `--expect-revision` with the record they loaded (`requireRevision`). They then validate and publish the record and the `TRACKER.json` projection through unconditional `writeSafeFile` renames. Two writers that read revision N both pass, and the later rename wins. A barrier reproduction lost 7 to 10 of every 12 writes, and each lost writer was told `revised` (the TK-006I evidence row has the numbers). The Tracker README already says the check is not a lock and asks for one writer per record, so this is a known limit, not drift. A fix could reuse the `stagingDir` hook with a per-record token, but the record-plus-projection write is a two-file seam the notepad guard does not cover. `capture` and `add-landmark` publish with the no-replace link and are not affected.
2. **Session transport resume against a live notepad writer.** Transport operations serialize each other through the `wx` operation lock, and that part is sound. But `resume` checks a note's hash and then writes the remote bytes with `writeSafeFile`, without taking the notepad publish token. A local `notepads.mjs` write that lands between that check and that write is overwritten after it was told `appended`. A local publish that lands after the transport's read-back overwrites the resumed bytes in the same way. Cross-host synchronization is outside this Spec, so this belongs with [Private Session Transport](../S-052-private-session-transport/SPEC.md) (active) or a new Spec linked to it.
3. **Promotion destination compare-and-swap.** `sessions.mjs promote` re-reads the destination hash, then runs the backup and an unconditional `writeSafeFile`. Two promoters holding the same `--expected` hash can both pass, and the later one wins. If the earlier one's read-back fails, it restores the original bytes over the other promoter's write. The window is short and the tool documents itself as a single-writer operation on a Git-tracked owner, so this is the lowest of the three.

Classified as no follow-up: the `spec-workbench.mjs` collision-recovery writer rechecks its expected HEAD, the source Task hash, a clean status and the Git index, and then publishes. It has the same check-then-act shape, but it runs only under the Contract's single durable writer for shared Spec state, and Git keeps the prior bytes. `adr.mjs`, `wiki.mjs`, `workbench-adoption.mjs`, the other `spec-workbench.mjs` writers and `workbench-layout.mjs` take no caller-supplied revision or hash. The layout identity write is already serialized by its own `wx` lock. `spec-report.mjs` `verdict` and `approve` check a content digest but publish through `atomicWrite`, not `writeSafeFile`, so they fall outside this inspection. They have the same shape under the same single-writer rule.

TK-006J limits: the `notepad` skill paragraph changed after Notepad Skill Rebuild (S-00Y) reached its owner gate, so that Spec's owner review should read the new paragraph. The lane copy is the binding one. Installed host copies of the skill, such as a personal `~/.claude/skills/notepad`, are not updated here. Windows-host behavior of the token remains main-readiness testing.

## Supersession

- Supersedes: none
- Superseded by: none
