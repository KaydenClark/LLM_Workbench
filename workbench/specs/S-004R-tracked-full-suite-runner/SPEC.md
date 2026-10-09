# S-004R - Tracked Full Suite Runner

**Spec ID:** S-004R
**Status:** planned
**Priority:** 1
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-07
**Catalog description:** One room-portable command runs a room's Runbook Full suite from a clean committed candidate and reports one tally and a receipt, so no agent rebuilds the runner or reads a silent zero-command pass as green.
**Blockers:** Four open owner choices in Decisions And Contracts: the dirty-tree refusal (R-1), the default log and receipt location (R-2), suite-only scope (R-3) and the non-goals (R-4).
**Latest event:** Revised from the owner grilling of 2026-10-07: the runner is template-targeted and portable, reading a room's Test And Build Full suite block; no Task is cut.
**Next gate:** Owner answers R-1 to R-4, then activation and a Task cut from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`d0fb161c1ff36caf936758b7492f7ef7fce8176e` post=`d0fb161c1ff36caf936758b7492f7ef7fce8176e`.

## Outcome

Every room made from the Workbench Template carries one suite runner,
`node workbench/tools/run-full-suite.mjs`. It runs every command in that room's
Runbook Full suite block against the committed candidate and ends with one line
an agent can trust: how many commands passed, how many failed, and which commit
was tested. It refuses to report anything when it found no commands or when the
tree was dirty. LLM_Workbench runs the same runner on its own Runbook. Agents
stop writing their own runner.

## Why It Matters

Every Worker, merger and reviewer rebuilds the suite runner by extracting the
fenced Full suite block from `RUNBOOK.md` into a script of their own. Two retros
of 2026-10-07 recorded the cost:

- one runner used BSD `sed`, extracted zero commands, printed `pass=0 fail=0`
  and exited 0, a silent false green caught only by reading the count;
- 86 session scratchpads on this machine hold 212 suite-related files, and
  lanes have overwritten each other's shared runner;
- a dirty tree causes about 30 `invalid-source-identity` failures, so every
  hand-built runner reinvents a dirty-tree check, and some reports carried
  caveats such as a file briefly untracked mid-run;
- the suite takes about 13-15 minutes, and a 10-minute background timeout
  killed one run.

A shared check that each agent re-implements is not a shared check. Rooms made
from the Template have the same gap: their Runbook holds a Full suite list and
no runner, so their agents would rebuild it too.

## Current Verified State

At the pre anchor:

