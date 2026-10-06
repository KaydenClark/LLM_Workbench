# TK-008N - One Wiki page for the one skill with the family as history

**Task ID:** TK-008N
**Spec ID:** S-004L
**Slice:** One Wiki page for the one skill with the family as history
**Status:** done
**Stance:** Builder
**Blockers:** TK-008L
**Destination:** wiki-claim: workbench/wiki/skill-improve-harness.md
**Planned verification:** Red/green at a test seam is impractical for prose pages; the strongest concrete checks are `node workbench/tools/wiki.mjs validate` (no finding on the touched pages), `tools/test-wiki.mjs`, the Runbook's small Wiki lint on every touched page, and `tools/test-skills-lane.mjs` for the lineage page's new skill reference; the full suite passes on the committed candidate.
**Proof:** PR #388 merged at 3208c7f5 (candidate 376f2b87, contained); full suite 52/52 on committed e0bec7e1; wiki validate 0 findings; test-wiki 25/25, test-skills-lane 6/6, test-landmark-wiki 79/79; small Wiki lint eight items pass on four touched pages; guardrails 73/100 before and after; self-drift 12 findings pre/post, same set

## Outcome

The Wiki has one validated page for the one skill, routed from the router's
Skills Reference, naming the fifteen-skill host family as the history it
replaces. The lineage page points at the skill beside its attribution of the
playbook, and the skills-draft inventory rows for the family name this Spec as
the owner that retired them.

## Scope

- `workbench/wiki/skill-improve-harness.md` (new).
- `workbench/wiki/MEMORY.md` (one Skills Reference line).
- `workbench/wiki/harness-engineering-lineage.md` (pointer to the skill).
- `workbench/wiki/skills-draft/README.md` (the family rows).

## Acceptance

- [ ] The page validates, is routed, names the family as history and links
      the skill source, this Spec and the playbook decision.
- [ ] The lineage page's playbook sentence links the skill.

## Boundaries

Pages only; no skill, control or template text. The family's host copies are
outside this repository and are not read as Canon.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004l-tk008n-wiki-page | e0bec7e19a4e34aff0081394510dc251bfc26ffc | ahead 0 behind 0 | 0 | Prose pages, red/green impractical (Task's planned verification); wiki validate 0 findings; test-wiki 25/25, test-skills-lane 6/6, test-landmark-wiki 79/79 on 5914a61a; small Wiki lint all eight items pass on the four touched pages; after merging origin/integration eef29648 (TK-008M), full suite 52/52 ok on committed e0bec7e1 (log scratchpad/s004l/suite-tk008n-e0bec7e1.log); guardrails 73/100 before and after; self-drift 12 findings pre/post, same set | workbench/wiki/skill-improve-harness.md (new), workbench/wiki/MEMORY.md (Skills Reference line), workbench/wiki/harness-engineering-lineage.md (playbook sentence links the skill), workbench/wiki/skills-draft/README.md (fifteen family rows retired by S-004L) | Harness Feedback Review landmark page does not name improve-harness; test-wiki's draft-index wording still calls the 15 retired rows planned articles (both routed to Spec QA) | 870a093552ad00910fbdf6b8b9509687218f735a131dcd14a2510d31cb025e7f |
| 2 | claude/s004l-state-mn-close | 92530540ff6bf15025a4b5bf9ca679965e69ea6c | ahead 0 behind 0 | 0 | PR #388 merged at 3208c7f5 (candidate 376f2b87, contained); full suite 52/52 on committed e0bec7e1; wiki validate 0 findings; test-wiki 25/25, test-skills-lane 6/6, test-landmark-wiki 79/79; small Wiki lint eight items pass on four touched pages; guardrails 73/100 before and after; self-drift 12 findings pre/post, same set | workbench/wiki/skill-improve-harness.md new; MEMORY.md, harness-engineering-lineage.md, skills-draft/README.md | Harness Feedback Review landmark page does not name improve-harness; test-wiki draft-index wording for the retired rows (routed to Spec QA) | d27926c3ef85cc2d26e8a00eb5689c8f2de6ec949c491d12b623d25b718dad6a |
