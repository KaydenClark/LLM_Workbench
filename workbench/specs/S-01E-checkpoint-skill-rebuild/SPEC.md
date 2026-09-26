# S-01E - checkpoint skill rebuild

**Spec ID:** S-01E
**Status:** active
**Priority:** 2
**Owner:** claude-lane-A-worker
**Stance:** Builder
**Updated:** 2026-09-26
**Catalog description:** Keep the retired checkpoint command as an accurate compatibility route.
**Blockers:** none.
**Latest event:** TK-00V closed with proof.
**Next gate:** Separate-context review of the TK-00V candidate, then owner Human QA on `integration`, then `complete S-01E`.

> **Citation anchors.** pre=`4940233e74a93a8390f73f8ac6ba39ef53131798` post=`4940233e74a93a8390f73f8ac6ba39ef53131798`.

## Outcome

Keep the retired checkpoint command as an accurate compatibility route. This Spec owns the checkpoint skill's source review, supported repair or update, focused behavioral verification and its individual Wiki article. A source change is required only when the review finds an actual gap against accepted behavior.

## Why It Matters

The prior Skills Wiki packet grouped the whole core inventory into one completion gate. A skill-sized owner lets checkpoint reach a checkable destination without waiting for unrelated skill rebuilds. The article explains the result to readers; it does not instruct the agent or replace the executable source.

## Current Verified State

- `workbench/skills/checkpoint/SKILL.md` is the manifest-declared core source at the pre anchor.
- `workbench/wiki/skill-checkpoint.md` is not yet routed as a current skill article; its existence and links must be rechecked before authoring.
- S-048 owns checkpoint retirement. No fresh behavioral scenario for this per-skill delivery is claimed by this planning packet.

## Desired Behavior

1. The entry explains that new checkpoint copying is retired and directs current continuity to notepad and durable promotion.
2. Frozen historical checkpoint bytes and citations are preserved; the notice creates no new copy.
3. The skill's declared source, catalog/discovery route, tests, and one routed Wiki article agree on verified current behavior, intended limits and source revision. The article gives purpose, when to use it, a concrete example, inputs/outputs, completion signs, composition, limits and governing links.

## Decisions And Contracts

- This Spec owns checkpoint alone. Shared controls, manifest, catalog and the sole Wiki router are edited only as required by this skill's proven change; neighboring skill specs retain their own source and article ownership.
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
| TK-00V | Audit checkpoint, deliver the smallest supported source/documentation change and prove the routed article | done | none | Audit found no source defect (checkpoint SKILL.md blob 1e297ce unchanged); test-sessions 4/4 incl. refusal no-write and S-048 inventory hashes; test-skill-catalog green; full AGENTS suite 48/48 at 1b2c92e; fresh-context scenario routed 'checkpoint this session' to a local notepad with frozen checkpoint bytes unchanged and no new copy; wiki validate ok |

### TK-00V - Deliver the checkpoint skill destination

**Stance:** Builder

Inspect the current source, its callers/composition and relevant tests. Demonstrate the first meaningful gap at a stable seam or record that no source defect was found. Repair only the supported gap, exercise the scenario below, reconcile this skill's Wiki article and router, then record exact evidence and limits. Keep this task one skill wide.

## Acceptance Criteria

- [x] The entry explains that new checkpoint copying is retired and directs current continuity to notepad and durable promotion.
- [x] Frozen historical checkpoint bytes and citations are preserved; the notice creates no new copy.
- [x] The named scenario is observed in a fresh or otherwise independent context: A legacy checkpoint request produces the correct current route without altering a historical record.
- [x] `workbench/wiki/skill-checkpoint.md` accurately distinguishes verified current behavior from remaining intended behavior, links the current source and governing owners, and is reachable from `workbench/wiki/MEMORY.md`.
- [ ] Relevant targeted tests/scenarios, Wiki validation, the required full suite, Workbench self-drift pre/post receipts and separate-context review are recorded at their proper gates; no unrun check is reported as passing.