- [RUNBOOK.md Test And Build](../../../RUNBOOK.md#test-and-build) holds
  LLM_Workbench's Full suite as one fenced `bash` block of 54 lines under the
  line "Full suite for controls, templates, tools, evals, or specs:": 50
  `node tools/test-*.mjs` commands, two `python3` commands, an
  `evaluate-workbench.mjs --path templates --include-controls` run and
  `spec-workbench.mjs doctor`. `AGENTS.md` points to it as the full
  verification suite.
- [templates/RUNBOOK.md Test And Build](../../../templates/RUNBOOK.md#test-and-build)
  holds a room's full verification suite as one fenced `bash` block of
  placeholders (`[FULL_TEST_COMMAND]`, `[BUILD_COMMAND]`,
  `[LINT_OR_AUDIT_COMMAND]`, `[SPEC_DOCTOR_COMMAND]`) under a different lead-in
  line from the root Runbook's. It states no contract for the block: nothing
  says a tool reads it, how the block is found, or that it holds one command
  per line.
- Rooms receive portable tools only through the managed runtime tools lane:
  [ADR-0031](../../docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md)
  puts them in `workbench/tools/`, listed in `RUNTIME_TOOLS` in
  `workbench/tools/workbench-layout.mjs`, and keeps a room's root `tools/`
  application-owned. The Lexicon's Managed runtime tool row describes the lane;
  no owner names a suite runner.
- No tracked runner exists: no `tools/run-full-suite.mjs` or
  `workbench/tools/run-full-suite.mjs`, no `package.json` script, no `.github/`
  workflow, no `.husky/` directory, and `core.hooksPath` is unset.
- The Wiki entry
  [Suite needs a committed candidate](../../wiki/suite-needs-a-committed-candidate.md)
  records the dirty-tree cascade and asks that a runner print its candidate
  first.
- Neither Runbook says anything about expected runtime.

## Desired Behavior

1. **Description first.** LLM_Workbench's own description of the Template, the
   Canon, Grounding and Enduring Context that say what a room's Test And Build
   section holds and which managed runtime tools a room carries, states that
   every room carries the suite runner and that a room's Full suite block
   follows a contract the runner reads. `to-docs` routes each statement to its
   owner. This lands before any Template artifact changes.
2. **Block contract.** `templates/RUNBOOK.md` Test And Build states the Full
   suite block's contract: how the runner finds the block, that it is one
   fenced `bash` block, and that each non-blank line is one command run from
   the room root. LLM_Workbench's own `RUNBOOK.md` meets the same contract.
3. `node workbench/tools/run-full-suite.mjs` reads the Full suite block from the
   room's `RUNBOOK.md` at run time. The Runbook block stays the only list; the
   runner holds no copy.
4. Before running, it refuses with a named error, and runs nothing, when the
   block yields no commands, when the working tree has tracked or untracked
   changes, or when HEAD cannot be resolved. Whether the dirty-tree refusal has
   any override is open choice R-1.
5. It runs each command in order from the room root, keeps going after a
   failure, and writes each command's output to its own log. The default log
   location is open choice R-2.
6. After the run it checks the tree again and reports any file the suite left
   changed or untracked as a failure of the run, not of a command.
7. It ends with exactly one tally line,
   `TALLY pass=N fail=M total=T candidate=<40-hex SHA>`, and exits non-zero when
   any command failed, the post-run tree check failed or `total` is zero.
8. With `--receipt FILE` it also writes a JSON receipt holding the candidate
   SHA, start and end times, total, pass and fail counts, and each failing
   command with its exit code and log path.
9. Both Runbooks' Test And Build sections name the runner as the way to run the
   Full suite. LLM_Workbench's says its suite takes about 15 minutes, so a
   caller sets a timeout of 30 minutes or more; the Template's asks a room to
   state its own suite's runtime.

## Decisions And Contracts

- **Template-targeted (owner decision, 2026-10-07).** The Template Workbench is
  the Actuality this Spec changes; LLM_Workbench's destination claims about it
  are Canon. The runner is a portable runner rooms use, not a tool only this
  repository runs. The Spec first updates LLM_Workbench's Canon, Grounding and
  Enduring Context describing the Template's Test And Build behavior, then the
  Template artifacts. Why (owner): what is Actuality and what is not is what
  matters; LLM_Workbench's docs describe what the Template is, does and how, so
  they lead.
- The runner ships as a managed runtime tool in `workbench/tools/`, registered
  in `RUNTIME_TOOLS`, as ADR-0031 requires of a portable tool; its test lives in
  this repository's root `tools/`.
- A room's Runbook block is the single source of truth for that room's suite
  membership; adding or removing a suite member stays a Runbook edit.
- The runner reports; it decides nothing. It does not write Spec evidence, close
  Tasks or record verdicts.
- The runner needs no network access and no package install; it needs only
  Node, which every room's runtime tools already need. The commands it runs
  bring their own requirements.
- The runner's own test joins LLM_Workbench's Full suite. It drives the runner
  against fixture Runbooks, including a room made from the Template, never the
  real Runbook, so the suite does not run itself.

### Open owner choices

- **R-1, dirty-tree refusal.** Does the runner refuse strictly on any tracked or
  untracked change, with no override flag? Recommendation (not an owner
  answer): yes, strict with no override.
- **R-2, default log and receipt location.** Where do per-command logs go by
  default, and where does a receipt go when a caller wants one without naming a
  path? Recommendation (not an owner answer): none recorded.
- **R-3, scope.** Does the runner run the Full suite only, or also self-drift
  and `doctor` outside the block? LLM_Workbench's block already lists `doctor`.
  Recommendation (not an owner answer): suite only.
- **R-4, non-goals.** Are the three proposed non-goals below (no parallel runs,
  no automatic feed into `receipt --tests`, no change to suite membership) the
  owner's? Recommendation (not an owner answer): keep all three.

## Non-Goals

- Running the suite in CI or on a hook. That is
  [Required checks on pull requests into integration](../S-004S-required-checks-on-pull-requests-into-integration/SPEC.md),
  which is blocked by this Spec.
- Proposed, pending R-4: running commands in parallel or caching results.
- Proposed, pending R-4: feeding `receipt --tests` automatically. A caller may
  paste the tally line.
- Proposed, pending R-4: changing which commands are suite members, or why the
  three non-member checks stay outside.

## Dependencies And Blockers

- Blocked by: no Spec.
- Blocks:
  [Required checks on pull requests into integration](../S-004S-required-checks-on-pull-requests-into-integration/SPEC.md)
  (S-004S): its workflow calls this runner.
- Open owner choices R-1 to R-4 above.

## Vertical Implementation Slices

No Task is cut. Tasks are cut from live Actuality at activation with
`/to-tasks`. The intended direction is: LLM_Workbench's description of the
Template first; then the Template Runbook's block contract; then one tracer
slice (parse, refuse, run, tally against a fixture Runbook); then the
clean-tree checks and receipt; then the runner installed and run in a room made
from the Template; then both Runbooks' wording.

## Acceptance Criteria

- [ ] LLM_Workbench's description of the Template names the suite runner and the Full suite block contract, and that change lands before any Template artifact change.
- [ ] `templates/RUNBOOK.md` Test And Build states the block contract, and LLM_Workbench's own Runbook block meets it.
- [ ] The runner is listed in `RUNTIME_TOOLS`, installs into a room made from the Template, and in that room runs the room's block with a tally whose `total` equals the block's command count.
- [ ] On a clean committed tree of this repository, the runner runs every Full suite command the Runbook block lists, and its tally's `total` equals the block's command count.
- [ ] A fixture Runbook whose block yields no commands makes the runner exit non-zero with a named error and no tally reporting a pass.
- [ ] A dirty or untracked file before the run makes the runner refuse without running any command; a file the suite leaves changed fails the run by name.
- [ ] One failing fixture command yields `fail=1`, a non-zero exit, and that command and its log path in the receipt.
- [ ] Both Runbooks name the runner and the expected runtime, and no copy of a command list exists outside a Runbook block.
- [ ] The owner's answers to R-1 to R-4 are recorded in this Spec before the Plan relies on them.
- [ ] Named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

A new `tools/test-run-full-suite.mjs` drives the runner as a subprocess against
a throwaway Git repository holding a fixture `RUNBOOK.md` whose Full suite block
lists small passing and failing commands, and against a room made from the
Template with `workbench-layout.mjs init` whose block is filled with fixture
commands. Each refusal (empty block, dirty tree, untracked file,
changed-after-run) is one case.

## Verification Procedure

Red/green at the runner seam, then the runner in a room made from the Template,
then the runner itself on a committed candidate of this repository, compared
against the count of commands in the Runbook block. Record actual commands and
results in this Spec.

## Documentation Impact

First, LLM_Workbench's description of the Template, routed by `to-docs` (for
example the Lexicon's Managed runtime tool row, the Blueprint or a Wiki entry,
whichever owns the statement). Then `templates/RUNBOOK.md` Test And Build: the
block contract, the runner command, its tally and receipt, and where a room
states its runtime. Then `RUNBOOK.md` Test And Build: the runner, the expected
runtime. The Wiki entry Suite needs a committed candidate points to the runner.
The `implement` and `implement-spec` skills say "the full verification suite";
check whether either restates how to run it and update only what restates it.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-07 | none | Authored at the Map step from two implement-spec retros at integration d0fb161c1ff36caf936758b7492f7ef7fce8176e. | Map only; the Runbook block, the absence of a runner, CI and hooks were read at that tip; no runtime proof claimed. | This Spec. | Owner approval, Plan, implementation and proof remain. |
| 2026-10-07 | none | Revised from the owner grilling of 2026-10-07. Carries the governance-stack lens decision (the runner is template-targeted and room-portable, reads a room's Test And Build Full suite block, the Template Runbook gains the block's contract, and LLM_Workbench's description of the Template is updated first) and the edge that this Spec blocks S-004S. Keeps R-1 to R-4 open with recommendations, and moves the runner from this repository's root `tools/` to the managed runtime tools lane. | Spec revision only; templates/RUNBOOK.md Test And Build, ADR-0031 and RUNTIME_TOOLS were read at d0fb161c1ff36caf936758b7492f7ef7fce8176e; no runtime proof claimed. | This Spec. | Owner answers to R-1 to R-4, Plan, implementation and proof remain. |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

Parallel or incremental suite runs, if the 15-minute runtime keeps costing
timeouts once the tally is trusted.

## Supersession

- Supersedes: none
- Superseded by: none
