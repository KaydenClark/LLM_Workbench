# TK-003V - Stage the unreleased domain-modeling candidate source with a scoped test

**Task ID:** TK-003V
**Spec ID:** S-002H
**Slice:** Stage the unreleased domain-modeling candidate source with a scoped test
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-002H Desired Behavior 1-6 stated as the operating contract of one staged candidate entry, and acceptance line 6 (source states exactly which rooms can discover it; pending source and notice recoverable)
**Planned verification:** Red: `node tools/test-domain-modeling-candidate.mjs` written first fails naming the missing candidate `SKILL.md`. Green: the same test passes on the committed candidate, together with `node tools/test-skill-catalog.mjs`, `node tools/test-skills-lane.mjs`, `node tools/test-skill-inspection.mjs` and `node tools/test-workbench-layout.mjs` (bundle unchanged at 26, candidate absent from discovery), then doctor.
**Proof:** Red 84575c09: node tools/test-domain-modeling-candidate.mjs exits 1, seven tests failing on the missing candidate SKILL.md (tk003v-red.txt). Green 84779a90: the same test exits 0 (9/9); mutating the candidate (dropping 'downstream', 'Make no Canon', the any-of-three ADR rule, or the no-GLOSSARY rule) turns it red each time. test-skill-catalog, test-skill-inspection, test-workbench-layout and test-wiki exit 0 at 84779a90; test-skills-lane exits 0 in a verification clone whose integration ref is origin/integration 2780fe66 (it exits 1 on render-drift in any clone of this checkout, including the untouched baseline 2780fe66, because the primary checkout's local integration is 52 commits stale); doctor no blocking finding. Upstream reviewed at mattpocock/skills d81f3a18.

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

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s002h-domain-modeling-candidate | 84779a9058727c40db9c0077f5c19f3bd1b42a5e | ahead 0 behind 0 | 0 | Red 84575c09: node tools/test-domain-modeling-candidate.mjs exits 1, seven tests failing on the missing candidate SKILL.md (tk003v-red.txt). Green 84779a90: the same test exits 0 (9/9); mutating the candidate (dropping 'downstream', 'Make no Canon', the any-of-three ADR rule, or the no-GLOSSARY rule) turns it red each time. test-skill-catalog, test-skill-inspection, test-workbench-layout and test-wiki exit 0 at 84779a90; test-skills-lane exits 0 in a verification clone whose integration ref is origin/integration 2780fe66 (it exits 1 on render-drift in any clone of this checkout, including the untouched baseline 2780fe66, because the primary checkout's local integration is 52 commits stale); doctor no blocking finding. Upstream reviewed at mattpocock/skills d81f3a18. | workbench/specs/S-002H-domain-modeling-skill/candidate/domain-modeling/SKILL.md (new, unreleased); candidate/UNRELEASED.md (new marker); tools/test-domain-modeling-candidate.mjs (new, standalone, not yet in the AGENTS suite list, a root-control slot reserved for publication) | Scenario behavior (TK-003W), Wiki reconciliation (TK-003X), full suite, review and the release owner's publication gate | 2428f16087f49394d7ddaa7ac8be6ffd43315bcf38b668e22c75bcb2a3ade309 |
