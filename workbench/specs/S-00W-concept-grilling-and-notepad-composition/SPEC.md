# S-00W - Concept Grilling And Notepad Composition

**Spec ID:** S-00W
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-23
**Catalog description:** Settle a shared design concept through one-question-at-a-time grilling, with an independent notepad composed by grill-me.
**Blockers:** none for planning; implementation has not been assigned.
**Latest event:** Planning packet passed the 46-command suite and separate-context review of `eb66fd935bda2f9cf910b517d0174c06acb94011`; no skill behavior changed.
**Next gate:** Activate an approved Task for implementation, then reconcile its source and distribution route with S-00V and the Skills Wiki branch before editing shared skill or Wiki owners.

> **Citation anchors.** pre=`4ae75687c0786026d2c959459e642a29da24e4d0` post=`4ae75687c0786026d2c959459e642a29da24e4d0`.

## Outcome

An owner and agent can form a defensible, shared design concept through a changing decision tree. Each question offers a recommendation and its consequences. The owner's answer receives a pending Question / Answer / Why / Impact readback. The agent waits for confirmation or correction before locking that decision or asking the next design question. A final concept readback is confirmed before moving to specification.

`grilling` owns inquiry and synthesis without requiring persistence. `notepad` remains the reusable continuity primitive for any objective. `grill-me` starts a grilling session and composes notepad for that session. The three are useful together without making storage mechanics part of the inquiry primitive.

## Why It Matters

The current grilling source asks for a full question list upfront and selects the next open question. It records an answer after confirmation but does not distinguish a pending interpretation from a confirmed decision, recalculate a ready frontier after changed premises, or define a bounded concept-readiness test. The global `grill-me` wrapper merely invokes grilling. The owner wants misunderstandings settled immediately and a visible explanation of how decisions fit together, while keeping notepad independently useful.

## Current Verified State

Verified at the pre anchor on 2026-09-23:

- `skills/grilling/SKILL.md` contains manifest and notepad runtime instructions, requires a full planned question list, and advances to the next open item. Its no-reasking guidance has no named premise-change procedure. It has no explicit pending-readback confirmation gate.
- `skills/notepad/SKILL.md` owns revision-checked JSON working context and correction-preserving retrieval. `workbench/tools/notepads.mjs` is the shared runtime; neither needs a new schema to represent provisional versus confirmed meaning in the session view and entries.
- The current 21-skill repository bundle has no `skills/grill-me/SKILL.md`. The installed personal `grill-me` wrapper invokes grilling; `skills-archive/optional-active-2026-09-01/grill-me/` is preserved historical source, not the current core source. Installed global copies may differ from repository source; updating repository files does not itself update installations.
- `tools/test-skill-catalog.mjs` asserts specific grilling/notepad wording. It establishes structure and catalog consistency, not conversational quality. `tools/test-project-evidence.mjs` exercises an optional prepared evidence path; that path must remain compatible without requiring every grilling invocation to use it.
- `RUNBOOK.md` currently routes idea stress-testing to grilling with notepad, and `BLUEPRINT.md` already requires explicit confirmation of the shared concept. Both need narrow wording alignment if implementation changes their operational meaning.
- [S-00V Portable Workbench](../S-00V-portable-workbench/SPEC.md) plans to move canonical skill source into a managed room lane. An isolated, unmerged Skills Wiki packet also proposes pages with these three names. The implementation owner must inspect the landed layout and coordinate the one-page-per-skill route before writing.

## Desired Behavior

