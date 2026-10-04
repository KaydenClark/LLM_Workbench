---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - S-004C TK-005J moved the Runbook procedures for the operations every room runs on its installed runtime tools into this new core skill, 2026-10-04
source_paths:
  - workbench/skills/workbench-runtime/SKILL.md
  - workbench/tools/workbench-layout.mjs
  - workbench/tools/diagnostics.mjs
  - tools/test-skill-catalog.mjs
  - tools/test-runbook-index.mjs
  - RUNBOOK.md
  - templates/RUNBOOK.md
last_verified: 2026-10-04
---

# Workbench runtime: read what the installed tools report and repair what they name

`workbench-runtime` is the core skill a room loads when it works with its own installed Workbench runtime tools rather than with a Spec or a document. Each of its sections is one operation's procedure, and the room's [Runbook operations index](../../RUNBOOK.md#operations-index) points to that section, which makes the skill bind for the operation:

- **Read a diagnostic and its blocking effect.** Every finding is registered with a severity, a scope and an effect; the consuming command, not the record, decides what it blocks. The table of effects, the `doctor` output grouping, the skills-lane and Git-scope findings, `permission-scope-drift` and the claim-age rule are in [Diagnostics And Blocking Effects](../skills/workbench-runtime/SKILL.md#diagnostics-and-blocking-effects).
- **Validate the Wiki** and repair a note's missing properties ([Wiki Validation](../skills/workbench-runtime/SKILL.md#wiki-validation)).
- **Repair installed state** the harness wrote, seeded lane documents and source provenance ([Installed State The Harness Wrote](../skills/workbench-runtime/SKILL.md#installed-state-the-harness-wrote)).
- **Allocate or widen a visible identifier** ([Visible Identifiers](../skills/workbench-runtime/SKILL.md#visible-identifiers)).
- **Keep the connection identity**, the manifest's `workbenchId` ([Workbench Connection Identity](../skills/workbench-runtime/SKILL.md#workbench-connection-identity)).
- **Check a configured host** for what it can actually do ([Configured-Host Capability Checks](../skills/workbench-runtime/SKILL.md#configured-host-capability-checks)).
- **Add a room-local skill** to the skills lane ([Room-Local Skills](../skills/workbench-runtime/SKILL.md#room-local-skills)).

Decision records are not here: writing, accepting, superseding and reading them is part of [to-docs](skill-to-docs.md), which already routes a decision to its record. The Landmark Tracker's accepted design is in [notepad](skill-notepad.md), and generic recovery and rollback is in [implement](skill-implement.md).

## Why it is a core skill

A Spec rule for the Contract carrier rewrite sends a moved procedure to an existing skill whose job matches, and adds a new core skill only for an operation family every room runs. These operations ran in every room's Runbook but no existing skill did their job, so they share one skill rather than one per section. Adding it grew the closed core bundle from 26 to 27 skills (nineteen workflow skills, four coordination skills and four stances): the layout catalog, the manifest's required list, the skills catalog and every count statement changed together, and a room receives the skill, with its receipt hash, when its lane is installed or updated.

## Verified behavior and limits

The move is relocation: the procedures are the Runbook's text, re-rooted links aside, with the template's generic additions merged in. One stale paragraph was not carried over: the Runbook said `wiki.mjs validate` emitted the installed-state findings as an interim routing, while its own Wiki Validation section, the Wiki schema and `wiki.mjs` say `doctor` emits them; the skill states the latter. `tools/test-runbook-index.mjs` checks each index row, its pointer and the moved text, and `tools/test-skill-catalog.mjs` pins the skill's place in the bundle, its sections and its portability. No fresh-context scenario has run the skill yet.

## Sources

- [Workbench runtime source](../skills/workbench-runtime/SKILL.md)
- [Contract carrier rewrite Spec](../specs/S-004C-contract-carrier-pointer-brief-rewrite/SPEC.md)
- [Core skill catalog](../skills/README.md)
- [Wiki router](MEMORY.md)

## History

- 2026-10-04: Created by the Contract Carrier Pointer-Brief Rewrite (S-004C), Task TK-005J (operations every room runs), when the room-operations procedures moved out of the Runbook.
