# S-015 - Main-Into-Integration Reconciliation

> Generated from LLM Workbench v2.3. Stable path
> `specs/S-015-main-integration-reconciliation/SPEC.md`; never move between status folders.

**Spec ID:** S-015
**Status:** planned
**Priority:** 0
**Owner:** unassigned
**Updated:** 2026-07-20
**Catalog description:** Reconcile the current `main` head into `integration` through one audited merge PR so a release candidate can be audited, unblocking S-014/TK-002.
**Blockers:** Proposal awaiting owner authorization; `origin/main` is not an ancestor of `origin/integration` and the current integration head is unaudited.
**Latest event:** S-014/TK-002 reconciliation surfaced an un-ticketed ancestry-drift gap with no owning spec; proposed here as a follow-on so S-014 stops re-planning the reconciliation inside its release-candidate ticket.
**Next gate:** Owner authorizes activating this spec and assigns a durable writer to claim TK-001.

## Outcome

The exact current `origin/main` commit is an ancestor of the exact current
`origin/integration` commit, achieved through one normal audited merge pull
request into `integration` with history preserved, so that S-014 can run its
exact-head audit and release-gate publication against a reconciled integration
head. No protected branch is rebased, force-pushed, or written directly, and no
`integration` to `main` promotion is performed here.

## Why It Matters

S-014/TK-002 is blocked because `git merge-base --is-ancestor origin/main
origin/integration` fails after later `main` and `integration` movement
invalidated the historical candidate, and no ticket owns the reconciliation.
S-014's release-candidate capability should own audit and publication, not keep
re-scoping a fresh main-ancestry merge each time the branches drift. Extracting
the reconciliation into its own linked spec gives the recurring, independently
auditable "make main an ancestor again" step a durable home and a clean
dependency edge into S-014.

## Current Verified State

- Per S-014's 2026-07-19 evidence, `origin/integration` was exact commit
  `259a24d257854ae5f28af1f34983a46092fef208` and `origin/main` was exact commit
  `08ab78e5a59a68d2b04028fe71a2be488d5ae10e`, with
  `git merge-base --is-ancestor origin/main origin/integration` exiting non-zero.
- The exact SHAs above are recorded as historical evidence and must be
  re-verified live at claim time; branches may have moved again since.
- No `integration` to `main` promotion PR exists and the current integration
  head carries no `gptos/workbench-release-gate` status, so CIC remains
  fail-closed. That downstream state is owned by S-014, not this spec.
- This spec is a proposal: no branch, merge, PR, or status has been created for
  it, and no reconciliation work has been performed.

## Desired Behavior

- Start a short-lived branch from the exact live `origin/integration` SHA and
  merge the exact live `origin/main` SHA into it with a real merge commit that
  preserves the integration-side tree and records main as the second parent.
- Resolve only evidence-backed conflicts; never rebase, force-push, write a
  protected branch directly, or rewrite either branch's history.
- Run the complete RUNBOOK verification suite, `render`, `doctor`, and
  `git diff --check` on the reconciliation head, then obtain an independent
  exact-diff audit before the below-integration PR is merged.
- After merge and fetch, `main` is byte-for-byte unchanged, `integration` is
  clean and exact, `main` is an ancestor of `integration`, and the full suite
  passes on the resulting exact integration head.
- Hand the resulting exact integration SHA to S-014/TK-002 for its separate
  exact-head Auditor and Publisher tasks.

## Decisions And Contracts

- This spec owns only the main-ancestry reconciliation. It does not audit the
  release candidate, publish any `gptos/workbench-release-gate` status, or open
  an `integration` to `main` promotion PR; those remain S-014's tickets.
- The reconciliation is complete only when
  `git merge-base --is-ancestor origin/main origin/integration` succeeds after
  the audited PR lands and the full suite is green on the resulting exact head.
- Exact SHAs are resolved live at claim time from `origin/main` and
  `origin/integration`; recorded SHAs are evidence, never a substitute for a
  fresh `git rev-parse` and ancestry check.
- Any later `main` or `integration` movement invalidates a landed
  reconciliation naturally and requires a new exact-SHA merge under this spec.
- One durable writer owns the reconciliation branch and the S-015 evidence log
  at a time; independent audit is a separate read-only role.

## Non-Goals

- Auditing the resulting integration SHA or publishing release-gate evidence
  (S-014/TK-002).
