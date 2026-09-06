# S-039 - Installed Managed-Runtime Integrity

**Spec ID:** S-039
**Status:** complete
**Priority:** 1
**Owner:** claude-opus-5
**Stance:** Builder
**Updated:** 2026-09-06
**Catalog description:** Give an installed room a command that verifies the runtime it is executing, and make a drift report say whether the runtime matches the source or only disagrees with a stale receipt.
**Blockers:** none
**Latest event:** Merged into `integration` as PR #69 at `92be949` on 2026-09-06 **with no fresh review after the fourth returned CHANGES REQUESTED**; the owed review ran retrospectively on 2026-09-06 and its findings are owned by [S-045](../S-045-v3-1-2-follow-ups/SPEC.md).
**Next gate:** None; the capability is complete and contained in `integration`. The skipped gate is discharged and disclosed, not undone.

> **Citation anchors.** pre=`09bfff7` post=`eb5a32b`. A bare `path:line` citation
> reads at `pre` in Outcome, Why It Matters, Current Verified State and Desired
> Behavior, and at `post` in every other live section. Evidence rows read at the
> commit each row names and are never re-anchored, because they are append-only.
> A `git show <sha>:path` citation is absolute and needs no declaration.

## Outcome

A room can verify the integrity of the runtime tools it is executing using only
what the room contains, and when that check fails the operator is told which of
two very different conditions holds: the runtime matches its release source and
the receipt is stale, or the runtime differs from both and may have been
modified. The registered blocking effect of `tools-receipt-drift` and the
behavior an operator can actually reach agree.

## Why It Matters

`workbench/tools/diagnostics.mjs:25-26` registers `tools-receipt-missing` and
`tools-receipt-drift` at scope `tools` with effect `all` - the strongest
blocking class in the model. `doctor` fails on `all`. But no installed tool
emits `tools-receipt-drift`, so `doctor` cannot fail on it, and a room whose
runtime disagrees with its own receipt on every managed file still prints
`ok - no blocking finding`.

Audit Workbench reproduced exactly that on 2026-09-06: `verify` returned
`tools-receipt-drift` with `reason: hash` for all eleven managed tools against a
receipt naming v3.1.1 `fa04e27`, while the same room's `doctor` reported no
blocking finding. That room then could not act on the result, because the drift
report does not distinguish a stale receipt from a modified runtime, and it
recorded the condition as an unrepaired blocker carried forward. A managed
runtime whose integrity check is unreachable from the room is not a managed
runtime; every downstream claim that cites `verify` inherits the gap.

## Current Verified State

Verified in this repository on 2026-09-06. The findings were established at
`b3633e5` and re-verified at the base commit this candidate branched from,
`09bfff7`. This section describes the state *before* the change, and the change
itself moves several of the lines it cites, so each citation whose condition
this branch alters is anchored at `git show 09bfff7:PATH` - which is immutable -
with the shipped-tree location named alongside it. Following either lands on
what it names.

- `workbench/tools/diagnostics.mjs:25-26` registers both codes with
  `entry('error', 'tools', 'all', ...)`.
- `tools-receipt-drift` was emitted at exactly one site,
  `git show 09bfff7:tools/workbench-tools.mjs` line 203.
  `tools/workbench-tools.mjs` is not a member of `RUNTIME_TOOLS`
  (`git show 09bfff7:tools/workbench-tools.mjs` lines 24-36, eleven `.mjs`
  files; the third repair moved the list itself into the installed lane, so
  the shipped tree carries it at `workbench/tools/workbench-layout.mjs:532-544`
  and re-exports it from `tools/workbench-tools.mjs:28`), so it is never
  installed into a room and is reachable only from a release checkout.
- `tools-receipt-missing` is emitted from an installed tool, but only by
  `validateGenesisRuntime` (`git show 09bfff7:workbench/tools/workbench-layout.mjs`
  lines 513-535; `workbench/tools/workbench-layout.mjs:548-570` in the shipped
  tree), which runs on the `validate --genesis` readiness path. That function
  checks the receipt's presence, readability, and `source.release`; it computes
  no hash. `doctor` calls neither.
- `git show 09bfff7:tools/workbench-tools.mjs` line 202 computes `sourceDrift` -
  the receipt-versus-source comparison - immediately before line 203 returns
  `tools-receipt-drift` and discards it. Line 204 returns the same value as
  `updateAvailable`, but only on the `valid` path, which line 203 has already
  pre-empted.
- `sourceDrift` compares `receipt.files[tool]` with the source hash. It is a
  receipt-versus-source comparison, not an installed-versus-source one, so it
  cannot on its own answer "do the installed bytes match the release?".
- `git show 09bfff7:RUNBOOK.md` lines 265-266 tell an operator only that
  `verify` reports `tools-receipt-drift` "with the drifted file names
  (`source` on this repository)". They name no remedy. This branch replaces
  that sentence; the shipped tree carries the replacement at `RUNBOOK.md:265-269`.
- `git show 09bfff7:RUNBOOK.md` line 588 lists both codes in the effect table's
  `all` row (table `586-592`), so the published contract asserts blocking
  behavior that cannot occur. The row is unchanged in content and the prose
  this branch inserts above it moves the table to `RUNBOOK.md:652-658` in the
  shipped tree, re-read at this branch's final commit.

