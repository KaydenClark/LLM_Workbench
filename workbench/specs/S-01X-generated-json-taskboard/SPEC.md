# S-01X - Generated JSON Taskboard

**Spec ID:** S-01X
**Status:** active
**Priority:** 1
**Owner:** codex-servitor-pr-resolution
**Stance:** Builder
**Updated:** 2026-09-30
**Catalog description:** Replace the Markdown Spec summary with a generated six-lane implementation board, shared lane selection and title-first room-core sitrep.
**Blockers:** S-01W first identity/consumer delivery is contained in integration; its claimed assembled QA remains separate. Direct-Task coverage awaits its source-home contract.
**Latest event:** TK-003S closed with proof.
**Next gate:** Confirm acceptance criteria and completion result.

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
supported touch migration applies. At that planning anchor, empty `tasks/.gitkeep`
made the Spec record-backed with no allocated implementation slices. TK-003O
now owns the first opt-in preview from integration
`2c47d96239dd48f17969e4d5fa8f668850c2ecfe`; later slices remain proposals.
Task IDs come from `next-id` on the current integration tip; no lease holds.

Stage 1, including TK-003P's normalized-field correction, is independently
reviewed and contained through PR228 at integration
`2780fe66754abf69b2ab6dea23337a7be0f6d801`. TK-003Q now owns stage 2A:
source-qualified shared lane/eligibility, ordinary To-do-only dispatch and
dependency visibility. The opt-in preview and default Markdown remain separate
render boundaries. Source needs-review/review mode, minimal Backlog validation
and the later rollout remain unfinished; no whole-Spec criterion is checked.
PR229 exact ac0d5669c8dd8e661153e472844e9d130e756082 independently failed with
one P2: malformed Task priority or legacy table status aborts Git-backed
doctor JSON. TK-003R owns that diagnostic correction; the final reviewer
otherwise passed full51, focused23, demo and append-only history.


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

TK-003O owns the first proposal below; TK-003Q delivered the bounded stage-2A
implementation checkpoint and TK-003R corrects its independent diagnostic P2.
The remaining proposals are not executable Tasks; records are cut only from
live Actuality after lane release.

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

TK-003O implements only the temporary public `render --format json` preview,
writing `TASKBOARD.preview.json`. The pure calculator consumes the existing
parsed live/retired owners, derives six lanes and child progress, orders cards
by priority/title/WBID and refuses ambiguous flat keys. Existing numeric Task
source scope remains valid; a flat collision names both sources rather than
renaming or dropping a record. Metadata is read from normalized source fields or an
explicit status/folder derivation; unknown dates, assignees and approvers stay
unknown. The runtime registry includes the helper so installed Markdown
commands still resolve their imports. This is packaging, not the root switch.

