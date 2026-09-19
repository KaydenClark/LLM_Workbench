---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed one-article-per-Spec migration, 2026-09-19
source_paths:
  - workbench/specs/S-026-workflow-composition-and-cold-resume/SPEC.md
  - workbench/tools/sessions.mjs
  - workbench/tools/notepads.mjs
  - tools/test-workbench-round-trip.mjs
  - tools/test-sessions.mjs
  - tools/test-direct-promotion.mjs
  - skills/make-it-so/SKILL.md
  - skills/promote/SKILL.md
  - RUNBOOK.md
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# Workflow Composition And Cold Continuation (S-026)

A composed workflow carries planning into implementation without depending on the original chat. Controls, the assigned Spec and Tasks, linked knowledge, named verification and a recoverable Git commit provide the continuation route. Skills resolve support paths through the manifest rather than importing private directory assumptions.

The deterministic round-trip fixture generates a project, records and pushes planning state, interrupts the run and resumes from a fresh clone using repository evidence. It tests files, commands and recoverability together. It is provider-free: it does not prove actual cross-agent or cross-device comprehension.

S-026 originally copied privacy-checked notes into tracked checkpoints. That mechanism is historical. sessions.mjs now refuses new copies; promote reconciles selected supported claims into existing durable owners after validation, while live JSON notepads retain unresolved context. A Git planning commit called a checkpoint in test prose does not revive the retired note-copy command.

Feedback has its manifest lane; RUNBOOK owns the operational route. Optional private transport and configured-host capabilities require their own actual proof. The original real cross-provider follow-up belonged to S-022; later private/cross-device proof belongs separately to S-052. Neither reference asserts current completion.

Privacy and structural checks fail visibly, but cannot certify semantic fidelity, permission or reliability by themselves. The durable knowledge is the continuation model and tested mechanical seams; current assignments and approvals remain with work owners. Schedulers and Foundry coordination are not prerequisites.

## Evidence and Sources

Historical source: `git show 8035b41831985581e41ca713e87c2511d3dbbcc4:workbench/specs/S-026-workflow-composition-and-cold-resume/SPEC.md`.
The original acceptance and evidence retain their time and scope. Current source
inspection for this article used that same commit; links below route a fresh
verification, rather than asserting every historical behavior remains current.

- [workbench/tools/sessions.mjs](../../tools/sessions.mjs)
- [workbench/tools/notepads.mjs](../../tools/notepads.mjs)
- [tools/test-workbench-round-trip.mjs](../../../tools/test-workbench-round-trip.mjs)
- [tools/test-sessions.mjs](../../../tools/test-sessions.mjs)
- [tools/test-direct-promotion.mjs](../../../tools/test-direct-promotion.mjs)
- [skills/make-it-so/SKILL.md](../../../skills/make-it-so/SKILL.md)
- [skills/promote/SKILL.md](../../../skills/promote/SKILL.md)
- [RUNBOOK.md](../../../RUNBOOK.md)

## History

- 2026-09-19: Created on explicit owner direction for one article per legacy Spec. Preserved useful knowledge and historical limits; no source record retired or discarded.