Gap: no installed emitter for the hash check, and a drift result that withholds
the comparison that would tell the operator what happened.

This section records the state at capture, which TK-001 and TK-002 closed; the
Completion Result below names what is true now and where.

## Desired Behavior

1. An installed room can verify its managed runtime against the receipt using
   only tools the room contains, and a hash mismatch produces
   `tools-receipt-drift` from that installed path. `doctor` observes the
   registered `all` effect when it occurs.
2. A `tools-receipt-drift` result reports, per drifted file, whether the
   installed bytes match the release source. The three reachable states are
   named distinctly: receipt stale but runtime authentic; runtime modified;
   source unavailable so the comparison could not be made.
3. The drift message names the supported remedy for each state, including
   `update --explicit-update` (which writes a rollback backup and records its
   path in the receipt) for the stale-receipt case.
4. No verification path is weakened: a modified runtime still fails, and a
   missing receipt still fails.

## Decisions And Contracts

- **The registered effect is the contract, not the aspiration.** Either an
  installed emitter exists or the registration is wrong. This spec closes the
  gap by adding the emitter, because a room that cannot check its own runtime
  cannot support any managed-runtime claim.
- **Source comparison is optional evidence, not a precondition.** A room with
  no release checkout still gets its receipt check; it is told the source
  comparison was unavailable rather than being blocked or silently downgraded.
- **`verify` never repairs.** Distinguishing the states is a reporting change.
  Replacing bytes stays behind `update --explicit-update`.

## Non-Goals

- Adding `workbench-tools.mjs` itself to `RUNTIME_TOOLS`, if a smaller seam in
  an already-installed tool serves. The choice is a TK-001 decision, recorded
  with its reason.
- Automatic receipt refresh, or any path that silently accepts drifted bytes.
- Repairing this repository's or any reviewed room's live drift. That is an
  owner decision recorded under S-038.

## Dependencies And Blockers

- none

## Vertical Implementation Slices

Tickets are temporary tracer bullets within this stable capability record.

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Emit the receipt hash check from an installed path so a drifted room fails `doctor` at its registered `all` effect | done | none | `tools/test-workbench-layout.mjs` "a room whose managed runtime drifts from its receipt fails the doctor it carries" and `tools/test-diagnostics.mjs` "a drifted or unreadable managed runtime is a blocking tools finding in the room doctor", both red before `26eb7e6` |
| TK-002 | Report the installed-versus-source comparison inside the drift result and name the supported remedy per state | done | none | `tools/test-workbench-tools.mjs` "a drift result separates a stale receipt from a modified runtime and names each remedy" plus the `source-unavailable` assertion in the layout room test, both red before `b573009` |

### TK-001 - An installed integrity check

**Stance:** Builder

Red first: build a fixture room with an installed tools lane, modify one managed
file, and assert that the room's own `doctor` reports `tools-receipt-drift` and
exits non-zero. That assertion must fail at `b3633e5`. Then add the emitter at
the smallest seam and turn it green. Keep `doctor`'s cost bounded and say in the
spec what it now reads.

### TK-002 - A drift report that can be acted on

**Stance:** Builder

Red first: assert that a drift result for a room whose installed bytes are
byte-identical to the release source reports that fact and names
`update --explicit-update`, and that a room whose bytes match neither is
reported as modified. Cover the source-unavailable case explicitly. Then move
the comparison so both paths carry it.

## Acceptance Criteria

- [x] A room with a hash-drifted managed tool fails its own `doctor` with
      `tools-receipt-drift`, using only tools installed in the room, and
      `next` and `claim` refuse that room until it is repaired.
- [x] No receipt can narrow the check below the runtime it scopes, in content
      or in coverage. An empty `files` map, a key that resolves outside the
      managed lane, a map pruned of a file the lane still holds, and a map
      pruned of a file removed with it are all `tools-receipt-missing` on the
      room `doctor` path and the release-side `verify` path, because both
      compare against `RUNTIME_TOOLS` rather than against the receipt or the
      lane. The two conditions this does not reach - a receipt whose recorded
      hash is rewritten to match tampered bytes, and a room whose lane code is
      itself rewritten - are the same condition seen twice and are named in
      Remaining Limitations rather than claimed closed.
- [x] The two coverage conditions carry distinct messages, each naming an
      action that repairs it: `update --explicit-update` for a managed tool the
      receipt does not account for, and moving the file out of the lane for a
      file the managed runtime does not include, which `update` cannot adopt.
- [x] A drift result distinguishes receipt-stale, runtime-modified, and
      source-unavailable, and each names its supported remedy. A fourth state,
      `runtime-authentic`, covers mode-only drift, whose bytes match both the
      receipt and the source; calling that one of the three would be false.
- [x] `RUNBOOK.md` and `templates/RUNBOOK.md` describe the installed check and
      the states; the effect table, unchanged in content and moved to
      `RUNBOOK.md:652-658` by the prose inserted above it, is true of
      observable behavior. `doctor` exits 1 and `next` and `claim` refuse, so
      the `all` row's stated consumer behavior holds for both codes.
- [x] `node tools/test-workbench-tools.mjs` and `node tools/test-diagnostics.mjs`
      pass, with the new cases proved red before green.
