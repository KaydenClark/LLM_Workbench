---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
source_paths:
  - workbench/specs/S-009-git-write-constrained-adoption/SPEC.md
  - templates/ADOPTION.md
  - README.md
  - tools/test-adoption-git-write-fallback.mjs
  - AGENTS.md
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# Adoption When Git Writes Are Unavailable

A host can allow ordinary document edits while refusing branch, stash or
commit writes in Git metadata. Adoption must distinguish that capability
limit from a safe, completed migration.

The public README and generic Adoption protocol require a visible blocker
instead of forcing the failed Git operation or inventing proof. Work may
continue only as permitted, reversible document changes and verification;
branch operations are handed to the owner. The clean-tree baseline is not
waived. A modified checkout without a recoverable commit is not silently
reported as delivered.

This fallback keeps useful work possible without confusing filesystem access
with Git authority. The record should say which operation failed, what
reversible work was actually performed, what checks ran, and which Git step
still needs a capable actor. It is not a workaround for arbitrary repository
corruption, unsafe permissions or unrelated filesystem failures.

S-009 originated from sanitized downstream feedback. Its document-contract
regression checks the generic protocol and public guidance together, avoiding
project-specific paths in the shipped template. It establishes consistent
instructions, not repeated evidence that an agent handles every constrained
host. The related provenance capability in S-012 explains how an eventual
completed adoption becomes independently reproducible.

## Evidence and Sources

- [Historical S-009 record](../../specs/S-009-git-write-constrained-adoption/SPEC.md). Original decisions, evidence and limitations remain preserved.
- [Immutable source and proof at `bc370fe`](https://github.com/KaydenClark/LLM_Workbench/blob/bc370fe742d5ddb8348bf361fccea31205f6cee7/workbench/specs/S-009-git-write-constrained-adoption/SPEC.md). Recover the original with `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-009-git-write-constrained-adoption/SPEC.md`.
- [templates/ADOPTION.md](../../../templates/ADOPTION.md) — current owning source or verification seam.
- [README.md](../../../README.md) — current owning source or verification seam.
- [tools/test-adoption-git-write-fallback.mjs](../../../tools/test-adoption-git-write-fallback.mjs) — current owning source or verification seam.
- [AGENTS.md](../../../AGENTS.md) — current owning source or verification seam.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec; read the full historical record and checked the named live sources. Historical proof is distinguished from current behavior. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
