---
name: writing-for-agents
description: Write agent instructions when creating or editing skills, AGENTS.md, CLAUDE.md, or reference documents agents reach through pointers.
---

# Writing for agents

Make an agent's process predictable while preserving the user's intended outcome and authority. This reference applies to skills, steering files and documents agents load through links. When authoring a skill, also read [Skill mechanics](SKILL-MECHANICS.md) for invocation and portable packaging.

## Context pointers

A context pointer names material outside the current context and states when to read it. Skill descriptions and routing lines in steering files serve the same purpose. State what the material supplies and one trigger for each distinct branch. Lead with the concept the user would actually name; collapse synonyms for the same branch.

A required reference behind a vague pointer is a discovery problem. Sharpen that pointer before moving the whole reference into always-loaded context. Verify that its target exists and that the condition covers the cases that need it.

## Information hierarchy

Keep ordered actions as steps and definitions, caveats and rules as reference. Inline what every branch needs; disclose branch-specific material through a pointer. Keep a concept's definition and qualifications together, so a reader sees them in one place.

Every always-loaded line spends context and attention on every run. Every additional document asks the human to remember another route. Spend these costs only where the material improves the decisions or preserves meaningful human choice. A short self-contained skill needs no extra router or reference files.

## Completion criteria

End each step with an observable condition that separates done from unfinished. Name the required coverage: accounting for every changed boundary is stronger than merely producing a list. Prefer a local, checkable condition over a vague claim of understanding.

If an agent repeatedly rushes a genuinely ambiguous step, first sharpen its completion condition. Split sequences only when observed behavior justifies it. Hiding later steps requires a real context boundary; moving them under another heading or loading another skill in the same context does not clear them. Splitting instructions does not authorize delegation.

## Leading words

Use familiar concepts such as lesson, seam or red when they carry the intended meaning. Repeat a useful term consistently rather than repeating its definition. Define unfamiliar terms before relying on them; concise wording earns its place through clearer behavior, not through new jargon.

State the desired action positively. Preserve a necessary prohibition when it protects a real boundary, and pair it with the action the agent should take instead. Pruning wording must preserve accepted requirements and unresolved decisions.

## Pruning

Keep each rule with one owner and link to it from other readers. Read current scripts, configuration, layout and tool help rather than caching cheap lookups in instructions. Retain the convention, rationale or hidden dependency that those sources cannot explain.

Check every sentence for relevance and whether it changes the agent's behavior. Remove stale layers, duplicates and no-ops; shorten sprawl through meaningful disclosure. A no-op claim is model-relative: when uncertain, compare actual runs instead of assuming the instruction is useless. After editing, read every affected route and completion condition, and exercise a representative request when the change affects behavior. Report structural validation separately from behavioral evidence.

## Source and ownership

Adapted from Matt Pocock's [writing-for-agents](https://github.com/mattpocock/skills/blob/d81f3a183412e71a5b1e84ca21bc1a35eea03a60/skills/productivity/writing-for-agents/SKILL.md), MIT, and the preserved writing-great-skills reference. The upstream pin is d81f3a183412e71a5b1e84ca21bc1a35eea03a60. The producing Workbench retains its notice in THIRD_PARTY_NOTICES.md. Apply this reference within the current assignment and use [to-docs](../to-docs/SKILL.md) to maintain the existing documentation owner.
