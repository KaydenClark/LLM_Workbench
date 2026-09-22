---
date: 2026-09-12
canonicalized_in:
  - AGENTS.md
  - LEXICON.md
  - RUNBOOK.md
  - workbench/specs/S-00I-folder-lifecycle-for-records/SPEC.md
---

# Record lifecycle is expressed by folder location with permanent archive and transient retired

Lifecycle is expressed by **folder location** for one-record-per-location
artifact types. Folder location is the source of lifecycle truth rather than a
duplicated status field.

Active records stay at the top level of their collection. A **`proposed`**
location holds records not yet Canon. The two terminal locations deliberately
have opposite retentions:

- **`archive`** is permanent storage. Superseded and deprecated ADRs go there
  and are never cleared because complete decision history must remain reachable
  with original bodies preserved.
- **`retired`** is transient staging. Completed Specs and Tasks go there only
  after their useful current claims are transformed into readable durable
  owners. The Wiki owns reconciled current capability knowledge; Blueprint owns
  product direction; ADRs own consequential decisions; source, tests and assets
  own verified Actuality and proof; Taskboard projects only active Task state.

A Spec is not permanent product documentation. It is a mini-PRD for one scoped
objective and destination. A Task is active work. After separate-context Spec
review and owner Human QA establish that the destination is present, reconcile
the completed Spec into its durable owners and retire the Spec and Tasks. After
the exact change is verified on `main`, the transient records may be discarded
only when current routes no longer depend on them, a complete reference/link
scan passes, and immutable Git commit plus historical path preserve recovery.

Later gaps against the same destination open corrective Tasks against the
reconciled current capability record; they do not resurrect `SPEC.md`. A new
Spec exists only for a distinct scoped objective with its own destination.

The opposite retentions are why `archive` and `retired` remain different terms.
A shared name would let a clearing procedure target permanent ADR history.

Considered and rejected: keeping completed Specs as maintained capability
documentation. It forces current readers through execution scaffolding after
the useful knowledge should have been transformed for humans and agents.

Considered and rejected: using Git history as the current capability owner.
Git supplies recovery and provenance, but the current tree must route a fresh
agent to readable present-tense knowledge without archaeology.

Considered and rejected: lifecycle in both frontmatter and folder location.
Two sources can disagree about whether a record is live.

Consequences: implementation must make successor and reference resolution
folder-aware, migrate every live consumer, retire the current stable-Spec-path
rule only when moves are safe, and prove the discard gate rather than deleting
records manually. [S-00H](../../specs/retired/S-00H-task-artifact-and-terminology-migration/SPEC.md)
must first make Task a standalone record.
[S-00I](../../specs/S-00I-folder-lifecycle-for-records/SPEC.md) owns the
migration and discard mechanism. Until those slices land, the current flat ADR
directory, frontmatter lifecycle, stable Spec paths and embedded Task rows
remain implemented Actuality; acceptance of this decision alone authorizes no
manual moves or deletion.

Provenance: owner decisions FND-Q07, FND-Q08 and FND-Q23 from 2026-09-11 through
2026-09-12, refined and accepted through WF-8A and WF-8D through WF-8G on
2026-09-16. The source grilling records remain local working context rather
than durable evidence.
