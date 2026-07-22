---
name: setup-pre-commit
description: Add lightweight project-appropriate commit-time checks with an explicit recovery path.
---

# Setup Pre-Commit

Read the project controls and existing package, formatting, and verification
commands. Add only fast deterministic checks that the project already supports
or clearly requires. Preserve the chosen toolchain, document how to run and
repair checks manually, and avoid network or destructive work during commit.

Prove the hook runs on a representative change and that bypassing it remains a
visible, intentional exception. Update `RUNBOOK.md` when operation changes.
