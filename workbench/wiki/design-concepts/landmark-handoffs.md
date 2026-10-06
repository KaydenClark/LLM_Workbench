---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Seeded from the current answers of the Handoffs landmark's question cards (landmark record revision 1), 2026-10-04
source_paths:
  - workbench/landmark-tracker/landmarks
  - workbench/landmark-tracker/destination-questions
  - workbench/docs/ddr/000K-a-handoff-is-the-readable-map-to-the-high-fidelity-context.md
  - workbench/docs/adr/000L-a-notepad-belongs-to-its-objective-and-every-chat-working-that-objective-writes-to-it.md
  - workbench/skills/handoff/SKILL.md
parent: none
authorized_by: the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages)
last_verified: 2026-10-04
---

# Landmark: Handoffs

This page is the evolving synthesis of the Handoffs landmark
(landmark [Handoffs landmark (LMK-000P)](../../landmark-tracker/landmarks/LMK-000P.json)).
It sums up what the landmark's four question cards currently say, in prose, and
is updated whenever one of them changes. The cards and the landmark record keep
the structured account; the decisions and the handoff skill govern. For how the
skill behaves, read the Wiki page [Handoff: pass one objective to a named recipient](../skill-handoff.md).

## What the landmark is

A receiving agent can continue one objective from readable context, stated
boundaries, evidence and a concrete next action. It matters because the owner
should not have to reconstruct a conversation to continue the work, and because
a handoff that widens its own authority, or that exists only as a file nobody
can act on, fails the objective it was written for.

## Current accepted answers

Each card records its source answers as owner-settled in their grilling
sessions; the card's grouping, title and synthesis are agent work and were not
separately confirmed.

- **A handoff is readable Markdown, and it succeeds when it lets the next chat
  finish.** Card
  [DQC-004P: "What makes a handoff useful to its receiving context?"](../../landmark-tracker/destination-questions/DQC-004P.json), revision 9:
  a handoff is a human-readable Markdown file, and the JSON notepad stays the
  working record and is not the handoff. It succeeds when the new chat can
  complete the task it was created for with the authority and context the
  handoff carries, not when the ceremony after the file exists is done. A
  fresh Chat is needed when the context is used up and for the
  separate-context review, each Task gets its own Chat, and a notepad belongs
  to its objective, not to the chat, model or host that created it. The
  decision record
  ["A handoff is the readable map to the high-fidelity context"](../../docs/ddr/000K-a-handoff-is-the-readable-map-to-the-high-fidelity-context.md)
  states the same in the owner's terms: Markdown is for what agents pick up and
  read, JSON is for state and tooling, and a handoff points to the context so
  no work is redone.
- **A handoff preserves the exact job the owner named.** Card
  [DQC-002K: "How does a grilling or handoff endpoint preserve the owner’s intended scope?"](../../landmark-tracker/destination-questions/DQC-002K.json), revision 10:
  an explicit instruction to stop or hand off ends a grilling session, and the
  handoff then carries the named task, its limits and the context from the
  notepad. If the job is to promote and write Specs, the recipient writes
  those Specs and does not implement them. In the one historical case the card
  records, the authorized runway excluded merging to main, changing
  visibility or credentials, importing Foundry machinery and any release claim
  without proof.
- **Cold continuation uses the existing owners.** Card
  [DQC-004N: "What must survive for a truthful cold continuation?"](../../landmark-tracker/destination-questions/DQC-004N.json), revision 6:
  a cold start needs the Contract, the selected work packet and its linked
  owners, the exact achieved output or commit, current Spec and Task state,
  named verification, and the next executable action or blocker. An
  interrupted agent cannot be forced to save, but records this in the existing
  owners as it works. No universal handoff artifact and no duplicated truth.
  This matches the decision
  ["Workbench continuity through maintained owners"](../../docs/adr/0043-workbench-continuity-through-maintained-owners.md).
