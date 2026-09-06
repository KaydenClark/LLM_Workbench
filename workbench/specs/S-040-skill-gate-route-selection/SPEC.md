# S-040 - Skill Gate Route Selection And Link Resolution

**Spec ID:** S-040
**Status:** active
**Priority:** 0
**Owner:** claude-opus-5
**Stance:** Builder
**Updated:** 2026-09-06
**Catalog description:** Make the shared-skill refusals name the route that clears them and stop the installer's link check from being stricter than the install it guards, so a workstation with a linked skill directory is a route choice rather than a portfolio-wide stop.
**Blockers:** none
**Latest event:** TK-002 closed with proof.
**Next gate:** Confirm acceptance criteria and completion result.

## Outcome

An agent that meets the shared-skill gate on a real workstation learns, from the
refusal itself, which supported route clears it. A destination that resolves to
a directory already containing the skill is accepted by the presence-only path
that will only skip it anyway. The safety boundary that refuses to overwrite
unmanaged user content is unchanged.

## Why It Matters

Thirteen of the eighteen v3.1.1 portfolio reviews stopped before touching their
target, and every one of them named the shared user-scoped `code-review` skill
as the blocking gate: eleven met it in the upgrade preflight, two in the core
skill installer. A fourteenth hit the same refusal, judged it a benign setup
check reporting failure, and completed its adoption through the presence check.

The refusal itself is correct and stays. What it costs is that eleven reports
independently recommended the same expensive remedy - an owner-authorized
reconciliation of the shared skill, with inventory and backup, before any
migration could be retried. The whole portfolio treated a route-selection
problem as a workstation-ownership problem, because nothing in the failure
output pointed at `--layout-only`, the route that takes the presence-only path
these two refusals are irrelevant to. This is the single highest-yield item on
the v3.1.1 upstream list: between them, UP-015 and UP-016 account for every
review that never reached its target.

## Current Verified State

Verified in this repository on 2026-09-06. The findings were established at
`b3633e5`; the `file:line` citations were re-anchored to the post-S-036 tree
after PR #63 merged, so following one lands on what it names.

- `tools/workbench-upgrade.mjs:102` refuses with `explicit-update-required` and
  names **both** routes: "Skill replacement requires `--explicit-update`; the
  support-root-only route requires `--layout-only`."
- The two refusals an operator actually reaches on a host with a shared skill
  name **neither** route:
  - `:127` `skill-path-collision`: "`${target}` is not an ordinary directory."
  - `:128` `unmanaged-skill`: "`${target}` is not marked as a Workbench-managed
    skill and will not be replaced."
- Both sit *after* the `if (layoutOnly) { ... return ... }` early exit at
  `:112-116`, so a `--layout-only` run returns before reaching either. Its own
  gate (`missing-user-skills`, `:114`) checks presence only, via
  `missingUserSkills` (`:55-58`), which accepts a skill present in either
  discovery root.
- `tools/core-skill-installer.mjs:63-76` `validateDestinations` rejects a
  destination that is a symlink or not a directory with `skill-path-collision`
  before any mutation. Its own install loop at `:99-106` skips an ordinary
  existing directory as `already-present` without reading it. The pre-check is
  therefore stricter than the operation it guards for exactly the case where the
  operation would do nothing.
- Both consumers of the bundle check presence only:
  `tools/workbench-adoption.mjs:58-60` and `tools/workbench-upgrade.mjs:55-58`.
- Reproduced on the reporting host: `~/.claude/skills/code-review` is a junction
  to `~/.agents/skills/code-review`. dndAPI and dndclient recorded the
  installer's `skill-path-collision` as a high blocker and stopped without
  migrating; eleven further rooms stopped at the upgrade preflight.

Gap: two refusal messages that withhold the route, and one pre-check whose
strictness does not match its own install behavior.

## Desired Behavior

1. `skill-path-collision` and `unmanaged-skill` from `tools/workbench-upgrade.mjs`
   name `--layout-only` as the supported route, and state in one clause why it
   applies: it migrates the support root and never installs, compares, marks,
   backs up, or replaces a skill.
2. `update-harness` states the route-selection rule before the refusal can be
   met, so an agent chooses the route rather than recovering from a stop.
