---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
source_paths:
  - workbench/specs/S-029-declared-integration-branch/SPEC.md
  - workbench/manifest.json
  - workbench/tools/workbench-paths.mjs
  - workbench/tools/spec-workbench.mjs
  - workbench/tools/workbench-layout.mjs
  - tools/workbench-adoption.mjs
  - workbench/docs/adr/0039-the-integration-branch-is-a-manifest-declared-fact.md
  - RUNBOOK.md
  - tools/test-diagnostics.mjs
  - tools/test-workbench-layout.mjs
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# Declared Integration And Recoverable Completion

A review boundary needs a real merge destination. The manifest declares
`git.defaultBranch` and `git.integrationBranch` by exact name; controls and
runtime resolve that declaration rather than assuming every room uses the
same spelling. Exact ref enumeration avoids accepting `Integration` as
`integration` merely because a filesystem is case-insensitive. `HEAD` is not
a valid declared branch name.

The Git block is additive: an older manifest can remain readable without it.
Steady-state doctor reports an undeclared or missing integration branch with
nonblocking effect. Genesis readiness fails on the same unresolved boundary.
Adoption reports missing branch setup as residue, while the owning completion
procedure requires the declared branch or an explicit omission reason.
Generation and adoption must leave committed work on a prefixed branch,
not just untracked artifacts labeled complete.

A separate attention finding, `complete-on-integration`, detects when the Spec
selected by this checkout is already complete or superseded at the declared
integration ref. It names the stale dispatch without silently changing the
checkout or blocking deliberately pinned work. It reads locally available
refs and does not fetch, so its absence cannot prove that remote state is
fresh.

The Runbook owns branch closeout, worktree pruning and disposable review
checkout practices. The current authority boundary still reserves integration
to main promotion for the owner. S-029's external room examples, branch
inventories and original integration proof are historical; this article does
not create or repair branches in those rooms.

## Evidence and Sources

- [Historical S-029 record](../../specs/S-029-declared-integration-branch/SPEC.md). Original decisions, corrections, evidence and limitations remain preserved.
- [Immutable source and proof at `7f314af`](https://github.com/KaydenClark/LLM_Workbench/blob/7f314af2bd9ad8693ed570912568180acd742779/workbench/specs/S-029-declared-integration-branch/SPEC.md). Recover the original with `git show 7f314af2bd9ad8693ed570912568180acd742779:workbench/specs/S-029-declared-integration-branch/SPEC.md`.
- [workbench/manifest.json](../../../workbench/manifest.json) — current owning source or verification seam.
- [workbench/tools/workbench-paths.mjs](../../../workbench/tools/workbench-paths.mjs) — current owning source or verification seam.
- [workbench/tools/spec-workbench.mjs](../../../workbench/tools/spec-workbench.mjs) — current owning source or verification seam.
- [workbench/tools/workbench-layout.mjs](../../../workbench/tools/workbench-layout.mjs) — current owning source or verification seam.
- [tools/workbench-adoption.mjs](../../../tools/workbench-adoption.mjs) — current owning source or verification seam.
- [workbench/docs/adr/0039-the-integration-branch-is-a-manifest-declared-fact.md](../../../workbench/docs/adr/0039-the-integration-branch-is-a-manifest-declared-fact.md) — current owning source or verification seam.
- [RUNBOOK.md](../../../RUNBOOK.md) — current owning source or verification seam.
- [tools/test-diagnostics.mjs](../../../tools/test-diagnostics.mjs) — current owning source or verification seam.
- [tools/test-workbench-layout.mjs](../../../tools/test-workbench-layout.mjs) — current owning source or verification seam.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec after reading its full record and checking named live sources. Evolved or superseded claims are identified explicitly. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
