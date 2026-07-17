# S-014 - Workbench Release Candidate

> Generated from LLM Workbench v2.3. Stable path
> `specs/S-014-workbench-release-candidate/SPEC.md`; never move between status folders.

**Spec ID:** S-014
**Status:** complete
**Priority:** 0
**Owner:** codex
**Updated:** 2026-07-17
**Catalog description:** Prepare one exact-SHA, independently audited Workbench integration-to-main release candidate for owner approval through CIC.
**Blockers:** none
**Latest event:** Kayden merged audited owner promotion PR #34; the released tree is exact, with the single-parent history deviation routed to S-018.
**Next gate:** none

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

- Parser repair PR #33 merged to `integration` at exact SHA
  `60f62917d4ed1ae8000478d62fab56a7afc54816` after independent review.
- That exact SHA carries one successful `gptos/workbench-release-gate` status,
  status ID `50582189853`, linked to durable PR evidence.
- Owner promotion PR #34 was non-draft, named exact integration and main SHAs,
  disclosed S-011 and outcome-evidence limitations, and was merged by Kayden on
  2026-07-16.
- Published `main` is `08ab78e5a59a68d2b04028fe71a2be488d5ae10e` and has the
  same tree as audited integration `60f6291`.
- The published main commit has one parent, so integration is not an ancestor of
  main despite the requested merge-commit semantics. The release tree is valid;
  repeatable history and merge-mode enforcement is an explicit S-018 gap.
- S-011 remains active with thirteen live and seventeen pending skills; no release
  claim concealed that limitation.

## Desired Behavior

- Reconcile `main` into `integration` through a normal audited pull request so
  the exact current main commit becomes an ancestor without rebasing, forcing,
  or rewriting either protected branch.
- Run the complete Workbench verification suite on the reconciliation branch
  and again on the exact resulting remote integration head.
- Give an independent Auditor a fresh, immutable exact-integration review.
- After the Auditor returns PASS without external changes, have Captain assign
  a separate Engineer Publisher task to recheck the immutable candidate and
  publish `gptos/workbench-release-gate: success` with the Auditor's unchanged
  verdict, durable HTTPS evidence URL, and concise summary.
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
- Captain coordinates TK-002 as two separate role invocations. First, a
  read-only Auditor uses a fresh registered worktree or clean clone at the
  immutable remote integration SHA, reviews source, tests, controls, branch
  identity, and full-suite proof, then returns its verdict and evidence without
  editing audited files or changing external state.
- Only after an Auditor PASS may Captain authorize a separate Engineer task as
  Publisher. The Engineer rechecks that integration SHA, main SHA, ancestry,
  and promotion-PR state are unchanged, then posts the Auditor's evidence to a
  durable HTTPS target and attaches the exact release status. The Engineer may
  not rewrite the verdict, alter audit files, move either branch, or combine
  publication with the audit role.
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
- Escaped Markdown table cells are release-critical data. Spec lifecycle and
  feedback automation parsing must preserve escaped pipes and backslashes,
  reject malformed active rows explicitly, and avoid partial persistence.
- This TK-001-to-TK-002 docs transition is the last planned integration content
  mutation before release-gate publication. TK-002 must resolve and pin the
  exact integration SHA after this transition lands; its GitHub status and HTTPS
  evidence target annotate that immutable SHA and do not move the candidate.
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
- Letting the Auditor publish external evidence/status, or letting the Engineer
  Publisher reinterpret the verdict or edit the audited candidate.

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
| TK-001 | Reconcile main ancestry into integration through an audited merge PR | done | none | PR #31 head `490ad58`; ancestry merge `88b6f7e`; integration merge `a9fb9f9` |
| TK-002 | Coordinate separate exact-head audit and evidence publication tasks | done | none | exact integration `60f6291`; PASS evidence; status ID `50582189853` |
| TK-003 | Open the sole non-draft integration-to-main owner promotion PR | done | TK-002 | PR #34 opened exact, left to owner, and merged by Kayden |

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

**Vertical slice:** Captain first assigns a read-only Auditor the immutable
post-transition integration SHA and receives its evidence-backed verdict with
no external changes. Only after PASS, Captain assigns a separate Engineer as
Publisher to recheck the unchanged candidate and post the exact verdict,
durable HTTPS evidence, and fixed success context.

**Done criteria:**

- The audit records the exact local and remote integration SHA, clean worktree,
  exact main SHA, successful ancestry check, full suite, and release-scope diff.
- The Auditor returns prioritized findings or PASS, commands/results, identity,
  limitations, and residual risk in chat; it changes no audited file, GitHub
  comment, commit status, pull request, branch, or other external state.
