---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
source_paths:
  - workbench/specs/S-030-permission-scope-matches-lanes/SPEC.md
  - templates/.claude/settings.json
  - templates/.claude/README.md
  - workbench/tools/workbench-layout.mjs
  - workbench/tools/diagnostics.mjs
  - RUNBOOK.md
  - tools/test-diagnostics.mjs
  - tools/test-workbench-layout.mjs
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# Mechanical Permission Scope And Declared Lanes

The permission file and prose edit scope must describe the same effective
boundary. A room can otherwise pass document checks while its host asks on
every record write or denies a declared authorship lane.

S-030 originally implemented separate path-scoped Edit and Write grants.
That premise is historical: the current template and its README use Edit rules
for built-in file editing and creation, intentionally omit path-scoped Write
rules, and still account for a bare Write restriction that can block creation.
Reading the old Spec as today's permission recipe would reintroduce the
superseded model.

The current matcher examines allow, ask and deny relationships against each
manifest lane. It reports missing covering Edit permission, restrictive
intersections and uncertain restrictive shapes for authorship lanes. The
managed tools lane must stay covered by ask when broadly allowed; a partial
ask cannot protect an entire tools lane. Denials remain visible. The current
matcher recognizes documented relative, absolute and home-relative forms and
fails conservatively where a restriction cannot be interpreted safely.

`permission-scope-drift` reports the affected lane and reason without rewriting
settings. Steady-state doctor keeps its nonblocking effect; Genesis readiness
refuses the mismatch. A room with no optional permission file is unaffected.
A deliberate restriction can be documented by its owner, but documentation
does not make the runtime grant it.

The local fixtures verify JSON rules and matcher behavior. They do not run a
native Claude permission prompt or prove another provider's enforcement.
Existing rooms receive no automatic settings change from this article.

## Evidence and Sources

- [Historical S-030 record](../../specs/S-030-permission-scope-matches-lanes/SPEC.md). Original decisions, corrections, evidence and limitations remain preserved.
- [Immutable source and proof at `7f314af`](https://github.com/KaydenClark/LLM_Workbench/blob/7f314af2bd9ad8693ed570912568180acd742779/workbench/specs/S-030-permission-scope-matches-lanes/SPEC.md). Recover the original with `git show 7f314af2bd9ad8693ed570912568180acd742779:workbench/specs/S-030-permission-scope-matches-lanes/SPEC.md`.
- [templates/.claude/settings.json](../../../templates/.claude/settings.json) — current owning source or verification seam.
- [templates/.claude/README.md](../../../templates/.claude/README.md) — current owning source or verification seam.
- [workbench/tools/workbench-layout.mjs](../../../workbench/tools/workbench-layout.mjs) — current owning source or verification seam.
- [workbench/tools/diagnostics.mjs](../../../workbench/tools/diagnostics.mjs) — current owning source or verification seam.
- [RUNBOOK.md](../../../RUNBOOK.md) — current owning source or verification seam.
- [tools/test-diagnostics.mjs](../../../tools/test-diagnostics.mjs) — current owning source or verification seam.
- [tools/test-workbench-layout.mjs](../../../tools/test-workbench-layout.mjs) — current owning source or verification seam.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec after reading its full record and checking named live sources. Evolved or superseded claims are identified explicitly. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
