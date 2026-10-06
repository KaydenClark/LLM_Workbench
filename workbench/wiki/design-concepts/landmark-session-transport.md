---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Seeded from the current answers of the Session Transport landmark's question cards (landmark record revision 1), 2026-10-04
source_paths:
  - workbench/landmark-tracker/landmarks
  - workbench/landmark-tracker/destination-questions
  - workbench/docs/adr/0051-optional-private-git-transport-for-session-continuity.md
  - workbench/docs/adr/000L-a-notepad-belongs-to-its-objective-and-every-chat-working-that-objective-writes-to-it.md
  - workbench/specs/S-052-private-session-transport/SPEC.md
parent: none
authorized_by: the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages)
last_verified: 2026-10-04
---

# Landmark: Session Transport

This page is the evolving synthesis of the Session Transport landmark
(landmark ["Session Transport" (LMK-000T)](../../landmark-tracker/landmarks/LMK-000T.json)).
It sums up, in prose, what the landmark's three question cards currently say and
is updated whenever one of them changes. The cards and the landmark record keep
the structured account and the lineage; the decision records and Specs named
below govern. The procedure for working notes is explained in
[the notepad skill note](../skill-notepad.md) and the handoff in
[the handoff skill note](../skill-handoff.md).

## What the landmark is

Session Transport is about how selected private working context, such as a
notepad or a handoff, can move between environments without losing changes and
without forcing transport onto work that stays local. It matters because moving
working notes can leak private context, can let a note stand in for evidence, or
can silently overwrite another context's changes.

## Current accepted answers

For all three cards the source answers were settled by the owner in their
grilling sessions; the cards' grouping and titles are agent work and were not
separately confirmed, so this page states the settled answers as claims and the
grouping as structure only.

**Promote first, and notes may travel when needed.** For almost every session
the goal is to promote settled claims, append the receipt, push and let the
notepad die. The owner amended this: notepads and handoffs may stay, and may be
committed for a while when continuation needs it, which lifts the earlier rule
that they are never committed. A committed note is transport, not evidence,
privacy rules stand, and the optional private transport decision stays optional.
The same card records what the two records are: a handoff is Markdown for a new
Chat or agent, and a notepad is the JSON working record, belonging to its
objective rather than to the Chat, model or host that created it
(card [DQC-004S: "When may notes and handoffs persist or be committed for transport?"](../../landmark-tracker/destination-questions/DQC-004S.json), revision 8).
The ownership half is the decision record
[A notepad belongs to its objective and every chat working that objective writes to it](../../docs/adr/000L-a-notepad-belongs-to-its-objective-and-every-chat-working-that-objective-writes-to-it.md),
which decides ownership only and keeps writes one at a time.

**Optional private Git transport.** Continuity across machines uses optional
private Git transport with a stable Workbench identity, selected live
collections, one writer per note, preserved conflicts and explicit remote
confirmation, and Git history retention is accepted. On 2026-09-21 the owner
said the approved design remains settled: clean up the failed audit first, then
use the real PC handoff as a deployment-readiness test before any merge to main;
that interview authorized no test or cleanup by itself
(card [DQC-004T: "How should optional private transport preserve cross-machine continuity?"](../../landmark-tracker/destination-questions/DQC-004T.json), revision 5).
The decision is recorded in
[Optional private Git transport for session continuity](../../docs/adr/0051-optional-private-git-transport-for-session-continuity.md),
which says acceptance is not a claim the runtime or outcome is implemented and
that real Mac and Windows save, resume, offline and conflict proof is required
before claiming the cross-device capability. The owner's current stance on when
the Windows test happens is in the note
[PC test at main readiness](../pc-test-at-main-readiness.md).

**Private recovery material stays out of the public product.** The decision
recovery archive moves to the root of the owner's private GPT_OS workbench,
byte-identical by checksum, with no copy left in the LLM Workbench tree, and
the Spec evidence that cites it records the relocation
(card [DQC-004U: "How should private recovery material be preserved outside the public product?"](../../landmark-tracker/destination-questions/DQC-004U.json), revision 5).
No copy of that archive appears in the feedback lane of this tree when
checked on 2026-10-04; whether the private copy exists and matches is not something this tree can show.

## Open and unresolved

- The card on committed notes records an open part: the Spec and Task sides of
  the chat, notepad, handoff, Spec and Task continuity relationship are unstated
  beyond the Packet definition.
- Stale against the amendment: the controls
  ([AGENTS](../../../AGENTS.md#session-records-and-checkpoints)) still say live
  notes and handoffs stay untracked in project Git, so the owner's amendment
  that notes may be committed temporarily is not yet reflected there. The
  portable-Workbench Spec carries the slice, and a decision record narrowing
  the older local-only boundary was expected, and none is present among the
  decision records. Treat the amendment as accepted but not delivered.
- Delivery of the transport itself is partial. The private-transport Spec
  holds the helper work and records the live Mac and Windows continuation proof
  as not yet established; it is a gate for the cross-device claim, not a
  result.
- Which notes may be committed and how a committed note is later removed or
  promoted is a procedure the card leaves to its delivery owners; no card
  states it.

## Where the work lives

[Private Session Transport (S-052)](../../specs/S-052-private-session-transport/SPEC.md)
owns the transport, the stable identity and the cross-device proof, with the
helper at [session-transport tool](../../tools/session-transport.mjs). The
notes-may-travel slice and the promote-before-end rule sit in
[Portable Workbench (S-00V)](../../specs/S-00V-portable-workbench/SPEC.md). The
recovery archive relocation is cited in
[Assignment Ownership And The Coordination Record (S-049)](../../specs/S-049-assignment-ownership-and-coordination-record/SPEC.md).
The decision records are
[JSON notepads preserve objective continuity](../../docs/adr/0040-json-notepads-preserve-objective-continuity.md)
and
[Live session records stay untracked; durable references target promoted checkpoints](../../docs/adr/0028-live-session-records-stay-untracked-and-checkpoints-are-durable.md),
the boundaries the transport decision narrows. The procedure is in the
[RUNBOOK](../../../RUNBOOK.md#optional-private-session-transport).

## Related pages

- [Landmark: GitHub Coordination](landmark-github-coordination.md): fresh-host continuation through GitHub rather than private transport.
- [Landmark: Agent Stances](landmark-agent-stances.md): handoffs and stance changes.

## Evidence and Sources

- [Landmark record "Session Transport" (LMK-000T)](../../landmark-tracker/landmarks/LMK-000T.json): title, summary, importance and history.
- The three question cards named above, each at the revision cited: they hold the answers, confirmation basis, open uncertainties and named claims this page summarizes.
- [The Wiki is the evolving synthesis every agent reads and updates](../../docs/adr/000R-the-wiki-is-the-evolving-synthesis-every-agent-reads-and-updates.md): why this page exists.

## History

- 2026-10-04: created by the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages), seeded from the cards' current answers.
