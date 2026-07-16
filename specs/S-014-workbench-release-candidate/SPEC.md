# S-014 - Workbench Release Candidate

> Generated from LLM Workbench v2.3. Stable path
> `specs/S-014-workbench-release-candidate/SPEC.md`; never move between status folders.

**Spec ID:** S-014
**Status:** active
**Priority:** 0
**Owner:** Captain
**Updated:** 2026-07-16
**Catalog description:** Prepare one exact-SHA, independently audited Workbench integration-to-main release candidate for owner approval through CIC.
**Blockers:** none
**Latest event:** Release-candidate plan captured from exact remote branch evidence.
**Next gate:** Engineer claims TK-001 and reconciles main ancestry through an audited PR into integration.

## Outcome

The Workbench exposes exactly one non-draft `integration` to `main` pull request
whose head is independently audited, carries durable exact-SHA release-gate
evidence, and is ready for Kayden to approve and execute through Command
Information Center without an agent merging it.

## Why It Matters

CIC already has a fixed, fail-closed Workbench release controller, but the
current Workbench branches do not satisfy its ancestry, status, and pull-request
inputs. Preparing those inputs through the normal branch and audit flow turns
the existing safe integration checkpoint into an owner-usable release candidate
without weakening either repository's release boundary.

## Current Verified State

- `origin/integration` is exact commit
  `6943c106acb8de56d55599ece4fcf29a59da4f41`; `origin/main` is exact commit
  `dd1ed326a1d55e1f2303aa233cc4d1bf6a0a4270`.
- Their merge base is `debd8b6339582d00d061e5b4bcf5f79bcf3c39be`.
  `origin/main` is not currently an ancestor of `origin/integration`; the only
  main-only commit is the prior integration promotion merge `dd1ed32`.
- No open Workbench pull request exists, and the current integration SHA has no
  GitHub commit status. CIC therefore cannot see a ready candidate yet.
- The integration checkpoint is the already-audited safe harness checkpoint
  selected for release preparation. S-011 separately remains active: thirteen
  reviewed skills are live, seventeen imported baselines remain isolated under
  `skills-pending/`, and fresh Claude discovery is blocked on owner-controlled
  Claude authentication. Those transparent limitations do not invalidate the
  audited live checkpoint and are not silently promoted as completed work.
- CIC's fixed contract accepts only `KaydenClark/LLM_Workbench`, source
  `integration`, destination `main`, exactly one open non-draft matching PR,
  current exact branch SHAs, `main` ancestry, GitHub mergeability, and a
  successful `gptos/workbench-release-gate` status on the exact integration SHA
  with an HTTPS evidence URL and concise Auditor summary.

## Desired Behavior

- Reconcile `main` into `integration` through a normal audited pull request so
  the exact current main commit becomes an ancestor without rebasing, forcing,
  or rewriting either protected branch.
- Run the complete Workbench verification suite on the reconciliation branch
  and again on the exact resulting remote integration head.
- Give an independent Auditor a fresh, immutable exact-integration review.
- Publish `gptos/workbench-release-gate: success` only on the exact SHA that
  passed that review, with a durable HTTPS evidence URL and concise summary.
- Open or preserve exactly one non-draft `integration` to `main` pull request
  whose exact head/base match the audited integration and current main SHAs.
- Leave that promotion PR open. Kayden remains the only release authority and
  approves or executes the merge through CIC.

## Decisions And Contracts

- TK-001 uses a short-lived branch from exact `origin/integration`, merges
  exact `origin/main` into that branch with history preserved, and enters
  `integration` only through an independently reviewed PR. No rebase,
  force-push, direct protected-branch write, or history rewrite is allowed.
- The reconciliation is not complete until
  `git merge-base --is-ancestor origin/main origin/integration` succeeds after
  the audited PR lands and the full suite is green on the resulting exact head.
- TK-002 starts only after TK-001. Its Auditor uses a fresh registered worktree
  or clean clone at the immutable remote integration SHA and remains read-only
  while reviewing source, tests, controls, branch identity, and full-suite proof.
- A success status is evidence, not a scheduling flag. It may be published only
  after the exact-head audit passes with no unresolved finding. The status
  target must be a durable HTTPS permalink containing the audited SHA, commands,
  results, Auditor identity, and limitations. Prefer a GitHub Actions run; when
  no workflow exists, use a permalinked GitHub commit comment bound to the
  audited SHA.
- Status context is exactly `gptos/workbench-release-gate`; state is exactly
  `success`; the description is a concise Auditor summary within GitHub's limit.
  If review or verification fails, publish no success. A truthful non-success
  status with evidence is allowed, but absence or failure must remain fail-closed.