## Testing Seams

Use the skill's public entry and its nearest source/test seam for the scenario: A legacy checkpoint request produces the correct current route without altering a historical record. Structural catalog and Wiki checks prove routing, not agent behavior. If the skill changes behavior, show red then green at the closest meaningful seam. A human review may still be needed for conversational fidelity.

## Verification Procedure

Run targeted tests for the changed source and `node workbench/tools/wiki.mjs validate`, then the current full suite in AGENTS.md. Run `node workbench/tools/spec-workbench.mjs render` and `doctor`; capture the self-drift pre/post receipts and a bounded semantic check. Review the immutable candidate separately before integration. Record actual commands and results in this Spec.

## Documentation Impact

Maintain `workbench/wiki/skill-checkpoint.md` and its sole router entry alongside the skill change. Update shared controls or generic template wording only where this skill changes their meaning; record `Docs checked; no update needed` with a reason when they do not change.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-24 | planning | Owner directed one delivery Spec per skill; this Spec names checkpoint's destination and first slice | Current manifest, core catalog, source presence and Wiki route inspected at pre anchor; no behavior change or scenario trial | This Spec authored; article remains future work | TK-00V and independent delivery proof remain open |
| 2026-09-24 | planning verification | Skill-sized ownership and routing checked on the isolated candidate | All 47 required AGENTS commands passed; Wiki validation and exact 21 core plus one proposed entry coverage passed; doctor has no blocking finding; pre/post self-drift at 4940233 retained the same seven pre-existing findings and cleanUpdate false | No skill source or new article authored in this planning pass | Immutable separate-context review and actual skill behavior remain open |
| 2026-09-26 | TK-00V | Audit against Desired Behavior; no source defect found | Audit at `058f089` (branch fast-forwarded from `89d4042` to current `origin/integration` before claim). Checked `workbench/skills/checkpoint/SKILL.md` (blob `1e297ce`, unchanged since `4b6d05c`) against Desired Behavior 1-2: it states copying is retired, routes save-for-later to `notepad` and durable claims to `sessions.mjs promote`, keeps `workbench/sessions/checkpoints/` frozen with citations, and says the legacy command refuses and writes nothing. Runtime `checkpoint()` in `workbench/tools/sessions.mjs` returns `blocked` naming notepads and promote; CLI exits 1 (reproduced). `node tools/test-sessions.mjs` 4/4 (function and CLI refusal leave source, frozen record and directory listing unchanged; all six S-048 inventory files match bytes and SHA-256); `node tools/test-skill-catalog.mjs` green. Callers checked: `promote`, `save`, `notepad`, `make-it-so` skills, `workbench/skills/README.md` row, manifest `skillPolicy.required`, RUNBOOK Frozen Checkpoint History, LEXICON Checkpoint term; all agree. No red/green because no behavior gap exists at a stable seam | No source change | Two imprecisions recorded, not repaired (outside this skill's file lane and not a Desired Behavior breach): the refusal uses the shared `invalid-note` finding code (scope `wiki`) rather than a retirement-specific code, and the `sessions.mjs` usage line still lists `checkpoint --from LIVE_RECORD --topic slug [--date YYYY-MM-DD]` without marking it retired |
| 2026-09-26 | TK-00V | Fresh-context scenario: one general-purpose Claude Opus 5.5 subagent given only the checkpoint source and a scratch room (`workbench-layout.mjs init` v3.2.1 plus copied `workbench/tools`, one committed frozen record `workbench/sessions/checkpoints/billing-export-2026-08-30.md` SHA-256 `fc64124c...0b7a0`; no RUNBOOK, no other skill), owner scripted by the implementing agent | Turn 1 "checkpoint this session" (carried context: two findings, one unconfirmed; one owner decision; one unresolved item; one next action). The agent read the manifest and `notepads.mjs` usage/source, hashed the frozen file, created `workbench/sessions/notepads/work/billing-export-duplicates.json`, appended `finding-001`, `finding-002` (marked unconfirmed), `decision-001` and `directive-001`, validated at revision 5, and re-hashed. It ran neither `sessions.mjs checkpoint` nor `promote` and made no git write, citing the save-for-later sentence; its message said checkpoint copies are retired, the save is local and git-ignored and not cross-device, and it would recheck code on resume. Implementer verification: every file under `workbench/sessions/` hashed identical before/after except the one new git-ignored note; `git status --porcelain --ignored` shows no tracked change; note validates (revision 5, 4 entries); a follow-up `sessions.mjs checkpoint` in the room exited 1 and changed no byte | None | One run, one model, scripted owner. The room lacked a RUNBOOK and the `notepad` skill, so the Runbook-read step and notepad-skill judgment were unexercised; the scripted owner declined promotion, so the promote route was unexercised. Not owner Human QA or a repeated trial |
| 2026-09-26 | TK-00V | Gates before close | Full AGENTS suite 48/48 on committed candidate `1b2c92e` (log first line `dirty: []`); guardrail `evaluate-workbench --path templates --include-controls` 106.6/113 before (at `14edac0`) and after (at `1b2c92e`), output identical, remaining recommendation the pre-existing Team coordination item; self-drift pre (`14edac0`) and post (`1b2c92e`) both exit 1, `cleanUpdate` false, the same seven pre-existing attention findings (stale-claim S-00Q, five stale-seed, unverified-provenance); `wiki.mjs validate` ok; `test-wiki` 13/13; `git diff --check` clean; `render` and `doctor` no blocking finding. Bounded semantic check of RUNBOOK (lines on legacy `checkpoint` refusal, Portable Save/Promote, Frozen Checkpoint History), LEXICON Checkpoint and Collection terms, BLUEPRINT (no checkpoint claim), templates (AGENTS, RUNBOOK, GENESIS, ADOPTION checkpoint wording) and `workbench/skills/README.md` row against the unchanged behavior: all accurate | Added `workbench/wiki/skill-checkpoint.md` and its router entry in `workbench/wiki/MEMORY.md` (router intro no longer says "three" concepts). Docs checked; no control or template update needed because no checkpoint behavior changed and their wording matches the verified refusal and routes | Coordination hand-backs this run: zero |
| 2026-09-26 | TK-00V | Task closed | Audit found no source defect (checkpoint SKILL.md blob 1e297ce unchanged); test-sessions 4/4 incl. refusal no-write and S-048 inventory hashes; test-skill-catalog green; full AGENTS suite 48/48 at 1b2c92e; fresh-context scenario routed 'checkpoint this session' to a local notepad with frozen checkpoint bytes unchanged and no new copy; wiki validate ok | workbench/wiki/skill-checkpoint.md and its MEMORY.md router entry; RUNBOOK, BLUEPRINT, LEXICON, templates and skills README checked with no update needed because checkpoint behavior is unchanged and their wording matches the verified refusal and routes | Separate-context candidate review; owner Human QA; refusal finding code and sessions.mjs usage line imprecision (not repaired); installed personal skill copies not updated |

## Completion Result

TK-00V audited `workbench/skills/checkpoint/SKILL.md` and its `sessions.mjs` refusal against the Desired Behavior and found no source defect, so the source is unchanged. It authored `workbench/wiki/skill-checkpoint.md` with its router entry and recorded one fresh-context scenario in which a legacy "checkpoint this session" request was routed to a local notepad with no new checkpoint copy and frozen checkpoint bytes unchanged. The Spec is not complete: the separate-context review and owner Human QA remain.

## Supersession

- Supersedes: the checkpoint article assignment in the unmerged oversized Skills Wiki packet, not its historical evidence.
- Superseded by: none.
