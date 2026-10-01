# S-002O - sitrep skill alignment

**Spec ID:** S-002O
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-30
**Catalog description:** Give the owner a smallest-scope, read-only answer to what is happening, what matters and what should happen next.
**Blockers:** S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5; S-002N (brainstorm) must finish its Core bundle step 6 before this Spec's step 6.
**Latest event:** Authored from the owner's 2026-09-30 draft-skills-wiki direction.
**Next gate:** Deliver S-002L, then activate this Spec and cut Tasks from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`07edccc57b8f75613ad1d09203a3e414d867b90c` post=`07edccc57b8f75613ad1d09203a3e414d867b90c`.

## Outcome

The draft-wiki article, the comparison with the nearest neighbor skill and the `sitrep` skill source all describe one behavior, and `sitrep` becomes a Core skill in `workbench/skills/sitrep/`. This Spec owns the skill's investigation, draft article, alignment, source delivery into the Core lane and the closed-bundle updates that delivery requires.

## Why It Matters

The owner wants the skills prototyped as a draft wiki to find where skills should connect and do not. `sitrep` is a clear case: it exists only in the owner's personal install and an archived in-repo copy, its source calls on a "Scout" task that no current control defines, and a second Spec already plans a different, room-core `sitrep`. The owner decided on 2026-09-30 that `sitrep` becomes Core; this Spec makes that decision real without leaving two competing sources.

## Current Verified State