`node tools/test-taskboard-json.mjs --demo` demonstrates all lanes through the
public command in a disposable room. The focused suite also checks source
regeneration, edited-output restoration, invalid-source no-write refusal,
symlink/hardlink output refusal and default Markdown/CATALOG byte parity.
All acceptance boxes stay open: Task review vocabulary,
minimal Backlog readers, required-QA presentation, direct/orphan Task coverage,
sitrep, installed JSON consumer/root switch and assembled review remain later
delivery. The preview does not claim those gates from structural green tests.

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
| 2026-09-26 | none | Director released supported bootstrap S-01V (draft ID, now S-01X) after S-01U (draft ID, now S-01W) render/doctor; Worker authored planned record with empty record-backed tasks directory. | Source baseline 89d4042 clean detached; read-only doctor passed with seven attention findings. Ledger E rows and latest decision-023 origin checked. Authored record render/show/doctor pending. | Accepted generated/reproducible correction and earlier persistent-marker lineage preserved; no Task IDs allocated. | Runtime, delivery Tasks, review, Human QA and release proof remain pending. |
| 2026-09-26 | none | Planned S-01X self-check after authoring, no runtime changes. | Public render succeeded (97 Specs); show S-01V (draft ID, now S-01X) resolved this record; doctor passed with zero blockers and the same seven attention findings. | Source-linked planning owner and empty tasks/.gitkeep checked; Dispatcher owns combined projections and candidate proof. | Implementation and full candidate verification remain pending. |
| 2026-09-26 | none | Lane I (claude-lane-I) rebuilt unmerged S-00O planning candidate 34dfa2f onto integration 1a6f6e0: PR #161 had taken S-01U, so supported `next-id` re-allocated the identity Spec as S-01W and then the board Spec as S-01X; every reference in S-00O, S-01W, S-01X and the direct-Task proposal was renumbered and the stale Task-ID lease wording removed (no lease holds). | `next-id --prefix S` returned S-01W on clean integration 1a6f6e0 and, with both records present, the next free Spec ID after S-01X; render then doctor (no blocking finding) on the committed candidate and in a fresh clone of the pushed branch; the full suite, separate-context review and verdict are recorded by the landing PR's own evidence, not claimed here | This Spec, S-01W, S-00O, TASKBOARD.md, CATALOG.md | S-01W first delivery, then the first board Task and the S-00V consumer contract. S-00V's pre-existing mentions of the never-allocated draft ID S-01V (SPEC and TK-00G/TK-00K/TK-01L/TK-01M) are Lane F-owned; TK-01M assigns the re-point to the S-00V dispatcher, whose in-flight branch replaces them with S-00O pending this allocation and will re-point to S-01X |
| 2026-09-30 | TK-003O | First opt-in JSON Task activated | Explicit parent release from integration 2c47d96239dd48f17969e4d5fa8f668850c2ecfe; S-01W first identity/consumer delivery is in integration, while claimed TK-002R QA remains separate; native next-id and convert-tasks --activate | Fixed preview boundary render --format json; default Markdown and all later criteria remain open | JSON implementation, required checks and independent exact-candidate review pending; no root switch, identity or QA takeover |

| 2026-09-30 | TK-003O | Public preview behavior implemented; first-slice checkpoint | Corrected test-only ec18730a69d57db26bec32f7bec77201eabf10d7 produced nine expected failures with runtime unchanged; node tools/test-taskboard-json.mjs now passes nine groups and --demo shows six lanes in under one minute; full immutable-candidate checks pending | RUNBOOK render procedure, Task boundary and Spec implementation status; no template rewrite during opt-in migration | All whole-Spec criteria and owner QA remain open; independent exact-head Task review pending |
| 2026-09-30 | TK-003O | Task closed | Exact implementation e7bd9789c15e59c8bfa4c8c84aa04e165626f67d: all 51 required local commands PASS (48 AGENTS plus three RUNBOOK); nine public JSON regression groups PASS; node tools/test-taskboard-json.mjs --demo under one minute. Red ec18730a69d57db26bec32f7bec77201eabf10d7 had nine expected preview failures with runtime unchanged. Self-drift pre/post retained seven existing findings (inspection pre also detached); guardrails unchanged 78/100 with four recommendations; no clean-update or owner QA claim. | RUNBOOK render procedure, S01X source boundary and TK003O implementation/proof; templates unchanged for temporary opt-in preview. | Independent exact-head Task PR review pending; whole-Spec criteria remain unchecked. Shared selection/review vocabulary, flat legacy-ID reconciliation before root switch, direct/orphan Task coverage, sitrep and canonical root/template rollout remain later slices. S01W claimed QA remains separate. |
| 2026-09-30 | review | Review verdict: fail at 7a1746843200ca14243ff6337ce2345103f6eac3 [723a1035108c] #1 | P2: TK-003O preview field guard disagrees with the whole-document normalized source parser: a body duplicate Status or whitespace-normalized Status key is accepted at 7a1746843200ca14243ff6337ce2345103f6eac3 and overwrites existing JSON while moving active Spec with done children into Complete. Align preview validation with actual key/value normalization and preserve output on refusal. | Independent PR228 exact-head reviewer in a separate context (reported by source coordinator), model and mode identity unrecorded | 1 |

