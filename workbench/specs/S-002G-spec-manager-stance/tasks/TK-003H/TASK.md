# TK-003H - Route the spec-manager Wiki article from the Roles And Stances router

**Task ID:** TK-003H
**Spec ID:** S-002G
**Slice:** Route the spec-manager Wiki article from the Roles And Stances router
**Status:** ready
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-002G acceptance line 6 (a fresh agent discovers the individual Wiki article and identifies scope, inputs, outputs, hand-back and escalation) and Documentation Impact (one individual article routed through MEMORY.md; cross-capability explanation stays in roles-and-stances.md)
**Planned verification:** `node workbench/tools/wiki.mjs validate` reports ok with the new article; `node tools/test-wiki.mjs` green; `node workbench/tools/spec-workbench.mjs doctor` reports no `room-brain-unrouted` finding; a read of `workbench/wiki/MEMORY.md` "Roles And Stances" reaches the article in one hop and the article reaches the skill source, the Spec, LEXICON stance terms, ADR-0036, ADR-000P and the role model in one hop each.

## Outcome

A fresh agent following `workbench/wiki/MEMORY.md` -> "Roles And Stances"
reaches `workbench/wiki/skill-spec-manager.md` and learns, in plain language,
what the Spec Manager stance is for, its inputs (the Spec Planner result, live
Task states, dependencies, branch scope, Worker hand-backs), its outputs (the
assembled immutable candidate, evidence and remaining gaps reported to the
Director), when it is done, how it composes with the Dispatcher role and the
Reviewer and Auditor stances, and its verified behavior and limits.

## Required Behavior

- `workbench/wiki/skill-spec-manager.md` follows the shape of
  `workbench/wiki/skill-auditor.md`: frontmatter `type: memory`, `status:
  active`, `sensitivity: normal`, `knowledge_role: curated`, `provenance`,
  `source_paths` (repository-relative), `last_verified`; sections for the
  one-paragraph use statement with Inputs/Output/Done when, "How it works",
  "Composition", "Verified behavior and limits", "Sources" and "History".
- It cites the LEXICON Spec Manager definition rather than restating a new
  one, ADR-0036 (stance changes method, not authority) and ADR-000P (roles
  scope work, stances define the job), and the role model article for the
  cross-capability picture. It does not copy live Task state or the Spec's
  progress.
- Cross-links: the three sibling articles (`skill-director.md`,
  `skill-dispatcher.md`, `skill-spec-planner.md`) exist on integration
  `ac6fadbc`. The new article's "Composition" list links each sibling article
  and entry. Cross-link pass (Dispatcher assignment 2026-09-30): where a
  sibling article names another of the four role and stance capabilities by
  its Spec path, the link becomes that capability's article; the Worker
  (S-002E, not delivered) stays a LEXICON term or Spec path, and each
  article's own delivery-Spec link and `source_paths` entry stay. Link-only:
  no behavior claim in a sibling article changes.
- `workbench/wiki/MEMORY.md` "Roles And Stances" gains one router line for
  the article (single writer: the Dispatcher lane merges this line).
- "Verified behavior and limits" is reconciled by the Dispatcher after
  [TK-003I](../TK-003I/TASK.md) records the fresh-context scenario; the draft
  states what the source at its green commit says and names the scenario as
  the Spec evidence it will cite, claiming no owner approval and no
  agent-outcome improvement.

## Boundaries

- One article, one router line and the link-only cross-link pass in the
  three sibling articles. No edits to `templates/wiki` (the auditor article
  precedent landed without a template mirror because the router section is
  project-specific), no root-control edits.
- The Wiki explains and routes; it grants no authority and proves no claim.

## Done Criteria And Closing Proof

- Wiki validation and test-wiki green; doctor shows no unrouted room-brain
  finding; the link hops above are checked and listed in the proof.
- Docs status names the article and router line; remaining gap names the
  cross-links to be added at landing and the verified-behavior reconciliation.
