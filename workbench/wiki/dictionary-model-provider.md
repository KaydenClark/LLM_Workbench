---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - The AI Coding Dictionary Terms Spec (S-004E) adopted the term from the AI Coding Dictionary, 2026-10-03; the Lexicon Retirement Spec (S-004O), its Wiki-only reference pages Task (TK-009K), moved the Lexicon row here, 2026-10-07
source_paths:
  - workbench/docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md
  - workbench/docs/ddr/000T-the-workbench-is-an-agentic-management-system-not-a-harness.md
  - AGENTS.md
last_verified: 2026-10-07
---

# Model provider: who runs the model

A model provider is whatever runs a model to answer requests, remote or local. A harness asks a provider for each response instead of running the model itself. Rate limits, capacity and outages live at the provider, together with pricing, cache discounts and the list of models on offer. The provider need not be the company that trained the model. The owner adopted the term from the AI Coding Dictionary on 2026-10-03.

**What it means here.** Existing Workbench names that say a bare "provider", such as the cross-provider tools and the "provider home" directory, mean the agent family (Claude or Codex), not this. They stay as public names. New prose says "harness" or "model provider" instead of a bare "provider".

**Where the Workbench depends on it.** A usage limit, an outage or a cache miss is a provider fact, not a defect in the room; a run that stops on one resumes from the room's written continuity. The harness decision keeps the layers apart: the Workbench is loaded by a harness, which talks to a provider, which runs the model.

## Sources

- This page is the term's Workbench home: a general AI coding concept stays Wiki-only and needs no [GLOSSARY.md](../../GLOSSARY.md) entry ([the Lexicon retirement decision (DDR-001E)](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)).
- [AI Coding Dictionary entry](https://www.aihero.dev/ai-coding-dictionary/model-provider): attribution only. The Workbench restates the meaning in its own words and does not import later upstream edits until the owner adopts them.
- [The workbench is an agentic management system, not a harness (the harness decision)](../docs/ddr/000T-the-workbench-is-an-agentic-management-system-not-a-harness.md).
- [AGENTS.md](../../AGENTS.md): the always-loaded brief and map.