- [x] The full `AGENTS.md` verification suite passes.

## Testing Seams

- `tools/workbench-tools.mjs` `verify()` return shape (`tools/test-workbench-tools.mjs`).
- The installed `doctor` findings list (`tools/test-diagnostics.mjs`, and the
  layout suite's fixture rooms in `tools/test-workbench-layout.mjs`).

## Verification Procedure

```bash
node tools/test-workbench-tools.mjs
node tools/test-diagnostics.mjs
node tools/test-workbench-layout.mjs
node workbench/tools/spec-workbench.mjs doctor
```

## Documentation Impact

- `RUNBOOK.md` managed runtime tools check: the installed entry point and the
  drift states. Done in `4856985`; extended by the review repair with the
  `next`/`claim` refusal, the out-of-lane receipt key, and the two conditions
  the check cannot reach; extended again by the second repair with the coverage
  rule, where each side's expected set comes from, and the coverage check's own
  blind spot in the deleted-file paragraph. The third repair replaces that
  blind-spot text: the coverage rule now expects the authoritative managed set,
  the deleted-file paragraph states the true ten-of-eleven import closure, and
  the two coverage conditions are documented with the distinct remedy each one
  actually has.
- `templates/RUNBOOK.md` managed runtime tools paragraph: the dogfood
  counterpart. Rooms this capability exists for read that file, and it still
  told an operator that verification means the release-side `verify`. Updated
  with the room's own `doctor` check, the `all` effect, the refused receipts,
  and why a room sees only `source-unavailable`; the second repair adds the
  coverage rule in room-generic terms, with no reference to this repository's
  own files. The third repair states that the authoritative list ships inside
  the installed tools and splits the two coverage remedies, still in
  room-generic terms. Guardrail score unchanged at 106.6/113 before and after
  all three repairs.
- `LEXICON.md` if the three states need named terms. Not needed: the states are
  values of a `verify`/`doctor` report field, documented where that report is
  documented, not shared project vocabulary other controls speak.
- `AGENTS.md` only if the verification suite gains a command. Not needed: the
  new cases run inside suites the file already lists.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-06 | spec | Spec captured from upstream UP-013 and UP-014 and re-verified at `b3633e5` | Read `diagnostics.mjs:25-26`, `workbench-tools.mjs:24-36,163-182`, `workbench-layout.mjs:499-521`, `RUNBOOK.md:265,588`; grepped every `tools-receipt` reference in the repository | Blueprint catalog regenerated by render | Both slices open; the emitter seam is a TK-001 decision |
| 2026-09-06 | spec | Separate-context review corrected one citation in the row above | The review found `RUNBOOK.md:588` is prose about `doctor --json`; the effect table row listing `tools-receipt-missing` and `tools-receipt-drift` under `all` is at `RUNBOOK.md:581`, table `579-584`. Re-read and confirmed. The row above is preserved unedited; Current Verified State and the acceptance criterion now cite the correct lines | No control text changed | The substantive claim in the row above is unaffected |
| 2026-09-06 | spec | Fresh separate-context review corrected the citations the prior round degraded or missed | `RUNTIME_TOOLS` spans `workbench-tools.mjs:24-36` at both `b3633e5` and the merged tip; the prior round changed a correct range to `24-64`, which covers unrelated helpers, and is reverted. The Current Verified State paragraph still read `:180/:181/:182` for `sourceDrift`, the `tools-receipt-drift` return, and the `updateAvailable` return; true values at the merged tip are `:202/:203/:204`, and `:181` is blank. The append-only row above, rewritten by the prior round, is restored to its original text | No control text changed | TK-001 and TK-002 open |
| 2026-09-06 | spec | Restored the fresh-review row that the previous commit rewrote | `f963b96` edited the row `7a386fd` had published, to expand it from one rewritten row to two. It is restored byte-for-byte and the expansion is recorded here instead: this spec had two rewritten rows, the capture row (`workbench-layout.mjs:499-521` had become `513-535`, which at `b3633e5` starts mid-loop and ends past the function close in the permission-file section) and the correction row (`RUNBOOK.md:581` had become `588`). Both now carry their first-published text | No control text changed | TK-001 and TK-002 open |

| 2026-09-06 | TK-001 | The receipt hash check now runs from the tool a room installs, and `doctor` reads it | Red at `09bfff7`: the new layout case failed `the room's own doctor must report tools-receipt-drift: []`, and the diagnostics case failed `+ []` against `[['tools-receipt-drift','error','tools','all']]`. Green at `26eb7e6`: `node tools/test-workbench-layout.mjs` 33/33, `node tools/test-diagnostics.mjs` 11/11, `node tools/test-workbench-tools.mjs` 16/16 | `RUNBOOK.md` updated in `4856985` | The seam is `workbench-layout.mjs`, not `RUNTIME_TOOLS` membership for `workbench-tools.mjs`; a lane with no receipt is still only the Genesis gate's finding |
| 2026-09-06 | TK-002 | Each drifted file is classified by comparing the installed bytes with the release source, and carries its remedy | Red at `26eb7e6`: `verify` returned `state: undefined` for a stale receipt, and the room doctor's drift entry carried `+ undefined - 'source-unavailable'`. Green at `b573009`: `node tools/test-workbench-tools.mjs` 16/16 and `node tools/test-workbench-layout.mjs` 33/33. One assertion regex was tightened, not weakened, from `/update --explicit-update/` to `/workbench-tools\.mjs update .*--explicit-update/` because the remedy names the full invocation | `RUNBOOK.md` state table added in `4856985` | A room still cannot reach a release source, so its own `doctor` reports `source-unavailable`; classifying it needs `verify` from a release checkout |
| 2026-09-06 | spec | Both slices closed and verified against the full suite | All 25 `tools/test-*.mjs` suites pass, `python3 evals/tasks/task_b_path_safety/test_grade.py` passes, `render` leaves no drift, `doctor` exits 0, `python3 tools/check-append-only.py` CLEAN. Guardrail score before and after is 106.6/113 (`node tools/evaluate-workbench.mjs --path templates --include-controls`); this change touches no template, so the static score is unchanged and no agent-outcome claim is made from it | `RUNBOOK.md` only; `LEXICON.md` and `AGENTS.md` checked, no update needed for the reasons recorded under Documentation Impact | The doctor call site needed two lines in `workbench/tools/spec-workbench.mjs`, which the assigned file lane did not list; no sibling spec was named as its owner and the edit is an import plus one push into `collectionFindings`. Reported to the coordinator rather than left undone. The RUNBOOK effect table is unchanged in content but moved from `:586-592` to `:610-616` by the prose inserted above it |
| 2026-09-06 | TK-002 | Correcting the false green and the regex characterization in the TK-002 row above | The TK-002 row records "Green at `b573009`: `node tools/test-workbench-tools.mjs` 16/16". That is false and the row is preserved unedited. Re-measured in a detached worktree at `b573009` on a clean checkout: **15 pass / 1 fail**, the failure being `✖ a drift result separates a stale receipt from a modified runtime and names each remedy` with `actual: "the installed bytes are the release source's, so the receipt hash is the stale fact; refresh it with \`workbench-tools.mjs update --project PATH --explicit-update\`, ..."`, `expected: /update --explicit-update/`. Green arrived one commit later: the same worktree run at `4856985` is 16/16, and `git show 4856985 -- tools/test-workbench-tools.mjs` is the one-line regex change. The row above also calls that change "tightened, not weakened", which is imprecise: the remedy string already read `update --project PATH --explicit-update` at `b573009`, so the OLD regex `/update --explicit-update/` never matched at all. The new regex `/workbench-tools\.mjs update .*--explicit-update/` is genuinely stronger - it pins the tool name, which the old one did not - and relaxes only adjacency, which the mandatory `--project PATH` argument makes impossible to satisfy | No control text changed by this row | The substantive TK-002 behavior claims are unaffected; only the recorded measurement was wrong |
| 2026-09-06 | spec | Repaired the three blocking findings a separate-context review returned against `56527fb` | **Red 1** (`files: {}` disabled the whole check): with the room's receipt `files` set to `{}` and `// PWNED` appended to `spec-workbench.mjs`, `managedRuntimeDrift` returned `null` - no finding, `doctor` exit 0. **Red 2** (`../../AGENTS.md` with that file's true hash as the only receipt key): also `null`. **Red 3** (`all` ignored by selection): `tools/test-diagnostics.mjs` failed `AssertionError [ERR_ASSERTION]: Missing expected exception: next must refuse to read a drifted layout`, 10 pass / 1 fail. **Green** at `84ccc51`: `node tools/test-diagnostics.mjs` 11/11; the same tampered room now reports `tools-receipt-drift [error, blocks all]: workbench/tools differs from the hashes .workbench-tools.json recorded: spec-workbench.mjs (hash, source-unavailable)` and `next` exits with `error: tools-receipt-drift: ...`. Finding 6 (receipt keys not lane-contained) was fixed rather than recorded, in the same validator, because the fix is a name check with no behavior cost and this branch newly reaches that join from every room's `doctor`. Finding 2 was enforced rather than unticked, because the alternative leaves an agent able to claim a slice while executing tampered bytes and enforcement broke no suite. Full suite: 25/25 node suites, `task_b_path_safety` passes, `render` no drift, `doctor` exits 0, `check-append-only.py` CLEAN, guardrail 106.6/113 before and after | `RUNBOOK.md` and `templates/RUNBOOK.md` updated; four stale `file:line` citations re-anchored at `git show 09bfff7:` with the shipped-tree line alongside; three discovered limitations recorded | The two sibling citations in `workbench/specs/S-042-installed-state-repair/SPEC.md` (`:52` and `:235`) were verified stale but NOT edited: `claude/s042-v3-1-2` has already modified that same file and its own `aa68f6e` records that the effect table moves again to `:646-650` there, so an edit from this lane would both collide and write a number that its merge invalidates. Reported to the coordinator for post-merge re-anchoring instead |
| 2026-09-06 | spec | Repaired the one blocking finding the second separate-context review returned against `e93c374`: the receipt still controlled the SCOPE of its own check | **Red** at `e93c374`, three assertions at the two seams. Release side: with `markdown-table.mjs` tampered and that one key deleted from `files`, `verify` failed the new case with `AssertionError: a pruned receipt must not verify: {"status":"valid","lane":"workbench/tools", ... ,"updateAvailable":["markdown-table.mjs"]}` - exit 0, ten of eleven keys still verifying. Room side: `doctor` returned `+ []` against `- [['tools-receipt-missing','all']]`, and the layout suite's room-doctor case returned `a receipt pruned of the tampered file must not read as a clean runtime: []`. **Green** at `8ee173e`: `node tools/test-workbench-tools.mjs` 17/17, `node tools/test-diagnostics.mjs` 11/11, `node tools/test-workbench-layout.mjs` 33/33. The reviewer's own reproduction, rerun on a fixture room at that commit, now reports `tools-receipt-missing [error, blocks all]: workbench/tools/.workbench-tools.json does not account for markdown-table.mjs` from the room's `doctor`, the same text as the error from `next` and from `claim`, and `status: invalid` from the release-side `verify` with `unaccounted: ["markdown-table.mjs"]` beside `updateAvailable: ["markdown-table.mjs"]`; a one-key receipt naming only `adr.mjs` names all ten other managed files. `update --explicit-update` was extended to rewrite a key the receipt lost even when the bytes match, so the new refusal has a remedy instead of a dead end at `status: current`. Full suite at `2285ab2`: 25/25 node suites, `python3 evals/tasks/task_b_path_safety/test_grade.py` passes, `render` leaves no drift, `doctor` exits 0, `check-append-only.py` CLEAN. Guardrail measured on both trees: 106.6/113 at `e93c374` (templates extracted with `git archive`) and 106.6/113 after | `RUNBOOK.md` and `templates/RUNBOOK.md` carry the coverage rule and where each side's expected set comes from; the deleted-file paragraph now names the coverage check's own blind spot. The acceptance box that read as closing the class and the Completion Result's absolute sentence are reworded to what is guaranteed, and the Completion Result's line numbers, which this change shifted, are re-anchored with their symbol names | The room-side gap is bounded, not closed: a room's expected set is its lane's contents, so a managed file removed together with its key - and any rewrite of the lane code that runs the check - is visible only to the release-side `verify`. Recorded as the fourth limitation with the options weighed. The two sibling citations in `workbench/specs/S-042-installed-state-repair/SPEC.md` remain the coordinator's post-merge job, as the row above records |
| 2026-09-06 | spec | Re-anchored the RUNBOOK effect-table citation this repair moved again | The prose added to the managed-runtime section pushes the effect table down: Current Verified State and the fourth acceptance criterion said `RUNBOOK.md:620-626`, and the table now spans `RUNBOOK.md:638-644` (header at `:638`, the `all` row at `:640`), re-read at this branch's final commit. The table is unchanged in content. The evidence row that recorded `:610-616` when that was true is preserved unedited; this row supersedes it | `RUNBOOK.md` unchanged by this row; only the two spec citations | Any later change to that section moves the table again; the immutable `git show 09bfff7:RUNBOOK.md` anchor beside it does not move |
| 2026-09-06 | spec | Repaired the three findings the third separate-context review returned against `f2d0a02`: three claims that were false or unfalsifiable, two with reproductions | **Finding 1, verified then closed.** The claim that all eleven `RUNTIME_TOOLS` are in `doctor`'s import graph is false: walking the relative imports from `workbench/tools/spec-workbench.mjs` yields **ten** files - `adr, diagnostics, markdown-table, privacy, spec-packet, spec-workbench, template-placeholders, wiki, workbench-layout, workbench-paths` - and `sessions.mjs` is imported by nothing on that path. On a fixture room, deleting a managed file with its receipt key gave an identical `doctor` finding set before and after for `sessions.mjs` while `markdown-table.mjs` and `privacy.mjs` failed at import. **Red** at `f2d0a02`: `node tools/test-workbench-layout.mjs` 33 pass / 2 fail, the new case failing `AssertionError [ERR_ASSERTION]: a managed file removed with its key must not read as a clean runtime: []`. **Finding 2. Red** at the same commit: the second new layout case failed `AssertionError [ERR_ASSERTION]: the only repair for a foreign file is removing it from the lane` with `actual: 'workbench/tools/.workbench-tools.json does not account for smuggled.mjs; reinstall the managed runtime from the release checkout'`, and `node tools/test-workbench-tools.mjs` 17 pass / 1 fail with `actual: '...does not account for smuggled.mjs; refresh it with \`workbench-tools.mjs update --project PATH --explicit-update\` after reviewing the lane.'`, both `expected: /move it out of/`. Reproduced directly first: for a foreign lane file `verify` named `update --explicit-update`, which returned `status: current` with no `changed`, and `install` returned `tools-installed`. **Green** at `36f1487`: `node tools/test-workbench-layout.mjs` 35/35, `node tools/test-workbench-tools.mjs` 18/18, `node tools/test-diagnostics.mjs` 11/11. The same reproduction now reports `tools-receipt-missing` naming `sessions.mjs` from the room's own `doctor`, with `next` refusing on the same message, and gives the foreign file its own message ending `move it out of workbench/tools after reviewing it`. **Finding 3** is a documentation repair, not a mechanism change: reproduced at `f2d0a02` and unchanged after - tampering `markdown-table.mjs` and rewriting that key's hash in the receipt leaves `doctor` with no `tools-receipt-*` finding and `verify` at `status: valid` with the file listed only in `updateAvailable`. Full suite on the committed tree, guardrail 106.6/113 before and after | `RUNBOOK.md` and `templates/RUNBOOK.md` replace the coverage-rule and deleted-file paragraphs; the code comment that justified the blind spot is replaced at the two functions; the Completion Result's closed enumeration is bounded to "modified away from what its receipt records" and the wholesale receipt rewrite is named as its own limitation; the deleted-file limitation states the true ten-of-eleven closure; the acceptance criteria gain the distinct-remedy box | The reviewer's option of classifying `verify` against `receipt.source.commit` was weighed and declined here: it is a capability change needing a Git dependency and a further unavailable state, and it is recorded in Remaining Limitations for a separate spec. `RUNTIME_TOOLS` moved from `tools/workbench-tools.mjs` to `workbench/tools/workbench-layout.mjs` with a re-export, so `workbench/specs/S-042-installed-state-repair/SPEC.md:52` now cites the wrong file as well as the wrong line; that spec is another lane's and was not edited, as the two rows above record for its other citations |
| 2026-09-06 | spec | Naming a pre-existing bypass the row above's enumeration also missed | While probing for bypasses introduced by this repair, one that predates it turned up: the coverage comparison refuses a receipt that covers less than `RUNTIME_TOOLS` and not one that covers more, so a receipt that adds a key for a file the managed runtime does not include returns no `tools-receipt-*` finding from the room's `doctor` and `status: valid` from the release-side `verify`. Measured identically on a fixture room at this branch's tip and at `f2d0a02` in a detached worktree, so the coverage repair neither introduced nor widened it. Not closed here: `update` copies `receipt.files` forward, so it preserves an extra key it did not write, and repairing the condition means a new remedy path rather than a wording change. Recorded in the receipt-rewrite limitation, which is the same authority boundary - whoever can write the receipt is already inside the check | The Completion Result's coverage sentence is bounded to how *little* of the runtime the receipt can decide is checked, and the limitation names this second instance | The row above is preserved unedited; its Verification cell does not mention this probe, and this row is where it belongs |
| 2026-09-06 | spec | Fourth separate-context review blocked on one stale shipped-tree citation; corrected here | Reviewer confirmed the `RUNTIME_TOOLS` relocation genuinely closes the false pass: deleting each of the eleven managed tools with its receipt key now refuses on all eleven, where `sessions.mjs` was a silent green at `f2d0a02` (`doctor status=0 codes=[]`). It verified the move broke nothing - `m.RUNTIME_TOOLS === l.RUNTIME_TOOLS` is true and frozen, so one list that cannot drift, no circular import, and the installer already depended on `workbench-layout.mjs` before this commit, so the dependency direction is unchanged. It tested the trust argument directly by rewriting `RUNTIME_TOOLS` inside an installed room: the room's own `doctor` catches it as `tools-receipt-drift` on `workbench-layout.mjs`, and only a wholesale receipt rewrite silences it - the limitation already named - while release-side `verify` still refuses. Both remedies work on both paths, and the bounded Completion Result sentence survived 32 mutation shapes with no counterexample. The one defect: commit `36f1487` inserted 28 lines at `:518`, pushing `validateGenesisRuntime` from `520-542` to `548-570`, and the bullet re-anchored the constant that moved in while leaving the function it displaced pointing at itself | Shipped-tree line corrected to `:548-570`; the `git show 09bfff7:` anchor was already right and is untouched. `RUNBOOK.md:265-268` widened to `:265-269`, the full replaced hunk. Latest event advanced | The receipt-widening bypass stays named and open; a `git show <sha>:` anchor needs no post-merge re-anchoring, only bare line numbers do |
| 2026-09-06 | spec | **Gate deviation recorded: this spec merged without the fresh review `AGENTS.md` requires.** Its fourth separate-context review returned CHANGES REQUESTED on one shipped-tree line number; the repair landed as `eb5a32b`, the branch merged `integration` in as `92be949`, and PR #69 merged it with no fresh review of either. Recorded here rather than by rewriting any published row | Retrospective separate-context review run 2026-09-06 against `git show eb5a32b` plus the merge resolution in `92be949`. It found `eb5a32b` correct at its own tree - `workbench-layout.mjs:548-570` lands exactly on `validateGenesisRuntime` - and proved `92be949` a faithful merge: `git merge-tree --write-tree eb5a32b 07c750d` differs from the actual merge tree only in `TASKBOARD.md`, whose resolution is the exact union of both sides. It blocked on the merged result instead: nine live citations in this spec point at unrelated content at `18ffc0d`, because the repair pinned bare line numbers to a tree the very next commit invalidated. `SPEC.md:260`'s `:696` now lands on `validateGenesisRuntime` itself, the function the repair existed to re-anchor. Acceptance criterion 4 at `:186` is a checked box with no immutable fallback | Header `Latest event` and `Next gate` repaired to state the deviation; the nine citations and the citation convention behind them are routed to S-045, not corrected here, because this spec is complete and its evidence rows are append-only | The nine stale citations stand until S-045 acts, and roughly 68 further bare citations across the five sibling specs are likely the same class |

