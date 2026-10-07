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
  - workbench/docs/adr/0044-evidence-for-claims-of-improved-agent-outcomes.md
  - AGENTS.md
last_verified: 2026-10-07
---

# Model: the predictor inside every agent

A model is the trained parameters on their own: something that predicts the next token from the text it is handed. By itself it holds no state between requests and can change nothing in the world; it acts only once a harness wraps it with tools and a loop. Model providers offer larger tiers that are more capable, slower and costlier beside smaller ones that are faster and cheaper, so which tier to use is a per-task choice. The owner adopted the term from the AI Coding Dictionary on 2026-10-03.

**What it means here.** A model is not the agent and not the harness: a model inside a harness is an agent. Workbench prose keeps the three apart so that a claim about behavior names the right layer. "Claude" or "Codex" in a lane name usually means an agent family running in its harness, not a bare model.

**Where the Workbench depends on it.** When an agent's output disappoints, the first suspects are the context it was given and the harness it runs in, and only then the model. That ordering is why the Workbench invests in what it loads (a short `AGENTS.md`, routed Wiki pages, a Task sized to one Chat) rather than in model-specific instructions, and why an outcome claim about a change needs controlled trials rather than one run on one model.

## Sources

- This page is the term's Workbench home: a general AI coding concept stays Wiki-only and needs no [GLOSSARY.md](../../GLOSSARY.md) entry ([the Lexicon retirement decision (DDR-001E)](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)).
- [AI Coding Dictionary entry](https://www.aihero.dev/ai-coding-dictionary/model): attribution only. The Workbench restates the meaning in its own words and does not import later upstream edits until the owner adopts them.
- [The workbench is an agentic management system, not a harness (the harness decision)](../docs/ddr/000T-the-workbench-is-an-agentic-management-system-not-a-harness.md).
- [Evidence for claims of improved agent outcomes (the outcome evidence decision)](../docs/adr/0044-evidence-for-claims-of-improved-agent-outcomes.md).
- [AGENTS.md](../../AGENTS.md): the always-loaded brief and map.