| 2026-09-30 | TK-003P | Normalized-field preview correction implemented | Independent FAIL1 at exact 7a1746843200ca14243ff6337ce2345103f6eac3 preserved; both public reproducers returned 0 and replaced bytes with incorrect Complete. Test-only d249f5797d4b801bfee3dd065b9a267f88c24186 had four new failures with runtime unchanged; focused suite now passes 13 groups and demo; immutable full51 pending | Preview duplicate validation matches whole-document source extraction and key/value trim, with unchanged default parsers; RUNBOOK preview procedure | Fresh independent exact-head review and all broader S01X criteria remain open |
| 2026-09-30 | TK-003P | Task closed | Exact correction 82bd5b3847a816ee6a6ed731aee64b9af3d70439: all 51 required local commands PASS (48 AGENTS plus three RUNBOOK), 13 public JSON regression groups PASS and under-minute demo. Both original exact7a reproducers now refuse with prior JSON bytes preserved and no incorrect Complete. Red d249f5797d4b801bfee3dd065b9a267f88c24186 had four new failures with runtime unchanged from reviewed7a. Default source parsers and render seam unchanged. Actual append-only history CLEAN, FAIL1 and TK003O receipt preserved. Self-drift retains seven prior findings, guardrails unchanged 78/100 with four recommendations, no clean-update or owner QA claim. | RUNBOOK preview normalized-field refusal procedure, S01X correction state and TK003P boundary/proof; TK003O failure link, prior proof/receipt unchanged. | Fresh independent exact-head Task PR review required before integration. All nine S01X acceptance criteria and owner QA remain open. Canonical legacy flat-ID reconciliation, shared selection/review vocabulary, direct/orphan Tasks, sitrep and root/template rollout remain later slices. S01W QA remains separate. |
| 2026-09-30 | TK-003Q | Stage 2A shared eligibility assigned | Native identity/remote claim checks at integration 2780fe66754abf69b2ab6dea23337a7be0f6d801; prior PR228 exact195 reviewed and contained; S01W claimed QA remains separate | Own pure lane module and selection/claim/dependency sections plus matching tests; default Markdown and later stage-2 obligations retained | Public red/green, full checks and independent exact-head review pending |
| 2026-09-30 | TK-003Q | Shared To-do calculation implemented; immutable checks pending | Red test-only 43e15bd698f22f359919106746db23031d1d46c4 had six expected behavior failures with runtime unchanged; focused public preview/next/claim/doctor, capability and remote-claim controls pass 23 groups; public demo shows eligible To-do offer and named dependency wait | Source-qualified lane/eligibility and priority/title/WBID ordering shared; default Markdown, selectors, capability routing, remote claims and flat collision refusal retained; installed diagnostics and cold recovery assertions reconciled | Full51 immutable gate and independent exact-head Task review pending; later stage-2 review vocabulary/Backlog and whole-Spec criteria remain open |
| 2026-09-30 | TK-003Q | First aggregate regression receipts retained | Immutable fc50c1c5dbe7ae4f4976d6980ddee4f326696e53: 46/48 AGENTS commands passed; spec-workbench stopped at converted-room legacy ID-order assertion and diagnostics retained a later-ready dependency silence assertion. Public 23/23 and installed round-trip passed | Matching source/show conversion and per-Task doctor assertions reconciled to authoritative Task-title ordering and visible To-do dependency waits; runtime unchanged | Corrected immutable aggregate checks and independent exact-head Task review pending; no approval or acceptance claim |
| 2026-09-30 | TK-003Q | Task closed | Exact implementation b06f3e47cbfa42ad690832097555e58f1cd1ef39: all51 local required commands PASS (48 AGENTS plus3 RUNBOOK), 23 public preview/next/claim/doctor regression groups PASS and under-minute demo. Red43e15bd698f22f359919106746db23031d1d46c4 had six expected behavior failures with runtime unchanged. Source-qualified To-do-only eligibility, Task priority/title/WBID order, visible dependency waits, cleared continuation action, capability and competing-claim gates, scoped numeric IDs and canonical no-write collision refusal verified. Installed cold source/show recovery, actual append-only history CLEAN; earlier fc50 46/48 receipts retained. Prior Tasks/FAIL1/S00I bound proof preserved; guardrails78/100 four recommendations and seven prior drift findings remain, no clean-update or owner-QA claim. | S01X stage2A verified state and owning Task boundary updated; matching installed diagnostics/round-trip expectations reconciled. RUNBOOK, templates and root Markdown contract untouched. | Fresh independent exact-head Task review required before integration. Source needs-review/review mode, minimal Backlog validation, complete stage2 child/review gates, direct/orphan home, sitrep and canonical root/template rollout remain later work. All nine Spec criteria and owner Human QA remain open; S01W QA ownership separate. |
| 2026-09-30 | review | Review verdict: fail at ac0d5669c8dd8e661153e472844e9d130e756082 [2fb42aaa3bd5] #2 | P2: At exact ac0d5669c8dd8e661153e472844e9d130e756082, doctor --json in a normal Git room with resolvable integration loses all registered findings and emits plain stderr when the informational integration selector encounters malformed Task Priority or invalid legacy table Task status (typo). The new shared entry validation escapes integrationBranchFindings through selectCandidate. Preserve invalid-state and unrelated findings with narrow expected-source validation handling while keeping unexpected errors visible and next/claim/preview rejection gates unchanged. Independent reviewer full51, focused23, demo and append-only checks otherwise passed and producer external immutable reproduction corroborates the priority outage. Retired-owner corrective dependency visibility is an existing base limitation outside this correction. | Independent PR229 exact-head reviewer in a separate context (final report relayed by source coordinator); model and mode identity unrecorded | 1 |
| 2026-09-30 | TK-003R | Diagnostic correction implemented; immutable checks pending | Test-only ab89847906716037dad84e89b495eb53d946502b retained nine expected Git-backed JSON failures with runtime unchanged from failed ac0d; focused35 now pass, including malformed priority/status, unrelated findings, inactive isolation and unexpected fault propagation | Reuse named active invalid-state findings for informational integration selection; expected source errors carry a narrow code, while unrelated calculation faults propagate. Default Markdown and selection rejection gates retained | Full51 immutable proof and fresh independent exact-head review pending; both FAIL rows preserved, all nine whole-Spec criteria and owner QA open |
| 2026-09-30 | TK-003R | Task closed | Exact correction 89fe6e1cca5af8a62ce236dfa27b944d92dbafd0: all51 required local commands PASS (48 AGENTS plus3 RUNBOOK), public35/35 and diagnostics36/36 PASS, under-minute demo, actual append-only history CLEAN and default Markdown/CATALOG render byte-idempotence. Durable test-only ab89847906716037dad84e89b495eb53d946502b had nine expected Git doctor failures with runtime unchanged from failed ac0d. Git-backed malformed ready/in-progress Task Priority (invalid, negative, fractional, nonfinite) and legacy table typo status now retain registered invalid-state plus unrelated findings. Source/output/ref no-write, inactive-record isolation, complete-on-integration diagnostics, unexpected-fault propagation, ordinary next/claim/preview refusal and original priority reproducer recovery verified. Native FAIL1/FAIL2, prior closed Tasks/receipts and S00I bound digest preserved. Same seven prior drift findings and guardrails78/100 four recommendations remain, no clean-update or owner/CI claim. | Owning S01X diagnostic correction state and new TK003R boundary/proof updated. Typed expected source errors and diagnostic composition only; durable public regressions. Default Markdown, RUNBOOK, templates, lifecycle vocabulary, capability/remote claims and S01W QA ownership unchanged. | Fresh independent exact-head TK003R correction review before integration. Existing retired-owner corrective dependency diagnostic gap remains a base limitation outside this repair. All nine whole-S01X criteria and owner Human QA open; later stage2 review vocabulary/Backlog, direct/orphan home, sitrep and root/template rollout remain separate work. |
| 2026-09-30 | review | Review verdict: fail at 559f785760c33dc4da50ab620cc109e5bfcb7e25 [0c9575e2055c] #3 | P2 source-qualified calculation correction: preserve valid peer complete-on-integration diagnostics when another active Spec has malformed Priority or table status, and refuse a Task declaring another existing parent Spec consistently in preview, next and claim without writes. Three committed red regressions at84d1a7a independently reproduce both review findings4149623596 and4149623602. No runtime eligibility expansion or stage2 delivery. | Codex automated separate-context review5372316366, independently reproduced at350c by Servitor | 1 |
| 2026-09-30 | TK-003S | Correct live public red-test provenance without rewriting historical FAIL3 | The earlier FAIL3 row names local scratch 84d1a7a, which was not published. Reachable public red commit 2e191c01fd5d98e6da5c3d4c3ebbc599483456d2 is titled Reproduce postmerge diagnostics and declared Task parent review findings and directly follows integration 983af08d603c852b36ae69f31823815614cd6a60. Its test file is byte-identical to the scratch source, with three reproduced failures before the correction. Live Task and projection references now name the public commit | Prior FAIL3 and historical receipts remain untouched. Source calculation still filters only known malformed active Specs and propagates unexpected errors | Full frozen verification and fresh independent correction review remain before integration |
| 2026-09-30 | TK-003S | Task closed | Exact published source 838565dc0fed6791e548e2f563985797439bff4d: all51 required commands PASS (48 AGENTS plus3 RUNBOOK), taskboard JSON39/39 and diagnostics36/36 PASS. Reachable public red2e191c01fd5d98e6da5c3d4c3ebbc599483456d2 reproduces three failures, independently confirmed. Malformed active Priority/table-status/row-record collision preserves valid peer diagnostics; declared foreign parent refuses preview/next/claim with prior bytes and refs preserved; normalized equivalent identity remains eligible; unexpected errors still propagate. Actual first-published append-only history CLEAN. Existing seven self-drift attention findings and guardrail78/100 remain; no clean-update, installed-distribution or reliability claim. | Shared calculation and parent-ownership validation, focused behavior controls, obsolete global source-shape assertion corrected, live Task and projection cite full published red2e191c01 SHA. Historical FAIL3 scratch84d1a7a citation preserved with appended truthful correction; prior Tasks, FAILs and receipts retained. | Fresh independent exact-final-head review required before integration. All nine whole-S01X acceptance criteria and owner Human QA remain open; stage2 review vocabulary/Backlog, direct/orphan Task home, sitrep and root/template rollout remain separate work. S01W assembled QA is unchanged. |

