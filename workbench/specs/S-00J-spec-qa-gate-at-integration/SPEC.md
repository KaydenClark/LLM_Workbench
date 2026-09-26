# S-00J - Spec QA Gate And Corrective-Task Return Path

**Spec ID:** S-00J
**Status:** active
**Priority:** 3
**Owner:** DISPATCHER
**Stance:** Builder
**Updated:** 2026-09-26
**Catalog description:** Make a separate context review the assembled Spec against its Task results, route a failed review into corrective Tasks under the still-open Spec, keep `integration` as the owner's Human QA surface, and refuse to close a Spec without a passed review and recorded owner approval.
**Blockers:** none; S-00H is `complete` (integration `49c671e`).
**Latest event:** 2026-09-26 Lane H renumbered the Codex wave packets to TK-01R/TK-01S (TK-00G/TK-00H went to S-00V and TK-01Q to S-01U first), wrote the closure-capture transition contract from the owner's WF-8E/WF-8H/WF-8F and SCR answers, released TK-01R and added TK-01T for the reviewed-delivery blocker. Human QA remains underway with failed reviews; no owner approval is recorded.
**Next gate:** Execute TK-01R, then TK-01S, then TK-01T serially in one runtime lane; Dispatcher whole-Spec QA precedes separate-context review of each immutable candidate. Do not request that the owner restart Human QA.

> **Citation anchors.** pre=`e3c5c8f343ec36d411bb6b9ea656e0f53c7406cb` post=`e3c5c8f343ec36d411bb6b9ea656e0f53c7406cb`.

## Outcome

QA/Verify has one shape at each delivery altitude. A Task proves itself with
red/green TDD, relevant tests, actual behavior checks and preserved proof, with
no per-Task independent-review ceremony. A separate context then reviews the
assembled Spec and the combined result of all its Tasks against the Spec's
destination, bound to an immutable candidate. A failed review is diagnostic and
generative: it states what is wrong and creates corrective Tasks under the
still-open Spec, after which a fresh candidate is reviewed. A passed review
lets the Spec move to `integration`, where the owner performs Human QA. A Spec
closes only after that review passed, the owner's approval on `integration`
is recorded, and the approved delivered content is verified on main; no Git
merge alone closes it. All of this is a local tool and process
gate in the harness's own workflow, not GitHub enforcement.

## Why It Matters

Today the integration review is the only gate at that boundary, and
`AGENTS.md` describes the reviewed candidate in task-level terms. A task-level
check can pass repeatedly while the capability the Spec promised remains
unmet, because a Task is deliberately too small to demonstrate a Spec's
acceptance. Nothing verifies the whole Spec against its destination, nothing
turns a failed verification into bounded work, and `complete` succeeds with no
review and no owner judgment. The owner's answer is that QA asks whether the
destination was reached, that failure produces corrective Tasks rather than
blame or a terminal ritual, and that closure is the owner's confirmed
judgment on `integration`.

## Current Verified State

At the pre anchor, `AGENTS.md` requires a separate-context reviewer to check an
immutable candidate against its controls, assigned spec and named evidence
before branches combine into `integration`, and
[ADR-0037](../../docs/adr/0037-independent-review-at-integration.md) carries
that decision. `integration` is declared in `workbench/manifest.json` as
`git.integrationBranch`. `spec-workbench.mjs complete` refuses a Spec with an
unfinished slice, an unchecked acceptance box, no completion result or no
evidence, and reads nothing else: no review verdict, no candidate SHA, no owner
approval. No command reports an assembled Spec's state for a reviewer, records
a verdict, or creates corrective Tasks from one. ADR-000F is `proposed` and
leaves the failure return path open, which WF-8C has since settled. This
repository has no `.github/` workflow and `integration` carries no branch
protection.

## Desired Behavior

A reviewer in a separate context runs one command against a Spec and an
immutable candidate SHA and receives the assembled state: every Task done with
proof, every acceptance line, the evidence rows, and the gaps. The reviewer
records a verdict bound to that SHA. A failed verdict creates one or more
corrective Task records under the still-open Spec with the diagnosed defects,
and `render` shows them; the previous Tasks are already done and are not
reopened, whether they still sit as done records or S-00I has retired them.
A passed verdict is what the harness's merge-preparation workflow requires before it presents a Spec candidate for `integration`, with
the branch resolved from the manifest declaration.

`integration` remains the Human QA branch. The owner inspects assembled
behavior there and records approval or a finding. `complete` refuses without a
passed review verdict on the exact candidate and a recorded owner approval
naming the `integration` SHA inspected, and final closure additionally requires
verification of the approved delivered content on the declared default branch.
A failed Human QA finding against an
existing destination becomes corrective Task work; a changed destination
returns to Align.

The gate is invoked for a named Spec and a named candidate SHA. A Spec
candidate is a branch its invoker presents as that Spec's assembled result;
a Task PR is a branch presented for one Task ID while its Spec stays open.
While S-00O exemption 2 holds, every Task lands as its own Task PR into
`integration` under the `AGENTS.md` integration gate: the gate reports the
Spec's assembled state on it and does not refuse it for the Spec being
incomplete. An agent that opens a PR by some other path, bypassing the
harness's skills, is not stopped by GitHub itself; that would need
repository-level enforcement, which is out of scope.

## Decisions And Contracts

