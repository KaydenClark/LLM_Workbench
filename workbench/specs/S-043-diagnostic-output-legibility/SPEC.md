# S-043 - Diagnostic Output Legibility

**Spec ID:** S-043
**Status:** active
**Priority:** 3
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-06
**Catalog description:** Stop a healthy room from reading as failed by separating what a doctor finding blocks from how loudly it is printed, without changing any blocking semantics.
**Blockers:** none
**Latest event:** Spec captured from upstream item UP-019; the report's proposed remedy was found already implemented, and the spec is rescoped to the part that is still live.
**Next gate:** Claim TK-001 and pin the current output shape red.

## Outcome

An operator scanning `doctor` output can tell at a glance which findings stop
work and which are informational, without reading every line. A room in a valid,
current state does not present as failed. Blocking semantics are unchanged: the
same findings block the same commands.

## Why It Matters

Eight registered codes are `error` severity with effect `none`: `invalid-adr`,
`untracked-provenance`, `invalid-note`, `copied-task-state`,
`secret-like-content`, `integration-branch-undeclared`,
`integration-branch-missing`, and `permission-scope-drift`. `doctor` prints them
all at error severity above a final line that says nothing is blocking.

GPT_OS recorded 28 such lines in a current, valid installation and made the
operator-facing point directly: it obscures actionable diagnostics and makes a
clean setup look failed. S-037 makes the same argument from the other side - a
`doctor` that exits 0 while telling the operator that the entire decision record
is malformed trains that operator to ignore error-severity output. The cost is
not the individual finding; it is that error severity stops carrying
information.

## Current Verified State

Verified in this repository on 2026-09-06. The findings were established at
`b3633e5`; the `file:line` citations were re-anchored to the post-S-036 tree
after PR #63 merged, so following one lands on what it names.

- `workbench/tools/diagnostics.mjs:43-48,53-54,68` register the eight
  `error` / `blocks: none` codes listed above. The upstream report names four of
  them; the set is larger.
- `workbench/tools/spec-workbench.mjs:551` renders each line as
  `${item.code} [${item.severity}, blocks ${item.blocks}]: ${item.message}`.
- `:553` appends `ok - no blocking finding; attention and slice findings above
  stay visible` when nothing blocks selection.
- Findings are printed in production order, with no grouping and no count.

**Correction to the upstream evidence.** UP-019's smallest bounded next action
is "render the registered effect in the line itself". That is already
implemented, and was already implemented in v3.1.1: `git show
fa04e27:workbench/tools/spec-workbench.mjs` carries the identical render at line
479. The room the report reproduced against therefore already printed
`blocks none` on every one of those lines. The finding's premise survives - a
healthy room still reads as failed - but its proposed remedy does not close it,
so this spec is scoped to what remains: the severity word itself, the absence of
grouping, and the absence of a count.

A second correction bears on the same evidence. GPT_OS appears to be a Windows
room - the report does not say so, but it cites `E:/` paths - and
S-037 established that a CRLF checkout produces a large block of untrue
`invalid-adr` and `invalid-note` findings. An unknown share of its 28 lines was
that defect rather than this one. The finding does not depend on that share:
this repository's own `doctor` on an LF checkout still prints 32
`skill-generation-unknown` lines above `ok - no blocking finding`, so the
legibility problem is reproducible without any untrue finding at all.

Gap: severity is the loudest signal in the line and it does not correspond to
consequence; output has no grouping and no summary.

## Desired Behavior

1. `doctor` output separates findings by consequence, so blocking findings are
   visually distinct from informational ones and are not buried among them.
2. The output carries a count per group, so an operator can compare runs without
   reading every line.
3. A `blocks: none` finding is not presented with the same prominence as one
   that stops work. Whether that is a lowered display severity, a separate
   section, or both is a TK-001 decision recorded with its reason.
4. Blocking semantics are unchanged and are covered by a test that would fail if
   any code's effect moved.

## Decisions And Contracts

- **The registry stays the authority.** Presentation changes; no code's
  registered `severity`, `scope`, or `blocks` value changes in this spec. A test
  pins the registry so a presentation change cannot quietly move an effect.
- **Do not remove information.** `blocks none` stays on the line. The change is
  ordering, grouping, and prominence, not omission.
- **Machine output is unaffected.** `--json` consumers see the same structure.

## Non-Goals

- Suppressing findings, or introducing a quiet mode.
- Changing which findings exist, or reducing their number by fixing their
  causes. `skill-generation-unknown` volume is S-031's lane; untrue ADR and wiki
  findings are S-037's.
- Changing the `--json` shape.

## Dependencies And Blockers

- none

## Vertical Implementation Slices

Tickets are temporary tracer bullets within this stable capability record.

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Group and count `doctor` findings by consequence and lower the prominence of `blocks: none` findings, with the registry pinned by test | ready | none | pending |

### TK-001 - Consequence-first output

**Stance:** Builder

Red first, in `tools/test-diagnostics.mjs`: assert the grouped output shape and a
per-group count for a fixture carrying both a blocking and a non-blocking
finding; assert that `--json` is byte-unchanged; and add a registry pin asserting
each code's `severity`/`scope`/`blocks` triple, so a later presentation change
cannot move an effect unnoticed. Then implement the rendering change at
`workbench/tools/spec-workbench.mjs:551-553`.

## Acceptance Criteria

- [ ] `doctor` groups findings by consequence and prints a count per group.
- [ ] A `blocks: none` finding is visually distinct from a blocking one, and
      still shows its code, effect, and message.
- [ ] `--json` output is unchanged.
- [ ] A registry pin test fails if any registered code's severity, scope, or
      effect changes.
- [ ] `node tools/test-diagnostics.mjs` and `node tools/test-spec-workbench.mjs`
      pass, new cases red before green.
- [ ] The full `AGENTS.md` verification suite passes.

## Testing Seams

- `workbench/tools/spec-workbench.mjs` `doctor` CLI rendering
  (`tools/test-diagnostics.mjs`).
- The registered diagnostic table (`workbench/tools/diagnostics.mjs`
  `registeredCodes` / `describe`).

## Verification Procedure

```bash
node tools/test-diagnostics.mjs
node tools/test-spec-workbench.mjs
node workbench/tools/spec-workbench.mjs doctor
```

## Documentation Impact

- `RUNBOOK.md` diagnostics section: the grouped output shape.
- `AGENTS.md` Authority Order names the effects; no change expected, confirm and
  record `Docs checked; no update needed` if so.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-06 | spec | Spec captured from upstream UP-019 and rescoped | Read `diagnostics.mjs:43-68` (eight `error`/`none` codes, not four) and `spec-workbench.mjs:551-553`; `git show fa04e27:workbench/tools/spec-workbench.mjs:479` shows the proposed remedy already shipped in v3.1.1; this repository's `doctor` prints 32 `skill-generation-unknown` lines above `ok - no blocking finding` on an LF checkout | Blueprint catalog regenerated by render | One slice open; presentation form is a TK-001 decision |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Grouping reduces the cost of a large finding list; it does not reduce the
  list. `skill-generation-unknown` volume stays with S-031.

## Supersession

- Supersedes: none
- Superseded by: none
