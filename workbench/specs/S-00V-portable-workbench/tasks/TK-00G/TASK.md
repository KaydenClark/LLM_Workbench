# TK-00G - Every skill the Contract names or a lane skill composes as a required step ships in `workbench/skills`

**Task ID:** TK-00G
**Spec ID:** S-00V
**Slice:** Every skill the Contract names or a lane skill composes as a required step ships in `workbench/skills`
**Status:** done
**Blockers:** none
**Destination:** spec-acceptance: S-00V box 7 (the round-trip test starts with nothing outside the clone and ends with everything promoted, pushed, and nothing needed left on the instance)
**Stance:** Builder
**Planned verification:** Red: a test in `tools/test-skills-lane.mjs` scans the root controls and every lane `SKILL.md` for skill references and fails on the committed candidate for each required reference whose target is not in the lane; green after each needed skill joins the lane with its receipt hash and `skillPolicy.required` entry, or its reference is reworded as an optional capability; `render`, `doctor`, full AGENTS suite on the committed candidate; separate-context review.
**Proof:** Catalog review at 655ea90: new test 4 in tools/test-skills-lane.mjs red on the committed candidate (unclassified domain-modeling, init, path, tdd, wayfinder), green after the disposition table in workbench/skills/README.md Referenced non-lane skills; tests 1-4 green on the committed tree; mutation (tdd marked required/joined) fails as expected. Dispositions (skill | reference | requirement | disposition): domain-modeling | grilling SKILL.md | optional | optional mention; wayfinder | grilling SKILL.md, BLUEPRINT.md | optional | optional mention; tdd | tracer-bullet SKILL.md | optional | optional mention (red/green lives in AGENTS.md and lane implement/builder); brainstorm | BLUEPRINT.md | optional | optional mention; prototype | BLUEPRINT.md | optional | optional mention; research | BLUEPRINT.md, README.md | none | out of scope (activity, and README's simonw/research repo link); init | README.md | none | out of scope (Claude Code built-in); path | RUNBOOK.md | none | out of scope (path form); lexicon, land, preflight, sitrep, diagnosing-bugs, codebase-design | none | none | out of scope (unreferenced as skills; sitrep owned by S-01V). No skill joins, so skillPolicy.required and the lane are unchanged. Names considered: personal catalog at 8832f07d701bacfb75f04a873e01e15b1afe968e plus skills-pending and skills-archive; template controls checked by hand and reference only lane skills. Guardrail 78/100 before and after.

## Delivery

This is the catalog review. Membership is derived from the owner's locked PW-4
rule (grilling decision-005, 2026-09-22: "If we need it, it should be included
in workbench/skills"), not from a list the owner must confirm: a skill is needed
when the Contract names it or a lane skill composes it as a required step. An
optional mention ("use X when available") is an optional capability under
Desired Behavior 5, not a lane member.

The tentative list (lexicon, domain-modeling, land, preflight, brainstorm,
research, sitrep) is input, not the answer. `sitrep` is excluded here: the room-core sitrep planned with S-01X (the
generated JSON taskboard Spec from S-00O) owns its return. Copy a joining skill from the personal
catalog read-only, recording its source commit in the lane receipt; never edit
the personal catalog or publish to it. Prefer joining a skill (additive) over
rewording a lane skill, because the per-skill rebuild Specs S-00X..S-01S own
those files and several are in flight; where a reword is the right answer and
the owning rebuild Spec is live, record the needed wording in S-00V's gap
instead of editing.

## Done Criteria

- The proof records a table of every referenced non-lane skill with its
  disposition (joined, optional mention, out of scope) and the reference that
  decided it.
- A scrubbed clone still resolves every `skillPolicy.required` skill through
  both discovery roots (`tools/test-skills-lane.mjs` first test stays green).
- The owner can correct any disposition; none waits on him.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s00v-tk00g-catalog-review | 655ea90657bb66736b0d37527396012f8f72fea7 | ahead 1 behind 0 | 0 | Catalog review at 655ea90: new test 4 in tools/test-skills-lane.mjs red on the committed candidate (unclassified domain-modeling, init, path, tdd, wayfinder), green after the disposition table in workbench/skills/README.md Referenced non-lane skills; tests 1-4 green on the committed tree; mutation (tdd marked required/joined) fails as expected. Dispositions (skill \| reference \| requirement \| disposition): domain-modeling \| grilling SKILL.md \| optional \| optional mention; wayfinder \| grilling SKILL.md, BLUEPRINT.md \| optional \| optional mention; tdd \| tracer-bullet SKILL.md \| optional \| optional mention (red/green lives in AGENTS.md and lane implement/builder); brainstorm \| BLUEPRINT.md \| optional \| optional mention; prototype \| BLUEPRINT.md \| optional \| optional mention; research \| BLUEPRINT.md, README.md \| none \| out of scope (activity, and README's simonw/research repo link); init \| README.md \| none \| out of scope (Claude Code built-in); path \| RUNBOOK.md \| none \| out of scope (path form); lexicon, land, preflight, sitrep, diagnosing-bugs, codebase-design \| none \| none \| out of scope (unreferenced as skills; sitrep owned by S-01V). No skill joins, so skillPolicy.required and the lane are unchanged. Names considered: personal catalog at 8832f07d701bacfb75f04a873e01e15b1afe968e plus skills-pending and skills-archive; template controls checked by hand and reference only lane skills. Guardrail 78/100 before and after. | workbench/skills/README.md gains the Referenced non-lane skills section (rule, test contract, 14-row disposition table); RUNBOOK skills lane wording is recorded in the remaining gap instead of edited (S-00P holds root controls) | Needed control wording for TK-01P (not edited; S-00P rewrites controls): RUNBOOK Skills lane check, append: 'A skill the Contract names or a lane skill composes as a required step ships in the lane. Every other skill reference in a root control or lane SKILL.md has a row in workbench/skills/README.md Referenced non-lane skills, and tools/test-skills-lane.mjs fails on a reference with no row.' S-00V Current Verified State (pre-anchored, left as published) says the root controls name research; that mention is README's link to Simon Willison's research repository, not the skill. The owner may correct any disposition. | d803e2dc6536dd6eea1d072130715bceba6285e7d71d877823699eb93ddae619 |
