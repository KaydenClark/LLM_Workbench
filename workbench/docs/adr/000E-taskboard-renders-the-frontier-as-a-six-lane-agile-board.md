---
date: 2026-09-22
canonicalized_in:
  - LEXICON.md
  - RUNBOOK.md
  - BLUEPRINT.md
---

# TASKBOARD renders the Frontier as a six-lane Agile board

`TASKBOARD.md` is the sole live project-management view of the **Frontier** —
the open, unblocked and unclaimed Tasks at the edge of what each Map currently
knows — projected across every active Spec. The board is Agile: it is a Kanban
view whose columns are states of work, not a second tracker.

The board has exactly six lanes:

| Lane | What it means |
|---|---|
| **Backlog** | Accepted work that is not yet shaped for pickup. |
| **To do** | Shaped, unblocked and unclaimed — the Frontier proper. |
| **In progress** | Claimed and being worked. |
| **Blocked** | Stopped by a real impediment that must be worked on before it can continue. |
| **Needs review** | Finished work where a director's attention is what clears it. |
| **Complete** | Accepted and done. |

The unit on the board is the Task as
[ADR-000H](000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md)
defines it. A Task does not have to pass through every lane. Most work should
never enter Blocked at all.

## Blocked and Needs review are different kinds of obstacle

This is the decision this record exists to make.

**Blocked** means something went wrong or is missing and *work* is what clears
it. A Blocked Task is incomplete. It says we failed to get this done and the
impediment itself is now the job. Blocked should be rare, and a board full of
Blocked is a report of trouble.

**Needs review** is finished work where a **director's** attention is what
clears it. It is a **gate**, not an impediment. Nothing is wrong with it; it
needs feedback or an approval. A Task in Needs review is `complete` in every
sense the doer controls.

A director is not necessarily the owner. An agent holding a directing role —
director, steward, captain — can clear a Needs review item when it has the
information and the authority to decide. Those roles are not yet defined in the
Workbench; until they are, read "director" as whoever currently holds the
authority to approve the item, which today is usually the owner.

Both are obstacles. They are not equally harsh, and the difference is
operational: Needs review is addressed to the director and tells them their
attention on this item outranks other items on their list, while Blocked is
addressed to whoever can remove the impediment. Recording an approval gate as
Blocked destroys that signal in both directions — it reports a failure that did
not happen, and it buries the queue of things only a director can release.

Considered and rejected: one `blocked` status covering approval gates too, which
is what the Workbench did until this decision. Seven Specs whose only remaining
step is owner Human QA were indistinguishable on the board from Specs stopped by
a genuine defect, and the board could not answer "what is waiting on me".

Considered and rejected: a separate "waiting" or "on hold" lane alongside Needs
review. Holds that are not reviews are either Blocked, because something must be
worked on, or Backlog, because nobody is meant to pick the work up yet. A third
waiting lane re-creates exactly the ambiguity this record removes.

## The board renders; the owners author

Lane membership is derived from the owning Spec and its Task records. Priority,
progress, dependencies, blockers and review state are authored there;
`TASKBOARD.md` displays their generated current view and is regenerable without
loss. Anything the board alone holds is lost at the next render, which is the
failure mode that makes a board untrustworthy rather than merely stale.
Completed verified work leaves the board so the board clears. The test of a
correct board is that a situation report can read it alone and describe a
complete active picture.

Considered and rejected: calling `TASKBOARD.md` the navigation view. Navigation
— connecting a question to its smallest relevant owner — stays with the
Lexicon's Context Map; naming two artifacts the navigation surface would put one
term on two concepts.

Consequences: `LEXICON.md` gains the six lane names and the Blocked/Needs review
distinction as vocabulary; `RUNBOOK.md` gains the lane semantics and how the
board is rendered from Spec and Task state; `BLUEPRINT.md` describes the board
as the product's Agile view. `SPEC_STATUSES` in
[`spec-workbench.mjs`](../../tools/spec-workbench.mjs) already carries
`needs-review`; Task records do not, and gain it. Diagnostics must not treat
`needs-review` as a blocking finding, because nothing is wrong with the work.
The Specs whose only remaining step is owner Human QA move from `active` to
`needs-review`. None of that migration is performed by this decision; it is
owned by its scoped Spec, and the `canonicalized_in` owners named above do not
yet carry the claim.

Provenance: owner decision stated 2026-09-22, correcting this record's earlier
proposed text, which described the Frontier as "the whole set of Journeys and
Paths currently in motion". That wording contradicts the Map, Fog and Frontier
definitions the owner locked in `LEXICON.md` (TT-Q1 and FND-Q17b), so the
earlier text was never fit for acceptance and is replaced rather than amended.
