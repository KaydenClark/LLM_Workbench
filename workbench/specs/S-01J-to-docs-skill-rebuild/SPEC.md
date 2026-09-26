# S-01J - to-docs skill rebuild

**Spec ID:** S-01J
**Status:** active
**Priority:** 2
**Owner:** claude-lane-B-w3
**Stance:** Builder
**Updated:** 2026-09-26
**Catalog description:** Route settled truth into the existing documentation owner.
**Blockers:** none.
**Latest event:** TK-01A closed with proof.
**Next gate:** Separate-context review of the TK-01A candidate, then owner Human QA of conversational fidelity on `integration`, then `complete S-01J`.

> **Citation anchors.** pre=`4940233e74a93a8390f73f8ac6ba39ef53131798` post=`4940233e74a93a8390f73f8ac6ba39ef53131798`.

## Outcome

Route settled truth into the existing documentation owner. This Spec owns the to-docs skill's source review, supported repair or update, focused behavioral verification and its individual Wiki article. A source change is required only when the review finds an actual gap against accepted behavior.

## Why It Matters

The prior Skills Wiki packet grouped the whole core inventory into one completion gate. A skill-sized owner lets to-docs reach a checkable destination without waiting for unrelated skill rebuilds. The article explains the result to readers; it does not instruct the agent or replace the executable source.

## Current Verified State

- `workbench/skills/to-docs/SKILL.md` is the manifest-declared core source at the pre anchor.
- `workbench/wiki/skill-to-docs.md` is not yet routed as a current skill article; its existence and links must be rechecked before authoring.
- S-00R owns related lifecycle wording. No fresh behavioral scenario for this per-skill delivery is claimed by this planning packet.

## Desired Behavior

1. A supported claim lands once in the Lexicon, Blueprint, Spec, ADR, Wiki or procedure owner appropriate to its job.
2. It neither restarts discovery nor creates a parallel tracker or permanent transient Spec history.
3. The skill's declared source, catalog/discovery route, tests, and one routed Wiki article agree on verified current behavior, intended limits and source revision. The article gives purpose, when to use it, a concrete example, inputs/outputs, completion signs, composition, limits and governing links.

## Decisions And Contracts

- This Spec owns to-docs alone. Shared controls, manifest, catalog and the sole Wiki router are edited only as required by this skill's proven change; neighboring skill specs retain their own source and article ownership.
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
| TK-01A | Audit to-docs, deliver the smallest supported source/documentation change and prove the routed article | done | none | Red/green tools/test-skill-catalog.mjs (red 8a27b49, green e45648e); test-wiki copied-task-state coverage unchanged and green; full AGENTS suite 48/48 at 678eb45; fresh-context scenario split a mixed finding into a Runbook step and a linking Wiki explanation, kept the pending claim in its note; wiki validate ok |

### TK-01A - Deliver the to-docs skill destination

**Stance:** Builder

Inspect the current source, its callers/composition and relevant tests. Demonstrate the first meaningful gap at a stable seam or record that no source defect was found. Repair only the supported gap, exercise the scenario below, reconcile this skill's Wiki article and router, then record exact evidence and limits. Keep this task one skill wide.

## Acceptance Criteria

- [x] A supported claim lands once in the Lexicon, Blueprint, Spec, ADR, Wiki or procedure owner appropriate to its job.
- [x] It neither restarts discovery nor creates a parallel tracker or permanent transient Spec history.
- [x] The named scenario is observed in a fresh or otherwise independent context: A mixed finding updates the operational owner and reference article without copying the same claim wholesale.
- [x] `workbench/wiki/skill-to-docs.md` accurately distinguishes verified current behavior from remaining intended behavior, links the current source and governing owners, and is reachable from `workbench/wiki/MEMORY.md`.
- [ ] Relevant targeted tests/scenarios, Wiki validation, the required full suite, Workbench self-drift pre/post receipts and separate-context review are recorded at their proper gates; no unrun check is reported as passing.

## Testing Seams

Use the skill's public entry and its nearest source/test seam for the scenario: A mixed finding updates the operational owner and reference article without copying the same claim wholesale. Structural catalog and Wiki checks prove routing, not agent behavior. If the skill changes behavior, show red then green at the closest meaningful seam. A human review may still be needed for conversational fidelity.

## Verification Procedure

Run targeted tests for the changed source and `node workbench/tools/wiki.mjs validate`, then the current full suite in AGENTS.md. Run `node workbench/tools/spec-workbench.mjs render` and `doctor`; capture the self-drift pre/post receipts and a bounded semantic check. Review the immutable candidate separately before integration. Record actual commands and results in this Spec.

## Documentation Impact

