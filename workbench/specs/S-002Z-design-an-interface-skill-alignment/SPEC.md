# S-002Z - design-an-interface skill alignment

**Spec ID:** S-002Z
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-30
**Catalog description:** Compare several genuinely different public interface shapes for a module, recommend one, and record the decision before implementation starts.
**Blockers:** S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5.
**Latest event:** Authored from the owner's 2026-09-30 draft-skills-wiki direction.
**Next gate:** Deliver S-002L, then activate this Spec and cut Tasks from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`07edccc57b8f75613ad1d09203a3e414d867b90c` post=`07edccc57b8f75613ad1d09203a3e414d867b90c`.

## Outcome

The draft Wiki article for `design-an-interface`, its comparison with the nearest upstream material, and the skill source all describe one behavior. Because upstream no longer ships this skill under its own name, the Spec's most likely product is a decision: keep `design-an-interface` as a distinct skill, or fold it into the `codebase-design` skill as a supporting file. The decision is not made here.

## Why It Matters

The owner wants to prototype the skills Wiki on the current skills to find the ones that should connect and do not, and the ones that connect but do not work together. This skill is a likely case of the second kind. Two different texts carry the same "Design It Twice" idea, and the one that would be discovered today is not the one the owner has installed.

## Current Verified State

- The pending source is `skills-pending/design-an-interface/SKILL.md`. It is a five-step workflow: gather requirements, spawn three or more sub-agents that each take a different design constraint, present each design, compare on simplicity, generality, efficiency, depth and ease of misuse, then synthesize. It never writes an artifact, and it ends with "Don't implement". It names no other skill.
- The owner's personal install at `~/.agents/skills/design-an-interface/SKILL.md` is a different, shorter text (631 bytes, last changed 2026-08-16). It uses no sub-agents, records the settled decision in the owning `SPEC.md` or `BLUEPRINT.md`, and hands the approved choice to `/tdd`. The two copies differ in content, not just wording; which one is canonical is an open question for step 1. The personal install is read-only.
- `skills-pending/codebase-design/DESIGN-IT-TWICE.md` is a supporting file of `skills-pending/codebase-design/SKILL.md`, which links it at the "Exploring alternative interfaces" bullet. It runs the same parallel sub-agent pattern in three steps (frame the problem, spawn sub-agents, present and compare), reuses `codebase-design` vocabulary (module, interface, seam, adapter, leverage), and ends with the agent giving its own recommendation. This is the overlap.
- `workbench/skills/README.md` lists `skills-pending/design-an-interface` in its optional-source inventory with no operational consumer and disposition "owner decision required". `tools/test-skill-catalog.mjs` requires exactly one inventory row per optional directory, so removing or moving the directory changes that test's expectation.
- `skills-pending/` is not in the `AGENTS.md` Edit Scope list. S-00R, which owns the optional-source disposition, is the authorizing route for any step 6 change to this directory.
- No Wiki article exists for this skill. The `codebase-design` alignment Spec (S-003M) is a sibling, not an owner of this skill.

## Desired Behavior

1. A reader of the draft article can tell when to reach for the skill, what it needs, what it writes, and how it differs from `codebase-design`.
2. The article states plainly whether the skill records its recommendation anywhere, and where, rather than leaving the output as chat only.
3. Every "needs" and "reads/writes" item resolves to something real or is logged as a finding. At least the `/tdd` handoff and the `SPEC.md`/`BLUEPRINT.md` write in the personal copy must be checked against the pending copy, which names neither.
4. The overlap with `codebase-design` is recorded as an `overlap` finding with a recorded fold-in decision, not left implicit.
5. The skill source in its lane matches the article, or the skill is folded or retired by a decision the owner can see.

## Decisions And Contracts

- Inherited from the owner's 2026-09-30 direction: this skill is an adopted Pending skill in the `shaping` group, source `pending`, with no upstream counterpart at the pin. Steps 1-5 touch only the draft wiki; step 6 is the only step that touches a skill lane.
- Matt Pocock's skills are outside evidence, not Canon. Comparisons read `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`; no upstream file is read or quoted by this planning pass.
- The fold-in decision is open. Keeping both as separate skills, folding this one into `codebase-design`, and retiring it are all possible. A fold or retirement would have to follow S-00R's per-item owner decision rule for the optional-source inventory.
- The article's `origin` is recorded by step 1, not guessed. The pending copy appears to descend from upstream's older `design-an-interface`; step 1 checks that against the provenance commit named in `workbench/skills/README.md`.

## Non-Goals