- Any later integration commit invalidates the candidate naturally: the new SHA
  has no inherited success status and requires a new exact-head audit.
- TK-003 queries GitHub before mutation. If no matching promotion PR exists, it
  opens one non-draft PR with head `integration`, base `main`, and a body that
  requires merge-commit semantics. If exactly one exact matching PR already
  exists, it reuses it. Ambiguous, stale, moved, closed, draft, or duplicate PR
  state blocks rather than being guessed or silently repaired.
- Neither TK-003 nor any verification step merges the promotion PR. Squash,
  rebase, force, branch deletion, and alternate repository/branch targets are
  outside this capability.
- S-011's Claude authentication gate and seventeen isolated pending skills stay
  visible as limitations. S-014 does not complete, validate, or distribute
  those pending skills; it releases only the already-audited live checkpoint.

## Non-Goals

- Merging `integration` into `main` or approving the release on Kayden's behalf.
- Finishing S-011, authenticating Claude, or promoting any of the seventeen
  isolated pending skills.
- Rewriting Workbench history, rebasing shared branches, force-pushing, or
  changing repository branch protections or merge settings.
- Adding a GitHub Actions workflow, changing credentials, or broadening token
  permissions solely to manufacture release evidence.
- Changing CIC, its fixed release contract, or its mobile interface.
- Publishing a success status before the exact-head independent audit finishes.

## Dependencies And Blockers

- CIC's completed fixed Workbench release contract is the downstream consumer.
- GitHub authentication used by the implementation tasks must already have the
  minimum existing permission needed for their specific PR, evidence, and
  commit-status mutations. Credential changes remain owner-controlled.
- S-011 remains independent and may stay active while this release candidate is
  prepared; its owner authentication gate is not a blocker for S-014.

## Vertical Implementation Slices

Tickets are temporary tracer bullets within this stable capability record.

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Reconcile main ancestry into integration through an audited merge PR | ready | none | pending |
| TK-002 | Audit exact integration and publish the evidence-bound release-gate status | ready | TK-001 | pending |
| TK-003 | Open the sole non-draft integration-to-main owner promotion PR | ready | TK-002 | pending |

### Scoped Ticket: TK-001

**Vertical slice:** From a fresh branch at the recorded integration head, merge
the recorded main head without rewriting history, resolve only evidence-backed
conflicts, run the complete suite, publish a PR into `integration`, obtain an
independent exact-diff audit, and merge that below-integration PR only after it
passes.

**Done criteria:**

- The branch began at the current remote integration SHA and merged the current
  remote main SHA with a normal merge commit; neither shared branch was rebased,
  force-pushed, or written directly.
- The full RUNBOOK verification suite, render, doctor, and `git diff --check`
  pass on the reconciliation head.
- An independent Auditor reviews the immutable reconciliation diff and records
  no unresolved finding before the PR is merged to `integration`.
- After merge and fetch, remote `main` is byte-for-byte unchanged, remote
  `integration` is clean and exact, main is an ancestor of integration, and the
  full suite passes on that exact integration head.

**Verification:** Full RUNBOOK suite, then:

```bash
git merge-base --is-ancestor origin/main origin/integration
git rev-parse origin/main origin/integration
node tools/spec-workbench.mjs render
node tools/spec-workbench.mjs doctor
git diff --check
```

### Scoped Ticket: TK-002

**Vertical slice:** Give a separate read-only Auditor the immutable post-TK-001
integration SHA, rerun the complete suite from a fresh worktree, publish durable
GitHub evidence, and attach the fixed success context only if every exact-head
gate passes.

**Done criteria:**

- The audit records the exact local and remote integration SHA, clean worktree,
  exact main SHA, successful ancestry check, full suite, and release-scope diff.
- The evidence permalink is HTTPS and states the exact SHA, command results,
  Auditor identity, no-merge boundary, and S-011 Claude/pending-skill limitation.
- GitHub's combined status for that exact integration SHA contains one latest
  `gptos/workbench-release-gate` success with the same evidence URL and concise
  Auditor summary.
- No status success exists for a failed, changed, or unaudited SHA. No PR is
  opened and no branch is merged by this ticket.

**Verification:** Full RUNBOOK suite plus literal GitHub status JSON inspection:

```bash
git rev-parse HEAD origin/integration
git status --short
git merge-base --is-ancestor origin/main origin/integration
gh api repos/KaydenClark/LLM_Workbench/commits/$(git rev-parse origin/integration)/status
```

### Scoped Ticket: TK-003

**Vertical slice:** From verified GitHub branch, status, and PR reads, ensure one
non-draft promotion PR exists from `integration` to `main`, record its exact
identity for CIC, and stop before merge.

