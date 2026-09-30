---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
source_paths:
  - workbench/specs/S-035-workbench-v3-1-2-candidate/SPEC.md
  - workbench/tools/workbench-layout.mjs
  - tools/test-workbench-layout.mjs
  - tools/audit-guardrails.mjs
  - AGENTS.md
  - RUNBOOK.md
  - benchmarks/RESULTS.md
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# Release Candidate Proof And Historical Disposition

A release candidate joins capability delivery, version identity and an
account of the feedback it addressed. S-035 coordinated the v3.1.2 candidate
after the prerequisite capabilities were complete, measured guardrails
without changing criteria, obtained exact-candidate review and proved
integration containment. Its recorded PR, commit and score are historical
release evidence, not the current Workbench version or a new readiness claim.

The durable versioning principle is to stamp after behavior and proof pass,
then preserve older policies as explicit readable rows. The current layout
runtime retains fixed legacy skill policies rather than binding an old
version to today's mutable core list. The original review exposed that error
by growing the live bundle and checking that the older sixteen-skill manifest
remained readable.

The historical twelve-item disposition has distinct owners: strict feedback
rows, migration residue and feedback harvest belonged to S-028; installed-copy
identity to S-031; the usable upgrade route and Genesis source identity to
S-032; committed completion and declared integration to S-029; fidelity to
S-034; Wiki routing/stamps to S-033; permission scope to S-030. The claim that
canonical update-harness contained stale host-specific text was declined
because it had read an installed copy. Preserving that rejected diagnosis
matters as much as preserving implemented fixes.

Later source has corrected several caveats carried by this release: provenance
fails closed, skill inspection validates complete identity and compatibility,
fidelity checks fixed placeholder text, and current safe-read paths reject
hard-linked final files. The neighboring articles describe those current
seams; the original caveats stay readable in the immutable record.

The release distinction remains: reviewed integration delivery is separate
from owner-controlled main publication and release tagging. Static scores,
fixture success and historical merge proof do not establish a fresh installed
upgrade, native-host discovery or comparative agent outcomes.

## Evidence and Sources

- [Historical S-035 record](../../specs/S-035-workbench-v3-1-2-candidate/SPEC.md). Original decisions, corrections, evidence and limitations remain preserved.
- [Immutable source and proof at `7f314af`](https://github.com/KaydenClark/LLM_Workbench/blob/7f314af2bd9ad8693ed570912568180acd742779/workbench/specs/S-035-workbench-v3-1-2-candidate/SPEC.md). Recover the original with `git show 7f314af2bd9ad8693ed570912568180acd742779:workbench/specs/S-035-workbench-v3-1-2-candidate/SPEC.md`.
- [workbench/tools/workbench-layout.mjs](../../../workbench/tools/workbench-layout.mjs) — current owning source or verification seam.
- [tools/test-workbench-layout.mjs](../../../tools/test-workbench-layout.mjs) — current owning source or verification seam.
- [tools/audit-guardrails.mjs](../../../tools/audit-guardrails.mjs) — current owning source or verification seam.
- [AGENTS.md](../../../AGENTS.md) — current owning source or verification seam.
- [RUNBOOK.md](../../../RUNBOOK.md) — current owning source or verification seam.
- [benchmarks/RESULTS.md](../../../benchmarks/RESULTS.md) — current owning source or verification seam.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec after reading its full record and checking named live sources. Evolved or superseded claims are identified explicitly. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
