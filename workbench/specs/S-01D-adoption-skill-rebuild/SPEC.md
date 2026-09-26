# S-01D - adoption skill rebuild

**Spec ID:** S-01D
**Status:** active
**Priority:** 2
**Owner:** claude-lane-C-worker
**Stance:** Builder
**Updated:** 2026-09-26
**Catalog description:** Bring an existing project into the Workbench once while preserving room truth.
**Blockers:** none.
**Latest event:** TK-00U closed with proof.
**Next gate:** Separate-context review of the TK-00U candidate, then owner Human QA of conversational fidelity on `integration`, then `complete S-01D`.

> **Citation anchors.** pre=`4940233e74a93a8390f73f8ac6ba39ef53131798` post=`4940233e74a93a8390f73f8ac6ba39ef53131798`.

## Outcome

Bring an existing project into the Workbench once while preserving room truth. This Spec owns the adoption skill's source review, supported repair or update, focused behavioral verification and its individual Wiki article. A source change is required only when the review finds an actual gap against accepted behavior.

## Why It Matters

The prior Skills Wiki packet grouped the whole core inventory into one completion gate. A skill-sized owner lets adoption reach a checkable destination without waiting for unrelated skill rebuilds. The article explains the result to readers; it does not instruct the agent or replace the executable source.

## Current Verified State

- `workbench/skills/adoption/SKILL.md` is the manifest-declared core source at the pre anchor.
- `workbench/wiki/skill-adoption.md` is not yet routed as a current skill article; its existence and links must be rechecked before authoring.
- S-00V established the managed skill lane that this entry consumes. No fresh behavioral scenario for this per-skill delivery is claimed by this planning packet.

## Desired Behavior

1. The first adoption inventories code, controls, provenance and recovery before installing the managed layout.
2. An already adopted room routes to update-harness; a second adoption record is rejected.
3. The skill's declared source, catalog/discovery route, tests, and one routed Wiki article agree on verified current behavior, intended limits and source revision. The article gives purpose, when to use it, a concrete example, inputs/outputs, completion signs, composition, limits and governing links.

## Decisions And Contracts

- This Spec owns adoption alone. Shared controls, manifest, catalog and the sole Wiki router are edited only as required by this skill's proven change; neighboring skill specs retain their own source and article ownership.
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
| TK-00U | Audit adoption, deliver the smallest supported source/documentation change and prove the routed article | done | none | Audit found adoption ran migrate before recovery/provenance and still named a provider home; red 1989081 then green 1c96eac reorder the skill to classify, baseline, record provenance and verify the recovery point before migrate; test-workbench-adoption characterizes second-adoption refusal (support-root-exists, provenance and recovery record unchanged); full AGENTS suite 48/48 at 542a15f; fresh-context scenario adopted a scratch project, declined re-adoption and resumed from a fresh remote clone with code and rules intact; wiki validate ok |

### TK-00U - Deliver the adoption skill destination

**Stance:** Builder

Inspect the current source, its callers/composition and relevant tests. Demonstrate the first meaningful gap at a stable seam or record that no source defect was found. Repair only the supported gap, exercise the scenario below, reconcile this skill's Wiki article and router, then record exact evidence and limits. Keep this task one skill wide.

## Acceptance Criteria

- [x] The first adoption inventories code, controls, provenance and recovery before installing the managed layout.
- [x] An already adopted room routes to update-harness; a second adoption record is rejected.
- [x] The named scenario is observed in a fresh or otherwise independent context: An existing repository retains its room-owned state and can resume from the recorded recovery point.
- [x] `workbench/wiki/skill-adoption.md` accurately distinguishes verified current behavior from remaining intended behavior, links the current source and governing owners, and is reachable from `workbench/wiki/MEMORY.md`.
- [ ] Relevant targeted tests/scenarios, Wiki validation, the required full suite, Workbench self-drift pre/post receipts and separate-context review are recorded at their proper gates; no unrun check is reported as passing.

## Testing Seams

Use the skill's public entry and its nearest source/test seam for the scenario: An existing repository retains its room-owned state and can resume from the recorded recovery point. Structural catalog and Wiki checks prove routing, not agent behavior. If the skill changes behavior, show red then green at the closest meaningful seam. A human review may still be needed for conversational fidelity.

## Verification Procedure

Run targeted tests for the changed source and `node workbench/tools/wiki.mjs validate`, then the current full suite in AGENTS.md. Run `node workbench/tools/spec-workbench.mjs render` and `doctor`; capture the self-drift pre/post receipts and a bounded semantic check. Review the immutable candidate separately before integration. Record actual commands and results in this Spec.

## Documentation Impact

