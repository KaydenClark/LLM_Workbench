# S-004Z - Project History Lives In The Wiki

**Spec ID:** S-004Z
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-07
**Catalog description:** The Wiki holds one plain-language history of the progress made and a summary of every choice made, rooms get the same page from the template, and current-state docs keep only the history and context that pass the owner's value test.
**Blockers:** none
**Latest event:** Authored from the owner grilling of 2026-10-07; no Task is cut.
**Next gate:** Activation and a Task cut from live Actuality with `/to-tasks`; an owner answer to the open trim design choice below is needed before any append-only evidence row or Task Receipt row is trimmed.

> **Citation anchors.** pre=`d0fb161c1ff36caf936758b7492f7ef7fce8176e` post=`d0fb161c1ff36caf936758b7492f7ef7fce8176e`.

## Outcome

A reader who wants the story of the project opens one Wiki page and reads, in
plain language, how the project got where it is and a summary of every choice
made along the way, each linked to the record that holds it. Every room the
template creates starts with the same page. Current-state docs (`RUNBOOK.md`,
`AGENTS.md`, `BLUEPRINT.md`, landmark records, Specs, Tasks, Destination
Question Cards and decision records) stop carrying history narrative: each
piece of history or context in them either brings the work closer to the
destination and stays, or is trimmed because it was less useful than thought
or is available elsewhere, in GitHub or in the Wiki history.

## Why It Matters

The owner's reason: content on a current-state doc must earn its place; GitHub
holds the raw history; the Wiki holds the readable story. README's
release-history paragraph is one piece of history narrative in a current-state
doc, and no Wiki page exists yet to receive it.

## Current Verified State

At the pre anchor:

- The Wiki router `workbench/wiki/MEMORY.md` routes to release Specs under
  "Release And Distribution Routing", but no Wiki page tells the project's
  history or summarizes its choices. Design concept and features articles each
  keep their own `History` line, per `workbench/wiki/SCHEMA.md`.
- The Wiki schema's page types (`memory`, `project`, `person`, `machine`,
  `guidebook`, `design-concept`, `feature`, `meta`) and its Update rule (ingest
  at the exit of every operation) are in `workbench/wiki/SCHEMA.md`; the Update
  rule names no history page.
- The template Wiki `templates/wiki/` holds `SCHEMA.md`, `MEMORY.project.md`,
  `MEMORY.root.md`, `AGENTS.md`, `README.md` and the `design-concepts/` and
  `features/` collections. It seeds no history page.
- `README.md:198-223` carries the release history of v3.0.0 through v3.2.0,
  including the bundle growth from sixteen to "twenty-one core skills"
  (`README.md:218`). README belongs to
  [READMEs Follow The README Definition](../S-005A-readmes-follow-the-readme-definition/SPEC.md),
  which moves that paragraph into this Spec's page.
- `AGENTS.md:334` forbids rewriting append-only Spec evidence rows, and
  `tools/check-append-only.py` with its test enforces it. Task Receipt rows sit
  inside a checksum chain kept by `workbench/tools/task-receipt.mjs`, which
  `spec-workbench.mjs` relies on for close recovery. No rule says how a row
  that fails the value test may be trimmed.
- No owner states the value test as a written rule.

## Desired Behavior

Canon describing the template leads; the template artifacts follow it.

1. This repository's Wiki gains one history page, a flat note routed from
   `workbench/wiki/MEMORY.md` with a one-line summary and valid schema
   properties. It holds two parts: a plain-language history of the progress
   made, and a summary of every choice made, each choice linked to the record
   that holds it (decision record, Spec or grilling outcome) rather than
   restating it. It copies no live Task state and no Spec evidence rows.
2. The value test is written down once, as a rule, in the owner that governs
   what current-state docs carry, and the other owners link to it: for any
   history or context in a current-state doc, Spec evidence rows included,
   ask whether it brings us closer to the destination; trim it if it is not as
   useful as we thought or it is available elsewhere (GitHub, the Wiki
   history); otherwise keep it.
3. The Wiki schema's Update rule names the history page among the pages an
   operation touches when a Spec completes or a decision is accepted, so the
   page stays current by the existing ingest rule rather than by a new
   procedure.
4. `templates/wiki/` seeds the equivalent page for a new room, with
   placeholders, routed from the template router, and the template schema
   carries the same Update rule. Root and template agree, as control fidelity
   already requires for the Wiki contract files.
5. The value test is applied across `RUNBOOK.md`, `AGENTS.md`, `BLUEPRINT.md`,
   landmark records, active Specs and Tasks, Destination Question Cards and
   active decision records, in this repository and in the matching template
   files. History narrative that passes the test stays; narrative worth keeping
   as story moves into the history page; the rest is trimmed. `README.md` and
   `templates/README.md` are excluded; that Spec owns them.
6. Append-only Spec evidence rows and checksummed Task Receipt rows are trimmed
   only after the owner answers the open design choice below, and only in the
   way that answer allows.

## Decisions And Contracts

- **History summaries are kept, in the Wiki** (owner, 2026-10-07): a
  plain-language history of the progress made and a summary of every choice
  made. Current-state docs (README, RUNBOOK, AGENTS, BLUEPRINT, landmarks,
  Specs, Tasks, Destination Question Cards, decision records) carry no history
  narrative. Why (owner): content on a current-state doc must earn its place;
  GitHub holds the raw history; the Wiki holds the readable story.
