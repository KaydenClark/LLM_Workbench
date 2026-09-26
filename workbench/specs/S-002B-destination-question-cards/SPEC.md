# S-002B - Destination Question Cards

**Spec ID:** S-002B
**Status:** active
**Priority:** 1
**Owner:** DQC dispatcher
**Stance:** Builder
**Updated:** 2026-09-26
**Catalog description:** Preserve evolving concept understanding, source lineage, Expected result and achieved Result through public safe record operations.
**Blockers:** none
**Latest event:** Director approved narrow Result write/read residual; inherited DQC behavior verified at current remote integration.
**Next gate:** Author serially reserved Result Task and dispatch one Sol worker; dispatcher performs whole-Spec QA and reports immutable candidate to Director.

> **Citation anchors.** pre=`b00a2e338436ef7b281b0cc53e74f891af32f18c` post=`b00a2e338436ef7b281b0cc53e74f891af32f18c`.

## Outcome

A room can persist an evolving concept DQC before any answer, landmark or delivery assignment exists. Public safe operations preserve original question identities, origin, corrections, uncertainty and revision evidence. Intended Expected result and achieved Result remain independently authorable and readable. Confirmation and records never grant execution or promotion authority.

## Why It Matters

Evolving understanding needs a durable inspectable account before delivery. An intended documentation change cannot stand in for achieved delivery; recording only Expected result leaves the concept account incomplete even while a generated view displays progress.

## Current Verified State

Read source observations at the pre anchor using `git show`:

- Existing `workbench/tools/landmark-tracker.mjs` implements captureQuestion, showTracker, reviseRecord, source lineage, uncertainty, corrections, claims and affected-claim evidence. DQC schema destination-question@2 reads @1 and upgrades on mutation.
- `workbench/manifest.json` already declares landmarkTracker; `workbench/tools/workbench-paths.mjs` supplies declaredTracker/trackerCollectionPath and safe file writes. `workbench/tools/visible-ids.mjs` supplies allocateArtifactId. No new storage envelope is needed.
- `validateQuestion` accepts Result as null or {summary, revision}, but capture initializes null and reviseQuestion never writes Result. CLI revision flags omit Result, and readable formatCard omits Result. These are source-observed gaps, not yet reproduced red tests.
- `node tools/test-landmark-tracker.mjs` passed 23/23 on the baseline in the DQC dispatcher worktree. That proves existing fixture behavior, not new Result behavior or owner Human QA.
- [Foundation source](../S-01T-landmark-tracker-foundation/SPEC.md) retains completed TK-01X/TK-01Y and append-only proof. This successor inherits supported DQC obligations without copying their historic evidence or reopening those Tasks.
- Primary local integration 89d4042 is older than verified remote integration b00a2e3; no primary checkout changes are authorized.

## Desired Behavior

1. Capture a meaningful concept synthesis with original source question identities/revisions; allow unanswered, ungrouped records with no Spec, Task or Wiki destination. No placeholder parent or compulsory per-prompt card.
2. Preserve immutable origin, record identity and useful correction history through retitling, answers, scoped confirmation, Expected result changes, uncertainty resolution and achieved Result changes.
3. Author achieved Result through the existing revision-safe public API and CLI. Keep its summary and recording revision separate from Expected result; expose it through JSON and readable show, including a fresh process. Recording Result never automatically confirms understanding, completes work, changes stage assessment or creates Verified.
4. Refuse invalid or stale mutations before writing any record or projection byte. Keep current privacy/path/identity protections and exclusive creation behavior. Revision checks remain stale-read checks, not concurrency locks; one writer per record.
5. Keep supporting evidence at its recorded revision and assess specific affected claims when understanding changes. Relations alone never invalidate targets; no reset or destructive conversion/purge.
6. Authorized workflow composition maintains current concept understanding, reasons, evidence and affected claims; the grilling primitive stays unaware of Tracker machinery. Preserve useful notepad origins, correction and handoff dependencies. Several workflows can use the same concept record without expanding authority.
7. Discover records through the existing manifest declaration and common identity rules; remain usable from tracked files in a fresh clone without ignored local notes.

## Decisions And Contracts

- Accepted architecture remains [ADR-000N](../../docs/adr/000N-landmark-tracker-connects-evolving-understanding-to-durable-knowledge.md) and the [readable design](../../wiki/design-concepts/landmark-tracker.md). Original S-01T accepted obligations and completed history remain reachable.
- [Landmark Tracker - S-001Z](../S-001Z-landmark-tracker-view/SPEC.md) owns generated distributions/view; [Landmark Records - S-002A](../S-002A-landmark-records/SPEC.md) owns landmark relationships, actual Wiki assessment and lifecycle/recovery. DQC owns concept record operations and initially common safety/discovery seams.
- Preserve current schemas, DQC_PREFIX/LMK_PREFIX, typed related entries {type,id,revision,reason,assessment}, source entries {id,revision}, DQC-authored landmarks edges and append-oriented history. Do not invent a generic record envelope or reverse relationship ownership.
- First mutation lease for shared `workbench/tools/landmark-tracker.mjs` belongs to the DQC Result worker. Release exact clean seam commit before another lane edits that module. Independent tests/Wiki/proof can proceed in parallel; whole-Spec completion is not a dependency barrier.
- Original acceptance transfer: primary DQC ownership of S-01T acceptance 2 and 9; record-write portions of 6 and concept-revision/affected-evidence portions of 8; DQC-specific fresh-clone/demo/QA portions of 1 and 13. Records owns actual durable-content reconciliation and Tracker owns arithmetic. Source-owner mapping is reconciled by its single writer; no original acceptance is silently closed.

