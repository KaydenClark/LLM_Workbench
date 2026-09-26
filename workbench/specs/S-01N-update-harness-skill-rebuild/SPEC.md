# S-01N - update-harness skill rebuild

**Spec ID:** S-01N
**Status:** active
**Priority:** 2
**Owner:** claude-lane-C-worker
**Stance:** Builder
**Updated:** 2026-09-26
**Catalog description:** Update an adopted room to a verified Workbench version without losing room truth.
**Blockers:** none.
**Latest event:** TK-01E claimed by claude-lane-C-worker.
**Next gate:** Close TK-01E with verification and documentation proof.

> **Citation anchors.** pre=`4940233e74a93a8390f73f8ac6ba39ef53131798` post=`4940233e74a93a8390f73f8ac6ba39ef53131798`.

## Outcome

Update an adopted room to a verified Workbench version without losing room truth. This Spec owns the update-harness skill's source review, supported repair or update, focused behavioral verification and its individual Wiki article. A source change is required only when the review finds an actual gap against accepted behavior.

## Why It Matters

The prior Skills Wiki packet grouped the whole core inventory into one completion gate. A skill-sized owner lets update-harness reach a checkable destination without waiting for unrelated skill rebuilds. The article explains the result to readers; it does not instruct the agent or replace the executable source.

## Current Verified State

- `workbench/skills/update-harness/SKILL.md` is the manifest-declared core source at the pre anchor.
- `workbench/wiki/skill-update-harness.md` is not yet routed as a current skill article; its existence and links must be rechecked before authoring.
- S-00V's lane and the Template Upgrade Release Gate constrain this skill. No fresh behavioral scenario for this per-skill delivery is claimed by this planning packet.

## Desired Behavior

1. The update compares source and target state, preserves project-owned differences, installs managed changes explicitly and records rollback.
2. The canonical Workbench's own self-drift check and the target's drift check remain distinct.
3. The skill's declared source, catalog/discovery route, tests, and one routed Wiki article agree on verified current behavior, intended limits and source revision. The article gives purpose, when to use it, a concrete example, inputs/outputs, completion signs, composition, limits and governing links.

## Decisions And Contracts

- This Spec owns update-harness alone. Shared controls, manifest, catalog and the sole Wiki router are edited only as required by this skill's proven change; neighboring skill specs retain their own source and article ownership.
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
| TK-01E | Audit update-harness, deliver the smallest supported source/documentation change and prove the routed article | in-progress | none | pending |

### TK-01E - Deliver the update-harness skill destination

**Stance:** Builder

Inspect the current source, its callers/composition and relevant tests. Demonstrate the first meaningful gap at a stable seam or record that no source defect was found. Repair only the supported gap, exercise the scenario below, reconcile this skill's Wiki article and router, then record exact evidence and limits. Keep this task one skill wide.

## Acceptance Criteria

- [x] The update compares source and target state, preserves project-owned differences, installs managed changes explicitly and records rollback.
- [x] The canonical Workbench's own self-drift check and the target's drift check remain distinct.
- [x] The named scenario is observed in a fresh or otherwise independent context: An existing room updates with before/after inventories, managed-byte verification and a recoverable result.
- [x] `workbench/wiki/skill-update-harness.md` accurately distinguishes verified current behavior from remaining intended behavior, links the current source and governing owners, and is reachable from `workbench/wiki/MEMORY.md`.
- [ ] Relevant targeted tests/scenarios, Wiki validation, the required full suite, Workbench self-drift pre/post receipts and separate-context review are recorded at their proper gates; no unrun check is reported as passing.

## Testing Seams

Use the skill's public entry and its nearest source/test seam for the scenario: An existing room updates with before/after inventories, managed-byte verification and a recoverable result. Structural catalog and Wiki checks prove routing, not agent behavior. If the skill changes behavior, show red then green at the closest meaningful seam. A human review may still be needed for conversational fidelity.

## Verification Procedure

Run targeted tests for the changed source and `node workbench/tools/wiki.mjs validate`, then the current full suite in AGENTS.md. Run `node workbench/tools/spec-workbench.mjs render` and `doctor`; capture the self-drift pre/post receipts and a bounded semantic check. Review the immutable candidate separately before integration. Record actual commands and results in this Spec.

## Documentation Impact

