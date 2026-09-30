# TK-003V - Stage the unreleased domain-modeling candidate source with a scoped test

**Task ID:** TK-003V
**Spec ID:** S-002H
**Slice:** Stage the unreleased domain-modeling candidate source with a scoped test
**Status:** ready
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-002H Desired Behavior 1-6 stated as the operating contract of one staged candidate entry, and acceptance line 6 (source states exactly which rooms can discover it; pending source and notice recoverable)
**Planned verification:** Red: `node tools/test-domain-modeling-candidate.mjs` written first fails naming the missing candidate `SKILL.md`. Green: the same test passes on the committed candidate, together with `node tools/test-skill-catalog.mjs`, `node tools/test-skills-lane.mjs`, `node tools/test-skill-inspection.mjs` and `node tools/test-workbench-layout.mjs` (bundle unchanged at 26, candidate absent from discovery), then doctor.

## Outcome

`workbench/specs/S-002H-domain-modeling-skill/candidate/domain-modeling/SKILL.md`
holds one Workbench-adapted domain-modeling contract, visibly marked unreleased
and outside every discovery route. A scoped test pins its contract terms, its
non-discovery and the preserved pending bytes.

## Required Behavior

- Frontmatter `name: domain-modeling` and a one-line `description`; an
  unreleased status statement naming this Spec and the open publication gate.
- The active moves: challenge a conflicting term against the accepted owner;
  split an overloaded word into named candidate concepts; probe a relationship
  with a concrete edge case; trace likely downstream consequences of an
  upstream name, boundary or relationship before it settles; cross-check a
  behavior claim against named source/tests and classify agreement,
  documentation drift, implementation gap or unresolved contradiction.
- Routing: shared terms to the room's Lexicon, capability-local meaning to the
  assigned Spec, explanation to the Wiki, qualifying rationale to the
  manifest-declared ADR collection through its own tool; no new glossary,
  CONTEXT, map or ADR root.
- Write boundary: an authorized documentation or delivery pass edits the owner
  inline once meaning settles; a grilling-only or read-only conversation keeps
  pending interpretations, corrections and confirmed answers in working context
  with no Canon write; confirmation never grants permission; one substantive
  owner question at a time when grilling owns the conversation.
- ADR filter: all three tests (meaningful reversal cost, surprising without
  rationale, genuine alternatives); an ADR records why, the binding rule lands
  in its control or Spec in the same authorized pass.
- Attribution to `mattpocock/skills` with the pinned upstream revision reviewed
  and the repository notice.
- The test also asserts: no `workbench/skills/domain-modeling`, no entry in
  `coreSkills` or `skillPolicy.required`, and unchanged `skills-pending/domain-modeling`
  bytes.

## Boundaries

- No edit to `workbench/skills`, the manifest, layout tool, catalog README,
  count-bearing controls, `skills-pending/`, grilling, grill-me, root controls
  or template mirrors.
- The personal installed copy is optional context, not source.

## Done Criteria And Closing Proof

- Red and green outputs named with their commits; the evidence row records the
  pinned upstream revision.
