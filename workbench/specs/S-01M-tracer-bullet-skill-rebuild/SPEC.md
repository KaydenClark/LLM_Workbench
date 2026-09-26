# S-01M - tracer-bullet skill rebuild

**Spec ID:** S-01M
**Status:** active
**Priority:** 2
**Owner:** claude-lane-C-worker
**Stance:** Builder
**Updated:** 2026-09-26
**Catalog description:** Find the thinnest demonstrable end-to-end slice of a capability.
**Blockers:** none.
**Latest event:** TK-01D claimed by claude-lane-C-worker.
**Next gate:** Close TK-01D with verification and documentation proof.

> **Citation anchors.** pre=`4940233e74a93a8390f73f8ac6ba39ef53131798` post=`4940233e74a93a8390f73f8ac6ba39ef53131798`.

## Outcome

Find the thinnest demonstrable end-to-end slice of a capability. This Spec owns the tracer-bullet skill's source review, supported repair or update, focused behavioral verification and its individual Wiki article. A source change is required only when the review finds an actual gap against accepted behavior.

## Why It Matters

The prior Skills Wiki packet grouped the whole core inventory into one completion gate. A skill-sized owner lets tracer-bullet reach a checkable destination without waiting for unrelated skill rebuilds. The article explains the result to readers; it does not instruct the agent or replace the executable source.

## Current Verified State

- `workbench/skills/tracer-bullet/SKILL.md` is the manifest-declared core source at the pre anchor.
- `workbench/wiki/skill-tracer-bullet.md` is not yet routed as a current skill article; its existence and links must be rechecked before authoring.
- The Workbench extracted this discipline as a standalone skill. No fresh behavioral scenario for this per-skill delivery is claimed by this planning packet.

## Desired Behavior

1. A proposed slice reaches the relevant source, interface, documentation and proof seams for one observable result.
2. A horizontal code-only shard is revised before it becomes an assigned Task.
3. The skill's declared source, catalog/discovery route, tests, and one routed Wiki article agree on verified current behavior, intended limits and source revision. The article gives purpose, when to use it, a concrete example, inputs/outputs, completion signs, composition, limits and governing links.

## Decisions And Contracts

- **Source lineage:** Historical pinned comparison maps this skill to the vertical-slice discipline inside upstream to-tickets, not to a same-name source. The article must describe that extraction.

- This Spec owns tracer-bullet alone. Shared controls, manifest, catalog and the sole Wiki router are edited only as required by this skill's proven change; neighboring skill specs retain their own source and article ownership.
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
| TK-01D | Audit tracer-bullet, deliver the smallest supported source/documentation change and prove the routed article | in-progress | none | pending |

### TK-01D - Deliver the tracer-bullet skill destination

**Stance:** Builder

Inspect the current source, its callers/composition and relevant tests. Demonstrate the first meaningful gap at a stable seam or record that no source defect was found. Repair only the supported gap, exercise the scenario below, reconcile this skill's Wiki article and router, then record exact evidence and limits. Keep this task one skill wide.

## Acceptance Criteria

- [ ] The individual Wiki article records the supported upstream relationship and its practical local effect against a pinned source, with uncertainty visible.

- [ ] A proposed slice reaches the relevant source, interface, documentation and proof seams for one observable result.
- [ ] A horizontal code-only shard is revised before it becomes an assigned Task.
- [ ] The named scenario is observed in a fresh or otherwise independent context: A broad capability yields one narrow demo that can run before later slices.
- [ ] `workbench/wiki/skill-tracer-bullet.md` accurately distinguishes verified current behavior from remaining intended behavior, links the current source and governing owners, and is reachable from `workbench/wiki/MEMORY.md`.
- [ ] Relevant targeted tests/scenarios, Wiki validation, the required full suite, Workbench self-drift pre/post receipts and separate-context review are recorded at their proper gates; no unrun check is reported as passing.

## Testing Seams

Use the skill's public entry and its nearest source/test seam for the scenario: A broad capability yields one narrow demo that can run before later slices. Structural catalog and Wiki checks prove routing, not agent behavior. If the skill changes behavior, show red then green at the closest meaningful seam. A human review may still be needed for conversational fidelity.

## Verification Procedure

Run targeted tests for the changed source and `node workbench/tools/wiki.mjs validate`, then the current full suite in AGENTS.md. Run `node workbench/tools/spec-workbench.mjs render` and `doctor`; capture the self-drift pre/post receipts and a bounded semantic check. Review the immutable candidate separately before integration. Record actual commands and results in this Spec.

## Documentation Impact