3. `tools/core-skill-installer.mjs` resolves a symlinked or junctioned
   destination and accepts it when its realpath is a directory that contains the
   skill, reporting the resolved target in the result and recording it as
   `already-present` with its resolution. A destination that resolves to a file,
   to a missing target, or to a directory that does not contain the skill still
   refuses with `skill-path-collision`.
4. No path gains permission to write through a link, and no unmanaged skill
   becomes replaceable.

## Decisions And Contracts

- **The safety boundary is upheld.** Agent DVR, Dungeon Friends, Local Agent
  Town, Resume Portfolio, and Timewell all judged the refusal sound, and that
  assessment stands. Nothing here lets the harness overwrite unmanaged user
  content.
- **A gate must name its exit.** A refusal that is correct but routeless
  transfers its cost onto every agent that meets it. This is the meta-caused
  half of the finding and is why the message change, not only the link change,
  is in scope.
- **Resolve, then judge the resolved target.** The installer's decision is made
  about the realpath, and the realpath is reported, so an operator can see what
  was actually accepted.

## Non-Goals

- Replacing the reporting workstation's `code-review` junction with an ordinary
  managed directory. The owner answered open question 2 on 2026-09-06:
  **support the junction as-is**. TK-001 makes that supported; nothing in this
  spec migrates, backs up, or rewrites that link.
- Installing, replacing, or marking any skill on the presence-only path.
- Retrying any portfolio room's migration.

## Dependencies And Blockers

- none

## Vertical Implementation Slices

Tickets are temporary tracer bullets within this stable capability record.

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Accept a linked destination whose realpath already contains the skill, and keep the refusal for a file, a missing target, or a directory without it | done | none | tools/test-core-skill-installer.mjs "a linked destination whose resolved target already holds the skill installs and reports the resolution" plus the file/dangling/directory-without-the-skill refusal cases: red at 09bfff7 with error code skill-path-collision on the linked destination, green after resolveSkillLink judges the realpath (9/9 pass) |
| TK-002 | Name `--layout-only` in the `skill-path-collision` and `unmanaged-skill` refusals and state the route-selection rule in `update-harness` before the gate | done | none | tools/test-workbench-upgrade.mjs "the shared-skill refusals name the layout-only route that clears them": red against the unmodified 09bfff7 messages with actual "... is not an ordinary directory." not matching /--layout-only/, green after both refusals carry the layoutOnlyRoute clause (7/7 pass); node tools/test-skill-catalog.mjs still passes with the new Route selection section |

### TK-001 - Judge the resolved target

**Stance:** Builder

Red first, in `tools/test-core-skill-installer.mjs`: a fixture home where
`.claude/skills/code-review` is a symlink to a directory under `.agents/skills`
that contains the skill must install successfully and report the skill skipped
with its resolved target. That must fail at `b3633e5` with
`skill-path-collision`. Add negative cases in the same red batch: a symlink to a
file, a dangling symlink, and a symlink to a directory that does not contain the
skill must all still refuse. Then resolve and re-judge.

### TK-002 - Name the route

**Stance:** Builder

Red first, in `tools/test-workbench-upgrade.mjs`: assert that both refusal
messages contain `--layout-only`. Then change the messages. Update
`skills/update-harness/SKILL.md` so the route-selection rule is stated before
the migration seam runs, and confirm the skill catalog test still passes.

## Acceptance Criteria

- [x] A fixture home with a linked `code-review` destination whose realpath
      contains the skill installs successfully and reports the resolved target.
- [x] A destination resolving to a file, to a missing target, or to a directory
      without the skill still fails with `skill-path-collision`.
- [x] The `skill-path-collision` and `unmanaged-skill` refusals from
      `tools/workbench-upgrade.mjs` both name `--layout-only`, proved by test.
- [x] `skills/update-harness/SKILL.md` states the route-selection rule before
      the gate is reached.
- [x] `node tools/test-core-skill-installer.mjs`,
      `node tools/test-workbench-upgrade.mjs`, and
      `node tools/test-skill-catalog.mjs` pass, new cases red before green.
- [x] The full `AGENTS.md` verification suite passes.

## Testing Seams

- `tools/core-skill-installer.mjs` `install(home)` report shape, driven from a
  fixture home (`tools/test-core-skill-installer.mjs`).
