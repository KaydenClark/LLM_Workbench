# S-00Y - notepad skill rebuild

**Spec ID:** S-00Y
**Status:** active
**Priority:** 2
**Owner:** claude-opus-5-5
**Stance:** Builder
**Updated:** 2026-09-24
**Catalog description:** Preserve one objective's working context in revision-checked JSON without making it authority.
**Blockers:** none.
**Latest event:** TK-00P closed with proof.
**Next gate:** Separate-context review of the TK-00P candidate, then owner Human QA of conversational fidelity on `integration`, then `complete S-00Y`.

> **Citation anchors.** pre=`4940233e74a93a8390f73f8ac6ba39ef53131798` post=`4940233e74a93a8390f73f8ac6ba39ef53131798`.

## Outcome

Preserve one objective's working context in revision-checked JSON without making it authority. This Spec owns the notepad skill's source review, supported repair or update, focused behavioral verification and its individual Wiki article. A source change is required only when the review finds an actual gap against accepted behavior.

## Why It Matters

The prior Skills Wiki packet grouped the whole core inventory into one completion gate. A skill-sized owner lets notepad reach a checkable destination without waiting for unrelated skill rebuilds. The article explains the result to readers; it does not instruct the agent or replace the executable source.

## Current Verified State

- `workbench/skills/notepad/SKILL.md` is the manifest-declared core source at the pre anchor.
- `workbench/wiki/skill-notepad.md` already exists as a planning article and must be reconciled with delivered behavior.
- S-046 owns the runtime foundation; S-00W defines only the composition need. No fresh behavioral scenario for this per-skill delivery is claimed by this planning packet.

## Desired Behavior

1. An unrelated objective can create, resume, correct and trim its note; pending and confirmed meaning remain distinguishable when a design inquiry uses the same primitive.
2. Privacy scanning, correction links, revision checks, local collection routing and dependency-preserving cleanup continue to hold.
3. The skill's declared source, catalog/discovery route, tests, and one routed Wiki article agree on verified current behavior, intended limits and source revision. The article gives purpose, when to use it, a concrete example, inputs/outputs, completion signs, composition, limits and governing links.

## Decisions And Contracts

- This Spec owns notepad alone. Shared controls, manifest, catalog and the sole Wiki router are edited only as required by this skill's proven change; neighboring skill specs retain their own source and article ownership.
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
| TK-00P | Audit notepad, deliver the smallest supported source/documentation change and prove the routed article | done | none | Red/green tools/test-skill-catalog.mjs (red 59ed5f1, green 8b00ddd); test-notepads 51/51 with pending/correction/decision characterization; full AGENTS suite 48/48 at 32bff51; fresh-context three-turn scenario matched the corrected-resume recheck and pending-versus-confirmed contract; wiki validate ok |

### TK-00P - Deliver the notepad skill destination

**Stance:** Builder

Inspect the current source, its callers/composition and relevant tests. Demonstrate the first meaningful gap at a stable seam or record that no source defect was found. Repair only the supported gap, exercise the scenario below, reconcile this skill's Wiki article and router, then record exact evidence and limits. Keep this task one skill wide.

## Acceptance Criteria

- [x] An unrelated objective can create, resume, correct and trim its note; pending and confirmed meaning remain distinguishable when a design inquiry uses the same primitive.
- [x] Privacy scanning, correction links, revision checks, local collection routing and dependency-preserving cleanup continue to hold.
- [x] The named scenario is observed in a fresh or otherwise independent context: A resume from a corrected entry returns the original and correction, then rechecks live state before relying on either.
- [x] `workbench/wiki/skill-notepad.md` accurately distinguishes verified current behavior from remaining intended behavior, links the current source and governing owners, and is reachable from `workbench/wiki/MEMORY.md`.
- [ ] Relevant targeted tests/scenarios, Wiki validation, the required full suite, Workbench self-drift pre/post receipts and separate-context review are recorded at their proper gates; no unrun check is reported as passing.

## Testing Seams

Use the skill's public entry and its nearest source/test seam for the scenario: A resume from a corrected entry returns the original and correction, then rechecks live state before relying on either. Structural catalog and Wiki checks prove routing, not agent behavior. If the skill changes behavior, show red then green at the closest meaningful seam. A human review may still be needed for conversational fidelity.

## Verification Procedure

Run targeted tests for the changed source and `node workbench/tools/wiki.mjs validate`, then the current full suite in AGENTS.md. Run `node workbench/tools/spec-workbench.mjs render` and `doctor`; capture the self-drift pre/post receipts and a bounded semantic check. Review the immutable candidate separately before integration. Record actual commands and results in this Spec.

## Documentation Impact

