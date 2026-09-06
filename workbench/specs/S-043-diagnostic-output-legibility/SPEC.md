# S-043 - Diagnostic Output Legibility

**Spec ID:** S-043
**Status:** complete
**Priority:** 3
**Owner:** claude-s043
**Stance:** Builder
**Updated:** 2026-09-06
**Catalog description:** Stop a healthy room from reading as failed by separating what a doctor finding blocks from how loudly it is printed, without changing any blocking semantics.
**Blockers:** none
**Latest event:** Spec completed and removed from the hot board.
**Next gate:** none

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

- `workbench/tools/diagnostics.mjs:44,45,47,48,49,54,55,69` register the eight
  `error` / `blocks: none` codes listed above. The upstream report names four of
  them; the set is larger.
- `git show 09bfff7:workbench/tools/spec-workbench.mjs` line 551 renders each
  line as `${item.code} [${item.severity}, blocks ${item.blocks}]: ${item.message}`,
  and line 553 appends `ok - no blocking finding; attention and slice findings
  above stay visible` when nothing blocks selection. Both are anchored to the
  base commit on purpose: this ticket moves them, so a line number in the
  shipped tree would name the replacement rather than the condition described.
  In the shipped tree the row render is `spec-workbench.mjs:537` and the `ok`
  line `:539`.
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
room, though the report neither says so nor gives it a path - the inference is
from the failure mode alone, and is weaker than for the reporting room, which
the report does name by an `E:/` path - and
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
- **TK-001 decided both halves of Desired Behavior 3: a separate section and a
  lowered display prominence, and no new vocabulary.** The plain report is
  three counted sections in a fixed order - `blocking` (effects `all` and
  `selection`), `selected slice`, then `informational` (effect `none`) - each
  header naming its consequence. Within a row the effect leads and the
  severity follows it (`code [blocks none, error]: message`) rather than
  severity leading. The reason for reordering instead of relabelling: the
  registry is the authority on severity, so inventing a display severity such
  as `notice` for a `blocks: none` error would put a second, softer vocabulary
  next to the registered one and make `--json` and the text report disagree
  about the same finding. Moving the effect to the front of the bracket
  demotes the word `error` without removing it or contradicting the registry.
- **The registry pin is a named set, not an enumeration of the registry.**
  `PINNED_EFFECTS` in `tools/test-diagnostics.mjs` pins the
  severity/scope/effect triple of every code whose effect stops work plus the
  eight `error` / `blocks: none` codes, and asserts as an invariant over the
  whole registry that no code with a blocking effect is `attention` severity.
  The reason for that shape: S-039 and S-042 are registering new codes in
  parallel, and an exact whole-registry snapshot would fail the moment either
  lands, which trains the next agent to edit the pin rather than read it. A
  named set catches the risk this spec is about - an effect that moves under a
  presentation change - and tolerates an addition. Its accepted limit: a newly
  registered blocking code is not pinned until someone adds it.

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
| TK-001 | Group and count `doctor` findings by consequence and lower the prominence of `blocks: none` findings, with the registry pinned by test | done | none | node tools/test-diagnostics.mjs: 13/13 pass. Red first at the named seam: the import of formatDoctorReport failed with "SyntaxError: The requested module does not provide an export named formatDoctorReport"; with the seam extracted at the current ungrouped shape the grouping case failed strictEqual with actual "skill-generation-unknown [attention, blocks none]: ... duplicate-id [error, blocks selection]: ..." against the expected grouped report, and the CLI case failed with "unexpected line in a failing doctor report: blocked-slice [error, blocks selected-slice]: S-001/TK-001 waits on S-999". Both green after the grouping change, with the other 11 cases unchanged. cmp of doctor --json before and after on this repository: byte-identical (9729 bytes). |

### TK-001 - Consequence-first output

**Stance:** Builder

Red first, in `tools/test-diagnostics.mjs`: assert the grouped output shape and a
per-group count for a fixture carrying both a blocking and a non-blocking
finding; assert that `--json` is byte-unchanged; and add a registry pin asserting
each code's `severity`/`scope`/`blocks` triple, so a later presentation change
cannot move an effect unnoticed. Then implement the rendering change at
`git show 09bfff7:workbench/tools/spec-workbench.mjs` lines 551-553, which the
shipped tree carries as `spec-workbench.mjs:522-539`.

## Acceptance Criteria

- [x] `doctor` groups findings by consequence and prints a count per group.
- [x] A `blocks: none` finding is visually distinct from a blocking one, and
      still shows its code, effect, and message.
