# S-003N - tdd skill alignment

**Spec ID:** S-003N
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-30
**Catalog description:** Drive one behavior at a public seam through a verified red-green-refactor loop.
**Blockers:** S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5. Step 6 also needs S-00R (or an owner decision it names) to authorize any edit under `skills-pending/`.
**Latest event:** Authored from the owner's 2026-09-30 draft-skills-wiki direction.
**Next gate:** Deliver S-002L, then activate this Spec and cut Tasks from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`07edccc57b8f75613ad1d09203a3e414d867b90c` post=`07edccc57b8f75613ad1d09203a3e414d867b90c`.

## Outcome

The draft-wiki article for `tdd`, the comparison with Matt Pocock's `engineering/tdd`, and the `tdd` skill source all describe one behavior. The Spec also settles whether `tdd` stays Pending or is promoted, from the findings its steps record, and records every place a Core skill relies on `/tdd` while the skill is only Pending.

## Why It Matters

`AGENTS.md` (Engineering And Verification) requires red/green TDD for behavior changes, and Core skills (`implement`, `builder`, `carry`, `tracer-bullet`) lean on that practice. The owner wants the skills wiki prototyped to find skills that should connect and do not. `tdd` is a good early probe: one Core skill points at it by invocation name, the practice itself lives elsewhere, and two copies of the skill disagree with each other.

## Current Verified State

- **Source.** `skills-pending/tdd/` holds `SKILL.md` (36 lines), `mocking.md` (59) and `tests.md` (77). `workbench/skills/README.md` (Referenced non-lane skills) records it as pending with "owner decision required" on retention, and lists `tdd` as an optional mention only. It is not in the Core 26, and there is no `workbench/wiki/skill-tdd.md`.
- **Two copies differ.** `~/.agents/skills/tdd/SKILL.md` (555 bytes, dated Aug 16, no supporting files) is a Workbench-style rewrite: description "Drive one behavior at a public seam through a verified red-green-refactor loop", refactor while green, record proof in the assigned spec. The `skills-pending/` copy carries a different description, a reference-style body (seams, anti-patterns, rules of the loop), and the two supporting files. Neither was byte-compared to Matt's file (that is step 3). Which copy is canonical is open.
- **Who names `/tdd`, read at the anchors.**
  - Core `workbench/skills/tracer-bullet/SKILL.md` writes "the way `/tdd` and `/implement` drive behavior" (Real seam bullet). README classifies this as an optional mention. If a reader invokes `/tdd`, nothing in the lane provides it: candidate `dangling` finding, Core on Pending.
  - Core `workbench/skills/implement/SKILL.md` states red/green/refactor inline at the agreed seam and does not name `/tdd`.
  - Core `workbench/skills/builder/SKILL.md` and `workbench/skills/carry/SKILL.md` say "red/green TDD" and `/implement` without naming `/tdd`.
  - Personal `role-engineer` says "red/green TDD where the stack supports it" without naming `/tdd`; it is Foundry-origin and handled by the Foundry triage Spec (S-003E).
  - A repository search of skill sources found no other `/tdd` caller. Personal `~/.agents/skills` `design-an-interface`, `codebase-design`, `tracer-bullet` and `wayfinder` also matched the search; step 1 must read those matches rather than assume they name `/tdd`.
- **Candidate conflicts to verify in step 1.** The pending copy says "Refactoring is not part of the loop" and sends it to `code-review`, while Core `implement` refactors while green inside the loop. The pending copy requires seams to be confirmed with the user before any test; `implement` only needs the seam "agreed". The pending copy reads `CONTEXT.md`, a name this repository replaced with `LEXICON.md`.
- No behavioral scenario for `tdd` has been run. Nothing above is a verdict.

## Desired Behavior

1. A reader of the draft article can say what `tdd` does, when to reach for it, what it needs and what it writes, with every "needs" and "reads/writes" item resolving to something real or logged as a finding.
2. The article states plainly how `tdd` relates to `implement`, `builder`, `tracer-bullet` and the `AGENTS.md` rule: which one owns the loop and which one is reference.
3. The comparison with Matt's `engineering/tdd` carries a verdict (same, close, divergent or missing) with behavior and clarity differences.
4. Skill source, article and comparison agree, and Core callers either name a skill that ships in the lane or stop naming it.

## Decisions And Contracts

- This Spec owns `tdd` alone. Neighbor skills keep their own Specs: S-01H implement, S-01P builder, S-01C carry, S-01M tracer-bullet.
- Steps 1-5 touch only the draft wiki. Step 6 is the only step that touches a skill lane, and `skills-pending/` is outside `AGENTS.md` Edit Scope; S-00R is the authorizing route for any edit or promotion there. Without that route step 6 stops and records the blocker.
- Pending is the default. `tdd` is promoted to Core only if a step records a finding that justifies it and the owner decides; Core is a closed bundle that the Core-bound Specs S-002M, S-002N, S-002O and S-002P change one writer at a time, so promotion is not assumed.
- The alternatives step 6 may choose between are open: promote and fix, keep Pending and repair the Core callers, or retire. The practice may need no separate skill, as README already argues.
- A draft article is curated context, not instruction authority.