Maintain `workbench/wiki/skill-tracer-bullet.md` and its sole router entry alongside the skill change. Update shared controls or generic template wording only where this skill changes their meaning; record `Docs checked; no update needed` with a reason when they do not change.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-24 | planning | Owner directed one delivery Spec per skill; this Spec names tracer-bullet's destination and first slice | Current manifest, core catalog, source presence and Wiki route inspected at pre anchor; no behavior change or scenario trial | This Spec authored; article remains future work | TK-01D and independent delivery proof remain open |
| 2026-09-24 | planning verification | Skill-sized ownership and routing checked on the isolated candidate | All 47 required AGENTS commands passed; Wiki validation and exact 21 core plus one proposed entry coverage passed; doctor has no blocking finding; pre/post self-drift at 4940233 retained the same seven pre-existing findings and cleanUpdate false | No skill source or new article authored in this planning pass | Immutable separate-context review and actual skill behavior remain open |
| 2026-09-26 | TK-01D | Audit, then red/green at the catalog seam | Audit at base `058f089` of `workbench/skills/tracer-bullet/SKILL.md`, its composers (`to-tasks`, `to-spec`, `builder`, `carry`), `workbench/manifest.json` and `tools/test-skill-catalog.mjs`: the source named only code layers (schema, service, interface, test), so a code-only slice with no documentation or proof seam passed its complete-path test, against Desired Behavior 1 and 2; it assigned slices to a retired "Engineer" role at a "lowest capable tier" that no current control names, where the Lexicon Task and `AGENTS.md` put the normal stance in the Task and Spec; and the portable source named the owner privately. `node tools/test-skill-catalog.mjs` failed red at `c49d77f` (`tracer-bullet complete-path and assignment contract must use documentation and proof seams`) and passed green at `8a05b9c`; `test-skill-inspection`, `test-skills-lane`, `test-core-composition` and `test-core-skill-installer` green on the committed candidate | Source counts documentation and proof seams in every complete path, re-cuts a code-only slice before it becomes an assigned Task, assigns through Task and normal-stance vocabulary, and names the owner generically | Ordering, expand-contract, context-unit sizing and the `to-tasks` hand-off: no source defect found; wording unchanged |
| 2026-09-26 | TK-01D | Fresh-context scenario: one general-purpose Claude Opus 5.5 subagent given only the tracer-bullet source and a scratch CLI room (store, core, CLI, one test, README, a five-part tag Spec), owner scripted by the implementing agent over three turns | T1 "cut S-001 into slices, write nothing yet, tell me what I could run after the first": mapped six layers from the room's files including README and a named proof, proposed five one-behavior slices with blockers and proofs, first slice (tag at add time, see tags in `list`) blocker-free with the exact demo commands, wrote nothing, asked four design questions. T2 owner offered a horizontal cut (data layer plus unit tests first and marked ready, all CLI next, README last): wrote nothing, named the room's same-slice README rule and the hidden CLI-to-storage risk, recommended the vertical cut and offered the owner's cut only as a recorded README exception. T3 "A, write them": wrote five rows, Builder stance each, first `ready`, others blocked on it, a Decisions section and one evidence row; no commit | None | One run, one model, scripted owner; no pre-change control run, so it shows the current source is followed, not that the change caused it. The room's own AGENTS.md stated the same-slice README rule. With no `to-tasks` in the room the agent wrote the approved rows itself, and it added one derived decision (tagless legacy notes load) the owner did not state. Not owner Human QA or a repeated trial |
| 2026-09-26 | TK-01D | Gates before close | Full AGENTS suite 48/48 on committed candidate `add31ef` (log header `dirty: []`); guardrail 106.6/113 before and after, output identical, remaining recommendation the pre-existing Team coordination items; self-drift pre at `790e1c0` and post at `add31ef` both `blocked`, cleanUpdate false, the same seven pre-existing attention findings with identical content; `wiki.mjs validate` ok; `git diff --check` clean. Bounded semantic check: `to-tasks`, `to-spec`, `builder` and `carry` still describe how they compose the skill accurately; the Lexicon Task entry and `AGENTS.md` documentation-ownership rule agree with the new wording; `workbench/skills/README.md` row stays accurate | `workbench/skills/tracer-bullet/SKILL.md`; new `workbench/wiki/skill-tracer-bullet.md`; one `workbench/wiki/MEMORY.md` entry and its Skills Reference intro generalized from three concept pages to core skills. Docs checked: RUNBOOK, BLUEPRINT, LEXICON, templates and `workbench/skills/README.md` need no update because none restates the tracer-bullet layer list, the Engineer assignment or the owner name, and their slice wording stays accurate | Coordination hand-backs this run: zero |

## Completion Result

Pending. Planning only; no tracer-bullet rebuild or behavioral acceptance is claimed.

## Supersession

- Supersedes: the tracer-bullet article assignment in the unmerged oversized Skills Wiki packet, not its historical evidence.
- Superseded by: none.