- Source today is `~/.agents/skills/sitrep/SKILL.md` (read-only; the owner's separate Git repo). `skills-archive/optional-active-2026-09-01/sitrep/SKILL.md` is a byte-identical copy (checked with `diff -r`). It is a single 1177-byte file with `disable-model-invocation: true`.
- The source describes four steps: verify only the live facts needed to route the question, separate fact from inference, risk and recommendation, dispatch one read-only "Scout" task only when evidence is insufficient, and return state, why it matters, next safe action and at most one owner decision. It writes no artifact by default and points to `/to-docs` for stable knowledge. `workbench/skills/` has no `sitrep` directory at the pre anchor.
- `Scout` does not appear in `LEXICON.md`, `RUNBOOK.md` or `AGENTS.md`; whether it is a Foundry term or a Claude Code subagent name is an open question for step 1.
- `tools/test-skill-catalog.mjs` requires exactly five archive directories (`ask-workbench`, `brainstorm`, `grill-me`, `sitrep`, `writing-great-skills`). `workbench/skills/README.md` carries an optional-source inventory row for `sitrep` and a referenced-skills row marking it "out of scope" because the room-core sitrep planned with S-01X owns its return.
- Overlap: `workbench/specs/S-01X-generated-json-taskboard/SPEC.md` (active) plans a "Room-core sitrep slice" that would create `workbench/skills/sitrep/SKILL.md`, update the manifest's required bundle and verify the catalog tests, with a title-first report over the JSON Taskboard. It states that the personal sitrep skill is not a shipped room dependency. Its sitrep acceptance is unchecked and its closed Tasks do not cover that slice. `workbench/specs/S-00V-portable-workbench/SPEC.md` also says `sitrep` returns through S-01X.
- `workbench/specs/S-00R-core-skill-lifecycle-and-optional-source-disposition/SPEC.md` is active, owned by `codex-director`, and a live Codex lane `codex/S-00R-optional-inventory` exists. It requires a per-item owner decision before relocating archived optional skills.
- Matt Pocock has no `sitrep` counterpart. The nearest neighbor is not chosen here; step 3 names it from Matt's tree at the pin.
- No fresh behavioral scenario for `sitrep` is claimed by this planning Spec.

## Desired Behavior

1. `sitrep` gives a conversation-only, read-only answer at the smallest sufficient scope and creates no durable artifact by default.
2. Its report separates verified fact, inference, risk and recommendation, and shows freshness when stale evidence could change the answer.
3. It investigates deeper only when live evidence is insufficient, by a named read-only mechanism that resolves to something real in this Workbench or is recorded as a finding.
4. The draft article, the skill source in `workbench/skills/sitrep/`, the catalog and the Core bundle assertions agree on the behavior, its limits and the source revision. Where `sitrep` reads the Taskboard, it names which projection it reads at the time of delivery.

## Decisions And Contracts

- Owner decision 2026-09-30: `sitrep` becomes Core. This Spec records that decision as the per-item S-00R relocation decision for `skills-archive/optional-active-2026-09-01/sitrep`. S-00R has a live Codex lane, so this Spec does not edit it; the Dispatcher coordinates with that lane at step 6.
- Matt counterpart: none; the nearest neighbor is an open item for step 3.
- Group: getting-started. `origin` is recorded by step 1, not guessed here.
- Whether this Spec's `sitrep` and S-01X's room-core `sitrep` are one skill or two is an open question for step 1. This Spec does not decide it; it must be settled with S-01X's owner before step 6 so one source lands in `workbench/skills/sitrep/`.
- Skills that exist only in `~/.agents/skills` have no repo source; step 6 copies from the personal install (read-only) or from the identical archived copy, and never writes to `~/.agents/skills`.
- A Wiki article is curated context, not instruction authority or proof of behavior. Q2A (wayfinder storage) is deferred and untouched here.

## Non-Goals

- Rewriting S-01X's JSON Taskboard work, S-00R's disposition work or any other Spec.
- Editing `~/.agents/skills`, adopting a Foundry skill or answering Q2A.
- Treating a green catalog suite as proof of agent behavior or as owner Human QA.
- Writing any Task or Wiki file in this planning pass.

## Dependencies And Blockers

- S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5.
- Core-bound sequence: S-002N (brainstorm) must finish its bundle step 6 first. The Core bundle files are shared and have one writer at a time; the next Core-bound Spec is S-002P.
- S-01X (active) plans a conflicting room-core `sitrep` source and bundle edit; its slice and this Spec's step 6 must be sequenced or merged by decision.
- S-00R (active, live Codex lane) owns archive and pending disposition; coordinate, do not edit.

## Vertical Implementation Slices

No Task is cut yet; Tasks are cut from live Actuality at activation with `/to-tasks`. The intended slice direction, in order:

1. Investigate ours. Read `sitrep` source and any tests at a named commit; record inputs, outputs, writes and composition, resolve `Scout`, and record the true `origin` and the S-01X overlap.
2. Draft the article from Template 2 (owned by S-002L) at `workbench/wiki/skills-draft/getting-started/sitrep.md`, tentative until S-002L decides.
3. Investigate Matt's. Name the nearest neighbor skill from Matt's tree at `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60` and read its `SKILL.md` there.
4. Compare. Fill "Compared with Matt's" and log findings, one greppable line each.
5. Align the article until its wording matches real or intended behavior; log what is left.
6. Create the skill in its lane: bring `sitrep` into `workbench/skills/sitrep/`, then update every closed-bundle touchpoint: `workbench/skills/README.md` (bundle list, optional-source inventory row, referenced-skills row), the Lexicon's "Core skill bundle" row in `LEXICON.md`, `workbench/manifest.json` `skillPolicy.required`, and the catalog tests including `tools/test-skill-catalog.mjs`'s five-archive-directory requirement and its derived bundle-count wording. Add a fresh-context scenario. Counts and the archive list are read from live state after S-002N lands, not assumed.

Steps 1-5 touch only the draft wiki. Step 6 is the only step that touches a skill lane or shared controls.

## Acceptance Criteria

- [ ] The draft article fills every section; every "needs" and "reads and writes" item resolves or is logged as a finding, including `Scout`.
- [ ] The nearest neighbor skill is named from Matt's tree at the pin and the comparison verdict is recorded.
- [ ] The relationship between this `sitrep` and S-01X's room-core `sitrep` is decided with S-01X's owner and recorded, so one source exists at `workbench/skills/sitrep/SKILL.md`.
- [ ] `workbench/skills/sitrep/SKILL.md` matches the aligned article and is read-only and artifact-free by default.
- [ ] The owner's 2026-09-30 decision is recorded as the per-item S-00R relocation decision, and every closed-bundle touchpoint named in step 6 agrees on the new Core count and membership.
- [ ] A fresh-context scenario shows a small, fact-versus-inference report without a file dump; no unrun check is reported as passing.
- [ ] Catalog tests, the full AGENTS.md suite, render, doctor and the self-drift receipts are green for step 6.

## Testing Seams

Steps 1-5 are checked by reading: each article claim cites a source line or is a finding. Step 6 uses `tools/test-skill-catalog.mjs`, `tools/test-skills-lane.mjs` and `tools/test-core-composition.mjs` for routing and bundle membership, with red before green. These prove routing, not agent behavior; the fresh-context scenario covers conversational fidelity and may still need human review.

## Verification Procedure

Run the targeted catalog and lane tests, `node workbench/tools/wiki.mjs validate` when an article is routed, then the current full suite in `AGENTS.md` from a committed candidate, `node workbench/tools/spec-workbench.mjs render` and `doctor`, and the self-drift pre/post receipts. Review the immutable candidate separately before integration. Record actual commands and results in this Spec.

## Documentation Impact

Draft article: `workbench/wiki/skills-draft/getting-started/sitrep.md` (tentative until S-002L decides). Step 6 touches `workbench/skills/README.md`, the "Core skill bundle" row in `LEXICON.md`, `workbench/manifest.json`, `tools/test-skill-catalog.mjs` and any other test that asserts the bundle size or archive list. Step 6 may also touch `workbench/specs/S-01X-generated-json-taskboard/SPEC.md` only through that Spec's owner. Record `Docs checked; no update needed` with a reason for any control that does not change.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Spec authored from the owner's 2026-09-30 draft-skills-wiki direction; sitrep becomes Core | Source, archive copy and S-01X/S-00R overlap read at pre anchor; planning only, no implementation evidence | This Spec authored; no article or skill source written | Every slice, the S-01X overlap decision and the `Scout` question remain open |

## Completion Result

Not complete.

## Supersession

None.
