---
status: accepted
date: 2026-09-06
canonicalized_in:
  - AGENTS.md
  - BLUEPRINT.md
  - LEXICON.md
  - RUNBOOK.md
  - workbench/specs/S-046-json-notepad-foundation/SPEC.md
---

# JSON notepads preserve objective continuity

New live notepads, including grilling records, use JSON. A shared versioned schema and deterministic tooling
support safe updates and selective retrieval while a shared skill guides what
to preserve. Notes typically contain claims preserving active Intent and working
understanding; no whole artifact is assigned a Governance Plane. Notes remain
local-only and cannot authorize work or establish truth by recording it.

The editable resumption view and append-oriented work record retain meaningful
sources, uncertainty, and corrections. Retrieve a bounded topic with necessary
context rather than making agents reread an entire history. JSON is a storage
format, not unlimited storage or proof of capture quality. A requested handoff
is separately authored as a human-readable Markdown file from the relevant
slice. Reconcile important material
into its proper owner before deleting resolved notes; partial promotion never
permits loss of remaining work.

Considered alternatives: Markdown-only notes are easy to inspect but do not
provide a shared structural retrieval contract; a permanently growing transcript
contradicts objective-scoped disposal; a mandatory detailed event checklist
contradicts the owner's survival-value capture decision. JSONL, databases,
concurrent writers, and cross-machine transport are unselected engineering or
product alternatives, not rejected forever.

Consequences: new records are JSON immediately; existing Markdown sources are
preserved. The full schema/tool/skill lifecycle and target manifest layout are
S-046 implementation work, not delivered runtime behavior in this ADR. Existing
collection paths remain until migrated. Promotion may route selected settled
claims directly to their durable owners without copying the entire live note.
This narrows ADR-0028's checkpoint-only provenance path for new claims; its
local-only boundary and legacy checkpoints remain. S-048 owns their deliberate
retirement. No raw live note is newly made a Git artifact.

Provenance: current owner's 2026-09-06 scoping and promotion instruction, reconciled
against the corrected grilling answers and all three turns of the referenced
conversation in [S-046](../../specs/S-046-json-notepad-foundation/SPEC.md).
The assistant's example field names and CLI are proposals, not accepted APIs.

## v3.2.0 reconciliation (2026-09-08)

The whole-Workbench continuity promise is separately owned; optional private transport is now selected and direct promotion replaces checkpoint-only destinations. Local JSON capture stays independent and historical source inventories remain intact. See [ADR-0043](0043-workbench-continuity-through-maintained-owners.md), [ADR-0051](0051-optional-private-git-transport-for-session-continuity.md), [ADR-0054](0054-direct-promotion-into-durable-owners.md).
