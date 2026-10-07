---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - The AI Coding Dictionary Terms Spec (S-004E) adopted the term from the AI Coding Dictionary, 2026-10-03; the Lexicon Retirement Spec (S-004O), its Wiki-only reference pages Task (TK-009K), moved the Lexicon row here, 2026-10-07
source_paths:
  - workbench/docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md
  - workbench/wiki/design-concepts/roles-and-stances.md
  - AGENTS.md
  - workbench/docs/ddr/000T-the-workbench-is-an-agentic-management-system-not-a-harness.md
last_verified: 2026-10-07
---

# Agent: the model and harness as one actor

An agent is a model that a harness has equipped with tools, a system prompt and a window of context, taking turns with a user: the unit one talks to and delegates to. The word names the model and the harness together as one actor, not either part on its own. The owner adopted the term from the AI Coding Dictionary on 2026-10-03.

**What it means here.** Workbench prose says "agent", not "the AI" or "the bot". A Role is a scope assigned to an agent and a Stance is the job it does inside that scope; neither creates a new agent. Several agents can work one room at once, each in its own Chat and branch.

**Where the Workbench depends on it.** The Workbench is written for agents: `AGENTS.md` is the brief every agent loads, Specs and Tasks are sized so an agent can finish one within its smart zone, and continuity is written to files because an agent forgets between sessions.

## Sources

- This page is the term's Workbench home: a general AI coding concept stays Wiki-only and needs no [GLOSSARY.md](../../GLOSSARY.md) entry ([the Lexicon retirement decision (DDR-001E)](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)).
- [AI Coding Dictionary entry](https://www.aihero.dev/ai-coding-dictionary/agent): attribution only. The Workbench restates the meaning in its own words and does not import later upstream edits until the owner adopts them.
- [Roles and stances](design-concepts/roles-and-stances.md): what a Role scopes and what a Stance changes.
- [AGENTS.md](../../AGENTS.md): the always-loaded brief and map.
- [The workbench is an agentic management system, not a harness (the harness decision)](../docs/ddr/000T-the-workbench-is-an-agentic-management-system-not-a-harness.md).
