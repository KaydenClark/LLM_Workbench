---
name: implement
description: Implement one eligible Workbench task through verified remote recovery.
---

Implement one eligible task from the assigned stable `SPEC.md`. Stability names its identity, not a fixed folder;
resolve its current route through the manifest and native lifecycle tools. One invocation
owns one task and one durable writer lane.

For v3 work, `workbench/manifest.json` is the support-path authority; the
manifest-aware spec tool resolves the assigned `SPEC.md`. Do not write a root
`specs/` fallback or copy the global core into a project-local skills tree.
Authorized room-local extensions follow the Runbook ownership procedure.

## 1. Situate the slice

Verify the repository root, branch, remote, upstream, and dirty state. Read the
nearest `AGENTS.md` and its `RUNBOOK.md`, then run:

```bash
node workbench/tools/spec-workbench.mjs doctor
node workbench/tools/spec-workbench.mjs next --json
node workbench/tools/spec-workbench.mjs show S-###
```

Continue when the explicitly assigned task is ready or resumable and the
working tree can be safely attributed. `next` supports owner-directed pickup;
it does not override an explicit assignment. Use the stance assigned in SPEC
and TASK, and investigate within that task without inventing another queue item.
Resolve the Task's `TASK.md` through the Spec and manifest; read its destination,
blockers and receipt rows, plus the objective's notepad. If already in progress,
verify its owner, branch and achieved proof and resume without a second claim.
For a planned or table-backed packet, follow the Runbook's native activation
and conversion route only under existing authorization; retain the existing
Task ID. Never manufacture a replacement Task to avoid a blocker.

Name the authorized endpoint before editing: scoped Worker handback, a draft
candidate, or reviewed integration, as the request and controls actually allow.
A ready slice must belong to this writer; claim it:

```bash
node workbench/tools/spec-workbench.mjs claim S-### --agent NAME
```

The slice is situated when one eligible task, its acceptance boundary, its
public testing seam, and its single writer are explicit.

## 2. Drive the behavior

Use red/green/refactor at the agreed seam:

1. Add or change the smallest durable test that expresses the task behavior.
2. Run it and observe the expected red failure.
3. Implement the smallest change that turns it green.
4. Refactor while the focused test stays green.

Run focused checks during the loop. Finish with every project-owned verification
command required by `RUNBOOK.md`. The behavior is driven when the expected red
and green results are named and the full required gate is green.

## 3. Document and checkpoint

Update the owning documentation named by `AGENTS.md`; keep capability state and
proof in the assigned Spec and Task; keep the Taskboard a generated projection.
Record meaningful checks while the Task is still in progress, including the
expected red failure, green result, changed documentation and remaining gaps:

```bash
node workbench/tools/spec-workbench.mjs receipt S-### --task TK-### \
  --tests "ACTUAL COMMANDS AND RESULTS" --docs "OWNERS UPDATED OR reason" \
  --remaining-gap "GAP OR none"
node workbench/tools/spec-workbench.mjs render
node workbench/tools/spec-workbench.mjs doctor
```

Compose `/to-docs` for changed truth and `/save` for authorized persistence.
Create a truthful in-progress checkpoint: stage only this writer's named files,
commit and push to the assigned branch, fetch that branch, then prove
`git merge-base --is-ancestor <commit> <remote>/<branch>` against the fresh ref.
Also compare the advertised remote tip with the intended candidate when handing
off an exact head. A failed push or fetch is pending recovery, never success;
retain the local commit and prepared publication details and name the blocker.
Do not copy credentials or expand access to bypass an unavailable route.

Record the comparison base as `BASE_SHA` and the remotely verified checkpoint as
`HEAD_SHA`. This step is complete only when the remote is the recovery point for
the exact code, tests, documentation, and in-progress spec state under review.

## 4. Review at the relevant boundary

Use review and verification practices to challenge the work before calling it
done. Earlier review is support, not a mandatory independent ceremony per
task. Self-review can find issues while Builder work continues. Worker self-check
compares the scoped diff, acceptance, test results, documentation and receipt
claims, fixes authorized defects and hands that proof to the Dispatcher (or
the assigned owner). Normal Task handback does not require separate Task
approval. It does not authorize a Worker to approve the assembled Spec, record
owner Human QA, or merge a candidate still awaiting review. A draft-only endpoint
stops with the immutable candidate and pending gates named.

While the room's Task-PR exemption holds (exemption 2 of its release Spec, which lands each Task as its own PR), a Task PR still requires separate-context review of its fixed diff as an immutable candidate before it lands: run `/code-review` against exact `BASE_SHA` and `HEAD_SHA`, including controls, the assigned spec, tests and consequential report claims, reported by `gate --task TK-### --spec S-###`.
Repair only authorized findings, create a new truthful checkpoint, and re-review the changed candidate. The exact-head review must pass before the Task PR lands.
At the declared integration branch (`git.integrationBranch` in `workbench/manifest.json`), a separate-context review of the assembled Spec is required, obtained with `report S-### --candidate <sha>` and bound to its content digest, recorded with `verdict`. Do not call an intermediate checkpoint or green self-review an integration PASS.

