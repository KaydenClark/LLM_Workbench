---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task TK-002 (Move And Retype The Remaining Per-Spec Articles) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-030-permission-scope-matches-lanes/SPEC.md
  - templates/.claude/settings.json
  - templates/.claude/README.md
  - workbench/tools/workbench-layout.mjs
  - workbench/tools/diagnostics.mjs
  - RUNBOOK.md
  - tools/test-diagnostics.mjs
  - tools/test-workbench-layout.mjs
last_verified: 2026-10-04
---

# Mechanical Permission Scope And Declared Lanes

The permission file and the prose edit scope must describe the same effective
boundary, and a diagnostic now checks that they do. The Permission Scope Matches
Declared Lanes Spec (S-030) delivered that check; without it a room can pass
document checks while its host asks on every record write or denies a declared
authorship lane.

## What It Does

- **A matcher over declared lanes.** The current matcher examines allow, ask and
  deny relationships against each manifest lane. It reports missing covering
  Edit permission, restrictive intersections and uncertain restrictive shapes
  for authorship lanes. The managed tools lane must stay covered by ask when
  broadly allowed; a partial ask cannot protect an entire tools lane. Denials
  remain visible.
- **Conservative path forms.** The matcher recognizes documented relative,
  absolute and home-relative forms and fails conservatively where a restriction
  cannot be interpreted safely.
- **`permission-scope-drift`.** It reports the affected lane and reason without
  rewriting settings. Steady-state doctor keeps its nonblocking effect; Genesis
  readiness refuses the mismatch. A room with no optional permission file is
  unaffected.
- **Current template recipe.** The current template and its README use Edit
  rules for built-in file editing and creation, intentionally omit path-scoped
  Write rules, and still account for a bare Write restriction that can block
  creation.

## Why It Matters

A room can otherwise pass document checks while its host asks on every record
write or denies a declared authorship lane. Reporting the lane and the reason
makes that mismatch visible without changing a room's settings.

## Limits

- The Spec originally implemented separate path-scoped Edit and Write grants.
  That premise is historical; reading the old Spec as today's permission recipe
  would reintroduce the superseded model.
- A deliberate restriction can be documented by its owner, but documentation
  does not make the runtime grant it.
- The local fixtures verify JSON rules and matcher behavior. They do not run a
  native Claude permission prompt or prove another provider's enforcement.
- Existing rooms receive no automatic settings change from this article.

## Evidence and Sources

- [Historical Permission Scope Matches Declared Lanes Spec (S-030)](../../specs/S-030-permission-scope-matches-lanes/SPEC.md). Original decisions, corrections, evidence and limitations remain preserved; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `7f314af`](https://github.com/KaydenClark/LLM_Workbench/blob/7f314af2bd9ad8693ed570912568180acd742779/workbench/specs/S-030-permission-scope-matches-lanes/SPEC.md). Recover the original with `git show 7f314af2bd9ad8693ed570912568180acd742779:workbench/specs/S-030-permission-scope-matches-lanes/SPEC.md`.
- [templates/.claude/settings.json](../../../templates/.claude/settings.json) - the template permission file.
- [templates/.claude/README.md](../../../templates/.claude/README.md) - the template permission guidance.
- [workbench/tools/workbench-layout.mjs](../../../workbench/tools/workbench-layout.mjs) - the installed-layout owner.
- [workbench/tools/diagnostics.mjs](../../../workbench/tools/diagnostics.mjs) - the diagnostic registry.
- [RUNBOOK.md](../../../RUNBOOK.md) - the operations route.
- [tools/test-diagnostics.mjs](../../../tools/test-diagnostics.mjs) and [tools/test-workbench-layout.mjs](../../../tools/test-workbench-layout.mjs) - the verification seams.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec after reading its full record and checking named live sources. Evolved or superseded claims are identified explicitly. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
- 2026-10-04: Moved from `design-concepts/spec-S-030-permission-scope-matches-lanes.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task TK-002 (Move And Retype The Remaining Per-Spec Articles). Every live link to it was rewritten by the move; no claim was changed. This move checked that the named source paths and the immutable commit exist, not the behavior of the capability itself.
