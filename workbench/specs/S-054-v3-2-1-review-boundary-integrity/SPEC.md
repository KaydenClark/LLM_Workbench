# S-054 - Workbench v3.2.1 Review-Boundary Integrity

**Spec ID:** S-054
**Status:** planned
**Priority:** 1
**Owner:** codex
**Stance:** Builder
**Updated:** 2026-09-08
**Catalog description:** Make an integration review bind to the exact resulting candidate and refuse target movement before merge.
**Blockers:** explicit v3.2.1 docket activation by the owner; specification is
complete, implementation is not authorized by this record alone
**Latest event:** v3.2.1 docket created from the v3.2.0 review-boundary handoff; no implementation started.
**Next gate:** Owner explicitly activates the v3.2.1 docket after the separate v3.2.0 release work is ready to start it.

> **Citation anchors.** pre=`340e80a1b4f1af92afbbe3a974e7de3d4cb679b7` post=`340e80a1b4f1af92afbbe3a974e7de3d4cb679b7`. The evidence log below names this commit only by its 7-character abbreviation (`340e80a`); the full 40-character hash previously recorded here (`340e80a4b9cf6e07ca30f3a5f406b93998d48ed2`) shared that prefix but is not an object reachable from this repository. This is the actual commit ("Record v3.2.0 upstream integration") matching the abbreviation and the S-050 TK-004 context the evidence log describes.

## Outcome

v3.2.1 makes the independent integration review bind to the exact candidate
that would reach the declared integration branch. If that branch moves or the
merge result differs after review, the merge is refused and the changed result
is retested and independently reviewed before it can advance integration.

## Why It Matters

The v3.2.0 handoff recorded that PR #80 merged before the independent review
rejected candidate `563a6e6`; PR #81 repaired that particular incident. The
present closeout recipe pins only the reviewed task head and asks GitHub to
match that head. It does not bind the review to the integration tip or the
resulting merge object. A review of one object cannot establish the safety of a
different result.

## Current Verified State

At the pre anchor, `AGENTS.md` and ADR-0037 require separate-context review
before branches combine at integration. ADR-0037 also says target movement
requires comparison of the resulting candidate and fresh review when it
changes. `skills/implement/SKILL.md` and `skills/code-review/SKILL.md` pin the
candidate head, but not a target parent or merge result. The documented
RUNBOOK closeout block and `tools/test-branch-closeout.mjs` protect a changed
task head and post-merge containment; they do not demonstrate refusal when the
integration target changes between review and merge.

S-050's append-only v3.2.0 evidence is the incident record and remains
historical evidence. This new spec is the v3.2.1 owner; it does not reopen
S-050, change its receipts, or claim that v3.2.0 is released.

## Desired Behavior

1. A review receipt identifies the immutable reviewed content, the declared
   integration branch, and the exact integration tip from which the reviewed
   result was derived.
2. The merge path accepts only that reviewed result against that expected target
   tip. It must fail closed before advancing integration when either the source
   candidate or target tip has moved.
3. When target movement produces a different result, the workflow materializes
   the new candidate, reruns affected verification, and obtains a fresh
   separate-context review. An unchanged result needs no invented ceremony.
4. The documented root and generic closeout procedures, delivery/review skills,
   and disposable branch-closeout demonstration express the same boundary.
5. Evidence distinguishes a review PASS, a successful integration update, and
   remote containment. None substitutes for another.

## Decisions And Contracts

- The existing independent-review boundary remains the controlling policy;
  this is an enforcement and evidence-boundary repair, not a new approval gate
  for every ticket.
- The eligible reviewed unit is the resulting integration candidate, including
  its expected integration parent, rather than only the feature-branch head.
- A target change is a changed candidate only when it changes the resulting
  reviewed content. The implementation must prove that comparison rather than
  infer it from branch names or timing.
- The repair must reject before integration advances, using a tested
  compare-and-update or equivalent provider-supported operation. A post-merge
  containment check alone is insufficient.
- The exact implementation mechanism is deliberately constrained but not
  preselected: it may use a materialized candidate and guarded update, or an
  equivalent provider operation, only if its public seam proves the same
  source-and-target binding without bypassing branch protection.

## Non-Goals

- Starting, stamping, publishing, or merging the v3.2.1 release.
- Rewriting v3.2.0 history, reopening PR #80/#81, or changing S-050 status.
- Requiring independent review for intermediate tickets or unchanged results.
- Adding a coordination service, merge queue, paid integration, credential, or
  provider-native dependency as a prerequisite.