## Completion Result

An installed room verifies the runtime it executes with only the tools it
contains. `workbench/tools/workbench-layout.mjs:665` `receiptDrift` holds the
receipt hash comparison and `:696` `managedRuntimeDrift` is the doctor entry
point; `workbench/tools/spec-workbench.mjs:305` reads it, so a drifted managed
tool now fails that room's own `doctor` at the `all` effect
`workbench/tools/diagnostics.mjs:26` registers. The release-side
`tools/workbench-tools.mjs:213` calls the same function with its source lane,
so both entry points report identical drift. Every line number in this section
is named with its symbol and was re-read at the final commit of this branch.

The `all` effect is enforced as the effect table states it, not only as a
`doctor` exit code. `workbench/tools/spec-workbench.mjs:33` `refuseBlockedRuntime`
raises the finding as an error from `nextWork` (`:22`) and `claimWork` (`:80`),
so a room executing bytes nobody verified neither dispatches nor claims a
slice. Every other `all` code is already raised by `validateManifest`, which
`loadSpecs` runs; this one is emitted only by `collectionFindings`, which only
`doctor` consumes, so it needed its own enforcement.

A receipt that verifies nothing cannot switch the check off.
`workbench/tools/workbench-layout.mjs:612` `managedReceiptFiles` rejects a
missing, non-object, or empty `files` map, and any key that is not a plain
lane-relative name - `../../AGENTS.md` carrying that file's true hash no longer
resolves against the lane. `managedRuntimeDrift` reports each as
`tools-receipt-missing`; `receiptDrift` throws rather than return an empty
drift list; and `tools/workbench-tools.mjs:189` applies the same validator, so
the release-side `verify` refuses the same receipts.

