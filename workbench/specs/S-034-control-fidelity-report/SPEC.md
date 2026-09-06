# S-034 - Control Fidelity Report

**Spec ID:** S-034
**Status:** complete
**Priority:** 2
**Owner:** claude-fable-5-1
**Stance:** Builder
**Updated:** 2026-09-05
**Catalog description:** Report which template-derived lines a room's hand-reconciled controls changed, dropped, or added, so a deliberate divergence can be recorded and an accidental one is caught.
**Blockers:** none
**Latest event:** Spec completed and removed from the hot board.
**Next gate:** none

## Outcome

After Adoption or an update-harness run, the operator sees exactly which
lines of each root control differ from the template they derive from, sorted
into expected placeholder fills, unchanged text, dropped lines, changed lines,
and additions, and decides which divergences to keep and record.

## Why It Matters

Adoption and upgrade both require reconciling several hundred lines of control
text by hand, and no check compares the result with its source. Command
Information Center dropped the qualifier "(rule binds only where
`canonicalized_in` points)" from its `AGENTS.md` ADR ownership row during a
392-line reconciliation, so its adopted rule is unconditional and stricter
than the harness rule, and nothing records that as a decision (fix list
UP-008, rank `medium`, `no-control-fidelity-check`). The only automated check
on an adopted control's text is the placeholder search. Rooms are meant to
diverge from the template; they are not meant to diverge silently.

## Current Verified State

Verified in this repository at `b7b23dd3f0929e37276880335cd4d4cc60238d8e`
on 2026-09-05:

- `workbench/tools/template-placeholders.mjs` exports the placeholder
  vocabulary and `containsPlaceholder`; it detects unfilled `[BRACKETED]`
  tokens and nothing else.
- No tool in `tools/` or `workbench/tools/` reads `templates/` beside a room's
  controls. `tools/evaluate-workbench.mjs` scores control coverage against a
  rubric, not against the template text.
- `templates/` carries six control templates (`CLAUDE.md` has none; it is
  generated as exactly `@AGENTS.md`, `workbench-layout.mjs:311`), the
  `GENESIS.md` and `ADOPTION.md` protocols, `.claude/`, `SPEC.md`,
  `WORKBENCH_FEEDBACK.md`, `feedback/REPORT_FORMAT.md`, and `wiki/`; each
  room's manifest records the release it was generated or adopted from, so
  the template generation to compare against is a declared fact.
- `skills/update-harness/SKILL.md` section 5 lists "diff review for lost
  project-specific rules or accidental product changes" as a manual step with
  no tool behind it.

Gap: the report and its place in the protocols.

## Desired Behavior

1. `node tools/control-fidelity.mjs report --project PATH [--control NAME]`
   runs from the release checkout and compares each of the room's six
   templated root controls, `.claude/settings.json` when present, and the wiki
   contract files against the corresponding template; `CLAUDE.md` is checked
   for exact equality with `@AGENTS.md`. Every template line is classified:
   `filled` (the template line carried a placeholder and the room's line
   differs), `unchanged`, `dropped` (a non-placeholder template line absent
   from the room), or `changed` (a non-placeholder line the room altered,
   matched by nearest similarity); room lines with no template origin are
   `added`. Output is JSON plus a Markdown summary per control.
2. The report states the checkout's version and the room's manifest release;
   when they differ it says the comparison is against a newer or older
   template generation rather than pretending fidelity is exact.
3. It reports and never enforces: exit code is nonzero only on invocation
   errors, not on divergence.
4. `templates/ADOPTION.md` Phase 4 and `skills/update-harness/SKILL.md`
   section 5 run the report and require each `dropped` or `changed` line in
   `AGENTS.md` to be either restored or recorded as a decision in the owning
   spec or an ADR.

## Decisions And Contracts

- **Report, not gate.** Divergence is legitimate; silence is the defect. A
  blocking check would make every room's deliberate scope wording a failure.
- **Placeholder fills are expected.** A line the template marked with a
  placeholder is compared for presence, not content.
- **The template generation is the manifest's release.** When the checkout
  differs from it, the report labels the mismatch instead of guessing which
  lines changed upstream.
- **Zero dependencies.** Line classification uses a simple normalized
  similarity, not an external diff library, consistent with the rest of
  `tools/`.

## Non-Goals

- Rewriting a room's controls or merging template updates into them.
- Scoring fidelity or feeding it into the guardrail audit.
- Comparing specs, ADRs, or wiki notes beyond the seeded contract files.

## Dependencies And Blockers

