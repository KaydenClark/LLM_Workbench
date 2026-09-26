# S-01F - code-review skill rebuild

**Spec ID:** S-01F
**Status:** active
**Priority:** 2
**Owner:** claude-lane-G-worker
**Stance:** Builder
**Updated:** 2026-09-26
**Catalog description:** Review an immutable candidate against the repository and capability contracts.
**Blockers:** none.
**Latest event:** TK-00W closed with proof.
**Next gate:** Separate-context review of the TK-00W candidate, then owner Human QA on `integration`, then `complete S-01F`.

> **Citation anchors.** pre=`4940233e74a93a8390f73f8ac6ba39ef53131798` post=`4940233e74a93a8390f73f8ac6ba39ef53131798`.

## Outcome

Review an immutable candidate against the repository and capability contracts. This Spec owns the code-review skill's source review, supported repair or update, focused behavioral verification and its individual Wiki article. A source change is required only when the review finds an actual gap against accepted behavior.

## Why It Matters

The prior Skills Wiki packet grouped the whole core inventory into one completion gate. A skill-sized owner lets code-review reach a checkable destination without waiting for unrelated skill rebuilds. The article explains the result to readers; it does not instruct the agent or replace the executable source.

## Current Verified State

- `workbench/skills/code-review/SKILL.md` is the manifest-declared core source at the pre anchor.
- `workbench/wiki/skill-code-review.md` is not yet routed as a current skill article; its existence and links must be rechecked before authoring.
- S-00V's source-lane move does not change the review authority boundary. No fresh behavioral scenario for this per-skill delivery is claimed by this planning packet.

## Desired Behavior

1. A fixed base/head comparison checks both contract axes, cites reproducible findings and distinguishes proven failures from uncertainty.
2. A review does not repair the candidate or treat green tests as owner Human QA.
3. The skill's declared source, catalog/discovery route, tests, and one routed Wiki article agree on verified current behavior, intended limits and source revision. The article gives purpose, when to use it, a concrete example, inputs/outputs, completion signs, composition, limits and governing links.

## Decisions And Contracts

- **Source lineage:** Historical pinned comparison found the two review axes preserved with Workbench-specific immutable-review and integration gates. The article must identify adaptations without claiming byte fidelity.

- This Spec owns code-review alone. Shared controls, manifest, catalog and the sole Wiki router are edited only as required by this skill's proven change; neighboring skill specs retain their own source and article ownership.
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
| TK-00W | Audit code-review, deliver the smallest supported source/documentation change and prove the routed article | done | none | Red/green tools/test-skill-catalog.mjs (red f08f36b, green b830cc8); test-delivery-skills 3/3, test-skill-inspection 5/5, test-core-skill-installer 27/27; full AGENTS suite 48/48 at c8c2af1; two-leg fresh-context scenario cited path:line@sha, labelled reproduced findings proven, refused to reuse the earlier-candidate note and re-reviewed candidate B; wiki validate ok |

### TK-00W - Deliver the code-review skill destination

**Stance:** Builder

Inspect the current source, its callers/composition and relevant tests. Demonstrate the first meaningful gap at a stable seam or record that no source defect was found. Repair only the supported gap, exercise the scenario below, reconcile this skill's Wiki article and router, then record exact evidence and limits. Keep this task one skill wide.

## Acceptance Criteria

- [x] The individual Wiki article records the supported upstream relationship and its practical local effect against a pinned source, with uncertainty visible.

- [x] A fixed base/head comparison checks both contract axes, cites reproducible findings and distinguishes proven failures from uncertainty.
- [x] A review does not repair the candidate or treat green tests as owner Human QA.
- [x] The named scenario is observed in a fresh or otherwise independent context: A changed candidate SHA triggers a fresh independent review before integration.
- [x] `workbench/wiki/skill-code-review.md` accurately distinguishes verified current behavior from remaining intended behavior, links the current source and governing owners, and is reachable from `workbench/wiki/MEMORY.md`.
- [ ] Relevant targeted tests/scenarios, Wiki validation, the required full suite, Workbench self-drift pre/post receipts and separate-context review are recorded at their proper gates; no unrun check is reported as passing.

## Testing Seams

Use the skill's public entry and its nearest source/test seam for the scenario: A changed candidate SHA triggers a fresh independent review before integration. Structural catalog and Wiki checks prove routing, not agent behavior. If the skill changes behavior, show red then green at the closest meaningful seam. A human review may still be needed for conversational fidelity.

## Verification Procedure

Run targeted tests for the changed source and `node workbench/tools/wiki.mjs validate`, then the current full suite in AGENTS.md. Run `node workbench/tools/spec-workbench.mjs render` and `doctor`; capture the self-drift pre/post receipts and a bounded semantic check. Review the immutable candidate separately before integration. Record actual commands and results in this Spec.

## Documentation Impact

