---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task Move And Retype The Remaining Per-Spec Articles (TK-002) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-035-workbench-v3-1-2-candidate/SPEC.md
  - workbench/tools/workbench-layout.mjs
  - tools/test-workbench-layout.mjs
  - tools/audit-guardrails.mjs
  - AGENTS.md
  - RUNBOOK.md
  - benchmarks/RESULTS.md
last_verified: 2026-10-04
---

# Release Candidate Proof And Historical Disposition

A release candidate joins capability delivery, version identity and an account
of the feedback it addressed. The
Workbench v3.1.2 Candidate Spec for release proof (S-035) coordinated the
v3.1.2 candidate after the prerequisite capabilities were complete, and left a
disposition of the feedback that candidate answered.

## What It Does

- **Candidate coordination.** The Spec coordinated the candidate after the
  prerequisite capabilities were complete, measured guardrails without changing
  criteria, obtained exact-candidate review and proved integration
  containment.
- **Versioning principle.** The durable rule is to stamp after behavior and
  proof pass, then preserve older policies as explicit readable rows. The
  current layout runtime retains fixed legacy skill policies rather than binding
  an old version to today's mutable core list.
- **Twelve-item disposition.** Each item of the historical twelve-item
  disposition has a distinct owner:
  - strict feedback rows, migration residue and feedback harvest belonged to
    the Harness Feedback Integrity Spec (S-028);
  - installed-copy identity to the
    Installed Skill Generation Visibility Spec (S-031);
  - the usable upgrade route and Genesis source identity to the Working Upgrade
    Route And Source Provenance Spec (S-032);
  - committed completion and declared integration to the Declared Integration
    Branch And Recoverable Completion Spec (S-029);
  - fidelity to the Control Fidelity Report Spec (S-034);
  - Wiki routing and stamps to the Room Brain Routing, Wiki Stamps, And
    Checkpoint Source Bounds Spec (S-033);
  - permission scope to the Permission Scope Matches Declared Lanes Spec (S-030).
- **A declined claim.** The claim that canonical update-harness contained stale
  host-specific text was declined because it had read an installed copy.

## Why It Matters

The original review exposed the error of binding an old version to a mutable
list by growing the live bundle and checking that the older sixteen-skill
manifest remained readable. Preserving the rejected diagnosis about
update-harness matters as much as preserving implemented fixes.

## Limits

- The recorded PR, commit and score are historical release evidence, not the
  current Workbench version or a new readiness claim.
- Later source has corrected several caveats carried by this release:
  provenance fails closed, skill inspection validates complete identity and
  compatibility, fidelity checks fixed placeholder text, and current safe-read
  paths reject hard-linked final files. The neighboring feature articles
  describe those current seams; the original caveats stay readable in the
  immutable record.
- Reviewed integration delivery is separate from owner-controlled main
  publication and release tagging.
- Static scores, fixture success and historical merge proof do not establish a
  fresh installed upgrade, native-host discovery or comparative agent outcomes.

## Evidence and Sources

- [Historical Workbench v3.1.2 Candidate Spec for release proof (S-035)](../../specs/S-035-workbench-v3-1-2-candidate/SPEC.md). Original decisions, corrections, evidence and limitations remain preserved; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `7f314af`](https://github.com/KaydenClark/LLM_Workbench/blob/7f314af2bd9ad8693ed570912568180acd742779/workbench/specs/S-035-workbench-v3-1-2-candidate/SPEC.md). Recover the original with `git show 7f314af2bd9ad8693ed570912568180acd742779:workbench/specs/S-035-workbench-v3-1-2-candidate/SPEC.md`.
- [workbench/tools/workbench-layout.mjs](../../../workbench/tools/workbench-layout.mjs) - the layout runtime that retains the fixed legacy skill policies.
- [tools/test-workbench-layout.mjs](../../../tools/test-workbench-layout.mjs) - its verification seam.
- [tools/audit-guardrails.mjs](../../../tools/audit-guardrails.mjs) - the guardrail audit.
- [AGENTS.md](../../../AGENTS.md) - the agent contract.
- [RUNBOOK.md](../../../RUNBOOK.md) - the operations index.
- [benchmarks/RESULTS.md](../../../benchmarks/RESULTS.md) - the recorded benchmark results.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec after reading its full record and checking named live sources. Evolved or superseded claims are identified explicitly. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
- 2026-10-04: Moved from `design-concepts/spec-S-035-workbench-v3-1-2-candidate.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task Move And Retype The Remaining Per-Spec Articles (TK-002). Every live link to it was rewritten by the move; no claim was changed. Checked the Spec name, the names of the seven neighboring Specs, that every listed source path exists, and that the layout source carries `legacyCoreSkills`; the other claims were not re-verified.