1. **Separate responsibilities.** `grilling` asks, challenges, maps dependencies, synthesizes and stops at shared understanding. It works without a notepad runtime. `notepad` captures objective context independently. `grill-me` composes both, retaining the existing note's safety, revision, correction, resume and cleanup guarantees. Composition inherits the caller's scope.
2. **One decision at a time.** Present one consequential ready question as Question / Recommended answer / Why / Impact. Investigate available facts first. Wait for the owner; silence never accepts a recommendation. Preserve the owner's answer provisionally if continuity needs it, without treating capture as acceptance.
3. **Confirm before locking or progression.** Restate the actual answer as Question / Answer / Why / Impact, mark it pending, separate the owner's rationale from agent inference, and wait for confirmation or correction. A correction receives a revised readback. Only explicit natural-language confirmation locks the decision, updates the affected map and permits the next substantive design question. Do not ask the next question in a pending readback or demand a special command.
4. **Dynamic decision map.** Track major branches, prerequisites, assumptions and a ready frontier. Choose the most consequential ready decision while preserving one-question pacing. Recompute after confirmed answers, prune irrelevant branches, and show compact meaningful map changes. Reopen a settled answer only for a named changed premise, contradictory evidence or owner correction; identify affected dependents and retain unaffected settled work.
5. **Synthesize and stop honestly.** At branch boundaries or material changes, explain the emerging concept as a connected account, not a transcript. Before transition, read back the overall problem, intended user and experience, scope and exclusions, important concepts and boundaries, consequential tradeoffs and a concrete scenario in the same four-part format. Confirm it with the owner. Surface unresolved choices or missing evidence capable of changing the concept; an empty ready frontier is not proof of readiness.
6. **Bounded companion use.** Lexicon supplies accepted meanings, domain-modeling can challenge concepts, and wayfinder can narrow an oversized inquiry, only within the caller's authorization. A settled term does not authorize a Canon write. A summary does not authorize specification or execution beyond the requested endpoint.

## Decisions And Contracts

- **Owner-accepted interaction order:** recommendation -> owner answer -> pending readback -> explicit confirmation or corrected readback -> lock -> dependent-map update -> next design question. A pending answer and confirmed decision are distinct in user-facing language and any saved context.
- **Source ownership:** The current repository source is `skills/grilling/SKILL.md` and `skills/notepad/SKILL.md`. A later implementation adds a repository-owned `grill-me` entry under the then-current manifest-declared skill source lane and updates the declared skill inventory, catalog and distribution contract. It must not silently promote the archived wrapper or assume global installation changed. If S-00V lands first, use its managed lane and adapter rules; do not create a competing root source. The historical archived item remains under S-00R's disposition gate.
- **No runtime migration:** Preserve the current notepad schema, correction links, privacy scan, revision checks, typed collections and ignored live notes. If a scenario exposes a genuine runtime gap, record it and obtain a scoped owner decision rather than introducing a new storage framework under this Spec.
- **Documentation ownership:** The three individual skill Wiki pages explain the accepted destination and current limitation; the executable skills and their tests own implementation. Root and template controls are aligned narrowly when implementation changes the operational contract. The Wiki router remains the only index. The unmerged Skills Wiki branch must reuse these page owners or reconcile edits before integration.
- **Planning boundary:** This Spec and its Tasks describe later work. Writing this packet does not claim a Task, implement a skill, install a global skill, publish a release, or approve the Skills Wiki branch.

## Non-Goals

- A graph service, persistent decision board, new universal ledger, new note schema or migration of legacy notes.
- Rewriting Lexicon, domain-modeling, wayfinder, prototype, or unrelated skill behavior.
- Treating a recommendation, a saved entry, silence, green string checks, or an empty frontier as owner confirmation or a successful human conversation.
- Changing another room, personal skill installation, global configuration, release version or external service in this planning pass.

## Dependencies And Blockers

There is no prerequisite to author this planning packet. Implementation Tasks are ordered by delivered behavior and remain unstarted until assigned. Before the source/distribution Task, inspect the then-current [S-00V](../S-00V-portable-workbench/SPEC.md) outcome and [S-00R](../S-00R-core-skill-lifecycle-and-optional-source-disposition/SPEC.md) archived-source disposition, and reconcile the isolated Skills Wiki branch's overlapping page proposals. None authorizes edits in those lanes here.

## Vertical Implementation Slices

Record-backed Tasks below own unfinished slices; this table retains no completed history yet.

| Task | Slice | Status | Blockers | Proof |
|---|---|---|---|---|

## Acceptance Criteria

