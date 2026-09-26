# S-01A - handoff skill rebuild

**Spec ID:** S-01A
**Status:** active
**Priority:** 2
**Owner:** claude-lane-A-worker
**Stance:** Builder
**Updated:** 2026-09-26
**Catalog description:** Transfer one objective to a named destination in readable Markdown.
**Blockers:** none.
**Latest event:** TK-00R closed with proof.
**Next gate:** Owner Human QA on `integration`, then `complete S-01A`.

> **Citation anchors.** pre=`4940233e74a93a8390f73f8ac6ba39ef53131798` post=`4940233e74a93a8390f73f8ac6ba39ef53131798`.

## Outcome

Transfer one objective to a named destination in readable Markdown. This Spec owns the handoff skill's source review, supported repair or update, focused behavioral verification and its individual Wiki article. A source change is required only when the review finds an actual gap against accepted behavior.

## Why It Matters

The prior Skills Wiki packet grouped the whole core inventory into one completion gate. A skill-sized owner lets handoff reach a checkable destination without waiting for unrelated skill rebuilds. The article explains the result to readers; it does not instruct the agent or replace the executable source.

## Current Verified State

- `workbench/skills/handoff/SKILL.md` is the manifest-declared core source at the pre anchor.
- `workbench/wiki/skill-handoff.md` is not yet routed as a current skill article; its existence and links must be rechecked before authoring.
- Current source includes a Markdown asset; S-00W does not own this skill. No fresh behavioral scenario for this per-skill delivery is claimed by this planning packet.

## Desired Behavior

1. The handoff carries the exact authorized endpoint, corrections, access limits, source links and one executable next action.
2. A pointer depends on accessible retained context; authorship alone never sends, executes or widens scope.
3. The skill's declared source, catalog/discovery route, tests, and one routed Wiki article agree on verified current behavior, intended limits and source revision. The article gives purpose, when to use it, a concrete example, inputs/outputs, completion signs, composition, limits and governing links.

## Decisions And Contracts

- **Source lineage:** Historical pinned comparison found the continuation idea preserved with Workbench-specific Markdown routing, correction and scope boundaries. The article must state the adaptation and verify the source revision it compares.

- This Spec owns handoff alone. Shared controls, manifest, catalog and the sole Wiki router are edited only as required by this skill's proven change; neighboring skill specs retain their own source and article ownership.
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
| TK-00R | Audit handoff, deliver the smallest supported source/documentation change and prove the routed article | done | none | Red/green tools/test-skill-catalog.mjs (red 645a95c, green 8b36657); test-core-composition shape byte-equality unchanged; full AGENTS suite 48/48 at 7e40897; two-agent fresh-context scenario: the author mapped every obligation onto the shape and inlined the untracked note, and the recipient in a separate clone stayed specification-only and opened every cited path; wiki validate ok |

### TK-00R - Deliver the handoff skill destination

**Stance:** Builder

Inspect the current source, its callers/composition and relevant tests. Demonstrate the first meaningful gap at a stable seam or record that no source defect was found. Repair only the supported gap, exercise the scenario below, reconcile this skill's Wiki article and router, then record exact evidence and limits. Keep this task one skill wide.

## Acceptance Criteria

- [x] The individual Wiki article records the supported upstream relationship and its practical local effect against a pinned source, with uncertainty visible.

- [x] The handoff carries the exact authorized endpoint, corrections, access limits, source links and one executable next action.
- [x] A pointer depends on accessible retained context; authorship alone never sends, executes or widens scope.
- [x] The named scenario is observed in a fresh or otherwise independent context: A receiving agent continues a specification-only request without implementing it and can resolve every cited owner.
- [x] `workbench/wiki/skill-handoff.md` accurately distinguishes verified current behavior from remaining intended behavior, links the current source and governing owners, and is reachable from `workbench/wiki/MEMORY.md`.
- [x] Relevant targeted tests/scenarios, Wiki validation, the required full suite, Workbench self-drift pre/post receipts and separate-context review are recorded at their proper gates; no unrun check is reported as passing.

## Testing Seams

Use the skill's public entry and its nearest source/test seam for the scenario: A receiving agent continues a specification-only request without implementing it and can resolve every cited owner. Structural catalog and Wiki checks prove routing, not agent behavior. If the skill changes behavior, show red then green at the closest meaningful seam. A human review may still be needed for conversational fidelity.

## Verification Procedure

Run targeted tests for the changed source and `node workbench/tools/wiki.mjs validate`, then the current full suite in AGENTS.md. Run `node workbench/tools/spec-workbench.mjs render` and `doctor`; capture the self-drift pre/post receipts and a bounded semantic check. Review the immutable candidate separately before integration. Record actual commands and results in this Spec.

## Documentation Impact