Maintain `workbench/wiki/skill-to-docs.md` and its sole router entry alongside the skill change. Update shared controls or generic template wording only where this skill changes their meaning; record `Docs checked; no update needed` with a reason when they do not change.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-24 | planning | Owner directed one delivery Spec per skill; this Spec names to-docs's destination and first slice | Current manifest, core catalog, source presence and Wiki route inspected at pre anchor; no behavior change or scenario trial | This Spec authored; article remains future work | TK-01A and independent delivery proof remain open |
| 2026-09-24 | planning verification | Skill-sized ownership and routing checked on the isolated candidate | All 47 required AGENTS commands passed; Wiki validation and exact 21 core plus one proposed entry coverage passed; doctor has no blocking finding; pre/post self-drift at 4940233 retained the same seven pre-existing findings and cleanUpdate false | No skill source or new article authored in this planning pass | Immutable separate-context review and actual skill behavior remain open |
| 2026-09-26 | TK-01A | Audit, then red/green at the catalog seam | Audit at `be918f0`: the source routed truth by job and forbade new stores and a restarted interview, but never said a claim lands once: nothing split a mixed finding, required one owner per claim or linking instead of copying (which `promote` step 2 already relies on and AGENTS Documentation Ownership states), recognized pending `source_record` meaning, forbade citing an ignored live path, kept transient working history out of the Spec, or read the changed owner back; its Wiki bullet omitted durable knowledge and the `MEMORY.md` router. `node tools/test-skill-catalog.mjs` failed red at `8a27b49` (`to-docs single-owner, pending and read-back contract must use Route each claim once`) and passed green at `e45648e`. Runtime side: `tools/test-wiki.mjs` already asserts `copied-task-state` for copied task rows and Spec evidence, so no runtime characterization or change was needed. `test-skill-inspection`, `test-core-composition`, `test-core-skill-installer`, `test-wiki` and `test-skills-lane` green on committed `e45648e` | Source states once-per-claim routing for a mixed finding, link-not-copy, pending recognition, durable-only evidence, no transient Spec history and owner read-back; Wiki bullet names durable knowledge and the router | Routing list, render/doctor finish and no-new-store rule: no defect found; their existing assertions are unchanged and green |
| 2026-09-26 | TK-01A | Fresh-context scenario: one general-purpose Claude Opus 5.5 subagent given only the to-docs source and a scratch git room (Runbook restore procedure, Wiki backups article routed from MEMORY, Lexicon, ignored note with a finding, a confirmed `decision` and a pending `source_record` in `current.unresolved`); one scripted owner turn | Owner: "The restore investigation is settled. Put what we found into the docs." It stated destinations before editing, then added the confirmed free-space check (commands and 2x threshold) as Runbook restore step 3 with a link to the explanation, and added a Wiki section explaining the temporary extraction and the 1.4x `ENOSPC` failure that links to the Runbook step instead of repeating the threshold or commands. It left the pending three-restore-points idea out of every owner and the Lexicon, did not cite the ignored note, searched tracked docs to confirm each fact appears in one owner only, and reported the missing `wiki.mjs` and `spec-workbench.mjs` commands as not run. Room hashes before/after: only `RUNBOOK.md` and the Wiki article changed; the note and Lexicon bytes are unchanged | None | One run, one model, one scripted owner turn. The room had no Spec, ADR or validator, so those routes were not exercised. The agent appended no note record naming the destinations; the to-docs source does not require it (promote does). Not owner Human QA or a repeated trial |
| 2026-09-26 | TK-01A | Gates before close | Full AGENTS suite 48/48 on committed candidate `678eb45` (header `candidate: 678eb45668da2fb1c8f408a192704bed589cc2a5 ... dirty: []`); guardrail `--path templates --include-controls` 106.6/113 before (at `be918f0`) and after (at `678eb45`), output identical, remaining recommendation the pre-existing Team coordination item; self-drift pre at `be918f0` and post at `678eb45` both `blocked`, cleanUpdate false, with the same seven pre-existing attention findings (S-00Q stale claim, five stale seeds, manifest provenance); `wiki.mjs validate` ok; `git diff --check` clean; render and doctor no blocking finding. Bounded semantic check: AGENTS Documentation Ownership (mixed finding, each claim once), the RUNBOOK behavior-selection row, the `promote` and `save` sources, and the notepad and promote pending convention agree with the delivered source | Docs checked: AGENTS, RUNBOOK, LEXICON, BLUEPRINT, templates and `workbench/skills/README.md` need no update because their to-docs wording (catalog line, behavior-selection row) stays accurate and none restates the routing rules | Coordination hand-backs this run: zero |
| 2026-09-26 | TK-01A | Task closed | Red/green tools/test-skill-catalog.mjs (red 8a27b49, green e45648e); test-wiki copied-task-state coverage unchanged and green; full AGENTS suite 48/48 at 678eb45; fresh-context scenario split a mixed finding into a Runbook step and a linking Wiki explanation, kept the pending claim in its note; wiki validate ok | workbench/skills/to-docs/SKILL.md, workbench/wiki/skill-to-docs.md and its workbench/wiki/MEMORY.md entry, tools/test-skill-catalog.mjs; AGENTS, RUNBOOK, LEXICON, BLUEPRINT, templates and skills README checked with no update needed because their to-docs wording stays accurate and none restates the routing rules | Separate-context candidate review; owner Human QA of conversational fidelity; installed personal skill copies not updated; routing list names current owner files and should be rechecked when S-00P publishes its control rewrite and S-00R its lifecycle wording |

## Completion Result

TK-01A stated once-per-claim routing for a mixed finding, link-not-copy, pending recognition, durable-only evidence, no transient Spec history and owner read-back in `workbench/skills/to-docs/SKILL.md`. It found no runtime defect; the Wiki validator's existing copied-task-state test covers the runtime side. It authored `workbench/wiki/skill-to-docs.md`, routed from `workbench/wiki/MEMORY.md`, with one fresh-context scenario. The Spec is not complete: the separate-context review and owner Human QA of conversational fidelity remain.

## Supersession

- Supersedes: the to-docs article assignment in the unmerged oversized Skills Wiki packet, not its historical evidence.
- Superseded by: none.
