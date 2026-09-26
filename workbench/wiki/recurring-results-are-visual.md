---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner direction 2026-09-04 on harness review results
  - Owner direction 2026-09-24 on grouping the grilling ledger view
  - Promoted from host auto-memory by the S-00V TK-00I audit, 2026-09-26
source_paths:
  - workbench/wiki/grilling-destination-audit-ledger.json
  - workbench/wiki/design-concepts/landmark-tracker.md
last_verified: 2026-09-26
---

# Recurring results are visual

When the owner asks for the results of recurring, comparable analysis (harness
reviews, project health, progress against the grilling destination), the
deliverable is a rendered view: a chart, board or dashboard. Not a Markdown
report and not a long chat summary. The bottleneck is reading long reports, not
producing them, so another document adds to the problem.

- Markdown or JSON stays right for the source artifact an agent produces; the
  thing the owner looks at is rendered from it. The
  [grilling ledger](grilling-destination-audit-ledger.json) works this way:
  readable views are rendered from the JSON and never edited by hand.
- Group a progress view by destination before status. The owner reads the
  ledger by landmark, the design-concept rung larger than a Spec, not as a flat
  status list; see [Landmark Tracker](design-concepts/landmark-tracker.md).
- Long prose is still right for one-off analysis the owner explicitly asked to
  read.
