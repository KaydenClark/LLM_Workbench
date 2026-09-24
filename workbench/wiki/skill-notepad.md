---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-accepted concept and S-00W planning, 2026-09-23
  - S-00Y TK-00P source change and fresh-context scenario, 2026-09-24
source_paths:
  - workbench/skills/notepad/SKILL.md
  - workbench/tools/notepads.mjs
  - workbench/specs/S-00Y-notepad-skill-rebuild/SPEC.md
  - workbench/specs/S-00W-concept-grilling-and-notepad-composition/SPEC.md
  - tools/test-notepads.mjs
  - tools/test-skill-catalog.mjs
  - RUNBOOK.md
last_verified: 2026-09-24
---

# Notepad: preserve one objective's working context

Use `notepad` when meaningful work needs to survive an interruption: owner direction, findings, corrections, uncertainty and the next executable action. It is a reusable continuity primitive, including for objectives that have nothing to do with a design interview. A note is provisional context. The current controls and verified source still determine what is true and authorized.

**Inputs:** one objective, plus what the work learns as it goes. **Output:** one local, untracked JSON note with an append-only entry history and a compact current view (state, unresolved work, next action). **Done when:** a fresh reader can state the objective, current state, unresolved work and next action from the note, and everything the note no longer holds can be found in a durable owner it names.

## How it works

The [skill](../skills/notepad/SKILL.md) selects or creates one note per objective through the [shared runtime](../tools/notepads.mjs). The agent reads the returned revision and saves consequential context as it appears, with writes checked against that revision. Every free-text field is privacy-scanned before it reaches the file. The revision check is a check, not a lock, so one writer per note remains the rule.

- **Corrections link, never rewrite.** A `correction` entry names the entry it corrects, and both stay. Reading a topic returns the matched entries plus their corrections and declared dependencies, each marked `match` or `context`.
- **Resume reads before it relies.** The current view carries no entries and no corrections. Before relying on a saved claim, the agent reads its topic so the correction travels with it. The correction supersedes the original, but both only record what was believed when they were written, so the agent rechecks live state before relying on either.
- **Pending is not confirmed.** When a design inquiry saves an owner answer before its readback is confirmed, it appends a `source_record` entry: the owner's words as content, the readback as interpretation, and a question ID when the inquiry has one. The pending readback goes in `current.unresolved`. A revised readback is a `correction` of that entry. Only a `decision` entry records the confirmed answer. No new kind, status or schema is involved. [Grilling](skill-grilling.md) uses exactly this convention.
- **Cleanup preserves what is still needed.** Settled claims reach durable owners through separately authorized promotion. Trim then removes only landed material, and refuses to strand a retained dependency or to drop a correction while keeping what it corrects. A declared Markdown handoff blocks cleanup until it is explicitly cleared.

### Example, from the verification run

In the S-00Y scenario, an unrelated code investigation had been interrupted. Its note held a finding that the job retry limit was 3, set in a config file, plus a correction saying the config was ignored and the limit was 5, hard-coded in the source. The resuming agent read both entries, then opened the live code before acting. The code said neither: it read an environment variable and fell back to 4. The agent appended a second correction linked to the first, and only then made the planned change. Asked in the same session what the owner had decided about welcome-email timing, it found a pending answer with a corrected readback and no `decision`. It reported that nothing was decided yet, read back the corrected version and waited. When the owner said "Yes, that's right", it appended the `decision` and cleared the pending item from the current view.

## Composition with a design interview

The [accepted S-00W design](../specs/S-00W-concept-grilling-and-notepad-composition/SPEC.md) keeps storage mechanics in `notepad`. [Grilling](skill-grilling.md) owns the interview and composes this primitive when the session needs saved context. [Grill-me](skill-grill-me.md) is the planned entry that composes both by default; its delivery belongs to S-00Z. The composing skill owns the question map and statuses. The notepad keeps pending, corrected and confirmed meaning readable, so an interrupted interview resumes at the pending confirmation rather than at the next question.

## Verified behavior and limits

**Verified 2026-09-24:** the runtime behaviors above are covered by `tools/test-notepads.mjs`. That includes a characterization of the pending → correction → decision sequence, which passed without any runtime change. `tools/test-skill-catalog.mjs` holds the source wording for the pending convention and the corrected-resume recheck. One fresh-context agent, given only the skill source, followed both in the three-turn scenario above. The turn-by-turn record is in the [Spec evidence](../specs/S-00Y-notepad-skill-rebuild/SPEC.md#append-only-evidence-and-execution-log).

**Limits:** that was one run with one model, against a scripted owner. It is not owner Human QA and not a repeated trial. In that run the agent read all entries instead of one topic; both routes return the correction with its original. Two writers that read the same revision can still both write, as the still-proposed ADR-000L (open PR #92) records; this Spec does not change that. Installed personal copies of the skill are not updated by this source change. The composed grilling, notepad and grill-me journey is checked by [S-00W](../specs/S-00W-concept-grilling-and-notepad-composition/SPEC.md) after all three skills are delivered.

## Sources

- [Notepad source](../skills/notepad/SKILL.md) and [runtime](../tools/notepads.mjs)
- [Individual delivery Spec](../specs/S-00Y-notepad-skill-rebuild/SPEC.md)
- [Concept and acceptance](../specs/S-00W-concept-grilling-and-notepad-composition/SPEC.md)
- [Runtime foundation: S-046](../specs/S-046-json-notepad-foundation/SPEC.md) and [ADR-0040](../docs/adr/0040-json-notepads-preserve-objective-continuity.md)
- [Runbook behavior selection](../../RUNBOOK.md#behavior-selection)
- [Wiki router](MEMORY.md)

## History

- 2026-09-23: Created as the individual skill article; current continuity behavior separated from the planned grilling composition.
- 2026-09-24: Source links reconciled to the managed skills lane; S-00Y owns this skill's future delivery. No behavior change claimed.
- 2026-09-24: S-00Y TK-00P stated the pending-versus-confirmed convention and the corrected-resume recheck in the source, and recorded one fresh-context scenario.
