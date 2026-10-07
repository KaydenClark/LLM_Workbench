---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Managed runtime tool
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/tools/workbench-layout.mjs
  - workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md
last_verified: 2026-10-07
---

# Managed runtime tool: a release-installed tool in the tools lane

A managed runtime tool is a file in `workbench/tools/` installed from the Workbench release and listed in the tools receipt with its source release, commit and hash. The canonical definition is the [glossary entry](../../GLOSSARY.md#governance-core).

**What it means here.** It is updated only by explicit update with backup and rollback; an application's root `tools/` is application-owned ([ADR-0031](../docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md)).

**Neighbouring words.** It lives in the `tools` [Support lane](dictionary-support-lane.md). Its counterpart for skills is the [Managed skill marker](dictionary-managed-skill-marker.md). A drifted tool raises the `tools-receipt-drift` [Diagnostic](dictionary-diagnostic.md).

**In use.** In a room, `workbench/tools/.workbench-tools.json` is the receipt, and `workbench/tools/spec-workbench.mjs` and `wiki.mjs` are managed tools. This producer repository's root `tools/` holds its own maintainer tools and tests, such as `tools/control-fidelity.mjs`, which are application-owned and never installed into a room.

## Sources

- [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core): the canonical definition.
- [The managed runtime tools decision (ADR-0031)](../docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md): runtime tools are Workbench-managed in the tools lane.
- [Installed Runtime Integrity](features/installed-runtime-integrity.md): receipt hashes and drift.
- [RUNBOOK.md, Managed runtime tools check](../../RUNBOOK.md#managed-runtime-tools-check): the check.
