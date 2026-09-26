# S-01K - to-spec skill rebuild

**Spec ID:** S-01K
**Status:** active
**Priority:** 2
**Owner:** claude-lane-C-worker
**Stance:** Builder
**Updated:** 2026-09-26
**Catalog description:** Turn a settled capability decision into one stable, bounded Spec.
**Blockers:** none.
**Latest event:** TK-01B closed with proof.
**Next gate:** Separate-context review of the TK-01B candidate, then owner Human QA of conversational fidelity on `integration`, then `complete S-01K`.

> **Citation anchors.** pre=`4940233e74a93a8390f73f8ac6ba39ef53131798` post=`4940233e74a93a8390f73f8ac6ba39ef53131798`.

## Outcome

Turn a settled capability decision into one stable, bounded Spec. This Spec owns the to-spec skill's source review, supported repair or update, focused behavioral verification and its individual Wiki article. A source change is required only when the review finds an actual gap against accepted behavior.

## Why It Matters

The prior Skills Wiki packet grouped the whole core inventory into one completion gate. A skill-sized owner lets to-spec reach a checkable destination without waiting for unrelated skill rebuilds. The article explains the result to readers; it does not instruct the agent or replace the executable source.

## Current Verified State

- `workbench/skills/to-spec/SKILL.md` is the manifest-declared core source at the pre anchor.
- `workbench/wiki/skill-to-spec.md` is not yet routed as a current skill article; its existence and links must be rechecked before authoring.
- This per-skill split is the present owner correction to the oversized Skills Wiki packet. No fresh behavioral scenario for this per-skill delivery is claimed by this planning packet.

## Desired Behavior

1. The skill reuses an existing owner or allocates one visible ID, records acceptance and evidence seams, and leaves unresolved choices open.
2. One spec owns one capability; the instruction never bundles every skill into one delivery owner.
3. The skill's declared source, catalog/discovery route, tests, and one routed Wiki article agree on verified current behavior, intended limits and source revision. The article gives purpose, when to use it, a concrete example, inputs/outputs, completion signs, composition, limits and governing links.

## Decisions And Contracts

- **Source lineage:** Historical pinned comparison found the settled-conversation-to-spec concept preserved; external tracker publication is outside the Workbench contract. The article must explain that change.

- This Spec owns to-spec alone. Shared controls, manifest, catalog and the sole Wiki router are edited only as required by this skill's proven change; neighboring skill specs retain their own source and article ownership.
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
| TK-01B | Audit to-spec, deliver the smallest supported source/documentation change and prove the routed article | done | none | Red/green tools/test-skill-catalog.mjs (red 5903e05, green 4c872ca); full AGENTS suite 48/48 at 9d8963b and c4d9e12; fresh-context three-turn scenario produced one planned unclaimed Spec with one first slice and an open owner gate, declined to bundle a second capability, implemented nothing; wiki validate ok |

### TK-01B - Deliver the to-spec skill destination

**Stance:** Builder

Inspect the current source, its callers/composition and relevant tests. Demonstrate the first meaningful gap at a stable seam or record that no source defect was found. Repair only the supported gap, exercise the scenario below, reconcile this skill's Wiki article and router, then record exact evidence and limits. Keep this task one skill wide.

## Acceptance Criteria

- [x] The individual Wiki article records the supported upstream relationship and its practical local effect against a pinned source, with uncertainty visible.

- [x] The skill reuses an existing owner or allocates one visible ID, records acceptance and evidence seams, and leaves unresolved choices open.
- [x] One spec owns one capability; the instruction never bundles every skill into one delivery owner.
- [x] The named scenario is observed in a fresh or otherwise independent context: A per-skill planning request yields one manifest-routed Spec with a small first slice and no implementation claim.
- [x] `workbench/wiki/skill-to-spec.md` accurately distinguishes verified current behavior from remaining intended behavior, links the current source and governing owners, and is reachable from `workbench/wiki/MEMORY.md`.
- [ ] Relevant targeted tests/scenarios, Wiki validation, the required full suite, Workbench self-drift pre/post receipts and separate-context review are recorded at their proper gates; no unrun check is reported as passing.

## Testing Seams