Maintain `workbench/wiki/skill-handoff.md` and its sole router entry alongside the skill change. Update shared controls or generic template wording only where this skill changes their meaning; record `Docs checked; no update needed` with a reason when they do not change.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-24 | planning | Owner directed one delivery Spec per skill; this Spec names handoff's destination and first slice | Current manifest, core catalog, source presence and Wiki route inspected at pre anchor; no behavior change or scenario trial | This Spec authored; article remains future work | TK-00R and independent delivery proof remain open |
| 2026-09-24 | planning verification | Skill-sized ownership and routing checked on the isolated candidate | All 47 required AGENTS commands passed; Wiki validation and exact 21 core plus one proposed entry coverage passed; doctor has no blocking finding; pre/post self-drift at 4940233 retained the same seven pre-existing findings and cleanUpdate false | No skill source or new article authored in this planning pass | Immutable separate-context review and actual skill behavior remain open |
| 2026-09-26 | TK-00R | Audit, then red/green at the catalog seam | Lane fast-forwarded from `89d4042` to `origin/integration` `058f089` before the claim (no local commits existed). Audit at `058f089`: source step 3 required a named destination, corrections, access limits, inherited authorization, blockers and remaining verification, but the bundled `assets/HANDOFF.md` shape (byte-equal to `templates/HANDOFF.md`, asserted by `tools/test-core-composition.mjs`) has no heading for any of them; step 4 presumed a source notepad exists; nothing warned that an untracked live notepad is unreadable outside its checkout. `node tools/test-skill-catalog.mjs` failed red at `645a95c` (`the handoff source must place its obligations on exactly the sections its bundled shape has`, mapped sections empty against eight shape headings) and passed green at `8b36657`. Targeted `test-skill-catalog`, `test-core-composition`, `test-skills-lane`, `test-core-skill-installer`, `test-skill-inspection` and `test-notepads` green at `8b36657` | Source maps each obligation onto one of the eight shape headings, puts a correction beside the claim it corrects, limits live-note pointers to the same checkout, and makes notepad retention conditional on a source note; the shape stays byte-equal to `templates/HANDOFF.md`. Authorship-only boundary and `active_handoffs` retention: no source defect found, now pinned | Dedicated shape headings for corrections and access limits would need `templates/HANDOFF.md` and the asset changed together; templates are outside this lane (S-00P). Out-of-lane findings: `templates/sessions/notepads/templates/handoff.example.json` is a JSON handoff example beside the Markdown-only rule, and the `notepads.mjs` handoff refusal message points at `templates/HANDOFF.md`, which an installed room may not have |
| 2026-09-26 | TK-00R | Fresh-context scenario: two general-purpose Claude Opus 5.5 subagents in separate scratch clones at `8b36657` with the remote removed, owner scripted by the implementing agent | Part A, author: given only the handoff source and shape, room A and a seeded local note (two decisions, `finding-001` with `correction-001` excluding superseded Specs, open Q3 on output format), told the recipient works in a separate clone that sees only committed files and must write the Spec only. It wrote `workbench/sessions/handoffs/spec-stats-command.md` (166 lines, every shape heading filled): the owner's exclusion quoted under Authorized endpoint with no claim, Tasks, code or Q3 answer; the note content inlined with the earlier and corrected meaning side by side; Q3 open; the untracked note and untracked handoff named as access limits; sources pinned at `8b36657`; one resume point. It set the note's `active_handoffs` (revision 6 to 7) and its state (7 to 8), committed and sent nothing, reported author read-back performed and fresh read-back not performed, and said the owner must deliver the ignored file. Part B, recipient: a fresh subagent in room B, which had no note, received only the delivered file and "Here's the handoff from the previous agent. Please continue." It restated the Spec-only endpoint, opened every cited path (all matched; one author search claim was incomplete, an unrelated `evals/lib/stats.py` hit, recorded in its Spec), wrote planned `S-01U` excluding superseded Specs, kept Q3 as an open owner choice with its only Task blocked on it, ran `render` and `doctor`, and stopped. Room B diff against `8b36657`: only the new Spec and its `CATALOG.md` row; the handoff file unchanged | None | One run, one model, scripted owner. The pinned commit existed only on an unpushed local branch shared by both clones. Room B's suite failed 20 of 48 on the missing `origin` remote, a scenario-setup limit. Not owner Human QA or a repeated trial |
| 2026-09-26 | TK-00R | Gates before close | Full AGENTS suite 48/48 on committed candidate `7e40897` (read-only runner candidate header, dirty list empty). Guardrail audit 78/100 before (`397fd84`) and after (`7e40897`), remaining recommendations the four pre-existing Outcome-evidence items; `evaluate-workbench --path templates --include-controls` 106.6/113 before and after. Self-drift pre at `397fd84` and post at `7e40897` both `blocked` with the same seven pre-existing attention findings (S-00Q stale claim, five stale seeds, one provenance) and cleanUpdate false. `wiki.mjs validate` ok; `render` then `doctor` no blocking finding; `git diff --check` clean. Bounded semantic check: BLUEPRINT (job, boundaries, accessible context, one next action), the LEXICON Handoff and Scoped handoff rows, the RUNBOOK notepad and handoff procedure, `workbench/skills/README.md` and the notepad source's handoff paragraph all agree with the delivered source | `workbench/wiki/skill-handoff.md` authored with the pinned upstream comparison (`mattpocock/skills@c55ee46`, upstream `main` on 2026-09-26) and routed from `workbench/wiki/MEMORY.md`. Docs checked; no update needed in AGENTS, RUNBOOK, BLUEPRINT, LEXICON, templates or the skills README because none restates the heading mapping and their handoff wording stays accurate | Coordination hand-backs this run: zero |
| 2026-09-26 | TK-00R | Task closed | Red/green tools/test-skill-catalog.mjs (red 645a95c, green 8b36657); test-core-composition shape byte-equality unchanged; full AGENTS suite 48/48 at 7e40897; two-agent fresh-context scenario: the author mapped every obligation onto the shape and inlined the untracked note, and the recipient in a separate clone stayed specification-only and opened every cited path; wiki validate ok | workbench/skills/handoff/SKILL.md, workbench/wiki/skill-handoff.md and its workbench/wiki/MEMORY.md route; AGENTS, RUNBOOK, BLUEPRINT, LEXICON, templates and skills README checked with no update needed because none restates the heading mapping and their handoff wording stays accurate | Separate-context candidate review; owner Human QA of conversational fidelity; installed personal skill copies not updated; optional dedicated shape headings for corrections and access limits need templates/HANDOFF.md and the asset changed together (templates outside this lane); out-of-lane JSON handoff example and notepads.mjs refusal message pointing at templates/HANDOFF.md |
| 2026-09-26 | TK-00R correction | Close-candidate proof: the gates row and close row cite the full suite at `7e40897`, before the Spec-only close commit; this row records the suite on the close commit and the integration merge | Full AGENTS suite 48/48 on the committed close candidate `15a76bc51908612add57e1e721356ebf7e59b1e8` (log first line `dirty: []`). `origin/integration` `d16ef63` (S-01E, PR #162) was then merged into the lane as `09249e2` rather than rebased, so every SHA cited above stays reachable; the only conflicts were the generated `TASKBOARD.md`, resolved by `render`, and the `workbench/wiki/MEMORY.md` Skills Reference list, resolved by keeping both the checkpoint and handoff entries under integration's intro wording. A commit cannot name its own SHA, so the suite on the commit carrying this row is recorded in the review verdict row | None | Separate-context review of the corrected candidate; owner Human QA |
| 2026-09-26 | review | Review verdict: pass at c9b07f3a8b397c0edff61c9f3129b10779923701 [eb1f073a7079] #1 | none. Codex reviewed f3a894b against base d16ef63 with no High/Medium/Low: red/green holds by test logic (pre-change SKILL.md maps no shape headings; candidate maps all eight), assets/HANDOFF.md byte-equal to templates/HANDOFF.md, templates untouched, evidence rows and MEMORY.md merge resolution consistent. c9b07f3 adds only integration merges (eaef770 of 889d856, c9b07f3 of 00b67f0); git diff 00b67f0 c9b07f3 equals git diff d16ef63 f3a894b outside generated TASKBOARD/CATALOG and index lines, and its MEMORY.md delta is the same single handoff router line. Full AGENTS suite 48/48 on f3a894b and on eaef770 (log first line dirty: []); on c9b07f3 targeted test-skill-catalog, wiki validate, test-wiki, test-core-composition, test-skills-lane, test-spec-workbench, test-check-append-only and test-spec-citation-anchors pass | Codex CLI codex exec -s read-only -m gpt-5.5, separate context from the implementing worker and the dispatcher, reviewed f3a894b; carried to c9b07f3 by diff-equality; read-only sandbox could not run fixture tests or fetch the pinned upstream mattpocock/skills@c55ee46 | 4 |
| 2026-09-26 | TK-00R retro review | Post-merge separate-context delta review of the landed PR #171 contribution (merge `ef9dcfb`, head `58c89a8`) against the reviewed candidate `f3a894b`: PASS, one Low | Codex gpt-5.5 read-only (Lane E, separate context) compared `git diff d16ef63 f3a894b` with `git diff ef9dcfb^1 ef9dcfb` outside TASKBOARD.md and CATALOG.md: the only differences are the post-review state (Next gate, acceptance line 5, Completion Result, verdict row) and the MEMORY.md router keep-both with to-spec; no handoff content changed or lost. Low: the verdict row names `c9b07f3`, an intermediate merge tip, while Codex reviewed `f3a894b` and the PR landed at `58c89a8`; this row supplies the landed-state review; fixture tests not run in its sandbox | Docs checked; no update needed: record-only row | none; closes the gap left when the landed tip merged after the review without a fresh one (AGENTS.md integration gate) |

## Completion Result

TK-00R mapped every obligation in `workbench/skills/handoff/SKILL.md` onto a heading of its bundled Markdown shape, which stays byte-equal to `templates/HANDOFF.md`. The source now puts a correction beside the claim it corrects, cites an untracked live notepad only for a recipient in the same checkout, and applies notepad retention only when the handoff draws on a note. `workbench/wiki/skill-handoff.md` records the pinned upstream comparison and one two-agent fresh-context scenario. A separate-context review passed. The Spec is not complete: owner Human QA of conversational fidelity remains.

## Supersession

- Supersedes: the handoff article assignment in the unmerged oversized Skills Wiki packet, not its historical evidence.
- Superseded by: none.