- none

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | `control-fidelity.mjs report` with line classification, version labeling, JSON and Markdown output, and a fixture that drops one qualifier | done | none | node tools/test-control-fidelity.mjs (10 cases: filled-only room, dropped canonicalized_in qualifier is one changed entry and zero dropped, deleted Branch Completion section is dropped per line, added lines, missing control, CLAUDE.md exact/mismatch, optional permission and wiki files, CRLF, newer/older/same version labels, CLI exit 0 on divergence and 1 on invocation errors with an unchanged room snapshot); node tools/test-skill-catalog.mjs; node tools/test-portability-matrix.mjs; node tools/test-evaluate-workbench.mjs; self-report against this checkout exits 0 |
| TK-002 | Adoption Phase 4 and update-harness section 5 run the report and route divergences to a recorded decision | done | TK-001 | node tools/test-control-fidelity.mjs (11 cases; the new protocol case checks Adoption Phase 4, update-harness section 5, the Runbook command, and both verification lists); node tools/test-skill-catalog.mjs; node tools/test-portability-matrix.mjs; node tools/test-guardrail-audit.mjs; node tools/test-workbench-adoption.mjs; node tools/evaluate-workbench.mjs --path templates --include-controls |

### TK-001 - The dropped qualifier is visible

**Stance:** Builder

Red first: a fixture room filled from `templates/AGENTS.md` whose ADR ownership
row omits the `canonicalized_in` qualifier must produce one `changed` entry
naming that line and zero `dropped` entries; a second fixture that deletes the
Branch Completion paragraph produces `dropped` entries for each of its lines;
placeholder fills produce `filled` and nothing else. `tools/test-control-
fidelity.mjs` carries the cases.

### TK-002 - The protocols ask

**Stance:** Builder

One command block and one sentence each in `templates/ADOPTION.md` and
`skills/update-harness/SKILL.md`; the Runbook documents the command.

## Acceptance Criteria

- [x] The report classifies every template line as filled, unchanged, dropped, or changed and every extra room line as added, for the seven controls and the optional permission and wiki files.
- [x] The report labels a checkout-versus-manifest version mismatch.
- [x] Divergence never changes the exit code; the tool never writes to the room.
- [x] ADOPTION.md and update-harness require restoring or recording each `AGENTS.md` divergence.
- [x] The full required suite, render, and doctor pass.

## Testing Seams

- `reportFidelity({ project, templates, manifestRelease, checkoutVersion })`
  with in-memory or disposable fixtures.
- CLI JSON output against a disposable room.

## Verification Procedure

```bash
node tools/test-control-fidelity.mjs
node tools/test-skill-catalog.mjs
```

Then the full `AGENTS.md` verification suite (with the new test added to the
list), `render`, `doctor`, and `git diff --check`.

## Documentation Impact

- `AGENTS.md` and `RUNBOOK.md` (root): add the test and the report command to
  the verification lists.
- `templates/ADOPTION.md`, `skills/update-harness/SKILL.md`.
- `LEXICON.md`: `Control fidelity` term once TK-001 lands.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-05 | spec | Spec captured from upstream fix-list item UP-008 (rank medium) | `template-placeholders.mjs` re-read: placeholder detection only; no template-versus-room comparison exists in `tools/` or `workbench/tools/` | Blueprint v3.1.2 direction links this spec | Both slices |
| 2026-09-05 | TK-001 | Ticket closed | node tools/test-control-fidelity.mjs (10 cases: filled-only room, dropped canonicalized_in qualifier is one changed entry and zero dropped, deleted Branch Completion section is dropped per line, added lines, missing control, CLAUDE.md exact/mismatch, optional permission and wiki files, CRLF, newer/older/same version labels, CLI exit 0 on divergence and 1 on invocation errors with an unchanged room snapshot); node tools/test-skill-catalog.mjs; node tools/test-portability-matrix.mjs; node tools/test-evaluate-workbench.mjs; self-report against this checkout exits 0 | AGENTS.md and RUNBOOK.md full verification lists gained node tools/test-control-fidelity.mjs; LEXICON.md Core Terms gained Control fidelity; templates/AGENTS.md carries no ADR ownership row at this release, so the fixture template adds the root control's row before the room is filled from it | TK-002: ADOPTION.md Phase 4, update-harness section 5, and the Runbook command section |
| 2026-09-05 | TK-002 | Ticket closed | node tools/test-control-fidelity.mjs (11 cases; the new protocol case checks Adoption Phase 4, update-harness section 5, the Runbook command, and both verification lists); node tools/test-skill-catalog.mjs; node tools/test-portability-matrix.mjs; node tools/test-guardrail-audit.mjs; node tools/test-workbench-adoption.mjs; node tools/evaluate-workbench.mjs --path templates --include-controls | templates/ADOPTION.md Phase 4 and skills/update-harness/SKILL.md section 5 run the report and require each dropped or changed AGENTS.md line to be restored or recorded in the owning spec or an ADR; RUNBOOK.md gained the Control fidelity report section | none; spec completion pending the full suite |
| 2026-09-05 | review | Integration review of d23cd4d approved with follow-ups applied: manifest wiki lane validated with `isSafeRelative` (unsafe lane noted, default lane used, nothing outside the room read); Markdown headline counts non-trivial lines with the trivial remainder named; a flag is never an option value; EPIPE on stdout exits quietly | `node tools/test-control-fidelity.mjs` (14 cases, three new, red then green); `test-skill-catalog`; `test-governance-core`; `test-workbench-dogfood`; piped Markdown self-report prints no trace; `doctor`; `render`; `git diff --check` | Remaining Limitations gained the missing template ADR row note; Completion Result gained the review follow-up | none |
| 2026-09-05 | spec | Spec completed | Acceptance gates satisfied | Documentation impact recorded above | none |

