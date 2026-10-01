# S-01H - implement skill rebuild

**Spec ID:** S-01H
**Status:** active
**Priority:** 2
**Owner:** codex-s01h
**Stance:** Builder
**Updated:** 2026-10-01
**Catalog description:** Deliver one eligible assigned Task through red/green and verified recovery.
**Blockers:** Configured-agent scenario pending: available host cannot initialize app-server on read-only storage.
**Latest event:** Source, article and focused proof prepared; required suite passed; configured-agent scenario remains open.
**Next gate:** Run configured-agent scenario through existing authorized host; review immutable candidate before integration.

> **Citation anchors.** pre=`4940233e74a93a8390f73f8ac6ba39ef53131798` post=`58e8f0441e1a7222d0f64fd064e814978c495194`.

## Outcome

Deliver one eligible assigned Task through red/green and verified recovery. This Spec owns the implement skill's source review, supported repair or update, focused behavioral verification and its individual Wiki article. A source change is required only when the review finds an actual gap against accepted behavior.

## Why It Matters

The prior Skills Wiki packet grouped the whole core inventory into one completion gate. A skill-sized owner lets implement reach a checkable destination without waiting for unrelated skill rebuilds. The article explains the result to readers; it does not instruct the agent or replace the executable source.

## Current Verified State

- `workbench/skills/implement/SKILL.md` is the manifest-declared core source at the pre anchor.
- `workbench/wiki/skill-implement.md` is not yet routed as a current skill article; its existence and links must be rechecked before authoring.
- S-00R distinguishes this execution job from promote/save composition. No fresh behavioral scenario for this per-skill delivery is claimed by this planning packet.

## Desired Behavior

1. The skill resolves the current Task, shows a relevant failing check, implements the smallest change, runs required proof and updates owners.
2. It does not self-approve integration, skip documentation or silently widen a Task.
3. The skill's declared source, catalog/discovery route, tests, and one routed Wiki article agree on verified current behavior, intended limits and source revision. The article gives purpose, when to use it, a concrete example, inputs/outputs, completion signs, composition, limits and governing links.

## Decisions And Contracts

- **Source lineage:** Historical pinned comparison found the build-and-check chain preserved with Workbench Task and remote recovery gates. The article must explain the added obligations.

- This Spec owns implement alone. Shared controls, manifest, catalog and the sole Wiki router are edited only as required by this skill's proven change; neighboring skill specs retain their own source and article ownership.
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

### TK-00Y - Deliver the implement skill destination

**Stance:** Builder

Inspect the current source, its callers/composition and relevant tests. Demonstrate the first meaningful gap at a stable seam or record that no source defect was found. Repair only the supported gap, exercise the scenario below, reconcile this skill's Wiki article and router, then record exact evidence and limits. Keep this task one skill wide.

## Acceptance Criteria

- [x] The individual Wiki article records the supported upstream relationship and its practical local effect against a pinned source, with uncertainty visible.

- [ ] The skill resolves the current Task, shows a relevant failing check, implements the smallest change, runs required proof and updates owners.
- [ ] It does not self-approve integration, skip documentation or silently widen a Task.
- [ ] The named scenario is observed in a fresh or otherwise independent context: A bounded Task moves from failing seam to green candidate with a reviewable commit and truthful receipt.
- [ ] `workbench/wiki/skill-implement.md` accurately distinguishes verified current behavior from remaining intended behavior, links the current source and governing owners, and is reachable from `workbench/wiki/MEMORY.md`.
- [ ] Relevant targeted tests/scenarios, Wiki validation, the required full suite, Workbench self-drift pre/post receipts and separate-context review are recorded at their proper gates; no unrun check is reported as passing.

## Testing Seams

Use the skill's public entry and its nearest source/test seam for the scenario: A bounded Task moves from failing seam to green candidate with a reviewable commit and truthful receipt. Structural catalog and Wiki checks prove routing, not agent behavior. If the skill changes behavior, show red then green at the closest meaningful seam. A human review may still be needed for conversational fidelity.

## Verification Procedure

Run targeted tests for the changed source and `node workbench/tools/wiki.mjs validate`, then the current full suite in AGENTS.md. Run `node workbench/tools/spec-workbench.mjs render` and `doctor`; capture the self-drift pre/post receipts and a bounded semantic check. Review the immutable candidate separately before integration. Record actual commands and results in this Spec.

## Documentation Impact

