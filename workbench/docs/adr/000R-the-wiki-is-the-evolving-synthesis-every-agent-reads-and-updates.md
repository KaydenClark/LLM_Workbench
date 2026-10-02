---
date: 2026-10-01
canonicalized_in:
  - LEXICON.md
  - AGENTS.md
  - BLUEPRINT.md
  - RUNBOOK.md
  - workbench/specs/S-003W-wiki-evolving-synthesis-migration/SPEC.md
---

# The Wiki is the evolving synthesis every agent reads and updates

The owner settled this definition in a grilling on 2026-10-01, one question
at a time, and asked for it to be promoted. It is the model the Workbench was
designed after; the artifacts built since were attempts to make it work.

## Decision

The Wiki is a directory of agent-written Markdown that every agent reads and
updates: summaries, entity pages, concept pages, comparisons, an overview and
an evolving synthesis. It captures understanding as it forms, in prose, so
that handoffs stay instructions and notepads stay one-writer session records.
In Governance Plane terms its pages are Enduring Context, the Wiki schema is
Canon, and its raw sources are the claims that played the Actuality role in
the operation just performed, not whole artifacts. Every use of the Workbench
reads the Wiki and, when the work changed what a page says, updates it. The
Wiki authorizes nothing.

The settled answers:

1. The Wiki holds evolving synthesis, not only confirmed understanding.
   Agents read it, find what is wrong or missing, and fix it for the next
   agent.
2. No page per decision. Decisions fold into the summaries and the big
   picture; the decision record stays the owner of the decision.
3. Destination Question Cards and landmark records stay as tooling and state.
   The Wiki is what they are summarized into, updated whenever a card changes.
4. Ingest is the exit of every operation. Finishing a grilling session makes
   writing one or several pages part of promotion; closing a Task, completing
   a Spec or accepting a decision updates the pages it touched. One ingest
   usually touches several pages.
5. The Wiki is tracked in Git and updated on the agent's own branch like
   every other owned document; Git reconciles. No writer lane, no revision
   stamp, no lock.
6. Identifiers stay in the Wiki, because they are how agents link and find
   artifacts. Every reference to one carries the artifact's name or title and
   enough context to say what it is for. Separately, in chat an artifact is
   never referred to by its identifier alone.
7. Five page kinds, as a first cut: an overview (the router, with a one-line
   summary per page), one synthesis page per landmark, entity pages for
   capabilities, skills, roles, stances and tools, concept pages, and
   comparisons filed back when a question produces one.
8. Any agent, in any authorized operation, creates or updates the pages its
   work touched, with no per-page approval. Only the schema itself needs the
   owner's explicit say.
9. Lint runs twice: a small lint of the touched pages at the end of every
   Wiki update, and a whole-Wiki lint at Spec review when the Spec's work is
   verified. Findings become corrective Tasks. The structural validator keeps
   running on every change.
10. The grilling destination audit ledger leaves the Wiki for the sessions
    lane as an interim home; it is being turned into question cards.

Considered and rejected: a Wiki limited to confirmed understanding, with the
question cards as the only evolving store (the agent's first recommendation;
it kept the overwrite problem in untracked notes and left nothing for the
owner to read while understanding formed); a Wiki free of identifiers (it
would defeat the identifiers' purpose, which is to let agents link and find);
owner authorization per article (it made the Wiki a ceremony no workflow
moment ever reached: fifty complete Specs and no feature article).

Consequences: the Wiki schema (`workbench/wiki/SCHEMA.md`, the Wiki's own
contract rather than a root control) carries the page kinds, the ingest moment, the
identifier rule, the lint cadence and who writes; the Lexicon carries the
Wiki, Design Concept article and Landmark Wiki page definitions; the agents
file carries the read-and-update obligation; the Blueprint and Runbook state
the evolving role in place of the confirmed-only one. This partially
supersedes [ADR-0030](0030-every-workbench-declares-a-design-concepts-collection.md)
(the collection remains required; the owner-alone authorization clause is
retired) and revises the "before a Wiki article exists" ordering in
[ADR-000N](000N-landmark-tracker-connects-evolving-understanding-to-durable-knowledge.md)
(cards and landmarks remain the structured account; the Wiki summarizes them
as they evolve rather than only after). The Landmark page rule that forbade
identifiers, and the validator built for it, give way to the name-and-context
rule; retiring that validator, moving the fifty-one per-Spec articles into
the features collection, adding router summaries and moving the ledger are
delivery work for a follow-up Spec, not consequences this record performs.
Two locked grilling answers that gave the Wiki only confirmed understanding
are superseded by the owner's own answers here; the ledger records that when
it is next maintained.

Provenance: owner-confirmed grilling of 2026-10-01 under the objective
"wiki-definition-and-use", answering the handoff
`workbench/sessions/handoffs/wiki-definition-and-use-2026-10-01.md`, compared
against Andrej Karpathy's "LLM Wiki" idea file (gist 442a6bf5). The
comparison that preceded the grilling found fifty complete Specs with no
feature article, fifty-one per-Spec articles filed as design concepts, and no
ingest, query or semantic lint operation in the Workbench.