- Opening, merging, or approving any `integration` to `main` promotion PR
  (S-014/TK-003 and Kayden's CIC gate).
- Rebasing, force-pushing, or rewriting `main` or `integration` history, or
  changing branch protections or merge settings.
- Finishing S-011, authenticating Claude, or promoting isolated pending skills.

## Dependencies And Blockers

- Downstream consumer: S-014/TK-002 exact-head audit and TK-003 promotion PR.
- Requires GitHub authentication with the existing minimum permission for a
  below-integration merge PR; credential changes remain owner-controlled.
- Blocked as a proposal until the owner authorizes activation.

## Vertical Implementation Slices

Tickets are temporary tracer bullets within this stable capability record.

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Merge the exact live `main` head into a branch off exact live `integration`, verify, audit, and land it so main becomes an ancestor of integration | ready | none | pending |

### Scoped Ticket: TK-001

**Vertical slice:** From a fresh branch at the exact live `origin/integration`
SHA, merge the exact live `origin/main` SHA with a normal merge commit, resolve
only evidence-backed conflicts, run the complete suite, open a below-integration
PR, obtain an independent exact-diff audit, and merge only after it passes.

**Done criteria:**

- The branch began at the exact live remote integration SHA and merged the exact
  live remote main SHA with a real merge commit; neither shared branch was
  rebased, force-pushed, or written directly.
- The full RUNBOOK verification suite, `render`, `doctor`, and `git diff --check`
  pass on the reconciliation head.
- An independent Auditor reviews the immutable reconciliation diff and records
  no unresolved finding before the PR is merged to `integration`.
- After merge and fetch, remote `main` is byte-for-byte unchanged, remote
  `integration` is clean and exact, `main` is an ancestor of `integration`, and
  the full suite passes on that exact integration head, which is handed to
  S-014/TK-002.

**Verification:** Full RUNBOOK suite, then:

```bash
git rev-parse origin/main origin/integration
git merge-base --is-ancestor origin/main origin/integration
node tools/spec-workbench.mjs render
node tools/spec-workbench.mjs doctor
git diff --check
```

## Acceptance Criteria

- [ ] The exact live `origin/main` becomes an ancestor of `origin/integration`
      through one audited merge PR without history rewriting or direct
      protected-branch writes.
- [ ] The complete Workbench suite passes on the reconciliation head and on the
      resulting exact remote integration head.
- [ ] An independent Auditor records no unresolved finding on the immutable
      reconciliation diff before merge.
- [ ] Remote `main` is byte-for-byte unchanged and no `integration` to `main`
      promotion PR or release-gate status is created by this spec.
- [ ] The resulting exact integration SHA is handed to S-014/TK-002 for its
      separate exact-head audit.

## Testing Seams

- Git ancestry: literal `merge-base --is-ancestor` before and after the merge.
- Harness health: every command in RUNBOOK Full verification at the
  reconciliation head and the resulting exact integration head.
- Independent audit: fresh worktree identity, clean state, and fixed diff owned
  by one read-only Auditor with no external writes.

## Verification Procedure

Run the full suite from `RUNBOOK.md`, then:

```bash
git fetch origin main integration
git rev-parse origin/main origin/integration
git merge-base --is-ancestor origin/main origin/integration
node tools/spec-workbench.mjs render
node tools/spec-workbench.mjs doctor
git diff --check
```

## Documentation Impact

- This spec owns reconciliation requirements, decisions, ticket state, and proof.
- Generated `BLUEPRINT.md` and `TASKBOARD.md` project catalog and active state.
- S-014 links to this spec as the upstream dependency for its exact-head audit;
  its existing completed evidence is not rewritten.
- `RUNBOOK.md` already documents the version-control and ancestry commands; add
  only missing operational steps rather than duplicating this spec.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-20 | plan | Proposed S-015 as the linked follow-on that owns the recurring main-into-integration ancestry reconciliation gap currently blocking S-014/TK-002. Captured the un-ticketed reconciliation as a single audited-merge tracer bullet; no branch, merge, PR, or status was created. | Read S-014's current state and 2026-07-19 reconciliation evidence for the recorded exact SHAs and failed ancestry check; `node tools/spec-workbench.mjs render` and `doctor` passed with S-015 in the catalog and out of the hot board while `planned`. | Added S-015; appended a linking evidence row to S-014 without altering its existing rows; rendered the generated Blueprint catalog and Taskboard | Owner authorizes activation and assigns a durable writer to claim TK-001; exact live SHAs must be re-verified at claim time |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- This is a proposal (`planned`); no reconciliation has been performed and no
  release evidence exists.
- Recorded exact SHAs are historical; branches may have moved and must be
  re-resolved live before any merge.
- S-014 owns the downstream exact-head audit, release-gate status, and promotion
  PR; this spec only restores main ancestry.

## Supersession

- Supersedes: none
- Superseded by: none
- Follow-on to: S-014 (Workbench Release Candidate); reconciliation dependency
  for S-014/TK-002.
