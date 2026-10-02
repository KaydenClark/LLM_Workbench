# S-002M - ask-workbench skill alignment

**Spec ID:** S-002M
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-30
**Catalog description:** Route a situation to the smallest appropriate Workbench skill or flow, then wait for the user to start it.
**Blockers:** S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5.
**Latest event:** Authored from the owner's 2026-09-30 draft-skills-wiki direction.
**Next gate:** Deliver S-002L, then activate this Spec and cut Tasks from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`07edccc57b8f75613ad1d09203a3e414d867b90c` post=`07edccc57b8f75613ad1d09203a3e414d867b90c`.

## Outcome

The draft article, the comparison with Matt Pocock's `engineering/ask-matt` and the `ask-workbench` skill source all describe one behavior, and that source lives in the Core lane `workbench/skills/ask-workbench/`. This is the first of four Core-bound Specs (`ask-workbench`, `brainstorm`, `sitrep`, `writing-for-agents`); its step 6 takes the Core bundle from 26 to 27.

## Why It Matters

The owner wants to prototype the skills Wiki on the current skills to find what is wrong: skills that should connect and do not, and skills that connect and do not work together. A router skill is where that shows first, because every route it names must resolve to a real skill. On 2026-09-30 the owner decided `ask-workbench` becomes Core. It is the one skill whose job is to send a new user to the right other skill, so it should ship in every room rather than live in a personal install.

## Current Verified State

- The only live source is the owner's personal install, `~/.agents/skills/ask-workbench/SKILL.md` (read-only; the owner's own Git repo). It is not in `workbench/skills/`, so no room carries it.
- An archived copy sits at `skills-archive/optional-active-2026-09-01/ask-workbench/SKILL.md`. It is byte-identical to the personal copy (checked with `diff -r`). It was provenance-pinned at `bcfa55d4d33b3a815e899eeb9e60c7629d462d82` and is covered by `THIRD_PARTY_NOTICES.md`.
- The skill is a short router: it reads the catalog in `../README.md`, recommends one starting skill and optionally a short sequence, asks one question only when two routes would produce materially different work, and waits for the user before starting anything. It carries `disable-model-invocation: true`.
- Its source looks stale against the current bundle (to be confirmed in step 1, not asserted here): it routes to `/to-tickets` (the bundle now ships `to-tasks`, and `to-tickets` is the stale name), to `/writing-great-skills` (the owner has decided `writing-for-agents` replaces it), and its main flow reads `grill-me -> to-docs or to-spec -> to-tickets -> implement -> code-review`. It has no route to `/brainstorm`, `/carry`, `/handoff`, `/notepad`, `/save` or `/promote`. It tells the agent to recommend only catalog entries marked `Active`, and `workbench/skills/README.md` carries no such marker at the anchor.
- `workbench/skills/README.md` declares the closed 26-skill bundle between its `core-skills` markers, and its optional-source inventory has an `ask-workbench` row whose disposition reads "owner decision required".
- `tools/test-skill-catalog.mjs` hard-requires the archive directory list `ask-workbench`, `brainstorm`, `grill-me`, `sitrep`, `writing-great-skills`. `grill-me` is both Core and still archived, so there is precedent for a Core skill whose archived copy stays put.
- The owner's personal install has `ask-workbench`, but the 2026-09-30 inventory found 66 of its 70 skills model-invocable; this one is owner-invoked only.
- No `workbench/wiki/skill-ask-workbench.md` exists. No Task is cut.

## Desired Behavior

1. A reader can open one draft article and learn what `ask-workbench` does, when to reach for it, what it needs and what it reads, with every routed skill resolving to a real skill or recorded as a finding.
2. The article states how the skill differs from `engineering/ask-matt`, and findings are logged one per line.
3. `workbench/skills/ask-workbench/SKILL.md` exists in the Core lane, matches the article, and routes only to skills the room actually carries (or names the gap), so a cold user lands on a working next step.
4. The closed Core bundle, its documentation and its tests agree on 27 skills.

## Decisions And Contracts

- **Origin is not assumed.** Step 1 records the true `origin` (workbench, matt or foundry) from the archived provenance and the pinned notice. This Spec does not guess it.
- **S-00R relocation decision.** The owner's 2026-09-30 decision that `ask-workbench` becomes Core is the per-item owner decision `workbench/specs/S-00R-core-skill-lifecycle-and-optional-source-disposition/SPEC.md` requires before archive or pending source is removed or relocated. This Spec records that decision for this skill. S-00R is active under `codex-director` and has a live Codex lane (`codex/S-00R-optional-inventory`), so this Spec does not edit S-00R. Step 6 coordinates with that lane and reports the disposition to it instead.
- **The archived copy.** Whether the archive copy stays (as with `grill-me`) or moves, and what the optional-source inventory row then says, is decided in step 6 with S-00R's lane. Whichever is chosen, `tools/test-skill-catalog.mjs` and the inventory must agree.
- **Sources.** The personal copy is read-only. Step 6 copies from it into the repo lane; it never writes `~/.agents/skills`.
- **Draft wiki.** Steps 1-5 touch only the draft wiki. The article location below is tentative until S-002L decides.
- Matt's `engineering/ask-matt` is outside evidence, read at the pin `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`. Adopting anything from it is the owner's decision.

## Non-Goals

- Editing S-00R, or deciding any other skill's archive, pending or Core placement.
- Making the skill route anywhere except by recommendation; it never starts a skill on its own.
- Writing the `brainstorm`, `sitrep` or `writing-for-agents` Core changes; S-002N, S-002O and S-002P own those.
- Answering Q2A or deciding where `wayfinder` keeps provisional decisions.
- Treating a green suite or the draft article as owner Human QA.

