# S-00O - Workbench v4.0.0 Release

**Spec ID:** S-00O
**Status:** blocked
**Priority:** 1
**Owner:** DISPATCHER
**Stance:** Builder
**Updated:** 2026-10-04
**Catalog description:** Reconcile the v4 build scope and delivery proof: WBID, JSON Taskboard, workflow controls, GitHub coordination, direct Blueprint Tasks and feature capture, followed by the Template upgrade gate, the Puffer Pond release proof and the owner's main-readiness acts.
**Blockers:** Release execution waits on agent-owned v4 build delivery (see Current release state — 2026-10-04): the remaining build Specs, the GitHub Coordination package (S-003P active; S-003Q to S-003V planned with no Tasks), a direct Blueprint Task owner the Director still has to allocate, the integration target binding carried into S-00J, and the release-proof Spec S-004I. Release direction is settled; the open owner decisions this record depends on are GitHub Projects (Grill Board GB-0023), claim-mechanism coexistence (GB-0025) and the release-proof decision record's verb-list correction (GB-0026). The PC test is an owner act at main readiness, never a blocker.
**Latest event:** 2026-10-04: the v3 release records S-014, S-022, S-050 and S-054 were superseded, S-052 TK-004 moved into the owner's PC test at v4 main readiness, and this Spec's remaining work was restated against live evidence.
**Next gate:** Agents deliver the remaining v4 build Specs and the S-004I release proof, then run TK-001 (build delivery and self-drift check). Owner acts come last: Human QA approvals, the PC test and main promotion in both repositories.

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
original capabilities are owned by S-00P (Canon rework), S-00H (Task artifact),
S-00I (retirement lifecycle) and S-00J (Spec QA gate). The accepted E-6 extension
adds separate WBID and JSON Taskboard build Specs before S-00P's remaining
controls work. Direct Blueprint Tasks and feature capture must also have named
delivery owners and proof before readiness; their ownership proposals below do
not silently assign another Spec.

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

1. Every build session can read the expanded v4.0.0 capability map, its
   delivery order, unresolved ownership and the scoped bootstrap exemptions.
2. The version is stamped `v4.0.0` only after the expanded build scope is
   delivered with required proof, the delivery-versus-closure mechanism is
   reconciled by its assigned owners, and the bounded Workbench
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

### Current release state — 2026-10-04

Read against integration `46ad978956a74a3ee1bda22c36eb16207dcd98fd`, the
[destination ledger](../../wiki/grilling-destination-audit-ledger.json), the
destination decision records DDR-000A to DDR-000Y in `workbench/docs/ddr/`,
the Grill Board and the owner's own messages. It replaces the 2026-09-26
blocker wording; the reconciliation entries below remain as history.