- The design this Spec implements is the set of locked WF-8, WF-8B, WF-8C and
  WF-8E answers in the WF grilling note at revision 57, carried by
  [S-00O](../S-00O-workbench-v4-0-0-release/SPEC.md) and promoted into the
  controls by [S-00P](../S-00P-workflow-canon-rework/SPEC.md). The note is
  untracked working material named as origin, not durable evidence.
- The two gates, their triggers and the reviewed unit are described by
  [ADR-000F](../../docs/adr/proposed/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md),
  which is `proposed` and is evidence, not instruction. Its open "failure
  return path" is now WF-8C, and S-00P TK-004 accepts, amends or supersedes
  the record to match. ADR acceptance is not a blocker of this Spec.
- Independent review at integration, which this extends rather than replaces:
  [ADR-0037](../../docs/adr/0037-independent-review-at-integration.md). The
  reviewed unit becomes the assembled Spec; the immutable-candidate
  requirement is unchanged.
- The gate reads Task records, so it depends on
  [S-00H](../retired/S-00H-task-artifact-and-terminology-migration/SPEC.md).
  Corrective Tasks are Task records created through the same seam.
- Closure precedes reconciliation and retirement, which are
  [S-00I](../S-00I-folder-lifecycle-for-records/SPEC.md); this Spec ends at a
  closed Spec.