## Dependencies And Blockers

- **S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5.**
- **Core-bound sequence.** This Spec is first of four. S-002N (`brainstorm`), S-002O (`sitrep`) and S-002P (`writing-for-agents`) follow it for the shared bundle files; one writer at a time, never in parallel. This step moves the bundle to 27; S-002N, S-002O and S-002P then take it to 28, 29 and 30.
- **Route targets.** The skill's routes depend on skills that the other three Specs and the pending lane are still settling (`brainstorm`, `sitrep`, `writing-for-agents`, `to-tasks`). Step 1 decides which routes are valid at delivery and which become findings; later Core-bound Specs update the router as they land.
- No other blockers are known. Do not assume `spec-workbench.mjs next` enforces the S-002L block: no Task exists yet.

## Vertical Implementation Slices

No Task is cut. These six steps are the intended slice direction; Tasks are cut from live Actuality at activation with `/to-tasks`.

1. **Investigate ours.** Read the personal `SKILL.md` and its archived twin, plus the catalog and tests that touch it, at a named commit. Record inputs, outputs, writes and composition, including each routed skill and whether it exists in `workbench/skills/`. Confirm the stale routes listed above and settle `origin`.
2. **Draft the article.** Fill Template 2 (owned by S-002L) from step 1 at `workbench/wiki/skills-draft/getting-started/ask-workbench.md`, tentative until S-002L decides.
3. **Investigate Matt's.** Read `engineering/ask-matt` at the pin `d81f3a183412e71a5b1e84ca21bc1a35eea03a60`.
4. **Compare.** Fill "Compared with Matt's" with a verdict (same, close, divergent or missing), the behavior and clarity differences, and findings in the `F:ask-workbench:NN` format.
5. **Align the article.** Rewrite until the wording matches real or intended behavior, and log what is left over.
6. **Fix or create the skill.** Bring the skill into `workbench/skills/ask-workbench/` from the personal copy, fixing the stale routes found in step 1, with catalog tests and a fresh-context scenario. Update every closed-bundle touchpoint, taking Core from 26 to 27: `workbench/skills/README.md` (size sentence, core table, and the optional-source inventory row); the Lexicon's "Core skill bundle" row; `workbench/manifest.json` `skillPolicy.required`; the live `coreSkills` list in `workbench/tools/workbench-layout.mjs` (frozen historical rows stay frozen, as `grill-me` left them); `tools/test-skill-catalog.mjs`, including its hard requirement of five archive directories; and the bundle-size lines in `README.md`, `RUNBOOK.md` and `templates/GENESIS.md`. Step 1 re-derives this list from live source at that time. Coordinate the archive disposition with the S-00R lane.

## Acceptance Criteria

- [ ] Every section of the draft article is filled, and every "needs" and "reads/writes" item resolves to something real or is recorded as a finding.
- [ ] The comparison with `engineering/ask-matt` at the pin is recorded with a verdict.
- [ ] Every skill the router names resolves in the room's Core lane, or is a logged finding with an owner.
- [ ] `workbench/skills/ask-workbench/SKILL.md` matches the article and holds a fresh-context scenario: from a vague situation it recommends one starting skill, asks at most one deciding question and starts nothing.
- [ ] Core is 27 consistently across the catalog, Lexicon, manifest, runtime list, tests and the README, RUNBOOK and GENESIS bundle-size lines; `tools/test-skill-catalog.mjs` still passes with its five archive directories (or its list is deliberately changed with the S-00R lane's agreement).
- [ ] The owner's 2026-09-30 decision is recorded as this skill's S-00R relocation decision, S-00R is unedited, and the lane has been told.
- [ ] Suites are green for step 6, with the self-drift pre/post receipts and a separate-context review of the candidate; no unrun check is reported as passing.

## Testing Seams

Structural: the catalog test (`tools/test-skill-catalog.mjs`) for bundle and archive membership, `tools/test-skills-lane.mjs` for lane and `skillPolicy.required`, `tools/test-workbench-layout.mjs` for the runtime list. Behavioral: a fresh-context scenario against the skill's public entry. Structural checks prove routing, not that the agent picks the right skill; conversational fidelity may still need human review.

## Verification Procedure

For steps 1-5, validate the draft article with the draft collection's own check (owned by S-002L) and read the links. For step 6, show red then green at the catalog seam, run the targeted tests above, then the full suite in `AGENTS.md` from a committed candidate, `node workbench/tools/spec-workbench.mjs render` and `doctor`, and the self-drift pre/post receipts. Review the immutable candidate separately before integration. Record actual commands and results in this Spec.

## Documentation Impact

Draft article: `workbench/wiki/skills-draft/getting-started/ask-workbench.md` (tentative until S-002L decides). Step 6 touches `workbench/skills/README.md`, the Lexicon's "Core skill bundle" row, `workbench/manifest.json`, `workbench/tools/workbench-layout.mjs`, `tools/test-skill-catalog.mjs`, `README.md`, `RUNBOOK.md` and `templates/GENESIS.md`. `templates/` receives only the generic bundle count, never this repo's specifics. A routed Wiki article beyond the draft belongs to the promotion step, not here.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Spec authored from the owner's draft-skills-wiki direction; the owner's decision that `ask-workbench` becomes Core is recorded as its S-00R relocation decision | Personal and archived `SKILL.md` compared (identical) and the closed-bundle touchpoints located at the pre anchor; no implementation or behavior trial | This Spec authored; no article, skill source or control edited | S-002L, Tasks, steps 1-6 and independent review remain open |

## Completion Result

Not complete.

## Supersession

None.
