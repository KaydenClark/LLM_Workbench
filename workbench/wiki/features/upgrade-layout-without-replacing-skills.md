---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task Move And Retype The Remaining Per-Spec Articles (TK-002) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-032-upgrade-route-and-source-provenance/SPEC.md
  - tools/workbench-upgrade.mjs
  - tools/workbench-adoption.mjs
  - tools/workbench-tools.mjs
  - workbench/tools/workbench-layout.mjs
  - workbench/skills/update-harness/SKILL.md
  - workbench/skills/adoption/SKILL.md
  - RUNBOOK.md
  - tools/test-workbench-upgrade.mjs
  - tools/test-workbench-layout.mjs
  - tools/test-workbench-tools.mjs
last_verified: 2026-10-04
---

# Upgrade Layout Without Replacing Skills

An already-adopted legacy room can move to the current support-root layout
even when replacing its installed skills is not authorized or possible. The
Working Upgrade Route And Source Provenance Spec (S-032) delivered the
layout-only upgrade route, and strengthened how a source's provenance is
established, after the old upgrade tool's skill-replacement preflight made the
support-root phase unreachable on the reported host.

## What It Does

- **Layout-only upgrade.** `upgrade --layout-only` performs the legacy
  support-root transition with presence-only skill readiness. It does not
  compare, mark, install, back up or replace skills. The recovery record names
  lifecycle upgrade, presence-only handling and an empty skill backup list.
  Explicit skill replacement remains a distinct, mutually exclusive mode.
- **Readiness and lifecycle.** The route keeps target readiness checks,
  including committed clean work and the expected legacy layout. It reuses the
  adoption migration seam as an implementation detail and then records the
  correct upgrade lifecycle. An already-adopted room is not relabeled as a new
  adoption simply because that lower-level mechanism does the file migration.
- **Named route.** The update skill names the route before asking an agent to
  reconcile records through a manifest the legacy room does not yet possess.
- **Verified source provenance.** Current layout initialization requires a
  verified clean release checkout, concrete commit, origin and matching
  release; explicit source fields must match that checkout. The shared
  managed-tools source identity also refuses missing Git, origin or dirty
  managed paths instead of emitting unknown provenance.

## Why It Matters

A legacy room that cannot have its skills replaced still needs an upgrade
route. Relocated bytes cannot become a verified producer merely by receiving
source flags, which is why provenance is checked against the actual checkout.

## Limits

- The earlier unknown-source fallback and unconstrained explicit-commit
  limitation of the original repair are historical. Source provenance has
  strengthened since.
- The upstream diagnosis is preserved: the old upgrade tool already created a
  support root, but skill-replacement preflight made that phase unreachable on
  the reported host.
- No external room or installed skill is repaired by this documentation.
  Current procedures and recovery limits govern each real upgrade.

## Evidence and Sources

- [Historical Working Upgrade Route And Source Provenance Spec (S-032)](../../specs/S-032-upgrade-route-and-source-provenance/SPEC.md). Original decisions, corrections, evidence and limitations remain preserved; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `7f314af`](https://github.com/KaydenClark/LLM_Workbench/blob/7f314af2bd9ad8693ed570912568180acd742779/workbench/specs/S-032-upgrade-route-and-source-provenance/SPEC.md). Recover the original with `git show 7f314af2bd9ad8693ed570912568180acd742779:workbench/specs/S-032-upgrade-route-and-source-provenance/SPEC.md`.
- [tools/workbench-upgrade.mjs](../../../tools/workbench-upgrade.mjs) - the upgrade route and its mutually exclusive modes.
- [tools/workbench-adoption.mjs](../../../tools/workbench-adoption.mjs) - the adoption migration seam the route reuses.
- [tools/workbench-tools.mjs](../../../tools/workbench-tools.mjs) - the shared managed-tools source identity.
- [workbench/tools/workbench-layout.mjs](../../../workbench/tools/workbench-layout.mjs) - layout initialization and source provenance.
- [workbench/skills/update-harness/SKILL.md](../../skills/update-harness/SKILL.md) - the update skill that names the route.
- [workbench/skills/adoption/SKILL.md](../../skills/adoption/SKILL.md) - the adoption skill.
- [RUNBOOK.md](../../../RUNBOOK.md) - the operations index.
- [tools/test-workbench-upgrade.mjs](../../../tools/test-workbench-upgrade.mjs), [tools/test-workbench-layout.mjs](../../../tools/test-workbench-layout.mjs) and [tools/test-workbench-tools.mjs](../../../tools/test-workbench-tools.mjs) - the verification seams.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec after reading its full record and checking named live sources. Evolved or superseded claims are identified explicitly. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
- 2026-09-30: Repaired live skill links and source_paths after relocation to workbench/skills; verified destinations only, without revalidating historical capability claims.
- 2026-10-04: Moved from `design-concepts/spec-S-032-upgrade-route-and-source-provenance.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task Move And Retype The Remaining Per-Spec Articles (TK-002). Every live link to it was rewritten by the move; no claim was changed. Checked the Spec name, that every listed source path exists, and that the upgrade tool declares `--layout-only` and `--explicit-update` as exclusive modes; the other claims were not re-verified.
