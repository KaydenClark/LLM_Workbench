---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner requested one durable Wiki article per Spec on 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task Move And Retype Remaining Per-Spec Articles (TK-002) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-051-core-skill-ownership-and-compatibility/SPEC.md
  - tools/core-skill-installer.mjs
  - tools/test-core-skill-installer.mjs
  - workbench/skills/update-harness/SKILL.md
  - workbench/manifest.json
last_verified: 2026-10-04
---

# Core Skill Ownership And Compatibility

A core installation needs an identifiable source generation and compatible manifest policy while preserving optional shared skills and project-local ownership. The Core Skill Ownership And Compatibility Spec (S-051) delivered that ownership and compatibility policy, treating source content, installed bytes, discovery and actual native invocation as separate checks.

## What It Does

- **Ownership.** LLM_Workbench owns the versioned core source. One selected global core release is managed, ignored or excluded state under `.agents/skills`; Claude's discovery adapter reaches that same source. Each application has one discovery entry, with no additional `.codex/skills` catalog. Room-local skills remain room-owned, and optional personal skills are not a base dependency.
- **Compatibility ranges.** Explicit tested compatibility ranges allow different room versions to use the same compatible core release.
- **Visible findings.** Missing skills, incompatible ranges, conflicting sources and broken or duplicate discovery entries remain visible; ordinary setup and diagnostics do not replace existing skills to hide those findings.
- **Presence-only setup.** Presence-only setup may add missing core behavior under its contract; replacing differing installed skills requires an explicit update. Backup and recovery evidence must identify what was replaced and what remained untouched.
- **Narrow waiver.** The Core Skill Ownership And Compatibility Spec (S-051) recorded a narrow owner waiver retaining v3.2.0 for a repaired twenty-one-skill generation while preserving the previous twenty-skill policy as readable legacy input. Source commit and hashes distinguish those generations. The waiver does not repeal the ordinary frozen-label rule.

## Why It Matters

Source content, installed bytes, discovery and actual native invocation are separate checks, so passing one does not establish the others.

## Limits

- The completion records matching twenty-one global core identities at reviewed 7f9fe21 and a repaired capture/correction/handoff/resume trial on the GPT 5.5 model.
- Claude OAuth and Astra execution were unavailable; Spark ordinary discovery failed a host budget. Those limitations remain evidence, not supported-host claims.
- Installed home copies can drift afterward; the original article did not update or certify today's personal installation.

## Evidence and Sources

The source record was read at `bc370fe742d5ddb8348bf361fccea31205f6cee7` and the named current owners were inspected during article preparation. Historical tests are attributed to the original record, not claimed rerun here.

- [Historical Core Skill Ownership And Compatibility Spec (S-051)](../../specs/S-051-core-skill-ownership-and-compatibility/SPEC.md). Original decisions, corrections, acceptance and evidence retain their own scope; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `bc370fe`](https://github.com/KaydenClark/LLM_Workbench/blob/bc370fe742d5ddb8348bf361fccea31205f6cee7/workbench/specs/S-051-core-skill-ownership-and-compatibility/SPEC.md). Exact source recovery: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-051-core-skill-ownership-and-compatibility/SPEC.md`.
- [tools/core-skill-installer.mjs](../../../tools/core-skill-installer.mjs) - the core skill installer.
- [tools/test-core-skill-installer.mjs](../../../tools/test-core-skill-installer.mjs) - its verification seam.
- [workbench/skills/update-harness/SKILL.md](../../skills/update-harness/SKILL.md) - the update-harness skill.
- [workbench/manifest.json](../../../workbench/manifest.json) - the manifest policy and skill inventory.

## History

- 2026-09-19: Reconciled into one article on owner direction; source records and proof remain intact pending their lifecycle gates.
- 2026-09-30: Repaired live skill links and source_paths after relocation to workbench/skills; verified destinations only, without revalidating historical capability claims.
- 2026-10-04: Moved from `design-concepts/spec-S-051-core-skill-ownership-and-compatibility.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task Move And Retype Remaining Per-Spec Articles (TK-002). Every live link to it was rewritten by the move; no claim was changed.
