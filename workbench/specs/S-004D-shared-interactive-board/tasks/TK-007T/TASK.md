# TK-007T - The Owner reads connected native sources and exact proposed drafts across the five Dashboard sections

**Task ID:** TK-007T
**Spec ID:** S-004D
**Slice:** The Owner reads connected native sources and exact proposed drafts across the five Dashboard sections
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: The five sections open from one site, each reading its existing owners; every question that uses a decision record links to it in the Wiki section. Drafts to approve shows exact current and proposed wording per file, tagged with its owning question. Every term, ID and link on a sampled question path resolves to a page or a labeled carried excerpt with provenance; hover definitions, search and backlinks work.
**Planned verification:** Red first in `tools/test-dashboard-sources.mjs` and `tools/test-taskboard-json.mjs`: the read-only Taskboard reader refuses the live room on a repeated narrative label while every existing duplicate-refusal test must still pass; no glossary, backlink or search route exists. Green: source-qualified Taskboard identities with legacy `TK-001` duplicates kept apart, Tracker semantics kept distinct, source errors returned without a substitute projection, glossary from `GLOSSARY.md` or the existing `LEXICON.md` route, backlinks from questions and artifacts, bounded search that never reads private collections. Then the page model and a disposable-copy browser check of each section and one Drafts to approve comparison; then the Full Runbook suite on the committed candidate.
**Claimed by:** claude-dashboard-director

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
