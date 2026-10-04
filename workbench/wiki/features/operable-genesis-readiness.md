---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task TK-002 (Move and retype the remaining per-Spec articles) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-015-portable-v3-release-audit-recovery/SPEC.md
  - workbench/tools/workbench-layout.mjs
  - workbench/tools/spec-packet.mjs
  - workbench/tools/template-placeholders.mjs
  - tools/test-workbench-layout.mjs
  - tools/test-workbench-dogfood.mjs
  - templates/GENESIS.md
  - AGENTS.md
last_verified: 2026-10-04
---

# Operable Genesis Readiness

Genesis readiness establishes that a cold agent can follow the declared support
layout, read filled controls and select executable work, not merely that
expected filenames exist. The Portable v3 Release Audit Recovery Spec (S-015)
delivered the layout and first-packet checks behind that readiness.

## What It Does

The current layout validator checks ordinary, non-symlink controls, rejects
empty or placeholder content, requires matching version stamps where applicable,
preserves each declared generated-region marker, and requires the thin Claude
bridge to be exactly `@AGENTS.md`.

The first Spec must occupy the declared Specs lane, match its visible identity
and version, parse through the shared packet reader, and expose an active packet
with a ready blocker-free slice and an unchecked acceptance criterion. The lane
inventory ignores dotfiles and the catalog but rejects extra first-packet
entries. The embedded placeholder vocabulary is tested against shipped
templates; legitimate Markdown brackets are not all treated as placeholders.
Failures name a stable code and, for first-packet predicates, a reason.

The Spec also corrected copy-ready templates that still granted active authority
to a retired root Specs path. Legacy migration references are different from
current write routes. Current manifest resolution remains the location owner;
current lifecycle tooling supersedes the old never-move record wording.

## Why It Matters

A scaffold is not ready merely because expected filenames exist. Shared parsing
prevents validation from accepting a packet that selection cannot use.

## Limits

- The original repair went through several rejected candidates before its
  recorded independent review and integration landing. Those exact reviews,
  release labels, historical core/pending counts and unverified fresh-Claude
  limitation remain in the immutable Spec. They are not present release
  readiness or current bundle-size claims.
- This reconciliation verifies the local structural seam, not fresh native
  Claude discovery.
- The validator is not a prose-quality scorer or proof of a successful
  end-to-end project: its promise is the minimum operable cold-start structure.

## Evidence and Sources

- [Historical Portable v3 Release Audit Recovery Spec (S-015)](../../specs/S-015-portable-v3-release-audit-recovery/SPEC.md). Original decisions, evidence and limitations remain preserved; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `bc370fe`](https://github.com/KaydenClark/LLM_Workbench/blob/bc370fe742d5ddb8348bf361fccea31205f6cee7/workbench/specs/S-015-portable-v3-release-audit-recovery/SPEC.md). Recover the original with `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-015-portable-v3-release-audit-recovery/SPEC.md`.
- [workbench/tools/workbench-layout.mjs](../../../workbench/tools/workbench-layout.mjs) - the layout validator, including the Claude bridge check.
- [workbench/tools/spec-packet.mjs](../../../workbench/tools/spec-packet.mjs) - the shared packet reader.
- [workbench/tools/template-placeholders.mjs](../../../workbench/tools/template-placeholders.mjs) - the placeholder vocabulary.
- [tools/test-workbench-layout.mjs](../../../tools/test-workbench-layout.mjs) and [tools/test-workbench-dogfood.mjs](../../../tools/test-workbench-dogfood.mjs) - the verification seams.
- [templates/GENESIS.md](../../../templates/GENESIS.md) - the Template's Genesis document.
- [AGENTS.md](../../../AGENTS.md) - the agent contract the readiness checks read.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec; read the full historical record and checked the named live sources. Historical proof is distinguished from current behavior. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
- 2026-10-04: Moved from `design-concepts/spec-S-015-portable-v3-release-audit-recovery.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task TK-002 (Move and retype the remaining per-Spec articles). Every live link to it was rewritten by the move; no claim was changed.
