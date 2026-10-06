# S-002W - wayfinder skill alignment

**Spec ID:** S-002W
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-04
**Catalog description:** Chart a large, uncertain effort as a map of decisions and resolve them one at a time toward a named destination.
**Blockers:** S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5. Open owner question Q2A (where wayfinder keeps provisional decisions before a Blueprint or Spec exists) blocks step 6 only.
**Latest event:** Authored from the owner's 2026-09-30 draft-skills-wiki direction.
**Next gate:** Deliver S-002L, then activate this Spec and cut Tasks from live Actuality with `/to-tasks`. Step 6 additionally waits for the owner's answer to Q2A.

> **Citation anchors.** pre=`07edccc57b8f75613ad1d09203a3e414d867b90c` post=`07edccc57b8f75613ad1d09203a3e414d867b90c`.

## Outcome

The draft Wiki article for `wayfinder`, the comparison with Matt Pocock's `engineering/wayfinder`, and the skill source all describe one behavior. Every "needs" and "reads and writes" item in the article resolves to something real or is logged as a finding. Open question Q2A stays open until the owner answers it; this Spec records it and never answers it.

## Why It Matters

The owner wants to prototype the skills Wiki on the current skills to find what is wrong: skills that should connect and do not, and skills that connect and do not work together. `wayfinder` is the case he named. If nobody can say where it would store its decisions, that alone shows the problem. This Spec is one of the three pilot skills named in the handoff (`wayfinder`, `handoff`, `wait-what`); the pilot is a separate step this Spec does not start or authorize.

## Current Verified State

- `skills-pending/wayfinder/SKILL.md` is the only file in its directory. It is a Pending skill, outside the core lane, with `disable-model-invocation: true`. `workbench/skills/README.md` records it as unshipped, with recovery from commit `bcfa55d4d33b3a815e899eeb9e60c7629d462d82` and an open owner decision on retention.
- The skill charts a shared **map** as one issue labelled `wayfinder:map`, with child issues as tickets typed `research`, `prototype`, `grilling` or `task`. It claims a ticket by assigning it, wires blocking with the tracker's native dependency, and resolves at most one ticket per session. It plans and decides; it does not do the work unless the effort's Notes say so.
- **Where it keeps its state is delegated away.** It says the map, tickets, blocking and frontier queries are "tracker-specific", tells the agent to run `/setup-matt-pocock-skills` if no tracker was provided, to read a tracker doc's "Wayfinding operations" section, and to default to "the local-markdown tracker". None of those three exists in this repository: no `setup-matt-pocock-skills` skill, no tracker doc, no definition of a local-markdown tracker. `tools/test-skill-catalog.mjs` also forbids that setup skill's name in `to-spec` and `to-tasks`.
- `LEXICON.md` defines **Map**, **Decisions so far**, **Fog** and **Frontier**, but only around a Spec destination, and defines Frontier as open, unblocked, unclaimed Tasks. It marks **Ticket** as a retired term: `Task` names the execution slice. The skill's map has no Spec yet and its tickets are decisions, not Tasks, so the two uses of these words do not line up.
- Our references to it are optional only: `BLUEPRINT.md` says wayfinding "can open Align", `workbench/skills/grilling/SKILL.md` and `workbench/wiki/skill-grilling.md` say it "may" narrow an oversized inquiry, and `workbench/skills/README.md` records the requirement as optional. The skill itself names `/grilling` (core), `/domain-modeling` and `/prototype` (both Pending).
- No Wiki article exists for it. Behavior has not been exercised in this Spec's planning; nothing here claims it works.

## Desired Behavior

1. A reader of the draft article can say what `wayfinder` does, when to reach for it, what it needs, and exactly where it reads and writes.
2. Every "needs" and "reads and writes" line resolves to a real Workbench owner, or is a finding with a named fixer.
3. The article states honestly that where wayfinder keeps provisional decisions before a Blueprint or Spec exists is open question Q2A, until the owner answers.
4. After the owner answers Q2A, the skill source, the article and the Lexicon wording agree. Before that, step 6 does not edit the skill's storage behavior.

## Decisions And Contracts

- **Q2A is OPEN and owner-deferred.** Question: where does `wayfinder` keep its provisional decisions before a Blueprint or Spec exists? Matt's design keeps one map issue plus child decision tickets on the tracker his setup skill declared. Our Lexicon has Map, Fog and Frontier only around a Spec destination. Do not answer it here. Steps 2 and 4 log it as a finding (kind `gap`, fixer: owner decision); step 6 cannot complete until the owner answers.
- Q1 is locked and not reopened: an idea comes first, and `grill-me`, `wayfinder` or `brainstorm` can open Align (`BLUEPRINT.md`).
- Group is `shaping`; Matt counterpart is `engineering/wayfinder` at `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`. The true `origin` is recorded in step 1, not guessed now; the third-party notice suggests Pending skills are unmodified copies of his, but they were not byte-diffed.
- The skill stays Pending unless a finding justifies another disposition, and that disposition is the owner's. `skills-pending/` is not in the `AGENTS.md` Edit Scope; S-00R (core skill lifecycle and optional source disposition) is the authorizing route for any edit there, so step 6 names it when it acts.
- Steps 1-5 touch only the draft wiki. Step 6 is the only step that touches a skill lane.
- A Wiki article is curated context, not instruction authority or proof of behavior.

## Non-Goals

