# S-031 - Installed Skill Generation Visibility

**Spec ID:** S-031
**Status:** complete
**Priority:** 1
**Owner:** claude-fable-5-1
**Stance:** Builder
**Updated:** 2026-09-05
**Catalog description:** Record the release and commit in every Workbench-managed skill marker, have doctor report an installed skill whose generation is stale or unknown, and require review claims about a skill to name the copy they read.
**Blockers:** none
**Latest event:** Spec completed and removed from the hot board.
**Next gate:** none

## Outcome

An agent or reviewer holding an installed skill can tell which Workbench
generation it came from, a room's doctor names installed core skills that are
behind the room's manifest version or of unknown origin, and a review can no
longer attribute an installed copy's text to the release.

## Why It Matters

The v3.1.1 review of Command Information Center recorded a high-severity
finding that `skills/update-harness/SKILL.md` names
`$INSTANCE_ROOT/Foundry/Halls/Forge`. At v3.1.1 and at every later commit the
canonical file says the opposite; the reviewer was reading an installed copy on
the host. Master Workbench's fix list kept that finding as `not-supported`
(UP-010) and derived UP-002 from it (rank `first`): nothing told the reviewer
which copy it held, so the defect manufactured false evidence against the
harness, which is the evidence the harness improves from. S-027's own
limitations record the same host: the user-scoped discovery root is a foreign
Git repository, its twelve workflow skills differed from `skills/` with no
stance present, and the installer and explicit upgrade both fail closed there.
The acceptance report's F-005 re-read that root later: all four stances were
present by then and four installed skills still differed, so shipped and
installed skills drift with nothing detecting the divergence. The acceptance report's F-005
adds the privacy consequence: the installed `grilling` and `checkpoint` copies
write live notepads into a spaced `grilling diary/` directory that the sessions
ignore rules do not cover, so a notepad becomes committable before the
checkpoint privacy scan ever runs.

## Current Verified State

Verified in this repository at `b7b23dd3f0929e37276880335cd4d4cc60238d8e`
on 2026-09-05:

- `tools/core-skill-installer.mjs:112` and `tools/workbench-upgrade.mjs:133`
  write the managed marker `.workbench-skill.json` as
  `{"schemaVersion":1,"source":"LLM Workbench core"}`. It records no release,
  commit, or content hash, so nothing can compare an installed copy with the
  release a room runs even in principle.
- `tools/workbench-upgrade.mjs:57-64` reads the marker only to decide whether a
  skill may be replaced. No doctor code in `workbench/tools/diagnostics.mjs`
  concerns skills; `SCOPES` (line 11) has no skills scope.
- `workbench/manifest.json` already declares `skillPolicy.discovery` as
  `.agents/skills` and `.claude/skills` under the user home, so the roots a
  diagnostic would read are a declared fact.
- `workbench/tools/workbench-layout.mjs:20` `SESSIONS_IGNORE` denies
  `grilling/*` and `handoffs/*` only.
- `templates/feedback/REPORT_FORMAT.md` and `workbench/feedback/REPORT_FORMAT.md`
  (both updated by S-028 for scoped IDs and explicit destinations) do not ask a
  Canon claim about a skill to name the copy it was read from.
- `grep -rn 'INSTANCE_ROOT\|Foundry' skills/` returns nothing, and
  `tools/test-portability-matrix.mjs` asserts no active surface names a
  Foundry path; the UP-010 refutation holds at this commit.

Gap: everything under Desired Behavior.

## Desired Behavior

1. The managed marker becomes schema 2:
   `{ schemaVersion: 2, source, release, commit, contentHash }`, written by
   the installer and the explicit upgrade from the release checkout's
   identity (the same `sourceIdentity` the tools receipt uses). Readers accept
   schema 1 as "generation unknown".
2. `doctor` accepts `--home` (default: the user home) and, for each skill the
   manifest requires, reports `stale-skill` (attention, new `skills` scope,
   effect `none`) when a marker's `release` differs from the manifest
   `workbenchVersion`, and `skill-generation-unknown` (attention, `skills`,
   `none`) when a required skill is present in a discovery root with no schema
   2 marker. A missing skill is not this spec's finding; Adoption preflight
   already blocks on it.
3. Both report formats require that a Canon claim about a skill names the
   canonical `skills/<name>/SKILL.md` path and the commit read, and that a
   claim about an installed copy says so and names the discovery root.
4. `SESSIONS_IGNORE` additionally denies the legacy spaced `grilling diary/`
   name so a stale installed skill cannot make a live notepad trackable;
   `validate` keeps accepting existing ignore files that lack the line, and
   `writeSessionsIgnore` appends it losslessly.

## Decisions And Contracts

- **A marker without a generation is unknown, not fine.** Schema 1 markers
  are reported as unknown rather than silently accepted, because "accepted by
  presence" describes setup policy, not evidence quality.
