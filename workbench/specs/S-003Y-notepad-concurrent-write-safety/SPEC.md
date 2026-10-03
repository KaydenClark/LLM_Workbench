# S-003Y - Notepad Concurrent-Write Safety

**Spec ID:** S-003Y
**Status:** active
**Priority:** 2
**Owner:** claude-fable-s003y
**Stance:** Builder
**Updated:** 2026-10-03
**Catalog description:** Make overlapping writes to one JSON notepad impossible to lose silently: every write response says truthfully whether its entry landed.
**Blockers:** none for TK-005B (the guard and its barrier test) and TK-005C (the inspection of other writers). TK-005D (the skill, Contract and ownership-decision reconciliation) waits on TK-005B and coordinates the skill wording with S-00Y.
**Latest event:** TK-005B claimed by claude-fable-s003y.
**Next gate:** Close TK-005B with verification and documentation proof.

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
- Decided at Plan on 2026-10-03: the guard is a per-target-revision publish token. A writer that read revision N creates the exclusive directory `.<note>.rev<N+1>.publish/` beside the note, re-reads the note inside that token, refuses `stale-revision` unless it is still at N, publishes through the existing temporary-file-and-rename path, and removes the token. Every writer claiming N serializes through the one token for N+1, so the re-read inside it is a true compare-and-swap; a writer that finds the token held re-reads the note and is refused `stale-revision`. `mkdirSync` was chosen over a hard-link token because an exclusive directory create behaves the same on macOS, Linux and Windows and carries no content. A lock file held across the whole command, a lease held by the writing chat and any coordination process were rejected because behavior 3 forbids them and because a lock held across validation widens the window a crash can leave behind.
- Decided at Plan on 2026-10-03: a publish token older than ten seconds is abandoned. The next writer renames it aside and removes it, so only one reclaimer wins and later writers are never blocked indefinitely (behavior 4). A holder verifies its own token nonce immediately before the rename, so a holder whose token was reclaimed refuses instead of publishing over a newer write. The remaining window between that verification and the rename is microseconds and is reached only by a writer stalled inside a token for longer than the reclaim age; it is recorded as a limitation, not hidden.
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

1. TK-005B writes the barrier regression test red, then the publish-token guard for `append`, `current`, `trim` and `delete`, with the abandoned-token reclaim and the Runbook, template and Wiki sentences that describe it.
2. TK-005C inspects the other revision- or hash-checked `writeSafeFile` writers (the Landmark Tracker's `--expect-revision` moves, `sessions.mjs promote`, the transport's operation lock), fixes a shared seam here and routes a separate seam to a follow-up. It touches no notepad file, so it may run beside TK-005B.
3. TK-005D reconciles the `notepad` skill (coordinated with S-00Y), the Contract statements and the accepted ownership decision's defect paragraph through the decision-record lifecycle, with self-drift receipts. It waits on TK-005B.

## Acceptance Criteria

- [ ] A barrier-synchronized race of N writers at one revision leaves the note with exactly the entries whose writers were told they succeeded; every other writer received `stale-revision`.
- [ ] The test fails against the pre-fix runtime and passes against the fixed one, and it does not depend on process start-up timing.
- [ ] A writer interrupted mid-write leaves the previous valid record and does not block later writers.
- [ ] The guard adds no lease, daemon or service, and a note works with no coordination configured.
- [ ] Every write path that takes `--revision` is covered, and the inspection of other `writeSafeFile` writers is recorded.
- [ ] Source, the `notepad` skill, the accepted ownership decision's description of the defect and the writer rule in the Contract agree after delivery.
- [ ] Named verification and remaining limitations are recorded without claiming owner approval.

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

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

Other revision-carrying writers are inspected here and fixed here only if they share the seam; a separate seam becomes its own Spec.

## Supersession

- Supersedes: none
- Superseded by: none
