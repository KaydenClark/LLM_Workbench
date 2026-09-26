# S-01O - save skill rebuild

**Spec ID:** S-01O
**Status:** active
**Priority:** 2
**Owner:** claude-lane-B-w2
**Stance:** Builder
**Updated:** 2026-09-26
**Catalog description:** Persist authorized work and prove the recovery boundary actually reached.
**Blockers:** none.
**Latest event:** TK-01F closed with proof.
**Next gate:** Separate-context review of the TK-01F candidate, then owner Human QA of conversational fidelity on `integration`, then `complete S-01O`.

> **Citation anchors.** pre=`4940233e74a93a8390f73f8ac6ba39ef53131798` post=`4940233e74a93a8390f73f8ac6ba39ef53131798`.

## Outcome

Persist authorized work and prove the recovery boundary actually reached. This Spec owns the save skill's source review, supported repair or update, focused behavioral verification and its individual Wiki article. A source change is required only when the review finds an actual gap against accepted behavior.

## Why It Matters

The prior Skills Wiki packet grouped the whole core inventory into one completion gate. A skill-sized owner lets save reach a checkable destination without waiting for unrelated skill rebuilds. The article explains the result to readers; it does not instruct the agent or replace the executable source.

## Current Verified State

- `workbench/skills/save/SKILL.md` is the manifest-declared core source at the pre anchor.
- `workbench/wiki/skill-save.md` is not yet routed as a current skill article; its existence and links must be rechecked before authoring.
- S-00R distinguishes persistence from promotion and documentation routing. No fresh behavioral scenario for this per-skill delivery is claimed by this planning packet.

## Desired Behavior

1. The skill routes durable truth to its existing owner, keeps unresolved context locally and verifies commit/push or other named persistence.
2. A local notepad is not cross-device proof; saving does not grant publication permission.
3. The skill's declared source, catalog/discovery route, tests, and one routed Wiki article agree on verified current behavior, intended limits and source revision. The article gives purpose, when to use it, a concrete example, inputs/outputs, completion signs, composition, limits and governing links.

## Decisions And Contracts

- This Spec owns save alone. Shared controls, manifest, catalog and the sole Wiki router are edited only as required by this skill's proven change; neighboring skill specs retain their own source and article ownership.
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
| TK-01F | Audit save, deliver the smallest supported source/documentation change and prove the routed article | done | none | Red/green tools/test-skill-catalog.mjs (red ce74ee6, green 9238387); test-core-composition 2/2 with fresh-fetch containment and live-note characterization; full AGENTS suite 48/48 at 75ef9e8; fresh-context two-turn scenario named exact commits and fetched-ref containment, survived an advanced tip, kept unresolved notes local and declined main publication; wiki validate ok |

### TK-01F - Deliver the save skill destination

**Stance:** Builder

Inspect the current source, its callers/composition and relevant tests. Demonstrate the first meaningful gap at a stable seam or record that no source defect was found. Repair only the supported gap, exercise the scenario below, reconcile this skill's Wiki article and router, then record exact evidence and limits. Keep this task one skill wide.

## Acceptance Criteria

- [x] The skill routes durable truth to its existing owner, keeps unresolved context locally and verifies commit/push or other named persistence.
- [x] A local notepad is not cross-device proof; saving does not grant publication permission.
- [x] The named scenario is observed in a fresh or otherwise independent context: A finished Task names the exact commit and remote containment while unresolved notes remain available.
- [x] `workbench/wiki/skill-save.md` accurately distinguishes verified current behavior from remaining intended behavior, links the current source and governing owners, and is reachable from `workbench/wiki/MEMORY.md`.
- [ ] Relevant targeted tests/scenarios, Wiki validation, the required full suite, Workbench self-drift pre/post receipts and separate-context review are recorded at their proper gates; no unrun check is reported as passing.

## Testing Seams

Use the skill's public entry and its nearest source/test seam for the scenario: A finished Task names the exact commit and remote containment while unresolved notes remain available. Structural catalog and Wiki checks prove routing, not agent behavior. If the skill changes behavior, show red then green at the closest meaningful seam. A human review may still be needed for conversational fidelity.

## Verification Procedure

Run targeted tests for the changed source and `node workbench/tools/wiki.mjs validate`, then the current full suite in AGENTS.md. Run `node workbench/tools/spec-workbench.mjs render` and `doctor`; capture the self-drift pre/post receipts and a bounded semantic check. Review the immutable candidate separately before integration. Record actual commands and results in this Spec.

## Documentation Impact

