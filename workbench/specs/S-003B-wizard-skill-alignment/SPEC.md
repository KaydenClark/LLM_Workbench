# S-003B - wizard skill alignment

**Spec ID:** S-003B
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-30
**Catalog description:** Build a human-guided procedure for repeatable setup or migration work that cannot safely be fully automated.
**Blockers:** S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5.
**Latest event:** Authored from the owner's 2026-09-30 draft-skills-wiki direction.
**Next gate:** Deliver S-002L, then activate this Spec and cut Tasks from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`07edccc57b8f75613ad1d09203a3e414d867b90c` post=`07edccc57b8f75613ad1d09203a3e414d867b90c`.

## Outcome

The wizard skill's draft Wiki article, its comparison with Matt Pocock's `engineering/wizard`, and its skill source all describe one behavior. The draft article answers, in plain words, what a wizard produces, where that procedure lives afterward, and how it connects to the setup step (S-002Q) and `update-harness` (S-01N).

## Why It Matters

The owner wants the draft skills wiki to expose skills that should connect and do not. `wizard` is a likely case: it is a pending skill with no operational consumer, two differing copies exist, and neither says clearly where the finished procedure is stored. A reader cannot tell whether it is a throwaway script, a `RUNBOOK.md` section or a Spec. Settling that now keeps the setup step from inventing a second mechanism for the same job.

## Current Verified State

- Two copies differ. `skills-pending/wizard/SKILL.md` appears to be Matt's text: it generates an interactive bash script, sets `disable-model-invocation: true`, and ships a 211-line `skills-pending/wizard/template.sh` library (progress display, confirmation gates, hidden secret entry, dotenv-file upserts, `gh secret` and `gh variable` writes). `~/.agents/skills/wizard/SKILL.md` is a Workbench-style rewrite: a short generic procedure (scope the work, one stage at a time with a success criterion, dry-run, record operation and recovery in `RUNBOOK.md`, record scope decisions in the owning spec), with no `template.sh` and no `disable-model-invocation`. Neither copy was byte-diffed against upstream; the Matt attribution rests on the third-party notice and is unconfirmed.
- Neither copy is in `workbench/skills/`, so the skill is not in the Core bundle and has no catalog entry beyond the optional-source review row for `skills-pending/wizard` in `workbench/skills/README.md`. That row records no operational consumer and an open owner retention decision.
- No `workbench/wiki/skill-wizard.md` exists, and no tracked Spec or control names the skill.
- The rewrite names `RUNBOOK.md` and the owning spec as destinations; the pending copy names a script path and the README. Which destination is intended is undecided.

## Desired Behavior

1. A reader can say what a wizard is for, when to prefer it over doing the work directly or over a fully automated script, and what artifact it leaves behind.
2. The article states where the produced procedure is stored (a committed script, a `RUNBOOK.md` section, a Spec, or nowhere) and says so as one decision, not by implication.
3. Every "needs" item (`gh`, `shellcheck`, `template.sh`, `RUNBOOK.md`) and every "reads and writes" item (dotenv files, GitHub secrets, CI workflow references) resolves to something real or is recorded as a finding.
4. The skill source, once step 6 runs, matches the article and the Workbench's rules on secrets and irreversible actions.

## Decisions And Contracts

- This Spec owns the wizard skill alone. Setup-step design belongs to S-002Q and the update route to S-01N; this Spec records overlap findings and does not decide for them.
- The draft article is curated context, not instruction authority or proof of behavior. Source and tests establish Actuality; accepted controls and this Spec establish the target.
- Step 1 makes "which copy is canonical" its first item: the pending (Matt-shaped) copy, the personal Workbench rewrite, or a merge. Do not guess it now.
- `skills-pending/` is not in the Edit Scope listed in `AGENTS.md`. S-00R (core skill lifecycle and optional source disposition) is the authorizing route for step 6 to touch it or to move the skill into a lane; the owner's 2026-09-30 decisions apply only where they name a skill, and none names this one. Until S-00R or the owner authorizes the move, wizard stays Pending.
- Matt's `engineering/wizard` is compared at `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`. Matt's files are MIT-licensed (`THIRD_PARTY_NOTICES.md`); summarize and cite, do not copy long passages.

## Non-Goals