## Completion Result

**What changed.** `tools/control-fidelity.mjs` (new) exports
`reportFidelity({ project, templates, manifestRelease, checkoutVersion })`,
`classifyLines`, `fidelityTargets`, and `summarizeMarkdown`, and exposes
`report --project PATH [--control NAME] [--templates PATH] [--format json|markdown]`.
It compares the six templated root controls, `CLAUDE.md` (exact equality with
`@AGENTS.md`), `.claude/settings.json` when present, and the seeded wiki
contract files plus `MEMORY.md` under the manifest-declared wiki lane against
the checkout's `templates/`. Anchors come from a maximum-weight common
subsequence over exact lines and placeholder lines found by their fixed text;
the unanchored remainder is matched by nearest word-overlap (Dice >= 0.5) into
`changed` (or `filled` for placeholder lines), placeholder lines are then
matched by shape, and leftovers are `dropped` or `added`. The report carries
the checkout version, the room's manifest release, its adopted source
release, and a note naming a newer, older, same, or unknown template
generation. `tools/test-control-fidelity.mjs` (new, 11 cases) covers the
fixtures the ticket names plus CLAUDE.md, optional files, CRLF, version
labels, the CLI contract, and the protocol wording. `templates/ADOPTION.md`
Phase 4 and `skills/update-harness/SKILL.md` section 5 run the report and
require each `dropped` or `changed` `AGENTS.md` line to be restored or
recorded as a decision in the owning spec or an ADR; `RUNBOOK.md` documents
the command and both verification lists carry the test; `LEXICON.md` defines
`Control fidelity`.

**Why.** Fix-list item UP-008: a 392-line hand reconciliation silently dropped
a qualifier and nothing compared the result with its template.

**Ambiguity resolved.** `templates/AGENTS.md` carries no ADR ownership row at
this release (the qualifier lives in the root `AGENTS.md` and the template
Lexicon), so the fixture template adds the root control's ADR row to the
template ownership table before the room is filled from it; the Branch
Completion and placeholder cases run on the unmodified template text. The
manifest release is `workbenchVersion`; `provenance.source.release` is
reported beside it as the adopted source. `MEMORY.md` is compared against the
profile's template (`MEMORY.project.md` or `MEMORY.root.md`) as a seeded wiki
file.

**Risks and side effects.** None to existing behavior: the tool is new,
read-only, and zero-dependency; the doc edits are additive. Line matching is
heuristic: a heavily rewritten paragraph may pair as `changed` with a
neighbor below the threshold or split into `dropped` plus `added`, and a
placeholder line is judged by presence only, so a qualifier dropped from a
placeholder line is not reported. The report against this dogfood checkout
shows large deliberate divergence, which is expected and not gated.

**How verified.** `node tools/test-control-fidelity.mjs` red (module missing,
then the protocol case failing on Phase 4) and green; the full `AGENTS.md`
suite including the new test, `python3 evals/tasks/task_b_path_safety/test_grade.py`,
`node tools/evaluate-workbench.mjs --path templates --include-controls`,
`render`, `doctor`, and `git diff --check`; a self-report against this
checkout exits 0 in JSON and Markdown.

**Review follow-up.** The integration review of `d23cd4d` found that an unsafe
manifest wiki lane (for example `../outside`) was joined verbatim, that the
Markdown headline counted trivial lines the list omitted, that a flag could be
taken as an option value, and that a closed stdout pipe printed a stack trace.
All four are fixed in the follow-up commit with three new test cases; the
wiki lane now passes `isSafeRelative` or the report names it in
`manifestNote` and uses the default lane.

## Remaining Limitations Or Follow-Up Specs

- The report compares against the checkout's templates; comparing against an
  arbitrary older release requires checking that release out.
- The version stamp belongs to
  [S-035](../S-035-workbench-v3-1-2-candidate/SPEC.md).
- `templates/AGENTS.md` at this release carries no ADR ownership row, so the
  exact UP-008 line (the dropped `canonicalized_in` qualifier) is reported as
  `added`, not `changed`, until a follow-up adds that row to the template;
  S-035's disposition will carry the same note.

## Supersession

- Supersedes: none
- Superseded by: none
