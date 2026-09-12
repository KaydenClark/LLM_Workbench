# S-00J - Spec QA Gate At Integration

**Spec ID:** S-00J
**Status:** planned
**Priority:** 3
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-12
**Catalog description:** Make the harness's own merge-preparation workflow for `integration` run a gate that verifies every Task in the Spec is complete and the branch is up to Spec.
**Blockers:** ADR-000F is `proposed`; WF-8 is an open owner question.
**Latest event:** Spec authored from approved answer FND-Q14; no implementation started and no ADR accepted.
**Next gate:** Owner accepts ADR-000F before any slice is claimed.

> **Citation anchors.** pre=`c0ac60a179235ef22fa6ea81aec74735087e06e5` post=`c0ac60a179235ef22fa6ea81aec74735087e06e5`.

## Outcome

Preparing to merge a working branch into `integration` runs the Spec QA gate as
a local command, invoked by the harness's own merge-preparation skills before
a merge request is opened. The gate verifies that every Task in the Spec was
completed and that the whole branch is up to Spec, and refuses to proceed when
it is not. The reviewed unit is the Spec branch, not a single Task. This is a
tool-level and process-level gate, not a GitHub-enforced one: nothing in this
Spec's scope makes GitHub itself refuse a merge, since this repository has no
`.github/` workflow or branch-protection configuration, `.github/` is outside
this Spec's Edit Scope, and creating either is a CI/CD and repository-settings
change needing its own explicit owner authorization. See Non-Goals.

## Why It Matters

Today the integration review is the only gate at that boundary, and `AGENTS.md`
describes the reviewed candidate in task-level terms. A task-level check can pass
repeatedly while the capability the Spec promised remains unmet, because a Task
is deliberately too small to demonstrate a Spec's acceptance. Nothing currently
refuses to proceed toward a merge on the grounds that the Spec is not finished —
this Spec closes that gap for the harness's own workflow, not for GitHub's.

## Current Verified State

At the pre anchor, `AGENTS.md` requires a separate-context reviewer to check an
immutable candidate against its controls, assigned spec and named evidence
before branches combine into `integration`, and
[ADR-0037](../../docs/adr/0037-independent-review-at-integration.md) carries that
decision. `integration` is declared in `workbench/manifest.json` as
`git.integrationBranch`. No mechanical check verifies Spec-level Task completion
at the merge boundary.

## Desired Behavior

An agent preparing to open a merge request into `integration` runs the gate —
directly, or because the merge-preparation skill it is following runs it as a
required step — and learns immediately whether every Task in the Spec is
complete and whether the branch satisfies the Spec's acceptance. The command
exits refusing when the Spec is incomplete, the same way `close` already
refuses malformed proof. An agent that opens a merge request by some other
path, bypassing the harness's own skills entirely, is not stopped by GitHub
itself — that would need repository-level enforcement, which is out of scope
here. The existing independent review continues to apply; this gate does not
replace human judgment with a checklist.

`integration` remains the Human QA branch, where the owner inspects assembled
behavior before it reaches `main`. That second gate is a matter of branch
policy and control text rather than new tooling.

## Decisions And Contracts

- The two gates, their triggers and the reviewed unit:
  [ADR-000F](../../docs/adr/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md).
- Independent review at integration, which this extends rather than replaces:
  [ADR-0037](../../docs/adr/0037-independent-review-at-integration.md).

ADR-000F is `proposed` at authoring time. No slice may be claimed while it
remains proposed.

## Non-Goals

- **The failure return path.** What a failing gate returns to implementation,
  and in what state, is WF-8 and is open. This Spec delivers refusal; it does
  not design what happens next.
- Replacing the independent separate-context review.
- Any change to who merges `integration` into `main`; that stays owner-only.
- **GitHub-level enforcement.** Adding a `.github/` workflow, required status
  check, or branch-protection rule so GitHub itself refuses an incomplete
  Spec's merge is explicitly out of scope: `.github/` is outside this Spec's
  Edit Scope, and configuring repository settings or CI is a change needing
  its own explicit owner authorization, separate from this Spec's local
  command. A later linked Spec may take that on if the owner wants GitHub
  itself to enforce this rather than relying on the harness's own workflow.