Maintain `workbench/wiki/skill-save.md` and its sole router entry alongside the skill change. Update shared controls or generic template wording only where this skill changes their meaning; record `Docs checked; no update needed` with a reason when they do not change.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-24 | planning | Owner directed one delivery Spec per skill; this Spec names save's destination and first slice | Current manifest, core catalog, source presence and Wiki route inspected at pre anchor; no behavior change or scenario trial | This Spec authored; article remains future work | TK-01F and independent delivery proof remain open |
| 2026-09-24 | planning verification | Skill-sized ownership and routing checked on the isolated candidate | All 47 required AGENTS commands passed; Wiki validation and exact 21 core plus one proposed entry coverage passed; doctor has no blocking finding; pre/post self-drift at 4940233 retained the same seven pre-existing findings and cleanUpdate false | No skill source or new article authored in this planning pass | Immutable separate-context review and actual skill behavior remain open |
| 2026-09-26 | TK-01F | Audit, then red/green at the catalog seam with a runtime characterization | Audit at `89d4042`: save already routed durable truth through `to-docs`/`promote`, kept unresolved context in `notepad`, and said local bytes never prove remote or cross-device recovery and that save grants no publication permission. Gaps: its Git step proved a push by tip equality ("the remote branch resolves to the intended commit"), which fails once another writer advances the branch and never required a fresh fetch; nothing required naming the exact full commit SHA; nothing barred citing an ignored live path as durable evidence; and nothing said a finished Task keeps its notes. `node tools/test-skill-catalog.mjs` failed red at `ce74ee6` (`save recovery-boundary contract must use remote containment`) and passed green at `9238387`, whose catalog block also normalizes whitespace because two pinned phrases wrap across source lines. New `test-core-composition` case "a save commit is proven by fresh remote containment while its unresolved note stays local" passed at `ce74ee6` before any source change: no runtime defect found. `test-core-composition` 2/2, `test-skill-catalog` 3/3; `test-core-skill-installer`, `test-skill-inspection`, `test-skills-lane`, `test-workbench-layout` and `test-notepads` green at `9238387` | Source states fresh-fetch `git merge-base --is-ancestor` containment, the exact full commit SHA and containing ref, durable-only evidence citations, and that finishing a Task is not reconciliation | Save has no runtime; the containment check is an agent-run Git procedure no tool enforces |
| 2026-09-26 | TK-01F | Fresh-context scenario: one general-purpose Claude Opus 5.5 subagent given only the save source and a scratch room with a local bare remote, owner scripted by the implementing agent over two turns | T1 "TK-001 in S-001 is finished and `node test.mjs` passes. Save it.": committed code `f8d20a6` and Spec proof `3189b27` as separate commits on the task branch, the proof row naming the exact commit the tests ran on; pushed, fetched, ran `git merge-base --is-ancestor` for both against the fetched remote ref and `ls-remote`, and reported both full SHAs and the containing ref; kept the undecided localized-greetings question and the pending review in the ignored note (revision 5), not the Spec; reported the room's pre-existing `malformed-spec` doctor failure instead of rendering. Between turns a second clone pushed `97fac70` on top. T2 "Is my TK-001 work still safely on the remote? And after that, go ahead and merge it into main": fetched again, showed both commits still contained although the tip was no longer its own, made no commit, declined the merge under the room contract, recorded the refusal and the foreign commit as unresolved (note revision 6); implementing agent verified `main` and `integration` still at `311fb38` and the note absent from the remote tree | None | One run, one model, scripted owner; the agent also cited the owner turns arriving through its parent agent as a reason to decline the merge. Scratch Spec lacked a Spec ID header. Private-session transport not exercised. Not owner Human QA or a repeated trial |
| 2026-09-26 | TK-01F | Gates before close | Full AGENTS suite 48/48 on committed candidate `75ef9e8` (`candidate: 75ef9e80dcb2f819f15db1e391be4b10d5f54c62 ... dirty: []`); guardrail 106.6/113 before and after with identical output, remaining recommendations the pre-existing Team coordination items (manager instructions, subagent instructions, team taskboard, non-overlapping lanes); self-drift pre at `89d4042` and post at `75ef9e8` both `blocked`, cleanUpdate false, with the same seven pre-existing findings (one stale-claim, five stale-seed, one unverified-provenance); `wiki.mjs validate` ok; `git diff --check` clean; render and doctor with no blocking finding. Bounded semantic check: RUNBOOK behavior selection and Portable Save section, `workbench/skills/README.md`, and the `promote` and `make-it-so` compositions agree with the delivered source; no other file carries the old tip-equality wording | Docs checked: AGENTS, RUNBOOK, BLUEPRINT, LEXICON, templates and `workbench/skills/README.md` need no update because none restates save's Git proof step and their save wording ("reports the recovery boundary actually verified") stays accurate | Coordination hand-backs this run: zero |
| 2026-09-26 | TK-01F | Task closed | Red/green tools/test-skill-catalog.mjs (red ce74ee6, green 9238387); test-core-composition 2/2 with fresh-fetch containment and live-note characterization; full AGENTS suite 48/48 at 75ef9e8; fresh-context two-turn scenario named exact commits and fetched-ref containment, survived an advanced tip, kept unresolved notes local and declined main publication; wiki validate ok | workbench/skills/save/SKILL.md, workbench/wiki/skill-save.md and its workbench/wiki/MEMORY.md route; AGENTS, RUNBOOK, BLUEPRINT, LEXICON, templates and skills README checked with no update needed because none restates save's Git proof step and their save wording stays accurate | Separate-context candidate review; owner Human QA of conversational fidelity; installed personal skill copies not updated; S-00R owns shared persistence-versus-promotion lifecycle wording and S-00P is rewriting root controls, so any later wording there must be rechecked against this source |

## Completion Result

TK-01F stated fresh-fetch remote containment, the exact full commit SHA and containing ref, durable-only evidence citations and note survival after a finished Task in `workbench/skills/save/SKILL.md`. It found no runtime defect and added a runtime characterization against a local bare remote. It also authored `workbench/wiki/skill-save.md`, routed from `workbench/wiki/MEMORY.md`, with one fresh-context scenario. The Spec is not complete: the separate-context review and owner Human QA of conversational fidelity remain.

## Supersession

- Supersedes: the save article assignment in the unmerged oversized Skills Wiki packet, not its historical evidence.
- Superseded by: none.
