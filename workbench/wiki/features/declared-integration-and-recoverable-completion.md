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
  - tools/test-integration-setup.mjs
  - workbench/specs/S-005I-required-integration-branch/SPEC.md
last_verified: 2026-10-09
---

# Declared Integration And Recoverable Completion

A review boundary needs a real merge destination, so the manifest declares it
and the controls and runtime resolve that declaration. The Declared Integration
Branch And Recoverable Completion Spec (S-029) delivered the declared Git block,
the diagnostics that report an undeclared or missing integration branch, and the
rule that generated work lands on a prefixed branch rather than as untracked
artifacts labeled complete.

Source tree for the setup amendment: `codex/required-integration-branch`, runtime candidate `aae2f71a11db88c71703d4bcf81a9b807f49b112`. The Required Integration Branch correction (S-005I) owns its later integration and review proof.

## What It Does

- **Declared branches.** The manifest declares `git.defaultBranch` and
  `git.integrationBranch` by exact name; controls and runtime resolve that
  declaration rather than assuming every room uses the same spelling. Exact ref
  enumeration avoids accepting `Integration` as `integration` merely because a
  filesystem is case-insensitive. `HEAD` is not a valid declared branch name.
- **Additive Git block.** An older manifest can remain readable without it.
  Steady-state doctor reports an undeclared or missing integration branch with
  nonblocking effect. Genesis readiness fails on the same unresolved boundary.
  The owner amended setup on 2026-10-09: every room requires a distinct
  integration branch as its default staging branch. Adoption creates a missing
  local branch from the resolved default branch without switching HEAD; existing
  local or remote integration refs remain intact. Genesis and Adoption require
  the published branch before completion. An omission note records an incomplete
  setup blocker. The [Required Integration Branch correction (S-005I)](../../specs/S-005I-required-integration-branch/SPEC.md)
  owns candidate verification and delivery; its status distinguishes this branch's
  source changes from integrated delivery.
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
named exactly, and a stale dispatch is easy to follow by accident. Setup
establishes that staging branch while preserving the working checkout and
existing refs. Read-only diagnostics keep unresolved setup and stale dispatch
visible without blocking deliberately pinned work.

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
- [tools/workbench-adoption.mjs](../../../tools/workbench-adoption.mjs) - Adoption's integration branch creation and recovery record.
- [The integration branch is a manifest-declared fact (ADR-0039)](../../docs/adr/0039-the-integration-branch-is-a-manifest-declared-fact.md)
- [RUNBOOK.md](../../../RUNBOOK.md) - branch closeout and worktree practices.
- [tools/test-diagnostics.mjs](../../../tools/test-diagnostics.mjs) and [tools/test-workbench-layout.mjs](../../../tools/test-workbench-layout.mjs) - the verification seams.

## History

- 2026-10-09: Recorded the owner amendment requiring distinct integration staging and removing omission as a completed setup path. Candidate source is on the Required Integration Branch correction (S-005I) branch; its Spec retains test and delivery gates.

- 2026-09-19: Created on owner direction as one article for this legacy Spec after reading its full record and checking named live sources. Evolved or superseded claims are identified explicitly. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
- 2026-10-04: Moved from `design-concepts/spec-S-029-declared-integration-branch.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task TK-002 (Move And Retype The Remaining Per-Spec Articles). Every live link to it was rewritten by the move; no claim was changed. This move checked that the named current source paths (the first entry names the Spec's eventual retired route, which does not exist yet) and the immutable commit exist, not the behavior of the capability itself.
