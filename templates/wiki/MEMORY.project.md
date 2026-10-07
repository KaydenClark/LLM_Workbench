---
type: memory
status: active
sensitivity: normal
knowledge_role: canonical
provenance:
  - Genesis or Adoption of this room
source_paths:
  - workbench/wiki
last_verified: [YYYY-MM-DD]
---

# [PROJECT_NAME] Memory

> Generated from LLM Workbench v[HARNESS_VERSION]. This is the room brain: the
> canonical, human-editable memory router for this project, kept at
> `workbench/wiki/MEMORY.md`. Start here and follow the smallest relevant
> link instead of browsing folders or searching.

This router holds durable room memory only: context, decision-history
pointers, and routing. It never duplicates live task state; it routes to it.

## Source Precedence

1. Verified runtime and this room's live controls: `AGENTS.md`, `BLUEPRINT.md`,
   the assigned stable spec, `TASKBOARD.md`, and `RUNBOOK.md`.
2. Maintained notes routed from this file.
3. `archive/` and generated material.

When sources disagree, verify the higher-authority source and repair the stale
note (`AGENTS.md` -> State Resolution). The wiki is a map, not a Governance
Plane: it routes to Canon, Grounding, and verified Actuality and authorizes
nothing.

## Leaving The Wiki

| Go to | For |
|---|---|
| [AGENTS.md](../../AGENTS.md) | Authority, scope, safety, and the work loop |
| [BLUEPRINT.md](../../BLUEPRINT.md) | What the product is, who it serves, the outcomes it promises and what it is not |
| [LEXICON.md](../../LEXICON.md) | Shared terms, the Governance Core, and design-concept routing |
| [TASKBOARD.md](../../TASKBOARD.md) | Current execution state |
| `workbench/specs/` | Stable capability records, acceptance, evidence, and proof |
| [RUNBOOK.md](../../RUNBOOK.md) | Exact operating and verification commands |
| [SCHEMA.md](SCHEMA.md) | Wiki CRUD, metadata, sensitivity, and freshness rules |
| [design-concepts/](design-concepts/README.md) | Articles explaining durable design models and each landmark's evolving synthesis |
| [features/](features/README.md) | Readable articles capturing each completed Spec's delivered capability |
| [guidebooks/](guidebooks/) | Ordered procedures that outgrew the Runbook |

## Vocabulary

The root `GLOSSARY.md` defines the project's shared words. These articles
explain them, one article per glossary grouping, each word a section linking
its definition, plus one reference page for general AI coding words. They
ship with the room; add a section or a page when a word of this project needs
more than its glossary entry.

- [Destination and direction](vocabulary-destination-and-direction.md) - where the project is going: destinations, maps, question cards and the frontier of ready work
- [Workflow verbs](vocabulary-workflow-verbs.md) - the actions every workflow is built from, from Idea to Clean Up
- [Workbench, room and artifacts](vocabulary-workbench-room-and-artifacts.md) - the Workbench, the project and the kinds of artifact agents meet
- [Specs and Tasks](vocabulary-specs-and-tasks.md) - the units of planned work, their reviews and where their records go
- [Chats and roles](vocabulary-chats-and-roles.md) - the working contexts agents run in and the scopes they are assigned
- [Feedback disposition](vocabulary-feedback-disposition.md) - the closed set of outcomes every feedback finding ends with
- [Workbench meanings of AI coding terms](vocabulary-workbench-meanings-of-ai-coding-terms.md) - the two AI coding words with a distinct Workbench meaning
- [Continuity terms](vocabulary-continuity-terms.md) - notepads, scoped handoffs and the identifiers that name artifacts
- [Stance terms](vocabulary-stance-terms.md) - the job each stance does inside an assigned role
- [Governance core](vocabulary-governance-core.md) - claim roles, authority, lanes, collections and decision records shared by every Workbench
- [Continuity and evidence boundaries](vocabulary-continuity-and-evidence-boundaries.md) - what transport, promotion, host checks and compatibility do and do not establish
- [AI coding reference](ai-coding-reference.md) - general AI coding words restated in Workbench words, with attribution

## Routing

| Question | Read first |
|---|---|
| [QUESTION THIS ROOM'S MEMORY ANSWERS] | [[NOTE NAME]] |
| [ANOTHER DURABLE QUESTION] | [[ANOTHER NOTE NAME]] |

Add a row only when a durable note exists to route to. A young room may have an
empty table; that is fine. Grow flat notes beside this router and inside the
declared collections; only `archive/` may nest.

Every page this router links carries a one-line summary beside its link, so a
reader can choose a page without opening it. In a list, write
`- [Schema](SCHEMA.md) - what the page is for`; in a table, give the
link's row a second cell that says what the page is for. `wiki.mjs validate`
reports a routed page without one as attention, never as a failure.

## Up-Link

Inside a larger deployment, name the deployment wiki's pointer note for this
room here and keep the pair resolvable in both directions. A standalone room
leaves this section as a single line: `Standalone room; no deployment wiki.`
