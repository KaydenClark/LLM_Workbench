---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - S-01B TK-00S source change and fresh-context scenario, 2026-09-26
source_paths:
  - workbench/skills/promote/SKILL.md
  - workbench/tools/sessions.mjs
  - workbench/specs/S-01B-promote-skill-rebuild/SPEC.md
  - tools/test-direct-promotion.mjs
  - tools/test-skill-catalog.mjs
  - tools/test-core-composition.mjs
  - RUNBOOK.md
last_verified: 2026-09-26
---

# Promote: move settled working claims into their durable owners

Use `promote` when a working note holds claims that are already settled and authorized, and they belong in a durable owner: a Spec, a root control, an ADR, the Wiki or a docs/feedback page. Invoke it by name, or compose it from `grilling`, `save` or `make-it-so`. A passing mention does not invoke it. Promotion moves agreed text and nothing more. It grants no authority, starts no implementation and does not decide anything for the owner.

**Inputs:** a named source note, the exact entries selected, and an existing owner to write into. **Output:** the owner rewritten with the distilled claim, a hash-checked read-back, and the note updated append-only to name where the claim went. Unresolved material stays in the note. **Done when:** the owner's bytes match the authored draft, its normal checks pass, the note names the destination and still holds everything unsettled, and `save` has reported the actual recovery boundary.

## How it works

The [skill](../skills/promote/SKILL.md) owns the judgment. The [direct owner promotion command](../../RUNBOOK.md#direct-owner-promotion) in the [shared runtime](../tools/sessions.mjs) owns the checked write.

- **Only confirmed claims move.** The agent reads the note's current view, the selected entries and all their corrections and dependencies. It keeps open, tentative, withdrawn and superseded status as recorded. Pending meaning is read the way [notepad](skill-notepad.md) records it. A `source_record` whose readback is still listed in `current.unresolved` is pending, however settled it sounds. Only a `decision` entry records a confirmed owner answer. A mixed note promotes its confirmed claims and leaves the rest.
- **One owner per claim.** `to-docs` picks exactly one durable owner for each accepted claim. When another owner needs the claim, it links to that owner instead of holding a second copy.
- **A draft inside the project, out of Git.** The agent writes the complete proposed owner bytes to a draft. The command refuses a draft outside the project, and a tracked path would dirty the tree, so the draft goes in an ignored path such as `workbench/sessions/recovery/`. The draft is disposable text, not a note or evidence. The agent never copies the note wholesale, and never cites an ignored note as durable proof.
- **A checked write.** `sessions.mjs promote` checks the source revision and the destination's SHA-256. It carries corrections and dependencies of the selected entries as context. It refuses private content and citations of ignored live records, validates the owner's structure, writes, and reads the bytes back. It never commits, never rewrites the source, and never cleans up. Tool success proves structure and bytes, not semantic fidelity.
- **The note keeps what is unsettled.** The agent appends a record naming the destination. Each pending entry and its `current.unresolved` item stay in place, because promotion does not confirm them. `notepad` trim runs only for material that has landed and that nothing retained still needs.

### Example, from the verification run

In the S-01B scenario, a note about nightly reports held two questions. On naming, the owner's first answer was read back as `ROOM-YYYY-MM-DD.md`. The owner corrected it to date-first, and a `decision` recorded the confirmed name. On retention, the owner had said "a month or so, I have not really thought about it". That was saved as a `source_record` with a 30-day readback, still listed in `current.unresolved`. The owner said: "put what we settled about nightly reports into the RUNBOOK Reports section."

The fresh agent selected the naming decision and its correction, and the command brought the first readback along as context. The agent wrote the draft in `workbench/sessions/recovery/`, promoted it, verified the new hash and read the bytes back. The Runbook gained only the corrected, date-first naming rule. Retention stayed out. The agent appended a `verification` entry naming `RUNBOOK.md` and both hashes, and left the retention entry and its unresolved item untouched. It deleted the draft and asked the owner to confirm or correct the retention readback.

## Composition

`grilling` hands settled decisions to `promote` through its promote exit. `make-it-so` composes it before any implementation it is authorized for. `promote` then composes `save`, passing along the already-promoted result so `save` does not promote it again. [Notepad](skill-notepad.md) supplies the pending, correction and decision conventions that selection relies on.

## Verified behavior and limits

**Verified 2026-09-26:**
- `tools/test-direct-promotion.mjs` covers the command's checks and recovery paths. It now includes a characterization of a mixed note: promoting a `decision` does not carry an unrelated pending `source_record` as context, and the note stays byte for byte, including `current.unresolved`. That characterization passed without any runtime change.
- `tools/test-skill-catalog.mjs` pins the source wording: pending recognition, one owner per claim, the ignored in-project draft, and leaving the pending item in place.
- `tools/test-core-composition.mjs` exercises the command from an installed room.
- One fresh-context agent, given only the skill source, did the scenario above. The run record is in the [Spec evidence](../specs/S-01B-promote-skill-rebuild/SPEC.md#append-only-evidence-and-execution-log).

**Limits:** that was one run with one model, against an owner scripted by the implementing agent. It is not owner Human QA and not a repeated trial.

A second scripted turn gave a revised retention answer together with a request to add it to the Runbook. The agent recorded a correction and a `decision` in the same turn, without a separate readback. The host's permission layer then refused the promotion, because the owner's words had been relayed by another agent. So the second promotion was not observed, and whether a revised answer plus an instruction counts as confirmation is still for owner review.

The command's hash and revision checks are sequential guards, not locks. Installed personal copies of the skill are not updated by this source change.

## Sources

- [Promote source](../skills/promote/SKILL.md) and [runtime](../tools/sessions.mjs)
- [Direct owner promotion procedure](../../RUNBOOK.md#direct-owner-promotion)
- [Individual delivery Spec](../specs/S-01B-promote-skill-rebuild/SPEC.md)
- [Checkpoint retirement and direct promotion: S-048](../specs/S-048-checkpoint-retirement/SPEC.md)
- [Notepad article](skill-notepad.md)
- [Wiki router](MEMORY.md)

## History

- 2026-09-26: Created by S-01B TK-00S. The source now states pending recognition, one owner per claim, the ignored in-project draft and the retained pending item. One fresh-context scenario was recorded.