- The separately authorized Engineer Publisher rechecks the exact integration
  and main SHAs, ancestry, and promotion-PR state against the Auditor handoff
  before any write. Drift stops publication and returns the candidate to audit.
- The Publisher creates an HTTPS evidence permalink that preserves the
  Auditor's verdict and states the exact SHA, command results, Auditor identity,
  no-merge boundary, and S-011 Claude/pending-skill limitation without altering
  audit files or the candidate.
- GitHub's combined status for that exact integration SHA contains one latest
  `gptos/workbench-release-gate` success with the same evidence URL and concise
  Auditor summary.
- No status success exists for a failed, changed, or unaudited SHA. No PR is
  opened and no branch is merged by this ticket.

**Verification:** The Auditor runs the full RUNBOOK suite and returns the
read-only evidence packet. The separate Engineer Publisher then repeats the
identity and safety reads immediately before publication:

```bash
git rev-parse HEAD origin/integration
git status --short
git merge-base --is-ancestor origin/main origin/integration
gh pr list --state open --base main --head integration --json number,isDraft,headRefOid,baseRefName,headRefName,url
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

- [x] Current `origin/main` becomes an ancestor of `origin/integration` through
      an audited merge PR without history rewriting or direct protected-branch writes.
- [x] The complete Workbench suite passes on the reconciliation head and exact
      resulting remote integration head.
- [x] A separate Auditor reviews the immutable post-reconciliation integration
      SHA from a clean worktree with no unresolved finding.
- [x] The exact audited integration SHA has a successful
      `gptos/workbench-release-gate` status with an HTTPS evidence permalink and
      concise Auditor summary; no success is published for any other SHA.
- [x] Exactly one non-draft `integration` to `main` PR matched the current
      exact branch SHAs and records merge-commit semantics.
- [x] CIC's fixed public GitHub evidence contract can read the candidate as
      ready without accepting any caller-selected repository, branch, SHA, URL,
      command, or merge mode.
- [x] The promotion PR remained open and `main` remained unchanged until Kayden
      approved and executed the owner promotion.
- [x] The resulting published tree matches the audited integration tree; the
      single-parent history deviation is recorded and assigned to S-018 rather
      than hidden or retroactively rewritten.
- [x] S-011's owner Claude-authentication gate and seventeen isolated pending
      skills remain explicit limitations, not false release completion claims.

## Testing Seams

- Git ancestry: literal `merge-base --is-ancestor` before and after TK-001.
- Harness health: every command in RUNBOOK Full verification at the candidate SHA.
- Independent audit: fresh worktree identity, clean state, fixed diff, and
  exact-head rerun owned by one read-only Auditor task with no external writes.
- Publication authority: a later, separate Engineer task rechecks unchanged
  identity/ancestry/PR state, preserves the Auditor verdict, and alone writes
  the durable HTTPS evidence and exact-SHA status.
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
| 2026-07-16 | TK-001 reconciliation candidate | Claimed TK-001 from exact integration `5f2c400`, checkpointed the claim, and merged exact main `dd1ed32` with real merge commit `88b6f7e` | Pre-merge ancestry check failed as expected; merge used `ort`, reported no conflicts, retained the first-parent tree exactly, recorded exact main as second parent, and made main an ancestor of the candidate; live guardrail baseline 78/100 | Updated S-014 current state/evidence and generated Taskboard; RUNBOOK/README/templates checked with no change needed because no operational or harness behavior changed | Full verification, remote checkpoint, draft PR, and independent exact-diff audit remain; TK-001 stays in progress |
| 2026-07-16 | TK-001 candidate verification | Verified the ancestry-only candidate without changing harness behavior or weakening gates | Complete RUNBOOK suite passed; root evaluator 113/113; templates 106.6/113; live guardrail remained 78/100 with only pre-existing real-outcome gaps; held-out path grader, eval runner, render, doctor, and diff checks passed; gitleaks scanned 62 commits plus the directory and found no leaks | S-014 and generated Taskboard own the current state; RUNBOOK, README, templates, skills, and benchmarks checked with no update needed because the reconciliation changes ancestry only | Push the verified checkpoint, open a draft PR to `integration`, and obtain independent immutable-diff audit; TK-001 remains in progress |
| 2026-07-16 | TK-001 completion and TK-002 handoff | Closed the audited ancestry reconciliation and assigned exact-head release evidence work | PR #31 merged exact reviewed head `490ad58`; ancestry merge `88b6f7e` records exact main `dd1ed32`; integration merge is `a9fb9f9`; remote refs match, main ancestry passes, integration has zero statuses, and no promotion PR exists; complete RUNBOOK suite, root evaluator 113/113, templates 106.6/113, render, doctor, `next`, diff, and gitleaks directory checks passed | Updated S-014 and generated Taskboard only; this transition is the last planned integration content mutation before the exact-SHA gate | Merge this docs-only transition, then independently audit the resulting exact integration SHA and attach status plus durable HTTPS evidence without moving it; TK-002 is in progress |
| 2026-07-16 | TK-002 role-authority repair | Split the combined audit/publication handoff into two separately authorized Captain assignments | Captain, Auditor, and Engineer role contracts inspected; full RUNBOOK suite passed; root evaluator 113/113; templates 106.6/113; render, doctor, `next`, diff, and gitleaks directory checks passed | Updated S-014 and generated Taskboard only; no release status, evidence comment, promotion PR, audit file, or protected ref changed | Push the repaired PR #32 checkpoint; after it lands, Captain assigns the read-only Auditor first and authorizes the Engineer Publisher only on PASS |
| 2026-07-16 | TK-002 parser repair candidate | Exact-head audit of integration `bb5d9c1` returned REQUEST CHANGES after escaped pipes were treated as table delimiters; added one escape-aware parser shared by spec lifecycle and feedback automation | Focused red tests reproduced broken `node test \| tee proof.log` round-trip and dropped escaped HARNESS_FEEDBACK pipeline; focused green tests preserve pipes/backslashes, reject malformed rows explicitly, and prove rejected spec mutation has no partial persistence | Updated S-014 and generated Taskboard; RUNBOOK, README, templates, and skills checked with no change needed because the existing commands and public harness contract remain accurate | Run the full verification gate, publish the repair PR, then obtain an independent exact-head audit; TK-002 remains in progress and no success status or promotion PR may be created |
| 2026-07-16 | TK-002 parser repair verification | Verified the repair candidate without advancing the release gate and opened draft PR #33 to integration | Complete RUNBOOK suite passed; root evaluator 113/113; templates 106.6/113; live guardrail remained 78/100 with only pre-existing real-outcome gaps; render, doctor, `next`, diff, and gitleaks directory/commit-range checks passed | Docs checked; no additional update needed beyond S-014 and generated Taskboard because operational commands and public controls are unchanged | Obtain an independent exact-head audit of draft PR #33; TK-002 remains in progress |
| 2026-07-16 | TK-002 completion | Independent audit passed on exact integration `60f6291` and the separate Publisher attached release status `50582189853` | GitHub combined status reports `gptos/workbench-release-gate: success` with durable PR #33 evidence | S-014 evidence and PR #34 body disclose limitations | Owner promotion only |
| 2026-07-16 | TK-003 completion | Exact non-draft owner promotion PR #34 was opened and left unmerged to the owner | PR #34 named head `60f6291`, base `dd1ed32`, evidence status, and audit URL | PR body recorded merge and limitation contract | Kayden decision |
| 2026-07-17 | spec closeout | Verified Kayden merged PR #34 and reconciled stale local spec state | Live GitHub PR, status, main/integration refs, tree equality, and commit parents inspected | Completed S-014; S-018 owns the single-parent history deviation and repeatable delivery | none |
| 2026-07-17 | audit remediation | Routed PR #33's implemented parser behavior to cohesive capability owner S-021 without rewriting release evidence | S-021 acceptance maps the shared parser and both focused consumer suites; render, doctor, full planning verification, and diff check passed | S-014 remains the release record; S-021 owns persistence behavior | none |

## Completion Result

Pass with a recorded release-mechanics limitation. The exact audited integration
tree received the required evidence-bound success status, was exposed through one
owner promotion PR, and was merged by Kayden. GitHub produced a single-parent main
commit, so future ancestry and merge-mode enforcement is owned by S-018; published
history was not rewritten.

## Remaining Limitations Or Follow-Up Specs

- S-011 remains active independently: owner Claude authentication is required
  for its fresh Claude discovery gate, and seventeen imported skills remain
  isolated pending rewrite. S-014 neither conceals nor resolves that work.
- S-018 owns deterministic manifests, repeatable downstream rollout, and the
  release history/merge-mode gap observed on PR #34.
- S-021 owns the escape-safe lifecycle and feedback table persistence capability
  implemented and audited during PR #33.
- CIC mobile approval/execution presentation is owned by CIC, not this repo.

## Supersession

- Supersedes: none
- Superseded by: none
