# S-01I - make-it-so skill rebuild

**Spec ID:** S-01I
**Status:** active
**Priority:** 2
**Owner:** claude-lane-G-worker
**Stance:** Builder
**Updated:** 2026-09-26
**Catalog description:** Compose approved work through the exact endpoint the owner authorized.
**Blockers:** none.
**Latest event:** TK-00Z closed with proof.
**Next gate:** Separate-context review of the TK-00Z candidate, then owner Human QA of conversational fidelity on `integration`, then `complete S-01I`.

> **Citation anchors.** pre=`4940233e74a93a8390f73f8ac6ba39ef53131798` post=`4940233e74a93a8390f73f8ac6ba39ef53131798`.

## Outcome

Compose approved work through the exact endpoint the owner authorized. This Spec owns the make-it-so skill's source review, supported repair or update, focused behavioral verification and its individual Wiki article. A source change is required only when the review finds an actual gap against accepted behavior.

## Why It Matters

The prior Skills Wiki packet grouped the whole core inventory into one completion gate. A skill-sized owner lets make-it-so reach a checkable destination without waiting for unrelated skill rebuilds. The article explains the result to readers; it does not instruct the agent or replace the executable source.

## Current Verified State

- `workbench/skills/make-it-so/SKILL.md` is the manifest-declared core source at the pre anchor.
- `workbench/wiki/skill-make-it-so.md` is not yet routed as a current skill article; its existence and links must be rechecked before authoring.
- S-00R owns the intentional composition boundary. No fresh behavioral scenario for this per-skill delivery is claimed by this planning packet.

## Desired Behavior

1. Settled decisions are promoted and specified or implemented only when the current request authorizes those steps.
2. An incidental mention and a note do not grant scope; main publication stays owner-controlled.
3. The skill's declared source, catalog/discovery route, tests, and one routed Wiki article agree on verified current behavior, intended limits and source revision. The article gives purpose, when to use it, a concrete example, inputs/outputs, completion signs, composition, limits and governing links.

## Decisions And Contracts

- This Spec owns make-it-so alone. Shared controls, manifest, catalog and the sole Wiki router are edited only as required by this skill's proven change; neighboring skill specs retain their own source and article ownership.
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
| TK-00Z | Audit make-it-so, deliver the smallest supported source/documentation change and prove the routed article | done | none | Red/green tools/test-skill-catalog.mjs catalog-row assertion (red be350c3, green 4fd24dc); full AGENTS suite 48/48 at ac49a80; fresh-context specification-only scenario ended at the Spec with no build, plus a build contrast turn; wiki validate ok |

### TK-00Z - Deliver the make-it-so skill destination

**Stance:** Builder

Inspect the current source, its callers/composition and relevant tests. Demonstrate the first meaningful gap at a stable seam or record that no source defect was found. Repair only the supported gap, exercise the scenario below, reconcile this skill's Wiki article and router, then record exact evidence and limits. Keep this task one skill wide.

## Acceptance Criteria

- [x] Settled decisions are promoted and specified or implemented only when the current request authorizes those steps.
- [x] An incidental mention and a note do not grant scope; main publication stays owner-controlled.
- [x] The named scenario is observed in a fresh or otherwise independent context: A specification-only request ends with the specification even when the phrase make-it-so appears.
- [x] `workbench/wiki/skill-make-it-so.md` accurately distinguishes verified current behavior from remaining intended behavior, links the current source and governing owners, and is reachable from `workbench/wiki/MEMORY.md`.
- [ ] Relevant targeted tests/scenarios, Wiki validation, the required full suite, Workbench self-drift pre/post receipts and separate-context review are recorded at their proper gates; no unrun check is reported as passing.

## Testing Seams

Use the skill's public entry and its nearest source/test seam for the scenario: A specification-only request ends with the specification even when the phrase make-it-so appears. Structural catalog and Wiki checks prove routing, not agent behavior. If the skill changes behavior, show red then green at the closest meaningful seam. A human review may still be needed for conversational fidelity.