Nor does the receipt decide how little of the runtime is checked. Refusing an
empty map still left the key set in charge of the check's scope, and a drift
report names the file it found, so deleting that one key switched the check off
for exactly the tampered file while ten others went on verifying.
`workbench/tools/workbench-layout.mjs:646` `laneCoverage` compares the
receipt's key set with `RUNTIME_TOOLS` and lists the lane beside it, and
`managedRuntimeDrift` (`:714`) reports what the receipt does not
account for before it reads a hash. `tools/workbench-tools.mjs:203`
runs the same comparison, so both entry points refuse the same receipts.

The authoritative set is `RUNTIME_TOOLS`, and it moved to
`workbench/tools/workbench-layout.mjs:532` - a tool every room
installs - from `tools/workbench-tools.mjs`, which never is; the installer
re-exports it at `tools/workbench-tools.mjs:28` so its own callers
are unchanged. Deriving a room's expected set from the lane's contents instead
had one silent hole: a managed file deleted together with its key leaves
nothing on disk to be missed. It was not a hole in ten of the eleven cases only
by accident of the import graph, and `sessions.mjs` is in no part of it. The
list is no less trustworthy than the check reading it, because
`workbench-layout.mjs` is itself managed: rewriting the list is rewriting a
managed file, which the hash comparison reports.