Maintain `workbench/wiki/skill-implement.md` and its sole router entry alongside the skill change. Update shared controls or generic template wording only where this skill changes their meaning; record `Docs checked; no update needed` with a reason when they do not change.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-24 | planning | Owner directed one delivery Spec per skill; this Spec names implement's destination and first slice | Current manifest, core catalog, source presence and Wiki route inspected at pre anchor; no behavior change or scenario trial | This Spec authored; article remains future work | TK-00Y and independent delivery proof remain open |
| 2026-09-24 | planning verification | Skill-sized ownership and routing checked on the isolated candidate | All 47 required AGENTS commands passed; Wiki validation and exact 21 core plus one proposed entry coverage passed; doctor has no blocking finding; pre/post self-drift at 4940233 retained the same seven pre-existing findings and cleanUpdate false | No skill source or new article authored in this planning pass | Immutable separate-context review and actual skill behavior remain open |

| 2026-10-01 | TK-00Y | Refreshed ownership at integration `95176a4f216cc3d684301a355d6d23369ab275a1`, descendant of supplied `3b5b76bf`; native activation retained existing TK-00Y and coordinated claim published `1bb4cf0` | No live competing claim or matching remote branch observed. Red `3a30c15`: focused checks fail missing Task-record recovery and containment; green `9d12d4c`: 2/2 pass, including real Git unpublished/descendant containment fixture | Implement now resumes Task receipts, records in-progress proof, composes save, self-checks and bounds owner handback; individual article and scenario protocol authored | Fresh configured-agent proof blocked before execution: codex exec failed to initialize in-process app-server on read-only filesystem. No credentials copied or access expanded. Independent review and publication remain pending |

| 2026-10-01 | TK-00Y | Repaired catalog compatibility and verified clean source `58e8f0441e1a7222d0f64fd064e814978c495194` | Initial suite on `588c87a` failed the catalog literal for assigned stable SPEC; the interrupted attempt is not a passing gate. Restored the established wording while clarifying stable identity rather than fixed location. All 51 distinct commands from the current AGENTS full suite and RUNBOOK Full verification plus test-implement-skill, test-delivery-skills, Wiki validation and diff check passed: 55/55 on a clean tree. Focused tests are source-contract and Git fixture proof, not agent behavior | Source/catalog compatibility restored without editing shared tests; article links source, scenario, controls and exact upstream comparison | Configured-agent scenario and separate-context review remain open; Task remains in progress |
| 2026-10-01 | TK-00Y | Self-drift and bounded semantic self-check | Pre receipt at `95176a4` and post at `588c87a` both cleanUpdate false, with identical seven pre-existing findings: stale S-00Q claim, five stale seeds, unverified provenance. Guardrail 78/100 before and after; outstanding recommendations concern repeated real outcome trials, controls/prior/candidate comparison and uncertainty. Semantic review checked Task ownership, generated projections, manifest/discovery, source callers and documented completion gates; no new shared-control or schema requirement | Docs checked; no update needed in controls, generic templates, manifest or core inventory: they already define Task receipts, review and save. Only owning source, article, Spec/Task and necessary generated routing changed. No new bundle-count or installed-behavior claim | Global drift remains with its existing owners; this is not a clean-update or reliability claim |
| 2026-10-01 | TK-00Y | Pinned upstream comparison and assembly handback | Read mattpocock/skills at `d81f3a183412e71a5b1e84ca21bc1a35eea03a60`, actual path skills/engineering/implement/SKILL.md. It prescribes supplied work, TDD where possible, regular checks, full suite, review and commit. Workbench adds assigned Task recovery, required red/green, receipts, documentation, scoped handback and verified remote recovery. No exact-copy ancestry asserted. Both normal and ephemeral configured Codex startup failed before scenario execution on read-only app-server storage; GitHub CLI API returned Forbidden | Article marks behavioral proof partial; repeatable scenario protocol prepared. PR237 `f12e6928` only appends Draft-wiki alignment in S01H; preserve that append on assembly when it lands, retaining existing TK-00Y and proof | No new IDs allocated. No new owner decision made; coordinator single grilling record was not reachable here, so parent must reconcile this factual handback there. Publication requires existing-owner route if API remains unavailable |

## Completion Result

Implementation candidate prepared for TK-00Y; configured-agent scenario, independent review and owner gates remain open. No Spec completion or installed-behavior claim.

## Supersession

- Supersedes: the implement article assignment in the unmerged oversized Skills Wiki packet, not its historical evidence.
- Superseded by: none.
