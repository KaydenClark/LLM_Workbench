---
type: meta
status: active
sensitivity: normal
knowledge_role: canonical
provenance:
  - LLM Workbench template wiki
source_paths:
  - workbench/wiki/features
last_verified: 2026-09-26
---

# Features

> Generated from LLM Workbench v3.2.1.

This collection holds features articles: one readable article per completed
Spec, written at its closure point, explaining what the delivered capability
does, why it matters, its limits and the evidence that supports it. The
collection exists in every Workbench and may be empty.

## When An Article Is Written

A Spec is captured after it is `complete` and before any of its records are
retired or discarded. Capture is not a gate on `complete`: a Spec whose
capture has not happened, or failed, stays `complete` and uncaptured, and
`doctor` reports a Spec completed with recorded main verification and no
captured article as attention (`uncaptured-complete`). Retirement
(`spec-workbench.mjs retire-spec S-### --wiki <note>`) takes the captured
article as the Spec's durable owner, and Task records, including missed
attempts, are never discarded before their parent Spec is captured.

Writing the article is ordinary delivery authoring, not an additional
approval.

## What Qualifies

Supported knowledge about delivered behavior, transformed into prose a cold
reader can use. Not a pasted Spec, a Task list, evidence rows, a Taskboard
projection or a completed Task standing in for the capability. Copied delivery
state is refused by the validator (`copied-task-state`); link to the retired
Spec instead.

## Article Shape

```markdown
---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - features capture at the closure point, YYYY-MM-DD
source_paths:
  - workbench/specs/retired/S-###-slug/SPEC.md
  - path/to/source-or-test
last_verified: YYYY-MM-DD
---

# [Capability Name]

[What was delivered, in one paragraph.]

## What It Does

## Why It Matters

## Limits

## Evidence and Sources
```

- `type: feature` belongs in this collection only; a note here of any other
  type, or a feature article anywhere else, is invalid.
- `knowledge_role` is `canonical` or `curated` for the article to serve as the
  Spec's retirement owner.
- `source_paths` names the Spec's retired route,
  `workbench/specs/retired/<spec directory>/SPEC.md`, which is the provenance
  retirement and discard read, plus the source and tests that prove it.
- Name the article for the capability it delivers, not for the identifier of
  the Spec that delivered it. Where it names an identifier, it also names the
  artifact and what it is for.
- Route every article from `MEMORY.md` with a relative link and a one-line
  summary beside it, so a reader can choose the article without opening it.
  This collection keeps no index of its own.
- Design Concept and guidebook notes remain valid retirement owners for
  earlier Specs; a Task record's discard waits for a features article.

## This Room's Articles

The `MEMORY.md` router lists them under Feature Articles. The first, moved here
from `design-concepts/` with `wiki.mjs move-note`, is
[Wiki Routing, Version Stamps And Safe Source Reads](wiki-routing-version-stamps-and-safe-source-reads.md).
