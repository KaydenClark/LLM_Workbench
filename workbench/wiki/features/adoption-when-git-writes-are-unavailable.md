---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
  - Moved into the features collection and restructured as a feature article by the Move And Retype The Remaining Per-Spec Articles Task (TK-002) of the Wiki Evolving-Synthesis Migration Spec (S-003W) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-009-git-write-constrained-adoption/SPEC.md
  - templates/ADOPTION.md
  - README.md
  - tools/test-adoption-git-write-fallback.mjs
  - AGENTS.md
last_verified: 2026-10-04
---

# Adoption When Git Writes Are Unavailable

A host can allow ordinary document edits while refusing branch, stash or
commit writes in Git metadata. The Git-Write Constrained Adoption Spec (S-009)
made adoption distinguish that capability limit from a safe, completed
migration.

## What It Does

The public README and generic Adoption protocol require a visible blocker
instead of forcing the failed Git operation or inventing proof. Work may
continue only as permitted, reversible document changes and verification;
branch operations are handed to the owner. The clean-tree baseline is not
waived. A modified checkout without a recoverable commit is not silently
reported as delivered. The record should say which operation failed, what
reversible work was actually performed, what checks ran, and which Git step
still needs a capable actor.

## Why It Matters

This fallback keeps useful work possible without confusing filesystem access
with Git authority. The Spec originated from sanitized downstream feedback, and
its document-contract regression checks the generic protocol and public
guidance together, avoiding project-specific paths in the shipped template.

## Limits

- It is not a workaround for arbitrary repository corruption, unsafe
  permissions or unrelated filesystem failures.
- It establishes consistent instructions, not repeated evidence that an agent
  handles every constrained host.
- The related provenance capability of
  the Reproducible Adoption Provenance Spec (S-012) explains how an eventual
  completed adoption becomes independently reproducible.

## Evidence and Sources

- [Historical Git-Write Constrained Adoption Spec (S-009)](../../specs/S-009-git-write-constrained-adoption/SPEC.md). Original decisions, evidence and limitations remain preserved; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `bc370fe`](https://github.com/KaydenClark/LLM_Workbench/blob/bc370fe742d5ddb8348bf361fccea31205f6cee7/workbench/specs/S-009-git-write-constrained-adoption/SPEC.md). Recover the original with `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-009-git-write-constrained-adoption/SPEC.md`.
- [templates/ADOPTION.md](../../../templates/ADOPTION.md) - the generic Adoption protocol.
- [README.md](../../../README.md) - the public guidance.
- [tools/test-adoption-git-write-fallback.mjs](../../../tools/test-adoption-git-write-fallback.mjs) - the document-contract regression.
- [AGENTS.md](../../../AGENTS.md) - the agent contract that governs adoption behavior.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec; read the full historical record and checked the named live sources. Historical proof is distinguished from current behavior. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
- 2026-10-04: Moved from `design-concepts/spec-S-009-git-write-constrained-adoption.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Move And Retype The Remaining Per-Spec Articles Task (TK-002) of the Wiki Evolving-Synthesis Migration Spec (S-003W). Every live link to it was rewritten by the move; no claim was changed.
