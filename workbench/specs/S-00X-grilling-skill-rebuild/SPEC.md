# S-00X - grilling skill rebuild

**Spec ID:** S-00X
**Status:** active
**Priority:** 2
**Owner:** claude-opus-5-5
**Stance:** Builder
**Updated:** 2026-09-24
**Catalog description:** Settle a shared design concept through one consequential question at a time.
**Blockers:** none.
**Latest event:** TK-00O closed with proof.
**Next gate:** Owner Human QA of conversational fidelity on `integration`, then `complete S-00X`.

> **Citation anchors.** pre=`4940233e74a93a8390f73f8ac6ba39ef53131798` post=`4940233e74a93a8390f73f8ac6ba39ef53131798`.

## Outcome

Settle a shared design concept through one consequential question at a time. This Spec owns the grilling skill's source review, supported repair or update, focused behavioral verification and its individual Wiki article. A source change is required only when the review finds an actual gap against accepted behavior.

## Why It Matters

The prior Skills Wiki packet grouped the whole core inventory into one completion gate. A skill-sized owner lets grilling reach a checkable destination without waiting for unrelated skill rebuilds. The article explains the result to readers; it does not instruct the agent or replace the executable source.

## Current Verified State

- `workbench/skills/grilling/SKILL.md` is the manifest-declared core source at the pre anchor.
- `workbench/wiki/skill-grilling.md` already exists as a planning article and must be reconciled with delivered behavior.
- S-00W supplies the accepted interaction contract; the source still mixes inquiry with notepad mechanics. No fresh behavioral scenario for this per-skill delivery is claimed by this planning packet.

## Desired Behavior

1. A recommendation, owner answer, pending Question / Answer / Why / Impact readback, correction and explicit confirmation occur in order; confirmed answers update only affected branches of the decision map.
2. A changed upstream premise reopens only dependent answers, and missing evidence prevents a false concept-ready verdict.
3. The skill's declared source, catalog/discovery route, tests, and one routed Wiki article agree on verified current behavior, intended limits and source revision. The article gives purpose, when to use it, a concrete example, inputs/outputs, completion signs, composition, limits and governing links.

## Decisions And Contracts

- **Source lineage:** Historical pinned comparison identified conceptual drift: the upstream grilling skill asks the ready frontier in rounds, while the accepted Workbench journey asks one question at a time. The article must name that practical difference and recheck the pinned source before claiming fidelity.

- This Spec owns grilling alone. Shared controls, manifest, catalog and the sole Wiki router are edited only as required by this skill's proven change; neighboring skill specs retain their own source and article ownership.
- A Wiki article is curated context, not instruction authority or proof of behavior. Current source and tests establish Actuality; accepted controls and this assigned Spec establish the target.
- The oversized unmerged Skills Wiki packet is planning evidence, not a live S-00V owner. S-00V now names Portable Workbench. For the shared grilling/notepad/grill-me journey, S-00W remains the design source while the individual skill Specs own delivery.

## Non-Goals

- Rebuilding another skill, changing an unrelated room or publishing to a personal catalog.
- Treating a source review, string assertion, article or green suite as owner Human QA.
- Introducing a new skill taxonomy, Wiki collection, parallel router or global installation.

## Dependencies And Blockers

S-00W supplies the accepted three-skill journey; this Spec delivers only its named skill. Coordinate the shared scenario with the other two per-skill owners. A newly observed architecture, safety or public-contract choice remains an owner gate in this Spec; do not invent its answer.

## Vertical Implementation Slices

| Task | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-00O | Audit grilling, deliver the smallest supported source/documentation change and prove the routed article | done | none | Red/green tools/test-skill-catalog.mjs (red 85858f1, green 00c88f0); full AGENTS suite 48/48 at 00c88f0; fresh-context six-turn scenario matched the interaction contract; wiki validate ok |

### TK-00O - Deliver the grilling skill destination

**Stance:** Builder

Inspect the current source, its callers/composition and relevant tests. Demonstrate the first meaningful gap at a stable seam or record that no source defect was found. Repair only the supported gap, exercise the scenario below, reconcile this skill's Wiki article and router, then record exact evidence and limits. Keep this task one skill wide.

## Acceptance Criteria

- [x] The individual Wiki article records the supported upstream relationship and its practical local effect against a pinned source, with uncertainty visible.

- [x] A recommendation, owner answer, pending Question / Answer / Why / Impact readback, correction and explicit confirmation occur in order; confirmed answers update only affected branches of the decision map.
- [x] A changed upstream premise reopens only dependent answers, and missing evidence prevents a false concept-ready verdict.
- [x] The named scenario is observed in a fresh or otherwise independent context: A fresh standalone conversation shows no next design question before confirmation and no specification transition before a confirmed final concept readback.
- [x] `workbench/wiki/skill-grilling.md` accurately distinguishes verified current behavior from remaining intended behavior, links the current source and governing owners, and is reachable from `workbench/wiki/MEMORY.md`.
- [x] Relevant targeted tests/scenarios, Wiki validation, the required full suite, Workbench self-drift pre/post receipts and separate-context review are recorded at their proper gates; no unrun check is reported as passing.

## Testing Seams

Use the skill's public entry and its nearest source/test seam for the scenario: A fresh standalone conversation shows no next design question before confirmation and no specification transition before a confirmed final concept readback. Structural catalog and Wiki checks prove routing, not agent behavior. If the skill changes behavior, show red then green at the closest meaningful seam. A human review may still be needed for conversational fidelity.

## Verification Procedure

