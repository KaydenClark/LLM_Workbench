---
name: grilling
description: Grill unresolved product decisions into a shared design concept before planning or building.
---

# Grilling

Use the project's accepted **Design concept** definition in `LEXICON.md` as the
shared design concept completion target. Relentless means exhaustive decision
coverage delivered with a calm, collaborative tone.

## Ground The Interview

1. Read the current conversation and the smallest relevant live project
   controls, source, tests, and accepted vocabulary. Research discoverable
   facts with available tools; the agent owns that research legwork.
2. Separate evidence, inference, and owner decisions. Correct stale assumptions
   before asking a question that depends on them.
3. Build a private decision map covering the relevant branches: product
   promise, participants and users, desired experience, scope and non-goals,
   constraints, system boundaries, success and acceptance, risks, and open
   unknowns. Order questions by dependency and start with the decision that
   collapses the most downstream branches.

Grounding is complete when the next unresolved owner decision and the facts it
depends on are clear.

## Run The Decision Loop

For each unresolved branch:

1. Ask **one concise decision question at a time**.
2. Put the **recommended answer first**, with one short reason grounded in the
   known goal and constraints. Offer two or three concrete choices only when
   real alternatives exist.
3. End with a low-effort response cue: the user may answer with a choice,
   yes/no, or a correction. Accept short or approximate answers; infer the full
   decision and ask for correction when needed.
4. Wait for the answer. Treat agreement with the recommendation as a complete
   answer.
5. Update a conversation-level **decision ledger** with settled decisions,
   assumptions, contradictions, and open questions. If an answer conflicts
   with an earlier decision, surface the conflict and resolve it before moving
   down a dependent branch.

At natural checkpoints, give a compact ledger recap. If the user pauses, return
the current shared understanding and the single next unresolved decision so a
later session can resume without restarting.

## Confirm Shared Understanding

When every relevant decision-map branch is settled or explicitly deferred,
present one compact design-concept summary containing:

- the product promise and intended participants;
- the agreed experience, scope, boundaries, and non-goals;
- the important constraints and decisions;
- success criteria;
- deferred decisions, risks, and assumptions.

Check that the summary is internally coherent and traceable to the user's
answers. Then ask for **explicit confirmation** that it matches the shared
understanding.

Remain in interview mode until the user gives explicit confirmation. After
confirmation, report that grilling is complete and recommend the smallest next
Workbench entry point. Planning, durable documentation, and implementation
begin only in that separately invoked next step.