## 5. Close and recover remotely

Close the task only after its scoped acceptance and required proof are met.
If the task includes integration, the separate-context gate above also applies:

```bash
node workbench/tools/spec-workbench.mjs close S-### \
  --proof "NAMED VERIFICATION" \
  --docs "DOCS UPDATED OR Docs checked; no update needed + reason" \
  --remaining-gap "GAP OR none"
node workbench/tools/spec-workbench.mjs render
node workbench/tools/spec-workbench.mjs doctor
```

Commit the close evidence and generated projection, make the final push, and
fetch and verify containment of the local commit in the remote branch, naming
both exact SHAs. If the task remains
incomplete, its in-progress checkpoint is the handoff; closing is not truthful.

When integration is authorized, automated delivery stops at the declared
integration branch after the
repository's review gates pass. The owner controls promotion from that branch
to the release branch.

Report the authorized endpoint actually reached, accounted-for worktree state,
exact candidate and recovery ref, checks, documentation, and next gate. A local
checkpoint with blocked publication remains partial; never call it remote
recovery, integration approval, installed behavior, or owner acceptance.

## Work selection and lifecycle

Unless the user names work directly:

1. Verify root, branch, remote, upstream, and dirty state.
2. Run `node workbench/tools/spec-workbench.mjs doctor`; stop on ambiguous state.
3. Run `node workbench/tools/spec-workbench.mjs next --json`.
4. Load only the returned Spec with `show S-###` and its selected Task record;
   inspect the assigned destination, blockers and referenced source/tests.
5. Claim before editing: `claim S-### --agent NAME`. This selects one eligible Task
   in that Spec and writes its record to `in-progress`; it takes a Spec ID,
   not a `TASK.md` path. Follow the assigned stance and single writer lane.
6. Implement that tracer-bullet Task using red/green TDD, actual behavior checks
   and owned documentation. Preserve proof and unresolved gaps as work proceeds.