Run targeted tests for the changed source and `node workbench/tools/wiki.mjs validate`, then the current full suite in AGENTS.md. Run `node workbench/tools/spec-workbench.mjs render` and `doctor`; capture the self-drift pre/post receipts and a bounded semantic check. Review the immutable candidate separately before integration. Record actual commands and results in this Spec.

## Documentation Impact

Maintain `workbench/wiki/skill-grilling.md` and its sole router entry alongside the skill change. Update shared controls or generic template wording only where this skill changes their meaning; record `Docs checked; no update needed` with a reason when they do not change.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-24 | planning | Owner directed one delivery Spec per skill; this Spec names grilling's destination and first slice | Current manifest, core catalog, source presence and Wiki route inspected at pre anchor; no behavior change or scenario trial | This Spec authored; existing article retained | TK-00O and independent delivery proof remain open |
| 2026-09-24 | planning verification | Skill-sized ownership and routing checked on the isolated candidate | All 47 required AGENTS commands passed; Wiki validation and exact 21 core plus one proposed entry coverage passed; doctor has no blocking finding; pre/post self-drift at 4940233 retained the same seven pre-existing findings and cleanUpdate false | No skill source or new article authored in this planning pass | Immutable separate-context review and actual skill behavior remain open |
| 2026-09-24 | TK-00O | Red/green at the catalog seam and pinned upstream recheck | `node tools/test-skill-catalog.mjs` failed red at `85858f1` (`grilling interaction contract must use Question / Recommended answer / Why / Impact`) and passed green at `00c88f0`; `test-notepads` 50/50 (the documented create command still writes the shown record), `test-project-evidence`, `test-genesis-from-decisions` and `test-skill-inspection` green. Pinned upstream `mattpocock/skills@c55ee46073ed923f86ce59a5eb3b6d895095d1b7:skills/productivity/grilling/SKILL.md` retrieved 2026-09-24: asks the whole frontier in rounds and treats an empty frontier as done | Source rebuilt; Wiki article rewritten with the upstream comparison | A `pending` question status was drafted and withdrawn before commit because `tools/genesis-from-decisions.mjs` accepts only open/tentative/locked; a pending answer is saved as a `source_record` entry instead |
| 2026-09-24 | TK-00O | Fresh-context scenario: one general-purpose Claude Opus 5.5 subagent given only the grilling source, owner scripted by the implementing agent, no notepad | T1 one question with Question / Recommended answer / Why / Impact and a provisional map. T2 owner answered against the recommendation: pending readback of the owner's answer, owner reason separated from inference, one same-decision clarification, no new design question. T3 owner correction: revised pending readback, no progression. T4 "Yes, that's right": lock, compact map change, recomputed frontier, exactly one next question. T5 owner agreed and asked for the spec: no spec; pending readback, four-part final concept readback and four named concept-changing open choices. T6 named premise change (no in-app reader): reopened only the read-detection decision, kept purpose locked, marked the confirmed summary affected | None | One run, one model, scripted owner, no notepad composition exercised; not owner Human QA or a repeated trial |
| 2026-09-24 | TK-00O | Gates before close | Full AGENTS suite 48/48 on committed candidate `00c88f0`; guardrail 78/100 before and after, remaining recommendations are the four pre-existing Outcome-evidence items; self-drift pre and post both `blocked` with the same seven pre-existing attention findings; `wiki.mjs validate` ok; `git diff --check` clean. Bounded semantic check: RUNBOOK grilling route, BLUEPRINT confirmation requirement and the grill-me/notepad articles agree with the delivered source; no other control or template repeated the retired full-question-list wording | Docs checked: RUNBOOK, BLUEPRINT, templates and `workbench/skills/README.md` need no update because their grilling wording stays accurate | Coordination hand-backs this run: zero |
| 2026-09-24 | TK-00O | Task closed | Red/green tools/test-skill-catalog.mjs (red 85858f1, green 00c88f0); full AGENTS suite 48/48 at 00c88f0; fresh-context six-turn scenario matched the interaction contract; wiki validate ok | workbench/skills/grilling/SKILL.md and workbench/wiki/skill-grilling.md; RUNBOOK, BLUEPRINT, templates and skills README checked with no update needed because their grilling wording stays accurate | Separate-context candidate review; owner Human QA of conversational fidelity; installed personal skill copies not updated; S-00W shared-journey check after S-00Y and S-00Z |
| 2026-09-24 | TK-00O review | Separate-context review of immutable candidate `18f62503107a5f15b7d07020f2f63c980d4be7ce` against base `6ae38b9`: PASS, no High/Medium/Low findings | Codex CLI `codex exec -s read-only -m gpt-5.5`; reviewer ran `wiki.mjs validate` and `git diff --check` (both pass) and checked by source review the project-evidence open-question path, genesis `open|tentative|locked` statuses, notepad `source_record`/`decision` separation, the catalog assertions and the append-only rows. A first attempt with `codex review --base` reviewed nothing because the CLI refuses a prompt together with `--base` | None | Reviewer could not re-run fixture tests in its sandbox (`EPERM` on `mkdtemp`); it compared against the implementing agent's summary of the pinned upstream text rather than fetching it. Owner Human QA remains |

## Completion Result

TK-00O delivered the interaction contract in `workbench/skills/grilling/SKILL.md` and reconciled `workbench/wiki/skill-grilling.md` with the pinned upstream comparison and one fresh-context scenario. A separate-context review passed. The Spec is not complete: owner Human QA of conversational fidelity remains.

## Supersession

- Supersedes: the grilling article assignment in the unmerged oversized Skills Wiki packet, not its historical evidence.
- Superseded by: none.