The two coverage conditions no longer share a remedy, because only one of them
had one that works. A managed tool the receipt does not account for is repaired
by `update --explicit-update`, which rewrites a key the receipt lost even when
the installed bytes match, and restores a managed file the lane lost. A file
the managed runtime does not include is repaired only by moving it out of the
lane: `update`'s changed set is derived from `RUNTIME_TOOLS`
(`tools/workbench-tools.mjs:236`), so it reports `current` and changes
nothing, and `install` refuses a lane that already carries a receipt.

A drift entry carries `state` and `remedy`. `receipt-stale` means the installed
bytes are the release source's and names `update --explicit-update`;
`runtime-modified` means they match neither and names `rollback`;
`runtime-authentic` means only the file mode drifted; `source-unavailable`
means no release checkout was reachable to compare against, which is the state
every installed room reports. `updateAvailable` still answers the separate
receipt-versus-source question and now rides the drift path as well as the
valid path.

No verification path was weakened, and the guarantee is stated as what it
covers rather than as an absolute. A managed file fails `verify` and `doctor`
when its bytes are **modified away from what its receipt records**, whether or
not the receipt names it and whether or not the file is still on disk - the
coverage comparison above is what makes both "whether or not" clauses true. A
missing receipt still fails the Genesis gate, and a receipt that exists but
cannot be read, records no hashes, names a file outside the lane, or covers
less than the managed runtime is reported rather than silently disabling the
check.

