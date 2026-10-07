---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - The AI Coding Dictionary Terms Spec (S-004E) adopted the term from the AI Coding Dictionary, 2026-10-03; the Lexicon Retirement Spec (S-004O), its Wiki-only reference pages Task (TK-009K), moved the Lexicon row here, 2026-10-07
source_paths:
  - workbench/docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md
  - workbench/docs/ddr/000E-every-session-works-inside-its-smart-zone-and-spends-its-tokens-efficiently.md
last_verified: 2026-10-07
---

# Effort: how hard the model thinks before answering

Effort is a per-request setting for how much the model reasons before it answers. The reasoning is generated, and billed, as output tokens whether or not the harness shows it, so higher effort costs more and answers later. Too little gives a confident but shallow answer to a hard problem; too much spends time on routine work. The owner adopted the term from the AI Coding Dictionary on 2026-10-03.

**What it means here.** It is a knob on a request, not a property of an agent or a role. The Workbench term defines the word and sets no effort level for any role, stance or operation.

**Where the Workbench depends on it.** The smart zone decision asks every session to spend its tokens efficiently, and effort is one of the ways tokens are spent. The practical reading is to spend it on the hard part of a Task, such as a design choice or a failing test that will not explain itself, not on a whole session by default.

## Sources

- This page is the term's Workbench home: a general AI coding concept stays Wiki-only and needs no [GLOSSARY.md](../../GLOSSARY.md) entry ([the Lexicon retirement decision (DDR-001E)](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)).
- [AI Coding Dictionary entry](https://www.aihero.dev/ai-coding-dictionary/effort): attribution only. The Workbench restates the meaning in its own words and does not import later upstream edits until the owner adopts them.
- [Every session works inside its smart zone and spends its tokens efficiently (the smart zone decision)](../docs/ddr/000E-every-session-works-inside-its-smart-zone-and-spends-its-tokens-efficiently.md).
