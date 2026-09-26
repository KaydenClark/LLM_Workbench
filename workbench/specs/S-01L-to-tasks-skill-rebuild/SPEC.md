# S-01L - to-tasks skill rebuild

**Spec ID:** S-01L
**Status:** active
**Priority:** 2
**Owner:** claude-lane-G-worker
**Stance:** Builder
**Updated:** 2026-09-26
**Catalog description:** Cut one assigned Spec into dependency-aware Task records.
**Blockers:** none.
**Latest event:** TK-01C claimed by claude-lane-G-worker.
**Next gate:** Close TK-01C with verification and documentation proof.

> **Citation anchors.** pre=`4940233e74a93a8390f73f8ac6ba39ef53131798` post=`4940233e74a93a8390f73f8ac6ba39ef53131798`.

## Outcome

Cut one assigned Spec into dependency-aware Task records. This Spec owns the to-tasks skill's source review, supported repair or update, focused behavioral verification and its individual Wiki article. A source change is required only when the review finds an actual gap against accepted behavior.

## Why It Matters

The prior Skills Wiki packet grouped the whole core inventory into one completion gate. A skill-sized owner lets to-tasks reach a checkable destination without waiting for unrelated skill rebuilds. The article explains the result to readers; it does not instruct the agent or replace the executable source.

## Current Verified State

- `workbench/skills/to-tasks/SKILL.md` is the manifest-declared core source at the pre anchor.
- `workbench/wiki/skill-to-tasks.md` is not yet routed as a current skill article; its existence and links must be rechecked before authoring.
- S-00H owns the standalone Task record contract. No fresh behavioral scenario for this per-skill delivery is claimed by this planning packet.

## Desired Behavior

1. Each Task is one bounded vertical slice with a named destination, dependency, stance and checkable proof.
2. The Taskboard is a projection; no external tracker or standalone objective is invented.
3. The skill's declared source, catalog/discovery route, tests, and one routed Wiki article agree on verified current behavior, intended limits and source revision. The article gives purpose, when to use it, a concrete example, inputs/outputs, completion signs, composition, limits and governing links.

## Decisions And Contracts

- **Source lineage:** Historical pinned comparison maps this skill to upstream to-tickets by concept and lineage, not as a callable alias. The article must explain the name and owner change.

- This Spec owns to-tasks alone. Shared controls, manifest, catalog and the sole Wiki router are edited only as required by this skill's proven change; neighboring skill specs retain their own source and article ownership.
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
| TK-01C | Audit to-tasks, deliver the smallest supported source/documentation change and prove the routed article | in-progress | none | pending |

### TK-01C - Deliver the to-tasks skill destination

**Stance:** Builder

Inspect the current source, its callers/composition and relevant tests. Demonstrate the first meaningful gap at a stable seam or record that no source defect was found. Repair only the supported gap, exercise the scenario below, reconcile this skill's Wiki article and router, then record exact evidence and limits. Keep this task one skill wide.

## Acceptance Criteria

- [x] The individual Wiki article records the supported upstream relationship and its practical local effect against a pinned source, with uncertainty visible.

- [x] Each Task is one bounded vertical slice with a named destination, dependency, stance and checkable proof.
- [x] The Taskboard is a projection; no external tracker or standalone objective is invented.
- [x] The named scenario is observed in a fresh or otherwise independent context: A large capability becomes independently executable slices and the next eligible Task is unambiguous.
- [x] `workbench/wiki/skill-to-tasks.md` accurately distinguishes verified current behavior from remaining intended behavior, links the current source and governing owners, and is reachable from `workbench/wiki/MEMORY.md`.
- [ ] Relevant targeted tests/scenarios, Wiki validation, the required full suite, Workbench self-drift pre/post receipts and separate-context review are recorded at their proper gates; no unrun check is reported as passing.

## Testing Seams

Use the skill's public entry and its nearest source/test seam for the scenario: A large capability becomes independently executable slices and the next eligible Task is unambiguous. Structural catalog and Wiki checks prove routing, not agent behavior. If the skill changes behavior, show red then green at the closest meaningful seam. A human review may still be needed for conversational fidelity.

## Verification Procedure