- Moving, archiving, installing or promoting the skill to Core in steps 1-5, or editing `skills-pending/**`, `~/.agents/skills/**`, the manifest, `SCHEMA.md`, the catalog or any test before step 6.
- Designing the setup step (S-002Q) or changing `update-harness` (S-01N).
- Running a generated wizard end to end, or entering real credentials into one.
- Answering Q2A (where `wayfinder` keeps its pre-Spec decisions); it stays open.

## Dependencies And Blockers

- Blocked on S-002L Skills draft wiki collection, which must deliver the draft-wiki location and article template before steps 2-5.
- Overlap to resolve with S-002Q (workbench setup step) and S-01N (update-harness): all three produce human-guided, staged procedures. Neither is a blocker; findings go in the article.
- Step 6 depends on S-00R (or an owner decision) for any move or edit under `skills-pending/`.

## Vertical Implementation Slices

No Task is cut yet. Tasks are cut from live Actuality at activation with `/to-tasks`. Intended slice direction, in order:

1. **Investigate ours.** Diff the pending and personal copies; record which is Matt's text and which a Workbench rewrite, and make "which copy is canonical" the first item. Read both `SKILL.md` files, `template.sh` and any tests; record inputs, outputs, writes and composition at a named commit. Open questions to answer here: where the produced procedure lives; whether `disable-model-invocation: true` should survive; how a wizard handles secrets without violating the Workbench rule against recording credentials.
2. **Draft the article.** Fill Template 2 (owned by S-002L) at `workbench/wiki/skills-draft/productivity/wizard.md`, tentative until S-002L decides. Group: productivity. Source: pending, with the personal copy noted.
3. **Investigate Matt's.** Read his `engineering/wizard/SKILL.md` at `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`, including any supporting file.
4. **Compare.** Fill "Compared with Matt's" with a verdict (same, close, divergent or missing) and log findings one per line, using the kinds `dangling`, `stale-name`, `overlap`, `gap`, `conflict` and `missing-skill`. Expect an `overlap` finding against S-002Q and S-01N and a `gap` finding on storage.
5. **Align the article.** Rewrite until its wording matches real or intended behavior; log what remains.
6. **Fix or create the skill.** Edit or add `SKILL.md` in its lane, under S-00R authority, with catalog tests and a fresh-context scenario. Stays Pending unless the findings justify more.

## Acceptance Criteria

- [ ] "Which copy is canonical" is decided and recorded, with the diff between the pending and personal copies.
- [ ] Every section of the draft article is filled; every "needs" and "reads and writes" item resolves or is a logged finding, including where the produced procedure is stored.
- [ ] The comparison with Matt's `engineering/wizard` at the pin carries a verdict and logged findings, including overlap with S-002Q and S-01N.
- [ ] The skill source matches the article, or the remaining difference is a recorded finding with its fixer named.
- [ ] Catalog and lane tests, the full suite for step 6, render and doctor are green from a committed candidate.
- [ ] A fresh-context scenario shows a cold reader producing a staged procedure and finding where it was stored.

## Testing Seams

Steps 1-5 are documentation checks: every cited path exists at the named commit and every finding is greppable by id. Step 6 uses the skill's public entry and the catalog and lane tests as the nearest seam; show red then green if behavior changes. Structural checks prove routing, not conversational behavior, so a fresh-context scenario is still needed.

## Verification Procedure

For steps 1-5, run `node workbench/tools/wiki.mjs validate` and confirm the article's links resolve. For step 6, run the targeted catalog and lane tests, then the full suite in `AGENTS.md` from a committed candidate, plus `node workbench/tools/spec-workbench.mjs render` and `doctor`. Review the immutable candidate separately. Record actual commands and results in this Spec; claim nothing unrun.

## Documentation Impact

Draft article: `workbench/wiki/skills-draft/productivity/wizard.md` (tentative until S-002L decides). Step 6 may touch the optional-source row in `workbench/skills/README.md` and, if wizard is promoted or retired, the manifest and catalog tests; record `Docs checked; no update needed` otherwise. Root controls change only if the storage decision creates a `RUNBOOK.md` convention.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Spec authored from the owner's draft-skills-wiki direction; planning only, no implementation evidence | Pending and personal wizard copies diffed read-only; optional-source row, Wiki and Spec routes inspected at the pre anchor; no behavior change or scenario trial | This Spec authored; no article or skill source written | S-002L, activation, Task cutting and steps 1-6 remain open |

## Completion Result

Not complete.

## Supersession

None.
