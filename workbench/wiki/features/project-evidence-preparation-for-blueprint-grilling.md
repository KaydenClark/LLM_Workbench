---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner requested one durable Wiki article per Spec on 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task TK-002 (Move and retype the remaining per-Spec articles) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-00C-project-evidence-and-blueprint-grilling/SPEC.md
  - workbench/tools/project-evidence.mjs
  - tools/test-project-evidence.mjs
  - RUNBOOK.md
last_verified: 2026-10-04
---

# Project Evidence Preparation For Blueprint Grilling

The Workbench turns explicitly named project sources into a bounded provisional
JSON grilling note that retains source identities and uncertainty and presents
owner questions without answering them. The Spec named Project Evidence And
Blueprint Grilling (S-00C) delivered this preparation seam as the preparation
step for Blueprint grilling.

## What It Does

The project-evidence preparation seam turns explicitly named project sources
into a bounded provisional JSON grilling note. It retains source identities and
uncertainty, then presents owner questions without answering them. Source
bytes, caller assertions and recorded decisions have different roles in the
note.

The installed runtime exposes `prepareEvidence` through
`project-evidence.mjs prepare`. The Runbook owns the current invocation and
input contract; source and focused tests own validation behavior.

## Why It Matters

Evidence preparation does not create active ADRs, accepted Specs or
implementation authority. The owner still supplies decisions through the
applicable workflow; a prepared question is not a locked answer.

## Limits

- The original Puffer Pond preparation recorded four source records and two
  open questions. Later demonstration interpretations were attributed to the
  manager, not presented as an owner interview.
- The original suite report disclosed a stale documented-command selector and
  its correction.
- This single preparation is not proof of general agent reliability or
  unrestricted evidence ingestion.
- Historical results are attributed to the Spec record; they were not rerun for
  this article.

## Evidence and Sources

- [Historical Project Evidence And Blueprint Grilling Spec (S-00C)](../../specs/S-00C-project-evidence-and-blueprint-grilling/SPEC.md). Original decisions, corrections, evidence and limitations remain preserved; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `bc370fe`](https://github.com/KaydenClark/LLM_Workbench/blob/bc370fe742d5ddb8348bf361fccea31205f6cee7/workbench/specs/S-00C-project-evidence-and-blueprint-grilling/SPEC.md). The source record and named owners were read at that commit. Recover the original with `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-00C-project-evidence-and-blueprint-grilling/SPEC.md`.
- [workbench/tools/project-evidence.mjs](../../../workbench/tools/project-evidence.mjs) - the preparation runtime and its `prepare` command.
- [tools/test-project-evidence.mjs](../../../tools/test-project-evidence.mjs) - the focused verification seam for validation behavior.
- [RUNBOOK.md](../../../RUNBOOK.md) - the owner of the current invocation and input contract.

## History

- 2026-09-19: Reconciled into one Spec article on owner direction. Original source and proof remain intact; this article does not authorize retirement or discard.
- 2026-10-04: Moved from `design-concepts/spec-S-00C-project-evidence-and-blueprint-grilling.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task TK-002 (Move and retype the remaining per-Spec articles). Every live link to it was rewritten by the move; no claim was changed.