- `tools/workbench-upgrade.mjs` `preflight` failure codes and messages
  (`tools/test-workbench-upgrade.mjs`).
- The installed skill catalog (`tools/test-skill-catalog.mjs`).

## Verification Procedure

```bash
node tools/test-core-skill-installer.mjs
node tools/test-workbench-upgrade.mjs
node tools/test-skill-catalog.mjs
node tools/test-workbench-adoption.mjs
node workbench/tools/spec-workbench.mjs doctor
```

## Documentation Impact

- `skills/update-harness/SKILL.md`: the route-selection rule stated up front.
- `RUNBOOK.md`: the upgrade route section, if the refusal vocabulary changes.
- `templates/ADOPTION.md`: only if the installer's accepted destinations change
  what an operator must prepare.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-06 | spec | Spec captured from upstream UP-015 and UP-016 and re-verified at `b3633e5` | Read `workbench-upgrade.mjs:54-57,101,111-115,126-127`, `core-skill-installer.mjs:63-76,86-106`, `workbench-adoption.mjs:58-60`; confirmed `--layout-only` bypasses both refusals | Blueprint catalog regenerated by render | Both slices open; the workstation junction question stays with the owner |
| 2026-09-06 | spec | Fresh separate-context review found every `workbench-upgrade.mjs` citation one line short and one containment statement backwards | S-036 shifted the file and the prior repair round did not touch it: `:101`->`:102` (`explicit-update-required`), `:126`->`:127` (`skill-path-collision`), `:127`->`:128` (`unmanaged-skill`), `:111-115`->`:112-116` (the `layoutOnly` early exit), `:113`->`:114` (`missing-user-skills`), `:54-57`->`:55-58` (`missingUserSkills`). Current Verified State also said the two refusals "live inside" the early-exit block; they sit after it, so a `--layout-only` run returns before reaching them. The conclusion was right and the mechanism was stated backwards; both now match the source | No control text changed | TK-001 and TK-002 open |
| 2026-09-06 | TK-001 | Ticket closed | tools/test-core-skill-installer.mjs "a linked destination whose resolved target already holds the skill installs and reports the resolution" plus the file/dangling/directory-without-the-skill refusal cases: red at 09bfff7 with error code skill-path-collision on the linked destination, green after resolveSkillLink judges the realpath (9/9 pass) | skills/update-harness/SKILL.md carries the route rule in TK-002; RUNBOOK.md and templates/ADOPTION.md checked, no update needed because no refusal code and no operator preparation step changed | TK-002 open: both upgrade refusals still withhold the route |
| 2026-09-06 | TK-002 | Ticket closed | tools/test-workbench-upgrade.mjs "the shared-skill refusals name the layout-only route that clears them": red against the unmodified 09bfff7 messages with actual "... is not an ordinary directory." not matching /--layout-only/, green after both refusals carry the layoutOnlyRoute clause (7/7 pass); node tools/test-skill-catalog.mjs still passes with the new Route selection section | skills/update-harness/SKILL.md gains a Route selection section before section 1, so the rule is stated before the migration seam runs; RUNBOOK.md checked, no update needed because both refusal codes and both documented routes are unchanged - only the message now names the route | none for this spec; the independent integration review is the remaining owner gate |
| 2026-09-06 | spec | Both slices verified together on the committed tree at `2f5f9e1` | Full `AGENTS.md` suite: 25 node test files, `evals/tasks/task_b_path_safety/test_grade.py`, `evaluate-workbench --path templates --include-controls`, `render`, and `doctor` all green; each new case was run against the unmodified `09bfff7` implementation before any source edit | `skills/update-harness/SKILL.md` updated; `RUNBOOK.md` and `templates/ADOPTION.md` checked, no update needed - no refusal code and no operator preparation step changed | Spec left `active` with `Pending` completion for the separate-context integration review, matching S-036, S-037 and S-038 |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- The reporting host's `code-review` junction is supported as-is by owner
  decision of 2026-09-06, recorded in
  [S-038](../S-038-v3-1-2-upstream-fix-list/SPEC.md). No limitation remains from
  that question; TK-001 is what makes the junction a supported destination.
- Rooms that already stopped are not retried by this spec.

## Supersession

- Supersedes: none
- Superseded by: none
