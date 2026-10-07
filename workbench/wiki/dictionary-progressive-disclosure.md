---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - The Lexicon Retirement Spec (S-004O), its Wiki-only reference pages Task (TK-009K), moved the Lexicon row here, 2026-10-07
source_paths:
  - workbench/docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md
  - workbench/docs/ddr/001C-agents-md-is-the-map-and-the-only-contract-file.md
  - workbench/docs/adr/000W-contract-carriers-are-briefs-that-point-to-skills-and-authority-flows-through-the-pointer.md
  - workbench/wiki/features/spec-centered-progressive-disclosure.md
  - workbench/docs/ddr/000E-every-session-works-inside-its-smart-zone-and-spends-its-tokens-efficiently.md
last_verified: 2026-10-07
---

# Progressive disclosure: load the pointer, not the detail

Progressive disclosure is loading only the context an agent needs now, with context pointers to the rest. Always-loaded files stay small, a sentence per topic and a pointer to the detail, because every loaded token costs input and attention on every turn.

**What it means here.** `AGENTS.md`, the only Contract file, follows it as a short brief and map, and the Runbook follows it as an index of pointers to the skills that hold each procedure. A Spec links its Tasks and decisions instead of restating them, and the Wiki router gives each page one summary line.

**Where the Workbench depends on it.** It is how the Workbench keeps sessions inside their smart zone: an agent traverses from a known entry point to the one page it needs. The cost it guards against is described on the input tokens and attention budget pages.

## Sources

- This page is the concept's Workbench home: a general reference concept stays Wiki-only and needs no [GLOSSARY.md](../../GLOSSARY.md) entry ([the Lexicon retirement decision (DDR-001E)](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)).
- [AGENTS.md is the map and the only Contract file (the one Contract file decision)](../docs/ddr/001C-agents-md-is-the-map-and-the-only-contract-file.md).
- [Contract carriers are briefs that point to skills (the Contract carriers decision)](../docs/adr/000W-contract-carriers-are-briefs-that-point-to-skills-and-authority-flows-through-the-pointer.md).
- [Spec-centered progressive disclosure](features/spec-centered-progressive-disclosure.md): the feature article on loading a Spec and its links instead of the whole room.
- [Every session works inside its smart zone and spends its tokens efficiently (the smart zone decision)](../docs/ddr/000E-every-session-works-inside-its-smart-zone-and-spends-its-tokens-efficiently.md).