Maintain `workbench/wiki/skill-notepad.md` and its sole router entry alongside the skill change. Update shared controls or generic template wording only where this skill changes their meaning; record `Docs checked; no update needed` with a reason when they do not change.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-24 | planning | Owner directed one delivery Spec per skill; this Spec names notepad's destination and first slice | Current manifest, core catalog, source presence and Wiki route inspected at pre anchor; no behavior change or scenario trial | This Spec authored; existing article retained | TK-00P and independent delivery proof remain open |
| 2026-09-24 | planning verification | Skill-sized ownership and routing checked on the isolated candidate | All 47 required AGENTS commands passed; Wiki validation and exact 21 core plus one proposed entry coverage passed; doctor has no blocking finding; pre/post self-drift at 4940233 retained the same seven pre-existing findings and cleanUpdate false | No skill source or new article authored in this planning pass | Immutable separate-context review and actual skill behavior remain open |
| 2026-09-24 | TK-00P | Audit, then red/green at the catalog seam with a runtime characterization | Audit at `02e9823`: the runtime already returns a correction with its original on topic and entry reads, but the source never said how a design inquiry keeps pending and confirmed meaning apart, and its resume step read only the current view, which carries no entries. `node tools/test-skill-catalog.mjs` failed red at `59ed5f1` (`notepad pending and correction contract must use --kind source_record`) and passed green at `8b00ddd`. New `test-notepads` case "a design inquiry keeps a pending answer, its correction and the confirmed decision apart on resume" passed at `59ed5f1` before any change: no runtime defect found. `test-notepads` 51/51; `test-skill-inspection`, `test-project-evidence` and `test-genesis-from-decisions` green; `test-core-skill-installer` failed only on the dirty tree and passed 27/27 once committed | Source states the pending convention (`source_record` + `current.unresolved`, only a `decision` confirms) and the corrected-resume recheck | Privacy scanning, revision checks, collection routing and dependency-preserving cleanup: no source defect found; their existing tests are unchanged and green |
| 2026-09-24 | TK-00P | Fresh-context scenario: one general-purpose Claude Opus 5.5 subagent given only the notepad source and a scratch room, owner scripted by the implementing agent over three turns | T1 "pick the retry investigation back up": read the current view, then all entries, receiving `finding-001` (limit 3 in config) and its `correction-001` (limit 5 hard-coded). Before acting it opened the live code, which set neither (environment variable with fallback 4), appended `correction-002` linked to `correction-001`, then made the planned change, verified it, updated the current view and read it back. T2 "what did I decide about the welcome email?": found a pending `source_record` with a corrected readback and no `decision`; answered that nothing was decided, gave the corrected readback and waited, with no writes. T3 "Yes, that's right": appended `decision-001` with question ID 1, cleared `current.unresolved`, read back at revision 6 | None | One run, one model, scripted owner. The agent read all entries rather than one topic (both routes carry corrections). Not owner Human QA or a repeated trial |
| 2026-09-24 | TK-00P | Gates before close | Full AGENTS suite 48/48 on committed candidate `32bff51`; guardrail 78/100 before and after, remaining recommendations the four pre-existing Outcome-evidence items; self-drift pre and post both `blocked` with the same seven pre-existing attention findings; `wiki.mjs validate` ok; `git diff --check` clean. Bounded semantic check: the RUNBOOK notepad section (kinds, resume, correction retrieval), the RUNBOOK behavior route, and the grilling and grill-me articles agree with the delivered source; the grilling source already states the same pending convention | Docs checked: RUNBOOK, BLUEPRINT, LEXICON, templates and `workbench/skills/README.md` need no update because none restates the pending convention or the resume read, and their notepad wording stays accurate | Coordination hand-backs this run: zero |
| 2026-09-24 | TK-00P | Task closed | Red/green tools/test-skill-catalog.mjs (red 59ed5f1, green 8b00ddd); test-notepads 51/51 with pending/correction/decision characterization; full AGENTS suite 48/48 at 32bff51; fresh-context three-turn scenario matched the corrected-resume recheck and pending-versus-confirmed contract; wiki validate ok | workbench/skills/notepad/SKILL.md and workbench/wiki/skill-notepad.md; RUNBOOK, BLUEPRINT, LEXICON, templates and skills README checked with no update needed because none restates the pending convention or resume read and their notepad wording stays accurate | Separate-context candidate review; owner Human QA of conversational fidelity; installed personal skill copies not updated; S-00W shared-journey check after S-00Z |

## Completion Result

TK-00P stated the pending-versus-confirmed convention and the corrected-resume recheck in `workbench/skills/notepad/SKILL.md`. It found no runtime defect and added a runtime characterization. It also reconciled `workbench/wiki/skill-notepad.md` with one fresh-context scenario. The Spec is not complete: the separate-context review and owner Human QA of conversational fidelity remain.

## Supersession

- Supersedes: the notepad article assignment in the unmerged oversized Skills Wiki packet, not its historical evidence.
- Superseded by: none.
