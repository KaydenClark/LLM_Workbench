# S-00J - Spec QA Gate And Corrective-Task Return Path

**Spec ID:** S-00J
**Status:** active
**Priority:** 3
**Owner:** DISPATCHER
**Stance:** Builder
**Updated:** 2026-09-18
**Catalog description:** Make a separate context review the assembled Spec against its Task results, route a failed review into corrective Tasks under the still-open Spec, keep `integration` as the owner's Human QA surface, and refuse to close a Spec without a passed review and recorded owner approval.
**Blockers:** none; S-00H is `complete` (integration `49c671e`).
**Latest event:** TK-001 claimed by DISPATCHER.
**Next gate:** Close TK-001 with verification and documentation proof.

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
closes only after that review passed and the owner's approval on `integration`
is recorded; no Git merge closes it. All of this is a local tool and process
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
naming the `integration` SHA inspected. A failed Human QA finding against an
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
  [ADR-000F](../../docs/adr/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md),
  which is `proposed` and is evidence, not instruction. Its open "failure
  return path" is now WF-8C, and S-00P TK-004 accepts, amends or supersedes
  the record to match. ADR acceptance is not a blocker of this Spec.
- Independent review at integration, which this extends rather than replaces:
  [ADR-0037](../../docs/adr/0037-independent-review-at-integration.md). The
  reviewed unit becomes the assembled Spec; the immutable-candidate
  requirement is unchanged.
- The gate reads Task records, so it depends on
  [S-00H](../S-00H-task-artifact-and-terminology-migration/SPEC.md).
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

Blocked on S-00H reaching `complete`, because the assembled-Spec report and
corrective Tasks read and create Task records; `claim`'s blocker model
resolves whole completed Spec IDs, so the dependency is expressed at Spec
granularity and the owner's two-lane limit is respected. The former blocker
"WF-8 is an open owner question" is stale: WF-8, WF-8B, WF-8C and WF-8E are
locked.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Report the assembled Spec state for a reviewer at a stable seam | in-progress | S-00H | Red: for a fixture Spec with one unfinished Task the report must say incomplete and list the gap, and no seam exists to call; green: report of Tasks with proof, acceptance lines, evidence and gaps bound to a candidate SHA, full suite |
| TK-002 | Record a separate-context review verdict against the immutable candidate | blocked | TK-001 | Red: recording a verdict for a SHA that is not the current candidate is refused, and a verdict appended to a Spec is preserved append-only; green: pass or fail verdict with findings, reviewer context and SHA in the Spec's evidence |
| TK-003 | Turn a failed verdict into corrective Tasks under the still-open Spec | blocked | TK-002 | Red: a failed verdict that leaves the Spec with no corrective Task is refused; green: one Task record per diagnosed defect created through the Task seam, Spec stays open, `render` shows them, done Tasks not reopened, with the retired-folder case proven once S-00I TK-005 exists |
| TK-004 | Bind the gate into `complete` and the merge-preparation workflow | blocked | TK-003 | Red: `complete` succeeds with no passed verdict on the current candidate, and the branch-closeout path proceeds for an incomplete Spec candidate; green: both refuse, a branch presented for a Task ID with its Spec open is reported not refused while S-00O exemption 2 is active, integration branch resolved from the manifest |
| TK-005 | Require recorded owner Human QA approval before closure | blocked | TK-004 | Red: `complete` succeeds with a passed review but no owner approval; green: `complete` requires an approval record naming the `integration` SHA inspected, and a recorded finding routes to corrective Tasks or Align |
| TK-006 | Correct reviewed-unit language in the review and delivery skills | blocked | TK-004 | Red: `skills/code-review`, `skills/reviewer`, `skills/carry` and the branch-completion skills still describe the reviewed candidate as task-level; green: they name the assembled Spec, skill catalog and inspection tests pass |

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

- [ ] A reviewer can obtain the assembled state of a Spec bound to a
      candidate SHA, proven by a test that failed before the change.
- [ ] A review verdict is recorded append-only against the exact candidate
      and refused for any other SHA.
- [ ] A failed verdict produces corrective Task records under the still-open
      Spec, visible on the board, without reopening done Tasks (the
      retired-folder case once S-00I TK-005 exists).
- [ ] `complete` refuses without a passed verdict on the current candidate
      and a recorded owner approval naming the `integration` SHA.
- [ ] The harness's merge-preparation workflow refuses an incomplete or
      unreviewed Spec candidate, passes a complete reviewed one unchanged,
      and, while S-00O exemption 2 is active, reports rather than refuses a
      branch presented for a Task ID with its Spec still open. This does not
      claim GitHub itself refuses anything.
- [ ] The integration branch is resolved from the manifest declaration.
- [ ] Review and delivery skills name the assembled Spec as the reviewed
      unit; the independent review requirement is unchanged.
- [ ] The full verification suite passes and `doctor` is clean.

## Testing Seams

The assembled-Spec report function; the verdict append path in the Spec's
evidence; the Task creation seam from S-00H; `spec-workbench.mjs complete`;
the branch-closeout path covered by `tools/test-branch-closeout.mjs`; the
manifest branch declaration; and the skill catalog and inspection tests.

## Verification Procedure

Run the targeted test for the touched seam, then the full verification suite
named in `AGENTS.md`, then
`node workbench/tools/spec-workbench.mjs doctor`. Each Task lands as its own
reviewed PR into `integration` under S-00O exemption 2.

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

## Completion Result

Not started.

## Remaining Limitations Or Follow-Up Specs

Reconciliation and retirement after closure are S-00I. Control and template
prose is S-00P phase two. GitHub-level enforcement, if the owner wants it,
needs a later linked Spec with its own authorization.

## Supersession

None.