**Direction is settled.** The owner has answered over 350 questions on the
version 4 direction (more than 100 on 2026-10-03 alone) and said on
2026-10-04 that "we are working on version 4 right now". This Spec needs no
"release direction" from him. The v3 line is closed: v3.2.0 is on `main`
(owner merge PR #86, 2026-09-09) and the superseded records
[S-014](../S-014-workbench-release-candidate/SPEC.md),
[S-022](../S-022-llm-workbench-v3-1-release/SPEC.md),
[S-050](../S-050-workbench-v3-2-0-release/SPEC.md) and
[S-054](../S-054-v3-2-1-review-boundary-integrity/SPEC.md) each say why in
their own Why Retired section. `v4.0.0` is this Spec's working label for the
stamp; the owner speaks of "version 4" and has not asked for another label,
so TK-002 stamps `v4.0.0` without an owner question.

**Agent work that remains**, each with its owner:

| Item | Owner | State on integration |
|---|---|---|
| Workflow Canon controls | [S-00P](../S-00P-workflow-canon-rework/SPEC.md), codex-s00p-dispatcher | Fresh whole-Spec PASS recorded; final containment of the administrative PR head remains before its integration delivery is closed out. |
| Uppercase width-four IDs | [S-01W](../S-01W-uppercase-width-four-workbench-artifact-ids/SPEC.md), claude-lane-I | Reviewed integration delivery (PR #272, `de3d9c84`); only owner Human QA, main and `complete` remain. |
| Generated JSON Taskboard | [S-01X](../S-01X-generated-json-taskboard/SPEC.md), codex-s01x-stage2 | TK-004N closeout delta review; the GitHub composition extension waits on the S-003Q Issue graph and S-003S operational seams; direct-Task coverage waits on the direct-Task owner. |
| Retirement lifecycle and feature capture | [S-00I](../S-00I-folder-lifecycle-for-records/SPEC.md), codex-close-directory-recovery | Tasks done, including TK-01U (the `features` Wiki collection, and retirement refuses a Spec without a captured feature article) and TK-01V (the continuous closure-capture demonstration). Acceptance and completion result to confirm. Each Spec's own capture happens at its closure after main verification ([DDR-000M](../../docs/ddr/000M-working-artifacts-are-scaffolding-cleared-away-once-their-knowledge-is-kept.md)). |
| Spec QA gate | [S-00J](../S-00J-spec-qa-gate-at-integration/SPEC.md), codex-v4-verdict | Integration target binding carried in from S-054 on 2026-10-04 needs a Task; separate close and corrective-batch recovery (draft PR #257) remain its engineering work. |
| GitHub Coordination package | [S-003P](../S-003P-github-coordination-room-binding-and-identity/SPEC.md) (codex-github-binding) to [S-003V](../S-003V-github-coordination-claim-authority-cutover/SPEC.md) | S-003P active with its first binding slices closed; S-003Q to S-003V planned with no Tasks, cut in the dependency order of the table above, with the claim cutover last. The owner settled the actor policy, Issue write floor and per-item claim authority on 2026-10-02. |
| Direct Blueprint Tasks | Director: allocate the successor the [ownership proposal](direct-blueprint-task-proposal.md) names | In v4: ledger E-3 ("Not every Task has to belong to a Spec") and E-9 (home `workbench/tasks/TK-XXXX/TASK.md`), and ADR-000U lets Tasks sit directly under a landmark. No owning Spec exists and `workbench/tasks/` does not exist yet. Allocating the owner is a Director disposition, not an owner question. |
| Template Upgrade Release Gate | This Spec, TK-003 | Unchanged procedure; the five update-tool gaps recorded under TK-003 still need an owning delivery or a named limit. [S-01N](../S-01N-update-harness-skill-rebuild/SPEC.md) (update-harness skill rebuild) is planned and unassigned. |
| Release proof (Puffer Pond) | [S-004I](../S-004I-template-release-proof-puffer-pond/SPEC.md), unassigned | [DDR-000Q](../../docs/ddr/000Q-a-release-is-proven-by-the-template-building-a-real-product-in-one-pass.md) (locked 2026-10-03): the Template, updated to the release and deployed in the cloud, builds Puffer Pond from a prewritten grill-me-and-genesis script in one pass. S-004I's cloud form, script content and build landing are its own Plan items. |
| Every other v4 Spec | Each Spec's named owner | The owner's WF-12 answer is "I want every spec completed before we call this done". At this change 53 Specs are active and 49 planned (the Taskboard and `CATALOG.md` project them); TK-001 checks which are v4 scope, since anything outside v4 went to the backlog (ledger E-4A). |
| Integration target binding | S-00J (above) | Open requirement carried from S-054, not yet delivered: review evidence must name the expected integration tip and the merge path must refuse a moved tip. S-00J has no Task for it yet. |

**How the release proof relates to the Template gate and WF-11.** DDR-000Q
leaves this relationship to the release-proof Spec to state. It is stated here
as an agent reading of owner-locked sources, not a new owner answer: the
Template Upgrade Release Gate (TK-003) produces the release-updated Template,
and the S-004I Puffer Pond run on that Template is the full cycle on "another
workbench" that the WF-11 answer requires. This Spec already defaulted the
WF-11 target to the Template unless the owner named another, and DDR-000Q
names the Template. TK-004 is therefore carried out by S-004I's proof.

**Owner decisions still open that this record depends on.** Searched the
ledger, DDRs, Grill Board answers and the owner's messages; no answer exists
for these three, and all three are already on the Grill Board:

- Is GitHub Projects a mandatory v4 requirement (GB-0023)? His 2026-10-02 words
  ("Yes please on the github issues and projects") were read once as "Projects
  optional", and a separate review rejected that reading.
- May the remote-tip claim and the Issue claim coexist for different items
  during the transition (GB-0025)? He set claim authority per item of work on
  2026-10-02, but did not answer coexistence.
- Does he confirm correcting the release-proof decision record
  ([DDR-000Q](../../docs/ddr/000Q-a-release-is-proven-by-the-template-building-a-real-product-in-one-pass.md))
  so its verb list matches the open verb set and the Journey correction he
  confirmed on 2026-10-03 (GB-0026, raised by S-004G)? DDRs are
  owner-confirmed, so the S-004I proof plan reads the stale verbs until he
  answers.

The other open owner-decision items on the Grill Board (17 at this change)
belong to their own Specs and gate those Specs, not this record directly; the
board's `pending` list is their live view.

**Owner acts by Contract**, not blockers and not questions:

- Human QA approval of each delivered Spec on `integration` (the Grill Board
  carries the approve items, for example GB-0105 for S-00P and GB-0108 for
  S-01W), and of this Spec's own receipt before `complete`.
- Approve on the Puffer Pond result, the owner's only step in the DDR-000Q
  release proof.
- The Windows PC deployment test, which he runs himself once when agents judge
  `integration` ready for `main`
  ([PC test at main readiness](../../wiki/pc-test-at-main-readiness.md)). It
  includes [Private Session Transport — S-052](../S-052-private-session-transport/SPEC.md)
  TK-004, the real Mac/Windows Claude/Codex continuation. Never list it as a
  blocker.
- Promotion of `integration` to `main` in LLM_Workbench and in
  Workbench_Template.

Spec-branch tooling stays outside this rollout under exemption 2 (directive-018;
ROLE-4 preserved the exception on 2026-09-27); the branch-relationship design
card on the Grill Board (GB-0085) does not gate this release.

### Audience for v4 - 2026-10-02

The owner is the only person using the Workbench in v4. Nothing is designed
for other people or a team now; the release only has to work. The owner tied
this to the GitHub coordination capabilities below: trusted Issue operations
use the owner's own GitHub account, and no multi-user trust model is built.

### Current release planning reconciliation — 2026-09-26

Source comparison is pinned to `89d4042fb8931b9d720af75bffea1c28803d72aa`:
the [destination ledger](../../wiki/grilling-destination-audit-ledger.json)
entries E-6, E-7, E-8, E-9 and TT-Q10, and the retired
[Task Artifact Spec](../retired/S-00H-task-artifact-and-terminology-migration/SPEC.md)
including its 2026-09-17 TT-Q10 evidence. The Current Verified State above is
explicitly the older pre-anchor snapshot, not a claim about today's runtime.

- E-6's final order is **WBID -> JSON Taskboard -> S-00P TK-002..TK-005 ->
  S-00O release**. Its earlier WBID-last/full-repadding proposal is superseded.
  Both missing capability packets stay separate from S-00P and the concept
  documentation Tracker in S-01T.
- E-8 requires uppercase width-four new visible artifact IDs, dual-form lookup
  and touch-and-update with former IDs retained. E-7 forbids mass re-statusing;
  completed records are not renamed. TT-Q10 already settled the `TK` prefix;
  it does not freeze the later allocation width/alphabet.
- E-9 places small direct Blueprint Tasks at `workbench/tasks/TK-XXXX/TASK.md`,
  using the shared TK inventory and folder lifecycle. Work exceeding one
  context becomes a Spec. The dedicated artifact-model owner is proposed,
  not allocated or accepted by this planning record.
- The current assignment uses Director -> Dispatcher -> Worker. Worker
  self-checks and reports; Dispatcher performs whole-Spec QA; a separate
  Director reviews the immutable assembled candidate before integration.
  Direct Blueprint Tasks retain that full chain. This assignment supersedes
  the old model-allocation guidance and per-Task approval wording for this run.
- Reviewed integration delivery and final closure are distinct. The recovered
  SCR closure direction requires verification on main and feature capture;
  Human QA remains owner-led at useful review points. Neither the runtime's
  existing `complete` gate nor a passing source review supplies owner approval.
  S-00J/I/P must reconcile the mechanics; release planning must not create a
  cycle by requiring final closure before implementing closure's prerequisites.

This planning assignment permits no version bump, downstream update, main
promotion, unresolved ADR acceptance or integration merge. Existing release
Tasks below describe the later release execution, not current permission.
The draft allocated S-01U then S-01V; because PR #161 took S-01U first, the
Lane I rebuild on integration 1a6f6e0 re-allocated them as S-01W then S-01X
through the current supported allocator. Their existing IDs
remain until supported touch migration applies; implementation order is still
WBID before board. Task IDs come from `next-id` on the current integration tip, and
shared `spec-workbench.mjs` lanes serialize with S-00I/S-00J. The planned Specs contain
unallocated slice proposals, not selectable Tasks.

The [direct Blueprint Task ownership proposal](direct-blueprint-task-proposal.md)
defines the missing artifact capability separately from S-00I lifecycle,
S-00J QA and S-00P controls. Director disposition is required before assigning
its successor owner; no new owner is silently manufactured here.

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
WF-12 is unchanged: the complete workflow destination must be delivered before
this release is called done. E-6 expands the original five-Spec delivery list;
the current reconciliation above distinguishes delivery from post-main closure.
Only the delivery route is exempted.

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

### Integration decision and progress reconciliation

The [integration reconciliation receipt](INTEGRATION-RECONCILIATION.md) records
the 2026-09-27 source inventory, current decision owners, off-integration work
and unresolved gates. It distinguishes publishing decisions and existing
progress from approving or merging unfinished implementation. This receipt is
part of this release owner, not a second task queue.

Minimum role and stance capability owners are
[Director Role — S-002C](../S-002C-director-role/SPEC.md),
[Dispatcher Role — S-002D](../S-002D-dispatcher-role/SPEC.md),
[Worker Role — S-002E](../S-002E-worker-role/SPEC.md),
[Spec Planner Stance — S-002F](../S-002F-spec-planner-stance/SPEC.md), and
[Spec Manager Stance — S-002G](../S-002G-spec-manager-stance/SPEC.md).
Reviewer and Auditor keep S-01R and S-01Q. Their task planning waits for flight
launch; the current release bootstrap exception is retained until its named
implementation gate is satisfied. Planning does not authorize a version bump.

### Assigned capability map

| Unit | Owner | Blocks on | Endpoint |
|---|---|---|---|
| Blueprint rewrite against every rung and the full recursive loop | [S-00P](../S-00P-workflow-canon-rework/SPEC.md) TK-001 | Done; subsequent workflow corrections remain with S-00P | Reworked `BLUEPRINT.md` |
| Standalone `TASK.md`, Task vocabulary, Packet, Receipt, original Markdown projection | [S-00H](../retired/S-00H-task-artifact-and-terminology-migration/SPEC.md) | Complete and retired; TT-Q10 settled | Preserved completed evidence |
| Uppercase width-four visible IDs, dual-form lookup, touch-and-update | [Uppercase Width-Four Workbench Artifact IDs — S-01W](../S-01W-uppercase-width-four-workbench-artifact-ids/SPEC.md) | First new build capability (E-6/E-8) | Reviewed implementation and preservation proof |
| Generated six-lane `TASKBOARD.json`, shared lane derivation and consumers | [Generated JSON Taskboard — S-01X](../S-01X-generated-json-taskboard/SPEC.md) | S-01W delivery; direct-Task seam coordinated | Reproducible JSON board and consumer proof |
| Retirement lifecycle by folder, reconciliation into durable owners, verified discard | [S-00I](../S-00I-folder-lifecycle-for-records/SPEC.md) | S-00H delivered; coordinate QA/capture work | Reviewed delivery plus separately tracked main/capture closure |
| Assembled-Spec review, corrective-Task return path, owner QA and closure binding | [S-00J](../S-00J-spec-qa-gate-at-integration/SPEC.md) | S-00H delivered; coordinate lifecycle/ownership | Reviewed delivery plus separately tracked owner QA/closure |
| Direct Blueprint Task home, reader, lifecycle and role chain | Successor Spec the Director allocates from the ownership proposal (2026-10-04: still unallocated) | WBID; coordinated S-00G/J/I/P and board seams | Small direct Task demonstrated without parent Spec |
| Feature capture before transient-record cleanup | [S-00I](../S-00I-folder-lifecycle-for-records/SPEC.md) TK-01U/TK-01V (delivered on integration), coordinated with S-00J and S-00G | Main verification before each Spec's capture | Continuous capture, retirement, discard and recovery proof |
| Release proof: the Template builds Puffer Pond in one pass | [S-004I](../S-004I-template-release-proof-puffer-pond/SPEC.md) | TK-003 Template gate | DDR-000Q proof recorded, carrying TK-004's WF-11 cycle |
| AGENTS, RUNBOOK, LEXICON and `templates/` rewrite; ADR-000F, ADR-000G and ADR-000I reconciled | S-00P TK-002 onward | WBID then board; delivered S-00H/I/J mechanics; ownership coordination | Reviewed integration delivery; closure tracked separately |
| v4.0.0 stamp, Template gate, WF-11 cycle, release receipt | This Spec | Expanded map, S-00P and resolved closure mechanics | Readiness verdict, then separately authorized publication |

The original two-build-lane guidance referred to the September 16 rollout.
The current Director assignment coordinates isolated lanes and a single writer
per shared surface. Packet drafting is independent; implementation follows the
dependency order and explicit Director lane releases.

### GitHub Coordination package — owner continuation, 2026-10-01

The owner includes required GitHub Issues coordination in v4 and requests
implementation. The concept seed is contained through PR235 at integration
`282dc043ab7dad92826a6d5447369238c35df0a3`; this is concept proof only.
ADR-000Q remains proposed and ADR-000O remains operative until the separately
reviewed cutover. This package adds no version bump, owner approval or main
promotion. Existing release and Template proof gates remain open.

| Capability | Owner | Consumable prerequisites |
|---|---|---|
| GitHub Coordination Room Binding And Identity | [S-003P](../S-003P-github-coordination-room-binding-and-identity/SPEC.md) | Independent first binding slice |
| GitHub Coordination Issue Graph | [S-003Q](../S-003Q-github-coordination-issue-graph/SPEC.md) | S-003P |
| GitHub Coordination Trusted Assignments | [S-003R](../S-003R-github-coordination-trusted-assignments/SPEC.md) | S-003P, S-003Q |
| GitHub Coordination Operational Transitions | [S-003S](../S-003S-github-coordination-operational-transitions/SPEC.md) | S-003Q, S-003R |
| GitHub Coordination Shared Continuation | [S-003T](../S-003T-github-coordination-shared-continuation/SPEC.md) | S-003P, S-003Q, S-003S |
| GitHub Coordination Setup And Upgrade | [S-003U](../S-003U-github-coordination-setup-and-upgrade/SPEC.md) | S-003P |
| GitHub Coordination Claim Authority Cutover | [S-003V](../S-003V-github-coordination-claim-authority-cutover/SPEC.md) | S-003R, S-003S, S-003T, S-003U |
| Composed Taskboard and Project views | [S-01X](../S-01X-generated-json-taskboard/SPEC.md) | Issue graph + operational snapshot; Projects access/requirement unresolved |

Only the binding Spec is activated for the first read-only Task by this
continuation. Peers remain planned without Tasks. The owner decided the
trusted actor policy on 2026-10-02: the owner's own GitHub account, structured
Issue records, and only records from the room's configured account count. The
hold on assignment-dependent work is lifted; the record's fields and validation
are for S-003R to define. Projects availability and whether a Project is required remain open; no
mandatory Project policy is invented. Extended outage recovery remains
DQC-000E, with no v4 blocking edge. Basic visible failure/pending and migration
correctness remain in active capability acceptance.

S-00V's remaining remote-tip claim Tasks TK-01M/TK-01N/TK-01P retain their
historical requirements and evidence. Their successor disposition belongs to
the cutover Spec: no silent re-status, dropped claim or parallel authority.
S-00P retains shared operational controls and templates. The first inspector
adds no mandatory coordination dependency; controls are reconciled only once
their implementing seams are real.

### Preserved answers and open items

- **TT-Q10**, the form of a new Task identifier, was answered by the owner on
  2026-09-17: no change, newly allocated identifiers keep `TK-###` with `TK`
  read as the Task prefix (S-00H evidence row of that date). S-00H TK-003 and
  TK-004 are no longer gated on it. E-8 later changes width/alphabet, not `TK`.
- **correction-019**: the owner objected to the shorthand that had been used
  for the WF-1 answer. The allocation itself is locked (the Blueprint owns the
  product-level destination; each Spec is the PRD-shaped smaller destination
  derived from it), and no Spec or Blueprint in this release promotes the
  objected shorthand as a slogan.
- **WF-10**: coordination was initially Blueprint-only scope. The owner
  confirmed minimum role/stance specification on 2026-09-27 (ROLE-1..4),
  superseding that planning exclusion. The separate capability owners below
  specify it without launching flights or claiming implementation.

### Operational guidance, not design

Historical model allocation recorded with directive-018: the planning session, the
controls rewrite and every integration-gate review use Fable; build sessions
use Sonnet for Tasks with a named seam and a clear red test, and Opus for
shared-logic Tasks that change `next`, `claim`, `doctor` or the Spec QA gate;
the reviewer never uses the builder's model. This guides who is dispatched and
decides nothing about the product. For this assignment the Director instead
specifies Sol for ordinary implementation, Luna for small deterministic checks
and Astra for ambiguous contracts or consequential reviews.

## Non-Goals

- Implementing capability runtime in this release Spec. Those changes belong
  to the named capability owners, including the two E-6 additions.
- Reopening settled TT-Q10 or confirming correction-019's wording.
- Spec-branch tooling or the WF-10 coordinator.
- Reopening any locked WF question.
- Merging `integration` into `main` in either repository, or rolling the
  release into any other room.
- Repairing the 48 attention findings `doctor` reports at the pre anchor. They
  are outside the release scope; TK-001 records their state either way.

## Dependencies And Blockers

Release execution is blocked on the expanded capability map and coordinated
delivery-versus-closure repair in S-00P/I/J. Do not use their administrative
`complete` state as a substitute for verified delivered behavior, or bypass the
existing runtime gate. The legacy Task edges below remain conservative until
that shared mechanism is reconciled; this planning pass claims no release Task. The
WF-11 cycle runs on the Template updated by TK-003 (the default this Spec set,
and the workbench DDR-000Q names); since 2026-10-04 it is carried out by the
S-004I Puffer Pond proof. TK-001 waits on S-00P's reviewed integration delivery
(`S-00P:delivered`), not its final `complete`: final completion needs main
verification, and main promotion follows this release, so a plain `S-00P`
blocker would be a cycle.

## Vertical Implementation Slices

| Task | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Verify expanded build delivery and run the bounded self-drift check | ready | S-00P:delivered | Red: required capability delivery proof is missing, or current-facing records misstate remaining work; green: the expanded capability map has reviewed integration proof and the RUNBOOK self-drift check is recorded without bypassing unresolved closure mechanics |
| TK-002 | Stamp v4.0.0 and validate the stamp | blocked | TK-001 | Red: a stamp check fails while the manifest says v4.0.0 and a control stamp, template stamp or managed runtime receipt still says v3.2.1; green: every stamp names v4.0.0 and the full suite passes |
| TK-003 | Pass the Template Upgrade Release Gate against Workbench_Template | blocked | TK-002 | Red: `tools/workbench-tools.mjs verify --project TEMPLATE_ROOT` from the pinned v4.0.0 source reports a version or managed-hash mismatch before the update; green: matching versions and exact managed bytes, Template full suite, separate-context review, merge into its integration branch, remote containment and fresh-clone rerun recorded |
| TK-004 | Run one full WF-11 cycle on another workbench | blocked | TK-003 | Red: the cycle stalls at any rung; green: create or update, grilling, contract and Specs, Tasks created and executed through `next` and `claim`, Spec verified and on that workbench's integration branch for owner review, with pass or fail evidence per rung |
| TK-005 | Reconcile the release receipt and readiness verdict | blocked | TK-004 | Red: the receipt would claim readiness while any acceptance box is unchecked or an exemption lacks its named successor; green: receipt names source and Template SHAs, PRs, review verdicts, the self-drift result and what readiness does not authorize |

### TK-001 - Verify expanded build delivery and run the bounded self-drift check

**Stance:** Builder

Confirm every capability in the expanded map has named implementation proof
and reviewed immutable content contained in the declared integration branch.
Resolve ownership and delivery-versus-closure prerequisites first; do not
invent approvals, mark Specs complete or bypass existing runtime gates. Run `render` and `doctor`,
then perform the bounded manual Workbench self-drift check in `RUNBOOK.md`:
inventory controls, projections, manifest, Specs and `CATALOG.md`, active ADRs
and register, Wiki router, procedures, templates, managed tool and skill
receipts and seeded documents; reconcile every current-facing status, blocker,
event, gate, version and path against its durable owner. Red looks like a
control or projection that still presents the rollout as pending or names a
retired route; green is a recorded check with no current-facing drift. Record
the 48 pre-anchor attention findings' state without treating them as scope.
The existing closure mechanism is separately tracked: S-00P closes through
the gate S-00J installs, so under that mechanism its completion needs a
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

Known tool gaps to close or record as explicit limits before this gate runs,
surfaced by Lane C's S-01N update-harness scenario (evidence at candidate
`2bf181f`, not yet on integration): no command stamps `workbenchVersion` or
`skillPolicy` (the skill stamps them by hand); the tools rollback is partial
and drops the earlier backup entry; there is no first-install skills rollback;
`stale-seed` is unrepairable for a document the release no longer seeds; and a
pre-update tools `verify` stops at `tools-receipt-missing`. The first two bear
directly on this gate's matching-version and recovery proof. None is worked
around silently: each is closed by an owning Spec's delivery or named in the
release receipt as a known limit.

### TK-004 - Run one full WF-11 cycle on another workbench

**Stance:** Builder

Since 2026-10-04 the target is the Template updated by TK-003, and the cycle is
the [S-004I](../S-004I-template-release-proof-puffer-pond/SPEC.md) Puffer Pond
proof (DDR-000Q); this slice records that proof's result rung by rung. Do not
select a private project without a separate user request. Run the whole cycle from decision-077:
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
- [ ] The expanded capability map has named delivery owners and proof; WBID precedes JSON Taskboard, which precedes S-00P's remaining control rewrites and release execution. Direct Blueprint Tasks and feature capture are accounted for.
- [ ] Required capability implementations pass review and are contained in the declared integration branch; delivery-versus-closure mechanics are reconciled without manufacturing Human QA approval or waiving post-main capture/closure obligations.
- [ ] This Spec's own closure carries a recorded assembled-Spec verdict and an owner Human QA approval naming the `integration` SHA.
- [ ] The bounded Workbench self-drift check is recorded with no current-facing drift.
- [ ] Every version stamp names `v4.0.0` and the full suite passes on the committed candidate.
- [ ] Workbench_Template is upgraded to v4.0.0 through the public route with matching versions, exact managed bytes, its full suite, separate-context review, integration merge, remote containment and a fresh-clone rerun recorded.
- [ ] One full WF-11 cycle on another workbench is recorded rung by rung with the Spec verified and on that workbench's integration branch for owner review.
- [ ] TT-Q10 remains recorded as settled (`TK` is the Task prefix), E-8's later width/alphabet requirements retain their separate lineage, and no artifact in the release promotes the correction-019 shorthand.
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
| 2026-09-18 | spec | S-00I TK-006 landed (PR #138, integration 49ec744); release-surface facts for the v4.0.0 stamp: `spec-workbench.mjs` gained `discardRetiredSpec`, `discardRetiredTask` and the `discard S-### [--task TK-###]` verb (`git rm` of a retired record, never `archive`), refusing by name before any write for a record on the active roster or outside `retired/`, a dirty tree, a retiring commit not verified contained on the declared default branch, a live reference a complete scan still finds, or (for a Spec) a missing or inactive Wiki durable owner; a successful discard appends one row to the new tracked, append-only `workbench/specs/DISCARDS.md` register (date, kind, record ID, historical path, retiring commit, discard parent commit, recovery command) and the recovery command is exercised by the test; a discarded Spec's gap routes to a corrective Task at `workbench/specs/corrective/tasks/<TK-id>/TASK.md` with `Destination: wiki-claim: <note>#<heading>`, selectable and closable, closing it appends to the note's `provenance:`; `doctor` gains the blocking `discarded-reference` finding (error, specs, selection); `tools/check-append-only.py` now enumerates a Spec's `retired/` lifecycle folder, satisfying S-00J's third acceptance line (its retired-folder assertion is pinned at tools/test-spec-workbench.mjs:4309-4386 at e024f59) | Red at the pre anchor bd74139 in tools/test-check-append-only.py (an in-place rewrite inside a retired Spec's evidence log went undetected) and tools/test-spec-workbench.mjs (failed to load on the missing `discardRetiredSpec` export); green at e024f59 with the 44-command suite (`dirty: []`, 44/44) reproduced by a separate-context Opus reviewer on a detached worktree, `git merge-tree --write-tree dc28c32 e024f59` clean, and a separate-context review verdict PASS on gates 1-11 with no blockers | Recorded here for the version bump and the self-drift check; RUNBOOK gained the `discard` line and its describing sentence in this state PR | Discard excludes the durable Wiki owner note from its own pre-discard scan, so `doctor` reports `discarded-reference` immediately after a real discard until the note is corrected; `createOrphanCorrectiveTasks` has no duplicate-Task guard; discarding a Spec's last Task removes the emptied `tasks/`, flipping the record-backed check silently (fixture-only, no room holds a retired Task); `resolveMovingCommit` takes the first add for a path, an ordering bypass if a path is removed and re-added; S-00I completion and S-00J's third acceptance line remain for the completion pass |

| 2026-09-26 | spec | Assigned Dispatcher reconciled current release scope and TT-Q10; workers authored separate planned WBID and generated JSON Taskboard packets (draft IDs S-01U and S-01V, renumbered S-01W and S-01X by the later Lane I rebuild) and a direct Blueprint Task successor proposal. Director released serial Spec allocation; Task IDs were then leased to the S-00J lane (a lease the later Lane I rebuild retired). Release execution remains blocked. | Source comparison at 89d4042; supported next-id proposed S-01U then S-01V (draft IDs) after write/render/doctor; render 97 Specs and doctor no blockers with seven existing attention findings. Citation-anchor checks 3/3 and append-only regression cases pass. Runtime red/green not performed; full candidate suite recorded separately by Dispatcher. Guardrail pre 78/100; self-drift pre cleanUpdate false due stale S-00Q claim, with six historical provenance/seed limitations. | S-00O planning, S-01W, S-01X and linked direct-Task proposal; shared projections regenerated locally for verification but reserved to Director integration composition. Generic mirror exempt: this is room-specific release/capability planning, with no harness runtime/control change. | Initial Task allocation, shared implementation lanes, direct-Task owner disposition, S-00P/J/I dependency reconciliation, implementation proof and all release gates remain open. |
| 2026-09-26 | spec | Lane I (claude-lane-I) rebuilt unmerged S-00O planning candidate 34dfa2f onto integration 1a6f6e0: PR #161 had taken S-01U, so supported `next-id` re-allocated the identity Spec as S-01W and then the board Spec as S-01X; every reference in S-00O, S-01W, S-01X and the direct-Task proposal was renumbered and the stale Task-ID lease wording removed (no lease holds). | `next-id --prefix S` returned S-01W on clean integration 1a6f6e0 and, with both records present, the next free Spec ID after S-01X; render then doctor (no blocking finding) on the committed candidate and in a fresh clone of the pushed branch; the full suite, separate-context review and verdict are recorded by the landing PR's own evidence, not claimed here | This Spec, S-01W, S-01X, TASKBOARD.md, CATALOG.md | Identity then board delivery; release execution after S-00P completes |
| 2026-09-26 | review | Review verdict: pass at aa4f0aa66b203e3d0a69751213f2f433db404148 [33efbfb68d3b] #1 | none. Earlier builds 6eac6cb, 78b94e5 and a6a511c failed review on evidence wording (S-00V draft-ID references since repointed by Lane F PR #173, an unverifiable PR claim, an untimed lease claim, and a phantom next-id reservation); each was corrected and aa4f0aa passed a delta review against the fully reviewed a6a511c. Full AGENTS suite 48/48 at aa4f0aa (read-only runner, dirty []); fresh-clone doctor no blocking finding with render idempotent. Reviewer ran doctor; did not rerun render or the suite (read-only sandbox). | codex exec gpt-5.5, read-only sandbox, separate context from the Lane I dispatcher | 4 |
| 2026-09-26 | TK-003 | Lane I recorded five update-tool gaps from Lane C's S-01N update-harness scenario (candidate 2bf181f) as TK-003 prerequisites or known limits: no version/skill-policy stamp command, partial tools rollback dropping the earlier backup entry, no first-install skills rollback, an unrepairable stale-seed for an unseeded document, and pre-update tools verify stopping at tools-receipt-missing. | Read the S-01N evidence row at 2bf181f; no tool run by Lane I | This Spec (TK-003 section) | Each gap needs an owning delivery or a named known limit in the release receipt before TK-003 runs |

| 2026-09-27 | none | Owner-confirmed integration reconciliation and minimum role groundwork | ROLE-1..4 confirmed; source inventory and scope dispositions in INTEGRATION-RECONCILIATION.md; new capability Specs contain no Tasks | Controls, generic mirrors, role model, capability owners and tracked progress | Runtime delivery, open owner choices, bootstrap exception, baseline self-drift and Human QA remain explicit; no clean-update or release-readiness claim |

| 2026-09-27 | none | Verify role groundwork and decision reconciliation candidate b010449977348922159ef984ffe4d66a02f66e7c | All 48 AGENTS commands passed with clean unchanged HEAD; independent full-candidate review PASS; post self-drift retains seven baseline findings and guardrail78 | INTEGRATION-RECONCILIATION.md records method, source pins and limitations; evidence rows placed under Evidence Log | No runtime delivery, exhaustive historical assessment, clean-update or Human QA approval claim; final evidence candidate review and landing PR establish integration delivery |

| 2026-10-02 | none | Owner decisions recorded: single-owner v4 audience; GitHub trusted actor policy, write floor and per-item claim authority carried into the GitHub coordination capability Specs and the proposed decision record | Promotion only; no runtime proof claimed | This Spec, the GitHub coordination Specs named, the proposed GitHub coordination decision record and the GitHub Coordination Wiki article | Structured-record fields and validation undefined; coexistence of both claim mechanisms for different items undecided; the Projects requirement is still open |
| 2026-10-04 | spec | Remaining v4 release work restated against live evidence; v3 release records superseded | Read at integration 46ad978: ledger (E-3, E-4A, E-9, WF-11, WF-12, CAND-N, FND-Q16), DDR-000M/000P/000Q, Grill Board items and answers, dependency Spec headers and Task states, owner messages of 2026-09-23 and 2026-10-04; render and doctor on the committed candidate | Header, new Current release state section, capability map rows, Dependencies, TK-001 blocker (`S-00P:delivered`) and TK-004 target reconciled; S-014, S-022, S-050 and S-054 superseded; S-052 TK-004 moved into the owner PC test | Build delivery, the direct-Task owner allocation, S-004I, the Template gate and owner acts remain; open owner decisions GB-0023 and GB-0025 |
| 2026-10-04 | spec | Workbench self-drift pre/post for the v3 release retirement | `self-drift.mjs --phase pre` at integration 46ad978 and `--phase post` at candidate 42353d9 report the same seven baseline findings (one stale-claim, five stale-seed, one unverified-provenance; machineResult blocked, cleanUpdate false); the hot board no longer projects S-014, S-022 or S-050, and S-052 no longer shows a blocker | Bounded manual check found current-facing drift outside this change's writers: RUNBOOK Composed round trip section still calls the real cross-provider resume S-022's release gate (RUNBOOK is held by the S-004C lane); S-00N disposition rows and S-00Q TK-0Q8 still route S-050 TK-006 and S-014/S-022 disposition as open; ledger BPR-7/7A/7B1 dated readings still say S-050 is open | Not a clean update: the drift named here belongs to its owners' writers |
| 2026-10-04 | spec | Review correction: open owner decisions now include the release-proof verb-list correction (GB-0026) | Separate-context review of f0f9169 (Codex gpt-5.5, read-only) FAIL, one Medium: the current-state section named only GB-0023 and GB-0025 while GB-0026 is open and release-proof related; Grill Board read at the candidate shows 20 open owner-decision items | Header Blockers and the Current release state owner-decision list name GB-0023, GB-0025 and GB-0026 and scope the other 17 to their own Specs | Fresh separate-context review of the corrected candidate |
| 2026-10-04 | spec | Review correction: the integration target binding row reads as an open requirement, not delivered behavior | Separate-context review of 2cf10bf (Codex gpt-5.5, read-only) FAIL, one Medium: the S-00O row stated the S-054 binding as present while S-054 and S-00J record it undelivered; all other checks passed | The Current release state row now says the requirement is open in S-00J with no Task | Fresh separate-context review of the corrected candidate |

## Completion Result

Release pending. The remaining agent work, open owner decisions and owner acts
are listed under Current release state — 2026-10-04. This is not a version
stamp or readiness verdict.

## Remaining Limitations Or Follow-Up Specs

Spec-branch tooling (ending exemption 2) and the WF-10 coordinator are
described by the reworked Blueprint and delivered by later Specs derived from
it. TT-Q10 was answered by the owner on 2026-09-17; the E-8 allocator work
remains a separate delivery gap.

## Supersession

- Supersedes: none.
- Superseded by: none.