Maintain `workbench/wiki/skill-adoption.md` and its sole router entry alongside the skill change. Update shared controls or generic template wording only where this skill changes their meaning; record `Docs checked; no update needed` with a reason when they do not change.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-24 | planning | Owner directed one delivery Spec per skill; this Spec names adoption's destination and first slice | Current manifest, core catalog, source presence and Wiki route inspected at pre anchor; no behavior change or scenario trial | This Spec authored; article remains future work | TK-00U and independent delivery proof remain open |
| 2026-09-24 | planning verification | Skill-sized ownership and routing checked on the isolated candidate | All 47 required AGENTS commands passed; Wiki validation and exact 21 core plus one proposed entry coverage passed; doctor has no blocking finding; pre/post self-drift at 4940233 retained the same seven pre-existing findings and cleanUpdate false | No skill source or new article authored in this planning pass | Immutable separate-context review and actual skill behavior remain open |
| 2026-09-26 | TK-00U | Audit against Desired Behavior; source gap found and repaired red/green | Audit of `workbench/skills/adoption/SKILL.md` (blob `ecca3f7`, unchanged since `4b6d05c`) against `templates/ADOPTION.md`, `tools/workbench-adoption.mjs`, `tools/workbench-classify.mjs`, RUNBOOK V3 Adoption migration check, the `genesis` and `update-harness` skills, `workbench/skills/README.md` row and `tools/test-skill-catalog.mjs`/`tools/test-workbench-adoption.mjs`. Desired Behavior 1 gap: the skill ran `workbench-adoption.mjs migrate` in step 2 but verified remote recovery only in step 4 and recorded source provenance only in step 6, never named the `workbench-classify.mjs classify` route check, still told the agent to install the core bundle in a provider home (the helper has laid skills into `workbench/skills` from the release since S-00V; RUNBOOK and ADOPTION say no provider home is read) and routed dirty state through "checkpoint owned work" (retired by S-048). Red `1989081`: new `test-skill-catalog.mjs` assertions fail with "adoption must inventory workbench-classify.mjs classify before the migration installs the managed layout". Green `1c96eac`: step 2 now classifies, takes the baseline, records source remote/ref/resolved commit and verifies the recovery point before step 3 runs `migrate`; step 3 states the core skills go into the room's own `workbench/skills` lane and the home is never read or written; catalog green. Desired Behavior 2 characterization added in `1989081` to `test-workbench-adoption.mjs` and passing without a tool change: a second `migrate` on a room the helper already adopted exits nonzero `blocked`/`support-root-exists`, `moved: []`, manifest `provenance.lifecycle: adoption` and `adoption-recovery.json` byte-identical; the first adoption completes with an empty `--home` and writes nothing there. `f1baf5a` renames the unavailable-baseline location to the Spec's `**Baseline:**` field after the scenario agent misread it. Targeted: test-skill-catalog, test-skills-lane, test-core-skill-installer, test-skill-inspection, test-workbench-adoption, test-workbench-upgrade, test-delivery-skills all exit 0 on the committed tree | `workbench/skills/adoption/SKILL.md` (blob now `fae833c`); `tools/test-skill-catalog.mjs`; `tools/test-workbench-adoption.mjs` | No `workbench-adoption.mjs` public behavior changed |
| 2026-09-26 | TK-00U | Fresh-context scenario: one general-purpose Claude Opus 5.5 subagent given only the adoption skill, a clone of the candidate release at `6ffe203` (pre-rebase SHA of `1c96eac`; skill blob identical to `f1baf5a` except the Baseline sentence) and a scratch project `inkwell` (3 commits, 2 node tests, own AGENTS/CLAUDE/README/ROADMAP, root MEMORY.md, legacy `specs/`, local bare remote at `main` `31fa58c`); owner scripted by the implementing agent | Turn 1 "adopt inkwell": ran `classify` (verdict `adoption`), baseline `npm test` 2/2, `ls-remote` showed `main` at `31fa58c`, set local `origin/HEAD`, pushed `integration` from `main`, branched `claude/adopt-inkwell`; first commit `3d09dd1` recorded provenance, baseline and inventory in an owning Spec before any control changed; `39274a8` reconciled the seven controls (four original AGENTS rules verbatim); `migrate` with an empty `$T/home` returned `complete`, moved `specs/` and `MEMORY.md`, residue empty, home still empty; tools/skills verify valid (21 files, 22 skills), layout validate valid, doctor ok; archived ROADMAP byte-identical; pushed. Turn 2 "adopt again for a fresh record": `classify` returned `upgrade`; did not run `migrate`; told the owner a second adoption record contradicts the first and `/update-harness` is the route; recovery record SHA-256 `6e78eb0c...` unchanged. Turn 3 "resume on another machine": fresh clone of the bare remote, checkout `claude/adopt-inkwell` at `9e48533`; `npm test` 2/2, layout validate valid, doctor ok, wiki validate ok. Implementer verification: remote refs `main`=`integration`=`31fa58c`, branch `9e48533`; `git diff 31fa58c 9e48533 -- src test package.json .gitignore` empty; archived ROADMAP SHA-256 equals the pre-adoption `ce78e554...`; all four AGENTS rules present; manifest lifecycle `adoption`, `git.defaultBranch` `main`; recovery record present and git-ignored (`workbench/sessions/.gitignore:13 recovery/*`) | None | One run, one model, scripted owner, tiny project with a local bare remote; not owner Human QA or a repeated trial. Unexercised: dirty tree, `unclassifiable`, legacy `Wiki/`/`skills/`, `unavailable` baseline, remote creation; no separate review so nothing merged to `integration`. Agent briefly wrote one report file one level above the trial folder and moved it back. Gaps it surfaced outside this skill (recorded, not changed): the recovery record is git-ignored so a remote-only resume depends on the pushed branch and the Spec's copy; without `origin/HEAD` the helper declares the checked-out task branch as `git.defaultBranch`; ADOPTION.md names no pre-migration location for the owning Spec; control version stamp and letter-bearing Spec IDs appear only in tool code; the protocol's "integration at the migration commit" box vs review-gated merge |
| 2026-09-26 | TK-00U | Gates before close | Full AGENTS suite 48/48 on committed candidate `a15daf2` (pre-rebase, base `a2b6e68`) and again 48/48 on the rebased candidate `542a15f` (base `f0584b0`; logs first line `dirty: []`); `git diff a2b6e68 a15daf2` equals `git diff f0584b0 542a15f` outside generated TASKBOARD/CATALOG, the router line position and one hunk offset, apart from the article's source-revision sentence which now names the blob instead of the pre-rebase SHAs. Guardrail `evaluate-workbench --path templates --include-controls` 106.6/113 before (`5e90e2c`) and after (`a15daf2`, `542a15f`), output identical, remaining recommendation the pre-existing Team coordination item. Self-drift pre (`5e90e2c`) and post (`a15daf2`, `542a15f`) all exit 1, `cleanUpdate` false, the same seven pre-existing attention findings (stale-claim S-00Q, five stale-seed, unverified-provenance). `wiki.mjs validate` ok; `test-wiki` green; `git diff --check` clean; `render` and `doctor` no blocking finding. Bounded semantic check: RUNBOOK V3 Adoption migration check (no provider home, `support-root-exists`, `unreconciled-controls`), `templates/ADOPTION.md` (classify first, Phase 0 provenance before changing the harness, Phase 7 skills lane), LEXICON Normal setup / Explicit skill update / Declared integration branch, BLUEPRINT (no adoption-order claim), `workbench/skills/README.md` row and the `genesis`/`update-harness` routes all agree with the repaired skill | Added `workbench/wiki/skill-adoption.md` and its router entry in `workbench/wiki/MEMORY.md`. Docs checked; no update needed for RUNBOOK, BLUEPRINT, LEXICON, templates or `workbench/skills/README.md`, because they already state the classify-first, provenance-before-change and release-laid skills behavior the skill now follows, and those files are outside this lane | Coordination hand-backs this run: zero |
| 2026-09-26 | TK-00U | Task closed | Audit found adoption ran migrate before recovery/provenance and still named a provider home; red 1989081 then green 1c96eac reorder the skill to classify, baseline, record provenance and verify the recovery point before migrate; test-workbench-adoption characterizes second-adoption refusal (support-root-exists, provenance and recovery record unchanged); full AGENTS suite 48/48 at 542a15f; fresh-context scenario adopted a scratch project, declined re-adoption and resumed from a fresh remote clone with code and rules intact; wiki validate ok | workbench/skills/adoption/SKILL.md; workbench/wiki/skill-adoption.md and its MEMORY.md router entry; RUNBOOK, BLUEPRINT, LEXICON, templates and skills README checked with no update needed because they already state classify-first, provenance-before-change and release-laid skills | Separate-context candidate review; owner Human QA; protocol/helper gaps recorded not changed (git-ignored recovery record, defaultBranch fallback without origin/HEAD, no pre-migration owning-Spec location, stamp and Spec-ID rules only in tool code); installed personal skill copies not updated |

## Completion Result

TK-00U audited `workbench/skills/adoption/SKILL.md` and found it ran the migration before verifying recovery and recording provenance, never named the route classifier, still sent the agent to a provider home the migration no longer reads, and routed dirty state through the retired checkpoint copy. A red catalog test pinned the inventory-before-migration order and the green change reordered the skill so it classifies the room, takes the baseline, records provenance and verifies the recovery point before `migrate`. A new helper characterization shows a second adoption of an adopted room is refused without rewriting its provenance or recovery record; no helper change was needed. `workbench/wiki/skill-adoption.md` and its router entry were authored, and one fresh-context scenario adopted a scratch project, declined a second adoption and resumed it from a fresh clone of its remote with the project's own code and rules intact. The Spec is not complete: separate-context review and owner Human QA remain.

## Supersession

- Supersedes: the adoption article assignment in the unmerged oversized Skills Wiki packet, not its historical evidence.
- Superseded by: none.
