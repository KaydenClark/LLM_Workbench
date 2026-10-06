---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - The owner's review of Codex's recommendation on finding the OpenAI harness-engineering article, 2026-10-05, and the decision records promoted from it
source_paths:
  - workbench/docs/ddr/000Z-harness-engineering-is-the-philosophy-and-the-workbench-is-its-implementation.md
  - workbench/docs/ddr/001H-the-twelve-harness-engineering-directions-are-landmarks.md
  - workbench/docs/ddr/001G-the-blueprint-keeps-its-name-and-decision-records-are-the-design-doc-layer.md
  - BLUEPRINT.md
  - workbench/skills/improve-harness/SKILL.md
last_verified: 2026-10-05
---

# Harness engineering: the philosophy the Workbench implements

Harness engineering is the practice of improving agent output by shaping the environment around a fixed model and coding agent: the context it can reach, the tools it can call, the boundaries it works inside and the feedback loops that prove its work. Humans steer, agents execute. The owner adopted it as the Workbench's engineering philosophy on 2026-10-05 ([the philosophy decision](../docs/ddr/000Z-harness-engineering-is-the-philosophy-and-the-workbench-is-its-implementation.md)). The Workbench is its implementation for persistent owner intent, multi-agent and multi-provider coordination, progressive context and autonomous project delivery; it stays an agentic management system and not a harness ([the harness decision](../docs/ddr/000T-the-workbench-is-an-agentic-management-system-not-a-harness.md)).

**Sources, linked and never copied.**

- "Harness engineering: leveraging Codex in an agent-first world", OpenAI, 2026-02-11: https://openai.com/index/harness-engineering/. The seminal statement: AGENTS.md as a short map, a `docs/` knowledge base, mechanical enforcement of documentation structure, agent-to-agent review, an agent-legible running product, and recurring garbage collection of drift.
- Ryan Lopopolo's harness-engineering corpus: https://github.com/lopopolo/harness-engineering. Repository-authored material is CC BY 4.0; the Workbench links and attributes it and does not copy it. It is meant to be pointed at alongside another repository as read-only guidance. Its `playbooks/improve-harness.md` is the loop the Workbench's single improvement skill, [improve-harness](skill-improve-harness.md) ([source](../skills/improve-harness/SKILL.md)), follows: baseline, earliest gap, smallest owning intervention, native verification, fresh rerun, then retain, revise or remove ([the playbook decision](../docs/ddr/001I-harness-improvement-is-one-playbook-not-a-family-of-review-skills.md)). Its `ARCHITECTURE.md`, an ownership table and invariants, and matklad's post "ARCHITECTURE.md" (https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html) are the models for the Workbench's own ([the Lexicon retirement decision](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)).

**The twelve directions.** The comparison that opened the owner's review set the Workbench beside the article category by category. The owner made each category a landmark ([the twelve directions decision](../docs/ddr/001H-the-twelve-harness-engineering-directions-are-landmarks.md)): Repo is the System of Record, Progressive Disclosure, Durable Plans, Agent to Agent Review, Mechanical Enforcement, Learn from Failure, Agent Visible Runtime, Continuous Cleanup, Human Attention Minimized, Multi Agent and Provider Coordination, Owner Idea Alignment, and Autonomous Execution. Multi Agent and Provider Coordination and Owner Idea Alignment are what the Workbench adds beyond the article; Autonomous Execution is the owner's name for the destination where humans steer and agents execute.

**How the article's documents map onto the Workbench** ([the Blueprint decision](../docs/ddr/001G-the-blueprint-keeps-its-name-and-decision-records-are-the-design-doc-layer.md)):

| Article | Workbench |
|---|---|
| AGENTS.md as the map | `AGENTS.md`, the only Contract file |
| Product spec | `BLUEPRINT.md`, the destination |
| Design docs, one per decision | DDRs and ADRs under `workbench/docs/` |
| Exec plans | Landmarks, Specs and Tasks |
| References | This Wiki |
| Quality score | `doctor` and the guardrail baseline |

**The questions a design review asks of the Workbench.** Context: does a cold agent receive only what it needs? Routing: can it find deeper context without broad searching? Legibility: can it inspect both the repository and the running product? Ownership: does every durable truth have exactly one owner? Enforcement: are the important invariants executable rather than prose? Autonomy: can agents complete the loop without a human relay? Feedback: does a failure improve the environment rather than cause another prompt? Entropy: is there a mechanism that removes stale rules and duplicated knowledge? These are the review's questions, not the landmark set; the owner kept the twelve categories as the landmarks.
