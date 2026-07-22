---
name: resolving-merge-conflicts
description: Reconstruct both change intents, preserve compatible behavior, and verify a safe merge result.
---

# Resolving Merge Conflicts

Read both sides and their surrounding tests before editing. State each intent,
identify overlap, and preserve compatible behavior rather than choosing by
line order. Escalate only when the conflict represents an unresolved product
choice.

Run focused tests, the relevant project checks, and inspect the final diff.
Record a consequential decision in the owning spec; otherwise leave the merge
history and tests as the evidence.
