# S-002N - brainstorm skill alignment

**Spec ID:** S-002N
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-30
**Catalog description:** Think an idea through before committing to it: a grilling interview in which every recommendation arrives with its strongest opposing case.
**Blockers:** S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5; S-002M (ask-workbench) must finish its bundle step 6 before this Spec's step 6 touches the shared bundle files.
**Latest event:** Authored from the owner's 2026-09-30 draft-skills-wiki direction.
**Next gate:** Deliver S-002L, then activate this Spec and cut Tasks from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`07edccc57b8f75613ad1d09203a3e414d867b90c` post=`07edccc57b8f75613ad1d09203a3e414d867b90c`.

## Outcome

The draft article, the comparison with the nearest neighbor skill, and the skill source all describe one behavior for `brainstorm`, and the skill ships in `workbench/skills/brainstorm/` as a Core skill. The owner decided on 2026-09-30 that `brainstorm` becomes Core; this Spec delivers that decision for this one skill.

## Why It Matters

The owner wants to prototype the skills Wiki on the current skills to find where skills should connect and do not. `brainstorm` is one of the three skills `BLUEPRINT.md` names as able to open Align (with `grill-me` and wayfinding), yet it exists only in the owner's personal install and in an archive directory the catalog marks for an owner retention decision. A Core skill that every room carries must be in the lane, accurately described, and counted by the closed bundle.

## Current Verified State

