# TK-003X - Reconcile the Domain Modeling Wiki article and router with the staged candidate

**Task ID:** TK-003X
**Spec ID:** S-002H
**Slice:** Reconcile the Domain Modeling Wiki article and router with the staged candidate
**Status:** ready
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-002H acceptance line 7 (article and sole router separate upstream method, Workbench adaptation, verified current state, intended behavior and limits) and Documentation Impact
**Planned verification:** `node workbench/tools/wiki.mjs validate` ok; `node tools/test-wiki.mjs` green; doctor reports no `room-brain-unrouted`; a read of the router reaches the article in one hop and the article reaches the candidate, the Spec and the pending source in one hop each.

## Outcome

`workbench/wiki/skill-domain-modeling.md` states the settled required
distribution, the staged unreleased candidate, what the scenarios observed and
the open publication gate, without claiming any room can discover the skill.
The existing Domain Modeling entry in `workbench/wiki/MEMORY.md` says the same
in one line.

## Required Behavior

- Replace the article's open-choice and optional claims with the owner's
  required answer, separating intended distribution from current absence.
- Describe the downstream-consequence move and the upstream-naming example.
- Keep upstream comparison, sources and history; append a dated history line.
- Change only the existing Domain Modeling router hunk.

## Boundaries

- No other router section, generated board, catalog or control edit.

## Done Criteria And Closing Proof

- Wiki validation, test-wiki and one-hop link check recorded.
