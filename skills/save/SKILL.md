---
name: save
description: Persist already-authorized Workbench work in its existing owner, preserving unresolved local context and verifying the recovery boundary actually reached. Invoke explicitly or compose within an authorized workflow; an incidental mention is not invocation.
---

# Save

Save completed work and the context needed to continue it. This skill adds no
authority, authoring assignment, implementation loop or publication permission.
Read the current Contract and `workbench/manifest.json`; resolve scope and
owners before writing. Governance Planes classify a claim's use in this
operation, never its file type or storage location.

1. Inventory only the work already authorized. Use `notepad` for meaningful
   unresolved context, corrections and the next executable action; update the
   current view with the revision just read. Live records remain in the
   manifest-declared ignored collections. Never add them to project Git.
2. Route supported durable truth through `to-docs` to the existing owner.
   When selected notepad material needs promotion, compose `promote` within
   the same authorization. Do not create an owner, decision or assignment
   merely to have something to save. An ADR in `workbench/docs/adr/` retains
   rationale; its `canonicalized_in` control owns the binding rule.
3. Check the actual changes and run their owning verification. Append named
   proof and remaining limitations to the assigned spec without rewriting
   earlier evidence. If spec state changed, render its Taskboard. Do not
   classify a generated view as a second authoring source.
4. Follow the project's Git policy for authorized tracked changes: inspect
   the diff, stage only the named files, commit on the allowed task branch,
   and push when that recovery boundary is authorized. Verify the remote
   branch resolves to the intended commit. A failed or unavailable push is
   pending recovery, never confirmation. A save does not waive independent
   integration review, merge a pending review, or authorize main publication.
5. Keep local context independent of optional private-session transport.
   If configured and within scope, use its documented save/sync procedure;
   report its explicit acknowledgment separately from project Git. Local
   bytes alone never prove remote or cross-device recovery. Transport does
   not move unpushed code or running processes.

If nothing changed, say so. On completion name the owners and actual local or
remote recovery points, the checks run, any pending boundary and next action.
Do not make an ordinary local save wait for optional network access. Never
copy raw working context into a tracked checkpoint. Preserve existing frozen
checkpoints and unresolved/correction/handoff dependencies; cleanup composes
`notepad` only after verified reconciliation.
