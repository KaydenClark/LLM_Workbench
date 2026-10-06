---
date: 2026-10-05
supersedes:
canonicalized_in:
  - BLUEPRINT.md
  - AGENTS.md
---

# An agent pays context only for information that can change what it does next

Landmark: Progressive Disclosure.

An agent pays context for a line, a page or a record only when that information can change what it does next. Everything else is reached by a pointer when the work needs it. This is the test every line of the always-loaded file must pass, and the pruning test for the rest of the harness.

Why the owner chose it:

- The owner, in his own words (2026-10-05): "'An agent should only pay context for information when it can change what is next' Is key".
- Confirmed as a Blueprint promised outcome and the test every carrier line must pass (readback confirmed 2026-10-05).

Considered and rejected: a line-count target for the always-loaded file. The owner chose the test over a number (2026-10-05, on the Runbook: "No line limit, but same as blueprint and agents. I expect small").

Consequences: the Blueprint promises it; the Contract carrier rewrite applies it line by line; the smart-zone decision ([Every session works inside its smart zone and spends its tokens efficiently](000E-every-session-works-inside-its-smart-zone-and-spends-its-tokens-efficiently.md)) and the fresh-session decision ([A fresh session loads only the context its work needs](000F-a-fresh-session-loads-only-the-context-its-work-needs.md)) gain this as their concrete test.

Provenance: the owner's review of Codex's recommendation, 2026-10-05, where the owner named the sentence as key; readback confirmed the same day.
