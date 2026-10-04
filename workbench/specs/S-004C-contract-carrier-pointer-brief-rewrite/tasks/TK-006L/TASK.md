# TK-006L - Declare maintainer skills that the closed-bundle checks allow and never ship

**Task ID:** TK-006L
**Spec ID:** S-004C
**Slice:** Declare maintainer skills that the closed-bundle checks allow and never ship
**Status:** ready
**Stance:** Builder
**Blockers:** TK-005J
**Destination:** spec-acceptance: `RUNBOOK.md` is an operations index in which each operation's procedure is reachable in a skill (for the maintainer-only operations, through the owner's 2026-10-04 choice of option A on TK-005K: a declared maintainer-skill list the closed-bundle checks exclude and never ship).
**Planned verification:** Red: with one skill declared as a maintainer skill in a committed clone of the candidate, `tools/core-skill-installer.mjs install`, `tools/workbench-upgrade.mjs upgrade` and `tools/test-skill-catalog.mjs` refuse it with `invalid-bundled-core` or the exact-bundle assertion, exactly as the TK-005K probe recorded. Green: the declared skill is allowed by all three, an undeclared extra lane skill is still refused, a declaration that names a core skill, an unsafe name, a duplicate or a skill missing from the lane is refused, the declared skill is never installed into a provider home nor laid into an upgraded room's lane, and the real repository's declaration, the skills catalog and the lane agree. `tools/test-core-skill-installer.mjs`, `tools/test-workbench-upgrade.mjs`, `tools/test-skill-catalog.mjs`, `tools/test-skills-lane.mjs`, `tools/test-workbench-layout.mjs` and the full suite pass on the committed candidate.

## Outcome

This repository's skills lane is both its own room lane and the release source
lane, so the closed-bundle checks hold it to exactly the core skills, and a
skill that only this repository's maintainers run has no home there (the
TK-005K probe). The owner chose option A on 2026-10-04: a declared
maintainer-skill list. After this Task, `workbench/manifest.json` declares the
maintainer skills by name; the provider-home installer, the one-time upgrade
and the skill-catalog check accept exactly the core skills plus the declared
maintainer skills, still refuse any other lane entry, and never install or lay
down a maintainer skill. The skills catalog lists the declared maintainer
skills in their own region, apart from the closed core bundle.

## Scope

- `tools/core-skill-installer.mjs` and `tools/workbench-upgrade.mjs` source
  validation, through one shared reader of the declaration under `tools/`.
- `tools/test-skill-catalog.mjs`, `tools/test-core-skill-installer.mjs`,
  `tools/test-workbench-upgrade.mjs`.
- `workbench/manifest.json` (the declaration, empty until TK-005K adds a skill),
  `workbench/skills/README.md` (a maintainer-skills region), the Runbook's
  Skills lane check paragraph, and the Wiki page that describes the bundle, if
  any.

## Acceptance

- [ ] A declared maintainer skill passes the installer, upgrade and catalog
      checks; an undeclared extra lane skill still fails them.
- [ ] A malformed declaration (core name, unsafe name, duplicate, missing from
      the lane) fails visibly.
- [ ] No route installs or lays down a declared maintainer skill.
- [ ] The core bundle, its count statements, `skillPolicy.required` and the
      install receipt are unchanged.

## Boundaries

No change to the core bundle, its version label, the room-side lane installer
(`tools/workbench-skills.mjs`, which already copies only core skills) or the
managed runtime tools that ship to rooms. `templates/` is unchanged: the
declaration is this producer repository's own, and a generated room has no
maintainer skills. No Runbook or `AGENTS.md` section moves here; that is
TK-005K.