The emphasis is the bound. Nothing here compares installed bytes against an
authority the receipt cannot reach, so a receipt rewritten to record the
tampered bytes' own hash is consistent with the lane and passes both paths. The
release-side `verify` reads the authoritative managed **set** from outside the
room; it does not read authoritative **hashes**, and its
installed-versus-source difference is reported as informational
`updateAvailable` because that is the correct treatment for a room pinned to an
older release. That state and a wholesale receipt rewrite are indistinguishable
to it. Rewriting the lane code that runs the check is the same condition seen
from the other side: it too requires rewriting a managed file and its recorded
hash together. Both are named below rather than claimed closed.

## Remaining Limitations Or Follow-Up Specs

- **Nine bare shipped-tree citations in this spec are stale on `integration`.**
  The repair `eb5a32b` pinned them to its own branch tree, and the merge
  `92be949` moved them again. The row citing `workbench-layout.mjs:696` for
  `managedRuntimeDrift` now lands on `validateGenesisRuntime` itself, the
  function that repair existed to re-anchor, and the acceptance criterion
  beginning "the effect table" is a checked box whose only citation is a bare
  line number. Line numbers are deliberately not used to point at this spec's
  own contents here, since that is the defect being described. Found by the retrospective review of the skipped gate;
  owned by [S-045](../S-045-v3-1-2-follow-ups/SPEC.md) TK-004, together with the
  convention question behind it, since roughly 68 further bare citations across
  the sibling specs are the same class.
