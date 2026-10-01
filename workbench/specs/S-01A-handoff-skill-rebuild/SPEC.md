# S-01A - handoff skill rebuild

**Spec ID:** S-01A
**Status:** active
**Priority:** 2
**Owner:** claude-lane-A-worker
**Stance:** Builder
**Updated:** 2026-10-01
**Catalog description:** Transfer one objective to a named destination in readable Markdown.
**Blockers:** none.
**Latest event:** Owner confirmed and promoted the role-based handoff correction; TK-00R proof remains historical delivery evidence.
**Next gate:** Align handoff source and bundled shape with the accepted correction, then verify delegation and recipient behavior; owner Human QA and completion remain open.

> **Citation anchors.** pre=`4940233e74a93a8390f73f8ac6ba39ef53131798` post=`4940233e74a93a8390f73f8ac6ba39ef53131798`.

## Outcome

Transfer one objective to a named destination in readable Markdown. This Spec owns the handoff skill's source review, supported repair or update, focused behavioral verification and its individual Wiki article. A source change is required only when the review finds an actual gap against accepted behavior.

## Why It Matters

The prior Skills Wiki packet grouped the whole core inventory into one completion gate. A skill-sized owner lets handoff reach a checkable destination without waiting for unrelated skill rebuilds. The article explains the result to readers; it does not instruct the agent or replace the executable source.

## Current Verified State

- At `574df962fcfdd8045ec4dd405ba7f548216f7d4a`, the manifest-declared handoff source, bundled Markdown shape and routed `workbench/wiki/skill-handoff.md` exist. TK-00R's completed proof and its 2026-09-26 scenario remain in the evidence log.
- The source and shape still describe inherited authorization and owner-requested authorship. The notepad skill also describes owner-requested transfer. Their alignment with the 2026-10-01 accepted role and delegation correction is an implementation gap, not verified behavior.
- This promotion changes accepted controls and documentation only. It does not reopen TK-00R, create a corrective Task, update skill sources/assets, install personal copies or claim a new behavioral trial.

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

- [ ] The handoff source and bundled shape agree with the accepted 2026-10-01 correction; focused role-based delegation, upward reporting and Q12 investigation-and-return behavior are verified.

## Testing Seams

Use the skill's public entry and its nearest source/test seam for the scenario: A receiving agent continues a specification-only request without implementing it and can resolve every cited owner. Structural catalog and Wiki checks prove routing, not agent behavior. If the skill changes behavior, show red then green at the closest meaningful seam. A human review may still be needed for conversational fidelity.

## Verification Procedure

Run targeted tests for the changed source and `node workbench/tools/wiki.mjs validate`, then the current full suite in AGENTS.md. Run `node workbench/tools/spec-workbench.mjs render` and `doctor`; capture the self-drift pre/post receipts and a bounded semantic check. Review the immutable candidate separately before integration. Record actual commands and results in this Spec.

## Documentation Impact

Maintain `workbench/wiki/skill-handoff.md` and its sole router entry alongside the skill change. Update shared controls or generic template wording only where this skill changes their meaning; record `Docs checked; no update needed` with a reason when they do not change.

## Draft-wiki alignment (owner direction 2026-09-30)

Group: productivity. Matt counterpart: productivity/handoff. Enabling Spec: S-002L.
Intended slice direction: the six per-skill steps of the draft skills wiki
(1 investigate ours, 2 draft the article, 3 investigate Matt's skill at
`mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`, 4 compare,
5 align the article, 6 fix or create the skill), to be cut into Tasks by
`/to-tasks` (at activation for a planned Spec; as additional Tasks when the
Dispatcher takes up an already-active one). Tasks already cut stay as they
are. This section changes none of this Spec's acceptance, evidence or status;
steps 1-5 touch only the draft wiki and step 6 only this skill's lane.

## Accepted handoff correction (2026-10-01)

