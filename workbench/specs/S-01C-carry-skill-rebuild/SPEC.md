# S-01C - carry skill rebuild

**Spec ID:** S-01C
**Status:** active
**Priority:** 2
**Owner:** claude-fable-5-1
**Stance:** Builder
**Updated:** 2026-10-01
**Catalog description:** Carry assigned work to its authorized endpoint and make genuine owner hand-backs visible.
**Blockers:** none.
**Latest event:** TK-00T closed with proof.
**Next gate:** Land the reviewed TK-00T candidate on `integration`, then owner Human QA of conversational fidelity, then `complete S-01C`.

> **Citation anchors.** pre=`4940233e74a93a8390f73f8ac6ba39ef53131798` post=`4940233e74a93a8390f73f8ac6ba39ef53131798`.

## Outcome

Carry assigned work to its authorized endpoint and make genuine owner hand-backs visible. This Spec owns the carry skill's source review, supported repair or update, focused behavioral verification and its individual Wiki article. A source change is required only when the review finds an actual gap against accepted behavior.

## Why It Matters

The prior Skills Wiki packet grouped the whole core inventory into one completion gate. A skill-sized owner lets carry reach a checkable destination without waiting for unrelated skill rebuilds. The article explains the result to readers; it does not instruct the agent or replace the executable source.

## Current Verified State

- `workbench/skills/carry/SKILL.md` is the manifest-declared core source at the pre anchor.
- `workbench/wiki/skill-carry.md` is not yet routed as a current skill article; its existence and links must be rechecked before authoring.
- Current source is long and cross-cutting; limit edits to carry's orchestration contract. No fresh behavioral scenario for this per-skill delivery is claimed by this planning packet.

## Desired Behavior

1. The skill resumes from the assigned Spec and Task, verifies live state, composes implementation and save only within the endpoint, and records routine coordination defects.
2. A missing separate-context review or owner decision stays visible; carry never manufactures approval or a new task.
3. The skill's declared source, catalog/discovery route, tests, and one routed Wiki article agree on verified current behavior, intended limits and source revision. The article gives purpose, when to use it, a concrete example, inputs/outputs, completion signs, composition, limits and governing links.

## Decisions And Contracts

- This Spec owns carry alone. Shared controls, manifest, catalog and the sole Wiki router are edited only as required by this skill's proven change; neighboring skill specs retain their own source and article ownership.
- A Wiki article is curated context, not instruction authority or proof of behavior. Current source and tests establish Actuality; accepted controls and this assigned Spec establish the target.
- The oversized unmerged Skills Wiki packet is planning evidence, not a live S-00V owner. S-00V now names Portable Workbench. For the shared grilling/notepad/grill-me journey, S-00W remains the design source while the individual skill Specs own delivery.

## Non-Goals

- Rebuilding another skill, changing an unrelated room or publishing to a personal catalog.
- Treating a source review, string assertion, article or green suite as owner Human QA.
- Introducing a new skill taxonomy, Wiki collection, parallel router or global installation.

## Dependencies And Blockers

No other skill rebuild is a blanket prerequisite. Check current controls and the relevant source owner before changing shared wording. A newly observed architecture, safety or public-contract choice remains an owner gate in this Spec; do not invent its answer.

## Vertical Implementation Slices

| Task | Slice | Status | Blockers | Proof |
|---|---|---|---|---|

### TK-00T - Deliver the carry skill destination

**Stance:** Builder

Inspect the current source, its callers/composition and relevant tests. Demonstrate the first meaningful gap at a stable seam or record that no source defect was found. Repair only the supported gap, exercise the scenario below, reconcile this skill's Wiki article and router, then record exact evidence and limits. Keep this task one skill wide.

## Acceptance Criteria

- [x] The skill resumes from the assigned Spec and Task, verifies live state, composes implementation and save only within the endpoint, and records routine coordination defects.
- [x] A missing separate-context review or owner decision stays visible; carry never manufactures approval or a new task.
- [x] The named scenario is observed in a fresh or otherwise independent context: An interrupted assigned Task reaches its reviewable result with evidence and a named remaining gate.
- [x] `workbench/wiki/skill-carry.md` accurately distinguishes verified current behavior from remaining intended behavior, links the current source and governing owners, and is reachable from `workbench/wiki/MEMORY.md`.
- [x] Relevant targeted tests/scenarios, Wiki validation, the required full suite, Workbench self-drift pre/post receipts and separate-context review are recorded at their proper gates; no unrun check is reported as passing.

