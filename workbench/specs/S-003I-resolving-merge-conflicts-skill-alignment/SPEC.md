# S-003I - resolving-merge-conflicts skill alignment

**Spec ID:** S-003I
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-30
**Catalog description:** Reconstruct both change intents, preserve compatible behavior, and verify a safe merge result.
**Blockers:** S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5; step 6 also needs S-00R's authorizing route for the `skills-pending/` lane.
**Latest event:** Authored from the owner's 2026-09-30 draft-skills-wiki direction.
**Next gate:** Deliver S-002L, then activate this Spec and cut Tasks from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`07edccc57b8f75613ad1d09203a3e414d867b90c` post=`07edccc57b8f75613ad1d09203a3e414d867b90c`.

## Outcome

The draft Wiki article, the comparison with the upstream counterpart and the `resolving-merge-conflicts` skill source all describe one behavior: how an agent resolves an in-progress git merge or rebase conflict. The skill stays Pending unless this Spec's findings justify a different disposition, which the owner decides.

## Why It Matters

The owner wants the skills prototyped as a draft Wiki so that skills which should connect and do not, or connect and conflict, become visible. This skill is a concrete case: it is short, it is Pending, and it plausibly overlaps procedures the Workbench already owns for landing work. Nobody has yet said which of those owners a user should reach for when a merge stops on a conflict.

## Current Verified State

- `skills-pending/resolving-merge-conflicts/SKILL.md` is a five-step source: see the state of the merge, find the primary sources for each conflict, resolve each hunk, run the project's automated checks, finish the merge or rebase. It never uses `--abort` and forbids inventing new behavior. It names no other skill, config file or artifact.
- The directory holds only `SKILL.md`. It is not in the core bundle and has no Wiki article.
- `workbench/skills/README.md` lists it as a pending source with no operational consumer established, provenance commit `bcfa55d4d33b3a815e899eeb9e60c7629d462d82`, and "owner decision required" on retention or recoverable removal.
- `THIRD_PARTY_NOTICES.md` carries the MIT notice for files derived from `mattpocock/skills`.
- Upstream: the owner's 2026-09-30 handoff records that Matt's counterpart was removed from the upstream tree. Whether and when it existed, and what replaced it, is not read yet; that is step 3.
- Possible overlaps, unverified until step 1: the personal-install `land` skill (Foundry-origin; its fate belongs to S-003E and is referenced only), and RUNBOOK's Version-Control Procedures closeout block, which covers merge, containment and cleanup but contains no conflict-resolution procedure.
- No behavioral scenario for this skill has been run.

## Desired Behavior

1. A reader of the draft article can tell when to reach for this skill, what it needs, what it reads and writes, and where it stops, with every "needs" and "reads/writes" item resolving to something real or recorded as a finding.
2. The skill's stated behavior (reconstruct intent from history and tickets, preserve both intents, record trade-offs, verify with the project's checks, finish the merge) matches its article, and any overlap with `land` or RUNBOOK closeout is named rather than left implicit.
3. A verdict is recorded against the upstream counterpart or, if none exists at the pin, its nearest neighbor.

## Decisions And Contracts

- The owner's 2026-09-30 decision 4 adopts this skill into the draft wiki (it was a "skip" in the earlier report). Adoption here means an article and alignment work only; the skill stays Pending unless the findings justify otherwise.
- Group: upkeep. Matt counterpart: removed from the upstream tree at `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`; step 3 reads upstream history for its last version and names the nearest neighbor. Do not guess it now.
- Draft-wiki articles are curated context, not instruction authority or proof of behavior. Current source and tests establish Actuality.
- The personal-install `land` skill is reference only; S-003E owns its fate. This Spec must not edit or install it.
- `skills-pending/` is not in the `AGENTS.md` Edit Scope. S-00R is the authorizing route for any step 6 edit there; without it, step 6 stops and records the blocker.

## Non-Goals

- Writing any Wiki article before S-002L delivers the location and template.
- Moving, archiving, installing or promoting the skill to Core, or editing `land`.
- Changing RUNBOOK's closeout block or the branch-closeout tooling; an overlap finding only records the gap.
- Adopting `grill-with-docs`, or answering Q2A (wayfinder storage), which is deferred and recorded as open.

