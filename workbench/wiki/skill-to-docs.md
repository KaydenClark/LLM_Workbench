---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - S-01J planning packet, 2026-09-24
  - S-01J TK-01A source change and fresh-context scenario, 2026-09-26
source_paths:
  - workbench/skills/to-docs/SKILL.md
  - workbench/specs/S-01J-to-docs-skill-rebuild/SPEC.md
  - tools/test-skill-catalog.mjs
  - tools/test-wiki.mjs
  - AGENTS.md
  - RUNBOOK.md
last_verified: 2026-09-26
---

# To-docs: route settled truth to the owner that holds it

Use `to-docs` when a conversation or piece of work has already settled something that should outlive it: a procedure step, a definition, a requirement, a decision, an explanation. It writes each supported claim into the existing owner for that kind of truth, and nowhere else. It does not reopen the discussion, start an interview or create a new document or tracker. When nothing durable changed, it says so in exactly those words: `Docs checked; no update needed`, with the reason.

**Inputs:** settled claims from the current conversation or a working note, the project's manifest and its existing owners. **Output:** the smallest edits to those owners, each claim written once, with links from any other owner that needs it. Pending material stays in its note. **Done when:** each changed owner has been read back and holds each claim once, in the place its job belongs, and the owners' own checks have run (Wiki validation, plus `render` and `doctor` for a Spec change). Otherwise the report says exactly `Docs checked; no update needed` and why.

## How it works

The [skill](../skills/to-docs/SKILL.md) owns the judgment. The [ownership table in AGENTS](../../AGENTS.md#documentation-ownership-and-proof) and the [Lexicon ownership schema](../../LEXICON.md#artifact-ownership-schema) define which owner holds which kind of truth.

- **Destinations first.** The agent reads `workbench/manifest.json` and states where each claim will go before it edits anything. Definitions go to the Lexicon, product direction to the Blueprint, requirements and proof to the assigned Spec, commands and recovery to the Runbook, agent rules to AGENTS, decision rationale to an ADR, and explanations or durable knowledge to the Wiki. If capability truth needs a Spec and none is assigned, it routes to `to-spec` instead of improvising one.
- **Each claim once.** A mixed finding is split into its claims, and each claim goes to exactly one owner. When another owner needs it, that owner links to it. A Wiki reference article explains why and links the procedure. It does not restate the procedure's steps.
- **Only supported claims.** Pending meaning is read the way [notepad](skill-notepad.md) records it. A `source_record` whose readback is still listed in `current.unresolved` is pending, however settled it sounds. Only a `decision` entry records a confirmed owner answer. Pending, tentative or disputed material stays in its live note.
- **Durable evidence only.** Evidence cites durable owners and exact commits. It never cites an ignored live path such as a note, handoff or recovery file. Spec state changes at meaningful transitions, and evidence rows are appended. Conversation, working notes and superseded interim states do not become permanent Spec history.
- **Read back, then check.** The agent reads each changed owner back and confirms each claim appears once. It then runs the owners' checks: `node workbench/tools/wiki.mjs validate` for the Wiki, and `render` plus `doctor` for a Spec change.

### Example, from the verification run

In the S-01J scenario, a small scratch project had a Runbook restore procedure, a Wiki article about backups and a working note on a failed restore. The note held three entries. A finding said the restore tool extracts the whole archive to a temporary folder on the target disk, and that a restore failed because the disk had only 1.4 times the archive's size free. A `decision` confirmed a new step: check free space and require twice the uncompressed size before restoring. A pending `source_record`, still listed in `current.unresolved`, said the owner might want three restore points instead of two. The owner said: "The restore investigation is settled. Put what we found into the docs."

The fresh agent stated its destinations before editing. The confirmed free-space step, with its commands and threshold, went into the Runbook restore procedure as a new step 3. The explanation of the temporary extraction and the failed restore went into the Wiki article as a new section. That section links to the Runbook step for the threshold and commands instead of repeating them. The Runbook step links back to the explanation. The agent left the three-restore-points idea out of every owner and kept it in the note, and it did not cite the note as evidence. It then searched the tracked docs to confirm each fact appeared in one owner only. The Wiki check command did not exist in the scratch project, so it reported that check as not run rather than passed.

## Composition

[Promote](../skills/promote/SKILL.md) uses `to-docs` to choose exactly one durable owner for each accepted claim before its checked write. [Save](../skills/save/SKILL.md) routes supported durable truth through it. `make-it-so`, `carry`, Builder and Reconciler call it for changed truth. The [Runbook behavior table](../../RUNBOOK.md#behavior-selection) lists it with `promote` and `save` for reconciling agreed claims, without any implied implementation.

## Verified behavior and limits

**Verified 2026-09-26:**
- `tools/test-skill-catalog.mjs` pins the routing list, the render and doctor finish, and the rule against restarting discovery or adding stores. It now also pins the S-01J contract: route each claim once, split a mixed finding, link rather than copy, recognize pending meaning, never cite an ignored live path, keep transient history out of the Spec, and read each changed owner back.
- `tools/test-wiki.mjs` covers the runtime side of "never a copied live queue". `wiki.mjs validate` reports a note that copies task rows or Spec evidence as `copied-task-state`. That test was unchanged and green; to-docs needed no runtime change.
- One fresh-context agent, given only the skill source, did the scenario above. The run record is in the [Spec evidence](../specs/S-01J-to-docs-skill-rebuild/SPEC.md#append-only-evidence-and-execution-log).

**Limits:** that was one run with one model and one scripted owner turn. It is not owner Human QA and not a repeated trial. The scenario project had no Spec, ADR or Wiki validator, so those routes were not exercised. The agent did not append a record to the note naming where the claims went. The to-docs source does not ask for that; `promote` does when it performs the write. Wording checks prove the source says the right thing, not that every agent will follow it. Installed personal copies of the skill are not updated by this source change.

## Sources

- [To-docs source](../skills/to-docs/SKILL.md)
- [Individual delivery Spec](../specs/S-01J-to-docs-skill-rebuild/SPEC.md)
- [Documentation ownership in AGENTS](../../AGENTS.md#documentation-ownership-and-proof)
- [Wiki schema](SCHEMA.md)
- [Notepad article](skill-notepad.md)
- [Wiki router](MEMORY.md)

## History

- 2026-09-26: Created by S-01J TK-01A. The source now states once-per-claim routing for a mixed finding, link-not-copy, pending recognition, durable-only evidence and owner read-back. One fresh-context scenario was recorded.