7. Worker self-checks the scoped result and hands proof to the Dispatcher;
   normal Task hand-back needs no separate Task approval. Use the Task's
   acceptance and the actual branch-route exception in `AGENTS.md`
   [Git Rules](../../../AGENTS.md#git-rules) before landing it.
8. Dispatcher owns whole-Spec QA against the assembled Spec and its destination;
   a separate Director context reviews the immutable assembled candidate before
   integration. Follow the review, correction and closure sequence in the
   [`dispatcher`](../dispatcher/SKILL.md#assembled-review-and-corrective-return)
   and [`director`](../director/SKILL.md#owner-closure-and-reconciliation) skills.

`TASK.md` carries active state and proof for one Task; its Spec carries the
capability's requirements, acceptance, evidence and next gate. The manifest
resolves their paths. `TASKBOARD.md` projects those sources; editing the board
cannot change an assignment or satisfy a gate. Retained done rows in a
record-backed Spec are history, not an alternative active Task queue.

While a Task is in progress, record meaningful tests, documentation and gaps
with `receipt`. Commit and push the verified candidate and Receipt before
`close`, checking that the remote branch names the local SHA; close refuses a
dirty or unpushed tree unless `--git-state-reason TEXT` explicitly records why.
`--git-state-reason` writes the observed state and the reason into the Receipt
row and the Spec evidence row, where a reviewer reads what was waived. `doctor`
reports `detached-head` and `untracked-controls` (untracked control, ADR (`workbench/docs/adr`) or
Spec files) without blocking. Commit and publish the resulting close evidence
and projections as well:

```bash
node workbench/tools/spec-workbench.mjs receipt S-### --task TK-### \
  --tests "NAMED TESTS AND RESULTS" --docs "DOCS TOUCHED OR none" \
  --remaining-gap "GAP OR none"
node workbench/tools/spec-workbench.mjs close S-### \
  --proof "NAMED VERIFICATION" --docs "DOCS UPDATED OR no update needed + reason" \
  --remaining-gap "GAP OR none"
node workbench/tools/spec-workbench.mjs render
node workbench/tools/spec-workbench.mjs doctor
```

`close` closes the first in-progress Task in that Spec, appending its final
Receipt and Spec evidence before marking the record done. It does not select
a ready Task or complete the Spec, and refuses a Spec with no in-progress Task.
One writer must ensure the claimed Task is the one being closed; do not close
unrelated work. A Receipt records live Git facts and stated checks; it is
neither review nor owner approval.

Dependencies remain explicit: plain Spec IDs require `complete` or
`superseded`, and plain Task IDs require done. `S-###:delivered` instead requires
all prerequisite Tasks done, acceptance met and a content-bound PASS whose
candidate and matching committed Spec/Task content are contained in integration;
fetch integration before relying on it, because resolution reads local refs.
`owner:<decision>` is never satisfied automatically; only an authorized resolved
decision allows that blocker to be removed. Diagnose `blocked-without-blocker`
and `unknown-blocker-qualifier` rather than bypassing selection or claim.

## Worker: selection, implementation and hand-back

Examples name S-001/TK-001; substitute the actual IDs and quoted values.

Ordinary entry is AGENTS -> the Runbook -> Lexicon Task Routing -> the assigned
Spec and Task. Verify root, branch, remote, upstream and dirty state first.
Preserve unrelated work and obey the assigned stance/file lane. For ordinary
pickup run these read-only commands before claiming:

```bash
node workbench/tools/spec-workbench.mjs doctor
node workbench/tools/spec-workbench.mjs next --json
node workbench/tools/spec-workbench.mjs show S-001
```

Read the returned TASK.md, destination, blockers and acceptance. `next` offers
ready eligible work; an existing in-progress assignment resumes from its record
and `show`, not a second claim. `claim` takes a Spec ID and selects one eligible
Task; it does not take a TASK.md path. Plain Spec blockers require complete or
superseded; plain Task blockers require done. `S-001:delivered` instead requires
all prerequisite Tasks done, checked acceptance and a content-bound PASS whose
candidate and committed Spec/Task content are contained in integration. Fetch
integration before relying on that local-ref check. `owner:<decision>` is never
automatically satisfied; remove it only after the authorized decision resolves
it. Investigate `blocked-without-blocker` and `unknown-blocker-qualifier` rather
than bypassing them.

`next --review --json` is a separate read-only review offering. Its `review`
array contains eligible Spec and Task cards; `excluded` keeps dependency,
capability, competing-claim and child-gate exclusions visible. It uses the
source-qualified identity, so legacy numeric Task labels remain Spec-scoped.
Default `next` still offers only eligible To-do work. Neither review visibility
nor eligibility records a verdict, independent approval or owner Human QA.
`--review` is accepted only by `next`; it never turns `claim` into a review action.

A minimal Backlog Spec needs its matching title (which may carry the one-sentence
intent), `Spec ID`, and explicit `Status: planned`. Other metadata and the
Task set may be absent. Unknown priority remains null and sorts after known
priorities in JSON; missing people/dates are not invented. Existing pre-cut
Tasks are preserved. Before activation, expand the packet to the full active
Spec contract and supply executable Tasks. The default Markdown board remains
in use; `render --format json` still writes only `TASKBOARD.preview.json`.

For an active table-backed Spec, this one-shot migration precedes its first
record-backed claim. Omit conversion when `tasks/` already exists. It converts
unfinished rows, retaining done rows as history; a second conversion refuses.
A planned Spec needs `--activate` only after its accepted plan is executable.
These migration alternatives are not steps to repeat on an already claimed Spec:

```bash
node workbench/tools/spec-workbench.mjs convert-tasks S-001
node workbench/tools/spec-workbench.mjs convert-tasks S-001 --activate
```

Commit the ready packet before the coordinated claim. From a clean Task branch,
claim publishes its record/projection commit to the configured remote. `--local`
is an explicit local-only alternative, not remote recovery proof.

```bash
node workbench/tools/spec-workbench.mjs claim S-001 --agent codex
```

Implement red/green at the product seam; preserve failed-attempt proof and
unmerged results. Record meaningful checks while the Task is in progress:

```bash
node workbench/tools/spec-workbench.mjs receipt S-001 --task TK-001 \
  --tests "[TESTS RUN AND RESULT]" --docs "[DOCS TOUCHED OR none]" --remaining-gap "[GAP OR none]"
```

Self-check acceptance, actual behavior, documentation and remaining gaps; hand
those results to the Dispatcher. Normal Task hand-back has no separate Task
approval ceremony. Commit and push the verified candidate and Receipt before
close; compare local HEAD to the actual remote branch tip. `close` refuses dirty
or unpushed work unless `--git-state-reason` records the truthful exception; it
closes the first in-progress Task, appends its final Receipt and Spec evidence,
and never selects a ready Task or completes the Spec. One writer must confirm
which record will close. A Receipt records Git/test facts, not approval.

```bash
node workbench/tools/spec-workbench.mjs close S-001 \
  --proof "[NAMED VERIFICATION]" \
  --docs "[DOCS UPDATED OR Docs checked; no update needed + reason]" \
  --remaining-gap "[GAP OR none]"
node workbench/tools/spec-workbench.mjs render
node workbench/tools/spec-workbench.mjs doctor
```

`close` reads repository state before it writes anything and refuses a claim
the repository contradicts, naming what it found: `dirty-tree` lists anything
`git status --porcelain` shows, untracked files included, and `unpushed` means
no remote-tracking ref contains HEAD, naming the upstream distance or the
missing upstream, gone upstream, detached HEAD or absent remote. The refusal
names its own remediation: commit and push, or rerun with
`--git-state-reason "<why>"` (one line) when the state is a truthful
exception. The observed state and the reason are then appended to the
remaining gap that the final Receipt row and the Spec evidence row record, so
a reviewer reads what was waived. A reason on a clean, pushed tree is refused
rather than dropped; where Git state is unknown (no Git, not a repository)
nothing is refused and a given reason is recorded beside `unknown`. `close`
also refuses a Spec with no in-progress Task (`has no in-progress task to
close; claim one first`) rather than closing a ready Task nobody claimed.
`close` takes a Spec ID: `close TK-###` refuses, because the standalone
corrective Task anchored to a Wiki claim is retired.

Commit and publish the closure evidence and projections too; verify the remote
SHA. TASK.md owns Task state/proof, SPEC.md owns requirements/acceptance/evidence
and its next gate, and generated TASKBOARD.md/CATALOG.md cannot satisfy either.

## Version-control procedures

Branching, pull requests, merge and cleanup obey the room's `AGENTS.md`
[Git Rules](../../../AGENTS.md#git-rules); the room's own commands for them are
in its `RUNBOOK.md`
[Version-Control Procedures](../../../RUNBOOK.md#version-control-procedures).

For coordinated Spec delivery, the normal route is a Worker Task-branch merge
request into the Dispatcher Spec branch, then an independently reviewed Spec
merge request into integration under Director coordination. A Task merge is
containment; its Worker supplies self-check and proof. A release-specific
bootstrap exception may name a different route and its gate explicitly; read
that owner rather than silently applying the intended route to unsupported
current tooling. Accepted decisions and current progress are reconciled into
tracked owners on integration through reviewed changes; local notes and
unmerged branches must not be their only discovery route.

Before creating a branch or PR, verify the live base and preserve dirty work.
PR descriptions state what changed, why, risks, and verification.

## Branch completion

A task is not finished at the push. A pushed branch is recoverable, not
delivered. When the integration review passes, open the PR into the declared
integration branch with the Runbook's PR command, merge it, and confirm that
branch contains the work. Do not stall on an approved candidate or leave a
passed PR waiting for the owner; only the owner-only final merge named in
`AGENTS.md` Git Rules stays with the owner. "Never merge a PR left open for
review" means a PR whose review is still pending, not one that already passed.

Delete the branch once the declared integration branch contains it and nothing
is lost, unless its owner defers cleanup. Prove containment of the immutable
reviewed commit before any deletion, then check the actual local and remote
branch tips too. Use `git branch -d` for local deletion and an expected-tip
guard for remote deletion. A tracking upstream alone is not proof of
integration containment; never force it with `-D` to clear a branch. Stacked
branches whose commits are already ancestors of the merged tip need no separate
merge. A branch still holding unmerged work is removed only with owner approval.

For the Spec QA runtime, run the assembled review gate before merging. Record
the owner's actual content-bound approval after integration, naming the
inspected commit whose Spec and live/retired Task content matches the local
assembled digest. Completion still requires that approval; administrative
completion preserves it for retirement, while substantive changes require fresh
review and approval.

Run merge and containment verification as a fail-fast sequence. Pin the reviewed
commit and reject a changed candidate. Merge must not delete branches before
containment is verified. A linked worktree holding the target must not block
verification. Only run cleanup when the owner has not deferred it; verify each
local and remote tip is contained, tolerate absent branches, and use an atomic
expected-tip guard on remote deletion so concurrent pushes are preserved.

The room's closeout recipe runs as one subshell. The subshell stops on any
failure without closing the caller's shell. Merge never requests branch
deletion. Containment uses the immutable reviewed SHA, so it remains checkable
if GitHub already removed the source branch. Cleanup checks local and remote
tips separately; a missing branch is already clean. The deletion lease is a
compare-and-delete guard, not permission to rewrite history. Never use `-D` or
an unconditional force push to bypass failed checks. If a worktree still holds
the task branch, local deletion fails and cleanup stops. When cleanup is
deferred, both branches and the checkout stay intact.

When cleanup is owner-deferred, the declared integration branch contains the
reviewed work and the branches remain available for later cleanup. Disposable
review clones and linked worktrees live outside the canonical checkout, under
the host temporary directory; `git worktree prune` drops the registrations of
removed ones, and a finished review checkout is removed once its review is
recorded. None is a durable owner.
