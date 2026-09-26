# S-01B - promote skill rebuild

**Spec ID:** S-01B
**Status:** active
**Priority:** 2
**Owner:** claude-lane-B-w1
**Stance:** Builder
**Updated:** 2026-09-26
**Catalog description:** Move selected supported working claims into their existing durable owners.
**Blockers:** none.
**Latest event:** TK-00S closed with proof.
**Next gate:** Owner Human QA of conversational fidelity on `integration`, then `complete S-01B`.

> **Citation anchors.** pre=`4940233e74a93a8390f73f8ac6ba39ef53131798` post=`4940233e74a93a8390f73f8ac6ba39ef53131798`.

## Outcome

Move selected supported working claims into their existing durable owners. This Spec owns the promote skill's source review, supported repair or update, focused behavioral verification and its individual Wiki article. A source change is required only when the review finds an actual gap against accepted behavior.

## Why It Matters

The prior Skills Wiki packet grouped the whole core inventory into one completion gate. A skill-sized owner lets promote reach a checkable destination without waiting for unrelated skill rebuilds. The article explains the result to readers; it does not instruct the agent or replace the executable source.

## Current Verified State

- `workbench/skills/promote/SKILL.md` is the manifest-declared core source at the pre anchor.
- `workbench/wiki/skill-promote.md` is not yet routed as a current skill article; its existence and links must be rechecked before authoring.
- S-00R owns related lifecycle wording, so this spec coordinates before touching that shared text. No fresh behavioral scenario for this per-skill delivery is claimed by this planning packet.

## Desired Behavior

1. Selection preserves correction and tentative status, routes each accepted claim once, reads back changed owner bytes and retains unresolved context.
2. Promotion neither grants authority nor starts implementation; an ignored note is never cited as durable proof.
3. The skill's declared source, catalog/discovery route, tests, and one routed Wiki article agree on verified current behavior, intended limits and source revision. The article gives purpose, when to use it, a concrete example, inputs/outputs, completion signs, composition, limits and governing links.

## Decisions And Contracts

- This Spec owns promote alone. Shared controls, manifest, catalog and the sole Wiki router are edited only as required by this skill's proven change; neighboring skill specs retain their own source and article ownership.
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
| TK-00S | Audit promote, deliver the smallest supported source/documentation change and prove the routed article | done | none | Red/green tools/test-skill-catalog.mjs (red 756715b, green 485eacd); test-direct-promotion 27/27 with mixed-note decision-versus-pending characterization; full AGENTS suite 48/48 at 378ed60; fresh-context scenario promoted the confirmed naming decision with its correction and left the pending retention answer unresolved in the note; wiki validate ok |

### TK-00S - Deliver the promote skill destination

**Stance:** Builder

Inspect the current source, its callers/composition and relevant tests. Demonstrate the first meaningful gap at a stable seam or record that no source defect was found. Repair only the supported gap, exercise the scenario below, reconcile this skill's Wiki article and router, then record exact evidence and limits. Keep this task one skill wide.

## Acceptance Criteria

- [x] Selection preserves correction and tentative status, routes each accepted claim once, reads back changed owner bytes and retains unresolved context.
- [x] Promotion neither grants authority nor starts implementation; an ignored note is never cited as durable proof.
- [x] The named scenario is observed in a fresh or otherwise independent context: A mixed note promotes one supported decision while leaving an unresolved decision in local context.
- [x] `workbench/wiki/skill-promote.md` accurately distinguishes verified current behavior from remaining intended behavior, links the current source and governing owners, and is reachable from `workbench/wiki/MEMORY.md`.
- [x] Relevant targeted tests/scenarios, Wiki validation, the required full suite, Workbench self-drift pre/post receipts and separate-context review are recorded at their proper gates; no unrun check is reported as passing.

## Testing Seams

Use the skill's public entry and its nearest source/test seam for the scenario: A mixed note promotes one supported decision while leaving an unresolved decision in local context. Structural catalog and Wiki checks prove routing, not agent behavior. If the skill changes behavior, show red then green at the closest meaningful seam. A human review may still be needed for conversational fidelity.