- **Notes and handoffs may travel, but they are not evidence.** Card
  [DQC-004S: "When may notes and handoffs persist or be committed for transport?"](../../landmark-tracker/destination-questions/DQC-004S.json), revision 8:
  the goal for almost every session is to promote settled claims, append the
  receipt, push and let the notepad die. With the owner's amendment, notepads
  and handoffs may stay, and may be committed for a while when needed, as
  transport and not as evidence; privacy rules stand and the optional private
  transport of the decision
  ["Optional private Git transport for session continuity"](../../docs/adr/0051-optional-private-git-transport-for-session-continuity.md)
  stays optional. The card also records that a notepad belongs to its
  objective, which the decision
  ["A notepad belongs to its objective and every chat working that objective writes to it"](../../docs/adr/000L-a-notepad-belongs-to-its-objective-and-every-chat-working-that-objective-writes-to-it.md)
  accepted.

## Open and unresolved

- **Handoff authority has moved.** The card on preserving scope still records
  inherited authorization. The role-based correction the owner confirmed on
  2026-10-01, and the Handoff assignments section of [AGENTS](../../../AGENTS.md),
  now say a handoff's instructions carry no independent authority and the
  recipient follows its assigned job under the current controls. The skill's
  source alignment with that correction is still open in
  [handoff skill rebuild (S-01A)](../../specs/S-01A-handoff-skill-rebuild/SPEC.md).
- **Committed transport is not delivered in the controls.** The card records
  the owner's amendment, but [AGENTS](../../../AGENTS.md) still says live notes
  and handoffs stay untracked, the sessions folder's ignore file still excludes
  them, and no decision record was found that narrows the earlier untracked rule
  ["Live session records stay untracked; durable references target promoted checkpoints"](../../docs/adr/0028-live-session-records-stay-untracked-and-checkpoints-are-durable.md).
  Under the State Resolution rule this is an implementation gap, not a
  settled change in the controls.
- **Checkpoints.** The cold-continuation card mentions promoting a checkpoint;
  the controls now say no new checkpoint copy is created, and promotion goes
  directly into the durable owners
  (["Direct promotion into durable owners"](../../docs/adr/0054-direct-promotion-into-durable-owners.md)).
- **Open part of the continuity question.** The card on the handoff's use
  and the card on persistence both record that the Spec and Task parts of the
  relationship among chat, notepad, handoff, Spec and Task remain unstated
  beyond the Packet row.
- **Concurrent notepad writes.** The decision
  ["Overlapping notepad writes are refused, not lost"](../../docs/adr/000Z-overlapping-notepad-writes-are-refused-not-lost.md)
  narrows the notepad ownership decision on concurrency; the runtime work is
  owned by [Notepad Concurrent-Write Safety (S-003Y)](../../specs/S-003Y-notepad-concurrent-write-safety/SPEC.md),
  which this page does not claim is delivered.

## Where the work lives

The handoff skill ([source](../../skills/handoff/SKILL.md)) and the notepad skill
([source](../../skills/notepad/SKILL.md)) carry the procedures; the
[notepad Wiki page](../skill-notepad.md) explains the latter. Specs:
[handoff skill rebuild (S-01A)](../../specs/S-01A-handoff-skill-rebuild/SPEC.md),
[JSON Notepad Foundation (S-046)](../../specs/S-046-json-notepad-foundation/SPEC.md),
[Notepad Concurrent-Write Safety (S-003Y)](../../specs/S-003Y-notepad-concurrent-write-safety/SPEC.md),
[Private Session Transport (S-052)](../../specs/S-052-private-session-transport/SPEC.md),
[Portable Workbench (S-00V)](../../specs/S-00V-portable-workbench/SPEC.md) and the earlier v3 Spec
[Portable Workbench (S-021)](../../specs/S-021-portable-workbench-v3/SPEC.md).
Decisions: the records linked above and
["JSON notepads preserve objective continuity"](../../docs/adr/0040-json-notepads-preserve-objective-continuity.md).

## Related pages

[Task artifact and lifecycle](task-artifact-and-lifecycle.md) explains the Packet
and receipt a handoff feeds; [Roles and stances](roles-and-stances.md) explains
who may hand off to whom.

## Evidence and Sources

- [Handoffs landmark record (LMK-000P)](../../landmark-tracker/landmarks/LMK-000P.json): title, summary and importance.
- The four question cards named above, each at the revision cited.
- [AGENTS](../../../AGENTS.md): the operative handoff and session-record rules.

## History

- 2026-10-04: created by the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages), seeded from the cards' current answers.
