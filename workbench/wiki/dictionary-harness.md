---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - The AI Coding Dictionary Terms Spec (S-004E), its Task that writes the dictionary Wiki entries (TK-006B), written from the owner's adopted AI Coding Dictionary term, 2026-10-03
source_paths:
  - workbench/docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md
  - workbench/docs/ddr/000T-the-workbench-is-an-agentic-management-system-not-a-harness.md
  - workbench/docs/adr/000W-contract-carriers-are-briefs-that-point-to-skills-and-authority-flows-through-the-pointer.md
  - AGENTS.md
  - workbench/specs/S-004E-ai-coding-dictionary-terms/SPEC.md
last_verified: 2026-10-03
---

# Harness: what the Workbench is loaded into

A harness is everything wrapped around a model to make it an agent: the tools it can call, the system prompt, the way the context window is managed, permissions and hooks. The model proposes a step, the harness carries it out and feeds the result back, and that loop repeats. Claude Code, Codex CLI, Cursor and Claude.ai are harnesses. This is a term the owner adopted from the AI Coding Dictionary on 2026-10-03 with its dictionary meaning unchanged.

**What it means here.** The Workbench is not a harness. It is the agentic management system that a harness such as Claude Code or Codex loads, so the agents running there can align the owner's ideas and implement the owner's design concepts. The owner's reason, recorded in the harness decision below: Claude Code and Codex already have harnesses, and what this project builds is the system those agents use to be managed. The Lexicon used to call the Workbench "the operating harness"; that wording is retired.

**Where the Workbench depends on it.** `AGENTS.md` and its host adapter `CLAUDE.md` are instructions to the harness, not to the model; the Contract carriers decision keeps `AGENTS.md` short because the harness loads it every turn. Skills reach an agent through the harness's own skill discovery, and permission settings are the harness's. When the same model behaves differently under two products, or differently from yesterday, suspect the harness before the model: a changed system prompt, tool set, permission default or context-management strategy all change behavior with no change to the model.

**Neighbouring words.** In Workbench vocabulary, "host" means the harness where it names software (a Chat's host, a host adapter) and the machine where it names a machine (Host portability). Names that carry the word stay as they are until the owner renames them: the `update-harness` skill, `HARNESS_FEEDBACK.md`, the version stamp placeholder. Two accepted architecture records, on evidence for outcome claims and on an unavailable baseline for a harness-only change, still use "harness" for the Workbench itself; the harness decision records that as not yet dispositioned.

## Sources

- This page is the term's Workbench home: a general AI coding concept stays Wiki-only and needs no [GLOSSARY.md](../../GLOSSARY.md) entry ([the Lexicon retirement decision (DDR-001E)](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)).
- [AI Coding Dictionary entry](https://www.aihero.dev/ai-coding-dictionary/harness): attribution only. The Workbench restates the meaning in its own words and does not import later upstream edits until the owner adopts them.
- [The workbench is an agentic management system, not a harness (the harness decision)](../docs/ddr/000T-the-workbench-is-an-agentic-management-system-not-a-harness.md): the owner's locked answer and reasons.
- [Contract carriers are briefs that point to skills (the Contract carriers decision)](../docs/adr/000W-contract-carriers-are-briefs-that-point-to-skills-and-authority-flows-through-the-pointer.md): `AGENTS.md` as the file the harness loads.
- [AGENTS.md](../../AGENTS.md): the instructions a harness loads.
