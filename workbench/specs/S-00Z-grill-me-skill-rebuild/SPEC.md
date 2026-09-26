# S-00Z - grill-me skill rebuild

**Spec ID:** S-00Z
**Status:** active
**Priority:** 2
**Owner:** claude-fable-5-1
**Stance:** Builder
**Updated:** 2026-09-26
**Catalog description:** Provide a repository-owned entry point that composes grilling with notepad.
**Blockers:** none.
**Latest event:** TK-00Q closed with proof.
**Next gate:** Separate-context review of the TK-00Q candidate, then owner Human QA of conversational fidelity on `integration` before `complete S-00Z`.

> **Citation anchors.** pre=`4940233e74a93a8390f73f8ac6ba39ef53131798` post=`4940233e74a93a8390f73f8ac6ba39ef53131798`.

## Outcome

Provide a repository-owned entry point that composes grilling with notepad. This Spec owns the grill-me skill's source review, supported repair or update, focused behavioral verification and its individual Wiki article. A source change is required only when the review finds an actual gap against accepted behavior.

## Why It Matters

The prior Skills Wiki packet grouped the whole core inventory into one completion gate. A skill-sized owner lets grill-me reach a checkable destination without waiting for unrelated skill rebuilds. The article explains the result to readers; it does not instruct the agent or replace the executable source.

## Current Verified State

- No `workbench/skills/grill-me/SKILL.md` exists in the manifest-declared core lane at the pre anchor. The archived wrapper is historical source, not a current core entry.
- `workbench/wiki/skill-grill-me.md` already exists as a planning article and must be reconciled with delivered behavior.
- No current core source exists; S-00W gives the accepted composition and S-00R owns archived-source disposition. No fresh behavioral scenario for this per-skill delivery is claimed by this planning packet.

## Desired Behavior

1. Starting the entry point invokes the current grilling contract with objective-scoped notepad continuity; it preserves the caller's endpoint and never turns capture into confirmation.
2. The new source is declared in the manifest and catalog and resolves through the room's tracked discovery adapters; the archived wrapper stays historical.
3. The skill's declared source, catalog/discovery route, tests, and one routed Wiki article agree on verified current behavior, intended limits and source revision. The article gives purpose, when to use it, a concrete example, inputs/outputs, completion signs, composition, limits and governing links.

## Decisions And Contracts

- This Spec owns grill-me alone. Shared controls, manifest, catalog and the sole Wiki router are edited only as required by this skill's proven change; neighboring skill specs retain their own source and article ownership.
- A Wiki article is curated context, not instruction authority or proof of behavior. Current source and tests establish Actuality; accepted controls and this assigned Spec establish the target.
- The oversized unmerged Skills Wiki packet is planning evidence, not a live S-00V owner. S-00V now names Portable Workbench. For the shared grilling/notepad/grill-me journey, S-00W remains the design source while the individual skill Specs own delivery.

## Non-Goals

- Rebuilding another skill, changing an unrelated room or publishing to a personal catalog.
- Treating a source review, string assertion, article or green suite as owner Human QA.
- Introducing a new skill taxonomy, Wiki collection, parallel router or global installation.

## Dependencies And Blockers

The grilling and notepad contracts must be available before the composed entry is verified. Coordinate the new core inventory with S-00V's managed lane and retain S-00R's archived wrapper as historical source. A newly observed architecture, safety or public-contract choice remains an owner gate in this Spec; do not invent its answer.

## Vertical Implementation Slices

| Task | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-00Q | Audit grill-me, deliver the smallest supported source/documentation change and prove the routed article | done | none | Red/green tools/test-skill-catalog.mjs (red 3425511, green eebc034); frozen v3.2.1 row assertions in tools/test-workbench-layout.mjs; full AGENTS suite 48/48 at 7d376ad; fresh-context six-turn scenario across two subagents matched the pending, correction, separate-objective and resume contract; wiki validate ok |

### TK-00Q - Deliver the grill-me skill destination

**Stance:** Builder

Inspect the current source, its callers/composition and relevant tests. Demonstrate the first meaningful gap at a stable seam or record that no source defect was found. Repair only the supported gap, exercise the scenario below, reconcile this skill's Wiki article and router, then record exact evidence and limits. Keep this task one skill wide.

