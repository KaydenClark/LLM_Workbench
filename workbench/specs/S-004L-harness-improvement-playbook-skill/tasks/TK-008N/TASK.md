# TK-008N - One Wiki page for the one skill with the family as history

**Task ID:** TK-008N
**Spec ID:** S-004L
**Slice:** One Wiki page for the one skill with the family as history
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-008L
**Destination:** wiki-claim: workbench/wiki/skill-improve-harness.md
**Planned verification:** Red/green at a test seam is impractical for prose pages; the strongest concrete checks are `node workbench/tools/wiki.mjs validate` (no finding on the touched pages), `tools/test-wiki.mjs`, the Runbook's small Wiki lint on every touched page, and `tools/test-skills-lane.mjs` for the lineage page's new skill reference; the full suite passes on the committed candidate.

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
