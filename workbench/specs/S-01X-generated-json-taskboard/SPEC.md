# S-01X - Generated JSON Taskboard

**Spec ID:** S-01X
**Status:** planned
**Priority:** 1
**Owner:** claude-lane-I
**Stance:** Builder
**Updated:** 2026-09-26
**Catalog description:** Replace the Markdown Spec summary with a generated six-lane implementation board, shared lane selection and title-first room-core sitrep.
**Blockers:** S-01W identity delivery precedes board implementation.
**Latest event:** Lane I rebuilt the S-00O planning packet on integration 1a6f6e0 and re-allocated this Spec as S-01X (the draft's S-01V identity was renumbered with S-01W); no Tasks allocated or runtime changed.
**Next gate:** After S-01W's first delivery, Lane I cuts the first bounded board Task with `next-id` and publishes the board contract for S-00V's Taskboard consumer.

> **Citation anchors.** pre=`89d4042` post=`89d4042`.

## Outcome

A generated root `TASKBOARD.json` displays implementation work in six lanes,
with both Spec and Task cards keyed by WBID. A shared calculation governs board
rendering, selection and diagnostics. A shipped room-core sitrep gives the owner
plain-language progress and attention in the requested order. The destination
has no `TASKBOARD.md` companion. This is the board capability in
[S-00O](../S-00O-workbench-v4-0-0-release/SPEC.md), separate from
[Landmark Tracker Foundation](../S-01T-landmark-tracker-foundation/SPEC.md), which
monitors evolving documentation and alignment.

## Why It Matters

The current board is a one-row-per-Spec Markdown summary. It cannot represent
the requested Task grain, review queue, Backlog or cleanup progress. The owner
settled WBID -> board -> S-00P controls -> S-00O release so the controls rewrite
can describe the actual new board once. The durable source is the
[destination audit ledger](../../wiki/grilling-destination-audit-ledger.json),
rows TRACK, E-1..E-6 including E-4A/B/C, E-10 and E-11.

## Current Verified State

At the pre anchor, `workbench/tools/spec-workbench.mjs` exports `nextWork`, which
selects records and can resume in-progress work. `render` writes `TASKBOARD.md`;
`doctor` checks its generated region; `renderHotBoard` shows hot Specs and does
not retain ordinary completed/retired cleanup cards. Root-artifact checks still
name Markdown. `workbench/tools/task-record.mjs` accepts ready, in-progress,
blocked, done and deferred, without needs-review. `tools/test-spec-workbench.mjs`
and `tools/test-spec-report.mjs` supply command, review and lifecycle fixtures.
The personal sitrep skill is not a shipped room dependency. No JSON board or
new selection/review behavior is implemented by this record.

The S-00O draft (unmerged candidate 34dfa2f) allocated this record as S-01V.
The Lane I rebuild on integration 1a6f6e0 re-ran supported `next-id` after
S-01W was in the tree, which returned S-01X; this record retains S-01X until
supported touch migration applies. Empty `tasks/.gitkeep` makes the Spec record-backed
with no allocated implementation slices, matching the current parser rather
than creating speculative Task IDs. Task IDs come from `next-id` on the current integration tip; no lease holds.

## Desired Behavior

1. Root and generic starting board use schema-v1 JSON with exactly six lane
   keys: `backlog`, `toDo`, `inProgress`, `blocked`, `needsReview`, `complete`.
   Lane objects key cards by WBID; no `kind` field or Markdown companion.
2. Every card value needed for continuation regenerates from a non-generated
   owner or an explicit derivation. Cards carry readable title, assignee,
   approver, dependencies, priority, source links, progress and next action.
   Start/due dates are included when known; absent values remain unknown.
3. Specs always appear. Tasks appear at their own grain, with child progress
   on Spec cards. A Spec cannot enter Needs review or Complete until every
   child is in Needs review or Complete; review gates still apply afterward.
4. Planned Specs map to Backlog. Minimal one-sentence Backlog Specs are valid.
   New Specs have Tasks cut at activation from live Actuality; existing
   in-flight and pre-cut Tasks are preserved.
5. One lane calculation serves render, next and doctor. To-do cards with unmet
   dependencies remain visible but unoffered. `next --review` lists Needs
   review. Backlog and Needs review do not block doctor; Blocked is attention
   unless an independent registered finding carries a blocking effect.
6. Required independent QA remains visible. No new mandatory review ceremony
   applies to every Task. Integration-candidate and assembled-Spec gates remain
   governed by AGENTS and S-00J; failed Human QA remains failed with corrective
   action rather than resetting on green source checks.
7. Complete records stay visible until capture and deletion: live complete
   records are ready to capture; retired records are ready to delete; deleted
   records drop. Cleanup substates derive from record/folder, never board flags.
8. Room-core sitrep reads JSON and leads with owner review, owner-unblockable
   work, in progress and to do, each priority ordered, titles before IDs. It
   reports Complete as the two derived counts.

## Decisions And Contracts


- Ledger TRACK and E-1: owner redirected the old one-row-per-Spec Markdown dashboard to an Agile six-lane JSON board. TRACK locked status is an agent reading of the redirect, not a literal option-A answer.
- E-1 correction-002 records generated output, no Markdown view and complete-hold as already settled. E-1 notes later decision-023 explicitly adds reproducibility.
- Tracked ledger E-1 records the later decision-023 reproducibility correction: agents do not author card data; correct source or generator and regenerate; nothing necessary lives only in a card. This supersedes the earlier persistent-marker proposal. Git-tracked generated JSON persists on disk but is not marker authority. The Worker consulted local origin material only for recovery; it is neither durable evidence nor authority. Preserve the earlier proposal as historical correction lineage.
- E-3 rejected conditional inclusion of Specs: Specs always get cards. Spec cannot enter Needs review/Complete until every child is in Needs review/Complete. Child progress is aggregated, not duplicated work.
- E-4A allows one-sentence Backlog Specs; no BL record type. E-4B maps planned to Backlog and cuts Tasks at activation for new Specs only; correction-006 preserves in-flight/pre-cut Tasks.
- E-4C names an independent QA stage and permits direct Complete when independent review is unnecessary. Do not revive a mandatory separate reviewer per Task: current AGENTS integration gate applies to immutable integration candidates and assembled Spec review; later SCR context must govern per-Task defaults. Work awaiting required review remains visible; Human QA failure must remain visible with corrective action, never reset to awaiting approval by a green suite.
- E-5 shared calculation serves render, next and doctor. To-do cards with unsatisfied dependencies remain visible but unoffered. `next --review` lists Needs review. Backlog/Needs review do not block doctor; Blocked is attention unless another registered diagnostic independently blocks it.
- E-10 sitrep is room core, title-first: owner's review, owner-unblockable work, in progress, to do; each priority ordered. E-11 Complete counts are derived: complete live record = ready to capture; retired record = captured/ready to delete; deletion drops card. No board cleanup flag.
- E-6 decision-011 first proposed WBID last/full re-pad; decision-013 narrowed touch-and-update; decision-017 fixes WBID first. Preserve all three as supersession lineage; never mass-repad historical IDs.

Durable source: `workbench/wiki/grilling-destination-audit-ledger.json` rows TRACK, E-1..E-6 (including E-4A/B/C), E-10/E-11. Local recovery material helped recover context only. The current Director assignment authorizes packet authorship; recovery material grants no authority.


The generated-versus-persistent correction is settled: tracked JSON persists on
disk, but card edits are never authoritative. Stale card/correct source means
regenerate; wrong source means correct its owner; wrong renderer means fix the
generator. The earlier persistent-marker interpretation is historical recovery,
not a current requirement or a second state store.

Implementation depends on
[S-01W](../S-01W-uppercase-width-four-workbench-artifact-ids/SPEC.md).
Direct Blueprint Task representation integrates the separately authorized
home/ownership capability once delivered; this Spec invents no direct-Task
folder or parent contract. Existing orphan corrective Tasks remain supported.
Shared controls and broad skill workflow rewrites are coordinated with S-00P.
Use the user's live Sol/Luna/Astra allocation directions when dispatching work;
this packet changes no model settings and imports no historical model mandate.

## Non-Goals

Landmark Tracker implementation; new Director stance or coordinator; WBID
allocator implementation; mass ID/status migration; record deletion before
reconciliation; main promotion; personal-catalog dependency; new Task allocation
in this authoring run; a permanent dual-board state or Markdown companion.

## Dependencies And Blockers

S-01W precedes implementation. Lane I serializes shared
`spec-workbench.mjs` mutations with the S-00I/S-00J lanes before Task cutting. Direct Blueprint Task coverage awaits
its separately owned home/ownership contract; it must be linked before claiming
complete Task coverage. S-00I/S-00J own lifecycle and QA operations. S-00P owns
the comprehensive controls rewrite after this capability; S-00O owns release
version stamping, installed Template proof and whole-workflow readiness.

## Vertical Implementation Slices

These are unallocated proposals, not executable Tasks. The Dispatcher cuts
records only from live Actuality after lane release.

1. **First vertical slice: public JSON render fixture.** Add a bounded fixture
   around the existing public render command that writes schema-v1 JSON from
   existing Spec/Task records and validates reproducibility. Preserve the room's
   root Markdown contract during this temporary migration phase. Proposed paths:
   `workbench/tools/taskboard.mjs` (new pure calculation/validation module),
   `workbench/tools/spec-workbench.mjs`, `tools/test-spec-workbench.mjs`.
   The implementation Task must name its temporary opt-in public render boundary
   before dispatch; no command/API is claimed to exist here. Red: invocation
   cannot produce six-lane JSON with unique identities, readable source titles,
   both card grains and live/retired completion distinctions. Green: that public
   fixture produces deterministic JSON; changing source then rendering changes
   the card; editing output then rendering restores source-derived values;
   invalid source leaves prior output intact. Existing default render behavior
   remains verified until the coordinated root switch. This fits one context
   and yields a command demo, not merely an internal helper test.
2. **Shared lane and selection slice.** Integrate the calculation with next,
   claim and doctor; add source needs-review vocabulary, review selection,
   dependency visibility, minimal Backlog validation and child gates. Paths:
   `workbench/tools/taskboard.mjs`, `workbench/tools/spec-workbench.mjs`,
   `workbench/tools/task-record.mjs`, `workbench/tools/spec-report.mjs`,
   `tools/test-spec-workbench.mjs`, `tools/test-spec-report.mjs`,
   `templates/SPEC.md`, `templates/TASK.md`. Red covers current in-progress
   selection versus To-do-only contract and review bypass; green preserves
   historical status readers without broad record rewrites.
3. **Coordinated root and installed consumer switch.** Replace root
   `TASKBOARD.md` with `TASKBOARD.json` and `templates/TASKBOARD.md` with
   `templates/TASKBOARD.json`. Paths include `workbench/tools/workbench-layout.mjs`,
   `workbench/tools/template-placeholders.mjs`, `tools/control-fidelity.mjs`,
   `tools/genesis-from-decisions.mjs`, `tools/cross-provider-resume.mjs`,
   `tools/evaluate-workbench.mjs`, `tools/audit-guardrails.mjs`,
   `tools/team-coordination-contract.mjs`, `workbench/tools/adr.mjs`,
   `workbench/tools/self-drift.mjs`, and their direct named tests. Cut the exact
   consumer/test inventory before dispatch. Red generation/adoption/update
   fixtures still require Markdown; green installed rooms use JSON and preserve
   room-owned state. Keep historical references explicit, not blindly replaced.
4. **Room-core sitrep slice.** Create `workbench/skills/sitrep/SKILL.md`, update
   `workbench/manifest.json` required bundle and managed receipts/adapters through
   supported installer operations; verify `tools/test-skill-catalog.mjs`,
   `tools/test-skills-lane.mjs`, `tools/test-core-composition.mjs`. Red: absent
   shipped skill or ID-first/unordered report; green: requested title-first
   attention order and Complete counts without personal catalog. Preserve prior
   stamped bundle policy; S-00O owns the new version stamp.
5. **Lifecycle, direct-Task and QA integration.** Extend command fixtures in
   `tools/test-spec-workbench.mjs` and `tools/test-spec-report.mjs` for live
   complete -> retired -> deleted counts, failed Human QA corrective work,
   orphan corrective Tasks and the delivered direct-Task reader. Use existing
   lifecycle commands; do not invent duplicate transitions.
6. **Documentation and assembled proof.** Amend proposed ADR-000E and active
   ADR-0013 for board semantics; correct proposed ADR-000B root list without
   accepting it. Coordinate ADR-000H direct-Task amendment with its owner.
   Exact existing ADR paths are linked by the ledger. S-00P owns broad root and
   generic control rewrites and to-spec/to-tasks workflow changes. Finish full
   checks, demo, self-drift and immutable integration review.

## Acceptance Criteria

- [ ] Six JSON lanes, WBID uniqueness and resolving source links are verified;
      all Specs and relevant Tasks appear; no root Markdown companion remains.
- [ ] All continuation data is reproducible; invalid sources cannot partially
      overwrite the board or silently discard colliding identities.
- [ ] Shared lane calculation controls render/next/doctor, dependency filtering,
      review selection, minimal/planned Backlog and child review gates.
- [ ] Required QA and failed Human QA remain visible with corrective action;
      no per-Task review ceremony is manufactured.
- [ ] Live complete/retired/deleted cleanup cards and two counts are verified.
- [ ] Direct Blueprint Tasks and orphan corrective Tasks use their delivered
      source readers; no unsupported home or runtime availability is claimed.
- [ ] Shipped sitrep works without personal catalog and reports readable titles,
      progress, attention order and the two Complete counts.
- [ ] Generation/adoption/update consumers and generic templates use JSON while
      preserving room-owned state and explicitly historical references.
- [ ] Full checks, guardrail/self-drift pre/post, under-one-minute demo, immutable
      integration review and applicable owner Human QA are recorded.

## Testing Seams

Public render, next, claim, doctor, review, move/discard and installed update
operations in disposable rooms. Initial opt-in JSON fixture seam is specified
by the first Task before implementation; future flags are not invented here.
Use source regeneration, WBID collisions, child-gate, dependency, source-link,
cleanup lifecycle and failed-Human-QA examples. A green structural render alone
cannot establish accurate state, acceptance or room-level outcome improvement.

## Verification Procedure

For implementation: prove red at the selected command seam, implement the
smallest green change, run targeted tests then the full AGENTS suite. Capture
required guardrail baseline/after-score and self-drift pre/post alongside bounded
manual semantic checks. Demonstrate public JSON render/read/doctor in under one
minute. Obtain separate-context review of the immutable candidate before merge;
prove remote integration containment. Owner Human QA and release readiness are
separate gates, not conclusions from tests.

For this planning authoring: `render`, `show S-01X`, and `doctor` verify parser
and navigation only. Dispatcher records combined candidate checks and handles
shared projections. No absent runtime behavior tests are asserted green.

## Documentation Impact

This planned capability record owns its requirements and unallocated proposals.
ADR-000E/0013 carry board decisions; proposed ADR-000B root-list correction stays
proposed. S-00P coordinates root AGENTS/RUNBOOK/LEXICON/README and generic mirrors,
with to-spec/to-tasks workflow rules. Manifest and managed skill bytes change
only during assigned delivery. No root switch, version bump or runtime change
occurs during this planning authoring.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-26 | none | Director released supported bootstrap S-01X after S-01W render/doctor; Worker authored planned record with empty record-backed tasks directory. | Source baseline 89d4042 clean detached; read-only doctor passed with seven attention findings. Ledger E rows and latest decision-023 origin checked. Authored record render/show/doctor pending. | Accepted generated/reproducible correction and earlier persistent-marker lineage preserved; no Task IDs allocated. | Runtime, delivery Tasks, review, Human QA and release proof remain pending. |
| 2026-09-26 | none | Planned S-01X self-check after authoring, no runtime changes. | Public render succeeded (97 Specs); show S-01X resolved this record; doctor passed with zero blockers and the same seven attention findings. | Source-linked planning owner and empty tasks/.gitkeep checked; Dispatcher owns combined projections and candidate proof. | Implementation and full candidate verification remain pending. |
| 2026-09-26 | none | Lane I (claude-lane-I) rebuilt unmerged S-00O planning candidate 34dfa2f onto integration 1a6f6e0: PR #161 had taken S-01U, so supported `next-id` re-allocated the identity Spec as S-01W and then the board Spec as S-01X; every reference in S-00O, S-01W, S-01X and the direct-Task proposal was renumbered and the stale Task-ID lease wording removed (no lease holds). | `next-id --prefix S` returned S-01W on clean integration 1a6f6e0 and S-01Y with both records present; render then doctor (no blocking finding) on the committed candidate and in a fresh clone of the pushed branch; the full suite, separate-context review and verdict are recorded by the landing PR's own evidence, not claimed here | This Spec, S-01W, S-00O, TASKBOARD.md, CATALOG.md | S-01W first delivery, then the first board Task and the S-00V consumer contract. S-00V's pre-existing mentions of the never-allocated draft ID S-01V (SPEC and TK-00G/TK-00K/TK-01L/TK-01M) are Lane F-owned; TK-01M assigns the re-point to the S-00V dispatcher, whose in-flight branch replaces them with S-00O pending this allocation and will re-point to S-01X |

## Completion Result

Planning capability owner authored. Runtime acceptance and delivery are pending;
no implementation or owner Human QA completion is claimed.

## Remaining Limitations Or Follow-Up Specs

Direct Blueprint Task home remains a separately owned dependency. Existing
attention findings retain their current owners. Source-wording checks establish
planning coherence, not implementation or agent outcome improvement.

## Supersession

- Supersedes: no capability Spec; later decision-023 supersedes historical
  persistent-marker interpretation while preserving its correction lineage.
- Superseded by: none.
