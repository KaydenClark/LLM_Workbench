---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
source_paths:
  - workbench/specs/S-032-upgrade-route-and-source-provenance/SPEC.md
  - tools/workbench-upgrade.mjs
  - tools/workbench-adoption.mjs
  - tools/workbench-tools.mjs
  - workbench/tools/workbench-layout.mjs
  - skills/update-harness/SKILL.md
  - skills/adoption/SKILL.md
  - RUNBOOK.md
  - tools/test-workbench-upgrade.mjs
  - tools/test-workbench-layout.mjs
  - tools/test-workbench-tools.mjs
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# Upgrade Layout Without Replacing Skills

An already-adopted legacy room needs an upgrade route even when replacing its
installed skills is not authorized or possible. `upgrade --layout-only`
performs the legacy support-root transition with presence-only skill readiness.
It does not compare, mark, install, back up or replace skills. The recovery
record names lifecycle upgrade, presence-only handling and an empty skill
backup list. Explicit skill replacement remains a distinct, mutually exclusive
mode.

The route keeps target readiness checks, including committed clean work and
the expected legacy layout. It reuses the adoption migration seam as an
implementation detail and then records the correct upgrade lifecycle. An
already-adopted room is not relabeled as a new adoption simply because that
lower-level mechanism does the file migration. The update skill names the
route before asking an agent to reconcile records through a manifest the
legacy room does not yet possess.

Source provenance has strengthened since the original repair. Current layout
initialization requires a verified clean release checkout, concrete commit,
origin and matching release; explicit source fields must match that checkout.
Relocated bytes cannot become a verified producer merely by receiving source
flags. The shared managed-tools source identity also refuses missing Git,
origin or dirty managed paths instead of emitting unknown provenance.

S-032's earlier unknown-source fallback and unconstrained explicit-commit
limitation are therefore historical. Its upstream diagnosis is preserved: the
old upgrade tool already created a support root, but skill-replacement
preflight made that phase unreachable on the reported host. No external room
or installed skill is repaired by this documentation. Current procedures and
recovery limits govern each real upgrade.

## Evidence and Sources

- [Historical S-032 record](../../specs/S-032-upgrade-route-and-source-provenance/SPEC.md). Original decisions, corrections, evidence and limitations remain preserved.
- [Immutable source and proof at `7f314af`](https://github.com/KaydenClark/LLM_Workbench/blob/7f314af2bd9ad8693ed570912568180acd742779/workbench/specs/S-032-upgrade-route-and-source-provenance/SPEC.md). Recover the original with `git show 7f314af2bd9ad8693ed570912568180acd742779:workbench/specs/S-032-upgrade-route-and-source-provenance/SPEC.md`.
- [tools/workbench-upgrade.mjs](../../../tools/workbench-upgrade.mjs) — current owning source or verification seam.
- [tools/workbench-adoption.mjs](../../../tools/workbench-adoption.mjs) — current owning source or verification seam.
- [tools/workbench-tools.mjs](../../../tools/workbench-tools.mjs) — current owning source or verification seam.
- [workbench/tools/workbench-layout.mjs](../../../workbench/tools/workbench-layout.mjs) — current owning source or verification seam.
- [skills/update-harness/SKILL.md](../../../skills/update-harness/SKILL.md) — current owning source or verification seam.
- [skills/adoption/SKILL.md](../../../skills/adoption/SKILL.md) — current owning source or verification seam.
- [RUNBOOK.md](../../../RUNBOOK.md) — current owning source or verification seam.
- [tools/test-workbench-upgrade.mjs](../../../tools/test-workbench-upgrade.mjs) — current owning source or verification seam.
- [tools/test-workbench-layout.mjs](../../../tools/test-workbench-layout.mjs) — current owning source or verification seam.
- [tools/test-workbench-tools.mjs](../../../tools/test-workbench-tools.mjs) — current owning source or verification seam.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec after reading its full record and checking named live sources. Evolved or superseded claims are identified explicitly. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
