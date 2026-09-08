---
name: promote
description: Reconcile selected supported Workbench working material into its authorized durable owner, verify read-back, and preserve unresolved context. Invoke explicitly or compose within an already-authorized workflow; promotion does not authorize implementation.
---

# Promote

Promote only selected material whose authority and evidence already exist.
This primitive works with grilling decisions or other objective notepads;
`make-it-so` can compose it before implementation. It does not start an
interview, implement tickets, grant permission or infer invocation from a
passing mention. Read the Contract, manifest and assigned owner first.

1. Resolve the named source and exact selection. Read its compact current
   view, selected entries and all corrections/dependencies using `notepad`.
   Follow pagination and inspect related rulings that could supersede it.
   A locked label is neither proof nor authority. Preserve open, tentative,
   withdrawn and superseded status; promote only the supported current claim
   under existing authorization. If ordering is unclear, preserve the source
   and report the ambiguity rather than choose a convenient interpretation.
2. Use `to-docs` to choose the existing durable owner. Requirements and proof
   belong to the assigned spec, operating rules to their owning control,
   durable knowledge to the manifest Wiki. Decision rationale belongs in
   `workbench/docs/adr/`, with the current rule in its `canonicalized_in`
   control. Create a needed owner only through its authorized normal workflow.
   File type and location do not assign a Governance Plane or grant scope.
3. Author a separate, ignored Markdown draft inside the project containing
   the complete proposed owner bytes. Distill the supported result faithfully;
   never copy the notepad wholesale or cite an ignored note as durable proof.
   Preserve existing unrelated owner content, source anchors and append-only
   evidence. Read the destination bytes and compute their SHA-256.
4. Use the project's installed public seam, with the source revision just read:

```bash
node workbench/tools/sessions.mjs promote --from NOTE --revision N \
  --entries finding-001,correction-001 --to OWNER.md --expected SHA256 \
  --content AUTHORED_DRAFT.md
```

The Runbook owns flags, privacy/path checks, owner validation and recovery.
The command returns the expanded selection and hashes; verify actual owner
read-back and run its normal checks. Tool success does not prove semantic
fidelity. A blocked, partial or recovery-residue result preserves the source;
inspect the named recovery material before any retry or cleanup. One writer
per note and owner is required; revision/hash checks are not concurrent locks.

5. Record the result in the proper owner and update the note append-only,
   naming the durable destination. Keep unresolved work and correction or
   transfer dependencies. Use the `notepad` trim/delete public seam only once
   that material is reconciled and no retained context still needs it. Existing
   frozen checkpoints remain unchanged; no routine archive or copy is created.
6. Compose `save` for the achieved changes under the same scope. Pass the
   already-promoted result so save does not promote it again. Report the
   destination, verified selection and hashes, checks, remaining source context
   and actual recovery boundary. Stop after promotion/persistence unless the
   caller already authorized further work.