## Non-Goals

Reimplementing delivered capture/read, replacing existing storage, projection arithmetic, Wiki/lifecycle work belonging to peers, release/version changes, main promotion, other-room updates, destructive source conversion, scheduler or new agent authority. No Task execution by this dispatcher.

## Dependencies And Blockers

- Result has no dependency on S-00I TK-01U. That Task still owns feature-collection/schema consumers; no duplicate writer is introduced.
- Workflow composition consumes existing per-skill owners and S-00P's root-control lane. Inspect current delivered source and prove a specific missing maintenance path before authoring its next tiny Task; preserve those owners rather than assuming a whole-Spec barrier.
- Known baseline self-drift prevents a cleanUpdate claim: stale S-00Q claim, historical seed/provenance limitations. This does not block bounded Result delivery; existing owners retain remediation.

## Vertical Implementation Slices

Record-backed Tasks live under this Spec's tasks directory. The first approved residual is one public Result write/read path; serial Task identity is coordinated with Tracker. Existing capture behavior is inherited proof, not a new execution Task. Subsequent missing workflow-maintenance behavior is assigned only after bounded current-source verification and shared writer coordination.

## Acceptance Criteria

- [ ] Unanswered/ungrouped concept capture and source identity persist across fresh-process/clone reads with no delivery or Wiki prerequisite; existing inherited proof is reproduced during whole-Spec QA.
- [ ] Public revision-safe Result write preserves Expected result, origin, identity and history and reloads through JSON and readable show; achieved Result never substitutes for stage/approval evidence.
- [ ] Invalid/stale Result writes preserve every record and projection byte; common path/privacy/identity protections and legacy schema reads remain intact.
- [ ] Changed concept understanding preserves recorded evidence/reasons/revisions and identifies specific affected claims without blanket invalidation.
- [ ] Workflow composition demonstrably maintains current DQC understanding within caller authority, keeps grilling independent and retains useful notepad correction/handoff sources; any unimplemented remainder stays visibly open.
- [ ] A tracked fresh-room cross-Spec scenario captures an ungrouped DQC, links an emerging landmark and produces an evidence-backed view; each peer may consume an immutable seam before this whole Spec completes.
- [ ] Whole-Spec QA, required checks, pre/post self-drift and guardrails with honest limits and an under-one-minute public demo are recorded at an immutable candidate; separate-context Director review precedes integration. Owner Human QA remains owner-led and is not inferred from tests.

## Testing Seams

Existing landmark-tracker CLI/API, validateQuestion, showTracker, revision-safe persistence and deterministic rebuild in disposable rooms. Narrow Result tests live in `tools/test-dqc-result.mjs` to avoid concurrent edits to inherited Tracker tests. Verify original bytes and projection on refusal, independent Expected/Result evolution, origin/history preservation, JSON/readable reload and no automatic assessment change.

## Verification Procedure

Worker demonstrates expected red at public operation, implements only Result behavior and runs targeted tests then the full current AGENTS suite on committed candidate. Dispatcher reproduces inherited 23-test Tracker behavior plus Result tests, public demo, docs/source ownership and whole-Spec acceptance; coordinates cross-Spec scenario with peers. Run read-only self-drift pre/post with manual semantic check and guardrails; compare limitations honestly. Director reviews immutable assembled candidate before integration.

## Documentation Impact

Update `workbench/landmark-tracker/README.md` with actual Result operation and limits. Root-control procedure changes stay with S-00P. Runtime is shared managed source; no generic template control meaning changes in this Result slice, so no root/template mirror is needed. Refresh projections only through the coordinated generator writer.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-26 | none | Serial identity reservation under explicit owner three-Spec split | Live base b00a2e338436ef7b281b0cc53e74f891af32f18c; next-id proposal saved before next allocation | This minimal scaffold | Dispatcher scope/Tasks and source transfer mapping pending |
| 2026-09-26 | planning | DQC boundary and Result residual approved by Director under explicit owner three-Spec split | Baseline b00a2e3 Tracker suite 23/23; open PR lookup found unrelated 92/77 only; pre guardrail 78/100; pre self-drift cleanUpdate false, stale S-00Q and historical seed/provenance limits | Narrow successor authored; original completed source evidence preserved | Serial Task ID, worker red/green, composition residual inspection, cross-Spec QA and independent review remain |

## Completion Result

Pending. Existing DQC behavior is inherited verified delivery; the public Result gap and workflow-maintenance/cross-Spec proof obligations remain open. Owner Human QA has no approval from this Spec.

## Remaining Limitations Or Follow-Up Specs

No clean Workbench update or agent-outcome reliability claim. Whole-Spec composition and cross-Spec proof must be verified rather than inferred from the Result Task. Existing failed Human QA is not reset by source review or tests.

## Supersession

- Supersedes: DQC obligations of original S-01T only after explicit source-owner transfer mapping; historical foundation source and completed Tasks remain intact.
- Superseded by: none.
