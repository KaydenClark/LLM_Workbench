---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-accepted concept and S-00W planning, 2026-09-23
  - S-00Z TK-00Q source, core declaration and fresh-context scenario, 2026-09-26
source_paths:
  - workbench/skills/grill-me/SKILL.md
  - workbench/skills/grilling/SKILL.md
  - workbench/skills/notepad/SKILL.md
  - workbench/tools/workbench-layout.mjs
  - workbench/manifest.json
  - workbench/skills/README.md
  - tools/test-skill-catalog.mjs
  - workbench/specs/S-00Z-grill-me-skill-rebuild/SPEC.md
  - workbench/specs/S-00W-concept-grilling-and-notepad-composition/SPEC.md
  - skills-archive/optional-active-2026-09-01/grill-me/SKILL.md
last_verified: 2026-09-26
---

# Grill-me: start a saved design inquiry

Use `grill-me` when the owner wants an idea questioned and wants the answers, corrections and next step to survive a pause. It is an entry point, not a third contract: [grilling](skill-grilling.md) runs the one-question-at-a-time interview and [notepad](skill-notepad.md) preserves its working context. The [source](../skills/grill-me/SKILL.md) adds only the order in which the two are composed and when the note is written. Neither composed skill gains the other's responsibility.

**Inputs:** the topic the owner named, and the owner's answers as they arrive. **Output:** one local, untracked grilling-type JSON note for that objective, holding the question map, every answer as it was given, every correction linked to what it corrects, and a current view that says what is still pending. **Done when:** the owner names an exit (pause, promote, specify, hand off, execute) and the note reads back faithfully; a confirmed concept does not itself create a Spec or authorize execution.

## How it works

1. **Bind the objective to its note first.** The agent reads `workbench/manifest.json`, derives one objective slug from the topic, lists existing notes for it and resumes the one it finds. Only when none exists does it create a grilling-type note seeded with the decision map, and it confirms the returned revision before asking anything. A different topic is a separate objective with its own note; an unrelated investigation never absorbs design answers.
2. **Run the grilling contract, saving as it goes.** Each question carries a recommendation, why and impact. The owner's actual answer is appended at once as a `source_record` with the readback as its interpretation and the pending readback listed in `current.unresolved`; the question stays `open`. A correction is appended as a `correction` naming that entry, followed by a revised readback. Only the owner's explicit confirmation produces a `decision` entry, a `locked` status, a cleared unresolved item and the next question.
3. **Resume at the pending readback.** On a fresh start or after a pause, the agent reads the current view and then the topic of any unresolved item, so the pending answer returns together with its corrections. It restates the latest readback as pending and waits. It does not lock it, does not ask the next question, and does not treat the earlier answer as settled.
4. **Stop at the owner's exit.** Promotion, specification, handoff and execution are separate authorized compositions. Before a voluntary exit the agent validates and reads back the note.

### Example, from the verification run

In the S-00Z scenario an agent given only the three skill sources was told to grill the owner on a weekly digest feature. It found no note for the objective, created one with a six-question map, and asked the first question with a recommendation. The owner answered against the recommendation ("a private summary of what I wrote this week, sent to me daily"). The agent saved that as a pending `source_record`, read it back as pending, kept the owner's reason apart from its own inference, and asked one clarifying question about the same decision. The owner corrected "daily" to "weekly"; the agent appended a linked `correction`, gave a revised readback, and waited without locking. The owner then paused and asked for a note on an unrelated retry-limit investigation. The agent left the digest note untouched at its pending state, created a separate work-type note for the other objective, and read both notes back before stopping.

A second agent with no memory of that session was told to pick the grilling back up. It listed the objective's notes, read the current view, read the topic so the correction returned with the original, and restated the revised readback as pending. It asked no new question. When the owner said "Yes, that's right" it appended the `decision` entry for that question, set the question `locked`, cleared the unresolved item, validated the note, and only then asked the next ready question with a recommendation.

## Source and distribution boundary

**Verified current state, 2026-09-26:** `grill-me` is a declared core skill. The runtime bundle in [workbench-layout.mjs](../tools/workbench-layout.mjs) lists it after `handoff`, the [manifest](../manifest.json) requires it, the [core catalog](../skills/README.md) documents it, and the room's tracked `.agents/skills` and `.claude/skills` adapters resolve it inside the `workbench/skills` lane. The bundle is now twenty-two skills; the twenty-one-skill row rooms stamped `v3.2.1` declared stays frozen in the runtime, so such a room validates with either its stamped row or the current policy the Workbench update writes. The source keeps `disable-model-invocation: true`: the entry is owner-invoked, and grilling already answers the trigger phrases. `tools/test-skill-catalog.mjs` pins the declaration and the composition wording.

The [archived wrapper](../../skills-archive/optional-active-2026-09-01/grill-me/SKILL.md) that only forwarded to grilling stays where it is as historical source; its disposition remains [S-00R](../specs/S-00R-core-skill-lifecycle-and-optional-source-disposition/SPEC.md)'s decision. Installed personal copies of the skill are not updated by this repository change.

## Verified behavior and limits

**Verified 2026-09-26:** the declaration, adapters and source wording are covered by `tools/test-skill-catalog.mjs`, `tools/test-workbench-layout.mjs` (the frozen `v3.2.1` row), `tools/test-skills-lane.mjs` and `tools/test-core-skill-installer.mjs`. Two fresh-context agents, each given only the three skill sources, followed the composition in the scenario above. The turn-by-turn record is in the [Spec evidence](../specs/S-00Z-grill-me-skill-rebuild/SPEC.md#append-only-evidence-and-execution-log).

**Limits:** that was one run with one model, against a scripted owner, with no runtime change to notepad or grilling. It is not owner Human QA and not a repeated trial. The resuming agent could not verify the room's Contract or live state because the scenario forbade reading anything beyond the skill sources, so that step of the source is unexercised. The revision check on note writes is a check, not a lock, as the still-proposed ADR-000L (open PR #92) records; this entry does not change it. The composed grilling, notepad and grill-me journey is checked by [S-00W](../specs/S-00W-concept-grilling-and-notepad-composition/SPEC.md) now that all three skills are delivered.

## Sources

- [Grill-me source](../skills/grill-me/SKILL.md)
- [Grilling source](../skills/grilling/SKILL.md) and [notepad source](../skills/notepad/SKILL.md)
- [Individual delivery Spec](../specs/S-00Z-grill-me-skill-rebuild/SPEC.md)
- [Concept and acceptance](../specs/S-00W-concept-grilling-and-notepad-composition/SPEC.md)
- [Runtime bundle](../tools/workbench-layout.mjs), [manifest](../manifest.json) and [core catalog](../skills/README.md)
- [Archived wrapper](../../skills-archive/optional-active-2026-09-01/grill-me/SKILL.md) under [S-00R](../specs/S-00R-core-skill-lifecycle-and-optional-source-disposition/SPEC.md)
- [Wiki router](MEMORY.md)

## History

- 2026-09-23: Created as an individual article for the accepted entry-point design; current and intended sources distinguished.
- 2026-09-24: Source links reconciled to the managed skills lane; S-00Z owns this skill's future delivery. No behavior change claimed.
- 2026-09-26: S-00Z TK-00Q delivered the repository-owned source, declared it in the core bundle, and recorded one fresh-context scenario. Status `partial` to `active`.