**Done criteria:**

- Remote main remains the TK-002 base SHA and is an ancestor of remote
  integration; remote integration remains the exact status-approved SHA.
- Exactly one open, non-draft PR has head `integration`, base `main`, current
  exact head/base SHAs, and a merge-commit-only expectation in its body.
- GitHub reports the PR mergeable and the exact integration SHA still carries
  the evidence-bound success context.
- The PR is left open and unmerged for Kayden's CIC approval. Main, integration,
  credentials, repository settings, and source branches are otherwise unchanged.

**Verification:**

```bash
git merge-base --is-ancestor origin/main origin/integration
gh pr list --state open --base main --head integration --json number,isDraft,headRefOid,baseRefName,headRefName,url
gh api repos/KaydenClark/LLM_Workbench/commits/$(git rev-parse origin/integration)/status
```

## Acceptance Criteria

- [ ] Current `origin/main` becomes an ancestor of `origin/integration` through
      an audited merge PR without history rewriting or direct protected-branch writes.
- [ ] The complete Workbench suite passes on the reconciliation head and exact
      resulting remote integration head.
- [ ] A separate Auditor reviews the immutable post-reconciliation integration
      SHA from a clean worktree with no unresolved finding.
- [ ] The exact audited integration SHA has a successful
      `gptos/workbench-release-gate` status with an HTTPS evidence permalink and
      concise Auditor summary; no success is published for any other SHA.
- [ ] Exactly one open non-draft `integration` to `main` PR matches the current
      exact branch SHAs and records merge-commit semantics.
- [ ] CIC's fixed public GitHub evidence contract can read the candidate as
      ready without accepting any caller-selected repository, branch, SHA, URL,
      command, or merge mode.
- [ ] The promotion PR remains open and `main` remains unchanged until Kayden
      approves and executes it through CIC.
- [ ] S-011's owner Claude-authentication gate and seventeen isolated pending
      skills remain explicit limitations, not false release completion claims.

## Testing Seams

- Git ancestry: literal `merge-base --is-ancestor` before and after TK-001.
- Harness health: every command in RUNBOOK Full verification at the candidate SHA.
- Independent audit: fresh worktree identity, clean state, fixed diff, and
  exact-head rerun owned by a separate Auditor task.
- Status contract: GitHub combined-status JSON for the immutable integration SHA.
- PR contract: GitHub list/detail JSON proving exactly one open non-draft fixed PR.
- CIC compatibility: read-only candidate inspection against the fixed public
  GitHub evidence after TK-003; no execution during Workbench verification.

## Verification Procedure

Run the full suite from `RUNBOOK.md`, then:

```bash
git fetch origin main integration
git merge-base --is-ancestor origin/main origin/integration
node tools/spec-workbench.mjs render
node tools/spec-workbench.mjs doctor
git diff --check
gh api repos/KaydenClark/LLM_Workbench/commits/$(git rev-parse origin/integration)/status
gh pr list --state open --base main --head integration --json number,isDraft,headRefOid,baseRefName,headRefName,url
```

## Documentation Impact

- This spec owns release-candidate requirements, exact decisions, limitations,
  ticket state, and proof.
- Generated `BLUEPRINT.md` and `TASKBOARD.md` project catalog and active state.
- Implementation checks `RUNBOOK.md` for a durable release-candidate procedure;
  add only missing operational commands rather than duplicating this spec.
- `README.md`, templates, skills, and S-011 change only if their owning truth
  changes. The planning slice does not change those contracts.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-16 | plan | Captured S-014 from exact remote refs and CIC's completed fixed release contract | `origin/integration` `6943c10`; `origin/main` `dd1ed32`; merge-base `debd8b6`; ancestry check false as expected; no open PRs; no integration commit status; pre-change doctor green and `next` empty | Added S-014; Blueprint catalog and generated Taskboard rendered | Execute TK-001, TK-002, and TK-003 in order; no release mutation performed by Planner |
| 2026-07-16 | plan verification | Verified the planning-only work packet and generated projections | Complete RUNBOOK suite passed; root evaluator self-test 113/113; templates 106.6/113; guardrail self-test green at its current 68/100 fixture; render, doctor, and `git diff --check` passed | Docs checked; no additional update needed because S-014 owns the new capability and the generated Blueprint/Taskboard project it | Commit, push, and open the draft planning PR to `integration` |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- S-011 remains active independently: owner Claude authentication is required
  for its fresh Claude discovery gate, and seventeen imported skills remain
  isolated pending rewrite. S-014 neither conceals nor resolves that work.
- CIC mobile approval/execution presentation is owned by CIC, not this repo.

## Supersession

- Supersedes: none
- Superseded by: none
