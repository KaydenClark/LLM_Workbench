---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Seeded from the current answers of the Notepads landmark's question cards (landmark record revision 1), 2026-10-04
source_paths:
  - workbench/landmark-tracker/landmarks
  - workbench/landmark-tracker/destination-questions
  - workbench/docs/adr/000L-a-notepad-belongs-to-its-objective-and-every-chat-working-that-objective-writes-to-it.md
  - workbench/docs/adr/000Z-overlapping-notepad-writes-are-refused-not-lost.md
  - workbench/docs/adr/0054-direct-promotion-into-durable-owners.md
parent: none
authorized_by: the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages)
last_verified: 2026-10-04
---

# Landmark: Notepads

This page is the evolving synthesis of the Notepads landmark
([Notepads landmark record (LMK-000S)](../../landmark-tracker/landmarks/LMK-000S.json)).
It sums up, in prose, what the landmark's six question cards currently say
about working-session notes, and is updated whenever one of them changes. The
cards and the landmark record keep the structured account and the lineage. The
decision records, the Contract and the skill named below govern. For how the
skill itself works, read the flat note [Notepad: preserve one objective's working
context](../skill-notepad.md), which goes deeper on the procedure than this
synthesis.

## What the landmark is

Working sessions produce reasoning, corrections and unfinished state that would
be lost to the next agent. The landmark covers the working record, the JSON
notepad, and its companion the Markdown handoff: what they preserve, whom they
belong to, when they may outlive a session, and how they relate to the durable
owners that eventually hold the settled truth. It matters because continuity is
the Workbench's promise, but a note is only working context: it authorizes
nothing and proves nothing.

Every card below says its source answers were settled by the owner in earlier
grilling sessions, except where noted; the card's own grouping, title and
synthesis are agent work and not separately owner-confirmed.

## Current accepted answers

- **A truthful cold continuation.** A fresh agent needs the Workbench Contract,
  the selected work packet and its linked owners, the exact achieved output or
  commit, the current Task and Spec state, the named verification, and the next
  executable action or blocker. An interrupted agent cannot be forced to save, but
  records this state in existing owners as it works; there is no universal
  handoff artifact and no duplicated truth
  (card [DQC-004N: "What must survive for a truthful cold continuation?"](../../landmark-tracker/destination-questions/DQC-004N.json), revision 6).
  Decision record
  [Decision record "Workbench continuity through maintained owners"](../../docs/adr/0043-workbench-continuity-through-maintained-owners.md)
  makes continuity the product promise carried by maintained owners, with notes as
  one mechanism.
- **A notepad belongs to its objective.** A handoff is Markdown for a new chat or
  agent; a notepad is the JSON working record, and it belongs to its objective,
  not to the chat, model or host that created it
  (card [DQC-004O: "What does an objective notepad preserve, and whom does it belong to?"](../../landmark-tracker/destination-questions/DQC-004O.json), revision 6;
  [Decision record "A notepad belongs to its objective and every chat working that objective writes to it"](../../docs/adr/000L-a-notepad-belongs-to-its-objective-and-every-chat-working-that-objective-writes-to-it.md)).
- **Promote before the end.** For almost every session the goal is to promote
  settled claims into their durable owners, append the receipt, push, and let the
  notepad die
  (card [DQC-004Q: "When should working material be promoted instead of copied into a checkpoint?"](../../landmark-tracker/destination-questions/DQC-004Q.json), revision 6).
  The owner amended this: notes and handoffs may be committed for a while when
  needed, undoing the lock that they are never committed. A committed note is
  transport, not evidence, privacy rules stand, and the optional private transport
  stays optional
  (card [DQC-004S: "When may notes and handoffs persist or be committed for transport?"](../../landmark-tracker/destination-questions/DQC-004S.json), revision 8;
  [Decision record "Optional private Git transport for session continuity"](../../docs/adr/0051-optional-private-git-transport-for-session-continuity.md)).
- **Where current pre-delivery understanding lives.** Existing grilling sources
  keep their jobs and are not moved or replaced. Question cards synthesize related
  source questions and keep evolving understanding and lineage, landmarks connect
  it around a feature, and the generated tracker projects those records. The
  grilling notepads remain, but become more historical and handoff-like rather
  than the primary current account
  (card [DQC-005Y: "Where does pre-delivery understanding live, and what becomes of the grilling sources?"](../../landmark-tracker/destination-questions/DQC-005Y.json), revision 8).

## Newer decisions that revise these cards

- card [DQC-004O: "What does an objective notepad preserve, and whom does it belong to?"](../../landmark-tracker/destination-questions/DQC-004O.json), revision 6
  and the second card on persistence
  (card [DQC-004S: "When may notes and handoffs persist or be committed for transport?"](../../landmark-tracker/destination-questions/DQC-004S.json), revision 8)
  record the owner's answer that ownership is decided but concurrency is not.
  The later decision
  [Decision record "Overlapping notepad writes are refused, not lost"](../../docs/adr/000Z-overlapping-notepad-writes-are-refused-not-lost.md)
  narrows that: it describes the runtime as refusing overlapping writes rather than losing them,
  while objective ownership, linked notes and writing one at a time stand.
