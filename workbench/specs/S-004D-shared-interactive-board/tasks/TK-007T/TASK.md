# TK-007T - The Owner reads connected native sources and exact proposed drafts across the five Dashboard sections

**Task ID:** TK-007T
**Spec ID:** S-004D
**Slice:** The Owner reads connected native sources and exact proposed drafts across the five Dashboard sections
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: The five sections open from one site, each reading its existing owners; every question that uses a decision record links to it in the Wiki section. Drafts to approve shows exact current and proposed wording per file, tagged with its owning question. Every term, ID and link on a sampled question path resolves to a page or a labeled carried excerpt with provenance; hover definitions, search and backlinks work.
**Planned verification:** Red first in `tools/test-dashboard-sources.mjs` and `tools/test-taskboard-json.mjs`: the read-only Taskboard reader refuses the live room on a repeated narrative label while every existing duplicate-refusal test must still pass; no glossary, backlink or search route exists. Green: source-qualified Taskboard identities with legacy `TK-001` duplicates kept apart, Tracker semantics kept distinct, source errors returned without a substitute projection, glossary from `GLOSSARY.md` or the existing `LEXICON.md` route, backlinks from questions and artifacts, bounded search that never reads private collections. Then the page model and a disposable-copy browser check of each section and one Drafts to approve comparison; then the Full Runbook suite on the committed candidate.
**Claimed by:** claude-dashboard-director
**Proof:** Five sections from native owners: source-qualified Taskboard (613 real cards, legacy labels kept apart, overwritten identity refused, duplicate-field guard strict for every parsed field), Tracker semantics kept distinct, source errors shown without substitutes; Drafts to approve with current beside proposed wording and snapshot match or stale state; Wiki groups, decision-record links, glossary, backlinks and bounded search excluding private collections. tools/test-dashboard-sources.mjs 11/11, tools/test-taskboard-json.mjs 65/65; browser receipt proof/owner-flow-demo-a857b658.json step 1. Full suite 60/60 on clean candidate 07429c50; separate-context review #4 pass at 07429c50 (Spec evidence)

## Scope

Grow the Grill Board page into the five Workbench Dashboard sections without a
second store or a new framework, reading only existing owners.

- **Sources** (`tools/dashboard-sources.mjs`, the read-only `readTaskboard` in
  `workbench/tools/spec-workbench.mjs`, `workbench/tools/taskboard.mjs`):
  execution lanes from Spec and Task records, understanding distributions from
  the Landmark Tracker, the Wiki, skills and decision-record catalog, and the
  glossary, backlink and search routes. The Taskboard duplicate-field guard
  keeps strict refusal for every field a parser consumes.
- **Page** (`workbench/grill-board/index.html`, served by `tools/grill-board.mjs`):
  section navigation, card inspector, Drafts to approve with current beside
  proposed wording and the stale state of a confirmed snapshot, items needing
  approval without a draft listed honestly, decision-record links into the Wiki
  section, global search, backlinks and hover definitions.
- **Glossary route:** read `GLOSSARY.md` when the established Glossary reaches
  this baseline and the existing Lexicon route until then. This Task does not
  create a Glossary or migrate the Lexicon.

### Out of scope

Answer controls, rounds and promotion (TK-007X), the always-open service and
the owner-flow demonstration (TK-007Y), and revising question content.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/workbench-dashboard-first-pass | d9176861f942a03158fbcf60884d4c19f07dda41 | ahead 0 behind 0 | 0 | Five sections from native owners: source-qualified Taskboard (613 real cards, legacy labels kept apart, overwritten identity refused, duplicate-field guard strict for every parsed field), Tracker semantics kept distinct, source errors shown without substitutes; Drafts to approve with current beside proposed wording and snapshot match or stale state; Wiki groups, decision-record links, glossary, backlinks and bounded search excluding private collections. tools/test-dashboard-sources.mjs 11/11, tools/test-taskboard-json.mjs 65/65; browser receipt proof/owner-flow-demo-a857b658.json step 1. Full suite 60/60 on clean candidate 07429c50; separate-context review #4 pass at 07429c50 (Spec evidence) | workbench/grill-board/README.md: sections, Drafts to approve, search, backlinks and glossary; RUNBOOK Full suite lists the Dashboard checks | Question content: 99 pointer-only recommendations, 16 wording approvals without a draft and 61 missing or moved source paths remain for a content pass (proof/question-content-audit-2026-10-08.json); the glossary reads GLOSSARY.md once the Lexicon retirement lands | e8a7f6424e652fd0c4545cd271d7566f6783e98926b6f52b9f3cf8c2c98bd31c |