Run targeted tests for the changed source and `node workbench/tools/wiki.mjs validate`, then the current full suite in AGENTS.md. Run `node workbench/tools/spec-workbench.mjs render` and `doctor`; capture the self-drift pre/post receipts and a bounded semantic check. Review the immutable candidate separately before integration. Record actual commands and results in this Spec.

## Documentation Impact

Maintain `workbench/wiki/skill-to-tasks.md` and its sole router entry alongside the skill change. Update shared controls or generic template wording only where this skill changes their meaning; record `Docs checked; no update needed` with a reason when they do not change.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-24 | planning | Owner directed one delivery Spec per skill; this Spec names to-tasks's destination and first slice | Current manifest, core catalog, source presence and Wiki route inspected at pre anchor; no behavior change or scenario trial | This Spec authored; article remains future work | TK-01C and independent delivery proof remain open |
| 2026-09-24 | planning verification | Skill-sized ownership and routing checked on the isolated candidate | All 47 required AGENTS commands passed; Wiki validation and exact 21 core plus one proposed entry coverage passed; doctor has no blocking finding; pre/post self-drift at 4940233 retained the same seven pre-existing findings and cleanUpdate false | No skill source or new article authored in this planning pass | Immutable separate-context review and actual skill behavior remain open |
| 2026-09-26 | TK-01C | Audit, then red/green at the catalog seam; runtime probed, not changed | Audit at `d16ef63` (rebased onto `ee1f3eb`): `workbench/skills/to-tasks/SKILL.md` omitted `Stance` from the record fields and never stated the `# TK-### - <slice>` title line the parser requires (`workbench/tools/task-record.mjs`); it always stopped for approval, against ADR-0045 inherited scope; it had no rule for when Tasks are cut, although the owner's locked answer E-4B (`workbench/wiki/grilling-destination-audit-ledger.json`) says Tasks are cut at activation from live Actuality and a new planned Spec gets none; and it said to keep owner decisions visible as blockers, which a record's `Blockers` field cannot hold. Callers checked: RUNBOOK and templates/RUNBOOK behavior rows, make-it-so, to-spec, tracer-bullet, skills README, manifest, workbench-layout rename map. `node tools/test-skill-catalog.mjs` failed red at `91bb65b` (`to-tasks record, activation, approval and owner-gate contract must use **Stance:**`) and passed green at `fde45b8`; `test-skill-inspection` 5/5 and `node --test tools/test-delivery-skills.mjs` 3/3 green; the example record in the source parses through `parseTaskRecord`. Runtime probes in a throwaway copy of the scenario room: `Blockers: OD-1` fails with `invalid blocker id: OD-1`; a record declared `blocked` with `Blockers: none` is returned by `next --json` as `ready`; `convert-tasks S-0A2` on a planned Spec refuses (`S-0A2 is planned, not active`) | Source states the activation rule (planned Spec gets no Tasks; no `convert-tasks` on it; pre-cut Tasks stay), the title line, a `Stance` field with a parsed example record, approval only when planning authority is missing (ADR-0045), and option (a) for owner gates: leave the gated slice uncut and record the open decision in the Spec | Runtime gaps owned by the lifecycle lane (S-00J/S-00I/S-00P), not this skill, recorded verbatim: 1. a Task record cannot express an owner-decision blocker; 2. a declared `blocked` with blockers `none` recomputes to `ready`; 3. `convert-tasks` refuses planned Specs. Also stale: the TT-Q10 comment in `workbench/tools/task-record.mjs` calls the ID form open, while LEXICON and the ledger record it answered (keep `TK-`). Owner hand-action outside repo scope: the stale installed `~/.agents/skills/to-tickets` copy still writes the retired table-row format. Cross-skill tension for to-spec's owner (S-01K): `to-spec` still seeds one tracer-bullet row into a new planned Spec, against E-4B |
| 2026-09-26 | TK-01C | Fresh-context scenario: one general-purpose Claude Opus 5.5 subagent given only the delivered to-tasks source inside a disposable `workbench-layout.mjs init` room `ledger-lite` pinned at `ebb0e9a82e8a831ffe89e610f7523f08500e14e7`; owner scripted by the implementing agent in one turn | Room: active record-backed S-0A1 (CSV export; TK-0A1 done; three open acceptance lines, one gated on unanswered owner decision OD-1 recorded in `Dependencies And Blockers`) and planned S-0A2 (PDF statement; one legacy `ready` table row); `next --json` returned null before the run. Owner turn: "Please cut S-0A1 and S-0A2 into Tasks." with a scripted "Approved as proposed" available if asked. The agent read the skill, both Specs and the source, ran `doctor`, `next`, `show`, `npm test` and `next-id` twice (TK-00A, TK-00B), wrote `tasks/TK-00A/TASK.md` (`--all` export, ready, Blockers none) and `tasks/TK-00B/TASK.md` (inclusive date range with a named malformed-date error, `blocked` by TK-00A because both rewrite the same argument parsing), each with title, Stance Builder, a `spec-acceptance:` Destination and Planned verification; left the OD-1 amount-format slice uncut and added a sentence saying so to the Spec, kept the Spec `**Blockers:**` at none because OD-1 does not hold the whole Spec, updated Latest event and Next gate, wrote nothing for S-0A2 and did not run `convert-tasks`, then ran `render` and `doctor`. It asked no approval question, reading the owner's request as the authority under step 3. Independent check by the implementing agent afterwards: `show S-0A1 --json` parsed all three records; `render` and `doctor` no blocking finding (only `untracked-controls` for the two uncommitted records); `next --json` returned exactly TK-00A; S-0A2 byte-unchanged | None | One run, one model, scripted owner; not owner Human QA or a repeated trial. The subagent still received its host's default instructions. The approval question was not exercised because the agent treated the request as authorization. The agent reported that the skill does not name `blocked` as the status for an ID-blocked Task, does not say whether to update the Spec header after cutting, and does not say whether to commit the new records |
| 2026-09-26 | TK-01C | Gates before close | Full AGENTS suite 48/48 on committed candidates `32916cd` and, after rebasing onto `ee1f3eb`, `594dc1a` (log `G-s01l-594dc1a.log`, first line `dirty: []`); guardrail before and after byte-identical (templates 106.6/113, only Team coordination missing); self-drift pre at `240ce60` and post at `594dc1a` both `blocked`, cleanUpdate false, with the same seven pre-existing findings (one stale-claim on S-00Q, five stale-seed, one unverified-provenance); `wiki.mjs validate` ok; `test-wiki` 13/13; `git diff --check ee1f3eb 594dc1a` clean; `render` and `doctor` no blocking finding. Bounded semantic check: LEXICON Task row (vertical slice, own state and blocking relationships, TK prefix) agrees; BLUEPRINT and templates LEXICON/BLUEPRINT do not restate the decomposition rules; `workbench/skills/README.md` catalog row unchanged and accurate; RUNBOOK and templates/RUNBOOK behavior row "Write specifications only: `to-spec` and needed `to-tasks`" stays true because "needed" covers a Spec activated in the same request, but reads more precisely as "`to-spec`, plus `to-tasks` only for a Spec activated by the same request" | Docs checked: RUNBOOK, BLUEPRINT, LEXICON, templates and `workbench/skills/README.md` need no update because none restates the activation, approval, stance-field or owner-gate rules and their wording stays accurate; `workbench/wiki/skill-to-tasks.md` created with its MEMORY.md route | Optional control wording for the S-00P controls lane (not edited here): the RUNBOOK/templates RUNBOOK behavior row quoted to the left. Coordination hand-backs this run: zero |

## Completion Result

TK-01C stated in `workbench/skills/to-tasks/SKILL.md` that Tasks are cut at activation and a planned Spec gets none, gave the record its title line and `Stance` field with a parsed example, made approval conditional on missing planning authority (ADR-0045), and replaced "owner decisions as blockers" with leaving an owner-gated slice uncut and recording the decision in the Spec. It did not change the runtime; three runtime gaps are recorded for the lifecycle lane. It authored `workbench/wiki/skill-to-tasks.md`, routed from `workbench/wiki/MEMORY.md`, including the to-tickets rename, and recorded one fresh-context scenario. The Spec is not complete: the separate-context review and owner Human QA remain.

## Supersession

- Supersedes: the to-tasks article assignment in the unmerged oversized Skills Wiki packet, not its historical evidence.
- Superseded by: none.
