---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
source_paths:
  - workbench/specs/S-033-silent-gap-diagnostics/SPEC.md
  - workbench/tools/wiki.mjs
  - workbench/tools/workbench-layout.mjs
  - workbench/tools/workbench-paths.mjs
  - workbench/tools/sessions.mjs
  - workbench/wiki/SCHEMA.md
  - RUNBOOK.md
  - tools/test-wiki.mjs
  - tools/test-sessions.mjs
  - tools/test-diagnostics.mjs
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# Wiki Routing, Version Stamps And Safe Source Reads

A Wiki router is useful only if ordinary entry can reach it. The
`room-brain-unrouted` diagnostic checks that the agent contract references the
Wiki lane and the public README references MEMORY. It names the missing
control route. This is a presence check, not semantic proof that every link
leads to useful knowledge.

Wiki stamp inspection compares declared generated versions with the manifest.
It reports mismatched or unfilled stamps as `stale-stamp`; a file with no
stamp names no version. Genesis applies its stricter readiness checks. Version
equality does not prove content freshness. The later `stale-seed` and
`unverified-provenance` checks belong to installed-state diagnostics, not to
Wiki content validation, and must not be confused with this stamp check.

S-033 also bounded checkpoint input to the repository and repaired a lexical
path check that still followed symlinks outside it. Checkpoint copying is now
retired altogether: its compatibility command refuses and writes nothing.
Current selected-claim promotion uses the shared safe-read boundary and
revision/content guards. The shared path walk rejects linked components and
shared hard-linked final files, so the historical hard-link limitation is not
a current permission to import outside content.

The current roles are therefore navigation diagnostics, version visibility
and safe source handling in the applicable continuity tools. Existing frozen
checkpoint history stays recoverable; new working continuity belongs in the
local notepad flow. This article does not restore the old copy operation or
claim that passing Wiki checks establishes semantic self-drift cleanliness.

## Evidence and Sources

- [Historical S-033 record](../../specs/S-033-silent-gap-diagnostics/SPEC.md). Original decisions, corrections, evidence and limitations remain preserved.
- [Immutable source and proof at `7f314af`](https://github.com/KaydenClark/LLM_Workbench/blob/7f314af2bd9ad8693ed570912568180acd742779/workbench/specs/S-033-silent-gap-diagnostics/SPEC.md). Recover the original with `git show 7f314af2bd9ad8693ed570912568180acd742779:workbench/specs/S-033-silent-gap-diagnostics/SPEC.md`.
- [workbench/tools/wiki.mjs](../../../workbench/tools/wiki.mjs) — current owning source or verification seam.
- [workbench/tools/workbench-layout.mjs](../../../workbench/tools/workbench-layout.mjs) — current owning source or verification seam.
- [workbench/tools/workbench-paths.mjs](../../../workbench/tools/workbench-paths.mjs) — current owning source or verification seam.
- [workbench/tools/sessions.mjs](../../../workbench/tools/sessions.mjs) — current owning source or verification seam.
- [workbench/wiki/SCHEMA.md](../../../workbench/wiki/SCHEMA.md) — current owning source or verification seam.
- [RUNBOOK.md](../../../RUNBOOK.md) — current owning source or verification seam.
- [tools/test-wiki.mjs](../../../tools/test-wiki.mjs) — current owning source or verification seam.
- [tools/test-sessions.mjs](../../../tools/test-sessions.mjs) — current owning source or verification seam.
- [tools/test-diagnostics.mjs](../../../tools/test-diagnostics.mjs) — current owning source or verification seam.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec after reading its full record and checking named live sources. Evolved or superseded claims are identified explicitly. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
