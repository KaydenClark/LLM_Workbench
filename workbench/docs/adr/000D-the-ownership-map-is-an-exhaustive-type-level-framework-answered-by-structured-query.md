---
status: proposed
date: 2026-09-12
canonicalized_in:
  - LEXICON.md
  - AGENTS.md
---

# The ownership map is an exhaustive type-level framework answered by structured query

`OWNERSHIP.json` holds the maintained record of artifact classes, their
responsibilities, scopes, routes and relations. It answers one question: where
does this truth belong. It must be exhaustive at the **type** level — every Core
artifact type, its relationships, its ownership interactions and how an agent
uses it — complete enough that a fresh agent with no prior context can traverse
it and use the Workbench. Completeness is satisfied through structured query,
not by requiring every agent to read the whole schema at entry.

The guardrail is load-bearing: **a query returns which artifacts to read, never
the claims themselves.** A map that answers with content rather than with
routes becomes a second truth store, and the first thing a second truth store
does is drift from the first. The map maps relationships and routes; it does not
duplicate the claims its mapped artifacts own, and it must not accumulate
per-record work state, which would make it a duplicate work tracker.

Considered and rejected: keeping the schema inside `LEXICON.md`, where it lives
today. Exhaustive type-level coverage of every artifact class makes the Lexicon
large enough that entry cost rises for every agent, including those with no
ownership question. Query-shaped access is the property that makes exhaustive
coverage affordable, and a prose table inside a control an agent loads whole
cannot provide it.

Considered and rejected: an exhaustive *instance*-level map naming every live
Spec, Task and ADR. That is the duplicate work tracker the guardrail forbids,
and it would need updating on every record transition.

Consequences: `LEXICON.md` keeps shared language and the Context Map, and routes
ownership questions to `OWNERSHIP.json` rather than answering them; the Artifact
Ownership Schema currently at `LEXICON.md` leaves that file once the map is
populated and queryable, not at acceptance alone — acceptance authorizes the
migration, but its scoped Spec gates the container (TK-001-TK-003) ahead of
the schema's removal, so the existing route stays usable throughout. The
map's own placement is decided by
[ADR-000B](000B-the-workbench-root-surface-is-eight-files-and-contract-membership-is-separate-from-root-placement.md);
its query surface, entry lifecycle and portability boundary are not decided
here. This record fixes the container and its guardrail only.

**This decision does not supply the map's contents.** The allocation of
responsibilities across artifact types (FND-Q21), how accepted assignments enter
and leave the record (FND-Q23), and which assignments are portable Core versus
project-specific extension (FND-Q24) are open owner questions. A future agent
must not treat transcription of the existing Lexicon schema into JSON as an
answer to any of the three.

Provenance: owner-approved foundation answers FND-Q21A and FND-Q22A, 2026-09-11,
recorded as approved answers in the live grilling note
`workbench-foundation-rework-2026-09-11`. That note is untracked working
material named here as origin, not as durable evidence.

## Promotion status

This record is `proposed`. `LEXICON.md` and `AGENTS.md` remain live Canon as
written, and the Artifact Ownership Schema stays in the Lexicon, until the owner
accepts this decision.
