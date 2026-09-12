---
status: proposed
date: 2026-09-12
canonicalized_in:
  - LEXICON.md
  - AGENTS.md
  - RUNBOOK.md
---

# A Task is a standalone artifact and Task replaces Ticket as the execution-slice term

A Task is its own artifact, `TASK.md`: a bounded executable thin vertical slice
of a `SPEC.md`, carrying its own blocking relationships so independent Tasks can
complete in parallel. It is no longer a row in a table inside its Spec.

**Task** is the execution-slice term across the Workbench — explanatory prose,
the live tool vocabulary, the board's columns, and the identifiers newly
allocated to execution slices. `Ticket` is retired as a live term rather than
kept as an accepted alias, because one concept carrying two names is exactly
what `LEXICON.md` forbids.

Identifiers already issued are **not** rewritten. Existing `TK-###` identifiers
inside completed Specs sit in append-only evidence rows, and rewriting them
would edit records that are frozen by their own retention rule. They remain
readable as history; only newly allocated slices take the Task identifier form.

Considered and rejected: renaming in explanatory prose only, leaving `Ticket` as
the tool and identifier term. The standalone `TASK.md` changes the tool seam
regardless, so the collision between the two names becomes immediate rather than
theoretical, and every agent would have to learn that two words name one thing.

Considered and rejected: rewriting historical `TK-###` identifiers for
uniformity. Append-only evidence is preserved precisely so a later reader can
trust that a row says what it said when it was written.

Consequences: the embedded slice table is replaced as the Spec's record of its
slices; `to-tickets` and the roughly ten tool files carrying `ticket` vocabulary
change with it, including `workbench/tools/spec-workbench.mjs`,
`workbench/tools/diagnostics.mjs`, `workbench/tools/spec-packet.mjs` and
`workbench/tools/workbench-layout.mjs`, verified read-only at `c0ac60a`. A
standalone per-record artifact is also the precondition that lets
[ADR-000I](000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md)
apply folder lifecycle to Tasks at all, since a table row cannot occupy a
folder. None of that migration is performed by this decision; it is owned by its
scoped spec.

## What a Task carries in and out

A Task loads a **Packet** and closes with a **Receipt**.

The Packet is the bounded set of material a Task loads at entry. Its required
members are the `TASK.md`, the Spec acceptance lines that Task satisfies, the
cited source and test paths, and the Workbench Contract. Nothing else is loaded
at entry; the Spec body is reached by traversal when a Task needs it, rather
than copied into the Packet, so no acceptance rationale can drift from its
owner. `Packet` is not a new word: `AGENTS.md` already says "the Contract,
assigned packet and linked context", `RUNBOOK.md` already says `show` "loads one
stable work packet", `workbench/tools/spec-packet.mjs` parses one, and five core
skills use the term. This decision defines the incumbent term rather than
coining one.

Its optional members are a Scoped handoff and the objective's local JSON
notepad, each included only when one exists. Both enter as working context only.
Neither may be read as instruction or as proof, because `AGENTS.md` states that
notes "neither authorize work nor prove claims" and `LEXICON.md` defines a
Notepad as neither Canon nor permanent history. Both are local and untracked, so
a Task picked up from a fresh clone or another machine will not have them: a
Task must therefore remain executable from its required members alone. A Task
whose continuity silently depends on an untracked file reproduces the failure
this whole model exists to remove.

The Receipt is append-only, with **one row per run**, recording that run's
branch, HEAD SHA, upstream distance, dirty file count, tests run with result,
docs touched, and remaining gap. `Receipt` is used here in the sense
`LEXICON.md` already carries for manifest, tools and component receipts — the
record of an operation's source and result — so this is one term with one
meaning rather than a second sense of an existing word.

The row is appended proactively as the run proceeds, on the same
before-interruption discipline `AGENTS.md` already requires for notepads —
not deferred until a successful `close`. A run approaching token exhaustion or
an anticipated Stop appends its row with the fields known at that point, an
open remaining gap included; `close` is the row's normal trigger, not its
only one. As with notepads, this is an obligation to append promptly, not a
guarantee the harness can enforce: an unanticipated kill or crash can still
preempt an unwritten row, and a run lost that way is a named, accepted
limitation rather than a hidden one.

Considered and rejected: `Ticket` as the name for the Packet. Frozen `TK-###`
identifiers in append-only evidence mean Ticket-as-execution-slice permanently,
so reusing the word for the entry bundle would put two live meanings on one
word — the precise condition `LEXICON.md` forbids and the stated basis on which
WF-5 chose a full rename over a prose-only one.

Considered and rejected: a single Receipt written once at close. An interrupted
run would then leave no trace at all, which is how a completion report comes to
hide work that was never finished.

Considered and rejected: a second concept beneath Task for one fresh-context
run, with its own identifier. Per-run rows give that visibility without a second
artifact or a second identifier prefix, and a second level would reopen WF-5.

## One Task, one context

One Task is intended to be one fresh context, one branch and one Receipt. This
is an aspiration, not a guarantee the harness can enforce: a run ends on token
exhaustion or an owner's Stop regardless. A Task that does not finish resumes as
the same Task and appends another Receipt row; it is not split as a penalty for
a limit it could not predict.

The split happens at planning time instead. **Work expected to need more than
one context unit is a Spec with Tasks, not a Task.** The context unit is a
declared host fact recorded in `workbench/manifest.json` with provenance, not a
number written into portable control prose, because it rises as models improve:
the owner set it at 200k tokens on 2026-09-12, having considered 150k and
rejected 250k, since 250k is where a context is compacted or gone while roughly
200k is where answer quality begins to degrade, and planning to the ceiling
plans work into the degraded tail. Sizing guidance reads the declared value
rather than restating it. It is a Plan goalpost and never a gate, diagnostic or
blocker.

## What the board shows

`TASKBOARD.md` projects a **derived signal** from the Receipt rows, not the rows
themselves: per active Task, the run count and the latest run's branch, short
SHA and dirty-file count, so multi-run and dirty Tasks are distinguishable at a
glance. The full run table is never rendered there. The rows are evidence and
stay in the Task; `LEXICON.md` defines the Hot projection as "not a second
tracker or proof archive", `AGENTS.md` forbids copying completed evidence into
the Taskboard, and approved FND-Q02A places progress ownership in the Specs and
Tasks. The accepted cost is that the board shows the symptom and the Task holds
the story: why a Task took four runs requires opening it.

Provenance: owner-approved answers TT-Q2 and WF-5, and the RB-Q1, RB-Q1A,
RB-Q2, RB-Q2A and RB-Q2B answers settled 2026-09-12. TT-Q2's basis is recorded
exactly: approved FND-Q19 states that Tasks are tracer-round vertical slices and
does not itself use the words "standalone file"; the owner's reading supplies
that, and this record is where that reading becomes the decision. All recorded
in the live grilling note
`workbench-foundation-rework-2026-09-11`, untracked working material named as
origin rather than durable evidence.

## Promotion status

This record is `proposed`. `LEXICON.md`, `AGENTS.md` and `RUNBOOK.md` remain
live Canon as written, and `Ticket` remains the live term, until the owner
accepts it. `Packet`, `Task receipt` and the `Ticket` retirement pointer are
Lexicon rows this record owes on acceptance; the declared context unit is a
manifest field it owes. Neither is written by this record.
