---
date: 2026-10-03
canonicalized_in:
  - RUNBOOK.md
---

# Overlapping notepad writes are refused, not lost

This narrows [ADR-000L](000L-a-notepad-belongs-to-its-objective-and-every-chat-working-that-objective-writes-to-it.md), which decided notepad ownership and left concurrency undecided. That record described a runtime defect with no owning Spec: two contexts that read the same revision both passed the `--revision` check, and the later rename silently replaced the earlier write. As of 2026-10-03 that defect has an owner and a fix. [Notepad Concurrent-Write Safety](../../specs/S-003Y-notepad-concurrent-write-safety/SPEC.md) (S-003Y, Task TK-006H, PR #300) added a compare-and-swap inside the runtime. Every revision-checked write (`append`, `current`, `trim` and `delete`) publishes only under a per-revision publish token, and only if the note still holds exactly the bytes the writer read. Of overlapping writers that read the same record, one publishes and the others are refused `stale-revision`. No success is reported for a write that is not in the note, and an abandoned token is reclaimed after ten seconds, so no writer wedges a note.

Everything else in ADR-000L stands: objective ownership, several linked notes, the purpose-distinct creation rule, the writer-neutral reading of a refusal and writes one writer at a time as practice. Two passages no longer describe the runtime: the one saying overlapping writers both pass and the loss is silent, and the statement that the defect has no owning Spec. ADR-000L's text stays unchanged as the record of its time.

Considered and rejected: editing ADR-000L's accepted text, because accepted decisions change through the lifecycle, not by rewriting. Superseding ADR-000L whole, because its ownership decision stands unchanged and a successor would only restate it. A lock file held across the whole command, a lease held by the writing chat and a coordination process, which S-003Y's Plan rejected because they add mandatory coordination ADR-000L already rejects, and because a lock held across validation widens what a crash can leave behind.

Consequences: [RUNBOOK](../../../RUNBOOK.md) JSON Notepads describes the guard and keeps one writer at a time as the working rule. The `notepad` skill's writer paragraph says an overlapping write is refused rather than lost. `AGENTS.md` Session Records and the `LEXICON.md` Notepad row keep "one writer at a time" unchanged and claim nothing more. The guard covers notepad writes only. The Landmark Tracker's `--expect-revision` writes, session transport `resume` and `sessions.mjs promote` are separate seams that S-003Y names for their own follow-up Specs.

Provenance: [S-003Y](../../specs/S-003Y-notepad-concurrent-write-safety/SPEC.md) Plan decisions of 2026-10-03, TK-006H merged into integration as PR #300 after four separate-context reviews, and TK-006J's reconciliation of the skill, Contract and this record.