## Verification Procedure

Run targeted tests for the changed source and `node workbench/tools/wiki.mjs validate`, then the current full suite in AGENTS.md. Run `node workbench/tools/spec-workbench.mjs render` and `doctor`; capture the self-drift pre/post receipts and a bounded semantic check. Review the immutable candidate separately before integration. Record actual commands and results in this Spec.

## Documentation Impact

Maintain `workbench/wiki/skill-promote.md` and its sole router entry alongside the skill change. Update shared controls or generic template wording only where this skill changes their meaning; record `Docs checked; no update needed` with a reason when they do not change.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-24 | planning | Owner directed one delivery Spec per skill; this Spec names promote's destination and first slice | Current manifest, core catalog, source presence and Wiki route inspected at pre anchor; no behavior change or scenario trial | This Spec authored; article remains future work | TK-00S and independent delivery proof remain open |
| 2026-09-24 | planning verification | Skill-sized ownership and routing checked on the isolated candidate | All 47 required AGENTS commands passed; Wiki validation and exact 21 core plus one proposed entry coverage passed; doctor has no blocking finding; pre/post self-drift at 4940233 retained the same seven pre-existing findings and cleanUpdate false | No skill source or new article authored in this planning pass | Immutable separate-context review and actual skill behavior remain open |
| 2026-09-26 | TK-00S | Audit, then red/green at the catalog seam with a runtime characterization | Audit at `89d4042`: the source already kept tentative/withdrawn/superseded status, required byte read-back, refused ignored-note citations and granted no authority, but it never said how pending meaning appears in a JSON note (a `source_record` still listed in `current.unresolved`; only a `decision` confirms), never said each accepted claim goes to exactly one owner, gave no location for the ignored in-project draft the command requires, and did not say the pending item stays in the note after promotion. `node tools/test-skill-catalog.mjs` failed red at `756715b` (`promote pending, single-owner and draft contract must use source_record`) and passed green at `485eacd`. New `test-direct-promotion` case "a mixed note promotes its confirmed decision while the pending answer stays unselected and unresolved in the note" passed at `756715b` before any source change: no runtime defect found. `test-direct-promotion` 27/27, `test-core-composition`, `test-core-skill-installer` 27/27, `test-skill-inspection`, `test-sessions` and `test-skills-lane` green at `485eacd` | Source states pending recognition, one owner per claim with links instead of copies, an ignored in-project draft (example `workbench/sessions/recovery/`) and the retained pending item | Privacy, path, hash, revision, owner validation and recovery behavior: no source or runtime defect found; their existing tests are unchanged and green |
| 2026-09-26 | TK-00S | Fresh-context scenario: one general-purpose Claude Opus 5.5 subagent given only the promote source and a scratch room, owner scripted by the implementing agent over two turns | Room: a Git repo with `RUNBOOK.md` and a note holding Q1 naming (`source_record-001` readback, `correction-001`, confirmed `decision-001`) and Q2 retention (`source_record-002`, 30-day readback, listed in `current.unresolved`). T1 "put what we settled about nightly reports into the RUNBOOK Reports section": read the current view and all entries, wrote the full draft to `workbench/sessions/recovery/` and checked it was ignored, promoted `decision-001,correction-001` (context `source_record-001`) at revision 7 with the expected hash, verified hash and byte read-back and a one-paragraph `git diff`, appended `verification-001` naming `RUNBOOK.md` and both hashes, left `source_record-002` and its `current.unresolved` item untouched, deleted the draft, did not commit, and asked the owner to confirm or correct the retention readback. Implementing agent verified the room: only `RUNBOOK.md` modified, with the corrected date-first rule and no retention; note revision 9 kept Q2 unresolved. T2 "Not 30. Make it two weeks, then delete them. And put that in the RUNBOOK too": appended `correction-002` and `decision-002` in the same turn without a separate readback; its promotion was refused by the host permission layer because the owner words were relayed by another agent, so it recorded `blocker-001`, restored the unresolved item and changed no owner | None | One run, one model, scripted owner; not owner Human QA or a repeated trial. T2's promotion was not observed (host permission refusal of relayed owner turns, a method limit); whether a revised answer plus a write instruction counts as confirmation without a readback is left for owner Human QA |
| 2026-09-26 | TK-00S | Gates before close | Full AGENTS suite 48/48 on committed candidate `378ed60` (`candidate: 378ed60a9d199b760a5151033f8e7716624a6f55 ... dirty: []`); guardrail `templates` 106.6/113 before and after, the only remaining recommendation the pre-existing Team coordination items (manager instructions, subagent instructions, team taskboard, non-overlapping lanes); self-drift pre at `89d4042` and post at `378ed60` both `blocked`, `cleanUpdate` false, with the same seven pre-existing findings (one stale-claim, five stale-seed, one unverified-provenance); `wiki.mjs validate` ok; `git diff --check` clean; `render` no drift; `doctor` no blocking finding. Bounded semantic check: RUNBOOK Direct Owner Promotion and its template copy (draft inside the project, kept ignored), the LEXICON direct-promotion term, the skills README row, and the grilling, make-it-so, save and notepad sources agree with the delivered source | Docs checked: RUNBOOK, BLUEPRINT, LEXICON, README, templates and `workbench/skills/README.md` need no update because none restates the pending convention, the one-owner rule or a draft path, and their promotion wording stays accurate. `workbench/wiki/MEMORY.md` Skills Reference intro no longer counts three pages | Coordination hand-backs this run: zero |
| 2026-09-26 | TK-00S | Task closed | Red/green tools/test-skill-catalog.mjs (red 756715b, green 485eacd); test-direct-promotion 27/27 with mixed-note decision-versus-pending characterization; full AGENTS suite 48/48 at 378ed60; fresh-context scenario promoted the confirmed naming decision with its correction and left the pending retention answer unresolved in the note; wiki validate ok | workbench/skills/promote/SKILL.md, new workbench/wiki/skill-promote.md and its workbench/wiki/MEMORY.md route (Skills Reference intro no longer counts three pages); RUNBOOK, BLUEPRINT, LEXICON, README, templates and skills README checked with no update needed because none restates the pending convention, one-owner rule or a draft path and their promotion wording stays accurate | Separate-context candidate review; owner Human QA of conversational fidelity, including whether a revised answer plus a write instruction confirms without a readback; the second scripted promotion was not observed; installed personal skill copies not updated; RUNBOOK names no draft path, so any S-00P/S-00R lifecycle wording change should keep the recovery example consistent |
| 2026-09-26 | review | Review verdict: pass at ce2d8e65cb3d65501c4c8a7a63397cb585491fd5 [7320e10da687] #1 | No High/Medium/Low findings. Reviewed immutable candidate 6a7d4f04e22b3d1f57508af51ab4c4f070174339 against base 89d4042; ce2d8e6 merges origin/integration ec848e5 into it (739d32b) and keeps integration's already-generic Skills Reference intro instead of the candidate's rewording (ce2d8e6), so the landed diff equals the reviewed one outside generated TASKBOARD/CATALOG apart from that intro and one blank line; the MEMORY router keeps every sibling entry. Reviewer ran wiki.mjs validate and git diff --check (pass) and checked by source that project-contained drafts are enforced by path safety, ignored-note citations are refused and pending source_record entries stay unresolved; fixture tests hit EPERM on mkdtemp in its sandbox. Landing agent ran the full AGENTS suite 48/48 on ce2d8e6 | Codex CLI codex exec -s read-only -m gpt-5.5, separate context from the builder and landing agent | 4 |

## Completion Result

TK-00S stated pending recognition, one owner per claim, the ignored in-project draft and the retained pending item in `workbench/skills/promote/SKILL.md`. It found no runtime defect and added a mixed-note runtime characterization. It also authored `workbench/wiki/skill-promote.md`, routed from `workbench/wiki/MEMORY.md`, with one fresh-context scenario. A separate-context review passed. The Spec is not complete: owner Human QA of conversational fidelity remains.

## Supersession

- Supersedes: the promote article assignment in the unmerged oversized Skills Wiki packet, not its historical evidence.
- Superseded by: none.
