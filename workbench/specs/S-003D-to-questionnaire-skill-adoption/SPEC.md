# S-003D - to-questionnaire skill adoption

**Spec ID:** S-003D
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-30
**Catalog description:** Turn a set of open questions into a questionnaire the owner can answer, without writing any Canon.
**Blockers:** S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5.
**Latest event:** Authored from the owner's 2026-09-30 draft-skills-wiki direction.
**Next gate:** Deliver S-002L, then activate this Spec and cut Tasks from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`07edccc57b8f75613ad1d09203a3e414d867b90c` post=`07edccc57b8f75613ad1d09203a3e414d867b90c`.

## Outcome

The draft article, the comparison with Matt Pocock's counterpart and a `to-questionnaire` skill source all describe one behavior. This is a new skill adopted from Matt's `productivity/to-questionnaire`; the Workbench has no skill of that name today. Per the owner's decision 1 it is adopted as Pending unless this Spec records a different decision.

## Why It Matters

The owner wants the skills prototyped as a draft wiki to expose skills that should connect and do not. A questionnaire skill sits next to the interview primitives (`grilling`, `grill-me`) and the destination question cards, and nobody has yet said how they relate. Naming the skill, what it reads and where its output lives is the point of the exercise.

## Current Verified State

At the pre anchor:

- No `to-questionnaire` exists in `workbench/skills/`, `skills-pending/`, `skills-archive/` or `~/.agents/skills/`. The word "questionnaire" appears in the repo only as a contrast: `workbench/skills/grilling/SKILL.md` says its decision map is "not a questionnaire written up front", and `tools/test-skill-catalog.mjs` asserts that.
- The nearest Workbench behavior is therefore treated as ours: `grilling` (`workbench/skills/grilling/SKILL.md`, S-00X) asks one question at a time, reads each answer back as pending, and writes no canonical file during the interview; `grill-me` (`workbench/skills/grill-me/SKILL.md`, S-00Z) composes `grilling` with `notepad`; and the destination question cards (S-002B, `workbench/specs/S-002B-destination-question-cards/SPEC.md`) persist an evolving concept record with origin, corrections and uncertainty.
- S-00W (`workbench/specs/S-00W-concept-grilling-and-notepad-composition/SPEC.md`) states that a settled term does not authorize a Canon write. That rule, and the interview writing no Canon, is why `grill-with-docs` was excluded from this effort; this adoption must respect it.
- Two copies of `grilling` and `grill-me` exist. The `~/.agents/skills` copies differ from the in-repo ones: the personal `grilling` has an older description and a `.workbench-skill.json` stamp (release v3.2.1), and the personal `grill-me` is a one-line description with a different body. The in-repo copy is the current source; this matters only because step 1 reads them as neighbors.
- Matt's `productivity/to-questionnaire` at `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60` is not read. Nothing here describes its behavior beyond its name and the handoff's framing; step 3 establishes what it does.

## Desired Behavior

1. The skill's declared source, its draft-wiki article and the recorded Matt comparison agree on one description of what it does, its inputs, outputs and limits.
2. Whatever the skill produces, it does not write Canon: it creates no Spec, ADR, Lexicon or Wiki change, and it does not answer the questions for the owner. Any durable result goes through a named existing owner (`promote`, `to-spec`, `notepad`) after the owner selects that endpoint.
3. The article's "What it needs" and "What it reads and writes" sections resolve every item to something real, or record a finding. In particular it states where a questionnaire lives and where the answers return.
4. The skill is adopted as Pending by default, and its relation to `grilling`, `grill-me`, the notepad and the S-002B destination question cards is one explicit line each, not an assumption.

## Decisions And Contracts

