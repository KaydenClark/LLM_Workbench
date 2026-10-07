# S-002V - retro skill adoption

**Spec ID:** S-002V
**Status:** active
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-06
**Catalog description:** Look back over finished work and turn what went wrong or right into a few named lessons, each routed to the owner that should act on it.
**Blockers:** none. The delivered draft collection is available; the current owner request authorizes Core source adoption.
**Latest event:** Owner directed required Core adoption of retro and reiterated writing-for-agents; one isolated writer prepares both sources and their draft comparisons.
**Next gate:** Verify the assembled candidate, then independent review; integration delivery, owner Human QA and main closure remain separate.

> **Citation anchors.** pre=`07edccc57b8f75613ad1d09203a3e414d867b90c` post=`07edccc57b8f75613ad1d09203a3e414d867b90c`.

## Outcome

The draft article for `retro`, the comparison with Matt Pocock's `engineering/retro`, and a `retro` skill source all describe one behavior. The skill is new to this repository: step 1 establishes what behavior we already have in its neighborhood, so the new skill adds only what is missing and does not restate what the feedback review family or the Reconciler stance already do.

## Why It Matters

The owner wants the skills prototyped as a draft wiki to find skills that should connect and do not, and skills that connect and do not work together. `retro` is the clearest overlap test: a look-back skill sits beside the harness-feedback-review family, the feedback tooling and the Reconciler stance. Writing its article from Template 2 forces "What it needs" and "What it reads and writes" to say where a lesson lands, which may show that the answer is already an existing owner.

## Current Verified State

At the pre anchor:

- No skill named `retro`, or any retrospective, reflection or postmortem skill, exists in `workbench/skills`, `skills-pending` or the owner's `~/.agents/skills` (read-only). The Lexicon and RUNBOOK define no retro term. This is the first Spec for it; it adopts a skill from upstream (`engineering/retro`), group main-workflow, default Pending (owner decision 1 of 2026-09-30).
- Nearest behavior one: the `harness-feedback-review` family lives only in `~/.agents/skills` (read-only; the family is 15 skills, one root plus 14 stage skills). Its `SKILL.md` describes a read-only audit that reconciles Canon, Grounding and verified Actuality of a harness and returns a Grounding report with bounded follow-up; it "never changes the target's Canon or Actuality". The family has its own Spec, S-003K (the owner's one family Spec).
- Nearest behavior two: the feedback tooling named in `AGENTS.md`. `tools/feedback-automation.mjs` parses harness-feedback rows and run outcomes (S-006, complete); `tools/feedback-inventory.mjs` inventories the feedback lane by file role (S-00S); S-00N (active) requires every feedback finding to resolve into one of five named dispositions. Their tests are `tools/test-feedback-automation.mjs` and `tools/test-feedback-inventory.mjs`. The lane's format owner is `workbench/feedback/REPORT_FORMAT.md`.
- Nearest behavior three: the Reconciler stance, `workbench/skills/reconciler/SKILL.md`, leaves achieved work and its truth owners consistent for continuation, routing each truth once through `/to-docs` and preserving session reasoning with `/notepad`. It is a stance set by the assigned Spec, not a look-back activity.
- Related neighbors to check in step 1: `promote` (moves supported working material into owners), `notepad` (local session reasoning), and the retired `checkpoint` notice. The Lexicon's "Coordination hand-back" row already records owner hand-backs as a defect to log in the Spec evidence by `carry`, which may cover part of a retro's purpose.
- Matt's `engineering/retro` has not been read. Its behavior is step 3's job at the pin `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`.
- `skills-pending/` is a root directory outside `AGENTS.md` Edit Scope, and `workbench/skills/README.md` calls it historical rewrite source outside discovery. S-00R (active, owner `codex-director`) holds the per-item owner decision for pending relocation, and a live lane `origin/codex/S-00R-optional-inventory` exists. Whether step 6 may add `skills-pending/retro/` has not been verified.

## Desired Behavior

1. The draft article for `retro` at the tentative location `workbench/wiki/skills-draft/main-workflow/retro.md` (tentative until S-002L decides) fills every Template 2 section, with `origin` and `skill_source: new` recorded from step 1.
2. Each "needs" and "reads and writes" item resolves to something real or becomes a finding. Overlap with the feedback review family, the feedback tooling and the Reconciler stance is stated as a finding, not hidden.
3. The article records a verdict against Matt's skill (same, close, divergent or missing) with behavior and clarity differences.
4. The skill source, once step 6 is authorized, matches the article and says where each lesson is recorded without creating a new store or a universal handoff.

## Decisions And Contracts

### Current execution amendment, 2026-10-06

The owner explicitly requested `retro` as required in every Workbench and reiterated the already-requested `writing-for-agents`. Both sources go into `workbench/skills` and the required Core bundle. This supersedes the earlier Pending default and step-6 lane gate for retro, and the earlier arbitrary ask-workbench/brainstorm/sitrep ordering for writing-for-agents for this paired delivery. One writer changes the shared bundle from its verified 28 entries to 30; unrelated skill adoption and archived-source disposition stay with their owners.

S-002L has delivered the draft collection and Template 2 on integration, although its owner Human QA and main closure are still open. Those release gates do not prevent this requested draft work. The six investigation/draft/comparison/alignment/source steps are covered by one Task per skill from current Actuality. Existing Current Verified State bullets below remain dated pre-anchor observations, not current installation claims.

`retro` is explicitly invoked and proposes severity-ranked environment improvements without applying them. It loads the shipped writing reference, cites primary session evidence, checks existing guardrails and routes accepted interventions to `improve-harness`. `writing-for-agents` is a reusable authoring reference available to models and users. Its portable mechanics preserve Workbench skill composition and existing permission boundaries. The archived writing-great-skills source and personal installations stay intact; the new reference supersedes it for live Workbench authoring.


- This Spec owns `retro` alone. The feedback review family, the Reconciler stance and the feedback tooling keep their own owners; this Spec may only log findings that name them.
- `retro` is adopted into the draft wiki now. Whether the skill source is created, and in which lane, is decided by steps 1-5 and the step 6 authorization below. The current execution amendment supersedes this historical Pending default with required Core adoption.
- Matt's site and skill are outside evidence, not Workbench Canon. The comparison summarizes and cites; it does not reproduce his file. His skill files are MIT-licensed (notice in `THIRD_PARTY_NOTICES.md`).
- Steps 1-5 touch only the draft wiki. Step 6 is the only step that touches a skill lane.

## Non-Goals

- Editing the feedback review family, the feedback tools or tests, the Reconciler skill, or the Foundry skills.
- Adopting other skills beyond the owner-requested retro and writing-for-agents pair.
- Reading or quoting Matt's files before step 3, and answering the wayfinder storage question (Q2A, deferred by the owner).
- Treating S-002L delivery as owner Human QA or main closure.

## Dependencies And Blockers

- The S-002L draft location and template are delivered on integration and were read live for this work.
- Core lane authorization and shared-writer ordering are resolved by the current execution amendment above.
- The writing reference and retrospective ship together. Neither source relies on an absent skill or private installation.
- S-00R retains ownership of archived/pending-source disposition; this candidate changes neither archive nor personal copies.

## Vertical Implementation Slices

The current owner request activates this Spec; its record-backed Task covers the following six steps from live Actuality. The intended slice direction, in order:

1. **Investigate ours.** Record, at a named commit, the nearest behavior to a retro: the `harness-feedback-review` family (read-only in `~/.agents/skills`), the feedback tooling and tests named above, the Reconciler stance, and `promote` and `notepad`. For each, record inputs, outputs, writes and composition. Expect `overlap` findings.
2. **Draft the article.** Fill Template 2 (owned by S-002L) at `workbench/wiki/skills-draft/main-workflow/retro.md`, tentative until S-002L decides, from step 1.
3. **Investigate Matt's.** Read his `engineering/retro` `SKILL.md` at `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`, noting any supporting files. Record what it reads, writes and calls.
4. **Compare.** Fill "Compared with Matt's" with a verdict and log findings (`dangling`, `stale-name`, `overlap`, `gap`, `conflict`, `missing-skill`), one per line.
5. **Align the article.** Rewrite until its wording matches real or intended behavior; log what is left, including any decision to merge, narrow or drop the skill because an existing owner already covers it.
6. **Fix or create the skill.** Create `retro/SKILL.md` in the authorized lane (default `skills-pending/retro/`), with catalog tests and a fresh-context scenario. Runs only once the pending-lane authorization above is recorded.

## Acceptance Criteria

- [ ] Every Template 2 section of the `retro` draft article is filled, and its `origin`, `skill_source` and `matt_counterpart` fields come from step 1.
- [ ] Every "needs" and "reads and writes" item resolves to something real or is recorded as a finding; overlap with the feedback review family, feedback tooling and the Reconciler stance is a finding with a named owner.
- [ ] "Compared with Matt's" holds a verdict (same, close, divergent or missing) from a read of `engineering/retro` at the pinned revision.
- [ ] The step 6 lane authorization is recorded before any skill source is added, and the skill source matches the article.
- [ ] Targeted catalog tests, Wiki validation and the full suite in `AGENTS.md` are green for step 6, and a fresh-context scenario is observed; no unrun check is reported as passing.

## Testing Seams

Steps 1-5 have no executable seam; the checks are reading the article against source and tests and resolving each reference. Step 6 uses the skill catalog and lane tests (`tools/test-skill-catalog.mjs`, `tools/test-skills-lane.mjs`) and a fresh-context scenario, with red then green at the closest seam if the lane or catalog changes. The scenario is chosen at activation. Structural checks prove routing, not agent behavior.

## Verification Procedure

For steps 1-5, run `node workbench/tools/wiki.mjs validate` against the draft collection once S-002L defines it, and check every cited path and finding line by search. For step 6, run the targeted catalog tests, then the current full suite from `AGENTS.md`, `node workbench/tools/spec-workbench.mjs render` and `doctor`, and the Workbench self-drift pre/post receipts. Review the immutable candidate in a separate context before integration. Record actual commands and results here.

## Documentation Impact

The draft article `workbench/wiki/skills-draft/main-workflow/retro.md` (tentative until S-002L decides). Step 6 may touch the skill lane's catalog entry and `workbench/skills/README.md` only as the authorized lane requires, and no manifest or Core bundle row unless the owner makes `retro` Core. Record `Docs checked; no update needed` where a control does not change.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Spec authored from the owner's draft-skills-wiki direction; planning only | Nearest behavior located at the pre anchor by reading the harness-feedback-review root skill, the feedback tooling files and the Reconciler skill; Matt's skill not read; no implementation evidence | This Spec authored; no article, skill or control written | S-002L, activation, Tasks, pending-lane authorization and all six steps remain open |

| 2026-10-06 | planning | Owner explicitly selected required Core for retro and reiterated prior writing-for-agents request; paired delivery activated, earlier arbitrary ordering and Pending lane gate superseded | Fresh origin/integration 42431879; S-002L collection and Template 2 present; catalog red observed: writing-for-agents absent from required Core | Current execution amendment and one native Task per skill | Implementation, green checks, fresh-context scenarios, review and delivery pending |

## Completion Result

Not complete.

## Supersession

None.