## Acceptance Criteria

- [x] Starting the entry point invokes the current grilling contract with objective-scoped notepad continuity; it preserves the caller's endpoint and never turns capture into confirmation.
- [x] The new source is declared in the manifest and catalog and resolves through the room's tracked discovery adapters; the archived wrapper stays historical.
- [x] The named scenario is observed in a fresh or otherwise independent context: A fresh start and a paused resume keep the pending readback pending, preserve corrections and allow a separate notepad objective.
- [x] `workbench/wiki/skill-grill-me.md` accurately distinguishes verified current behavior from remaining intended behavior, links the current source and governing owners, and is reachable from `workbench/wiki/MEMORY.md`.
- [ ] Relevant targeted tests/scenarios, Wiki validation, the required full suite, Workbench self-drift pre/post receipts and separate-context review are recorded at their proper gates; no unrun check is reported as passing.

## Testing Seams

Use the skill's public entry and its nearest source/test seam for the scenario: A fresh start and a paused resume keep the pending readback pending, preserve corrections and allow a separate notepad objective. Structural catalog and Wiki checks prove routing, not agent behavior. If the skill changes behavior, show red then green at the closest meaningful seam. A human review may still be needed for conversational fidelity.

## Verification Procedure

Run targeted tests for the changed source and `node workbench/tools/wiki.mjs validate`, then the current full suite in AGENTS.md. Run `node workbench/tools/spec-workbench.mjs render` and `doctor`; capture the self-drift pre/post receipts and a bounded semantic check. Review the immutable candidate separately before integration. Record actual commands and results in this Spec.

## Documentation Impact