- Source today is `~/.agents/skills/brainstorm/SKILL.md` (read-only; the owner's separate repository). At the pre anchor, the archived in-repo copy `skills-archive/optional-active-2026-09-01/brainstorm/SKILL.md` is byte-identical to it (checked with `diff -r` on 2026-09-30). Each holds a single file.
- The skill says to run a `/grilling` session, then adds a counter-argument stance: for each question, surface the strongest opposing case, at least one alternative, and the main risk of its own recommendation, then still recommend and let the owner decide. Rejected alternatives are recorded as a trailing `(considered: ...)` on the decision line. It does not promote to canonical docs or Specs; it names `/make-it-so` for promotion and `/checkpoint` for saving.
- `workbench/skills/` holds 26 skills and has no `brainstorm`. `workbench/skills/README.md` lists `brainstorm` twice: as an archived optional item in the optional-source inventory, and as an "optional mention" (from `BLUEPRINT.md`) in the referenced-skills table. `tools/test-skill-catalog.mjs` requires the archive to hold exactly five directories (`ask-workbench`, `brainstorm`, `grill-me`, `sitrep`, `writing-great-skills`). `grill-me` is both in the lane and in that archive, which is a precedent for keeping the archive copy after a skill enters the lane.
- `workbench/manifest.json` `skillPolicy.required` and the Lexicon's "Core skill bundle" row (closed set of eighteen workflow, four coordination and four stance skills) do not include it.
- Candidate findings visible before step 1: `/checkpoint` is a retired copy workflow (`workbench/skills/checkpoint/SKILL.md` is now a compatibility notice, S-01E); `BLUEPRINT.md` says a grilling session starts through `grill-me`, while this skill says to run `/grilling` directly; the frontmatter has no `disable-model-invocation`, unlike `workbench/skills/grill-me/SKILL.md`. Step 1 confirms or discards each.
- No Draft-wiki article for this skill exists. No fresh-context scenario for it is claimed.

## Desired Behavior

1. The skill runs the grilling interview with the counter-argument stance and keeps every other rule of `workbench/skills/grilling/SKILL.md` and its notepad route.
2. It writes no Canon and promotes nothing; promotion happens only if the owner then invokes `/make-it-so` or another authorized exit.
3. Every skill it names resolves to a real Core skill or is a recorded finding.
4. The Draft-wiki article, the comparison, and `workbench/skills/brainstorm/SKILL.md` agree, and the skill is counted in the Core bundle.

## Decisions And Contracts

- Owner decision 2026-09-30: `brainstorm` becomes Core (the bundle goes from 26 to 30 across the four Core-bound Specs). This Spec's step 6 records that decision as the per-item S-00R relocation decision for `skills-archive/optional-active-2026-09-01/brainstorm`.
- Group: shaping. Matt Pocock counterpart: none. The nearest neighbor is `productivity/grill-me` at the pin `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`; compare also with our own `grill-me` (S-00Z) and `grilling` (S-00X).
- Q1 is locked and not reopened: an idea comes first, and `grill-me`, wayfinder or brainstorm can open Align (`BLUEPRINT.md`).
- Draft-wiki location and article template are decided by S-002L; the path below is tentative until then.
- Steps 1-5 touch only the Draft wiki. Step 6 alone touches a skill lane and the shared bundle files.

## Non-Goals

- Answering Q2A (where `wayfinder` keeps pre-Spec decisions); this Spec records it as open if the comparison touches it.
- Rewriting `grilling`, `grill-me`, `notepad`, `checkpoint` or S-00R; other Specs own them. S-00R has a live Codex lane (`codex/S-00R-optional-inventory`): coordinate, do not edit it.
- Writing to `~/.agents/skills`, or adopting `grill-with-docs`.
- Moving or deleting the archived copy unless the per-item decision says so.

## Dependencies And Blockers

- S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5.
- Core-bound sequence, second of four: S-002M (ask-workbench) must finish its bundle step 6 before this Spec's step 6 touches the shared bundle files. Next is S-002O (sitrep). One writer at a time on `workbench/skills/README.md`, the Lexicon row, `workbench/manifest.json` and the catalog tests.
- The skill depends on `grilling` (S-00X, active) and names `checkpoint` (S-01E) and `make-it-so` (S-01I); step 1 verifies each against the live source, not these Spec states.
- Whether `next` excludes this Spec while S-002L is open is not yet known; the Director checks it after authoring.

## Vertical Implementation Slices

Intended slice direction only. No Task is cut; Tasks are cut from live Actuality at activation by `/to-tasks`.

1. Investigate ours: read `~/.agents/skills/brainstorm/SKILL.md` and its archived copy, the catalog tests and the callers, and record inputs, outputs, writes and composition at a named commit. Settle the true `origin` (workbench, matt or foundry) and which candidate findings are real.
2. Draft the article: fill Template 2 from step 1 at `workbench/wiki/skills-draft/shaping/brainstorm.md` (tentative until S-002L decides).
3. Investigate the neighbor: read `productivity/grill-me` at `d81f3a183412e71a5b1e84ca21bc1a35eea03a60`, since Matt has no `brainstorm`; read our `grill-me` and `grilling` alongside it.
4. Compare: fill "Compared with Matt's" (here, the neighbor) and log findings as `F:brainstorm:NN` lines.
5. Align the article: rewrite until its wording matches real or intended behavior, and log what remains.
6. Fix or create the skill: copy the source read-only from the personal install into `workbench/skills/brainstorm/`; update every closed-bundle touchpoint (`workbench/skills/README.md` core table and the optional-source and referenced-skills rows, the Lexicon "Core skill bundle" row, `workbench/manifest.json` `skillPolicy.required`, and the catalog tests including the five-archive-directory assertion); record the owner's decision as the S-00R per-item decision; add catalog tests and a fresh-context scenario. Starts only after S-002M's step 6 lands.

## Acceptance Criteria

- [ ] Every section of the draft article is filled.
- [ ] Every "needs" and "reads/writes" item resolves to something real or is logged as a finding.
- [ ] The neighbor comparison verdict (same, close, divergent or missing) is recorded.
- [ ] `workbench/skills/brainstorm/SKILL.md` matches the article, and its references to `checkpoint`, `make-it-so` and `grilling` are verified.
- [ ] The Core bundle assertions (README, Lexicon row, `skillPolicy.required`, catalog tests) count `brainstorm` and agree.
- [ ] The owner's 2026-09-30 decision is recorded as the S-00R per-item decision for this item, with the archive-copy outcome stated.
- [ ] A fresh-context scenario shows the counter-argument stance is applied and nothing is promoted to Canon.
- [ ] The catalog tests, targeted tests and full suite are green for step 6.

## Testing Seams

Structural: the catalog and lane tests (`tools/test-skill-catalog.mjs`, `tools/test-skills-lane.mjs`) prove routing and bundle counts, not agent behavior. Behavioral: a fresh-context scenario in which a reader invokes the skill on a real choice and observes the opposing case, an alternative, a risk and a recommendation per question, with no Canon written. Red then green at the catalog seam for the bundle change.

## Verification Procedure

Steps 1-5: `node workbench/tools/wiki.mjs validate` (once S-002L admits the collection) and review. Step 6: targeted tests, then the full suite in `AGENTS.md`, `render` and `doctor`, the self-drift pre/post receipts, and separate-context review of the immutable candidate. The suite needs a committed candidate. Record actual commands and results here.

## Documentation Impact

Draft article at `workbench/wiki/skills-draft/shaping/brainstorm.md` (tentative until S-002L). Step 6 touches `workbench/skills/README.md`, the Lexicon "Core skill bundle" row, `workbench/manifest.json`, the catalog tests, and the S-00R decision record (coordinated, not edited here). The sole Wiki router stays `workbench/wiki/MEMORY.md`. Record `Docs checked; no update needed` for any control that does not change.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Spec authored from the owner's draft-skills-wiki direction; planning only | Personal and archived `brainstorm` source read at the pre anchor; no behavior change or scenario trial | This Spec authored; no article or skill source touched | S-002L, Tasks and all six steps remain open |

## Completion Result

Not complete.

## Supersession

None.