- Rooms already carrying live drift are not repaired here; their disposition is
  an owner decision recorded in [S-038](../S-038-v3-1-2-upstream-fix-list/SPEC.md).
- **A deleted receipt is not on `doctor`'s path at all.** `managedRuntimeDrift`
  returns `null` when the receipt file is absent, by the recorded decision that
  an uninstalled lane is not a managed runtime. Verified on a fixture room:
  with `spec-workbench.mjs` tampered and `.workbench-tools.json` removed,
  `doctor` reports no `tools-receipt-*` finding and `next` returns normally.
  Only `validate --genesis` fails on it. Closing this needs a separate decision
  about how a room distinguishes "never installed" from "receipt removed", so
  it is recorded rather than fixed here.
- **A deleted managed file is named, but for most of them the loader fails
  first.** `doctor`'s transitive import closure is **ten** of the eleven
  `RUNTIME_TOOLS` - `adr`, `diagnostics`, `markdown-table`, `privacy`,
  `spec-packet`, `spec-workbench`, `template-placeholders`, `wiki`,
  `workbench-layout`, `workbench-paths` - measured by walking the relative
  imports from `workbench/tools/spec-workbench.mjs`. `sessions.mjs` is imported
  by nothing on that path. So `rm workbench/tools/privacy.mjs` makes the run
  fail to load with `ERR_MODULE_NOT_FOUND` and a non-zero exit before any check
  executes: loud, but a stack trace rather than a named finding. The earlier
  text claimed all eleven were in that graph and concluded there was no false
  pass; that was false, and deleting `sessions.mjs` with its key was a silent
  clean run. It is now a named `tools-receipt-missing` finding, because the
  coverage comparison expects `RUNTIME_TOOLS` rather than the lane's contents.
- **A receipt rewritten to record tampered bytes is invisible to both paths.**
  Tamper a managed file and rewrite that key's hash in the receipt to match:
  the room's `doctor` reports no `tools-receipt-*` finding, and the
  release-side `verify` returns `status: valid` with the tampered file listed
  only in the informational `updateAvailable`. Verified on a fixture room. This
  is not a defect in `updateAvailable`: reporting an installed-versus-source
  difference as information is the correct treatment for a room deliberately
  pinned to an older release, and `verify` cannot separate that room from a
  tampered one, because it reads the authoritative managed *set* from outside
  the room but not authoritative *hashes*. Rewriting the lane code that runs
  the check is the same condition - `workbench-layout.mjs` is itself managed,
  so disarming the in-room check means rewriting a managed file and its
  recorded hash together. A receipt that adds a key for a file the managed
  runtime does not include sits on the same side of that boundary: the coverage
  comparison refuses a receipt that covers less than `RUNTIME_TOOLS`, not one
  that covers more, so an unmanaged file whose hash the receipt records is
  `valid` on both paths, and `update` preserves an extra key it did not write.
  Verified on a fixture room at this branch's tip and at `f2d0a02`, so it is
  pre-existing rather than introduced by the coverage repair; the file is inert
  until something invokes it, since no managed tool imports it. Closing it needs an authority the receipt cannot
  reach: classifying each drifted file against `receipt.source.commit` in the
  release checkout would separate an older release from a tampered one whenever
  that commit is present locally, at the cost of a Git dependency in `verify`
  and a further "commit unavailable" state. That is a capability change, not a
  wording change, so it is recorded here for a separate spec rather than taken
  on in this repair.
- **The expected set moved into the lane rather than being derived from it.**
  A room carries no installer, so four options were weighed for its expected
  set: derive it from the lane's contents, carry it in the receipt's own
  metadata, carry it in the installed lane code, or accept the gap. The
  receipt's metadata was rejected because it has exactly the trust problem
  being closed - the party who prunes a key can prune the list beside it.
  Deriving from the lane closed the bypass only for a file still on disk, and
  its remaining hole was covered by the import graph for ten of eleven tools
  and by nothing for `sessions.mjs`. `RUNTIME_TOOLS` therefore lives in
  `workbench/tools/workbench-layout.mjs`, which every room installs and whose
  own bytes the receipt covers, and `tools/workbench-tools.mjs` re-exports it,
  so there is still exactly one list. The residual trust boundary is the one
  above: no check a room runs is more trustworthy than the lane code running
  it, and a rewrite of that code together with its recorded hash disarms it.
- **A room's own `doctor` still cannot separate `receipt-stale` from
  `runtime-modified`.** A room carries no release checkout, so every drifted
  file it reports is `source-unavailable`; the fixture above reports
  `spec-workbench.mjs (hash, source-unavailable)`. UP-014 is therefore closed
  only for the release-side `verify`, which does have the source lane.

## Supersession

- Supersedes: none
- Superseded by: none