- Exemption 2 in S-00O: while it is active the gate distinguishes a Task PR
  (presented for a Task ID with its Spec still open) from a Spec candidate
  (presented as the Spec's assembled result) and refuses only the latter.
  The Spec-candidate refusal is exercised by test until Spec-branch tooling
  ends the exemption and real Spec candidates exist.

## Non-Goals

- Replacing the independent separate-context review or human judgment with a
  checklist; the report informs the reviewer, the reviewer decides.
- A per-Task independent-review ceremony, which WF-8B rejected.
- Any change to who merges `integration` into `main`; that stays owner-only.
- Reopening or resurrecting retired Specs; a finding against a retired
  destination is a corrective Task against the Wiki record (S-00I).
- **GitHub-level enforcement.** Adding a `.github/` workflow, required status
  check or branch-protection rule is out of scope; `.github/` is outside this
  Spec's Edit Scope and repository settings need their own owner
  authorization. A later linked Spec may take that on.
- Control and template prose; S-00P phase two writes it.

## Dependencies And Blockers

S-00H is complete and its Task-record seam is available. The original
implementation dependency is satisfied. The 2026-09-26 corrective packets
are deferred pending a Director write-lane release, rather than represented
as blocked on completed S-00H or on whole-Spec S-00G completion.

Coordinate the narrow Task-body decision representation with its S-00H-successor
owner and S-00G's decision-routing work. The ownership-map portability schema,
FND-Q24B and proposed ADR acceptance are not prerequisites for detecting an
explicit unresolved durable Task choice. They remain unresolved in their own
owners; this Spec does not decide them. S-00I consumes the main-verified closure
result before feature capture, per the closure-capture transition contract below. S-00P owns shared role/procedure prose; the
Director coordinates any P/I/O delivery prerequisite correction without
bypassing existing blockers.

### Corrective delivery contract — 2026-09-26

The assigned role chain is Worker self-check/report, Dispatcher whole-Spec QA,
then separate Director review of the immutable assembled Spec before integration.
This supersedes older per-Task review wording in this Spec's current procedure;
completed Task records and evidence remain history. Human QA remains owner-led
and separate, at useful owner-selected review points; main promotion stays
owner-only. Final closure follows verification of the delivered content on main.

The existing [decision-routing ledger](../../wiki/grilling-destination-audit-ledger.json)
records FND-Q21C's four-tier rule and explicit S-00J destination: durable Task
choices escalate at close and remain a gap until reconciled. Task bodies carry
choices; Receipts carry run facts. TT-Q12 is only partially answered: its
promotion-evidence threshold remains open. A selected encoding or a filled owner
route does not prove approval or settle that threshold.

Existing per-Spec content-bound owner-QA rows are the proposed minimum for a
named accumulated approval scope: each Spec requires its own explicit approval,
and observations/findings never approve other Specs. The main-proof representation
and narrow decision-body encoding are implementation proposals to settle in the
coordinated lanes, not new accepted schemas. Direct Blueprint Task and missed-attempt
coverage depend on their artifact owners; no fake Spec or Task is introduced here.

### Closure-capture transition contract - 2026-09-26

This is the one transition contract S-00I and S-00P consume. It resolves the
2026-09-26 wave finding that S-00P's TK-003/TK-005 packets put `complete`
after features capture while this Spec's TK-01S put capture after `complete`.
The owner's recorded answers settle it, so no owner question was asked:
WF-8E (review, integration, owner Human QA, then close, then Wiki
reconciliation, then retirement), WF-8H (the features article is written at
the closure point and is not a new gate), WF-8F and FND-Q07 (discard only after
verified main) and the separate-context-review grilling decisions 009, 011 and
012 of 2026-09-24 (closure, meaning features capture and record cleanup, waits
for verification on main; TASK.md stays the record until cleanup). The
[ledger](../../wiki/grilling-destination-audit-ledger.json) carries the WF and
FND rows; the SCR decisions are owner answers in grilling notes whose promotion
is still pending.

| Step | Transition | Gate | Owner |
|---|---|---|---|
| T0 | Reviewed delivery | Every Task done, acceptance checked, Dispatcher whole-Spec QA, separate Director PASS verdict bound to the immutable candidate, candidate contained in the declared integration branch with matching committed digest. The Spec stays `active`. | S-00J (existing `gate`, TK-01T consumer) |
| T1 | Owner approval | A per-Spec content-bound owner-QA row at owner-selected timing; an accumulated scope names each Spec. Tests, review and observations are never approval. | S-00J (existing `recordOwnerApproval`) |
| T2 | Main verification | The owner alone promotes integration to main. The approved candidate is an ancestor of the refreshed declared default-branch ref and its committed digest equals the approved digest. | S-00J TK-01S |
| T3 | `complete` | Refuses without T0, T1 and T2 and writes nothing on refusal; records the observed main ref/SHA and approved candidate/digest in the completion evidence row. | S-00J TK-01S |
| T4 | Features capture | Requires T3. Writes the Spec's features Wiki article at the closure point. A failed capture leaves the Spec complete and uncaptured, visible, and never reverts `complete`. | S-00I |
| T5 | Retirement | Requires the captured features article as the retirement target. TASK.md records, including missed attempts, stay until this step. | S-00I |
| T6 | Discard | Requires recorded T2 proof, a clean reference scan and recoverable Git identity. | S-00I |

Consequences: `complete` is gated on main verification and not on features
capture; capture precedes all transient-record cleanup. A dependent that needs
only the delivered behavior on integration consumes T0 through an explicit
reviewed-delivery blocker (TK-01T); a dependent that needs final closure keeps
a plain Spec blocker and consumes T3. Existing blocker edges are kept, never
deleted to unblock work.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Report the assembled Spec state for a reviewer at a stable seam | done | S-00H | Red at the pre anchor 956c6a4: tools/test-spec-report.mjs fails with ERR_MODULE_NOT_FOUND for workbench/tools/spec-report.mjs, and its first block asserts an incomplete fixture Spec reports complete false with its unfinished Task, unchecked acceptance line and placeholder completion result as gaps. Green: assembleSpecReport(rootDir, specId, { candidate }) composes loadSpecs, findSpec, slicesOf and readReceiptFromFile without reparsing; one merged Task list in visible-id order (records with Receipt run data, and a record-backed Spec's retained done rows marked source row and history true, so report S-00H lists all eight Tasks); every acceptance line with its checked state; evidence rows as cell arrays with the header preserved (mixed five- and six-cell rows parse); the completion result; gaps; complete only when gaps is empty; the candidate resolved through git rev-parse with resolvedSha, existence and HEAD equality (a seven-character SHA matches); a report verb printing a plain-text form or JSON that never refuses (exit 0 on an incomplete Spec, asserted); line-anchored section resolution with a shadowing fixture; RUNTIME_TOOLS twenty; tools/test-spec-report.mjs added to the AGENTS.md and RUNBOOK.md suite lists. Full 44-command suite on the committed tip 2dbac6e, reproduced by the reviewer on a clean worktree; doctor no blocking finding; next, doctor and render byte-identical to the base on this room; a completed Spec byte-identical after reporting. Separate-context review (Claude Opus 5): 0cf4e46 FAIL on three Mediums (retained done rows omitted; matchesHead false for a short SHA; never-refuse untested) and two Lows, corrected in 2dbac6e and re-reviewed PASS with mutations M1-M6 red. Built by Claude Sonnet 5 from the lane handoff. Landed by PR #118; integration f5e0fe7 contains 2dbac6e |

### TK-001 - Report the assembled Spec state for a reviewer at a stable seam

**Stance:** Builder

Define the report against the Spec's Task records: each Task's status and
proof, each acceptance line and whether it is checked, the evidence rows, the
completion result, and the gaps, all bound to the candidate SHA the reviewer
names. Add the failing test with a fixture Spec holding one unfinished Task,
confirm it fails, then implement the smallest report that turns it green. The
report informs; it does not yet refuse anything.

### TK-002 - Record a separate-context review verdict against the immutable candidate

**Stance:** Builder

A verdict is pass or fail, with findings, the reviewer's context named, and
the exact candidate SHA. It is appended to the Spec's append-only evidence
and never rewritten. Recording a verdict for a SHA that is not the current
candidate is refused, so a review cannot be reused after the candidate moves.

### TK-003 - Turn a failed verdict into corrective Tasks under the still-open Spec

**Stance:** Builder

From a failed verdict, create one Task record per diagnosed defect through
the Task seam S-00H delivered, allocated with `next-id`, blocking nothing
already done. The Spec stays open. Run `render` and prove the board shows
the corrective Tasks. Prove done Tasks are not reopened; this Spec runs in
parallel with S-00I, so prove that against the Task record's own done state
from S-00H, and against the `retired` folder only once S-00I TK-005 exists.
The next review
is of a fresh immutable candidate, through TK-002 again.

### TK-004 - Bind the gate into `complete` and the merge-preparation workflow

**Stance:** Builder

`complete` refuses without a passed verdict on the current candidate. Resolve
the integration branch from `git.integrationBranch` rather than hardcoding
it. Invoke the gate as a required step in the branch-completion path the
delivery skills and `AGENTS.md` Branch Completion describe, so a Spec
candidate with an incomplete Spec or a failed or stale verdict refuses to
proceed and a complete, passed one proceeds unchanged. The discriminator is
what the invoker presents: a Spec ID with a candidate SHA is a Spec
candidate; a Task ID with its Spec still open is a Task PR, which is what
every PR in this rollout is while S-00O exemption 2 is active, and the gate
reports on it without refusing. Until Spec-branch tooling ends the
exemption, the refusal path is proven by test rather than by a live Spec
candidate. This binds the harness's own
process; it does not and cannot make GitHub refuse a merge opened by some
other path.

### TK-005 - Require recorded owner Human QA approval before closure

**Stance:** Builder

Owner Human QA on `integration` is recorded as an approval naming who, when
and the `integration` SHA inspected, or as a finding. `complete` requires
the approval and refuses without it. A finding against the existing
destination creates corrective Tasks through TK-003; a finding that changes
the destination is recorded as a return to Align, not as corrective work.
Keep the record minimal: the owner asked for accountability, not ceremony.

### TK-006 - Correct reviewed-unit language in the review and delivery skills

**Stance:** Builder

The review and delivery skills describe the reviewed candidate in task-level
terms. Correct them to the assembled Spec, consistent with the locked WF-8C
answer, without weakening the immutable-candidate requirement from ADR-0037.
`AGENTS.md` and `RUNBOOK.md` are rewritten by S-00P phase two, not here.

## Acceptance Criteria

- [x] A reviewer can obtain the assembled state of a Spec bound to a
      candidate SHA, proven by a test that failed before the change.
- [x] A review verdict is recorded append-only against the exact candidate
      content (the assembled Spec's digest, with the candidate SHA named)
      and refused for any other content or for a SHA the repository does
      not hold; TK-004 replaced the exact-`HEAD` rule TK-002 shipped.
- [x] A failed verdict produces corrective Task records under the still-open
      Spec, visible on the board, without reopening done Tasks (the
      retired-folder case once S-00I TK-005 exists).
- [x] `complete` refuses without a passed verdict on the current candidate
      and a recorded owner approval naming the `integration` SHA.
- [x] The harness's merge-preparation workflow refuses an incomplete or
      unreviewed Spec candidate, passes a complete reviewed one unchanged,
      and, while S-00O exemption 2 is active, reports rather than refuses a
      branch presented for a Task ID with its Spec still open. This does not
      claim GitHub itself refuses anything.
- [x] The integration branch is resolved from the manifest declaration.
- [x] Review and delivery skills name the assembled Spec as the reviewed
      unit; the independent review requirement is unchanged.
- [x] The full verification suite passes and `doctor` is clean.
- [ ] An explicit unresolved durable decision in a live or retired Task body
      remains visible and refuses assembled-Spec readiness and closure until
      reconciled to its durable owner; legacy absence is not affirmative proof.
- [ ] Final closure requires verification of approved delivered content on the
      declared default branch, while reviewed integration delivery remains
      possible before owner QA; approvals cover only explicitly named Specs.
- [ ] Corrective delivery preserves S-00U F1/F2/F3/F6 and supplies fresh full-suite,
      Dispatcher whole-Spec QA and separate Director immutable-candidate review.

## Testing Seams

The assembled-Spec report function; the verdict append path in the Spec's
evidence; the Task creation seam from S-00H; `spec-workbench.mjs complete`;
the branch-closeout path covered by `tools/test-branch-closeout.mjs`; the
manifest branch declaration; and the skill catalog and inspection tests.

## Verification Procedure

Run the targeted test for the touched seam, then the full verification suite
named in `AGENTS.md`, then
`node workbench/tools/spec-workbench.mjs doctor`. Workers self-check and return
proof to the Dispatcher; the Dispatcher verifies the assembled Spec. Separate
Director review of the immutable assembled candidate is required before
integration. Shared write lanes and generated projections remain Director-coordinated.

## Documentation Impact

`AGENTS.md` (reviewed unit, corrective-Task return path, Human QA closure) and
`RUNBOOK.md` (the report, verdict, corrective-Task and approval commands and
their failure output) are rewritten by S-00P phase two, which is blocked on
this Spec, so that the procedures name only commands that exist. TK-006
changes the skills only. The generic `templates/` mirror changes in S-00P
TK-005.

## Append-Only Evidence And Execution Log

| Date | Commit | Claim | Method | Result |
|---|---|---|---|---|
| 2026-09-12 | c0ac60a | Spec authored; no implementation performed | Read-only review of AGENTS, ADR-0037 and the manifest | Independent review exists at integration; no Spec-completeness check exists at the merge boundary |
| 2026-09-12 | b4edb20 | Review found the Spec's "merge request... triggers" framing was not achievable by its own listed seams: no `.github/` directory exists in this repository, `integration` carries no branch protection (`gh api .../branches/integration/protection` returns 404), and `.github/` is outside this Spec's Edit Scope | Checked for `.github/` on disk and queried branch protection via the GitHub API | Reframed Outcome, Why It Matters, Desired Behavior, TK-002, and Acceptance Criteria around a local/harness-workflow gate rather than a GitHub-enforced one; added an explicit GitHub-level-enforcement Non-Goal; no implementation performed |
| 2026-09-12 | f2d2e87 | Review found Documentation Impact landed the RUNBOOK.md gate command "at ADR acceptance", before TK-001/TK-002 implement and bind it | Re-read this Spec's own ticket sequencing against its Documentation Impact claim | Split Documentation Impact: AGENTS.md's conceptual description still lands at acceptance, but RUNBOOK.md's command documentation waits for TK-002; no implementation performed |
| 2026-09-16 | e3c5c8f | Rewritten against the WF grilling note at revision 57 under directive-018: reviewed unit is the assembled Spec (WF-8C), no per-Task ceremony (WF-8B), failed review creates corrective Tasks under the still-open Spec (WF-8C), closure needs passed review plus recorded owner Human QA on `integration` (WF-8E); stale "WF-8 open" and ADR-000F acceptance blockers removed; slices recut from three to six; no implementation performed | Read decisions 068, 069, 079 and correction-023 against every section; confirmed at the anchor that `complete` reads no verdict or approval and that no `.github/` or branch protection exists | Status `blocked` on S-00H only; anchors moved to the integration tip the rewrite read at; GitHub-enforcement Non-Goal preserved |
| 2026-09-18 | TK-001 | Task closed | Red at the pre anchor 956c6a4: tools/test-spec-report.mjs fails with ERR_MODULE_NOT_FOUND for workbench/tools/spec-report.mjs, and its first block asserts an incomplete fixture Spec reports complete false with its unfinished Task, unchecked acceptance line and placeholder completion result as gaps. Green: assembleSpecReport(rootDir, specId, { candidate }) composes loadSpecs, findSpec, slicesOf and readReceiptFromFile without reparsing; one merged Task list in visible-id order (records with Receipt run data, and a record-backed Spec's retained done rows marked source row and history true, so report S-00H lists all eight Tasks); every acceptance line with its checked state; evidence rows as cell arrays with the header preserved (mixed five- and six-cell rows parse); the completion result; gaps; complete only when gaps is empty; the candidate resolved through git rev-parse with resolvedSha, existence and HEAD equality (a seven-character SHA matches); a report verb printing a plain-text form or JSON that never refuses (exit 0 on an incomplete Spec, asserted); line-anchored section resolution with a shadowing fixture; RUNTIME_TOOLS twenty; tools/test-spec-report.mjs added to the AGENTS.md and RUNBOOK.md suite lists. Full 44-command suite on the committed tip 2dbac6e, reproduced by the reviewer on a clean worktree; doctor no blocking finding; next, doctor and render byte-identical to the base on this room; a completed Spec byte-identical after reporting. Separate-context review (Claude Opus 5): 0cf4e46 FAIL on three Mediums (retained done rows omitted; matchesHead false for a short SHA; never-refuse untested) and two Lows, corrected in 2dbac6e and re-reviewed PASS with mutations M1-M6 red. Built by Claude Sonnet 5 from the lane handoff. Landed by PR #118; integration f5e0fe7 contains 2dbac6e | RUNBOOK.md Spec Lifecycle And Retrieval gains the report verb and its one-line description in this state PR; the suite-list line landed in the lane; S-00O's evidence log records the twentieth managed runtime tool and the 44-command suite in this state PR; operational prose for the review gate is S-00P phase two | The plain-text form's history marker is unasserted (the CLI test proves the verb prints what formatSpecReport returns, not the formatter's content); the gap scan over retained history rows is unreachable while assertOneSliceTruth refuses a non-done retained row; the report reads the working tree and names the candidate, it does not read blobs at the SHA (TK-002 refuses a verdict on a moved candidate). Who runs close, and therefore whose Git facts the Receipt row records, is a design input for TK-004's gate |
| 2026-09-18 | TK-002 | Task closed | Red at the pre anchor df73041: tools/test-spec-report.mjs fails on the missing recordReviewVerdict export, and with a stub export still fails behaviorally (a verdict for a SHA that is not the current HEAD must be refused). Green: recordReviewVerdict(rootDir, specId, { candidate, result, findings, reviewer }) in workbench/tools/spec-report.mjs and a verdict verb append one six-cell evidence row (date, review, Review verdict: result at sha, findings, reviewer, remaining gap) through appendEvidence and atomicWrite exported from spec-workbench.mjs, never duplicated; a candidate absent from the repository and one that is not the room's exact HEAD are refused with distinguishable errors naming the SHAs, a refusal writes nothing, an abbreviated SHA is refused, result accepts only pass or fail and reviewer must be non-empty with each refusal leaving the Spec byte-identical and verdicts empty; the report gains verdicts and latestVerdict for the named candidate, and its plain-text form prints a Verdict line and the history marker on retained rows; findings and reviewer cells are escaped so a pipe or newline cannot inject a row. Full 44-command suite on the committed tip 8f31c4e, reproduced by the reviewer on a clean worktree; next, doctor, render, TASKBOARD.md and CATALOG.md byte-identical to the base on this room; no room Spec gained a row. Separate-context review (Claude Opus 5): ada3185 PASS with two Mediums (result and reviewer validation unpinned; exact HEAD equality unusable in the live workflow) and two Lows, corrected in 8f31c4e where testable and re-reviewed PASS with nine of nine mutations red. Built by Claude Sonnet 5 from the lane handoff. Landed by PR #120; integration 1c40578 contains 8f31c4e | RUNBOOK.md Spec Lifecycle And Retrieval gains the verdict verb and its one-line description in this state PR, and its report prose is reworded so the candidate fields read as reported facts and the never-refuses claim is scoped to Spec state (the PR #119 review's Lows); LEXICON.md rows for Spec and Task already describe the review as a separate-context gate; operational prose for the gate is S-00P phase two | Current candidate is exact equality with the room's HEAD, which the live review workflow cannot satisfy: a reviewer in a detached worktree writes the row into that worktree's Spec, the dispatcher's HEAD is integration, and a merge commit never equals the reviewed tip; the moved-candidate fixture pins out the ancestor-of-HEAD relaxation, so TK-004 must redefine current candidate and own that test edit, with the two refusals now separate so the equality half can be relaxed alone. tools/check-append-only.py has never seen a real verdict row; two same-day verdicts for one candidate and result would share its row identity, unreachable while the second is refused, and TK-003 must name the verdict row a corrective Task answers unambiguously. Who runs close, and whose Git facts the Receipt records, remains TK-004's design input |
| 2026-09-18 | TK-003 | Task closed | Red at the pre anchor b595935 in tools/test-spec-report.mjs: a fail verdict with no actionable finding was accepted (Missing expected exception), and createCorrectiveTasks was not exported. Green: recordReviewVerdict with result fail refuses before any write when the findings name no actionable item, otherwise appends the verdict row and calls the new exported createCorrectiveTasks(rootDir, specId, { candidate, findings }) in the same operation; that seam derives one Task per semicolon-separated finding from the anchored fail row's own findings cell (a caller's differing findings are refused by name), normalizes whitespace so a multi-line finding round-trips through readTaskRecord, allocates ids with the room's allocator from one snapshot, stages and validates the whole batch before writing, writes each record through formatTaskRecord with Status ready, Blockers none, the Spec's acceptance as destination and a Planned verification naming the verdict row by its on-disk ordinal, never touches done Tasks or the Spec header Status, refuses a second set for the same candidate and row, and a pass verdict creates nothing; the corrective Task is selectable by next and visible on the hot board; no new verb and spec-workbench.mjs untouched. Full 44-command suite on the committed tip cccdf8f, reproduced by the reviewer on a clean worktree; next, doctor and render byte-identical to the base on this room; no room Task or row added. Separate-context review (Claude Opus 5): 8d07cd1 PASS with three Mediums (multi-line finding truncated in the record; Tasks derived from the caller's argument rather than the anchored row; a second call duplicated the set) and a Low, corrected in cccdf8f and re-reviewed PASS with ten of ten mutations red. Built by Claude Sonnet 5 from the lane handoff. Landed by PR #124; integration 1a44440 contains cccdf8f | Docs checked; no update needed: no verb or option was added, the verdict line in RUNBOOK.md already covers the failing case, and the corrective-Task behavior is described by this Spec's TK-003 section; operational prose for the gate is S-00P phase two | Splitting on semicolons over-splits a finding whose text contains one; it never merges or drops and matches the landed remaining-gap count. A disk failure between the verdict row and the Task writes leaves a partial set recoverable by calling createCorrectiveTasks on the same row, now refused once complete. The retired-folder case is proven only against a record's own done state until S-00I TK-005 exists. The allocator batch no longer runs refuseBlockedRuntime, consistent with the evidence-row write. The verdict's exact-HEAD binding still blocks a live run from a detached worktree; TK-004 redefines it |
| 2026-09-18 | TK-004 | Task closed | Red at the pre anchor e32a414: complete succeeded with no recorded verdict; a verdict recorded in a detached worktree at the candidate was not recognized from another checkout after a no-ff merge; gate did not exist so the closeout recipe proceeded for an incomplete Spec candidate. Green: assembleSpecReport gains specDigest (SHA-256 over SPEC.md minus evidence data rows plus every Task record minus its Receipt section and the Updated, Latest event and Next gate header lines); the verdict Event cell is Review verdict: result at sha [digest12] #n with the ordinal keeping same-day rows distinct and a byte-identical repeat refused; a candidate absent from the repository is refused; the exact-HEAD check is gone and a verdict recorded in a detached worktree is recognized from any checkout whose Spec content matches; complete refuses with distinct messages when no verdict exists, when every verdict is for earlier content or when the latest current verdict is fail, and proceeds unchanged with a passed current verdict; a gate verb reports a Task PR (a real Task record under a still-open Spec, per the S-00O exemption 2 constant) and refuses a Spec candidate that is incomplete, unreviewed or whose candidate does not exist; the RUNBOOK closeout recipe requires SPEC_ID, takes TASK_ID for a Task PR and runs the gate before the merge fetch, with tools/test-branch-closeout.mjs executing the real tools in its fixture and proving a Spec candidate stops the recipe while a Task PR proceeds; the integration branch is resolved from the manifest. The branch carries a keep-both merge of S-00I TK-003 with no hunk dropped. Full 44-command suite on the committed tips 302034f and 5624ada, reproduced by the reviewer on clean worktrees; next, doctor and render byte-identical to integration dc667ae's tools; no room Spec gained a row. Separate-context review (Claude Opus 5): 302034f PASS with three Mediums (an unchecked Task-PR path with a misdescribed exemption source; Receipt rows and volatile headers inside the digest; same-day row identity collisions) and Lows, corrected in 5624ada and re-reviewed PASS with twelve mutations red and the two-worktree recognition and stale-digest cases reproduced live. Built by Claude Sonnet 5 from the lane handoff; the builder was rate-limited before reporting and the dispatcher pushed its committed tip. Landed by PR #128 through the new recipe with the gate reporting the Task PR; integration 1d521a0 contains 5624ada | RUNBOOK.md Version-Control Procedures carries the new closeout recipe and its lead-in from the lane; its Spec Lifecycle And Retrieval block gains the gate line in this state PR; the verdict and report prose there still describes the row without the digest and ordinal and is S-00P phase two; this Spec's second acceptance line is reworded in this state PR to the content-digest binding the design settled on | The Task-PR gate branch reports specComplete from the report's gaps while refusing on the header status (one notion of complete is owed). A verdict row without the #n ordinal is skipped by VERDICT_PATTERN and a fresh ordinal would restart beside it; no such row exists in any room Spec, so no migration was written. The fourth acceptance line's owner-approval half is TK-005. The workable window for a Spec-level verdict is after the final close and before complete, because close rewrites a Task's Proof; RUNBOOK ordering prose is S-00P phase two. Who runs close, and whose Git facts the Receipt records, remains open |
| 2026-09-18 | TK-005 | Task closed | Red at the pre anchor b293ee9: tools/test-spec-report.mjs fails on the missing recordOwnerApproval export and, with a stub, complete still succeeds with a passed verdict and no approval, an approval naming a SHA not contained in the declared integration branch is accepted, and a finding with neither a corrective item nor a destination change is accepted. Green: recordOwnerApproval(rootDir, specId, { candidate, owner, result, findings, destinationChange }) and the approve verb append one owner-qa evidence row (Owner QA: approve or finding at sha [digest12] #n, findings or Return to Align, owner, remaining gap) through appendEvidence after checking the candidate exists and is contained in the declared integration branch resolved through workbench-paths.mjs (skipped and recorded as unchecked when no branch is declared), the digest matches the current content, the owner is non-empty and the result is approve or finding, refusing an exact repeat by naming the existing row; a finding with items creates corrective Tasks through createCorrectiveTasks anchored to the owner-qa row, a finding with a destination change records Return to Align and creates nothing, and a finding with neither is refused; complete requires the latest owner QA for the current content to be an approval, checked after the review-verdict gate with three distinct messages; report gains ownerApproval and latestOwnerApproval and prints an Owner QA line; gate refuses a Spec candidate lacking a current approval; the branch carries a keep-both merge of S-00I TK-004 with every verb kept. Full 44-command suite on the committed tips bd91e29 and 1e36e32, reproduced by the reviewer on clean worktrees; doctor byte-identical to integration; no room Spec gained a row. Separate-context review (Claude Opus 5): bd91e29 PASS with two Mediums (owner and result validation untested; owner-qa rows without an ordinal colliding under check-append-only and an identical repeat recorded twice) and Lows, corrected in 1e36e32 and re-reviewed PASS with the three demos, four complete cases and four mutations behaving. Built by Claude Sonnet 5 from the lane handoff. Landed by PR #132 through the gated recipe; integration 58fb86c contains 1e36e32 | RUNBOOK.md Spec Lifecycle And Retrieval gains the approve line and a sentence on the owner QA row in this state PR; the closeout recipe and the gate lines already describe the Spec-candidate refusal; the review and delivery skills' reviewed-unit language is TK-006; operational prose for the full WF-8E order is S-00P phase two | An approval recorded in a room with no declared integration branch is unchecked for containment and says so in its row. The approval ordinal is separate from the corrective-Task row anchor by design. The first real retirement (S-00I TK-005) began before this gate landed and its lane must adopt the approval requirement at merge. The verdict, report and approve prose in RUNBOOK still lack the digest and ordinal (S-00P phase two) |
| 2026-09-18 | TK-006 | Task closed | Red at the pre anchor 5efea75: a new catalog assertion in tools/test-skill-catalog.mjs failed because code-review's reviewed-unit sentence still said Task/integration review of the immutable candidate, and at 451fd79 further assertions failed because the four skills named the room-specific S-00O id, implement had dropped the separate-context qualifier at the integration branch, and the gate citation was not runnable. Green: skills/code-review, reviewer, carry and implement name the assembled Spec as the reviewed unit at integration (obtained with report S-### --candidate sha, bound to its content digest, recorded with verdict, in a separate context) while a Task PR under the room's Task-PR exemption (exemption 2 of its release Spec, stated generically) is still reviewed as an immutable candidate diff against exact BASE_SHA and HEAD_SHA and reported by gate --task TK-### --spec S-###; wording and reviewed unit only, with no procedure step, ordering or instruction changed and frontmatter untouched; make-it-so inspected and left unchanged; a catalog assertion holds the four sentences, the retained tokens, implement's separate-context qualifier and the absence of S-00O from all twenty-one core skills. Full 44-command suite on the committed tips 451fd79 and 85157e2, reproduced by the reviewer on clean worktrees; evaluate-workbench --path templates --include-controls 106.6/113 unchanged; doctor byte-identical to the base. Separate-context review (Claude Opus 5): 451fd79 PASS with two prose Mediums (a room-specific id in the bundled core; a dropped separate-context qualifier) and a Low, corrected in 85157e2 and re-reviewed PASS with each fix held by an assertion proven red. Built by Claude Sonnet 5 from the lane handoff. Landed by PR #136 through the gated recipe; integration 31c8c0e contains 85157e2 | The four skills carry the reviewed-unit language from the lane; the installed copies in the owner's home skill roots are stale and doctor does not flag it, so the owner hand-copy is owed; AGENTS.md Branch Completion and RUNBOOK.md's review prose are S-00P phase two | Once the Task-PR exemption ends no skill states an immutable-diff review at integration (S-00P phase two). The installed copies of code-review, reviewer, carry and implement in the home skill roots lack the new wording until the owner hand-copies them. This Spec's third acceptance line still needs the retired-folder case, assigned to the S-00I TK-006 lane, and its eighth line the completion suite; completion then needs a separate-context verdict on this Spec's own content digest and the owner's approval naming the integration SHA |

| 2026-09-19 | assembled verification | Full source proof and independent review passed at `58a1b3b2caaaa0ece5414d4c027d97c388ab1b1c` | All 51 commands passed in a detached clean tree; before/after HEAD and status identical; separate-context reviewer reran retired-corrective and unfinished-discard probes | Shared S-00U VERIFICATION.md plus owning documentation | Final metadata review and integration delivery pending; owner Human QA, retirement, release and native/external proof are not supplied |
| 2026-09-19 | review | Review verdict: pass at 75a565aa40d62f93903a396079bb2051bc1692ad [06abcbb7e739] #1 | none; source and proof-state delivery reviewed, owner QA and disclosed native/external/recovery limits remain separate | independent_review; separate Codex context; inherited model not separately identified; code-review mode | 2 |
| 2026-09-19 | review | Review verdict: pass at 0c34d05c479f4a434f6b102954f9fd2768549baf [06abcbb7e739] #2 | none | independent_review; separate Codex context; inherited model not separately identified; code-review mode; corrects prior receipt count: zero review findings | none |

| 2026-09-23 | owner correction | Human QA has been underway since 2026-09-19; the owner reports failed reviews, not a review waiting to start | Direct owner clarification on 2026-09-23; 2026-09-19 S-00I/S-00J approval audit records a failed readiness verdict on its pinned candidates; earlier 51-check and independent source PASS rows prove a different gate | Corrected current header and Taskboard projection; retained earlier evidence unchanged | No owner approval recorded; exact current findings still need per-Spec reconciliation and corrective proof |

| 2026-09-26 | 89d4042fb8931b9d720af75bffea1c28803d72aa | Dispatcher reconciled original delivery and authored Worker-drafted corrective packets under the Director assignment; no runtime implementation | At this base, test-spec-report and test-branch-closeout exit 0, including F1/F2/F3/F6; doctor reports seven attention findings and no blockers; git merge-base confirms original source 58a1b3b and reviewed proof-state 0c34d05 are contained | Added explicit durable-decision QA and main-verified closure criteria; preserved completed Tasks and prior evidence; packets remain deferred pending coordinated interfaces and write lanes | Self-drift pre cleanUpdate false from stale S-00Q; six historical identity limitations; guardrail 78/100 with repeated real outcome proof missing. No new implementation red/green, full corrective suite, Director review, owner approval or main promotion claimed |
| 2026-09-26 | TK-01T | Lane H planning: closure-capture transition contract derived from WF-8E, WF-8H, WF-8F, FND-Q07 and SCR grilling decisions 009/011/012; Codex packets renumbered TK-00G to TK-01R and TK-00H to TK-01S after S-00V took TK-00G..TK-01P in PR #160 and S-01U took TK-01Q in PR #161; TK-01R released with a disposed Task-body Decisions interface; TK-01S proof representation disposed; TK-01T added for the finding-4 deadlock | Read the ledger rows and the SCR grilling note; next-id allocated TK-01R, TK-01S, TK-01T in order on integration 9022183; render and doctor in the assembled tree | Planning only; no runtime change, no owner approval, no closure |
| 2026-09-26 | review | Review verdict: pass at 60849d27e24d8413ffa7d8e986654fe1d9dbf6c0 [83af78a7d077] #3 | none; renumbering-only delta from PASSed dcda8a1 verified by diff comparison, IDs unique, closure-capture contract gates complete on main verification not on features capture; full suite 48/48 on 60849d2, fresh-clone doctor clean on the pre-renumber tree | Codex CLI codex exec -s read-only -m gpt-5.5, separate context | 3 |

## Completion Result

Committed-content approval binding, merge/QA ordering, stable administrative digest and active/retired/discarded corrective routes are implemented and fixture-verified. Source `58a1b3b2caaaa0ece5414d4c027d97c388ab1b1c` passed the full 51-command suite and separate-context source review. Shared [verification](../S-00U-approval-binding-and-lifecycle-digest/VERIFICATION.md) records commands, red/green cases and limits. That source and reviewed proof-state `0c34d05c479f4a434f6b102954f9fd2768549baf` are ancestors of integration `89d4042fb8931b9d720af75bffea1c28803d72aa`; their integration delivery is complete. The new corrective packets remain undelivered, and **whole-Spec closure is not approved**. Owner approval remains outstanding after ongoing Human QA. No real record was retired/discarded and no main promotion or native-host proof is inferred.

## Remaining Limitations Or Follow-Up Specs

Reconciliation and retirement after closure are S-00I. Control and template
prose is S-00P phase two. GitHub-level enforcement, if the owner wants it,
needs a later linked Spec with its own authorization.

## Supersession

None.