Maintain `workbench/wiki/skill-update-harness.md` and its sole router entry alongside the skill change. Update shared controls or generic template wording only where this skill changes their meaning; record `Docs checked; no update needed` with a reason when they do not change.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-24 | planning | Owner directed one delivery Spec per skill; this Spec names update-harness's destination and first slice | Current manifest, core catalog, source presence and Wiki route inspected at pre anchor; no behavior change or scenario trial | This Spec authored; article remains future work | TK-01E and independent delivery proof remain open |
| 2026-09-24 | planning verification | Skill-sized ownership and routing checked on the isolated candidate | All 47 required AGENTS commands passed; Wiki validation and exact 21 core plus one proposed entry coverage passed; doctor has no blocking finding; pre/post self-drift at 4940233 retained the same seven pre-existing findings and cleanUpdate false | No skill source or new article authored in this planning pass | Immutable separate-context review and actual skill behavior remain open |
| 2026-09-26 | TK-01E | Audit, then two red/green cycles at the catalog seam | Audit at base `d16ef63` (blob `84a6ae7`) against `tools/workbench-upgrade.mjs`, `tools/workbench-tools.mjs`, `tools/workbench-skills.mjs`, `workbench/tools/workbench-layout.mjs` and RUNBOOK: route selection and the v2-root bullet still described the retired provider-home presence route (`skills: "presence-only"`, a user-scoped discovery root, installer refusals) although both one-time modes write `skills: "lane-install"`; no managed-byte `verify` step; the v3 route never stamped the manifest `workbenchVersion` (schema-2 `migrate` does not write it); a hardcoded `--version v3.2.1`; version read from README/BLUEPRINT; retired stable-spec and doctor-is-green wording. Red 1 at `e4d99f6` (`update-harness must not describe the retired provider-home presence route`), green at `7d7b822`. A dry run of a v3.2.0 room against `7d7b822` then showed a stamped manifest fails `validate` with `invalid-skill-policy` until `skillPolicy` matches the release; red 2 at `f1c9b4d` (`update-harness v3 route must bring the manifest skill policy to the target release with the stamp`), green at `520d860`. `test-skill-catalog`, `test-governance-core`, `test-control-fidelity`, `test-workbench-upgrade`, `test-skills-lane`, `test-workbench-tools`, `test-skill-inspection` and `test-core-skill-installer` green on the committed tree. `record-source` deliberately not required: S-00N UP-021 keeps the historical `provenance.source` | Skill source: route selection, sections 1-5 | Desired #2 (distinct self-drift) was already met at base: no source defect there |
| 2026-09-26 | TK-01E | Fresh-context scenario: one general-purpose Claude Opus 5.5 subagent given only the skill at `520d860` (in a clean release clone), a scratch Lantern room built with v3.2.0 tooling at `ee09c36` and pushed to a local bare remote, and a scripted owner | Seeded drift: room-authored AGENTS.md, room-added skill `lantern-release`, hand-edited managed `wiki.mjs`. The agent chose the v3 route; baseline red (doctor `tools-receipt-drift`), asked and used the one scripted answer (restore managed, keep backup). Before inventory 52 files hashed; both `verify` failed before (`tools-receipt-missing`, `invalid-lane`). Ran migrate, stamped `workbenchVersion` v3.2.1 plus `skillPolicy`, left `provenance.source` historical, `seed-documents`, tools `update --explicit-update` (16 changed, backup kept), skills `install` (22 plus adapters). After: both `verify` `valid`, 0 byte differences against the release; 87 files, 35 added, 15 changed, 0 removed; room AGENTS.md, `src/`, `test/`, S-001, Wiki and `lantern-release` byte-identical (implementing agent re-checked with `git diff 303cc2b 39f6ecb`, both `verify` and the remote refs). Exercised a tools rollback, found it partial, named the before commit as whole-room recovery, reapplied and re-verified. Committed `39f6ecb` on `claude/update-harness-v3.2.1`, pushed; `main`/`integration` left at `303cc2b`. Did not present doctor as self-drift | None | One run, one model, scripted owner, synthetic room, hand-edited stamp; v2-root route not exercised; not owner Human QA or a repeated trial. Tool gaps surfaced, outside this skill's lane: no stamp command, partial tools rollback that drops the earlier backup entry, no first-install skills rollback, an unrepairable `stale-seed` for a document the release no longer seeds, and pre-update tools `verify` stopping at `tools-receipt-missing` |
| 2026-09-26 | TK-01E | Gates before close | Full AGENTS suite 48/48 on committed candidate `499cf24` (log header `dirty: []`); guardrail 106.6/113 before and after with identical output, remaining recommendation the pre-existing Team coordination item (manager and subagent instructions); self-drift pre and post both `blocked`, cleanUpdate false, with the same seven pre-existing findings (stale-claim S-00Q, five stale-seed, unverified-provenance); `wiki.mjs validate` ok; `git diff --check` clean. Bounded semantic check: RUNBOOK Template Upgrade Release Gate steps 2-3, the V3 explicit upgrade section, the skills and tools lane checks, `adoption/SKILL.md`, `templates/ADOPTION.md` and the LEXICON update entries agree with the delivered source; none claims presence-only | Docs checked: RUNBOOK, BLUEPRINT, LEXICON, templates and `workbench/skills/README.md` need no update because each already describes the lane-install route and the verify and update commands, and none restates the skill's route or stamp steps. `templates/SPEC.md` still says never move a spec between status folders; that template is S-00P's lane, reported to the dispatcher | Coordination hand-backs this run: zero |

## Completion Result

TK-01E aligned `workbench/skills/update-harness/SKILL.md` with the S-00V lane-install route, managed-byte `verify` for both lanes, the manifest `workbenchVersion` and `skillPolicy` stamp with validation, the verified target version and folder-lifecycle wording, through two red/green cycles. It authored `workbench/wiki/skill-update-harness.md` and its router entry, and recorded one fresh-context scenario on a v3.2.0 room. The Spec is not complete: the separate-context review and owner Human QA of conversational fidelity remain.

## Supersession

- Supersedes: the update-harness article assignment in the unmerged oversized Skills Wiki packet, not its historical evidence.
- Superseded by: none.
