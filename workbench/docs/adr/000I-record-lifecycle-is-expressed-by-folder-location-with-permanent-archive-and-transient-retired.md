---
status: proposed
date: 2026-09-12
canonicalized_in:
  - AGENTS.md
  - LEXICON.md
  - RUNBOOK.md
---

# Record lifecycle is expressed by folder location with permanent archive and transient retired

Lifecycle is expressed by **folder location**, as one cross-cutting pattern
covering every one-record-per-location artifact type — Specs, Tasks and ADRs —
rather than three per-collection conventions. Folder location is the source of
lifecycle truth. Status frontmatter comes out, so two places cannot disagree
about whether a record is live.

Active records stay at the top level of their collection. A **proposed**
location holds records that are not yet Canon. The two terminal locations carry
deliberately opposite retentions:

- **`archive`** is permanent storage. Superseded and deprecated ADRs go there
  and are never cleared, because
  [ADR-000A](000A-active-adr-decisions-and-destination-blueprints.md) requires
  complete history to stay reachable with original record bodies preserved.
- **`retired`** is a transient staging area. Completed Specs and Tasks go there
  and are cleared only after the exact change is verified on `main`.

The opposite retentions are the reason for two names. A single term covering
both would let one clearing procedure be pointed at permanent history by
accident, and `LEXICON.md` already forbids one term standing for two concepts.

Considered and rejected: keeping frontmatter `status` as the source of lifecycle
truth, as `workbench/tools/adr.mjs` implements today. It is invisible until a
record is opened, so the active roster cannot be read off a directory listing,
and it permits a record whose location and status disagree.

Considered and rejected: one shared terminal folder for every type. Specs and
ADRs have opposite retention needs, and collapsing them makes the safe behavior
depend on remembering which type a record is.

Consequences: this decision does **not** authorize clearing anything. Its
Spec-and-Task clearing half is entangled with the held FND-Q07/FND-Q08 deletion
gate and stays blocked behind it. Live obstacles a scoped migration must handle,
verified read-only at `c0ac60a`: `workbench/docs/adr/` is flat with 44 records
and lifecycle read from frontmatter; `workbench/tools/adr.mjs` requires
`superseded_by` to be one whole-record filename with no path, so successor
resolution is not folder-aware; 20 ADR files carry relative intra-ADR links that
break when a target moves; 15 accepted ADRs name live `workbench/specs/S-*`
paths; and the moving unit differs by type, a file for an ADR and a directory
for each of 54 Specs. Applying the pattern to Tasks depends on
[ADR-000H](000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md),
because a table row cannot occupy a folder.

The stable-path rule in `AGENTS.md` — a declared Spec path never moves between
active, done and archive folders — is the direct inverse of this pattern and is
retired with the premise it served, at acceptance and not before. It was
introduced in commit `ec94022` alongside making the Spec the durable owner; it
means what it says, and it is not reinterpreted here as a rule about absolute or
machine-specific paths.

Provenance: owner decisions recorded 2026-09-11 as `decision-039`,
`finding-016`, `decision-040` and `decision-041` in the live grilling note
`workbench-foundation-rework-2026-09-11`, untracked working material named as
origin rather than durable evidence.

## Promotion status

This record is `proposed`. The ADR directory stays flat, no `proposed`,
`archive` or `retired` folder is created, frontmatter `status` remains the live
lifecycle mechanism, and the `AGENTS.md` stable-path rule remains live Canon,
until the owner accepts this decision.