Maintain `workbench/wiki/skill-grill-me.md` and its sole router entry alongside the skill change. Update shared controls or generic template wording only where this skill changes their meaning; record `Docs checked; no update needed` with a reason when they do not change.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-24 | planning | Owner directed one delivery Spec per skill; this Spec names grill-me's destination and first slice | Current manifest, core catalog, source presence and Wiki route inspected at pre anchor; no behavior change or scenario trial | This Spec authored; existing article retained | TK-00Q and independent delivery proof remain open |
| 2026-09-24 | planning verification | Skill-sized ownership and routing checked on the isolated candidate | All 47 required AGENTS commands passed; Wiki validation and exact 21 core plus one proposed entry coverage passed; doctor has no blocking finding; pre/post self-drift at 4940233 retained the same seven pre-existing findings and cleanUpdate false | No skill source or new article authored in this planning pass | Immutable separate-context review and actual skill behavior remain open |
| 2026-09-26 | TK-00Q | Audit, then red/green at the catalog seam with the core-bundle declaration | Audit at `147ad3f`: no core source existed; the only source was the six-line archived wrapper forwarding to grilling, outside discovery. `node tools/test-skill-catalog.mjs` failed red at `3425511` (`grill-me must be a declared core skill`) and passed green at `eebc034`. The runtime list in `workbench/tools/workbench-layout.mjs` froze the stamped v3.2.1 twenty-one-skill row as `handoffCoreSkills` and grew live `coreSkills` to 22 with `grill-me` after `handoff`, the shape `handoff` itself joined by at v3.2.0; no version bump and no waiver of the stamped-label rule. `test-workbench-layout` gained the frozen v3.2.1 row assertions and its pre-lane fixture holds the stamped 21. Targeted `test-skill-catalog`, `test-workbench-layout`, `test-core-skill-installer`, `test-skill-inspection`, `test-skills-lane`, `test-workbench-adoption` and `test-workbench-upgrade` green at `b9f51fd` | New `workbench/skills/grill-me/SKILL.md` with `disable-model-invocation: true` kept from the wrapper (owner-invoked; grilling answers the trigger phrases); manifest `skillPolicy.required`, skills README core table and the bundle-size lines in README, RUNBOOK, LEXICON and `templates/GENESIS.md` moved to 22 and eighteen workflow skills because the catalog test derives those counts from the runtime | Archived wrapper untouched; its disposition stays S-00R's decision. The core entry makes the wrapper redundant as a route: a finding for S-00R, not a change here |
| 2026-09-26 | TK-00Q | Fresh-context scenario: two general-purpose Claude Opus 5.5 subagents, each given only the grill-me, grilling and notepad sources and a scratch clone at `eebc034`, owner scripted by the implementing agent over six turns | Part A, T1 grill me on the weekly digest: listed the objective, found no note, created a grilling-type note with a six-question map (revision 1) and asked Q1 with a recommendation. T2 answer against the recommendation: `source_record-001` with question id 1 and the readback as interpretation, Q1 kept `open`, pending readback in `current.unresolved` (revision 3), one same-decision clarification, no next question. T3 not daily, weekly: `correction-001` naming `source_record-001`, revised readback still pending (revision 5), topic read returned both entries. T4 pause plus a request for a note on a retry investigation: digest note untouched, separate work-type note `job-runner-retry` created with the owner's observation marked unverified, both notes validated and read back. Part B, fresh subagent, T5 pick it back up: listed the objective, read the current view and the topic, restated the revised readback as pending, no writes, no new question. T6 Yes, that's right: `decision-001`, Q1 `locked`, `current.unresolved` cleared, note valid at revision 7, then exactly one next question with a recommendation. Both notes inspected on disk after each part matched the reports | None | One run, one model, scripted owner. The resuming agent could not check the Contract or live state because the scenario forbade reading beyond the sources, so that source step is unexercised. Not owner Human QA or a repeated trial |
| 2026-09-26 | TK-00Q | Gates before close | Full AGENTS suite 48/48 on committed candidates `b9f51fd`, `209b4ab` and `7d376ad` (read-only runner printing the candidate header, dirty list empty); guardrail 78/100 before (`c443cbd`) and after (`7d376ad`), remaining recommendations the four pre-existing Outcome-evidence items; self-drift pre at `c443cbd` and post at `7d376ad` both `blocked` with the same seven pre-existing attention findings (S-00Q stale claim, five stale seeds, one provenance) and cleanUpdate false; `wiki.mjs validate` ok; `doctor` no blocking finding; `git diff --check` clean. Bounded semantic check: BLUEPRINT already says a grilling session starts through `grill-me`; the RUNBOOK and template Behavior Selection row for deciding or stress-testing an idea now routes through `grill-me` composing grilling with notepad (`7d376ad`); the grilling and notepad sources and articles already state the same pending convention and needed no change | `workbench/wiki/skill-grill-me.md` rewritten from observed behavior, status partial to active, its `workbench/wiki/MEMORY.md` route unchanged; RUNBOOK and `templates/RUNBOOK.md` behavior row updated. Docs checked: AGENTS, BLUEPRINT, the rest of LEXICON, ADRs and the notepad and grilling articles need no update because none restates the entry point's behavior | Coordination hand-backs this run: zero |
| 2026-09-26 | TK-00Q | Task closed | Red/green tools/test-skill-catalog.mjs (red 3425511, green eebc034); frozen v3.2.1 row assertions in tools/test-workbench-layout.mjs; full AGENTS suite 48/48 at 7d376ad; fresh-context six-turn scenario across two subagents matched the pending, correction, separate-objective and resume contract; wiki validate ok | workbench/skills/grill-me/SKILL.md, workbench/manifest.json, workbench/skills/README.md, workbench/wiki/skill-grill-me.md, bundle-size lines in README, RUNBOOK, LEXICON and templates/GENESIS.md, and the RUNBOOK and templates/RUNBOOK.md behavior row; AGENTS, BLUEPRINT, ADRs and the grilling and notepad articles checked with no update needed because none restates the entry point's behavior | Separate-context candidate review; owner Human QA of conversational fidelity; installed personal skill copies not updated; archived wrapper disposition stays with S-00R; S-00W shared-journey checks TK-00L/M/N |

## Completion Result

TK-00Q delivered `workbench/skills/grill-me/SKILL.md` as the repository-owned entry composing grilling with objective-scoped notepad continuity, declared it in the runtime bundle, manifest and catalog with the v3.2.1 row frozen at twenty-one, and reconciled `workbench/wiki/skill-grill-me.md` with one fresh-context six-turn scenario. The archived wrapper stays historical under S-00R. A separate-context review is pending. The Spec is not complete: owner Human QA of conversational fidelity remains.

## Supersession

- Supersedes: the grill-me article assignment in the unmerged oversized Skills Wiki packet, not its historical evidence.
- Superseded by: none.