- card [DQC-004N: "What must survive for a truthful cold continuation?"](../../landmark-tracker/destination-questions/DQC-004N.json), revision 6
  says an agent should "promote a checkpoint" when its session reasoning is
  material. The accepted decision
  [Decision record "Direct promotion into durable owners"](../../docs/adr/0054-direct-promotion-into-durable-owners.md)
  and the Contract now promote directly into the durable owner, and no new
  checkpoint copy is created; read the card's checkpoint as that direct promotion.
- card [DQC-005Y: "Where does pre-delivery understanding live, and what becomes of the grilling sources?"](../../landmark-tracker/destination-questions/DQC-005Y.json), revision 8
  places current understanding in question cards and landmark records. The decision
  [Decision record "The Wiki is the evolving synthesis every agent reads and updates"](../../docs/adr/000R-the-wiki-is-the-evolving-synthesis-every-agent-reads-and-updates.md)
  says the Wiki is the evolving synthesis that cards and landmarks are summarized
  into, which is the job of this page, and
  [Decision record "Landmarks are LANDMARK.md artifacts one size above Specs"](../../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md)
  retires the landmark JSON records into question cards. The card's tracker design
  stands as the tooling and state, not the readable account.

## Open and unresolved

- How still-needed pre-schema notes remain readable has no owner answer: the card
  records the question as open and its answer as unconfirmed
  (card [DQC-004R: "How should still-needed pre-schema notes remain readable?"](../../landmark-tracker/destination-questions/DQC-004R.json), revision 4).
  Inference: the notepad skill currently preserves legacy paths and never rewrites
  legacy records, but that is the skill's present behavior, not an owner ruling on
  the compatibility obligation.
- The Spec and Task parts of the relationship between chat, notepad, handoff, Spec
  and Task continuity remain unstated beyond the Packet definition
  (card [DQC-004O: "What does an objective notepad preserve, and whom does it belong to?"](../../landmark-tracker/destination-questions/DQC-004O.json), revision 6;
  card [DQC-004S: "When may notes and handoffs persist or be committed for transport?"](../../landmark-tracker/destination-questions/DQC-004S.json), revision 8).
- Inference: the owner's amendment allowing temporary commits of notes is not yet
  reflected in the shared controls. As of 2026-10-04 the Contract still says live
  notes and handoffs stay untracked, the sessions lane still ignores them, and no
  decision record narrowing the earlier untracked rule exists; the work is recorded
  in [Portable Workbench (S-00V)](../../specs/S-00V-portable-workbench/SPEC.md)
  and is not claimed delivered here.
- Inference: the concurrency guard that decision
  [Decision record "Overlapping notepad writes are refused, not lost"](../../docs/adr/000Z-overlapping-notepad-writes-are-refused-not-lost.md)
  describes comes from [Notepad Concurrent-Write Safety (S-003Y)](../../specs/S-003Y-notepad-concurrent-write-safety/SPEC.md);
  this page has not re-verified the runtime.

## Where the work lives

The notepad foundation and runtime: [JSON Notepad Foundation (S-046)](../../specs/S-046-json-notepad-foundation/SPEC.md) and
[notepads.mjs](../../tools/notepads.mjs); the skill rebuild:
[notepad skill rebuild (S-00Y)](../../specs/S-00Y-notepad-skill-rebuild/SPEC.md) and the skill itself
([SKILL.md](../../skills/notepad/SKILL.md)). Concurrency:
[Notepad Concurrent-Write Safety (S-003Y)](../../specs/S-003Y-notepad-concurrent-write-safety/SPEC.md). Checkpoint retirement: [Checkpoint Retirement (S-048)](../../specs/S-048-checkpoint-retirement/SPEC.md).
Optional transport: [Private Session Transport (S-052)](../../specs/S-052-private-session-transport/SPEC.md). The tracker that carries the cards:
[Landmark Tracker Foundation (S-01T)](../../specs/S-01T-landmark-tracker-foundation/SPEC.md). Decisions:
[Decision record "A notepad belongs to its objective and every chat working that objective writes to it"](../../docs/adr/000L-a-notepad-belongs-to-its-objective-and-every-chat-working-that-objective-writes-to-it.md),
[Decision record "Overlapping notepad writes are refused, not lost"](../../docs/adr/000Z-overlapping-notepad-writes-are-refused-not-lost.md),
[Decision record "JSON notepads preserve objective continuity"](../../docs/adr/0040-json-notepads-preserve-objective-continuity.md),
[Decision record "Direct promotion into durable owners"](../../docs/adr/0054-direct-promotion-into-durable-owners.md) and
[Decision record "A handoff is the readable map to the high-fidelity context"](../../docs/ddr/000K-a-handoff-is-the-readable-map-to-the-high-fidelity-context.md)
for the handoff as the readable map to high-fidelity context.

## Related pages

[Skill: handoff](../skill-handoff.md) and [Landmark Tracker](landmark-tracker.md)
cover the neighbors; [Landmark: GitHub Coordination](landmark-github-coordination.md)
shows the same page shape.

## Evidence and Sources

- [Notepads landmark record (LMK-000S)](../../landmark-tracker/landmarks/LMK-000S.json): title, summary, importance and history.
- The six question cards named above, each at the revision cited.
- The accepted decision records and the Contract text read on 2026-10-04 for the
  observed gaps noted under open items.

## History

- 2026-10-04: created by the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages), seeded from the cards' current answers.