- **The value test** (owner, 2026-10-07), for any history or context in those
  docs, Spec evidence rows included: does it bring us closer to the
  destination? Trim it if it is not as useful as we thought or it is available
  elsewhere (GitHub, the Wiki history); otherwise keep it.
- **Template-targeted** (owner, 2026-10-07, governance-stack lens): the
  template Workbench is Actuality and this repository's claims about it are
  Canon, so this Spec updates the Canon, Grounding and Enduring Context
  describing the template first, then `templates/wiki/` and the template
  controls. This repository's own page is part of the same delivery.
- Decision-record `archive/` bodies stay untouched, as the to-docs decision
  record rule already requires; the sweep covers active records.
- The process for running this Spec is unchanged: a Spec Planner, then a Spec
  Manager running implement-spec on this one Spec.

### Open owner choices

- **H-1: How does a trim coexist with append-only Spec evidence and
  checksummed Task Receipt rows?** For example, whether a trimmed row leaves a
  pointer (to its commit, or to the Wiki history) in its place, and whether the
  append-only checker and the Receipt checksum chain learn to accept that
  pointer. Not decided. Until it is answered, no evidence row or Receipt row is
  trimmed; the page, the written rule, the template seed and the sweep of other
  current-state content can proceed.

## Non-Goals

- Editing `README.md` or `templates/README.md`. The README definition Spec owns
  both, and moves README's release-history paragraph into this Spec's page.
- Replacing GitHub as the raw history, or copying commit logs into the Wiki.
- Rewriting retained history inside the Wiki, such as the `History` lines of
  design concept and features articles, or `archive/`.
- Changing the order in which Specs run, or the role and stance process.

## Dependencies And Blockers

- None blocking. [READMEs Follow The README Definition](../S-005A-readmes-follow-the-readme-definition/SPEC.md)
  is blocked by this Spec, because README's history paragraph moves into the
  page this Spec creates.
- Open owner choice H-1 gates only the trim of append-only evidence rows and
  Task Receipt rows.
- Coordination: [Adding A Required Core Skill](../S-004X-adding-a-required-core-skill/SPEC.md)
  also edits current-facing docs that state counts, and
  [Review Catches Stale Spec Records](../S-005B-review-catches-stale-spec-records/SPEC.md)
  applies the value test in review and links to the rule this Spec writes. The
  Spec Planners order overlapping edits; neither blocks this Spec.

## Vertical Implementation Slices

No Task is cut. Tasks are cut from live Actuality at activation with
`/to-tasks`. The intended direction is: the written value test and the history
page in this repository with its router line and schema Update rule; then the
template seed and template schema; then the sweep of current-state docs, one
owner group per slice; and, after H-1 is answered, any evidence or Receipt
trim it allows.

## Acceptance Criteria

- [ ] `workbench/wiki/` has one routed history page with a plain-language history of the progress made and a summary of every choice made, each choice linked to its record, and `node workbench/tools/wiki.mjs validate` adds no finding for it.
- [ ] The value test appears once as a written rule in its owner, in the owner's meaning, and the other owners link to it instead of restating it.
- [ ] The Wiki schema's Update rule, in this repository and in `templates/wiki/SCHEMA.md`, names the history page, and a new room created from the template has the seeded page routed from its router.
- [ ] Each current-state doc named in the Desired Behavior was swept against the value test, with what was kept, moved and trimmed recorded in this Spec, and `README.md` untouched.
- [ ] No append-only evidence row or Task Receipt row was trimmed before H-1 was answered, and any trim after it follows that answer and passes the append-only and Receipt checks.
- [ ] Named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

- `tools/test-wiki.mjs` for the page's schema validity and routing.
- `tools/test-control-fidelity.mjs`, which compares the Wiki contract files
  between this repository and the template, for the schema Update rule.
- `tools/test-workbench-round-trip.mjs` and the Genesis path, for a new room
  receiving the seeded page.
- `tools/test-check-append-only.py` and the Receipt checksum cases in
  `tools/test-spec-workbench.mjs` and `tools/test-diagnostics.mjs`, to prove no
  protected row changed before H-1 and that any later trim is accepted.

## Verification Procedure

Red/green at the Wiki validator and the round-trip seam, then
`node workbench/tools/wiki.mjs validate`, the fast check and the Runbook's Full
suite on a committed candidate. Record actual commands and results in this Spec.

## Documentation Impact

`workbench/wiki/` (new history page, `MEMORY.md` route, `SCHEMA.md` Update
rule), `templates/wiki/` (seed page, router, schema), the owner that holds the
written value test, and the swept current-state docs: `RUNBOOK.md`,
`AGENTS.md`, `BLUEPRINT.md`, landmark records, active Specs and Tasks,
Destination Question Cards and active decision records, with their template
counterparts.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-07 | none | Authored from the owner grilling of 2026-10-07 at integration d0fb161c1ff36caf936758b7492f7ef7fce8176e; carries D2 (history lives in the Wiki, the value test, the open trim design item) and D5 (template-targeted, Canon first). | Map only; the Wiki router and schema, the template Wiki, README's release paragraph, the append-only rule and the Receipt checksum chain were read at that tip; no runtime proof claimed. | This Spec. | Owner approval, H-1, Plan, implementation and proof remain. |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- The answer to H-1 may need its own change to the append-only checker and
  the Receipt checksum chain if it is larger than this Spec.

## Supersession

- Supersedes: none
- Superseded by: none
