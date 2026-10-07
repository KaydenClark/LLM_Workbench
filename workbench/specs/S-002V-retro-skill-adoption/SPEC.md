# S-002V - retro skill adoption

**Spec ID:** S-002V
**Status:** active
**Priority:** 2
**Owner:** codex-retro
**Stance:** Builder
**Updated:** 2026-10-07
**Catalog description:** Look back over finished work and turn what went wrong or right into a few named lessons, each routed to the owner that should act on it.
**Blockers:** none. The delivered draft collection is available; the current owner request authorizes Core source adoption.
**Latest event:** TK-006Z claimed by codex-retro.
**Next gate:** Close TK-006Z with verification and documentation proof.

> **Citation anchors.** pre=`07edccc57b8f75613ad1d09203a3e414d867b90c` post=`07edccc57b8f75613ad1d09203a3e414d867b90c`.

## Outcome

The draft article for `retro`, the comparison with Matt Pocock's `engineering/retro`, and a `retro` skill source all describe one behavior. The skill is new to this repository: step 1 establishes what behavior we already have in its neighborhood, so the new skill adds only what is missing and does not restate what the feedback review family or the Reconciler stance already do.

## Why It Matters

The owner wants the skills prototyped as a draft wiki to find skills that should connect and do not, and skills that connect and do not work together. `retro` is the clearest overlap test: a look-back skill sits beside the harness-feedback-review family, the feedback tooling and the Reconciler stance. Writing its article from Template 2 forces "What it needs" and "What it reads and writes" to say where a lesson lands, which may show that the answer is already an existing owner.

## Current Verified State

The following bullets are historical investigation observations at the pre anchor. Current paired implementation and verification are recorded in the execution amendment, acceptance and proof below.

At the pre anchor:

- No skill named `retro`, or any retrospective, reflection or postmortem skill, exists in `workbench/skills`, `skills-pending` or the owner's `~/.agents/skills` (read-only). The Lexicon and RUNBOOK define no retro term. This is the first Spec for it; it adopts a skill from upstream (`engineering/retro`), group main-workflow, default Pending (owner decision 1 of 2026-09-30).
- Nearest behavior one: the `harness-feedback-review` family lives only in `~/.agents/skills` (read-only; the family is 15 skills, one root plus 14 stage skills). Its `SKILL.md` describes a read-only audit that reconciles Canon, Grounding and verified Actuality of a harness and returns a Grounding report with bounded follow-up; it "never changes the target's Canon or Actuality". The family has its own Spec, S-003K (the owner's one family Spec).
- Nearest behavior two: the feedback tooling named in `AGENTS.md`. `tools/feedback-automation.mjs` parses harness-feedback rows and run outcomes (S-006, complete); `tools/feedback-inventory.mjs` inventories the feedback lane by file role (S-00S); S-00N (active) requires every feedback finding to resolve into one of five named dispositions. Their tests are `tools/test-feedback-automation.mjs` and `tools/test-feedback-inventory.mjs`. The lane's format owner is `workbench/feedback/REPORT_FORMAT.md`.
- Nearest behavior three: the Reconciler stance, `workbench/skills/reconciler/SKILL.md`, leaves achieved work and its truth owners consistent for continuation, routing each truth once through `/to-docs` and preserving session reasoning with `/notepad`. It is a stance set by the assigned Spec, not a look-back activity.
- Related neighbors to check in step 1: `promote` (moves supported working material into owners), `notepad` (local session reasoning), and the retired `checkpoint` notice. The Lexicon's "Coordination hand-back" row already records owner hand-backs as a defect to log in the Spec evidence by `carry`, which may cover part of a retro's purpose.
- Matt's `engineering/retro` has not been read. Its behavior is step 3's job at the pin `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`.
- `skills-pending/` is a root directory outside `AGENTS.md` Edit Scope, and `workbench/skills/README.md` calls it historical rewrite source outside discovery. S-00R (active, owner `codex-director`) holds the per-item owner decision for pending relocation, and a live lane `origin/codex/S-00R-optional-inventory` exists. Whether step 6 may add `skills-pending/retro/` has not been verified.

## Desired Behavior

1. The draft article for `retro` at the tentative location `workbench/wiki/skills-draft/main-workflow/retro.md` (the delivered S-002L location) fills every Template 2 section, with `origin` and `skill_source: new` recorded from step 1.
2. Each "needs" and "reads and writes" item resolves to something real or becomes a finding. Overlap with the feedback review family, the feedback tooling and the Reconciler stance is stated as a finding, not hidden.
3. The article records a verdict against Matt's skill (same, close, divergent or missing) with behavior and clarity differences.
4. The skill source, once step 6 is authorized, matches the article and says where each lesson is recorded without creating a new store or a universal handoff.

## Decisions And Contracts

### Paired delivery continuation, 2026-10-07

The owner now requests retro and writing-for-agents in their proper home. Deliver this existing pair into the tracked Core lane through integration under current gates. The pr package independently landed at 6101c237 during verification; preserve it and combine the required bundle at 31. Its unresolved review findings remain with S-002U. Current31, exact prior28, pr-only29, pair-only30 and frozen legacy21 policies are checked at the shared compatibility seam. This continuation grants no owner Human QA or main-promotion approval and changes no personal installation.

### Current execution amendment, 2026-10-06

The owner explicitly requested `retro` as required in every Workbench and reiterated the already-requested `writing-for-agents`. Both sources go into `workbench/skills` and the required Core bundle. This supersedes the earlier Pending default and step-6 lane gate for retro, and the earlier arbitrary ask-workbench/brainstorm/sitrep ordering for writing-for-agents for this paired delivery. One writer changes the shared bundle from its verified 28 entries to 30; unrelated skill adoption and archived-source disposition stay with their owners.

S-002L has delivered the draft collection and Template 2 on integration, although its owner Human QA and main closure are still open. Those release gates do not prevent this requested draft work. The six investigation/draft/comparison/alignment/source steps are covered by one Task per skill from current Actuality. Existing Current Verified State bullets below remain dated pre-anchor observations, not current installation claims.

`retro` retains Matt's session retrospective and severity ordering, with step 1 adapted to a real Workbench reference. `writing-for-agents` and its supporting mechanics retain the supplied upstream text. Existing Workbench controls govern authority, composition and artifact ownership; their rules are not duplicated into the imported skills. The archived writing-great-skills source and personal installations stay intact; the new reference supersedes it for live Workbench authoring.


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

- [x] Every Template 2 section of the `retro` draft article is filled, and its `origin`, `skill_source` and `matt_counterpart` fields come from step 1.
- [x] Every "needs" and "reads and writes" item resolves to something real or is recorded as a finding; overlap with the feedback review family, feedback tooling and the Reconciler stance is a finding with a named owner.
- [x] "Compared with Matt's" holds a verdict (same, close, divergent or missing) from a read of `engineering/retro` at the pinned revision.
- [x] The step 6 lane authorization is recorded before any skill source is added, and the skill source matches the article.
- [x] Targeted catalog tests, Wiki validation and the full suite in `AGENTS.md` are green for step 6, and a fresh-context scenario is observed; no unrun check is reported as passing.

## Testing Seams

Steps 1-5 have no executable seam; the checks are reading the article against source and tests and resolving each reference. Step 6 uses the skill catalog and lane tests (`tools/test-skill-catalog.mjs`, `tools/test-skills-lane.mjs`) and a fresh-context scenario, with red then green at the closest seam if the lane or catalog changes. The scenario is chosen at activation. Structural checks prove routing, not agent behavior.

## Verification Procedure

For steps 1-5, run `node workbench/tools/wiki.mjs validate` against the draft collection once S-002L defines it, and check every cited path and finding line by search. For step 6, run the targeted catalog tests, then the current full suite from `AGENTS.md`, `node workbench/tools/spec-workbench.mjs render` and `doctor`, and the Workbench self-drift pre/post receipts. Review the immutable candidate in a separate context before integration. Record actual commands and results here.

## Documentation Impact

The draft article `workbench/wiki/skills-draft/main-workflow/retro.md` (the delivered S-002L location). Step 6 may touch the skill lane's catalog entry and `workbench/skills/README.md` only as the authorized lane requires, and no manifest or Core bundle row unless the owner makes `retro` Core. Record `Docs checked; no update needed` where a control does not change.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Spec authored from the owner's draft-skills-wiki direction; planning only | Nearest behavior located at the pre anchor by reading the harness-feedback-review root skill, the feedback tooling files and the Reconciler skill; Matt's skill not read; no implementation evidence | This Spec authored; no article, skill or control written | S-002L, activation, Tasks, pending-lane authorization and all six steps remain open |

| 2026-10-06 | planning | Owner explicitly selected required Core for retro and reiterated prior writing-for-agents request; paired delivery activated, earlier arbitrary ordering and Pending lane gate superseded | Fresh origin/integration 42431879; S-002L collection and Template 2 present; catalog red observed: writing-for-agents absent from required Core | Current execution amendment and one native Task per skill | Implementation, green checks, fresh-context scenarios, review and delivery pending |

| 2026-10-06 | TK-006Z | Core source and draft comparison delivered in candidate 8925425c; independent direct-path scenario observed | Catalog red then green; Wiki validation and Ruby YAML name/description parsing pass; scenario inputs/outputs and limits under proof/ | Draft, source, shared bundle owners, generic Runbook mirror and retained archive disposition agree; existing MIT notice retained | Full 53-command suite running; independent assembled review, integration, native-host discovery, owner Human QA and main closure remain; optional Python validator unavailable |

| 2026-10-06 | TK-006Z | Independent provisional assembled review FAIL at 90ca0cc7: P2 exact pre-pair 28-skill lane policy rejected by validate and migrate; returned to diagnosis and correction within the open Task | Public-seam focused regression observed red: invalid instead of valid; prior suite interrupted after its partial results, including three dirty-source refusals | Compatibility correction preserves exact v3.2.1 transition shape only; malformed subsets and unlisted versions remain rejected | Focused green, final full suite and refreshed immutable review pending; earlier FAIL remains evidence |

| 2026-10-06 | TK-006Z | Owner corrected the excessive adaptation: restore Matt's supplied text, retaining only retro's one-line loading adapter and separate Codex invocation metadata | Source-fidelity test observed red against the earlier rewrites; prior 9a25b00c candidate passed 53/53 but that result does not certify this text revision | Runtime rules removed from the imports where existing room controls already govern; shipped notice retains MIT attribution | New source-fidelity green, fresh-context evidence and immutable verification/review refresh pending |

| 2026-10-06 | TK-006Z | Upstream-faithful source verified at 9a63801b; owner requested a Glossary/Lexicon grilling handoff, then this author stops and the package passes to a later agent | Full Runbook suite 53/53 on clean 9a63801b; source fidelity, Wiki, explicit-only metadata, migration red/green and new independent synthetic scenario passed; provisional source review has no new findings | Current evidence under proof/; earlier rewrite evidence retained as superseded; raw skill bodies unchanged except retro's one loading line | Final binding assembled review/verdict, native Task close, pr adoption after the naming inquiry, PR and integration remain; no native-host, Human QA or main claim |

## Completion Result

The paired Core implementation is complete and reverified against integration 621524d980f7990bad978c5b69910dd69b88b31d at source candidate 1c44487ad4b17845c63fdfe0333626f32d24994b: 53/53 Runbook commands passed. Catalog/fidelity, exact previous-28 compatibility, scrubbed-clone discovery adapters and Wiki validation passed. Existing direct-path scenario evidence remains applicable because the skill files are unchanged. The combined source preserves pr at the latest integration target and carries 31 Core skills; combined-cohort RED/GREEN and the final suite are recorded in the delivery evidence. Lifecycle headers and native evidence track review and integration delivery; owner Human QA and main closure remain open. Native configured-host invocation and reliability are unverified. The existing room self-drift remains visible; no clean-update claim is made.

## Supersession

None.
