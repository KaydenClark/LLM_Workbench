# TK-00G - Every skill the Contract names or a lane skill composes as a required step ships in `workbench/skills`

**Task ID:** TK-00G
**Spec ID:** S-00V
**Slice:** Every skill the Contract names or a lane skill composes as a required step ships in `workbench/skills`
**Status:** in-progress
**Blockers:** none
**Destination:** spec-acceptance: S-00V box 7 (the round-trip test starts with nothing outside the clone and ends with everything promoted, pushed, and nothing needed left on the instance)
**Stance:** Builder
**Planned verification:** Red: a test in `tools/test-skills-lane.mjs` scans the root controls and every lane `SKILL.md` for skill references and fails on the committed candidate for each required reference whose target is not in the lane; green after each needed skill joins the lane with its receipt hash and `skillPolicy.required` entry, or its reference is reworded as an optional capability; `render`, `doctor`, full AGENTS suite on the committed candidate; separate-context review.

## Delivery

This is the catalog review. Membership is derived from the owner's locked PW-4
rule (grilling decision-005, 2026-09-22: "If we need it, it should be included
in workbench/skills"), not from a list the owner must confirm: a skill is needed
when the Contract names it or a lane skill composes it as a required step. An
optional mention ("use X when available") is an optional capability under
Desired Behavior 5, not a lane member.

The tentative list (lexicon, domain-modeling, land, preflight, brainstorm,
research, sitrep) is input, not the answer. `sitrep` is excluded here: S-01V's
room-core sitrep owns its return. Copy a joining skill from the personal
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
