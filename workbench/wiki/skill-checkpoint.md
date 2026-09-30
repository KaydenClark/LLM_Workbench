---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - S-048 checkpoint retirement, completed 2026-09-09
  - S-01E TK-00V source audit and fresh-context scenario, 2026-09-26
source_paths:
  - workbench/skills/checkpoint/SKILL.md
  - workbench/tools/sessions.mjs
  - workbench/specs/S-01E-checkpoint-skill-rebuild/SPEC.md
  - workbench/specs/S-048-checkpoint-retirement/SPEC.md
  - workbench/specs/S-048-checkpoint-retirement/checkpoint-inventory.json
  - tools/test-sessions.mjs
  - tools/test-skill-catalog.mjs
  - RUNBOOK.md
last_verified: 2026-09-26
---

# Checkpoint: route a retired request to current continuity

`checkpoint` is a compatibility entry. The Workbench no longer copies session records into a tracked checkpoint, but older catalogs and habits still produce the request "checkpoint this session". The entry exists so that request gets routed correctly: unsettled working context goes to a local notepad, and settled claims go to their durable owner through promotion. It creates nothing itself and grants no scope.

**Inputs:** a legacy checkpoint or save-for-later request, and whatever the current session knows. **Output:** normally one local, git-ignored JSON note (through [notepad](skill-notepad.md)). Sometimes the output is an authorized promotion of selected claims into a named owner. The output is never a new file in `workbench/sessions/checkpoints/`. **Done when:** a fresh reader can resume from the note or the durable owner, every frozen checkpoint still has its original bytes, and the user has been told the save is local and does not follow them to another device.

## How it works

The [skill](../skills/checkpoint/SKILL.md) tells the agent to read the manifest and the Runbook. It then chooses one of two current routes:

- **Save for later → notepad.** The current state, unresolved items and next action go into a local note. On resume, the agent checks current controls and source before relying on it. Raw notes and handoffs are never committed, and a local save is never described as cross-device recovery.
- **Make it durable → promote.** When the user has authorized a claim to become durable, `sessions.mjs promote` writes it into its owning Spec, ADR, Wiki note or control. The write goes through privacy checks, owner validation and byte read-back ([Direct Owner Promotion](../../RUNBOOK.md#direct-owner-promotion)). `/make-it-so` may compose that step when the user authorizes execution.

The files already in `workbench/sessions/checkpoints/` are frozen history. The citations that point at them stay valid. They are not edited, even to mark one PAUSED. The old command `node workbench/tools/sessions.mjs checkpoint` still accepts its old arguments, then returns a nonzero refusal that names both routes and writes nothing. Operational recovery receipts live in the separate, ignored `sessions/recovery/` collection ([Frozen Checkpoint History And Operational Recovery](../../RUNBOOK.md#frozen-checkpoint-history-and-operational-recovery)).

### Example, from the verification run

In the S-01E scenario, a scratch room held one frozen record from an earlier investigation, `billing-export-2026-08-30.md`. The session being carried had two findings about duplicate invoice rows in a nightly export, one of them an unconfirmed hypothesis. It also had one user decision (keep the column order), one open question and one next action. The user said "checkpoint this session". The agent, given only this skill, recorded the frozen file's hash and created one note in `workbench/sessions/notepads/work/`. It appended the two findings (the hypothesis labeled unconfirmed), the decision and the user's keep-it-local instruction, then validated the note at revision 5. It did not run the retired command or promote anything, because nothing was settled or authorized to become durable. It told the user that checkpoint copies are no longer used, that the save is local and git-ignored and won't follow them to another device, and that it would re-check the code before continuing. Afterward, every file under `workbench/sessions/` hashed the same as before, apart from the one new ignored note. Running the retired command in the same room afterward exited 1 and changed nothing.

## Composition

`checkpoint` routes; it does not store. [Notepad](skill-notepad.md) owns local continuity, and the `promote` skill with `sessions.mjs promote` owns durable reconciliation. The `save` skill is the core route for persisting already-authorized work in its owner. `/make-it-so` composes promotion only on the user's explicit direction. A requested handoff is a separate Markdown file written with the `handoff` skill. It is not a checkpoint and not a JSON note.

## Upstream relationship

`checkpoint` is Workbench-native: `THIRD_PARTY_NOTICES.md` lists no external source for it. It began in PR #35 (`bc2b419`, 2026-07-17) as "commit a resumable notepad". S-048 retired copying in `31a9d89` (2026-09-08), and the file moved unchanged into the skills lane in `4b6d05c`. The source audited here is git blob `1e297ce2abde3672d1efc56490974bbed9d2a884` at `4b6d05c`. S-01E made no source change. [ADR-0054](../docs/adr/0054-direct-promotion-into-durable-owners.md) partially supersedes [ADR-0028](../docs/adr/0028-live-session-records-stay-untracked-and-checkpoints-are-durable.md), where the checkpoint was the only durable destination.

## Verified behavior and limits

**Verified 2026-09-26:** `tools/test-sessions.mjs` checks that the retired command refuses through both the function and the CLI, and that it leaves the source note, a frozen record and the checkpoint directory listing unchanged. It also checks that the six retained files in the repository (five records and `.gitkeep`) still match their S-048 inventory sizes and hashes. `tools/test-skill-catalog.mjs` holds the retirement and no-write wording. One fresh-context agent followed the notepad route in the scenario above. The run is recorded in the [Spec evidence](../specs/S-01E-checkpoint-skill-rebuild/SPEC.md#append-only-evidence-and-execution-log).

**Limits:** that was one run with one model, a scripted user, and a room with no Runbook and no copy of the `notepad` skill. The agent drove `notepads.mjs` directly, so the skill's "read the Runbook" step was not exercised. The scripted user declined promotion, so the promote route was not exercised in that run. This is not owner Human QA and not a repeated trial. Two runtime details are imprecise but do not break the accepted behavior. The refusal carries the shared `invalid-note` finding code rather than a code specific to retirement. The `sessions.mjs` usage line still lists the old `checkpoint --from … --topic …` form without marking it retired. Installed personal copies of the skill are not changed by this Spec.

## Sources

- [Checkpoint source](../skills/checkpoint/SKILL.md) and [runtime](../tools/sessions.mjs)
- [Individual delivery Spec](../specs/S-01E-checkpoint-skill-rebuild/SPEC.md)
- [Retirement Spec S-048](../specs/S-048-checkpoint-retirement/SPEC.md), its [disposition](../specs/S-048-checkpoint-retirement/checkpoint-disposition.md) and [inventory](../specs/S-048-checkpoint-retirement/checkpoint-inventory.json)
- [Runbook: Frozen Checkpoint History](../../RUNBOOK.md#frozen-checkpoint-history-and-operational-recovery) and [Direct Owner Promotion](../../RUNBOOK.md#direct-owner-promotion)
- [Lexicon: Checkpoint](../../LEXICON.md#governance-core)
- [Wiki router](MEMORY.md)

## History

- 2026-09-26: Created by S-01E TK-00V after a source audit found no defect, with one fresh-context scenario.
