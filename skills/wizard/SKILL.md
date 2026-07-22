---
name: wizard
description: Build a human-guided procedure for repeatable setup or migration work that cannot safely be fully automated.
---

# Wizard

Scope the procedure, required authority, inputs, checkpoints, and recovery
steps. Write one stage at a time with a visible success criterion and a safe
response when it fails. Keep human decisions explicit; automate only
deterministic, reversible mechanics.

Dry-run the procedure against a representative environment and document its
operation and recovery in `RUNBOOK.md`. Record a durable product decision in
the owning spec when the wizard changes capability scope.