## Verification Procedure

Run targeted tests for the changed source and `node workbench/tools/wiki.mjs validate`, then the current full suite in AGENTS.md. Run `node workbench/tools/spec-workbench.mjs render` and `doctor`; capture the self-drift pre/post receipts and a bounded semantic check. Review the immutable candidate separately before integration. Record actual commands and results in this Spec.

## Documentation Impact

Maintain `workbench/wiki/skill-make-it-so.md` and its sole router entry alongside the skill change. Update shared controls or generic template wording only where this skill changes their meaning; record `Docs checked; no update needed` with a reason when they do not change.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-24 | planning | Owner directed one delivery Spec per skill; this Spec names make-it-so's destination and first slice | Current manifest, core catalog, source presence and Wiki route inspected at pre anchor; no behavior change or scenario trial | This Spec authored; article remains future work | TK-00Z and independent delivery proof remain open |
| 2026-09-24 | planning verification | Skill-sized ownership and routing checked on the isolated candidate | All 47 required AGENTS commands passed; Wiki validation and exact 21 core plus one proposed entry coverage passed; doctor has no blocking finding; pre/post self-drift at 4940233 retained the same seven pre-existing findings and cleanUpdate false | No skill source or new article authored in this planning pass | Immutable separate-context review and actual skill behavior remain open |
| 2026-09-26 | TK-00Z | Audit, then red/green at the catalog seam | Audit at `67dfcaa` (base `ebb01dc`): the source already states Desired Behavior 1 and 2. That covers endpoint-bounded composition, the specification-only/promotion-only/handoff-only scope, the rule that invocation and notepads are not permission, and the owner-controlled `main` rule. Callers grilling, grill-me, handoff, promote and checkpoint all compose it only within authorized execution. No source defect found. The one defect was the `workbench/skills/README.md` catalog row "Promote settled decisions and execute their approved tasks", which promised execution. New `tools/test-skill-catalog.mjs` assertion failed red at `be350c3` (`the make-it-so catalog row must name the authorized endpoint`) and passed green at `4fd24dc`, with the row set to this Spec's catalog description. `test-delivery-skills` green | Catalog row corrected; skill source unchanged (blob `39be541`, last changed `4b6d05c`) | Step 2 composes `promote`/`to-docs` without step 5's explicit "only where authorized" guard: tested in the scenario, not edited |
| 2026-09-26 | TK-00Z | Fresh-context scenario: one general-purpose Claude Opus 5.5 subagent, given only a disposable room at baseline `0dfd518` with a bare remote, the room's installed core skills (installed from `4fd24dc`), and a notepad with three settled farewell decisions (API, trimming, the term "farewell") plus one unresolved `source_record` (localization); owner scripted by the implementing agent | T1 "/make-it-so Make it so — write the spec for this, but don't build it yet.": read make-it-so, notepad, promote, to-docs, to-spec, to-tasks, save and tracer-bullet. Wrote one `planned` Spec (S-00A) with one `ready` seed Task. `git diff --name-only 0dfd518..ab8cec6` = `workbench/specs/CATALOG.md`, `workbench/specs/S-00A-farewell/SPEC.md`. Pushed only the task branch; `integration` and `main` stayed at `0dfd518`. `show` had no in-progress Task, `next` returned null, and `doctor` had no blocking finding. The settled term stayed out of `LEXICON.md` and was recorded as delivery-time documentation impact. The note kept localization in `current.unresolved`, where it also became the Spec blocker. The report named "Spec only" as the endpoint. Contrast T2 "Now build it. Farewells stay English-only for now.": the agent promoted the answer via `sessions.mjs promote`, claimed, went red then green, added the Lexicon term and closed. It pushed `47083ad` to the task branch only and stopped at the Contract's separate-context review; `integration` and `main` stayed unchanged | Scenario recorded in `workbench/wiki/skill-make-it-so.md` | One run, one model, scripted owner. The T2 turn resumed the same agent, so it is not fresh context. Not owner Human QA or a repeated trial. Step-2 ambiguity observed not defective: no unauthorized owner was rewritten, so the source stays unchanged |
| 2026-09-26 | TK-00Z | Gates before close | Full AGENTS suite 48/48 on committed candidate `ac49a80`, with a log whose first line shows `dirty: []`. Guardrail 106.6/113 before and after; the report is identical, and the only remaining recommendation is the pre-existing Team coordination item. Self-drift pre at `67dfcaa` and post at `ac49a80` both `machineResult: blocked`, `cleanUpdate: false`, with the same seven pre-existing attention findings (one stale-claim S-00Q, five stale-seed, one unverified-provenance). `wiki.mjs validate` ok; `git diff --check` clean; `render` and `doctor` show no blocking finding. Bounded semantic check: RUNBOOK, BLUEPRINT, LEXICON, AGENTS, README and templates do not mention make-it-so. The catalog row was the only restated description | Docs checked: RUNBOOK, BLUEPRINT, LEXICON, templates and root README need no update because none restates make-it-so's scope. `workbench/skills/README.md` row corrected; Wiki article and single router entry added | S-00R TK-0R1's post-S-00P lifecycle audit lists make-it-so and should start from this result rather than repeat it. S-00P may rename "one lead responsible for evidence and docs" to its single-writer role (cosmetic, not needed here). Coordination hand-backs this run: zero |
| 2026-09-26 | TK-00Z | Task closed | Red/green tools/test-skill-catalog.mjs catalog-row assertion (red be350c3, green 4fd24dc); full AGENTS suite 48/48 at ac49a80; fresh-context specification-only scenario ended at the Spec with no build, plus a build contrast turn; wiki validate ok | workbench/skills/README.md make-it-so row corrected; workbench/wiki/skill-make-it-so.md and its MEMORY.md router entry added; RUNBOOK, BLUEPRINT, LEXICON, templates and root README checked with no update needed because none restates make-it-so's scope | Separate-context candidate review; owner Human QA of conversational fidelity; installed personal skill copies not updated; S-00R TK-0R1 post-S-00P audit starts from this result |
| 2026-09-26 | TK-00Z | Incidental-mention probe for Desired Behavior 2: a second, separate general-purpose Claude Opus 5.5 subagent, given a fresh clone of the same baseline `0dfd518` with its own clean bare remote and the same seeded note (revision 6) | Owner turn "I keep hearing about make-it-so. How would it apply to my farewell design notes? Just curious for now.": the agent read AGENTS, make-it-so, notepad, promote, to-docs and to-spec, and read the note through the read-only current view. It explained the three endpoints and changed nothing. Verified afterwards: `git log --all` and every remote ref still at `0dfd518`, clean tree, note still at revision 6 with localization unresolved. The agent cited "a passing mention grants nothing" and said the note's next action was not triggered | Probe recorded in `workbench/wiki/skill-make-it-so.md` | One run, one model, scripted owner. The phrase `/make-it-so` was not typed, so this probes an incidental mention, not a mistyped invocation |

## Completion Result

TK-00Z found no defect in `workbench/skills/make-it-so/SKILL.md`, which is unchanged. It corrected the `workbench/skills/README.md` catalog row, which had promised execution, and pinned that row in `tools/test-skill-catalog.mjs`. It added `workbench/wiki/skill-make-it-so.md` with its router entry. Fresh-context agents ended a specification-only make-it-so request at the Spec. They built only after the owner's later build turn, and changed nothing on an incidental mention. The Spec is not complete: the separate-context review and owner Human QA of conversational fidelity remain.

## Supersession

- Supersedes: the make-it-so article assignment in the unmerged oversized Skills Wiki packet, not its historical evidence.
- Superseded by: none.
