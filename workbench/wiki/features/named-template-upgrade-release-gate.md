---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner requested one durable Wiki article per Spec on 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task TK-002 (Move and retype the remaining per-Spec articles) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-00F-template-upgrade-release-gate/SPEC.md
  - AGENTS.md
  - RUNBOOK.md
  - README.md
  - workbench/skills/update-harness/SKILL.md
  - tools/workbench-tools.mjs
last_verified: 2026-10-04
---

# Named Template Upgrade Release Gate

The producer must exercise each new Workbench version in the named
Workbench_Template installation before declaring release readiness. The Template
Upgrade Release Gate Spec (S-00F) delivered this named gate, because generic
generation tests alone cannot prove an installed upgrade preserves room-owned
state.

## What It Does

The gate pins source and prior target commits, follows the public update route,
checks version and managed bytes, preserves identity and historical provenance,
and requires target verification, independent candidate review, integration
containment and a fresh remote clone. AGENTS.md owns this policy; RUNBOOK.md
owns the executable procedure.

## Why It Matters

Generic generation tests alone cannot prove an installed upgrade preserves
room-owned state, so release readiness depends on an upgrade actually exercised
in the named Template installation.

## Limits

- This producer-specific requirement does not make an external repository a
  prerequisite for ordinary project work. It does not authorize global skill
  replacement or main promotion.
- Generic templates deliberately do not impose the producer's named reference
  repository on every generated project.
- The first recorded application upgraded Workbench_Template to v3.2.1 at
  integration commit `fc0fc18` with twenty-one target tests and sixteen managed
  hashes. The policy-only source candidate `618d1b8` recorded forty-five checks.
  Those identities describe the historical application, not the current state
  of the remote Template and not proof of every optional cross-device
  capability.
- Historical results are attributed to the Spec record; they were not rerun for
  this article.

## Evidence and Sources

- [Historical Template Upgrade Release Gate Spec (S-00F)](../../specs/S-00F-template-upgrade-release-gate/SPEC.md). Original decisions, corrections, evidence and limitations remain preserved; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `bc370fe`](https://github.com/KaydenClark/LLM_Workbench/blob/bc370fe742d5ddb8348bf361fccea31205f6cee7/workbench/specs/S-00F-template-upgrade-release-gate/SPEC.md). The source record and named owners were read at that commit. Recover the original with `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-00F-template-upgrade-release-gate/SPEC.md`.
- [AGENTS.md](../../../AGENTS.md) - owner of the release-gate policy.
- [RUNBOOK.md](../../../RUNBOOK.md) - owner of the executable procedure.
- [README.md](../../../README.md) - routes to the gate.
- [workbench/skills/update-harness/SKILL.md](../../skills/update-harness/SKILL.md) - the update route the gate follows.
- [tools/workbench-tools.mjs](../../../tools/workbench-tools.mjs) - the tools entry point listed among this article's sources.

## History

- 2026-09-19: Reconciled into one Spec article on owner direction. Original source and proof remain intact; this article does not authorize retirement or discard.
- 2026-09-30: Repaired live skill links and source_paths after relocation to workbench/skills; verified destinations only, without revalidating historical capability claims.
- 2026-10-04: Moved from `design-concepts/spec-S-00F-template-upgrade-release-gate.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task TK-002 (Move and retype the remaining per-Spec articles). Every live link to it was rewritten by the move; no claim was changed. The article's original text ran `integration` and `candidate` into the commit hashes; they now read `integration commit fc0fc18` and `source candidate 618d1b8`, which the Spec's own evidence supports.