## Completion Result

Planning capability owner authored; TK-003O's scoped preview is closed with
implementation proof. Independent review of exact 7a17468 failed with a
normalized-field P2. TK-003P closed the bounded correction with immutable
local proof at 82bd5b3; separate exact195 Task review passed and PR228 is
contained at integration 2780fe6. TK-003Q closed bounded stage 2A with all51
required local checks and 23 public regression groups passing at exact
b06f3e47cbfa42ad690832097555e58f1cd1ef39. Final checkpoint ac0d566 passed local
full51, but independent PR229 review failed with the Git-backed doctor
diagnostic exception P2. TK-003R closed the bounded correction with all51 required local checks,
public35 and diagnostics36 passing at exact
89fe6e1cca5af8a62ce236dfa27b944d92dbafd0. Git-backed doctor retains registered
invalid-state and unrelated findings for malformed priority and legacy status;
unexpected calculation faults remain visible. Fresh independent exact-head
correction review remains required before integration.
Whole-capability acceptance, assembled independent review and owner Human QA
remain pending; no Spec completion is claimed.

## Remaining Limitations Or Follow-Up Specs

Direct Blueprint Task home remains a separately owned dependency. Existing
attention findings retain their current owners. Source-wording checks establish
planning coherence, not implementation or agent outcome improvement.

## Supersession

- Supersedes: no capability Spec; later decision-023 supersedes historical
  persistent-marker interpretation while preserving its correction lineage.
- Superseded by: none.