- Answering Q2A, choosing a storage location, or designing a map store.
- Reopening Q1, or changing the Lexicon's Map, Fog or Frontier terms before the owner answers Q2A.
- Starting the pilot, writing the other two pilot articles, or deciding Core promotion of `wayfinder`.
- Reading or quoting Matt's article pages; his skill file at the pin is read in step 3 and summarized, not reproduced.
- Importing `/setup-matt-pocock-skills`, an issue-tracker dependency or `grill-with-docs`.

## Dependencies And Blockers

- **S-002L Skills draft wiki collection** must deliver the draft-wiki location and article template before steps 2-5. The tentative location is `workbench/wiki/skills-draft/shaping/wayfinder.md`, tentative until S-002L decides.
- **Q2A** (owner-deferred) blocks step 6 only, not steps 1-5.
- Step 6 depends on S-00R for authority to edit `skills-pending/wayfinder`, which has a live Codex lane (`codex/S-00R-optional-inventory`); check `git worktree list` and open PRs before touching that lane. The Pending `domain-modeling` and `prototype` skills it names are owned by Required Domain Modeling Skill (S-004J, which replaced the superseded S-002H) and the later `prototype` adoption Spec; wayfinder must not hide a required dependency on either.

## Vertical Implementation Slices

No Task is cut yet. Tasks are cut from live Actuality at activation by `/to-tasks`. The intended slice direction is:

1. **Investigate ours.** Read `skills-pending/wayfinder/SKILL.md` and any tests or catalog rows that name it, at a named commit. Record inputs, outputs, writes and composition, the true origin, and each reference that fails to resolve (the setup skill, the tracker doc, the local-markdown tracker, the retired "ticket" term).
2. **Draft the article.** Fill Template 2 (owned by S-002L) at `workbench/wiki/skills-draft/shaping/wayfinder.md`, tentative until S-002L decides. "What it reads and writes" is where Q2A surfaces; log it as a finding rather than filling it with a guess.
3. **Investigate Matt's.** Read `engineering/wayfinder` at `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60` and what it relies on for tracker operations.
4. **Compare.** Fill "Compared with Matt's" with a verdict (same, close, divergent or missing) and behavior and clarity differences. Log findings, including Q2A, with kind and fixer, one greppable line each.
5. **Align the article.** Rewrite until its wording matches real or intended behavior; log what is left, with Q2A recorded as open.
6. **Fix or keep the skill.** Edit `skills-pending/wayfinder/SKILL.md` only as findings support and S-00R authorizes, with catalog tests and a fresh-context scenario. **Blocked until the owner answers Q2A**; if the owner keeps it as-is, record that and the remaining gap.

## Acceptance Criteria

- [ ] The draft article has every Template 2 section filled, and its frontmatter records `skill: wayfinder`, `group: shaping`, `skill_source: pending`, the true `origin`, `matt_counterpart: wayfinder`, and the upstream pin.
- [ ] Every "needs" and "reads and writes" item resolves to a real owner or is a finding; the missing setup skill, tracker doc and local-markdown tracker are each logged.
- [ ] A finding records Q2A as open and owner-deferred, and no document in this Spec's output answers it.
- [ ] A comparison verdict against `engineering/wayfinder` at the pin is recorded.
- [ ] After the owner answers Q2A, the skill source matches the article; the edit is made under S-00R's authority and a fresh-context scenario is observed.
- [ ] Catalog tests and the suites in `AGENTS.md` are green for step 6; no unrun check is reported as passing.

## Testing Seams

Steps 1-5 are documentation; their checks are the Wiki validator and a read-back that every finding line is greppable. Step 6 uses the skill's catalog tests (`tools/test-skill-catalog.mjs`, `tools/test-skills-lane.mjs`) and a fresh-context scenario: given a loose idea with no Spec, the agent names a destination, records one map, and resolves one decision, keeping its state only where the owner's Q2A answer says. A structural check proves routing, not agent behavior.

## Verification Procedure

For steps 1-5, run `node workbench/tools/wiki.mjs validate` on the draft collection once S-002L defines it, then `render` and `doctor`. For step 6, run the targeted tests, the full suite in `AGENTS.md` from a committed candidate, the self-drift pre/post receipts, and a separate-context review of the immutable candidate before integration. Record actual commands and results in this Spec.

## Documentation Impact

Draft article: `workbench/wiki/skills-draft/shaping/wayfinder.md` (tentative until S-002L decides). Step 6 may touch `skills-pending/wayfinder/SKILL.md`, its row in `workbench/skills/README.md`, and, only after the owner answers Q2A, the Lexicon's Map, Fog and Frontier rows. If Core promotion is later chosen, the closed-bundle touchpoints in `AGENTS.md` and the Lexicon apply and belong to that decision. Record `Docs checked; no update needed` where a control does not change.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Spec authored from the owner's draft-skills-wiki direction; Q2A recorded as open and owner-deferred | Current `skills-pending/wayfinder/SKILL.md`, Lexicon Map/Fog/Frontier/Ticket rows and README rows read at the pre anchor; no behavior scenario run | This Spec authored; no article or skill source written | S-002L delivery, Task cutting at activation, and the owner's Q2A answer remain open |
| 2026-10-04 | reference repair | The domain-modeling owner changed: S-002H was superseded by Required Domain Modeling Skill (S-004J) | Read S-002H and S-004J at the remap branch | Dependencies line repointed | Unchanged |

## Completion Result

Not complete.

## Supersession

None.
