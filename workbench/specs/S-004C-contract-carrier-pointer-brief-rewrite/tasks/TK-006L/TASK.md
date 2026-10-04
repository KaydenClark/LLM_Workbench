# TK-006L - Declare maintainer skills that the closed-bundle checks allow and never ship

**Task ID:** TK-006L
**Spec ID:** S-004C
**Slice:** Declare maintainer skills that the closed-bundle checks allow and never ship
**Status:** done
**Stance:** Builder
**Blockers:** TK-005J
**Destination:** spec-acceptance: `RUNBOOK.md` is an operations index in which each operation's procedure is reachable in a skill (for the maintainer-only operations, through the owner's 2026-10-04 choice of option A on TK-005K: a declared maintainer-skill list the closed-bundle checks exclude and never ship).
**Planned verification:** Red: with one skill declared as a maintainer skill in a committed clone of the candidate, `tools/core-skill-installer.mjs install`, `tools/workbench-upgrade.mjs upgrade` and `tools/test-skill-catalog.mjs` refuse it with `invalid-bundled-core` or the exact-bundle assertion, exactly as the TK-005K probe recorded. Green: the declared skill is allowed by all three, an undeclared extra lane skill is still refused, a declaration that names a core skill, an unsafe name, a duplicate or a skill missing from the lane is refused, the declared skill is never installed into a provider home nor laid into an upgraded room's lane, and the real repository's declaration, the skills catalog and the lane agree. `tools/test-core-skill-installer.mjs`, `tools/test-workbench-upgrade.mjs`, `tools/test-skill-catalog.mjs`, `tools/test-skills-lane.mjs`, `tools/test-workbench-layout.mjs` and the full suite pass on the committed candidate.
**Proof:** Full suite 51/51 at e9cb8235 (RUNBOOK Full suite list, dirty []); red 3e9998f6 (installer 2 and upgrade 1 new tests fail invalid-bundled-core; catalog fails exactness in a declared-skill clone), green test-core-skill-installer 33/33, test-workbench-upgrade 7/7, test-skill-catalog ok, also green in a committed clone declaring a probe maintainer skill; guardrails 106.6/113 and 78/100 held; wiki validate ok

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

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004c-maintainer-skill-list | e9cb82356c4858a791192bcdbc039fc59c50f431 | ahead 3 behind 0 | 0 | Red at 3e9998f6 (pre-change committed installer and upgrade): test-core-skill-installer 2 new tests failed (declared maintainer skill refused invalid-bundled-core), test-workbench-upgrade 1 new test failed (invalid-bundled-core), test-skill-catalog failed (no maintainer-skill region; in a committed clone with a declared skill it failed 'exactly the locked 27 skills'). Green at e9cb8235: test-core-skill-installer 33/33, test-workbench-upgrade 7/7, test-skill-catalog ok, test-skills-lane 4/4, test-workbench-layout 73/73, test-cross-provider-fixture ok, test-runbook-index 41/41, test-portability-matrix 6/6, test-governance-core 12/12, test-control-fidelity 37/37; in a committed clone declaring a probe maintainer skill (21a438ea) test-skill-catalog, test-core-skill-installer 33/33 and test-workbench-upgrade 7/7 pass; full suite 51/51 at e9cb8235 dirty [] (RUNBOOK Full suite list); wiki validate ok; guardrails 106.6/113 and 78/100 held (pre at 46ad9789 and post); self-drift pre at 46ad9789 8 attention findings including detached-head (inspection checkout), post on branch 7 attention findings, the same set less detached-head, none about this Task. | workbench/skills/README.md Maintainer skills section and region; RUNBOOK.md Skills lane check paragraph; Wiki maintainer-skills (new, routed in MEMORY); workbench/manifest.json maintainerSkills []; templates unchanged (producer-only declaration, a generated room has no maintainer skills). | No maintainer skill is declared yet (TK-005K adds them); Lexicon has no Maintainer skill term (Lexicon writer's turn, TK-005N); a symlinked directory in the lane is still ignored rather than refused by the closed-bundle checks (pre-existing, unchanged). | 65a7923f5a43ee587211c0c622ca4670508f0d2bbbfc70ff1ac8d7055f463c13 |
| 2 | claude/s004c-maintainer-skill-list | aed4dca0cb83210443e5bf63fa3df083e808fce8 | ahead 0 behind 0 | 0 | Full suite 51/51 at e9cb8235 (RUNBOOK Full suite list, dirty []); red 3e9998f6 (installer 2 and upgrade 1 new tests fail invalid-bundled-core; catalog fails exactness in a declared-skill clone), green test-core-skill-installer 33/33, test-workbench-upgrade 7/7, test-skill-catalog ok, also green in a committed clone declaring a probe maintainer skill; guardrails 106.6/113 and 78/100 held; wiki validate ok | workbench/skills/README.md Maintainer skills section and region; RUNBOOK.md Skills lane check paragraph; Wiki maintainer-skills (new, routed in MEMORY); manifest maintainerSkills []; templates unchanged (producer-only declaration) | No maintainer skill declared yet (TK-005K); no Lexicon Maintainer skill term (TK-005N, Lexicon writer's turn); a symlinked lane directory is still ignored rather than refused (pre-existing) | 73d52635f0a9b71eff0f21c0767504c6d71b005d2f557ae736b0b49d0aee1399 |