Use the skill's public entry and its nearest source/test seam for the scenario: A per-skill planning request yields one manifest-routed Spec with a small first slice and no implementation claim. Structural catalog and Wiki checks prove routing, not agent behavior. If the skill changes behavior, show red then green at the closest meaningful seam. A human review may still be needed for conversational fidelity.

## Verification Procedure

Run targeted tests for the changed source and `node workbench/tools/wiki.mjs validate`, then the current full suite in AGENTS.md. Run `node workbench/tools/spec-workbench.mjs render` and `doctor`; capture the self-drift pre/post receipts and a bounded semantic check. Review the immutable candidate separately before integration. Record actual commands and results in this Spec.

## Documentation Impact

Maintain `workbench/wiki/skill-to-spec.md` and its sole router entry alongside the skill change. Update shared controls or generic template wording only where this skill changes their meaning; record `Docs checked; no update needed` with a reason when they do not change.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-24 | planning | Owner directed one delivery Spec per skill; this Spec names to-spec's destination and first slice | Current manifest, core catalog, source presence and Wiki route inspected at pre anchor; no behavior change or scenario trial | This Spec authored; article remains future work | TK-01B and independent delivery proof remain open |
| 2026-09-24 | planning verification | Skill-sized ownership and routing checked on the isolated candidate | All 47 required AGENTS commands passed; Wiki validation and exact 21 core plus one proposed entry coverage passed; doctor has no blocking finding; pre/post self-drift at 4940233 retained the same seven pre-existing findings and cleanUpdate false | No skill source or new article authored in this planning pass | Immutable separate-context review and actual skill behavior remain open |
| 2026-09-26 | TK-01B | Audit, then red/green at the catalog seam | Audit at `c05f303` (branched from `origin/integration` `058f089`) of the source, its callers (`grilling`, `grill-me`, `make-it-so`, `to-docs`, `tracer-bullet`, the RUNBOOK "Write specifications only" route, `workbench/skills/README.md`) and `tools/test-skill-catalog.mjs`. Desired Behavior 1 (reuse or `next-id`, acceptance and evidence seams, unresolved choices as blockers) already held: no defect found. Gaps: the opening line synthesized a conversation "into one stable capability record", which folds a multi-capability conversation into one owner (Desired Behavior 2); nothing stated that a new Spec enters `planned` and unclaimed (the scenario's no-implementation-claim); step 1 restated the retired stable-path rule against the AGENTS `move-spec` lifecycle. `node tools/test-skill-catalog.mjs` failed red at `5903e05` (`to-spec one-capability and planned-entry contract must use one Spec per capability`) and passed green at `4c872ca`; the discovery description and skills README row were aligned at `c4d9e12`. `test-skill-inspection`, `test-skills-lane`, `test-workbench-layout`, `test-core-skill-installer` and `test-spec-workbench` green on the committed tree (`test-skills-lane` and `test-workbench-layout` fail only while the tree is dirty, `invalid-source-identity`) | Source states one Spec per capability, never bundling, the `planned` unclaimed entry and `move-spec` path changes | Owner answer E-4B (no Tasks cut while `planned`) not delivered: it needs the board and template change it names, outside this Spec; S-00P Task-record shape pending |
| 2026-09-26 | TK-01B | Upstream comparison against the pin | `mattpocock/skills@c55ee46` `skills/engineering/to-spec/SKILL.md` fetched with `gh api` (upstream guide `docs/engineering/to-spec.md` read for context; it records the `to-prd` rename). Shared: synthesis without interview, project vocabulary and ADRs, test seams, out of scope. Deliberate drift: manifest-lane Spec instead of issue-tracker publication with `ready-for-agent`; durable record instead of disposable snapshot; `planned` unclaimed entry; one Spec per capability. Not adopted: user-story template, no-file-paths rule, tracker setup prerequisite, separate seam check with the user. `THIRD_PARTY_NOTICES.md` carries the MIT notice | Recorded in `workbench/wiki/skill-to-spec.md` | Only the pinned SKILL.md compared; the 2026-07-14 imported upstream revision is not preserved in the repository |
| 2026-09-26 | TK-01B | Fresh-context scenario: one general-purpose Claude Opus 5.5 subagent given only the candidate skill source (copied at `4c872ca`) and a throwaway room initialized by `workbench-layout.mjs init` and `workbench-tools.mjs install` under the lane scratch trials folder, owner scripted by the implementing agent over three turns in one run | T1 "turn the digest rebuild we just settled into a spec": ran `doctor`, `next`, `next-id --prefix S`; kept the complete S-001 unchanged because the room's rules route later changes to a new linked Spec; wrote `S-00A` at `planned`, owner unassigned, stance Builder, with three confirmed decisions, three flagged assumptions, the deferred short-document question as open owner gate O1 (blocking completion, not the first slice), one red-then-green slice `TK-00A`, and a recorded path drift in S-001 without editing it; `render` and `doctor` clean; `next` returned null. T2 "fold the export skill change into that same spec": wrote a separate `planned` Spec `S-00B` with cross-links and explained that a shared Spec could not finish one skill while the other's question stayed open. T3 "where do things stand": reported both Specs planned and unclaimed, no skill changed, next step activation then claim. Room diff: only `CATALOG.md` and the two Spec files; `library/` untouched | None | One run, one model, scripted owner; T2 went against the owner's literal request by following the source rule, which a human may judge differently. The room had no notepad or handoff, so notepad composition was not exercised. Not owner Human QA or a repeated trial |
| 2026-09-26 | TK-01B | Gates before close | Full AGENTS suite 48/48 on committed candidates `9d8963b` and `c4d9e12` (read-only runner printing the candidate header, dirty list empty); guardrail `evaluate-workbench.mjs --path templates --include-controls` 106.6/113 before (`c05f303`) and after (`9d8963b`), byte-identical report, remaining recommendations the pre-existing Team coordination items; self-drift pre at `c05f303` and post at `9d8963b` and `c4d9e12` all `blocked`, cleanUpdate false, with the same seven pre-existing findings (one stale-claim, five stale-seed, one unverified-provenance); `wiki.mjs validate` ok; `git diff --check` clean. Bounded semantic check: the grilling, grill-me, make-it-so, to-docs and tracer-bullet sources and the RUNBOOK behavior route still describe to-spec accurately; `templates/SPEC.md` already starts a Spec at `planned` with one `ready` slice, matching the source | Docs checked: RUNBOOK, BLUEPRINT, LEXICON and templates need no update because none restates the bundling, entry-status or path rule that changed and their to-spec wording stays accurate (and S-00P owns their rewrite); `workbench/skills/README.md` row updated | Coordination hand-backs this run: zero |
| 2026-09-26 | TK-01B | Task closed | Red/green tools/test-skill-catalog.mjs (red 5903e05, green 4c872ca); full AGENTS suite 48/48 at 9d8963b and c4d9e12; fresh-context three-turn scenario produced one planned unclaimed Spec with one first slice and an open owner gate, declined to bundle a second capability, implemented nothing; wiki validate ok | workbench/skills/to-spec/SKILL.md, workbench/skills/README.md, new workbench/wiki/skill-to-spec.md and its workbench/wiki/MEMORY.md entry; RUNBOOK, BLUEPRINT, LEXICON and templates checked with no update needed because none restates the changed bundling, entry-status or path rule and their to-spec wording stays accurate | Separate-context candidate review; owner Human QA of conversational fidelity; E-4B no-Tasks-while-planned entry needs its board and template change; S-00P Task-record slice shape; installed personal skill copies not updated |

## Completion Result

TK-01B stated one Spec per capability, the `planned` unclaimed entry and `move-spec` path changes in `workbench/skills/to-spec/SKILL.md`, aligned its discovery description and catalog row, and created `workbench/wiki/skill-to-spec.md` with the pinned upstream comparison and one fresh-context scenario. The Spec is not complete: the separate-context review of the candidate and owner Human QA of conversational fidelity remain. Owner answer E-4B (no Tasks cut while `planned`) and the S-00P Task-record slice shape remain outside this delivery.

## Supersession

- Supersedes: the to-spec article assignment in the unmerged oversized Skills Wiki packet, not its historical evidence.
- Superseded by: none.