- Writing the article, editing any skill source, moving, archiving, installing or deleting any skill, in this Spec's planning pass.
- Redefining `codebase-design` vocabulary or editing its source; the `codebase-design` alignment Spec owns it.
- Adding a requirements store. Any recorded decision belongs in the owning `SPEC.md` or `BLUEPRINT.md`.
- Treating a green catalog suite as proof that the skill behaves well.

## Dependencies And Blockers

- Blocked on S-002L Skills draft wiki collection: it must deliver the draft-wiki location and article template before steps 2-5.
- Steps 4-5 are best sequenced after the `codebase-design` alignment Spec's steps 1-2, because the fold-in decision compares against its article. This is an ordering preference, not a recorded blocker; step 1 of this Spec checks whether that article exists yet.
- Step 6 touches `skills-pending/` and `workbench/skills/README.md`. Name S-00R as the authorizing route, and confirm no live S-00R lane is editing the same inventory rows.

## Vertical Implementation Slices

These six steps are intended slice direction in prose. No Task is cut yet; Tasks are cut from live Actuality when this Spec is activated, by `/to-tasks`.

1. Investigate ours. Read `skills-pending/design-an-interface/SKILL.md`, the personal install copy and `skills-pending/codebase-design/DESIGN-IT-TWICE.md` at a named commit. Record inputs, outputs, writes and composition for each, which copy is canonical, and the true origin.
2. Draft the article. Fill Template 2 from step 1 at `workbench/wiki/skills-draft/shaping/design-an-interface.md`. That location is tentative until S-002L decides.
3. Investigate the nearest neighbor. No upstream skill of this name exists at the pin, so read the `codebase-design` skill and its design-it-twice supporting file at `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`, and read our own `codebase-design`.
4. Compare. Fill "Compared with Matt's" and log findings, including an `overlap` finding for the shared pattern and any `gap`, `stale-name` or `dangling` findings. Record a fold-in recommendation.
5. Align the article. Rewrite until its wording matches real or intended behavior, then log what is left.
6. Fix or create the skill. Apply the recorded decision in its lane: edit this skill, fold it into `codebase-design`, or retire it. Add catalog tests and a fresh-context scenario. This is the only step that touches a skill lane.

## Acceptance Criteria

- [ ] The draft article has every Template 2 section filled, with the draft-only sections present and its location confirmed against S-002L.
- [ ] Every "needs" and "reads/writes" item, including the `/tdd` handoff and the decision-recording target, resolves to something real or is logged as a finding.
- [ ] Which of the two existing `design-an-interface` texts is canonical is recorded, with the evidence.
- [ ] A comparison with the `codebase-design` design-it-twice material is recorded with a verdict (same, close, divergent or missing) and at least the `overlap` finding.
- [ ] The fold-in decision (keep, fold or retire) is recorded with its owner and its consequence for the S-00R inventory row.
- [ ] The skill source matches the article, or the skill's retirement or fold is reflected in the catalog and routers.
- [ ] The named fresh-context scenario is observed in an independent context, and the catalog and Wiki suites are green for step 6.

## Testing Seams

Steps 1-5 produce documents, so their seam is the Wiki validator and `tools/test-wiki.mjs` once S-002L extends it. Step 6's seam is the catalog test, `tools/test-skill-catalog.mjs`, plus a fresh-context scenario: given a module to design, the skill produces at least two meaningfully different interface shapes, a recommendation naming the trade-off it accepts, and a recorded decision in the owning Spec or Blueprint. These prove routing and structure, not conversational quality. A human review may still be needed.

## Verification Procedure

Run `node workbench/tools/wiki.mjs validate`, the targeted catalog and Wiki tests for any step 6 change, then the full suite in `AGENTS.md`, from a committed candidate. Run `node workbench/tools/spec-workbench.mjs render` and `doctor`. Capture the Workbench self-drift pre/post receipts for step 6. Review the immutable candidate separately before integration. Record actual commands and results in this Spec.

## Documentation Impact

- Draft article at `workbench/wiki/skills-draft/shaping/design-an-interface.md` (tentative until S-002L decides), plus the draft collection's index entry.
- Step 6 may touch `skills-pending/design-an-interface/`, `skills-pending/codebase-design/` (only if folding), and the optional-source inventory row in `workbench/skills/README.md`. It would also touch the optional-source expectations in `tools/test-skill-catalog.mjs` if a directory is removed or moved.
- Record `Docs checked; no update needed` for any control that does not change.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Spec authored from the owner's draft-skills-wiki direction; planning only, no implementation | Pending source, personal install copy, `codebase-design` supporting file and optional-source inventory row read at the pre anchor; no skill source, article or test changed | This Spec authored; article remains future work | S-002L delivery, activation, Task cutting and all six steps remain open |

## Completion Result

Not complete.

## Supersession

None.
