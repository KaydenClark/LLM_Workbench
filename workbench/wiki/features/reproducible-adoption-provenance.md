---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task TK-002 (Move and retype the remaining per-Spec articles) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-012-adoption-provenance-proof/SPEC.md
  - templates/ADOPTION.md
  - README.md
  - tools/test-adoption-git-write-fallback.mjs
  - RUNBOOK.md
last_verified: 2026-10-04
---

# Reproducible Adoption Provenance

Adoption proof survives the original checkout and conversation: a cold reviewer
gets the published source identity and executable reconstruction steps, not a
statement that a local run once passed. The Spec named
Reproducible Adoption Provenance (S-012) delivered this as a
documentation-contract correction to the adoption protocol and the public
README.

## What It Does

The generic protocol assigns source remote, requested ref, resolved commit,
actually executed self-tests and any applicable vendored-helper checksum to the
adopting capability's proof owner. The adopted project's Runbook keeps the exact
fresh-clone, checkout, self-test and checksum commands. A checksum is required
when a helper is copied; it is not invented when no helper was vendored.
Project-specific remotes and paths belong in the filled project, not the generic
template.

## Why It Matters

This separates evidence of what was used from the procedure that reproduces it.
A named branch alone is mutable, so the resolved commit matters. A command that
was proposed but not run is not executed proof.

## Limits

- Source publication and remote writes still require their existing authority;
  the provenance rule does not authorize publishing a private or unapproved
  project.
- The Spec is a documentation-contract correction verified against the adoption
  protocol and public README. It does not report a new live downstream clone,
  and its historical green suite is not current release readiness.
- Independent adoption verification still needs to run the recorded commands
  against the exact source and target being assessed.

## Evidence and Sources

- [Historical Reproducible Adoption Provenance Spec (S-012)](../../specs/S-012-adoption-provenance-proof/SPEC.md). Original decisions, evidence and limitations remain preserved; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `bc370fe`](https://github.com/KaydenClark/LLM_Workbench/blob/bc370fe742d5ddb8348bf361fccea31205f6cee7/workbench/specs/S-012-adoption-provenance-proof/SPEC.md). Recover the original with `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-012-adoption-provenance-proof/SPEC.md`.
- [templates/ADOPTION.md](../../../templates/ADOPTION.md) - the generic adoption protocol that carries the provenance rule.
- [README.md](../../../README.md) - the public README the Spec verified against.
- [tools/test-adoption-git-write-fallback.mjs](../../../tools/test-adoption-git-write-fallback.mjs) - the adoption verification seam.
- [RUNBOOK.md](../../../RUNBOOK.md) - the adopted project's owner of the exact reproduction commands.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec; read the full historical record and checked the named live sources. Historical proof is distinguished from current behavior. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
- 2026-10-04: Moved from `design-concepts/spec-S-012-adoption-provenance-proof.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task TK-002 (Move and retype the remaining per-Spec articles). Every live link to it was rewritten by the move; no claim was changed.
