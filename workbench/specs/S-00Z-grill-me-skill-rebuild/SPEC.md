# S-00Z - grill-me skill rebuild

**Spec ID:** S-00Z
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-24
**Catalog description:** Provide a repository-owned entry point that composes grilling with notepad.
**Blockers:** none for planning; implementation is not assigned.
**Latest event:** Per-skill destination extracted from the oversized Skills Wiki packet and current core inventory.
**Next gate:** Review this skill's existing behavior, then activate TK-00Q for this skill only.

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
| TK-00Q | Audit grill-me, deliver the smallest supported source/documentation change and prove the routed article | ready | none | pending |

### TK-00Q - Deliver the grill-me skill destination

**Stance:** Builder

Inspect the current source, its callers/composition and relevant tests. Demonstrate the first meaningful gap at a stable seam or record that no source defect was found. Repair only the supported gap, exercise the scenario below, reconcile this skill's Wiki article and router, then record exact evidence and limits. Keep this task one skill wide.

## Acceptance Criteria

- [ ] Starting the entry point invokes the current grilling contract with objective-scoped notepad continuity; it preserves the caller's endpoint and never turns capture into confirmation.
- [ ] The new source is declared in the manifest and catalog and resolves through the room's tracked discovery adapters; the archived wrapper stays historical.
- [ ] The named scenario is observed in a fresh or otherwise independent context: A fresh start and a paused resume keep the pending readback pending, preserve corrections and allow a separate notepad objective.
- [ ] `workbench/wiki/skill-grill-me.md` accurately distinguishes verified current behavior from remaining intended behavior, links the current source and governing owners, and is reachable from `workbench/wiki/MEMORY.md`.
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

## Completion Result

Pending. Planning only; no grill-me rebuild or behavioral acceptance is claimed.

## Supersession

- Supersedes: the grill-me article assignment in the unmerged oversized Skills Wiki packet, not its historical evidence.
- Superseded by: none.
