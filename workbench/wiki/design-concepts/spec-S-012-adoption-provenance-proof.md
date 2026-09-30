---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
source_paths:
  - workbench/specs/S-012-adoption-provenance-proof/SPEC.md
  - templates/ADOPTION.md
  - README.md
  - tools/test-adoption-git-write-fallback.mjs
  - RUNBOOK.md
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# Reproducible Adoption Provenance

Adoption proof must survive the original checkout and conversation. A cold
reviewer needs the published source identity and executable reconstruction
steps, not a statement that a local run once passed.

The generic protocol assigns source remote, requested ref, resolved commit,
actually executed self-tests and any applicable vendored-helper checksum to
the adopting capability's proof owner. The adopted project's Runbook keeps
the exact fresh-clone, checkout, self-test and checksum commands. A checksum
is required when a helper is copied; it is not invented when no helper was
vendored. Project-specific remotes and paths belong in the filled project,
not the generic template.

This separates evidence of what was used from the procedure that reproduces
it. A named branch alone is mutable, so the resolved commit matters. A command
that was proposed but not run is not executed proof. Source publication and
remote writes still require their existing authority; the provenance rule
does not authorize publishing a private or unapproved project.

S-012 is a documentation-contract correction verified against the adoption
protocol and public README. It does not report a new live downstream clone in
this reconciliation, and its historical green suite is not current release
readiness. Independent adoption verification still needs to run the recorded
commands against the exact source and target being assessed.

## Evidence and Sources

- [Historical S-012 record](../../specs/S-012-adoption-provenance-proof/SPEC.md). Original decisions, evidence and limitations remain preserved.
- [Immutable source and proof at `bc370fe`](https://github.com/KaydenClark/LLM_Workbench/blob/bc370fe742d5ddb8348bf361fccea31205f6cee7/workbench/specs/S-012-adoption-provenance-proof/SPEC.md). Recover the original with `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-012-adoption-provenance-proof/SPEC.md`.
- [templates/ADOPTION.md](../../../templates/ADOPTION.md) — current owning source or verification seam.
- [README.md](../../../README.md) — current owning source or verification seam.
- [tools/test-adoption-git-write-fallback.mjs](../../../tools/test-adoption-git-write-fallback.mjs) — current owning source or verification seam.
- [RUNBOOK.md](../../../RUNBOOK.md) — current owning source or verification seam.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec; read the full historical record and checked the named live sources. Historical proof is distinguished from current behavior. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
