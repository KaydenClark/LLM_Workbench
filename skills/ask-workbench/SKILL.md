---
name: ask-workbench
description: Route a situation to the smallest appropriate Workbench skill or flow.
disable-model-invocation: true
---

Use the selected catalog in [`../README.md`](../README.md) to recommend one
starting skill and, when useful, the short sequence after it. Ask one question
only when two routes would produce materially different work. Wait for the user
to ask before starting the recommended skill.

Default routes:

- unclear idea or unresolved product decisions: `/grill-me`;
- shared project terms are unclear: `/ubiquitous-language` or
  `/domain-modeling`;
- settled conversation needs a durable work packet: `/to-spec`;
- a spec needs executable slices: `/to-tickets`;
- one eligible slice is ready to build: `/implement`;
- the route to a large destination is still foggy: `/wayfinder`;
- a runnable answer is needed before deciding: `/prototype`;
- a hard bug lacks a proven cause: `/diagnosing-bugs`;
- a diff needs independent standards/spec review: `/code-review`;
- the project is difficult for agents to change safely:
  `/improve-codebase-architecture`;
- the current session needs to continue elsewhere: `/handoff`.

The main delivery flow is:

`grill-me -> to-spec -> to-tickets -> implement -> code-review`