## Non-Goals

- Editing `implement`, `builder`, `carry` or `tracer-bullet`; findings about them go to their Specs.
- Writing a Wiki article before S-002L, or any `workbench/wiki/**` file outside the draft collection.
- Moving, archiving, installing or deleting a skill, or writing to `~/.agents/skills`.
- Treating a green catalog test as proof of agent behavior.

## Dependencies And Blockers

- **S-002L Skills draft wiki collection** must deliver the draft-wiki location and article template before steps 2-5.
- **S-00R** is named as the authorizing route for step 6 because `skills-pending/` is not in `AGENTS.md` Edit Scope; S-00R has a live Codex lane, so this Spec does not amend it.
- Neighbor Specs S-01H, S-01P, S-01C and S-01M receive any finding about their `/tdd` wording; this Spec does not wait on them.
- Matt's file is read at step 3, not now.

## Vertical Implementation Slices

These are the owner-approved six steps as intended slice direction. No Task is cut yet; Tasks are cut from live Actuality at activation with `/to-tasks`.

1. **Investigate ours.** Read `skills-pending/tdd/SKILL.md`, `mocking.md` and `tests.md`, the personal copy, and the tests that mention `tdd` (catalog and skills-lane tests), at a named commit. Record inputs, outputs, writes and composition, the true `origin`, and make "which copy is canonical" the first item. Resolve each `/tdd` mention above and log `dangling` and `conflict` findings.
2. **Draft the article.** Fill Template 2 (owned by S-002L) at `workbench/wiki/skills-draft/primitives/tdd.md`, tentative until S-002L decides, from step 1.
3. **Investigate Matt's.** Read `engineering/tdd` in `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`, including supporting files.
4. **Compare.** Fill "Compared with Matt's", record the verdict and log findings (one `F:tdd:NN` line each).
5. **Align the article.** Rewrite until wording matches real or intended behavior; log what is left.
6. **Fix or create the skill.** Edit `SKILL.md` and supporting files in their lane under S-00R authority, or promote or retire per the owner's decision, with catalog tests and a fresh-context scenario. Update the Core callers' wording only through their own Specs.

## Acceptance Criteria

- [ ] The draft article has every Template 2 section filled and its source paths and `last_verified` stamp are current.
- [ ] Every item under "What it needs" and "What it reads and writes" resolves to a real artifact or is a recorded finding, including each Core-on-Pending `/tdd` mention.
- [ ] The canonical copy (`skills-pending/tdd` or the personal rewrite) is decided and recorded.
- [ ] The Matt comparison has a verdict and logged findings.
- [ ] Skill source matches the article, or the Pending, promote or retire decision is recorded with its owner decision.
- [ ] For step 6: catalog and skills-lane tests plus the full suite in `AGENTS.md` are green from a committed candidate, with a fresh-context scenario observed and S-00R named as the route.

## Testing Seams

Steps 1-5 have no executable seam; the checks are the draft-wiki validation S-002L delivers and a read-back of every cited path. Step 6 uses the catalog and skills-lane tests (`tools/test-skill-catalog.mjs`, `tools/test-skills-lane.mjs`) as the structural seam and a fresh-context scenario: a cold agent is asked to fix one small behavior and is observed driving red then green at a stated seam. Structural checks do not prove behavior.

## Verification Procedure

For steps 1-5, confirm the article against the S-002L template check and re-read each cited source. For step 6, run the targeted tests, the full suite from `AGENTS.md`, `node workbench/tools/spec-workbench.mjs render` and `doctor`, and a separate-context review of the immutable candidate. Record actual commands and results in this Spec; report no unrun check as passing.

## Documentation Impact

- Draft article `workbench/wiki/skills-draft/primitives/tdd.md` (tentative until S-002L decides).
- Step 6 may touch `skills-pending/tdd/**` or its promotion route, the README Referenced non-lane skills row for `tdd` (`workbench/skills/README.md`), and, if promoted, the Core bundle touchpoints. Record `Docs checked; no update needed` otherwise.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Spec authored from the owner's draft-skills-wiki direction; planning only | Sources read at the pre anchor; no implementation, scenario or test run | This Spec authored; no article or skill source touched | Blocked on S-002L; Tasks are cut at activation; canonical copy and Core `/tdd` mentions open |

## Completion Result

Not complete.

## Supersession

None.
