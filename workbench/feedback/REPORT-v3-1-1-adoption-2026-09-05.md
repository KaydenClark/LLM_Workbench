# V3.1.1 Adoption Feedback Report

How the v3.1.1 harness performed during a real v2.3 -> v3.1.1 adoption of an
existing project with code, history, and a prior harness.

## Target And Scope

- Date: 2026-09-05.
- Question: what does the v3.1.1 Adoption path actually cost an adopting agent,
  and where does the harness create work it could have prevented?
- Harness under test: `LLM_Workbench` at commit
  `fa04e27261497ad5aa2f62085764fb6581b2e7e1`, the commit recorded in the
  adopted project's manifest provenance and tools receipt.
- Adopted project: `OpenBrain`
  (`https://github.com/KaydenClark/OpenBrain.git`), previously on the v2.3
  dialect with root `specs/`, root `MEMORY.md`, root `HARNESS_FEEDBACK.md`, and
  two hand-pinned lifecycle tools at root `tools/`.
- Adoption result: branch `claude/workbench-v3-1-1-adoption` at `e81be8c`,
  pushed and remotely recoverable. Owning record:
  `workbench/specs/S-008-workbench-v3-1-1-adoption/SPEC.md` in that project.
- Inspected surfaces: `tools/workbench-adoption.mjs`,
  `tools/workbench-tools.mjs`, `workbench/tools/workbench-layout.mjs`,
  `workbench/tools/spec-workbench.mjs` diagnostics,
  `tools/feedback-automation.mjs`, `templates/ADOPTION.md`,
  `templates/AGENTS.md`, `templates/LEXICON.md`,
  `templates/WORKBENCH_FEEDBACK.md`.
- This is a single-project adoption, not a controlled trial. It establishes
  what happened once, on one real repository, with one agent.

## Evidence And Limitations

Executed and observed:

- Rehearsal on a disposable copy before touching the repository returned
  `status: complete` with two repairable findings, then the real run returned
  the same. The rehearsal is the reason no repair happened on live state.
- `migrate` moved three sources: `specs` -> `workbench/specs`, `MEMORY.md` ->
  `workbench/wiki/MEMORY.md`, `HARNESS_FEEDBACK.md` ->
  `workbench/feedback/WORKBENCH_FEEDBACK.md`; it installed 11 managed tools
  with a receipt naming release `v3.1.1` and the exact source commit.
- `workbench-layout.mjs validate` -> `valid`, schema 2, six lanes, seven
  collections.
- `spec-workbench.mjs render` is idempotent; `doctor` -> ok with no blocking
  finding.
- Content integrity after the move: every migrated file is byte-identical to
  its pre-migration blob except three deliberate edits (S-007 link depths,
  S-006 supersession link, room-brain frontmatter). The feedback log is
  byte-identical.
- `parseFeedbackRows` over the adopted project's feedback log returns five of
  six data rows.

Limitations:

- One project, one agent, one run. No claim about adoption success rates.
- The adopted project carries two environmental faults of its own (an absent
  canonical Wiki vault, and a hardcoded `REPO_DIR` in a shell script pointing
  outside the repository). Both are recorded in that project's S-008 as project
  work and are excluded from the findings below, which cover the harness only.
- Static and mechanical observations. Nothing here measures agent outcome
  quality, and nothing here should be translated into an agent-outcome claim.

## Findings

Ordered by impact. All five are also logged as discoverable rows in the adopted
project's `workbench/feedback/WORKBENCH_FEEDBACK.md`.

**F-1 (high) - the migration leaves stale duplicates of managed tools and says
nothing.** Adoption installs managed tools into `workbench/tools/` and, by
documented design, never reads or writes an application's root `tools/`. In a
v2.3 project the lifecycle tools lived at root `tools/`, so the migration
necessarily leaves duplicates behind. The leftover v2.3 `tools/spec-workbench.mjs`
still executes and, run against the v3 layout, reported
`render-drift: BLUEPRINT.md generated region is stale` for both projection
controls. That report is entirely false: it looks for a root `specs/` that no
longer exists. Neither the migration result nor `doctor` mentions the
duplicates. Smallest bounded action: have the migration detect root-level files
whose names match the managed tool set and list them in its result as
duplicates to retire, without deleting anything itself. The "never touch root
`tools/`" rule is right; silence about a known consequence of that rule is not.

**F-2 (high) - feedback rows are silently dropped from reporting.**
`templates/WORKBENCH_FEEDBACK.md` documents the status lifecycle as
`new` -> `sent` -> `landed`/`declined`, and `parseFeedbackRows` collects only
rows whose status is exactly `new`. The adopted project's 2026-07-28 row was
logged with status `open`, outside that vocabulary, and has therefore been
invisible to feedback discovery since the day it was written. Reproduced:
`parseFeedbackRows` returns 5 rows from a file holding 6 data rows. The parser
throws on a bad date and on a wrong column count, but skips an unknown status
without a word. The same row states impact as prose with no leading grade,
which the parser silently coerces to `low`. This one matters directly for
longitudinal reporting: a typo removes a finding from every aggregate, forever,
with no error anywhere. Smallest bounded action: raise a malformed-row error
for a status outside the documented vocabulary and for an impact cell with no
leading `low`/`medium`/`high`, exactly as the parser already does for a bad date.