Maintain `workbench/wiki/skill-code-review.md` and its sole router entry alongside the skill change. Update shared controls or generic template wording only where this skill changes their meaning; record `Docs checked; no update needed` with a reason when they do not change.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-24 | planning | Owner directed one delivery Spec per skill; this Spec names code-review's destination and first slice | Current manifest, core catalog, source presence and Wiki route inspected at pre anchor; no behavior change or scenario trial | This Spec authored; article remains future work | TK-00W and independent delivery proof remain open |
| 2026-09-24 | planning verification | Skill-sized ownership and routing checked on the isolated candidate | All 47 required AGENTS commands passed; Wiki validation and exact 21 core plus one proposed entry coverage passed; doctor has no blocking finding; pre/post self-drift at 4940233 retained the same seven pre-existing findings and cleanUpdate false | No skill source or new article authored in this planning pass | Immutable separate-context review and actual skill behavior remain open |
| 2026-09-26 | TK-00W | Audit, then red/green at the catalog seam | Audit at `be918f0`: the two axes, the pinned hardened diff, the mid-review `HEAD_SHA` recheck and the review-only boundary were present and pinned. Three gaps against Desired Behavior: a finding carried no proven or uncertain label and its citation named no tree (the AGENTS.md citation rule); nothing said a pass, green suite or `verdict` is not owner Human QA or does not reset a failed Human QA gate; nothing said a pass does not carry to a new candidate SHA or a changed content digest. `node tools/test-skill-catalog.mjs` failed red at `f08f36b` ("code-review finding, fresh-candidate and Human QA contract must use" the `path:line@<sha>` citation form) and passed green at `b830cc8`. On the committed tree `test-delivery-skills` 3/3 (hostile textconv), `test-skill-inspection` 5/5, `test-core-skill-installer` 27/27 and `test-spec-report` passed | Source states the tree-anchored citation, the proven/uncertain label, the fresh-candidate rule and the Human QA boundary; `workbench/wiki/skill-code-review.md` and its `MEMORY.md` route added at `c8c2af1` | Exemption-2 Task-PR text left unchanged (depends on S-00O); the pinned phrase 'assigned stable `SPEC.md`' kept to avoid shared pin churn; integration-reviewer identity and failed-finding routing await S-00P |
| 2026-09-26 | TK-00W | Fresh-context scenario: two general-purpose Claude Opus 5.5 subagents, each given only a scratch copy of the green skill source and a disposable Greeter room (built by a recorded script, not the lane), owner scripted by the implementing agent | Room Spec S-001 requires `greet` to throw `TypeError('name is required')` for missing, empty or whitespace-only names. Leg 1, candidate A `7876a10` vs base `47632b4` (coercion only, a test that passes at base, README claiming the rejection): the reviewer pinned both SHAs, cited `src/greet.mjs:1-4@7876a10`, marked four findings proven with named probes (`greet('')` returned `"Hello, !"`), said the green suite proved nothing about S-001, said a fixed candidate needs a fresh review pinned to its SHA and that the review is not owner Human QA. Room HEAD, status and file hashes unchanged. Leg 2, candidate B `92a353e` (the check plus four rejection tests, and a `shout` change that breaks an existing test), with the note that candidate A was already reviewed: a separate reviewer called the note background only and not a verdict, reviewed the whole base-to-B diff, reproduced the regression with `node --test` (6 pass, 1 fail) and a silent `shout(undefined)` path, cited `src/greet.mjs:9@92a353e`, required a fresh review of the fix and wrote nothing. Room unchanged | None | One run per leg, one model, scripted owner; not owner Human QA or a repeated trial. Leg 2 was a new agent rather than the leg 1 agent resumed; its Agent call returned a rate-limit error to the implementing agent, and its complete report arrived afterwards as a hand-back. The room had no `report`/`verdict` tooling, so the digest leg was not agent-exercised. No finding was unreproducible, so the uncertain label was not observed in use |
| 2026-09-26 | TK-00W | Gates before close | Full AGENTS suite `TOTAL pass=48 fail=0` on committed candidate `c8c2af1` (log first line `dirty: []`); guardrail `templates --include-controls` 106.6/113 before and after with byte-identical output, remaining recommendations the pre-existing Team coordination items; self-drift pre at `7746eb3` and post at `c8c2af1` both `machineResult: blocked` with the same seven pre-existing attention findings (one stale-claim, five stale-seed, one unverified-provenance) and `cleanUpdate: false`; `wiki.mjs validate` ok; `git diff --check` clean; render and doctor show no blocking finding. Bounded semantic check: RUNBOOK Behavior Selection and Independent Review Boundaries (a prior PASS is not approval of changed content), `templates/RUNBOOK.md` Behavior Selection, the `workbench/skills/README.md` code-review row and the reviewer, implement, carry, builder and auditor callers agree with the delivered source | Docs checked: RUNBOOK, BLUEPRINT, LEXICON, templates and `workbench/skills/README.md` need no update because none restates the finding format, RUNBOOK already states the fresh-candidate rule and AGENTS.md already states the Human QA boundary | Coordination hand-backs this run: zero |
| 2026-09-26 | TK-00W | Task closed | Red/green tools/test-skill-catalog.mjs (red f08f36b, green b830cc8); test-delivery-skills 3/3, test-skill-inspection 5/5, test-core-skill-installer 27/27; full AGENTS suite 48/48 at c8c2af1; two-leg fresh-context scenario cited path:line@sha, labelled reproduced findings proven, refused to reuse the earlier-candidate note and re-reviewed candidate B; wiki validate ok | workbench/skills/code-review/SKILL.md, workbench/wiki/skill-code-review.md and its workbench/wiki/MEMORY.md route; RUNBOOK, BLUEPRINT, LEXICON, templates and skills README checked with no update needed because none restates the finding format, RUNBOOK already states the fresh-candidate rule and AGENTS.md the Human QA boundary | Separate-context candidate review; owner Human QA; S-00P reviewer-identity and failed-finding wording; exemption-2 text awaits S-00O; installed personal skill copies not updated |

## Completion Result

TK-00W stated the tree-anchored proven/uncertain finding, the fresh-candidate rule and the Human QA boundary in `workbench/skills/code-review/SKILL.md`, added `workbench/wiki/skill-code-review.md` with a pinned upstream comparison, and recorded one two-leg fresh-context scenario. The Spec is not complete: the separate-context candidate review and owner Human QA remain.

## Supersession

- Supersedes: the code-review article assignment in the unmerged oversized Skills Wiki packet, not its historical evidence.
- Superseded by: none.