## Testing Seams

Use the skill's public entry and its nearest source/test seam for the scenario: An interrupted assigned Task reaches its reviewable result with evidence and a named remaining gate. Structural catalog and Wiki checks prove routing, not agent behavior. If the skill changes behavior, show red then green at the closest meaningful seam. A human review may still be needed for conversational fidelity.

## Verification Procedure

Run targeted tests for the changed source and `node workbench/tools/wiki.mjs validate`, then the current full suite in AGENTS.md. Run `node workbench/tools/spec-workbench.mjs render` and `doctor`; capture the self-drift pre/post receipts and a bounded semantic check. Review the immutable candidate separately before integration. Record actual commands and results in this Spec.

## Documentation Impact

Maintain `workbench/wiki/skill-carry.md` and its sole router entry alongside the skill change. Update shared controls or generic template wording only where this skill changes their meaning; record `Docs checked; no update needed` with a reason when they do not change.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-24 | planning | Owner directed one delivery Spec per skill; this Spec names carry's destination and first slice | Current manifest, core catalog, source presence and Wiki route inspected at pre anchor; no behavior change or scenario trial | This Spec authored; article remains future work | TK-00T and independent delivery proof remain open |
| 2026-09-24 | planning verification | Skill-sized ownership and routing checked on the isolated candidate | All 47 required AGENTS commands passed; Wiki validation and exact 21 core plus one proposed entry coverage passed; doctor has no blocking finding; pre/post self-drift at 4940233 retained the same seven pre-existing findings and cleanUpdate false | No skill source or new article authored in this planning pass | Immutable separate-context review and actual skill behavior remain open |
| 2026-10-01 | TK-00T | Audit, then red/green at the catalog seam | Audit at `3b5b76bf`: `workbench/skills/carry/SKILL.md` composed `/implement`, `/tracer-bullet`, `/to-docs` and `/code-review` but never `save`, named no containment proof, and its recovery step read `SPEC.md`, controls, Wiki and cited source but not the Task's `TASK.md` or receipt rows, while RUNBOOK behavior selection (and templates/RUNBOOK) route delivery as carry with implement, verification, independent review and save, LEXICON defines the Task receipt as the trace an interrupted run leaves, and `workbench/wiki/skill-save.md` states the same route. Bounded caller grep over `tools/`, `workbench/tools/`, `workbench/skills/` and the manifest found no tool that parses carry output; make-it-so and handoff compose or bound it in prose only, and the installed `~/.claude/skills/carry` copy was byte-identical to the source. `node tools/test-skill-catalog.mjs` failed red at `c2400c50` (carry must resume from the Task record and compose save with containment proof must use `TASK.md`) and passed green at `aef6c158`; test-skill-inspection, test-delivery-skills, test-skills-lane and test-core-skill-installer green at `aef6c158` | Source now reads the Task record and receipt rows plus the objective notepad at recovery, names `/save` among the composed contracts, records an in-progress receipt (`receipt S-### --task TK-###`), and persists through save with `git merge-base --is-ancestor` containment proof where a failed push is pending recovery, never confirmation | Fresh-context scenario, article, full suite, self-drift post, separate-context review |
| 2026-10-01 | TK-00T | Fresh-context scenario: one general-purpose Claude Opus 5.5 subagent given only the delivered carry source text and the path of a disposable fixture room `notebook-cli` with a local bare remote; assignment S-001 TK-001 (`findNotes`), left in progress by a scripted run 1 at `41983eb`: red test and throwing stub committed and pushed, receipt row 1 (pass 1 fail 2, green pending), notepad with the next action; owner away and no reviewer available were stated conditions | The agent recovered from the receipt row and notepad without restarting the slice; found `doctor` failing on `render-drift` left by run 1 (receipt recorded without `render`) and repaired it in its owner; implemented `findNotes` green at `3357fb6` (`node --test` pass 3 fail 0) with the README example the Spec decisions require; recorded receipt row 2, pushed, closed TK-001 with proof (`931b5ae`, `b9be9ce`); after a fresh fetch proved `b9be9ce` contained in `origin/fixture/s001-tk001` with `git merge-base --is-ancestor`; stopped at the review gate naming it an Unavailable resource with BASE_SHA `31d3945` and HEAD_SHA `b9be9ce`, left acceptance boxes unchecked, and recorded zero coordination hand-backs in the S-001 evidence log. The implementing agent re-checked every claim in the room afterwards: tree clean at `b9be9ce`, tests green, receipts 1 to 3 present, blocker and next gate in the header, payload 7 files with no notepad | None | One run, one model, scripted fixture authored by the implementing agent; not owner Human QA or a repeated trial. The remote was a local bare repository. The reviewer's absence was a stated condition, not discovered. The subagent still received its host's default instructions. A first fixture attempt used `node --test test/`, which Node 26 cannot resolve, and was rebuilt before dispatch |
| 2026-10-01 | TK-00T | Gates before close | Full AGENTS suite 48/48 on committed candidate `351ef039` (log `S01C-suite-351ef039.log`, first line `dirty: []`); guardrail before and after byte-identical (78/100, only Outcome evidence missing); self-drift pre at `3b5b76bf` and post at `351ef039` both cleanUpdate false with the same seven pre-existing findings (one stale-claim on S-00Q, five stale-seed, one unverified-provenance); `wiki.mjs validate` ok; `git diff --check` clean; `render` and `doctor` no blocking finding. Bounded semantic check: RUNBOOK behavior selection and templates/RUNBOOK already route delivery as carry with implement, verification, independent review and save, so the source now agrees with them; LEXICON Coordination hand-back and `workbench/skills/README.md` row name carry's recorder and endpoint role unchanged; `workbench/wiki/skill-save.md` and `skill-make-it-so.md` describe the same composition | Docs checked: RUNBOOK, BLUEPRINT, LEXICON, README, templates and `workbench/skills/README.md` need no update because each already states the carry-with-save route or names only the skill, and none restates the recovery step this change extends | Coordination hand-backs this run: zero |
| 2026-10-01 | TK-00T | Task closed | Red/green tools/test-skill-catalog.mjs (red c2400c50, green aef6c158); targeted skill tests green; full AGENTS suite 48/48 at 351ef039; fresh-context carry of an interrupted fixture Task resumed from its receipt and notepad, reached green, closed with proof, proved remote containment, recorded zero hand-backs and stopped at the review gate naming the exact candidate; wiki validate ok | workbench/skills/carry/SKILL.md, workbench/wiki/skill-carry.md and its MEMORY.md route; RUNBOOK, BLUEPRINT, LEXICON, README, templates and skills README checked with no update needed because each already states the carry-with-save route or names only the skill | Separate-context candidate review; owner Human QA; installed personal skill copies not updated; one scripted run with one model against a local bare remote |
| 2026-10-01 | review | Review verdict: pass at c4cdb07b717a96b5593103811b2f94e9c9a190f2 [38483e05d4d4] #1 | No High/Medium/Low findings against base 3b5b76bf. Reviewer confirmed: red c2400c50 touches only the catalog test and green aef6c158 only the skill source; green tree contains Task record, receipt, /save, containment proof and pending-recovery wording; no manifest, template, RUNBOOK, LEXICON or save-skill edit; article routed once from MEMORY.md; wiki validate ok; doctor only the seven known nonblocking findings; git diff --check clean. Could not run test-skill-catalog.mjs to completion (EPERM mkdtemp in the read-only sandbox); suite 48/48 at 351ef039 taken from the builder log | Codex CLI codex exec -s read-only -m gpt-5.5, separate context from the builder; log S01C-review-c4cdb07b.log in the lane scratchpad (local, not durable) | 8 |

## Completion Result

TK-00T found carry composing `/implement`, `/tracer-bullet`, `/to-docs` and `/code-review` but never `save`, with no containment proof and a recovery step that read the Spec but not the Task record, while RUNBOOK, templates and LEXICON already described the carry-with-save route and the receipt as an interrupted run's trace. The source at `aef6c158` now resumes from `TASK.md` and its receipt rows plus the objective notepad, records an in-progress receipt, names `/save` among the composed contracts and proves containment with `git merge-base --is-ancestor`, treating a failed push as pending recovery. `tools/test-skill-catalog.mjs` pins that wording (red `c2400c50`). It authored `workbench/wiki/skill-carry.md`, routed from `workbench/wiki/MEMORY.md`, and recorded one fresh-context scenario in which an interrupted fixture Task was resumed from its receipt, carried to green, closed with proof, proved contained in its remote, and stopped at the review gate with the exact candidate named and zero hand-backs recorded. The Spec is not complete: separate-context review and landing of the candidate, then owner Human QA, remain.

## Supersession

- Supersedes: the carry article assignment in the unmerged oversized Skills Wiki packet, not its historical evidence.
- Superseded by: none.