- Claiming that local fixture coverage proves a remote provider configuration.

## Dependencies And Blockers

This docket is intentionally planned. It becomes eligible only when its owner
explicitly activates v3.2.1; no release dependency is silently selected from
this spec. The implementation must inspect the current GitHub/branch-protection
capabilities before selecting any provider-specific operation. If those
capabilities cannot provide the required compare-and-update boundary, the
spec's existing Git-compatible candidate path remains the required fallback.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Bind review, target and merge result in one tested integration-closeout path | deferred | explicit v3.2.1 activation | Red regression for target movement; green guarded refusal and unchanged-result path; full suite; separate-context review; remote containment evidence if an integration candidate is authorized |

### TK-001 - Bind review, target and merge result in one tested integration-closeout path

**Stance:** Builder

Trace the current closeout recipe, `tools/test-branch-closeout.mjs`, the review
and delivery skills, ADR-0037, and the generic Runbook counterpart. First add a
disposable regression that moves `integration` after a review tuple is pinned;
the old recipe must show why it cannot establish the result. Then implement the
smallest guarded candidate/update path that refuses the moved target before an
integration update, proves the unchanged path, and makes a changed result
require new verification and independent review. Keep branch cleanup after
successful containment and preserve a failed candidate for recovery.

## Acceptance Criteria

- [ ] Review evidence records an immutable resulting candidate and expected
      integration parent, not only a task-branch head.
- [ ] A deterministic disposable-Git test demonstrates that target movement
      after review cannot advance integration using the prior PASS.
- [ ] The unchanged candidate/target path remains able to integrate, then
      proves remote containment before any cleanup.
- [ ] A changed resulting candidate requires affected verification and a fresh
      separate-context review, while a proven unchanged result does not.
- [ ] Root and generic procedures plus the relevant delivery/review skills
      agree with ADR-0037's review boundary.
- [ ] The full required verification suite passes, and an independent review
      checks the exact candidate before any authorized integration.

## Testing Seams

- `tools/test-branch-closeout.mjs`: disposable source branch, integration
  branch, review tuple, target movement, guarded update, containment, and
  cleanup preservation.
- The documented closeout recipe: its inputs and exit status make the expected
  source and target identities observable without contacting a live repository.
- The review receipt/spec evidence: candidate SHA, target SHA, resulting SHA,
  verification, reviewer verdict, and containment remain separately readable.

## Verification Procedure

Use red/green on the target-movement regression and the unchanged-result path,
then run `node tools/test-branch-closeout.mjs`, the full suite named in
`AGENTS.md`, `node workbench/tools/spec-workbench.mjs render`, and doctor.
Before any integration, a separate context reviews the exact resulting
candidate. Verify remote containment after the authorized update; do not treat
fixture coverage, self-review, or a local ref as delivery proof.

## Documentation Impact

AGENTS Git Rules, ADR-0037 rationale, RUNBOOK and `templates/RUNBOOK.md`
closeout procedures, `skills/implement/SKILL.md`,
`skills/code-review/SKILL.md`, the branch-closeout test, and this spec. Update
only the owners whose rule or executable example changes; the v3.2.0 evidence
row remains append-only historical evidence.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-08 | spec | Added the review-boundary repair to the planned v3.2.1 docket from the v3.2.0 handoff | Read ADR-0037, S-050 TK-004 evidence, the live closeout recipe, its disposable test, and review/delivery skills at `340e80a`; `doctor` has no blocking finding | This new stable owner records scope, proof and non-goals; no implementation or release state changed | Explicit v3.2.1 activation, red/green repair, full verification, exact-candidate independent review and any separately authorized integration remain pending; no coordination hand-backs occurred |
| 2026-09-12 | f2d2e87 | Review found the header `Blockers: none` contradicted both Next gate and TK-001's own `deferred`/`explicit v3.2.1 activation` blocker | Re-read this Spec's own Next gate and TK-001 fields against the header | Corrected `Blockers` to name the activation gate, matching S-00K's pattern; no implementation performed |

## Completion Result

Pending. This specification is a planned docket entry only. It authorizes no
v3.2.1 implementation, release stamp, PR merge, publication, or rollout.

## Remaining Limitations Or Follow-Up Specs

Until TK-001 is completed, a review PASS and post-merge containment remain
separate facts, but the existing closeout path has no demonstrated protection
against a changed integration target during review. The next executable action
is explicit activation of this planned docket.

## Supersession

- Supersedes: none.
- Superseded by: none.
