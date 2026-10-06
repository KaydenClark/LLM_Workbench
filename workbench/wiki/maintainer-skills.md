---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner chose option A for the maintainer-skill home on the Contract Carrier Pointer-Brief Rewrite (S-004C) TK-005K blocker, 2026-10-04
  - S-004C TK-006L built the declared maintainer-skill list, 2026-10-04
  - S-004C TK-005K declared the first three maintainer skills, 2026-10-04
  - Harness Improvement Playbook Skill (S-004L) TK-008M pointed the feedback rows at the improve-harness loop, 2026-10-06
source_paths:
  - tools/maintainer-skills.mjs
  - tools/core-skill-installer.mjs
  - tools/workbench-upgrade.mjs
  - tools/test-skill-catalog.mjs
  - workbench/manifest.json
  - workbench/skills/README.md
  - RUNBOOK.md
  - workbench/skills/workbench-release/SKILL.md
  - workbench/skills/workbench-room-checks/SKILL.md
  - workbench/skills/workbench-evaluation/SKILL.md
  - workbench/skills/improve-harness/SKILL.md
last_verified: 2026-10-06
---

# Maintainer skills

A maintainer skill is a skill in this repository's `workbench/skills` lane that
only this repository's maintainers run: cutting a release, the support-root,
adoption, upgrade and self-drift checks, evaluation and the feedback loop. It
binds here when a Runbook operations index row points to it, like any pointed
lane skill, and it never reaches another room.

## Why it exists

This repository's lane does two jobs. It is the lane this room reads its own
skills from, and it is the release source every other room's core skills are
copied from. The release checks held the lane to exactly the closed core
bundle, so a maintainer-only procedure had no skill home: the Contract Carrier
Pointer-Brief Rewrite (S-004C) found this when it tried to move the
maintainer-only Runbook sections behind index pointers (TK-005K). The owner
chose, on 2026-10-04, "A ) maintainer skills": a declared list the checks
exclude and never ship, rather than leaving those procedures in the Runbook or
in a document that does not bind.

## How it works

- `workbench/manifest.json` names the maintainer skills under
  `maintainerSkills`; the skills catalog lists the same names in its
  [Maintainer skills](../skills/README.md#maintainer-skills) region.
- The provider-home installer, the one-time upgrade and the skill-catalog test
  accept exactly the core skills plus the declared names. Any other extra lane
  entry still fails `invalid-bundled-core`; a declaration that names a core
  skill, an unsafe or duplicate name, or a skill missing from the lane fails
  `invalid-maintainer-skills`.
- No route installs or lays one down: the installer and the room lane install
  copy only the core list, so a generated or upgraded room has no maintainer
  skills and its manifest names none.
- A maintainer skill is not a core skill: the bundle count, its version label,
  `skillPolicy.required` and the install receipt do not change when one is
  added.

Three maintainer skills are declared (Contract Carrier Pointer-Brief Rewrite
TK-005K moved the maintainer-only Runbook procedures into them):

- [`workbench-release`](../skills/workbench-release/SKILL.md): version labels,
  the reference Template upgrade gate, the composed round trip, the
  portability and cross-provider proofs, deriving a room from recorded
  decisions and personal-catalog publication.
- [`workbench-room-checks`](../skills/workbench-room-checks/SKILL.md): the
  skills lane, support root, managed tools, lifecycle classification,
  adoption, control fidelity, explicit upgrade and self-drift checks, plus the
  carrier line-landing, GitHub binding and socket contract checks.
- [`workbench-evaluation`](../skills/workbench-evaluation/SKILL.md): claims,
  evaluation design and commands, this repository's feedback harvest and
  manual report steps around the core
  [`improve-harness`](../skills/improve-harness/SKILL.md) loop (Harness
  Improvement Playbook Skill, S-004L), the automated gate and run outcomes.

Each Runbook section that held one of these procedures keeps its heading and a
pointer, and the operations index row points at the skill section, so the
skill binds for that operation here.

The declaration procedure lives in
the [`workbench-room-checks` skill](../skills/workbench-room-checks/SKILL.md#skills-lane-check); the shared check is
`tools/maintainer-skills.mjs`.
