# S-054 - Workbench v3.2.1 Review-Boundary Integrity

**Spec ID:** S-054
**Status:** superseded
**Priority:** 1
**Owner:** codex
**Stance:** Builder
**Updated:** 2026-10-04
**Catalog description:** Historical v3.2.1 docket entry for binding an integration review to the exact resulting candidate; its undelivered target-binding requirements now live in the Spec QA Gate at Integration.
**Blockers:** none
**Latest event:** Superseded on 2026-10-04: v3.2.1 will never be released, the docket was never activated, and the review-boundary requirements still undelivered on integration were carried into the [Spec QA Gate at Integration — S-00J](../S-00J-spec-qa-gate-at-integration/SPEC.md).
**Next gate:** None; superseded by the [Spec QA Gate at Integration — S-00J](../S-00J-spec-qa-gate-at-integration/SPEC.md), which owns the carried requirement.

> **Citation anchors.** pre=`340e80a1b4f1af92afbbe3a974e7de3d4cb679b7` post=`340e80a1b4f1af92afbbe3a974e7de3d4cb679b7`. The evidence log below names this commit only by its 7-character abbreviation (`340e80a`); the full 40-character hash previously recorded here (`340e80a4b9cf6e07ca30f3a5f406b93998d48ed2`) shared that prefix but is not an object reachable from this repository. This is the actual commit ("Record v3.2.0 upstream integration") matching the abbreviation and the S-050 TK-004 context the evidence log describes.

## Why Retired

Retired 2026-10-04. This record was a planned v3.2.1 docket entry that only
the owner's explicit v3.2.1 activation could start. That activation will never
come: v3.2.1 was stamped on `integration` but never released, `main` still
carries v3.2.0, and every later commit on `integration` is v4 work. When an
agent listed the v3.2.1 docket for activation on 2026-10-04, the owner
answered: "we are working on version 4 right now... so this seems a bit late
to tell me", and asked whether his 350-plus answers on the v4 direction had
not already answered the v3.2 questions. They had: the v4 Spec QA gate
(locked WF-8/WF-8B/WF-8C answers, ADR-000F) already redesigned the reviewed
unit and the integration boundary this docket was patching. The owner's
lifecycle rule applies: "We retire things all of the time. why would a spec
be any different than a task?" (2026-10-04), and obsolete release promises
become historical or superseded while still-needed obligations remain
reachable (grilling ledger FND-Q16, locked 2026-09-30).

The still-needed obligation is not dropped. Each Desired Behavior item was
checked against `integration` at `46ad978956a74a3ee1bda22c36eb16207dcd98fd`
(the `gate` and `verdict` commands in `workbench/tools/spec-workbench.mjs`
and `workbench/tools/spec-report.mjs`, the RUNBOOK closeout recipe and
`tools/test-branch-closeout.mjs`, and the `implement` and `code-review`
skills):

| Desired Behavior item | Reading at integration | Disposition |
|---|---|---|
| 1. Review receipt names reviewed content, integration branch and exact integration tip | Partly delivered. A `verdict` binds the candidate SHA and the assembled Spec's committed content digest, and `gate` reports the declared integration branch. No verdict or receipt records the integration tip the result was derived from. | Integration-tip binding carried to S-00J |
| 2. Merge accepts only the reviewed result against the expected target tip and fails closed if source or target moved | Source half delivered: the closeout recipe checks `HEAD` equals the reviewed SHA, runs `gate`, and merges with `gh pr merge --match-head-commit`. Target half not delivered: nothing refuses the merge when `integration` moved after review. | Target-tip refusal carried to S-00J |
| 3. A changed result is re-verified and freshly reviewed; an unchanged one needs no ceremony | Policy delivered: `AGENTS.md`, the `code-review` skill ("If the target changes, compare and review the resulting candidate") and the `director` skill (a rebased or re-merged tip is a new candidate). Not enforced: no tool compares the resulting merge content to the reviewed content. | Result comparison carried to S-00J |
| 4. Root and generic closeout procedures, delivery/review skills and the disposable demonstration express the same boundary | Not delivered. The `code-review` skill names the expected integration tip; the RUNBOOK closeout recipe and `tools/test-branch-closeout.mjs` (six cases) do not exercise target movement. | Procedure and demonstration agreement carried to S-00J |
| 5. Evidence distinguishes review PASS, integration update and remote containment | Delivered. Verdict rows, the recipe's separate merge and `git merge-base --is-ancestor` containment check, owner-QA rows and `complete`'s main-containment check are separate facts. | None needed |

S-00J's "Integration target binding carried from S-054" section now holds
items 1 to 4 as one requirement with its own acceptance line. TK-001 below is
closed as withdrawn, not achieved: the Task status set has no withdrawn value
and `doctor` refuses a superseded Spec with an unfinished row, so its row reads
`done` with a proof cell that says it never ran. No implementation is claimed.

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
| TK-001 | Bind review, target and merge result in one tested integration-closeout path | done | none | Withdrawn unexecuted on supersession 2026-10-04: no implementation or proof is claimed; the undelivered target-binding requirement moved to S-00J (Integration target binding carried from S-054) |

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
| 2026-10-04 | spec | Superseded; undelivered review-boundary items carried into S-00J | Each Desired Behavior item read against integration 46ad978: item 5 delivered, items 1 to 4 partly or not delivered (no integration-tip binding, no target-movement refusal, no result comparison, closeout test has no target-movement case) | Why Retired with the item-by-item table; S-00J gains its carried requirement and acceptance line; header, TK-001 row and Supersession reconciled | None for this record; the carried requirement is open in S-00J |

## Completion Result

Superseded 2026-10-04 without implementation (see Why Retired); the
undelivered target-binding requirement is open in S-00J. Original text:
Pending. This specification is a planned docket entry only. It authorizes no
v3.2.1 implementation, release stamp, PR merge, publication, or rollout.

## Remaining Limitations Or Follow-Up Specs

Until TK-001 is completed, a review PASS and post-merge containment remain
separate facts, but the existing closeout path has no demonstrated protection
against a changed integration target during review. That limitation still
holds on integration; it is now S-00J's carried requirement, not an activation
of this retired docket.

## Supersession

- Supersedes: none.
- Superseded by: S-00J ([Spec QA Gate at Integration](../S-00J-spec-qa-gate-at-integration/SPEC.md)), 2026-10-04, which carries items 1 to 4. See Why Retired.
