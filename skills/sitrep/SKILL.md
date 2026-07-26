---
name: sitrep
description: Give a smallest-scope conversational situation report and investigate deeper only when the live evidence is insufficient.
---

# Sitrep

Give a conversation-only, read-only answer to: what is happening, what matters,
and what should happen next? Use the smallest sufficient scope.

A sitrep is a **read of Projection** spoken into the conversation — the plane
every agent reads constantly and none writes. That is why it may route but
never authorize, and why it creates nothing durable.

1. Verify only the live facts needed to route the question: canonical path,
   branch/upstream, dirty or diverged work, active spec/ticket, named validation,
   relevant runtime, and current owner gate.
2. Separate verified fact, inference, risk, and recommendation. Show freshness
   when stale evidence could change the answer.
3. Dispatch one bounded Scout task only when evidence is missing, stale,
   contradictory, or insufficient. Scout remains strictly read-only.
4. Return the important state, why it matters, the next safe action, and the one
   owner decision if needed. Do not dump files or routine detail.

A projection read may **route** but never **authorize**. A sitrep may
recommend; it never authorizes execution. When the next step is a
side-effectful launch, the room's launch preflight (GPT_OS:
`node tools/preflight.mjs`) is the gate — "sitrep said ready" is never
sufficient, because a sitrep reads recorded state and a preflight verifies
live ground truth.

Create no durable artifact by default — the Projection write band belongs to
Pawns, so a sitrep that authored one would be writing a plane it only reads. If
the investigation discovers stable knowledge worth keeping, perform a separate
`/to-docs` step within the current authority; never copy live ticket state into
a Wiki note.
