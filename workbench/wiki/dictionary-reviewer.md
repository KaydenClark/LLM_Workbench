---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Reviewer
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/skills/reviewer/SKILL.md
  - workbench/skills/code-review/SKILL.md
last_verified: 2026-10-07
---

# Reviewer: challenging a candidate's correctness, impact and evidence

Reviewer is the stance that challenges a candidate: whether it is correct, what it affects and whether its evidence holds. The canonical definition is the [glossary entry](../../GLOSSARY.md#stance-terms).

**What it means here.** At a Spec's or landmark's Verify it runs in a separate context; it does not quietly repair the candidate.

**Neighbouring words.** It is the stance in which an [Automated review](dictionary-automated-review.md) carries out the [Review](dictionary-review.md) verb. It is one of the four portable [Stance](dictionary-stance.md) skills, distinct from the [Auditor](dictionary-auditor.md)'s claim-by-claim verdict. The [code-review skill](../skills/code-review/SKILL.md) prepares, records and checks the review; the skill reference page is [Reviewer](skill-reviewer.md).

**In use.** Once this Spec's last Task lands, a fresh context that built none of it takes the Reviewer stance, reads the assembled diff against the Spec's acceptance criteria and records a verdict with `spec-workbench.mjs verdict`. A finding goes back as the next Map, Plan and Journey; the reviewer does not patch the candidate itself.

## Sources

- [GLOSSARY.md, Stance terms](../../GLOSSARY.md#stance-terms): the canonical definition.
- [The reviewer skill](../skills/reviewer/SKILL.md) and [the code-review skill](../skills/code-review/SKILL.md#independent-review-boundaries): the stance and the review procedure.
- [The review ladder decision (DDR-001B)](../docs/ddr/001B-review-climbs-the-ladder-task-by-automated-proof-spec-by-agent-review-landmark-by-integrated-automated-review-and-the-owner-judges-the-concept.md): what each scale is reviewed by.