## Dependencies And Blockers

- **S-002L Skills draft wiki collection** must deliver the draft-wiki location and article template before steps 2-5. The location `workbench/wiki/skills-draft/upkeep/resolving-merge-conflicts.md` is tentative until S-002L decides.
- **S-00R** (active, owner `codex-director`, with a live Codex lane) governs `skills-pending/` disposition and is the named authorizing route for step 6. This Spec does not amend S-00R.
- **S-003E** owns the fate of the personal-install `land` skill; this Spec only references it.
- Open question for step 1: whether the owner-expected overlap with `land` and with RUNBOOK closeout is real, since `land` was not read in full while authoring this Spec.

## Vertical Implementation Slices

No Task is cut yet. Tasks are cut from live Actuality at activation with `/to-tasks`. The intended slice direction, in order:

1. **Investigate ours.** Read `skills-pending/resolving-merge-conflicts/SKILL.md`, its callers and any tests at a named commit. Record inputs, outputs, writes and composition, including whether anything routes a user to it. Record the true `origin`.
2. **Draft the article.** Fill Template 2 (owned by S-002L) at `workbench/wiki/skills-draft/upkeep/resolving-merge-conflicts.md`, tentative until S-002L decides.
3. **Investigate Matt's.** Read upstream history at `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60` for the removed skill's last version, and record why it left if the history says. Name the nearest neighbor skill at the pin.
4. **Compare.** Fill "Compared with Matt's" with a verdict (same, close, divergent or missing) and log findings, including any `overlap` with `land` or RUNBOOK closeout, one greppable line per finding.
5. **Align the article.** Rewrite until the wording matches real or intended behavior, and log what is left.
6. **Fix or create the skill.** Edit `skills-pending/resolving-merge-conflicts/SKILL.md` only if the findings require it, under S-00R's route, with catalog tests and a fresh-context scenario. If the findings recommend another disposition, record it for the owner instead of acting.

Steps 1-5 touch only the draft wiki. Step 6 is the only step that touches a skill lane.

## Acceptance Criteria

- [ ] Every section of the draft article is filled, and every "needs" and "reads/writes" item resolves to something real or is recorded as a finding.
- [ ] The Matt comparison names the upstream history read (or the nearest neighbor), records a verdict, and logs findings in the `F:resolving-merge-conflicts:NN` line shape.
- [ ] The overlap with `land` and with RUNBOOK closeout is confirmed or ruled out, with the evidence cited.
- [ ] The skill source matches the article, or the gap is recorded as an owner-visible finding with the authorizing route named.
- [ ] A fresh-context scenario shows a conflicted merge resolved with both intents preserved and the project's checks run, if step 6 changes the source.
- [ ] Wiki validation, the catalog tests and the required full suite are green for step 6; no unrun check is reported as passing.

## Testing Seams

Steps 1-5 are documentation: the seam is `node workbench/tools/wiki.mjs validate` once S-002L has extended it for the draft collection, plus greppable finding lines. Step 6 uses the skill catalog tests (`tools/test-skill-catalog.mjs`, `tools/test-skills-lane.mjs`) and a disposable repository with a seeded conflict as the fresh-context scenario. Structural checks prove routing, not agent behavior.

## Verification Procedure

For steps 1-5, run the Wiki validation S-002L defines and `node workbench/tools/spec-workbench.mjs render` and `doctor`. For step 6, run the targeted catalog and lane tests, the full suite in `AGENTS.md`, the self-drift pre/post receipts, and a separate-context review of the immutable candidate. Record actual commands and results in this Spec.

## Documentation Impact

- The draft article `workbench/wiki/skills-draft/upkeep/resolving-merge-conflicts.md` (tentative until S-002L decides).
- Step 6 may touch the skill's `skills-pending/` lane and its row in `workbench/skills/README.md`; any bundle, manifest or Lexicon change is out of scope unless the owner redispositions the skill. Otherwise record `Docs checked; no update needed` with the reason.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Spec authored from the owner's draft-skills-wiki direction; no implementation | Source, README row and RUNBOOK closeout block read at pre anchor; Matt's files and `land` not read | This Spec only | S-002L, Task cutting, steps 1-6 and independent review remain open |

## Completion Result

Not complete.

## Supersession

None.
