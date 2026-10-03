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

## Frozen history and operational recovery

Existing privacy-checked checkpoints and their citations are frozen history.
The legacy `sessions.mjs checkpoint` command refuses new copies without writing.
Reconcile selected claims into their durable owners with `sessions.mjs promote`;
retain local notes for unresolved context. Operational receipts and backups live
in the separate ignored `sessions/recovery/` collection, outside note discovery.
A preserved historical copy is not blanket promotion of its claims.

Existing `sessions/checkpoints/` files and citations remain unchanged.
The legacy `sessions.mjs checkpoint` command refuses new copies. New selected
claims follow direct owner promotion in the `promote` skill. Operational receipts and backups
use the ignored `sessions/recovery/` collection declared by the manifest;
notepad discovery excludes it. Preserve old recovery references, and restore
from the recorded Git SHA or explicit backup with byte read-back before claiming
recovery. Do not treat local operational recovery as durable provenance.

Existing files in `workbench/sessions/checkpoints/` retain their bytes and
citations. `sessions.mjs checkpoint` is retired and returns a nonzero refusal
without creating a copy. Use the direct owner promotion procedure in the
[`promote` skill](../promote/SKILL.md#command-reference) for
selected durable claims; local notes preserve unresolved continuation context.

New adoption and upgrade recovery receipts and legacy-skill backups use the
ignored `workbench/sessions/recovery/` collection. These operational records are
not notes or durable provenance. Old recovery receipts remain at their original
paths; rollback uses the explicit recorded Git SHA or backup, not an assumed
latest filename. Preserve receipts and backups until verified recovery or their
owning operation establishes that they are no longer needed.

For a restoration rehearsal, preserve the changed target, restore the tracked
project from the receipt's pre-migration SHA, and compare every original tracked
file and Git state. Restore a changed managed skill from its recorded backup
and read back its bytes. A fixture pass alone does not establish a downstream
release, native provider callability, or crash recovery.

```bash
node workbench/tools/sessions.mjs scan --file PATH
```
