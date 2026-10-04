---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task TK-002 (Move And Retype The Remaining Per-Spec Articles) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-029-declared-integration-branch/SPEC.md
  - workbench/manifest.json
  - workbench/tools/workbench-paths.mjs
  - workbench/tools/spec-workbench.mjs
  - workbench/tools/workbench-layout.mjs
  - tools/workbench-adoption.mjs
  - workbench/docs/adr/0039-the-integration-branch-is-a-manifest-declared-fact.md
  - RUNBOOK.md
  - tools/test-diagnostics.mjs
  - tools/test-workbench-layout.mjs
last_verified: 2026-10-04
---

# Declared Integration And Recoverable Completion

A review boundary needs a real merge destination, so the manifest declares it
and the controls and runtime resolve that declaration. The Declared Integration
Branch And Recoverable Completion Spec (S-029) delivered the declared Git block,
the diagnostics that report an undeclared or missing integration branch, and the
rule that generated work lands on a prefixed branch rather than as untracked
artifacts labeled complete.

## What It Does

- **Declared branches.** The manifest declares `git.defaultBranch` and
  `git.integrationBranch` by exact name; controls and runtime resolve that
  declaration rather than assuming every room uses the same spelling. Exact ref
  enumeration avoids accepting `Integration` as `integration` merely because a
  filesystem is case-insensitive. `HEAD` is not a valid declared branch name.
- **Additive Git block.** An older manifest can remain readable without it.
  Steady-state doctor reports an undeclared or missing integration branch with
  nonblocking effect. Genesis readiness fails on the same unresolved boundary.
  Adoption reports missing branch setup as residue, while the owning completion
  procedure requires the declared branch or an explicit omission reason.
- **Committed work on a prefixed branch.** Generation and adoption must leave
  committed work on a prefixed branch, not just untracked artifacts labeled
  complete.
- **Stale-dispatch detection.** A separate attention finding,
  `complete-on-integration`, detects when the Spec selected by this checkout is
  already complete or superseded at the declared integration ref. It names the
  stale dispatch without silently changing the checkout or blocking
  deliberately pinned work.

## Why It Matters

A review gate is meaningful only against a merge destination that exists and is
named exactly, and a stale dispatch is easy to follow by accident. Reporting the
gap, rather than silently picking a branch or changing the checkout, keeps the
boundary visible without blocking deliberately pinned work.

## Limits

- `complete-on-integration` reads locally available refs and does not fetch, so
  its absence cannot prove that remote state is fresh.
- The Runbook owns branch closeout, worktree pruning and disposable review
  checkout practices. The current authority boundary still reserves integration
  to main promotion for the owner.
- The Spec's external room examples, branch inventories and original
  integration proof are historical; this article does not create or repair
  branches in those rooms.

## Evidence and Sources

- [Historical Declared Integration Branch And Recoverable Completion Spec (S-029)](../../specs/S-029-declared-integration-branch/SPEC.md). Original decisions, corrections, evidence and limitations remain preserved; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `7f314af`](https://github.com/KaydenClark/LLM_Workbench/blob/7f314af2bd9ad8693ed570912568180acd742779/workbench/specs/S-029-declared-integration-branch/SPEC.md). Recover the original with `git show 7f314af2bd9ad8693ed570912568180acd742779:workbench/specs/S-029-declared-integration-branch/SPEC.md`.
- [workbench/manifest.json](../../manifest.json) - the manifest that declares the Git block.
- [workbench/tools/workbench-paths.mjs](../../tools/workbench-paths.mjs) - the shared binding resolver.
- [workbench/tools/spec-workbench.mjs](../../tools/spec-workbench.mjs) - the Spec lifecycle tool.
- [workbench/tools/workbench-layout.mjs](../../tools/workbench-layout.mjs) - the installed-layout owner.
- [tools/workbench-adoption.mjs](../../../tools/workbench-adoption.mjs) - Adoption's branch residue reporting.
- [The integration branch is a manifest-declared fact (ADR-0039)](../../docs/adr/0039-the-integration-branch-is-a-manifest-declared-fact.md)
- [RUNBOOK.md](../../../RUNBOOK.md) - branch closeout and worktree practices.
- [tools/test-diagnostics.mjs](../../../tools/test-diagnostics.mjs) and [tools/test-workbench-layout.mjs](../../../tools/test-workbench-layout.mjs) - the verification seams.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec after reading its full record and checking named live sources. Evolved or superseded claims are identified explicitly. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
- 2026-10-04: Moved from `design-concepts/spec-S-029-declared-integration-branch.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task TK-002 (Move And Retype The Remaining Per-Spec Articles). Every live link to it was rewritten by the move; no claim was changed. This move checked that the named source paths and the immutable commit exist, not the behavior of the capability itself.