The owner confirmed the author/recipient and assigner/assignee distinction and
explicitly selected promotion. [AGENTS](../../../AGENTS.md#handoff-assignments-and-shared-context)
owns role authority, delegation and shared scaffolding boundaries;
[LEXICON](../../../LEXICON.md#artifact-boundaries) owns the artifact meanings;
[RUNBOOK](../../../RUNBOOK.md#handoff-transfer) owns recipient-purpose and
transfer preparation. These owners supersede a reading that the handoff
itself grants authorization or that agents must obtain a new owner request
for every transfer.

The next authorized source-repair slice must reconcile the handoff skill,
its bundled shape and `templates/HANDOFF.md`, tests and Wiki explanation with
those owners. Coordinate the notepad composition wording with its own skill
owner; this Spec does not absorb another skill's implementation. Preserve
TK-00R and all completed evidence. A delegation/completion-report scenario and
a Q12-only investigation-and-return scenario remain unverified for this
correction. No runtime, installation or owner Human QA result is implied.

## Promotion receipt (2026-10-01)

The public promotion seam selected `decision-002`, `decision-003`,
`decision-004` and `decision-005` from source revision 15 after the author read
the correction history. Source SHA-256:
`12dd55d5700d91ffb73d9b36eadf404275f2d782a5941185e21f7157094976c8`.
Privacy, existing-owner structure, expected destination hashes and exact byte
read-back passed; these checks do not establish semantic fidelity or runtime
behavior. Source context and corrections remain retained locally.

Initial promoted owner bytes, contained in `f98f0ea183e2507231ca494c9166472cd9f963f2`:

| Owner | SHA-256 |
|---|---|
| `AGENTS.md` | `d08f06d58ac0862c2344563c2640591a1ac067e3ff05465889c07695ec03e25c` |
| `LEXICON.md` | `92ea4a030fc269f1d96f398da3085e6416a1e758f3c6817b0d3e0c7df84e7177` |
| `RUNBOOK.md` | `1ca7c08d95a712bfde1f24e18ecff7cd3200f74ba3ffc01a5e39f9f98c9d6ae7` |
| `workbench/specs/S-01A-handoff-skill-rebuild/SPEC.md` | `df1e46fc1710aaa4b61701051942e882de061fa1b4396eed20b540bc059c1f74` |
| `workbench/wiki/skill-handoff.md` | `3f694c1405f1093b5be6a86ebdda6e371bce4d899701fe51695b816121128e56` |

The control templates were synchronized with their filled owners. Subsequent
Spec evidence and the historical Completion Result clarification are separate
from these initial hashes. The handoff skill source and shapes remain unchanged.

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
| 2026-09-26 | TK-00R verdict-row correction | Correction: the review verdict row above names `c9b07f3`, an intermediate merge tip of the lane (integration merged into the reviewed commit), not the commit Codex reviewed or the landed head. Codex reviewed `f3a894b` against base `d16ef63`, and PR #171 landed at head `58c89a8` via merge `ef9dcfb`. The published verdict row stays as recorded; the retro review row above supplies the review of the landed contribution | Verified with git: `f3a894b` is an ancestor of `c9b07f3`, which is an ancestor of `58c89a8`; `ef9dcfb^2` is `58c89a8` | Docs checked; no update needed: record-only row | none |
| 2026-09-26 | review | Review verdict: pass at eec12cf74ee3f649fa199cfe618c67f4df697938 [4141ef7d4d23] #2 | none; final-content review of the Spec at eec12cf (checked acceptance lines supported by recorded evidence, Completion Result accurate against source, header and Wiki route consistent); refreshes the digest after the boxes and Completion Result were written post-verdict; fixture tests not run in the reviewer sandbox | Codex CLI codex exec -s read-only -m gpt-5.5, separate context (Lane E log E-gate-review-1.log) | 4 |

| 2026-10-01 | promotion | Owner confirmed the role-based handoff correction and selected promotion; prior completed TK-00R retained | Public hash-checked promotion and owner byte read-back; all 48 required AGENTS commands passed on `f98f0ea183e2507231ca494c9166472cd9f963f2`; control fidelity, vocabulary, catalog and Wiki checks passed. The initial session-suite refusal for uncommitted template identity was resolved by committing the exact candidate before the full rerun. Pre/post self-drift at base `574df962fcfdd8045ec4dd405ba7f548216f7d4a` and candidate `f98f0ea183e2507231ca494c9166472cd9f963f2` retain the same seven findings and `cleanUpdate: false`; guardrail unchanged 78/100. Bounded semantic read-back checked author/recipient, assigned-role limits, delegation, shared scaffolding, recipient purpose and historical/current Wiki distinctions | AGENTS, LEXICON, RUNBOOK and generic mirrors; this Spec and routed Wiki explanation; Taskboard regenerated | Source/shape and neighboring notepad composition alignment, behavioral scenarios, integration gate and owner Human QA remain open; no agent-outcome improvement claimed |

## Completion Result

TK-00R mapped every obligation in `workbench/skills/handoff/SKILL.md` onto a heading of its bundled Markdown shape, which stays byte-equal to `templates/HANDOFF.md`. The source now puts a correction beside the claim it corrects, cites an untracked live notepad only for a recipient in the same checkout, and applies notepad retention only when the handoff draws on a note. `workbench/wiki/skill-handoff.md` records the pinned upstream comparison and one two-agent fresh-context scenario. A separate-context review passed. This is TK-00R's historical 2026-09-26 result and review. The Spec remains open: the accepted 2026-10-01 correction still needs source/shape alignment and new delegation, reporting and Q12 return proof; owner Human QA of conversational fidelity also remains open.

## Supersession

- Supersedes: the handoff article assignment in the unmerged oversized Skills Wiki packet, not its historical evidence.
- Superseded by: none.
