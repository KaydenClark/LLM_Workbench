---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner reaction 2026-09-23 to nineteen "only you can decide" rows he had already answered
  - Promoted from host auto-memory by the S-00V TK-00I audit, 2026-09-26
source_paths:
  - workbench/wiki/grilling-destination-audit-ledger.json
  - AGENTS.md
last_verified: 2026-09-26
---

# Derive before asking the owner

Before listing anything as an owner decision, look for his answer. On
2026-09-23 an agent sent nineteen "only you can decide" rows; the owner had
answered most of them in grilling sessions, and several were never real
questions. They came from an agent-run audit whose notes held only agent
proposals, because his chat answers had not been written back.

## How to look

1. The [grilling destination audit ledger](grilling-destination-audit-ledger.json)
   is the durable copy of every owner answer: look the question up by `id` or by
   topic, and read its `status` (`locked`, `answered-in-chat`, `not-a-question`,
   `withdrawn` and so on).
2. Locked decisions that imply the answer: active ADRs, the assigned Spec's
   Decisions And Contracts, the Lexicon.
3. Local working records and session transcripts, when the host has them. They
   are not durable evidence, and a cloud instance will not have them; that is why
   the ledger exists.

An "open" status in a notepad is not evidence he has not answered. A question
whose origin is an agent audit is not an owner question until it names a real
product tradeoff. Escalate only a tradeoff with no answer anywhere, with options,
a recommendation and the cost, and say what you searched
([AGENTS Safety And Change Control](../../AGENTS.md#safety-and-change-control)).

Related: [finish-authorized-work](finish-authorized-work.md),
[design-interviews-are-forward-looking](design-interviews-are-forward-looking.md).
