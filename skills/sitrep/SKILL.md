---
name: sitrep
description: Give a smallest-scope conversational situation report and investigate deeper only when the live evidence is insufficient.
disable-model-invocation: true
---

# Sitrep

Give a conversation-only, read-only answer to: what is happening, what matters,
and what should happen next? Use the smallest sufficient scope.

1. Verify only the live facts needed to route the question: canonical path,
   branch/upstream, dirty or diverged work, active spec/ticket, named validation,
   relevant runtime, and current owner gate.
2. Separate verified fact, inference, risk, and recommendation. Show freshness
   when stale evidence could change the answer.
3. Dispatch one bounded Scout task only when evidence is missing, stale,
   contradictory, or insufficient. Scout remains strictly read-only.
4. Return the important state, why it matters, the next safe action, and the one
   owner decision if needed. Do not dump files or routine detail.

Create no durable artifact by default. If the investigation discovers stable
knowledge worth keeping, perform a separate `/to-docs` step within the current
authority; never copy live ticket state into a Wiki note.
