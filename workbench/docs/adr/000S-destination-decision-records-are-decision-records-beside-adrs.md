---
date: 2026-10-02
canonicalized_in:
  - LEXICON.md
---

# Destination Decision Records are decision records beside ADRs

## Decision

The Workbench keeps two kinds of **decision record**. An ADR records a
consequential architectural choice: how the system is built. A **Destination
Decision Record (DDR)** records a consequential destination choice: what the
finished product must be or do, and why the owner chose it over the
alternatives. They are siblings, both decision records, handled by one system.
The DDR adapts the template where a destination record needs it; the concept is
the ADR's.

The owner settled these points in a grilling on 2026-10-01 and asked for them
to be promoted:

1. A DDR is its own durable record type. A destination choice had no durable
   owner of its own: a Destination Question Card is scaffolding, the grilling
   ledger is retained history, and the Blueprint is narrative with no
   per-decision identity.
2. The scope test: would the decision still hold if the architecture were
   rebuilt differently? If yes it is a DDR; if it is how the system is built it
   is an ADR. One decision may need both, in which case they link rather than
   merge. A Spec keeps a capability's scoped, testable acceptance.
3. A DDR is atomic, as an ADR is: one DDR per consequential decision, not one
   per locked grilling answer and not one per card, so nobody sorts through
   hundreds of locked answers to find what was decided and why. It is born when
   the owner confirms the decision, the same way an ADR is. A locked answer
   that is not a consequential choice gets no DDR.
4. The layout is the ADR's: a manifest collection named `ddr` at
   `workbench/docs/ddr/`; lifecycle by folder location
   ([ADR-000I](000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md)),
   the top level holding accepted records, `proposed/` the records not yet
   Canon and `archive/` the permanent home of superseded and deprecated ones; a
   visible identifier made of the `DDR` prefix and a base-62 value
   ([ADR-0041](0041-visible-base62-workbench-identifiers.md)); the frontmatter
   keys `date`, `supersedes` and `canonicalized_in`; a free-prose body; and a
   register and history derived from the folder listing, never edited by hand.
5. The lifecycle is the ADR's. Proposed has no Canon; accepted is active
   destination Canon; a superseded DDR is replaced by one successor that states
   the whole current decision; a deprecated DDR ends without a successor and
   says why. The decision locks at the owner's confirmed readback, the record
   is written in `proposed/` and accepted by moving it out once corrections are
   reconciled, and no separate approval ceremony exists.
6. The three layers are the Blueprint, then DDRs, then ADRs: describe the
   destination, record the directions taken, record the choices made along the
   way. The Blueprint exists first and cannot be built from DDRs or ADRs. It is
   not a router to them and links no record that carries an identifier. A DDR
   that contradicts the Blueprint obliges a Blueprint update, carried by the
   DDR's `canonicalized_in` naming the Blueprint, the way an ADR changes the
   rest of the Contract.
7. The Wiki cites DDRs by name and context
   ([ADR-000R](000R-the-wiki-is-the-evolving-synthesis-every-agent-reads-and-updates.md)).
   There is no Wiki page per DDR; the Wiki synthesizes decisions into the big
   picture and the DDR stays the owner of the decision. A DDR's
   `canonicalized_in` never names the Wiki.
8. The first DDRs come from taking the existing Blueprint apart. The owner
   grills those candidates before any Spec drafts them, and the drafts enter
   `proposed/` for the owner's review. After that seed, DDRs are written
   forward-only from newly confirmed decisions; locked ledger rows and
   Destination Question Cards get a DDR only when next touched.
9. A DDR gets a command that writes the next record into `proposed/`, as ADRs
   have, run at the same documentation step that writes an ADR. The tooling
   reuses the ADR runtime rather than forking it.

Considered and rejected: leaving destination choices with the Destination
Question Card, the Blueprint and the Wiki (none is a durable per-decision
owner); one DDR per card (not atomic, and it forbids superseding one of several
decisions); a DDR for every locked grilling answer (hundreds of records, most
of them not choices); a Wiki page per DDR, or DDRs replacing the design-concept
articles (the Wiki is the synthesis); the Blueprint as an index of DDRs and
landmarks (the owner rejected it: a Blueprint that becomes an index is not
needed); and treating a DDR as an ADR in every respect (the owner limited
that: a DDR must serve a destination goal and its template may adapt).

Consequences: introducing the DDR changes what a Core artifact type owns, which
the ownership rules record as an ADR naming the ownership map. The ownership map
file does not exist yet, so `canonicalized_in` here names the Lexicon, which
carries the Decision Record, DDR and Blueprint definitions; the ownership map
takes the DDR row when it is installed. This record performs no delivery. The
`ddr` collection, its commands and its register, the accept, supersede and
deprecate moves that the ADR tool lacks at the time of this record (it has
`validate`, `normalize`, `register`, `new` and a one-time folder migration), and
the template mirrors belong to a Decision Record tooling Spec that is not yet
authored. The Blueprint still carries decisions and links ADRs; taking it apart
into DDRs and a short page is the grilling and Spec in point 8. The root
Lexicon states the accepted destination; `templates/LEXICON.md` is not changed
because a template should not describe a collection no room has.

Provenance: owner-confirmed grilling of 2026-10-01 under the objective
"ddr-and-control-surface", which began when the owner proposed a sibling to the
ADR that would give Destination Question Cards a durable main source. It
builds on [ADR-000A](000A-active-adr-decisions-and-destination-blueprints.md)
(active decisions as Canon) and
[ADR-000G](000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md)
(the Blueprint, Spec and Task chain).
