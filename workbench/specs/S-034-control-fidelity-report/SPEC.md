# S-034 - Control Fidelity Report

**Spec ID:** S-034
**Status:** active
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-05
**Catalog description:** Report which template-derived lines a room's hand-reconciled controls changed, dropped, or added, so a deliberate divergence can be recorded and an accidental one is caught.
**Blockers:** none
**Latest event:** Spec captured from upstream fix-list item UP-008.
**Next gate:** Claim TK-001 and prove a dropped qualifier is reported.

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
- `templates/` carries the seven controls, `.claude/`, `SPEC.md`,
  `WORKBENCH_FEEDBACK.md`, `feedback/REPORT_FORMAT.md`, and `wiki/`; each
  room's manifest records the release it was generated or adopted from, so
  the template generation to compare against is a declared fact.
- `skills/update-harness/SKILL.md` section 5 lists "diff review for lost
  project-specific rules or accidental product changes" as a manual step with
  no tool behind it.

Gap: the report and its place in the protocols.

## Desired Behavior

1. `node tools/control-fidelity.mjs report --project PATH [--control NAME]`
   runs from the release checkout and compares each of the room's seven root
   controls, `.claude/settings.json` when present, and the wiki contract files
   against the corresponding template. Every template line is classified:
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
| TK-001 | `control-fidelity.mjs report` with line classification, version labeling, JSON and Markdown output, and a fixture that drops one qualifier | ready | none | pending |
| TK-002 | Adoption Phase 4 and update-harness section 5 run the report and route divergences to a recorded decision | ready | TK-001 | pending |

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

- [ ] The report classifies every template line as filled, unchanged, dropped, or changed and every extra room line as added, for the seven controls and the optional permission and wiki files.
- [ ] The report labels a checkout-versus-manifest version mismatch.
- [ ] Divergence never changes the exit code; the tool never writes to the room.
- [ ] ADOPTION.md and update-harness require restoring or recording each `AGENTS.md` divergence.
- [ ] The full required suite, render, and doctor pass.

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

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- The report compares against the checkout's templates; comparing against an
  arbitrary older release requires checking that release out.
- The version stamp belongs to
  [S-035](../S-035-workbench-v3-1-2-candidate/SPEC.md).

## Supersession

- Supersedes: none
- Superseded by: none