- **Doctor reads the home read-only.** It never installs, replaces, or edits a
  skill; presence-only setup and explicit-only updates (S-021, S-027) are
  unchanged. A foreign Git discovery root is reported through its unknown
  generations, not touched.
- **The review method labels the copy.** This is the half of UP-002 that no
  tool can enforce; it lives in the report format both this repository and
  downstream rooms carry.
- **The ignore line is defense, not endorsement.** `grilling diary/` remains
  an undeclared legacy path; the root cause is a stale skill, which
  `stale-skill` names.

## Non-Goals

- Synchronizing the owner host's foreign Git skill root; only its owner can.
- Comparing skill content beyond the recorded hash, or scoring skills.
- Reopening UP-010: the record is corrected by this spec's evidence, not by a
  harness change.

## Dependencies And Blockers

- none

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Schema 2 marker from installer and upgrade; `stale-skill` and `skill-generation-unknown` in doctor with `--home` | done | none | node tools/test-core-skill-installer.mjs (schema 2 marker fields), node tools/test-workbench-upgrade.mjs (schema 2 marker after replacement and refresh; schema 1 still managed), node tools/test-diagnostics.mjs (doctor --home: stale-skill, skill-generation-unknown, home snapshot unchanged, schema 1 unknown), node tools/test-workbench-layout.mjs, node tools/test-portability-matrix.mjs; live doctor on this checkout against the real home read 32 skill-generation-unknown attention findings, exit 0 once rendered |
| TK-002 | Report formats require naming the copy read; sessions ignore denies `grilling diary/` losslessly | done | TK-001 | node tools/test-workbench-layout.mjs (init into a git-initialised disposable project: git check-ignore accepts workbench/sessions/grilling diary/notepad.md, project rules kept byte-for-byte, checkpoints trackable, an older ignore file without the line still validates), node tools/test-portability-matrix.mjs, node tools/test-workbench-adoption.mjs, node tools/test-diagnostics.mjs, node tools/test-feedback-automation.mjs, node tools/test-guardrail-audit.mjs; templates 106.6/113 unchanged |

### TK-001 - The marker carries its generation

**Stance:** Builder

Red first: install the core bundle into a disposable home, rewrite one marker's
`release` to `v0.0.0` and delete another marker entirely, then run `doctor
--home` on a disposable project; it must report `stale-skill` for the first
and `skill-generation-unknown` for the second and nothing for the rest. The
installer test asserts the schema 2 fields; the upgrade test asserts the same
marker after replacement. Register the codes and the `skills` scope.

### TK-002 - Claims name their copy

**Stance:** Builder

Update both `REPORT_FORMAT.md` copies with one paragraph under Findings.
Red first for the ignore rule: `init` into a disposable project, then
`git check-ignore workbench/sessions/grilling\ diary/x.md` must succeed; an
existing ignore file with project rules keeps them byte-for-byte.

## Acceptance Criteria

- [x] Installer and upgrade write schema 2 markers with release, commit, and content hash; schema 1 markers still read.
- [x] `doctor --home` reports `stale-skill` and `skill-generation-unknown` per required skill and never writes to the home.
- [x] Both report formats require a skill claim to name the canonical path and commit or to say it read an installed copy.
- [x] The sessions ignore denies `grilling diary/` and existing ignore rules are preserved.
- [x] The full required suite, render, and doctor pass.

## Testing Seams

- `core-skill-installer.mjs install --home` and `workbench-upgrade.mjs upgrade`
  against disposable homes; marker JSON on disk.
- `doctor(root, { home })` findings; `describe(code)`.
- `writeSessionsIgnore` output and `git check-ignore` in a disposable project.

## Verification Procedure

```bash
node tools/test-core-skill-installer.mjs
node tools/test-workbench-upgrade.mjs
node tools/test-diagnostics.mjs
node tools/test-workbench-layout.mjs
node tools/test-portability-matrix.mjs
```

Then the full `AGENTS.md` verification suite, `render`, `doctor`, and
`git diff --check`.

## Documentation Impact

- `RUNBOOK.md` (root and template): `doctor --home`, the two findings, and
  the marker fields.
