---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task Link-Safe Note Move Proven On One Article (TK-001) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-033-silent-gap-diagnostics/SPEC.md
  - workbench/tools/wiki.mjs
  - workbench/tools/workbench-layout.mjs
  - workbench/tools/workbench-paths.mjs
  - workbench/tools/sessions.mjs
  - workbench/wiki/SCHEMA.md
  - RUNBOOK.md
  - tools/test-wiki.mjs
  - tools/test-sessions.mjs
  - tools/test-diagnostics.mjs
last_verified: 2026-10-04
---

# Wiki Routing, Version Stamps And Safe Source Reads

The Workbench tells a room when its Wiki router cannot be reached from ordinary
entry, when its Wiki contract files carry a version other than the manifest's,
and refuses to read continuity input from outside the repository. The Room Brain
Routing, Wiki Stamps, And Checkpoint Source Bounds Spec (S-033) delivered these
three checks after each of the gaps had passed every automated gate green and
been found only by hand.

## What It Does

- **Routing check.** The `room-brain-unrouted` diagnostic checks that the agent
  contract references the Wiki lane and the public README references MEMORY. It
  names the missing control route.
- **Stamp check.** Wiki stamp inspection compares each declared generated
  version with the manifest and reports a mismatched or unfilled one as
  `stale-stamp`. A file with no stamp names no version. Genesis applies its
  stricter readiness checks on top.
- **Safe source reads.** Checkpoint input is bounded to the repository, and a
  lexical path check that still followed symlinks outside it was repaired.
  Checkpoint copying is now retired altogether: its compatibility command
  refuses and writes nothing. Current selected-claim promotion uses the shared
  safe-read boundary and its revision and content guards. The shared path walk
  rejects linked components and shared hard-linked final files.

## Why It Matters

A Wiki router is useful only if ordinary entry can reach it, and a stamp that
names an older version than the manifest misleads a cold reader about which
contract they are reading. Each of the three gaps was found by hand rather
than by a gate, which is what the checks now replace. The roles that remain are
navigation diagnostics, version visibility and safe source handling in the
continuity tools; new working continuity belongs in the local notepad flow, and
frozen checkpoint history stays recoverable.

## Limits

- The routing check is a presence check, not semantic proof that every link
  leads to useful knowledge.
- Version equality does not prove content freshness.
- The later `stale-seed` and `unverified-provenance` checks belong to
  installed-state diagnostics, not to Wiki content validation, and must not be
  confused with the stamp check.
- The historical hard-link limitation is not a current permission to import
  outside content.
- This article does not restore the old checkpoint copy operation, and passing
  Wiki checks do not establish that a room is free of semantic self-drift.

## Evidence and Sources

- [Historical Room Brain Routing, Wiki Stamps, And Checkpoint Source Bounds Spec (S-033)](../../specs/S-033-silent-gap-diagnostics/SPEC.md). Original decisions, corrections, evidence and limitations remain preserved; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `7f314af`](https://github.com/KaydenClark/LLM_Workbench/blob/7f314af2bd9ad8693ed570912568180acd742779/workbench/specs/S-033-silent-gap-diagnostics/SPEC.md). Recover the original with `git show 7f314af2bd9ad8693ed570912568180acd742779:workbench/specs/S-033-silent-gap-diagnostics/SPEC.md`.
- [workbench/tools/wiki.mjs](../../../workbench/tools/wiki.mjs) - the Wiki validator and note mover.
- [workbench/tools/workbench-layout.mjs](../../../workbench/tools/workbench-layout.mjs) - installed-layout owner, home of the stamp helpers.
- [workbench/tools/workbench-paths.mjs](../../../workbench/tools/workbench-paths.mjs) - the shared safe-read path walk.
- [workbench/tools/sessions.mjs](../../../workbench/tools/sessions.mjs) - promotion through the safe-read boundary and the refusing checkpoint command.
- [workbench/wiki/SCHEMA.md](../../../workbench/wiki/SCHEMA.md) - the Wiki contract the stamps belong to.
- [RUNBOOK.md](../../../RUNBOOK.md) - the operations index that routes these checks.
- [tools/test-wiki.mjs](../../../tools/test-wiki.mjs), [tools/test-sessions.mjs](../../../tools/test-sessions.mjs) and [tools/test-diagnostics.mjs](../../../tools/test-diagnostics.mjs) - the verification seams.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec after reading its full record and checking named live sources. Evolved or superseded claims are identified explicitly. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
- 2026-10-04: Moved from `design-concepts/spec-S-033-silent-gap-diagnostics.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task Link-Safe Note Move Proven On One Article (TK-001). Every live link to it was rewritten by the move; no claim was changed.