- [ ] A recommendation different from the owner's answer is not recorded as the answer; a pending readback prevents the next substantive design question.
- [ ] An owner correction revises the readback before lock; explicit confirmation locks the owner's meaning and advances the ready frontier without a special command.
- [ ] A named upstream premise change identifies dependent answers to reconsider; irrelevant branches disappear and unaffected settled decisions remain intact.
- [ ] Missing evidence or an unresolved concept-changing choice prevents a false ready verdict; the final concept readback covers the bounded readiness elements and receives owner confirmation.
- [ ] Grilling can run without persistence. `grill-me` composes grilling with notepad. The notepad primitive also works for an unrelated objective and resumes pending versus confirmed meaning without losing corrections.
- [ ] The current source route, installed distribution boundary, skill inventory, relevant root/template wording and catalog checks agree with the delivered behavior; no legacy note safety or continuity guarantee regresses.
- [ ] Realistic conversational scenarios and structural checks are both reported with observed results and human evaluation limits. The full required suite, Wiki validation, self-drift pre/post receipts and separate-context candidate review pass at their proper gates.

## Testing Seams

Instruction-level scenario transcripts can inspect the exact recommendation, answer, pending readback, correction, confirmation, map update and next-question order. Exercise a standalone grilling invocation, `grill-me` composition, unrelated notepad use and resume from saved pending state. Structural tests cover source/catalog/distribution references and notepad runtime safety; they do not prove the agent followed the interview contract in a fresh conversation. Use a human owner review for fidelity of meaning and concept readiness.

## Verification Procedure

For each behavior-changing Task, first show a targeted scenario or stable test failing for the intended behavior, then make the smallest source change and rerun it green. Run targeted skill/catalog, composition, project-evidence, notepad and Wiki checks as applicable, then the full AGENTS/RUNBOOK suite. Capture guardrail baseline and after-score for harness edits, with limits. Run `self-drift.mjs --phase pre` and `--phase post` plus the Runbook semantic inventory. Evaluate at least the scenarios named in Acceptance Criteria in fresh contexts, record actual transcript excerpts and human limitations, and obtain separate-context review of the immutable candidate before integration.

## Documentation Impact

This authoring pass creates three skill articles and routes them from `workbench/wiki/MEMORY.md`. Future implementation owns narrow `AGENTS.md`/`RUNBOOK.md`/`BLUEPRINT.md` and generic template wording changes only where meaning changes, plus `skills/README.md`, manifest skill inventory, catalog assertions and distribution receipts when `grill-me` becomes canonical. The executing agent records docs checked or the exact update in each Task proof.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-23 | planning | Owner-directed design captured at pre anchor in isolated branch | Current controls, three skill sources, catalog seams, Wiki schema, S-00V and S-00R inspected; pre self-drift: 49 attention findings, `machineResult: blocked`, `cleanUpdate: false`; no behavior trial | Spec, Tasks and three individual skill Wiki pages authored in this pass | Skill implementation, source distribution, owner-led scenario evaluation and independent review remain future gates |
| 2026-09-23 | planning verification | Checked the authored packet and Wiki routes | All 46 commands in the AGENTS full suite passed; `wiki.mjs validate`, citation-anchor tests, `render`, `show S-00W`, `doctor` and `git diff --check` passed. Post self-drift retained the same 49 pre-existing attention findings, `machineResult: blocked`, `cleanUpdate: false`; bounded semantic review found no new current-facing contradiction in touched owners. | Three new pages routed from the sole Wiki index; Catalog generated from the Spec | No interview behavior or installed-skill behavior was exercised; independent candidate review and later implementation proof remain open |
| 2026-09-23 | review | Separate-context review of `eb66fd935bda2f9cf910b517d0174c06acb94011` found no blocking correctness issue | Codex CLI `codex review --commit` using gpt-5.5, review mode; it checked links, source claims and packet shape. First attempt with the CLI's configured gpt-6-sol failed before review because that model was unavailable. | No document change requested by reviewer | Review covers this planning candidate only; no conversational or installed-skill acceptance inferred |

## Completion Result

Planning packet only. No Task execution or behavioral proof is claimed.

## Supersession

- Supersedes: none.
- Superseded by: none.
