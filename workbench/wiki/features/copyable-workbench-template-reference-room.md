---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner requested one durable Wiki article per Spec on 2026-09-19
  - Moved into the features collection and restructured as a feature article by the Move And Retype The Remaining Per-Spec Articles Task (TK-002) of the Wiki Evolving-Synthesis Migration Spec (S-003W) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-00B-workbench-template-reformation/SPEC.md
  - AGENTS.md
  - RUNBOOK.md
  - README.md
  - tools/control-fidelity.mjs
last_verified: 2026-10-04
---

# Copyable Workbench Template Reference Room

The Workbench Template Reformation Spec (S-00B) changed the reference room from
a fictional Example application into a copyable Workbench Template.

## What It Does

A reference installation has its own controls, identity, local differences and
installed-runtime provenance. Updating it requires preserving those facts
rather than replacing the room with upstream generic files. The durable
distinction is between the generic template source and the actual installed
reference room used to prove an upgrade.

## Why It Matters

The distinction keeps an upgrade proof honest: it is proved on an actual
installed room, not on a replacement with upstream generic files.

## Limits

- The source Spec used the repository name Example_Workbench. Current producer
  controls name Workbench_Template and preserve the old name as history.
- The Spec records target PR5, integration df6335922832e93466bd32e9c0cbe577baa668c2,
  reviewed candidate d14553c, nineteen target tests and fifteen runtime hashes.
  Its installer receipt intentionally retained its actual producer source. This
  article verifies the existence and scope of that record, not today's remote
  installation.
- Fresh-project personalization was separate from this update; no main
  promotion is inferred.

## Evidence and Sources

The source record and named owners were read at `bc370fe742d5ddb8348bf361fccea31205f6cee7`. Historical results above are attributed to that record; they were not rerun for this article.

- [Historical Workbench Template Reformation Spec (S-00B)](../../specs/S-00B-workbench-template-reformation/SPEC.md). Original decisions, evidence and limitations remain preserved; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `bc370fe`](https://github.com/KaydenClark/LLM_Workbench/blob/bc370fe742d5ddb8348bf361fccea31205f6cee7/workbench/specs/S-00B-workbench-template-reformation/SPEC.md). Recover the original with `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-00B-workbench-template-reformation/SPEC.md`.
- [AGENTS.md](../../../AGENTS.md) - the agent contract carrying the Template upgrade release gate.
- [RUNBOOK.md](../../../RUNBOOK.md) - the procedure owner for that gate.
- [README.md](../../../README.md) - the public orientation naming the Template.
- [tools/control-fidelity.mjs](../../../tools/control-fidelity.mjs) - the control fidelity report tool.

## History

- 2026-09-19: Reconciled into one Spec article on owner direction. Original source and proof remain intact; this article does not authorize retirement or discard.
- 2026-10-04: Moved from `design-concepts/spec-S-00B-workbench-template-reformation.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Move And Retype The Remaining Per-Spec Articles Task (TK-002) of the Wiki Evolving-Synthesis Migration Spec (S-003W). Every live link to it was rewritten by the move; no claim was changed.