- Group: productivity. Matt counterpart: `productivity/to-questionnaire`. Origin is recorded in step 1 from evidence, not assumed. Source is `new`.
- Default disposition is Pending (owner decision 1). Promotion to Core, if ever wanted, is a separate owner decision and not part of this Spec.
- Authorization for a pending-lane edit: `skills-pending/` is not listed in `AGENTS.md` Edit Scope. S-00R (`workbench/specs/S-00R-core-skill-lifecycle-and-optional-source-disposition/SPEC.md`) governs pending and archive source and requires a per-item owner decision for relocation. Step 6 must name which authorization covers creating `skills-pending/to-questionnaire/` (the owner's 2026-09-30 adoption decision for this skill, plus any edit scope S-00R grants), or stop and record the gap. A live Codex lane on S-00R exists, so step 6 must not edit S-00R itself.
- Matt's material is outside evidence and MIT-licensed; summarize and cite, never reproduce long passages. The notice belongs in `THIRD_PARTY_NOTICES.md` if text is carried over.
- The skill must not contradict the interview rule: asking questions is not a decision, and an unanswered or pending answer is never recorded as the owner's.

## Non-Goals

- Adopting `grill-with-docs`, or any behavior that has an interview write Canon.
- Changing `grilling`, `grill-me`, the notepad runtime or the Landmark Tracker to fit this skill; a needed change becomes a finding with an owner.
- Moving the skill into Core or changing the closed Core bundle.
- Deciding where `wayfinder` stores its decisions (Q2A stays open); this Spec only notes if the questionnaire hits the same storage question.

## Dependencies And Blockers

- S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5.
- Step 6 depends on the S-00R pending-lane authorization named above.
- Open questions for step 1: does the questionnaire overlap `grilling`'s Question / Recommended answer / Why / Impact format or the DQC `questions` view field; does it have an audience other than the owner; where do returned answers go.

## Vertical Implementation Slices

No Task is cut yet; Tasks are cut from live Actuality at activation with `/to-tasks`. The intended slice direction is the six steps below, to be re-planned then.

1. Investigate ours: read the nearest behavior, `grilling`, `grill-me` and the S-002B question cards, with their tests, at a named commit. Record inputs, outputs, writes and composition, the true `origin`, and which copy of each neighbor is canonical (the in-repo copy differs from the personal one).
2. Draft the article from the draft-article template owned by S-002L, tentatively at `workbench/wiki/skills-draft/productivity/to-questionnaire.md` (tentative until S-002L decides). Fill it from step 1; since no skill exists, describe the intended behavior and mark it as such.
3. Investigate Matt's: read `productivity/to-questionnaire` in `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60` and record what it does, its inputs, outputs and composition.
4. Compare: fill "Compared with Matt's" with a verdict (same, close, divergent or missing) against Matt's skill, and against `grilling` as the nearest neighbor. Log findings as `F:to-questionnaire:NN` lines.
5. Align the article until its wording matches real or intended behavior; record what remains, including any conflict with the no-Canon rule.
6. Create the skill: add `SKILL.md` in `skills-pending/to-questionnaire/` under the authorization above, with catalog tests and a fresh-context scenario. Steps 1-5 touch only the draft wiki; step 6 is the only step that touches a skill lane.

## Acceptance Criteria

- [ ] Every section of the draft article is filled; every "needs" and "reads/writes" item resolves to something real or is a recorded finding.
- [ ] The comparison verdict against Matt's `productivity/to-questionnaire` is recorded, with `grilling` as the named neighbor.
- [ ] The article states where a questionnaire is kept and where answers return, and that the skill writes no Canon.
- [ ] The `to-questionnaire` skill source in its Pending lane matches the aligned article, and the authorization for editing that lane is recorded.
- [ ] Catalog tests and a fresh-context scenario pass for step 6; the full suite is green from a committed candidate.

## Testing Seams

Steps 1-5 are documentation: check by reading the article against the source and against Matt's file at the pin. For step 6, use the skill catalog and inspection tests (`tools/test-skill-catalog.mjs`, `tools/test-skill-inspection.mjs`) and a fresh-context scenario in which a reader with only the skill produces a questionnaire without writing any Canon file. Structural checks prove routing, not conversational behavior.

## Verification Procedure

Run `node workbench/tools/wiki.mjs validate` if the draft collection is validated by then, the catalog tests, then the full suite in `AGENTS.md` from a committed candidate, plus `render` and `doctor`. Record actual commands and results in this Spec. A separate-context review of the immutable candidate precedes integration.

## Documentation Impact

The draft article at `workbench/wiki/skills-draft/productivity/to-questionnaire.md` (tentative until S-002L decides). Step 6 may touch `skills-pending/to-questionnaire/SKILL.md`, the skill catalog tests, and `THIRD_PARTY_NOTICES.md` if Matt's text is carried over. It does not touch the Core bundle assertions (`workbench/skills/README.md`, the Lexicon Core skill bundle row, `workbench/manifest.json` `skillPolicy.required`) while the skill is Pending.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Spec authored from the owner's draft-skills-wiki direction; planning only, no implementation | Read `grilling`, `grill-me`, S-002B and S-00W at the pre anchor; confirmed no `to-questionnaire` exists in repo or personal install; Matt's file not read | This Spec authored; no article or skill source written | Steps 1-6 and every acceptance item remain open; blocked on S-002L |

## Completion Result

Not complete.

## Supersession

None.
