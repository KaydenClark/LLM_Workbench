# S-00O - Workbench v4.0.0 Release

**Spec ID:** S-00O
**Status:** blocked
**Priority:** 1
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-16
**Catalog description:** Carry the settled WF workflow into the Workbench as v4.0.0: record the two bootstrap exemptions the rollout runs under, stamp the version only after the four build Specs complete, pass the Workbench Template upgrade gate and prove one full WF-11 cycle on another workbench.
**Blockers:** S-00P must reach `complete`; S-00P itself waits on S-00H, S-00I and S-00J.
**Latest event:** Spec authored 2026-09-16 from the owner's rollout decision (directive-018) in the WF grilling note at revision 57; no implementation started.
**Next gate:** S-00P reaches `complete`; then set Status to `active` and `claim S-00O` takes TK-001.

> **Citation anchors.** pre=`e3c5c8f343ec36d411bb6b9ea656e0f53c7406cb` post=`e3c5c8f343ec36d411bb6b9ea656e0f53c7406cb`.

## Outcome

Workbench v4.0.0 is the release in which the Workbench runs the governing
workflow the owner settled in the WF grilling: Idea -> Align through grilling
-> confirmed design concept -> Blueprint -> recursive Spec/Task delivery, with
Tasks as standalone records, separate-context review of the assembled Spec,
`integration` as the owner's Human QA surface, and reconciliation followed by
retirement of completed Specs and Tasks.

This Spec is the orchestration record for that release, on the pattern of
S-050. It owns the two bootstrap exemptions the rollout runs under, the version
bump, the Template Upgrade Release Gate and the WF-11 acceptance cycle. The
capabilities themselves are owned by four build Specs: S-00P (Canon rework),
S-00H (Task artifact), S-00I (retirement lifecycle) and S-00J (Spec QA gate).

## Why It Matters

On 2026-09-16 the owner stopped the standalone documentation-promotion pass and
chose to run the rollout through a small set of Specs worked through the
existing system (directive-018): "if we are going to use one let's use a few.
but SPECs can nest and block each other, same as tasks." Without one record
that says which Specs make up the release, what is exempted while the tooling
the locked design needs does not yet exist, and what proof closes the release,
each build session would rediscover the plan from an untracked note, and the
version could be stamped before the workflow actually works anywhere but here.

## Current Verified State

At the pre anchor:

- `workbench/manifest.json` declares `workbenchVersion` `v3.2.1`,
  `git.integrationBranch` `integration` and `git.defaultBranch` `main`.
