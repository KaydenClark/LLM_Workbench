---
date: 2026-09-23
canonicalized_in:
  - RUNBOOK.md
  - LEXICON.md
  - BLUEPRINT.md
  - workbench/specs/S-00V-portable-workbench/SPEC.md
---

# Core skills ship in the workbench skills lane

Every room carries the core skills it needs inside the repository at
`workbench/skills`, the seventh manifest-declared lane. The lane is owned and
versioned by LLM Workbench, laid down by Genesis and Adoption from the release
checkout with a receipt (`.workbench-skills.json`) naming the source
repository, release, commit and a content hash per skill, and replaced only by
the ordinary Workbench update (`tools/workbench-skills.mjs update
--explicit-update`). The two declared discovery roots, `.agents/skills` for
Codex and `.claude/skills` for Claude Code, are tracked relative links into
the lane, so a fresh clone discovers every core skill with no provider home
and no personal catalog. A room may add its own skills to the lane under other
names; the update never copies, hashes, replaces or removes them. This
producer repository authors the core in the same lane, so one path is both
the source and the installed lane, and a root `skills/` directory in any room
is a doctor finding because it shadows the lane.

The owner's personal catalog keeps two roles and no third: a backup of every
skill, and the publication target a room may push skills it creates to,
through a separately authorized operation (`tools/core-skill-installer.mjs`).
It is never on a room's critical path, and doctor never reads it.

Considered and rejected: keeping the installed core in the provider home
(ADR-0046's rejection of "per-room core copies"). A clone then discovers no
skills, a cloud instance cannot start from the repository alone, and every
host has to be prepared by hand before the room works; that is the opposite
of a Portable Workbench. Considered and rejected: keeping root `skills/` as
the authoring source with `workbench/skills` as built output, which
duplicates twenty-one skills inside one repository and makes the dogfood room
differ from every room it ships. Considered and rejected: a session-start
bootstrap that fetches skills from a catalog, which puts a network dependency
and a second source of truth on the critical path.

Consequences: `workbench/manifest.json` declares `lanes.skills` and the
`skillPolicy` shape `normalSetup: lane-install`, `updates: workbench-update`;
rooms stamped before the lane keep validating with six lanes and the
provider-home policy until they update. Genesis readiness fails closed on a
missing lane receipt or a discovery adapter that does not resolve into the
lane. Doctor reports `skill-lane-missing`, `skill-lane-unreadable`,
`skill-adapter-missing`, `skill-adapter-broken` and `project-local-skills`
from the room tree; the `doctor --home` inspection of installed provider-home
skills is retired. `RUNBOOK.md` owns the lane procedures and the personal
catalog publication; `LEXICON.md` owns the Skills lane, Core skill bundle,
Normal setup and Explicit skill update rows; `BLUEPRINT.md` describes the
skills as shipping with the room. This record supersedes
[ADR-0017](archive/0017-workbench-support-directory-has-six-lanes.md) (six
lanes become seven) and narrows
[ADR-0046](0046-core-personal-shared-and-room-local-skill-ownership.md): its
ownership scopes stand, but the installed core lives in the room, not the
provider home, and the personal catalog is backup and publication target only.

Provenance: owner decisions PW-3, PW-3A and PW-4, locked 2026-09-22 in the
grilling record `portable-workbench-cloud-deployable-2026-09-22` and carried
into [S-00V](../../specs/S-00V-portable-workbench/SPEC.md) Decisions And
Contracts; implemented by S-00V TK-001.
