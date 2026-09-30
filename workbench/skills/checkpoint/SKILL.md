---
name: checkpoint
description: Explain the retired checkpoint-copy workflow and route an explicit legacy request to scoped local notepad continuity or direct owner promotion.
---

Checkpoint copying is retired. This compatibility entry remains readable for
older installed catalogs; it creates no checkpoint and grants no new scope.
Read `workbench/manifest.json` and the current Runbook. Existing records in
`workbench/sessions/checkpoints/` remain frozen with their citations intact.

For an authorized save-for-later request, use the core `notepad` workflow to
retain current state, unresolved material and the next action locally. On resume,
verify current controls and source state before continuing. Do not copy a raw
note or handoff into Git, assert cross-device recovery from a local save, or
modify a historical record merely to mark it PAUSED.

New durable claims use `sessions.mjs promote` under existing authorization with
privacy, owner validation and byte read-back. `/make-it-so` may compose that
work when the user authorizes execution. The old command
`node workbench/tools/sessions.mjs checkpoint` returns a nonzero explanatory
refusal and writes nothing. Operational recovery is a separate collection.