- [x] `--json` output is unchanged.
- [x] A registry pin test fails if any currently registered code's severity,
      scope, or effect changes. All 44 registered codes are pinned by triple.
      A code registered later by another spec is not in the set and passes,
      which is deliberate; that tolerance is recorded in Remaining Limitations.
- [x] `node tools/test-diagnostics.mjs` and `node tools/test-spec-workbench.mjs`
      pass, new cases red before green.
- [x] The full `AGENTS.md` verification suite passes.

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
| 2026-09-06 | spec | Fresh separate-context review found the diagnostics anchor never re-anchored past S-036 | S-036 inserted `invalid-source-identity` at `diagnostics.mjs:27`, shifting every code below it by one. The eight `error`/`blocks: none` codes were still cited as `:43-48,53-54,68`, where `:43` is `stale-register` (`attention`, not one of the eight), `:53` and `:68` are comments, and two of the eight fall outside the ranges. Now cited individually as `:44,45,47,48,49,54,55,69`. The GPT_OS Windows inference is restated: the report gives that room no path at all | No control text changed | One slice open |
| 2026-09-06 | TK-001 | Ticket closed | node tools/test-diagnostics.mjs: 13/13 pass. Red first at the named seam: the import of formatDoctorReport failed with "SyntaxError: The requested module does not provide an export named formatDoctorReport"; with the seam extracted at the current ungrouped shape the grouping case failed strictEqual with actual "skill-generation-unknown [attention, blocks none]: ... duplicate-id [error, blocks selection]: ..." against the expected grouped report, and the CLI case failed with "unexpected line in a failing doctor report: blocked-slice [error, blocks selected-slice]: S-001/TK-001 waits on S-999". Both green after the grouping change, with the other 11 cases unchanged. cmp of doctor --json before and after on this repository: byte-identical (9729 bytes). | RUNBOOK.md diagnostics section documents the grouped shape; the effect table rows were not touched or reordered. AGENTS.md Authority Order: Docs checked; no update needed - it names the effects (doctor fails on all and selection, next excludes blocked work, claim refuses a slice blocker, attention stays visible) and no effect changed. | Grouping does not reduce the finding count; skill-generation-unknown volume stays with S-031. A blocking code registered after this spec is not in the named pin until added. |
| 2026-09-06 | spec | Spec completed | Acceptance gates satisfied | Documentation impact recorded above | none |
| 2026-09-06 | TK-001 | Separate-context review returned CHANGES REQUESTED on two record defects and one robustness gap; all three closed | The pin did not meet the criterion checked above it. Reviewer mutation: `stale-claim` promoted from `('attention','specs','none')` to `('error','specs','selection')` left the pin at `pass 1 / fail 0`, because `pinnedBlocking` is a subset check that never notices a code ARRIVING in a blocking effect and the severity invariant passed when severity moved to `error` in the same edit. Reproduced here before fixing. All nine attention codes are now pinned by triple, so all 44 registered codes are covered; the same mutation now fails with `AssertionError: stale-claim effect moved`, and the unmutated suite is 14/14. Added a test binding `EFFECTS` to `DOCTOR_GROUPS`: `formatDoctorReport` throws on an effect matching no group, that throw reaches `main().catch` and prints NO findings including real blocking ones, so extending `EFFECTS` without a group is a total `doctor` outage that nothing else in the suite caught - the throw's only other cover passes a hand-made object rather than the vocabulary. `DOCTOR_GROUPS` is exported to make that seam real | Three live citations named lines this ticket itself moved - `:551`, `:553`, `:551-553` now land on argument parsing and a `toCamel` helper. Anchored to `git show 09bfff7:` for the pre-change condition, with the shipped-tree lines given alongside | The pin still tolerates a code registered later by another spec; recorded in Remaining Limitations rather than closed |


## Completion Result

`doctor`'s plain report is grouped by registered effect, counted per group, and
ordered blocking first. On this repository the run that previously printed 33
undifferentiated lines above `ok - no blocking finding` now opens with
`selected slice (1)` - the one finding that actually constrains work - and
files the other 32 under `informational (32) - reported only; nothing is
blocked`. No registered severity, scope, or effect changed; `doctor --json` is
byte-identical to its pre-change output on this repository.

## Remaining Limitations Or Follow-Up Specs

- Grouping reduces the cost of a large finding list; it does not reduce the
  list. `skill-generation-unknown` volume stays with S-031.
- The registry pin is a named set, so a blocking code registered after this
  spec is not pinned until it is added to `PINNED_EFFECTS`. The whole-registry
  invariant still holds it to `error` severity.
- Grouping is fixed; there is no ordering or verbosity option, and none was
  asked for.

## Supersession

- Supersedes: none
- Superseded by: none