## Dependencies And Blockers

Blocked on owner acceptance of ADR-000F. The gate reads Task completion state,
so it composes with S-00H but does not require it: a Task table row and a
standalone Task record both expose completion.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Add a Spec-completeness check at a stable seam | blocked | ADR-000F proposed | Red test for an incomplete Spec; green check; full suite |
| TK-002 | Bind the check into the harness's own merge-preparation workflow | blocked | TK-001 | Red test proving an incomplete Spec's branch-completion workflow refuses to proceed; green refusal; declared branch resolved from manifest |
| TK-003 | Correct task-level reviewed-unit language to the Spec branch | blocked | TK-002 | Control and skill text updated; branch-closeout tests pass |

### TK-001 - Add a Spec-completeness check at a stable seam

**Stance:** Builder

Define the check against the Spec's Task state. Add a failing test with a Spec
holding one incomplete Task, confirm the failure, then implement the smallest
check that turns it green. The check reports; it does not yet block.

### TK-002 - Bind the check into the harness's own merge-preparation workflow

**Stance:** Builder

Resolve the integration branch from `git.integrationBranch` rather than
hardcoding it. Invoke the check as a required step before the Git push or
integration request that `skills/carry/SKILL.md` and `AGENTS.md`'s Branch
Completion section already describe, so following that workflow refuses to
proceed for an incomplete Spec and passes unchanged for a complete one. This
binds the harness's own process; it does not and cannot make GitHub itself
refuse a merge request opened by some other path, which is out of scope (see
Non-Goals).

### TK-003 - Correct task-level reviewed-unit language to the Spec branch

**Stance:** Builder

`AGENTS.md` and the review and delivery skills describe the reviewed candidate
in task-level terms. Correct them to the Spec branch, consistent with ADR-000F,
without weakening the immutable-candidate requirement from ADR-0037.

## Acceptance Criteria

- [ ] Preparing to merge into the declared integration branch through the
      harness's own workflow runs the check.
- [ ] A Spec with any incomplete Task cannot proceed through that workflow,
      proven by a test that failed before the change. This does not claim
      GitHub itself refuses the merge; see Non-Goals.
- [ ] A complete Spec proceeds with no new friction.
- [ ] The integration branch is resolved from the manifest declaration.
- [ ] Reviewed-unit language names the Spec branch wherever it said Task.
- [ ] The existing independent review requirement is unchanged.
- [ ] The full verification suite passes and `doctor` is clean.

## Testing Seams

The Spec completeness function, the branch-closeout path covered by
`tools/test-branch-closeout.mjs`, and the manifest branch declaration.

## Verification Procedure

Run the targeted test for the touched seam, then the full verification suite
named in `AGENTS.md`, then
`node workbench/tools/spec-workbench.mjs doctor`.

## Documentation Impact

`AGENTS.md` describes both gates and corrects the reviewed unit; `RUNBOOK.md`
gains the gate's command and failure output. These land at ADR acceptance,
which is separate from this Spec.

## Append-Only Evidence And Execution Log

| Date | Commit | Claim | Method | Result |
|---|---|---|---|---|
| 2026-09-12 | c0ac60a | Spec authored; no implementation performed | Read-only review of AGENTS, ADR-0037 and the manifest | Independent review exists at integration; no Spec-completeness check exists at the merge boundary |
| 2026-09-12 | b4edb20 | Review found the Spec's "merge request... triggers" framing was not achievable by its own listed seams: no `.github/` directory exists in this repository, `integration` carries no branch protection (`gh api .../branches/integration/protection` returns 404), and `.github/` is outside this Spec's Edit Scope | Checked for `.github/` on disk and queried branch protection via the GitHub API | Reframed Outcome, Why It Matters, Desired Behavior, TK-002, and Acceptance Criteria around a local/harness-workflow gate rather than a GitHub-enforced one; added an explicit GitHub-level-enforcement Non-Goal; no implementation performed |

## Completion Result

Not started.

## Remaining Limitations Or Follow-Up Specs

The failure return path is WF-8 and needs an owner answer before it can be
specified. The Human QA gate from `integration` to `main` is branch policy and
control text, not tooling, and is carried by ADR-000F acceptance.

## Supersession

None.