- [Workbench_Template](https://github.com/KaydenClark/Workbench_Template)
  `integration` is at `fc0fc18c2c1752c8c98a4fed20304e803c71f53c` and its
  manifest declares `v3.2.1`, so the Template matches the source and the
  v3.2.1 gate is closed.
- ADR-000H is accepted. ADR-000F, ADR-000G and ADR-000I are `proposed`.
  ADR-000G's text still gives the Blueprint the PRD function that the locked
  WF-1 answer places in each Spec.
- S-00H is `active` with TK-001 and TK-008 ready. S-00I and S-00J are
  `planned` and carry blockers (owner acceptance of their proposed ADRs, "WF-8
  is an open owner question", FND-Q07 and FND-Q08 HELD) that the WF grilling
  has since answered or superseded.
- No `TASK.md` exists; slices are table rows in their Specs, and `next`,
  `claim`, `close`, `complete` and `render` operate on those rows. No command
  reviews an assembled Spec, records owner Human QA, moves a record between
  lifecycle folders or reconciles a completed Spec into the Wiki.
- `doctor` reports 48 attention findings and no blocking finding: five
  `stale-seed`, one `unverified-provenance` and 42 `incompatible-core`
  findings for `v3.2.0` core skills installed in a `v3.2.1` room. None is part
  of this release's scope.
- The WF grilling note `wf-workbench-workflow-2026-09-15` is at revision 57
  with all 19 WF questions locked. TT-Q10 (Task identifier form) is open in
  its sibling note, and correction-019's replacement wording for WF-1 is
  unconfirmed. Both notes are untracked working material named as origin, not
  durable evidence.

## Desired Behavior

1. Every build session can read from this Spec which five Specs make up
   v4.0.0, in what order they unblock, and under which two exemptions they run.
2. The version is stamped `v4.0.0` only after S-00P, S-00H, S-00I and S-00J
   are `complete`, the required proof is green, and the bounded Workbench
   self-drift check in `RUNBOOK.md` finds no current-facing artifact still
   presenting the rollout as pending.
3. The Template Upgrade Release Gate in `AGENTS.md` and `RUNBOOK.md` is
   exercised for real against Workbench_Template: pinned source and Template
   commits, the public upgrade route, preserved room-owned state, matching
   manifest, control and runtime versions, exact managed bytes, the Template's
   full suite, separate-context review, merge into its integration branch,
   remote containment and a fresh-clone rerun.
4. One full WF-11 cycle runs on another workbench: LLM_Workbench creates or
   updates it, a grilling session runs, its contract and Specs are created or
   updated, Tasks are created and executed through `next` and `claim`, and the
   Spec is verified and sitting on that workbench's integration branch for
   owner review. That cycle is the acceptance test for the rollout; earlier
   pilots are supporting evidence only.
5. The release receipt distinguishes readiness from publication. Main
   promotion stays owner-only in both repositories.

## Decisions And Contracts

### Bootstrap exemptions

Both exemptions are recorded from directive-018 in the WF grilling note at
revision 57. They apply to this rollout only, reopen or re-answer none of the
19 locked WF questions, and end when the tooling the locked answer needs
exists.

**Exemption 1 - WF-12 is reopened for the rollout's own delivery route.** The
locked WF-12 answer requires the rollout to complete the Blueprint rework and
every Spec needed to establish the full workflow. On 2026-09-16 the owner
accepted that the rollout itself runs through these five Specs worked through
the existing `next`, `claim` and `close` system, not through the full
Spec-per-capability route the reworked Blueprint will describe. The scope of
WF-12 is unchanged: every one of the five Specs must be `complete` before this
release is called done. Only the delivery route is exempted.

**Exemption 2 - WF-7 is deferred.** The locked WF-7 answer nests branches by
altitude: a Spec branch from `integration`, a Task branch from its Spec branch,
proven Task results accumulating in the Spec branch. No Spec in this rollout
builds Spec-branch tooling, so until it exists every Task in this rollout lands
as its own branch and PR straight into `integration`, exactly as `AGENTS.md`
Git Rules already describe. `integration` remains the owner's Human QA
surface. The reworked Blueprint describes the nested topology as the intended
destination; a later Spec derived from it delivers the tooling and ends this
exemption.

**Retained during the exemptions.** The `AGENTS.md` integration gate stays in
force: every PR into `integration` gets a separate-context review of its
immutable candidate before merge, and a new candidate needs a fresh review.
This is the current Contract's rule for the `integration` boundary, not the
per-Task review ceremony WF-8B rejected; it applies because the merge target
is `integration`, and it is what makes exemption 2 safe. The Template Upgrade
Release Gate runs before any tag. Owner-only `main` promotion is unchanged.

### Assigned capability map

| Unit | Owner | Blocks on | Endpoint |
|---|---|---|---|
| Blueprint rewrite against every rung and the full recursive loop | [S-00P](../S-00P-workflow-canon-rework/SPEC.md) TK-001 | nothing; ready now | Reworked `BLUEPRINT.md` |
| Standalone `TASK.md`, Task vocabulary, Packet, Receipt, Taskboard projection | [S-00H](../retired/S-00H-task-artifact-and-terminology-migration/SPEC.md) | TT-Q10 for TK-003 and TK-004 only | S-00H `complete` |
| Retirement lifecycle by folder, reconciliation into durable owners, verified discard | [S-00I](../S-00I-folder-lifecycle-for-records/SPEC.md) | S-00H | S-00I `complete` |
| Assembled-Spec review, corrective-Task return path, Human QA approval before closure | [S-00J](../S-00J-spec-qa-gate-at-integration/SPEC.md) | S-00H | S-00J `complete` |
| AGENTS, RUNBOOK, LEXICON and `templates/` rewrite; ADR-000F, ADR-000G and ADR-000I reconciled | S-00P TK-002 onward | S-00H, S-00I, S-00J | S-00P `complete` |
| v4.0.0 stamp, Template gate, WF-11 cycle, release receipt | This Spec | S-00P | Readiness verdict |

Never more than two build lanes run at once. The two lanes open now are S-00P
TK-001 and S-00H TK-001, with S-00H TK-008 following in the same lane. The
lane limit is operational guidance the tool does not enforce: `claim` will
hand out a third slice if asked, so the dispatcher holds the limit.

### Preserved open items

- **TT-Q10**, the form of a new Task identifier, was answered by the owner on
  2026-09-17: no change, newly allocated identifiers keep `TK-###` with `TK`
  read as the Task prefix (S-00H evidence row of that date). S-00H TK-003 and
  TK-004 are no longer gated on it.
- **correction-019**: the owner objected to the shorthand that had been used
  for the WF-1 answer. The allocation itself is locked (the Blueprint owns the
  product-level destination; each Spec is the PRD-shaped smaller destination
  derived from it), and no Spec or Blueprint in this release promotes the
  objected shorthand as a slogan.
- **WF-10**: a coordinator for parallel pickup is the intended model and is
  future Blueprint scope. The reworked Blueprint may describe it; no Spec is
  created for it in this release.

### Operational guidance, not design

Model allocation recorded with directive-018: the planning session, the
controls rewrite and every integration-gate review use Fable; build sessions
use Sonnet for Tasks with a named seam and a clear red test, and Opus for
shared-logic Tasks that change `next`, `claim`, `doctor` or the Spec QA gate;
the reviewer never uses the builder's model. This guides who is dispatched and
decides nothing about the product.

## Non-Goals

- Implementing any capability here. Every tool, record and control change
  belongs to S-00P, S-00H, S-00I or S-00J.
- Answering TT-Q10 or confirming correction-019's wording.
- Spec-branch tooling or the WF-10 coordinator.
- Reopening any locked WF question.
- Merging `integration` into `main` in either repository, or rolling the
  release into any other room.
- Repairing the 48 attention findings `doctor` reports at the pre anchor. They
  are outside the release scope; TK-001 records their state either way.

## Dependencies And Blockers

Blocked on S-00P reaching `complete`, which is itself blocked on S-00H, S-00I
and S-00J. Ticket edges below govern selection once this Spec is `active`. The
WF-11 cycle needs a target workbench the owner names before TK-004 is claimed;
the Template updated by TK-003 is the default candidate unless the owner names
another.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Verify the four build Specs are complete and run the bounded self-drift check | ready | S-00P | Red: `next --json` still returns a rollout slice, or a current-facing control, projection or Spec presents rollout work as pending; green: the RUNBOOK manual self-drift check records no current-facing drift and `doctor` has no blocking finding |
| TK-002 | Stamp v4.0.0 and validate the stamp | blocked | TK-001 | Red: a stamp check fails while the manifest says v4.0.0 and a control stamp, template stamp or managed runtime receipt still says v3.2.1; green: every stamp names v4.0.0 and the full suite passes |
| TK-003 | Pass the Template Upgrade Release Gate against Workbench_Template | blocked | TK-002 | Red: `tools/workbench-tools.mjs verify --project TEMPLATE_ROOT` from the pinned v4.0.0 source reports a version or managed-hash mismatch before the update; green: matching versions and exact managed bytes, Template full suite, separate-context review, merge into its integration branch, remote containment and fresh-clone rerun recorded |
| TK-004 | Run one full WF-11 cycle on another workbench | blocked | TK-003 | Red: the cycle stalls at any rung; green: create or update, grilling, contract and Specs, Tasks created and executed through `next` and `claim`, Spec verified and on that workbench's integration branch for owner review, with pass or fail evidence per rung |
| TK-005 | Reconcile the release receipt and readiness verdict | blocked | TK-004 | Red: the receipt would claim readiness while any acceptance box is unchecked or an exemption lacks its named successor; green: receipt names source and Template SHAs, PRs, review verdicts, the self-drift result and what readiness does not authorize |

### TK-001 - Verify the four build Specs are complete and run the bounded self-drift check

**Stance:** Builder

Confirm S-00P, S-00H, S-00I and S-00J are `complete` at the declared
integration branch, not only in a local checkout. Run `render` and `doctor`,
then perform the bounded manual Workbench self-drift check in `RUNBOOK.md`:
inventory controls, projections, manifest, Specs and `CATALOG.md`, active ADRs
and register, Wiki router, procedures, templates, managed tool and skill
receipts and seeded documents; reconcile every current-facing status, blocker,
event, gate, version and path against its durable owner. Red looks like a
control or projection that still presents the rollout as pending or names a
retired route; green is a recorded check with no current-facing drift. Record
the 48 pre-anchor attention findings' state without treating them as scope.
S-00P closes through the gate S-00J installs, so its completion needs a
recorded assembled-Spec verdict and an owner Human QA approval naming the
`integration` SHA; confirm both exist rather than only the `complete` status.
The same holds for S-00J itself and for any build Spec that closes after
S-00J TK-005 lands.

### TK-002 - Stamp v4.0.0 and validate the stamp

**Stance:** Builder

Version bumps occur only after the new behavior and required proof are green.
Stamp the manifest, control stamps, generic template stamps and the managed
runtime receipt together. The seam is the suite's version-stamp checks
(`tools/test-workbench-layout.mjs`, `tools/test-control-fidelity.mjs` and
`tools/test-workbench-identity.mjs` all read `workbenchVersion`): red is a
run with only the manifest changed, which must fail on the mismatch; if the
existing suite does not fail on that mismatch, add the assertion first.
Green is every stamp naming `v4.0.0` and the full suite passing on the
committed candidate.

### TK-003 - Pass the Template Upgrade Release Gate against Workbench_Template

**Stance:** Builder

Follow the RUNBOOK Template Upgrade Release Gate procedure exactly. Pin the
clean v4.0.0 source commit and the Template's integration commit (starting
from `fc0fc18c2c1752c8c98a4fed20304e803c71f53c` or its verified successor).
Exercise the public `update-harness` route, preserve room-owned state, verify
matching manifest, control and runtime versions and exact managed bytes with
`tools/workbench-tools.mjs verify --project`, run the Template's full suite,
obtain separate-context review of the immutable Template candidate, merge it
into the Template's declared integration branch, prove remote containment and
rerun its checks from a fresh remote clone. Source-template tests and fresh
generation do not substitute for the installed upgrade.

### TK-004 - Run one full WF-11 cycle on another workbench

**Stance:** Builder

The owner names the target workbench before this slice is claimed; the
Template updated by TK-003 is the default candidate. Do not select a private
project without a separate user request. Run the whole cycle from decision-077:
LLM_Workbench creates or updates the workbench, a grilling session runs, the
contract and Specs are created or updated, Tasks are created and executed
through `next` and `claim`, and the Spec is verified and on that workbench's
integration branch for owner review. Record pass or fail per rung with the
exact commands and SHAs. A stalled rung is a failed cycle and a finding for the
owning build Spec's successor, not a reason to soften the acceptance.

### TK-005 - Reconcile the release receipt and readiness verdict

**Stance:** Builder

Write the receipt: source v4.0.0 SHA, Template prior and reviewed SHAs, PRs,
review verdicts, self-drift result, WF-11 cycle evidence, and the successor
that ends each bootstrap exemption. State plainly what readiness does not
authorize: no `main` merge in either repository and no rollout to other rooms.
Report ready only if every acceptance box below is checked. This Spec then
closes through the S-00J gate like any other: a recorded assembled-Spec
verdict on the receipt candidate and an owner Human QA approval naming the
`integration` SHA are required before `complete`.

## Acceptance Criteria

- [ ] Both bootstrap exemptions are recorded here with directive-018 as source, scoped to this rollout, and each names the condition that ends it.
- [ ] S-00P, S-00H, S-00I and S-00J are `complete` at the declared integration branch, and every build Spec that closed after S-00J TK-005 landed, S-00P and S-00J included, carries the review verdict and owner approval S-00J requires.
- [ ] This Spec's own closure carries a recorded assembled-Spec verdict and an owner Human QA approval naming the `integration` SHA.
- [ ] The bounded Workbench self-drift check is recorded with no current-facing drift.
- [ ] Every version stamp names `v4.0.0` and the full suite passes on the committed candidate.
- [ ] Workbench_Template is upgraded to v4.0.0 through the public route with matching versions, exact managed bytes, its full suite, separate-context review, integration merge, remote containment and a fresh-clone rerun recorded.
- [ ] One full WF-11 cycle on another workbench is recorded rung by rung with the Spec verified and on that workbench's integration branch for owner review.
- [ ] TT-Q10 remains open unless the owner answered it, and no artifact in the release promotes the correction-019 shorthand.
- [ ] The release receipt distinguishes readiness from publication and names what it does not authorize.

## Testing Seams

`spec-workbench.mjs next --json`, `render` and `doctor` on the committed
candidate; the suite's version-stamp checks; `tools/workbench-tools.mjs
verify --project` against the pinned Template; the Template's own full suite
from a fresh remote clone; and the target workbench's `next`, `claim`,
`close`, `render`, `doctor` and integration branch during the WF-11 cycle.

## Verification Procedure

Run the full suite named in `AGENTS.md` on the committed candidate before and
after the stamp. Capture the guardrail baseline before and after. Review every
immutable candidate in a separate context before it merges into `integration`.
Prove live remote containment of each merged commit. Record every unavailable
environment explicitly instead of substituting a fixture.

## Documentation Impact

`workbench/manifest.json` and every control, template and receipt stamp carry
the version. `README.md` and `LEXICON.md` name v4.0.0 as the current release
only at TK-002. The RUNBOOK Template Upgrade Release Gate record and the
release receipt live in this Spec's evidence. Canon prose describing the
workflow is owned by S-00P, not here.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-16 | spec | Spec authored from directive-018 at revision 57 of the WF grilling note; no implementation performed | Read-only: manifest v3.2.1, Template integration fc0fc18c at v3.2.1, ADR-000H accepted and 000F/000G/000I proposed, `next --json` returning S-00H TK-001, doctor 48 attention findings and no blocker | This Spec owns the exemptions and release proof; S-00P, S-00H, S-00I and S-00J own the capabilities | All five Specs pending; TT-Q10 and correction-019 preserved open |
| 2026-09-17 | spec | S-00H TK-001 landed (PR #98, integration 39214bc): the managed runtime set `RUNTIME_TOOLS` in `workbench/tools/workbench-layout.mjs` grew from sixteen to seventeen with `task-record.mjs`, a release-surface change the v4.0.0 stamp must carry | Separate-context review of 3dac999 PASS; full suite 42/42 | Recorded here for the version bump; no control changed | The v4.0.0 stamp (TK-002) records the managed-set growth; S-00P TK-001 also landed (PR #96) |
| 2026-09-17 | spec | S-00H TK-002, TK-005, TK-006 and TK-008 landed (PRs #102, #104, #105, #100); the managed runtime set `RUNTIME_TOOLS` now holds nineteen files (`task-packet.mjs` and `task-receipt.mjs` added to the seventeen recorded above) and `workbench/manifest.json` declares `contextUnit`, both release-surface facts for the v4.0.0 stamp; S-00P runs on live Task records; S-00H is gated on TT-Q10 for TK-003, TK-004 and TK-007, so S-00I and S-00J remain blocked | Separate-context reviews PASS on every landed tip; full suite 42/42 on each | Recorded here for the version bump and the self-drift check; RUNBOOK gained the `convert-tasks` line (PR #103) | Owner answer to TT-Q10 unblocks the rest of S-00H; fresh rooms declare no `contextUnit` (generator fix owed) |
| 2026-09-18 | spec | S-00H reached `complete` (TK-003 PR #109, TK-007 PR #113, TK-004 PR #114; integration 49c671e): release-surface facts for the v4.0.0 stamp are the CLI verb `receipt`, the finding codes `row-record-collision` and `receipt-corrupt` (selection effect), the core skill `to-tickets` renamed `to-tasks` with `legacyCoreSkills` frozen for v3.0.0 to v3.2.0 manifests and the room manifest's required list updated, the documented suite grown to 43 commands with `tools/test-controls-vocabulary-sweep.mjs`, public JSON keys `taskId` and `tasks`, and `RUNTIME_TOOLS` unchanged at nineteen; S-00I and S-00J set `active` in the same state PR | Separate-context reviews PASS on every landed tip; suites 42/42 and 43/43 on each candidate | Recorded here for the version bump and the self-drift check; RUNBOOK gained the `receipt` line and the two finding codes | Owner hand-copy of `to-tasks` into the home skill roots; the dispatcher-run `close` Receipt limitation; fresh rooms still declare no `contextUnit` |
| 2026-09-18 | spec | S-00I TK-001 (PR #116) and S-00J TK-001 (PR #118) landed; release-surface facts for the v4.0.0 stamp: `RUNTIME_TOOLS` grew to twenty with `spec-report.mjs`, the CLI gained the `report` verb, the documented suite grew to 44 commands with `tools/test-spec-report.mjs`, `adr.mjs` exports `ADR_LIFECYCLE_FOLDERS` and raises `invalid-adr` for an unresolved intra-collection link; S-00I and S-00J now run on Task records | Separate-context reviews PASS on both landed tips after one corrective pass each; suites 43/43 and 44/44 | Recorded here for the version bump and the self-drift check; RUNBOOK gained the `report` line | The Receipt row a dispatcher-run `close` writes carries the dispatcher's Git facts (S-00J TK-004 design input); ADR-000J still cites `closeTicket` |
| 2026-09-18 | spec | S-00I TK-002 (PR #122) and S-00J TK-002 (PR #120) landed; release-surface facts for the v4.0.0 stamp: the ADR collection is folder-lifecycle (top level accepted, `proposed/`, `archive/`) with the `status` key stripped from every record, `adr.mjs` gained `migrate-folders` and the attention finding `disagreeing-status`, `spec-workbench.mjs` gained the `verdict` verb and exports `appendEvidence` and `atomicWrite`; fresh rooms do not yet create `proposed/` and `archive/` and `adr normalize` still inserts a stale `status` key (S-00I TK-003 corrects it) | Separate-context reviews PASS on both landed tips after one corrective pass each; suites 44/44 | Recorded here for the version bump and the self-drift check; RUNBOOK gained the folder-lifecycle sentence, `migrate-folders` and `verdict` lines | Exact-HEAD `verdict` binding is unusable in the live workflow until S-00J TK-004 redefines it; ADR-000I itself sits under `proposed/` |
| 2026-09-18 | spec | S-00I TK-003 (PR #126) and S-00J TK-003 (PR #124) landed; release-surface facts for the v4.0.0 stamp: `spec-workbench.mjs` gained `move-spec`, `SPEC_LIFECYCLE_FOLDERS`, `scanReferences`, `loadRetiredSpecs` and the attention finding `retired-not-complete`; `adr.mjs` gained `rewriteCanonicalizedIn` and `normalize` writes no lifecycle key; `spec-report.mjs` exports `createCorrectiveTasks`; `CATALOG.md` renders a Retired heading when populated; no real Spec has moved | Separate-context reviews PASS on both landed tips after corrective passes; suites 44/44 | Recorded here for the version bump and the self-drift check; RUNBOOK gained the `move-spec` line and the corrected `normalize` sentence | The `AGENTS.md` stable-path rule still stands until S-00I TK-004; a verdict's exact-HEAD binding is being replaced by a content digest in S-00J TK-004 |
| 2026-09-18 | spec | S-00J TK-004 landed (PR #128, integration 1d521a0); release-surface facts for the v4.0.0 stamp: a review verdict binds to the assembled Spec's content digest (`specDigest`) with the Event cell `Review verdict: <result> at <sha> [<digest12>] #<n>`, `complete` refuses without a passed current verdict, `spec-workbench.mjs` gained the `gate` verb, and the RUNBOOK closeout recipe requires `SPEC_ID` and takes `TASK_ID`, running the gate before the merge; `tools/test-branch-closeout.mjs` now executes the real tools in its fixture | Separate-context reviews PASS on 302034f and the merge-plus-corrective 5624ada; suite 44/44; PR #128 was the first landing through the new recipe | Recorded here for the version bump and the self-drift check; RUNBOOK gained the recipe change, the gate lines and the verdict-timing sentence | Owner Human QA approval before closure is S-00J TK-005; the verdict prose in RUNBOOK's lifecycle section still lacks the digest and ordinal (S-00P phase two) |
| 2026-09-18 | spec | S-00I TK-004 landed (PR #130, integration 69ab33b); release-surface facts for the v4.0.0 stamp: `spec-workbench.mjs` gained `move-task`, `TASK_LIFECYCLE_FOLDERS`, `listRetiredTaskRecords`, the `retiredTasks` key on `show` and the attention finding `retired-task-not-done`; `AGENTS.md` Edit Scope and `templates/AGENTS.md` replaced the stable-path rule with the folder-lifecycle rule; `moveTaskRecord` regenerates the ADR register | Separate-context reviews PASS on 118e667 and the merge-plus-corrective 800f194; suite 44/44 | Recorded here for the version bump and the self-drift check; RUNBOOK gained the `move-task` line | The first real retirement (S-00I TK-005) and the discard gate (TK-006) are open; a control sentence changed under S-00P phase two's future rewrite, which must preserve it |
| 2026-09-18 | spec | S-00J TK-005 landed (PR #132, integration 58fb86c); release-surface facts for the v4.0.0 stamp: `spec-workbench.mjs` gained `approve`, `spec-report.mjs` exports `recordOwnerApproval` and reports `ownerApproval` and `latestOwnerApproval`, `complete` and `gate` require a current owner approval after a passed verdict, and the evidence log gains the `owner-qa` row kind (`Owner QA: approve|finding at <sha> [<digest12>] #<n>`) | Separate-context reviews PASS on bd91e29 and the merge-plus-corrective 1e36e32; suite 44/44 | Recorded here for the version bump and the self-drift check; RUNBOOK gained the `approve` line and sentence | The first real retirement (S-00I TK-005) must adopt the approval requirement at merge; TK-006's skill language and S-00P phase two's prose remain |
| 2026-09-18 | spec | S-00I TK-005 landed (PR #134, integration abfeaa2); release-surface facts for the v4.0.0 stamp: `spec-workbench.mjs` gained `retire-spec` and the attention finding `retired-wiki-owner-stale`, `wiki.mjs` refuses a pasted Spec evidence row as copied task state, `show` prints a retired route banner, and the room performed its first real retirement: S-00H now lives at `workbench/specs/retired/` with its Wiki owner `workbench/wiki/design-concepts/task-artifact-and-lifecycle.md` routed from `MEMORY.md` | Separate-context reviews PASS on 2694e54 and the merge-plus-corrective 4f0a2aa; suite 44/44; 255 links audited | Recorded here for the version bump and the self-drift check; RUNBOOK gained the `retire-spec` line and sentence; this Spec's own links to S-00H now name the retired route | S-00H retired under the pre-approval rule; discard (S-00I TK-006) and S-00J's retired-folder case remain |
| 2026-09-18 | spec | S-00J TK-006 landed (PR #136, integration 31c8c0e); release-surface facts for the v4.0.0 stamp: the bundled core skills `code-review`, `reviewer`, `carry` and `implement` name the assembled Spec as the reviewed unit at integration and the Task PR as the exemption-2 form, stated generically with no room-specific Spec id; all six S-00J Tasks are done and its completion waits on the retired-folder assertion in S-00I TK-006, a separate-context verdict and the owner's approval | Separate-context reviews PASS on 451fd79 and the corrective 85157e2; suite 44/44 | Recorded here for the version bump and the self-drift check; no control changed | The installed skill copies in the owner's home roots are stale for five skills (to-tasks and the four above) and doctor does not flag it |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

Spec-branch tooling (ending exemption 2) and the WF-10 coordinator are
described by the reworked Blueprint and delivered by later Specs derived from
it. TT-Q10 is answered by the owner, not by any Spec here.

## Supersession

- Supersedes: none.
- Superseded by: none.