**F-3 (medium) - the spec lane move breaks root-relative links without
repairing or reporting them.** Moving specs from root `specs/` into
`workbench/specs/` puts every spec one directory deeper. The migration neither
adjusts nor reports root-relative links inside the moved files, so S-007's three
`../../schema.sql` and `../../ingest_wiki.mjs` links began resolving into
`workbench/` instead of the repository root. `doctor` did surface them as
`broken-link`, severity attention, blocking none, so the breakage was visible
but non-blocking and easy to carry into a commit. Smallest bounded action:
rewrite root-relative links in moved files by the depth delta, or list the
affected files in the migration result.

**F-4 (medium) - the migrated room brain violates the wiki contract on
arrival.** The migration moves a legacy root `MEMORY.md` into
`workbench/wiki/MEMORY.md`, where `workbench/wiki/SCHEMA.md` requires YAML
frontmatter on every active note. It writes none, so the same run's own
`doctor` immediately reported `invalid-note: workbench/wiki/MEMORY.md has no
frontmatter`. The tool produces a state its own validator rejects, on every v2
adoption that has a root room brain. Smallest bounded action: seed the required
frontmatter when moving a legacy room brain, the way `seedWiki` already fills
the wiki contract files.

**F-5 (medium) - the manifest records its own provenance as `unrecorded` while
a sibling artifact from the same run has it.** `migrate` never passes
`--source-commit` to `initialize`, so `provenance.source.commit` is written as
the literal string `unrecorded`. The tools receipt written moments later in the
same run records the exact commit correctly. `templates/ADOPTION.md` requires
recording the resolved source commit, so the field was filled in by hand after
the run. Smallest bounded action: resolve the commit once inside `migrate`, as
the tools installer already does, and pass it to `initialize`.

## What The Version Did Well

Recorded because the point of this lane is version-over-version performance,
not a defect list.

- **The rehearsal was possible and cheap.** `migrate` is a single idempotent
  command against a project path, so rehearsing on a disposable copy before
  touching live state cost one `cp -R`. Every finding above was discovered on
  the copy, not on the real repository.
- **Fail-before-mutation preflight held.** The preflight checks an existing
  support root, control presence and placeholders, user-scoped core skills,
  legacy path collisions, feedback collisions, and recovery collisions before
  writing anything. Nothing in this adoption reached a partial state.
- **Diagnostics got materially more honest than v2.3.** The v2.3 `doctor`
  reported a flat `ok - spec workbench doctor passed` on the pre-migration tree.
  The v3.1.1 `doctor` on the same specs surfaced three `blocked-slice` findings
  that had been true and hidden the whole time. Both versions' `next --json`
  returned `null`, so nothing regressed; v3.1.1 simply stopped hiding why.
  This is the single clearest quality improvement observed in the run.
- **The tools receipt replaces a worse mechanism.** The adopted project had
  been pinning two SHA-256 values by hand in its Runbook, with prose explaining
  that a mismatch might mean an upgrade or might mean a broken checkout. The
  receipt carries source repository, release, commit, and a hash per file, which
  answers that question directly.
- **Blocking effects are registered rather than improvised.** `doctor` failing
  only on `all` and `selection`, with `attention` and `selected-slice` staying
  visible, let a real adoption finish while keeping genuine project blockers on
  screen. F-3 is the exception that proves the rule: an attention-level finding
  was the right severity, but the tool that caused it should have said so itself.

## Challenged Or Rejected Findings

- **"The migration froze work selection."** Rejected. `next --json` returned
  `null` after the migration, but it also returned `null` on a pristine export
  of the pre-migration commit using the v2.3 tool. The three ready tickets carry
  standing owner gates; that is project state, not harness behavior.
- **"v3.1.1 introduced three new blocked-slice errors."** Rejected as stated.
  The findings are not new; their visibility is. Recorded above as an
  improvement rather than a defect.
- **"Adoption should have migrated the application's root `tools/`."**
  Rejected. Root `tools/` held product code alongside the duplicated harness
  tools, and a migration that moved or rewrote application source would be far
  worse than one that leaves duplicates. The defect is the silence (F-1), not
  the boundary.
- **The adopted project's absent Wiki vault and stale hardcoded `REPO_DIR`.**
  Out of scope. Both are project configuration, recorded in that project's
  S-008. Neither was caused by the harness and neither is counted here.

## Next Action And Open Questions

- No repair is authorized by this report. F-1 through F-5 are proposals; each
  names its smallest bounded action above and each is logged as a `new`
  feedback row in the adopted project for the normal return channel.
- F-2 is the one worth doing first if longitudinal reporting is the goal, since
  it silently corrupts the input to every future aggregate.
- Open question for the owner: the five rows are logged in the adopted
  project's lane, which is where the return channel expects them. There is no
  aggregate view yet. `discoverFeedback(projectsRoot)` already sweeps a projects
  root and fingerprints rows, so the reporting the owner asked for is closer to
  a consumer of that function than to a new format.
- Open question: this lane holds reports named by topic and date, with no
  machine-readable index. Version-over-version reporting across reports will
  need either a convention or a small index; that decision is the owner's.

## Review Boundary

Self-produced. The author performed the adoption being assessed, so this is not
an independent review, and no finding here has been checked by a separate
context. The mechanical claims are reproducible from the commands and commits
named above; the judgments in "What The Version Did Well" and in the challenged
findings are the author's own and should be treated as such. A separate-context
reviewer is still required before the adoption branch combines into
`integration`.