- `skills/README.md`: the marker schema.
- `templates/feedback/REPORT_FORMAT.md` and `workbench/feedback/REPORT_FORMAT.md`.
- `LEXICON.md`: `Managed skill marker` term once TK-001 lands.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-05 | spec | Spec captured from upstream fix-list items UP-002 (rank first) and UP-010 (not-supported, kept) and acceptance report F-005 | Marker writers re-read at `core-skill-installer.mjs:112` and `workbench-upgrade.mjs:133`: no release or commit recorded; `SESSIONS_IGNORE` re-read at `workbench-layout.mjs:20`; Foundry grep over `skills/` empty | Blueprint v3.1.2 direction links this spec | Both slices |
| 2026-09-05 | TK-001 | Ticket closed | node tools/test-core-skill-installer.mjs (schema 2 marker fields), node tools/test-workbench-upgrade.mjs (schema 2 marker after replacement and refresh; schema 1 still managed), node tools/test-diagnostics.mjs (doctor --home: stale-skill, skill-generation-unknown, home snapshot unchanged, schema 1 unknown), node tools/test-workbench-layout.mjs, node tools/test-portability-matrix.mjs; live doctor on this checkout against the real home read 32 skill-generation-unknown attention findings, exit 0 once rendered | RUNBOOK.md (core-skill setup marker paragraph, doctor --home, none-row codes), templates/RUNBOOK.md (doctor --home and marker), skills/README.md (Managed skill marker section), LEXICON.md (Managed skill marker term) | TK-002: report formats name the copy read; sessions ignore denies grilling diary/ |
| 2026-09-05 | TK-002 | Ticket closed | node tools/test-workbench-layout.mjs (init into a git-initialised disposable project: git check-ignore accepts workbench/sessions/grilling diary/notepad.md, project rules kept byte-for-byte, checkpoints trackable, an older ignore file without the line still validates), node tools/test-portability-matrix.mjs, node tools/test-workbench-adoption.mjs, node tools/test-diagnostics.mjs, node tools/test-feedback-automation.mjs, node tools/test-guardrail-audit.mjs; templates 106.6/113 unchanged | templates/feedback/REPORT_FORMAT.md and workbench/feedback/REPORT_FORMAT.md (Findings: a skill claim names the copy read), RUNBOOK.md (sessions ignore denies the legacy grilling diary/ name) | none; spec completion pending |
| 2026-09-05 | spec | Spec completed | Acceptance gates satisfied | Documentation impact recorded above | none |

## Completion Result

Completed 2026-09-05 on `claude/s031-installed-skill-generation` (commits
`ac1b220` TK-001 and `1565e77` TK-002, plus this completion).

What changed:

- `tools/skill-marker.mjs` (new) owns the managed marker: schema 2
  `{ schemaVersion, source, release, commit, contentHash }` built from the
  same `sourceIdentity()` as the tools receipt, a SHA-256 over the skill's
  file paths and bytes, and a reader that accepts schema 1 or 2.
  `tools/core-skill-installer.mjs` writes it on install (the report now names
  `release` and `commit` per installed skill); `tools/workbench-upgrade.mjs`
  accepts schema 1 as managed and rewrites every managed marker at this
  release's generation, changed content or not.
- `workbench/tools/diagnostics.mjs` registers the `skills` scope and the
  attention codes `stale-skill` and `skill-generation-unknown` (effect
  `none`). `workbench/tools/spec-workbench.mjs doctor` accepts `--home`
  (default: the user home), reads each declared discovery root for each
  required skill, and reports the two findings; it never writes there and a
  missing skill is not its finding. `tools/workbench-adoption.mjs` passes its
  own `--home` through.
- `workbench/tools/workbench-layout.mjs` `SESSIONS_IGNORE` additionally
  denies the legacy spaced `grilling diary/` name; `validate` still accepts
  ignore files without it and `writeSessionsIgnore` keeps project rules.
- Both `REPORT_FORMAT.md` copies require a skill claim to name the canonical
  path and commit, or to say it read an installed copy and name the root.
- Docs: `RUNBOOK.md`, `templates/RUNBOOK.md`, `skills/README.md`,
  `LEXICON.md` (`Managed skill marker`).

Why: the v3.1.1 review attributed an installed copy's text to the release
(UP-002, UP-010, F-005); nothing recorded which generation a copy was.

Risks and side effects:

- `doctor` in this checkout now prints 32 `skill-generation-unknown`
  attention findings for the owner host's foreign Git skill roots (read-only,
  exit 0). That is the truthful state until the owner refreshes those roots;
  only the explicit upgrade or a reinstall writes a schema 2 marker.
- Fixtures that assert an exact doctor finding list now pass an empty
  disposable `home` so host state stays out of the assertion.
- The `workbench/tools/` runtime lane changed (`diagnostics.mjs`,
  `spec-workbench.mjs`, `workbench-layout.mjs`); downstream rooms receive it
  through the receipt-backed tools update, not silently.

Verified: red then green at every seam named in the evidence log; the five
Verification Procedure tests, the full `AGENTS.md` suite, the path-safety
eval, `evaluate-workbench` (templates 106.6/113, unchanged), `render`,
`doctor` (exit 0, attention only), and `git diff --check`.

## Remaining Limitations Or Follow-Up Specs

- Markers written before this change stay schema 1 until the next install or
  explicit upgrade; they read as unknown, which is the truthful state. The
  owner host's foreign Git skill roots read as 32 unknown generations today.
- `doctor` records the finding per skill and discovery root; it does not
  compare installed content with the recorded hash (non-goal).
- The version stamp belongs to
  [S-035](../S-035-workbench-v3-1-2-candidate/SPEC.md).

## Supersession

- Supersedes: none
- Superseded by: none
