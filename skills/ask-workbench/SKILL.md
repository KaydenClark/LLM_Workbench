---
name: ask-workbench
description: Route a situation to the smallest appropriate Workbench skill or flow.
disable-model-invocation: true
---

# Ask Workbench

Use this when the owner knows what they want to accomplish but does not remember
which skill starts the right flow.

1. Read the selected definitions in [`../README.md`](../README.md).
2. Inspect the current request and the repository's live control surfaces.
3. Recommend one starting skill and, when useful, the short sequence that
   follows it. Explain the fit in one or two sentences.
4. Ask at most one question only when two routes would produce materially
   different work. Otherwise make the recommendation immediately.
5. Do not invoke the recommended skill until the owner asks to proceed.

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

Supporting skills may join that flow, but they never create a second tracker or
truth layer. `LEXICON.md`, `BLUEPRINT.md`, the owning `SPEC.md`, `TASKBOARD.md`,
and `RUNBOOK.md` retain their documented ownership.
