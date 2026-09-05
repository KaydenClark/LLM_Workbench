# Harness Feedback Report - v3.1.1 Acceptance Review

## Target And Scope

- Date: 2026-09-05 UTC (review conducted 2026-09-04 local time).
- Assigned capability: [S-027](../specs/S-027-workbench-v3-1-1-boundaries/SPEC.md),
  status complete. This report assesses that completed delivery; it does not
  reopen, amend, or repair it.
- Targets, both committed: branch tip `fa04e27f` on
  `codex/workbench-boundaries-redesign`, and the integration tip
  `b2918eed76ef4c0d420a5df8236e963c62c074b6`, which equals `origin/integration`.
  This is a committed-state review, not an inspection of uncommitted work.
- Question: was v3.1.1 accepted in the way its Canon claims, and what did the
  harness itself cost the run that delivered it?
- Inspected scope: `AGENTS.md`, `CLAUDE.md`, `RUNBOOK.md`, `LEXICON.md`,
  S-027 in both the branch and integration copies, the two existing lane
  reports, `workbench/manifest.json`, `tools/audit-guardrails.mjs`,
  `workbench/tools/sessions.mjs`, `workbench/tools/privacy.mjs`,
  `workbench/sessions/.gitignore`, `skills/`, the user-scoped skills discovery
  root on this host, and local Git refs and worktrees.
- Method: read-only. No generator, formatter, test suite, or Git write was run
  during the review. The report was authored afterwards under owner instruction.
- Producing context: a session that did not implement S-027 and holds no record
  of that implementation. Every statement below rests on the durable record and
  on live read-only observation, never on session memory.

## Evidence And Limitations

Executed commands and actual results:

- `git merge-base --is-ancestor fa04e27 integration` exits 0: the branch tip is
  contained in integration.
- `git rev-parse integration origin/integration` returns
  `b2918eed76ef4c0d420a5df8236e963c62c074b6` for both.
- `git show integration:workbench/specs/S-027-.../SPEC.md` reports
  `Status: complete`, `Next gate: none`, seven of seven acceptance boxes
  checked, and 26 dated evidence rows.
- `git log HEAD..integration` at the branch tip returns three record-only
  commits touching `BLUEPRINT.md`, `TASKBOARD.md` and three SPEC files; no
  runtime source differs between the two targets.
- At the branch tip, `node workbench/tools/spec-workbench.mjs doctor` prints
  `ok - spec workbench doctor passed`, and `next --json` returns S-027/TK-001
  with status `in-progress` and a next gate naming a merge already performed.
- `tools/audit-guardrails.mjs` line 334 and line 349 both test
  `/^specs\/S-\d{3}-[^/]+\/SPEC\.md$/`, while `workbench/manifest.json` declares
  the specs lane as `workbench/specs`. Identical on integration.
- `git check-ignore -v` finds no rule covering a spaced `grilling diary`
  directory under the sessions lane; `workbench/sessions/.gitignore` denies
  `grilling/*` and `handoffs/*` only.
- `diff -rq` between `skills/` and the user-scoped discovery root reports
  `grilling`, `checkpoint`, `make-it-so` and `code-review` as differing; the
  four stance directories are present there.
- `git worktree list` returns nine entries; eight live under a host temporary
  directory, including the only checkout of `integration`.
- Of the remote branches, 27 are contained in `origin/integration` and 32 are
  not.

Limitations:

- No agent-outcome claim is made or supported. There are no controlled trials
  here, and single observations carry no frequency information.
- The stall described by F-002 is self-reported by the agent that stalled. This
  report did not re-derive it and inherits that weaker evidential standing.
- The verification suite, evaluator, render and guardrail audit were not run.
  No PASS, score, or drift result is claimed from this report.
- Host state outside this repository is observed but lies outside its edit
  scope; only its owner can change it.
- Findings F-004 and F-006 rest on reading a code path and a tool's output, not
  on executing a failing regression test. Their bounded actions each require
  red/green proof before any repair is accepted.

## Findings

Ordered by demonstrated impact.

### F-004 - High: the guardrail contradiction check cannot fail under schema 2

**Location:** `tools/audit-guardrails.mjs:347` (`hasContradictorySpecState`),
consumed at line 136. Same defect class as F-001 at line 334, opposite failure
direction.

**Claim:** the function iterates the loaded file map and `continue`s on every
name not matching `^specs/S-###-slug/SPEC.md`. Under schema 2 the specs lane is
`workbench/specs`, so no key ever matches, the loop body never executes, and the
function always returns `false`. Line 136 scores the criterion as
`!hasContradictorySpecState(files)`, so it passes unconditionally and awards its
points whatever the spec state actually is.

**Demonstrated impact:** the check exists to catch a spec marked complete while
a ticket is still `ready`, `in-progress`, `blocked` or `deferred`, or while the
spec is still on the Taskboard. That is precisely the drift two separate
reviewers had to find by hand during this delivery: the stale header, acceptance
box and slice row repaired after the review at `72cf0fe`, and the committed
catalog reading `active` while spec and Taskboard read `blocked`, which caused
the rejection at `3613fd1`. The detector that should have caught both was inert
throughout. It follows that the recorded 68 to 73 guardrail movement includes at
least one criterion that could not have withheld its points, so that figure does
not carry the meaning the record gives it.

**Why the harness causes it:** schema 2 introduced declared lanes, and the
migration moved specs under `workbench/specs` without sweeping the tools that
address specs by hardcoded path. F-001 reported one survivor and proposed
investigating this neighbour; the investigation had not been authorized, so the
second survivor stayed live. The failure is silent in the worse direction: F-001
raises a false alarm the owner can see, while F-004 grants false assurance the
owner cannot.

**Smallest bounded next action:** one authorized repair spec covering both
predicates, with red/green coverage for a schema 1 layout, a schema 2 layout and
a malformed manifest. Preserve existing weights and freshness rules. Re-measure
the guardrail score afterwards and record that the prior 73 was taken with an
inert criterion. Not authorized by this report.

### F-005 - Medium-High: shipped skills never reach the host that loads them, and the divergent notepad lane is unignored

**Location:** the user-scoped skills discovery root on this host, versus
`skills/` and `workbench/sessions/.gitignore` in this repository.

**Claim:** the discovery root is a separate Git repository, so the installer and
the explicit upgrade both fail closed there with `foreign-git-root`. All four
stance directories are now present, which contradicts the S-027 limitation
recording that none was; they were placed there outside the installer. But the
installed `grilling` and `checkpoint` skills still target a spaced
`grilling diary` directory under the sessions lane, and four installed skills in
total differ from the versions this repository ships.

**Demonstrated impact:** the sessions lane ignore rules cover `grilling/` and
`handoffs/` only. A real grilling session on this host therefore writes a live
notepad into a lane the manifest does not declare and Git does not ignore, so
the notepad becomes trackable and committable. The fail-closed privacy scan runs
at checkpoint promotion, which such a notepad never reaches; the protection is
bypassed before it applies. This is the only finding in this report with a
privacy consequence.

**Why the harness causes it:** the installer correctly refuses to write into a
foreign Git root, and the verification suite proves skill installation against
disposable hosts only. The single environment where the controls must actually
work is the one environment with no gate covering it, so shipped and installed
skills drift with nothing detecting the divergence.

**Smallest bounded next action:** the discovery root's owner replaces its
`grilling` and `checkpoint` copies with the versions in `skills/`. Separately,
and in this repository, a proposal to have the sessions lane ignore rules deny a
spaced `grilling diary` directory defensively. Neither is authorized here, and
the first is outside this repository's edit scope.

### F-006 - Medium: the entry route returns finished work when the checkout is behind integration

**Location:** `AGENTS.md` Work Selection And Lifecycle steps 1 to 4, and the
`doctor` and `next` commands in `workbench/tools/spec-workbench.mjs`.

**Claim:** at the branch tip, which is fully contained in integration, `doctor`
reports `ok` and `next --json` returns S-027/TK-001 as `in-progress` with a next
gate directing the agent to review and merge. On integration the same spec is
complete with no gate. Selection reads spec state from the checked-out worktree
alone and has no notion that the spec completed on the branch this checkout is
behind.

**Demonstrated impact:** an agent entering exactly as the contract instructs is
dispatched to verify, review or merge a capability already delivered at
`b2918ee`, which is the duplicated-cycle cost this delivery set out to remove.
The ambiguity diagnostic that exists to stop such entries reports no finding.

**Why the harness causes it:** step 1 asks the agent to verify branch, remote
and upstream state, but that is prose the agent performs rather than an
assertion any tool makes, and `doctor` blocks only on registered `all` and
`selection` findings. No registered finding covers a stale checkout, so the two
controls disagree and the machine-checkable one wins by silence.

**Smallest bounded next action:** propose a registered diagnostic, at
`attention` severity so it stays visible without blocking, for a checkout behind
its integration branch whose selected spec is complete there. It needs its own
spec and red/green proof. Not authorized by this report.

**Known counter-consideration:** S-027 explicitly defers local synchronization,
so this checkout may be pinned deliberately. That makes a diagnostic the correct
shape of fix and a checkout change the wrong one.

### F-007 - Low-Medium: review worktrees are created by contract and retired by nobody

**Location:** the integration review gate in `AGENTS.md`, and the
Version-Control Procedures in `RUNBOOK.md`.

**Claim:** the gate requires review against an immutable candidate, which
produces detached clones. Nine linked worktrees currently exist, eight of them
under a host temporary directory, six being review clones from earlier specs.
The only checkout of `integration` is among them. No control names where such
clones may live or who removes them.

**Demonstrated impact:** this is recorded, not hypothetical. The closeout recipe
failed during this delivery because `git switch integration` could not succeed
against the linked worktree holding that branch, and repairing it cost the
additional commit `7d05596`. A host temporary directory is subject to operating
system cleanup, which would orphan the only `integration` checkout and leave
stale worktree metadata behind.

**Why the harness causes it:** the review contract creates a durable artifact as
a required step and assigns it no owner or lifetime, so the artifacts accumulate
until an unrelated procedure trips over them.

**Smallest bounded next action:** propose a Canon line placing review clones in
a declared durable scratch location, and adding a worktree prune step to the
Runbook closeout. Not authorized by this report.

## Challenged Or Rejected Findings

- **Rejected: "the delivery failed to land."** It landed. The merge is recorded
  at `09f0875`, the closeout at `b2918ee`, and `origin/integration` matches.
  Seven of seven acceptance criteria are checked on the integration copy.
- **Rejected: "the four integration rejections show the process failing."** They
  show the gate working. Each of the four found a real defect that was
  reproduced red and repaired green: a stale Lexicon release designation, an
  omitted generated Blueprint row that broke dogfood and doctor in a clean
  clone, a managed-tool update that could follow a replaced symlink and
  overwrite an unrelated file, and layout ignore-erasure with a failing legacy
  Wiki adoption. Self-review would have shipped all four. This is the strongest
  positive signal in the record and should not be read as churn.
- **Contradicted: "the five-point loss is the important half of the guardrail
  defect."** F-001's visible false alarm is the less costly half. F-004's silent
  pass is worse, because a criterion that cannot fail cannot warn.
- **Contradicted: "none of the four stances is present on the owner host,"**
  recorded in S-027 Remaining Limitations. All four are present. That entry is
  stale rather than wrong when written, and completed spec text is not amended
  by this report.
- **Not supported: "68 to 73 measures this delivery's improvement."** One scored
  criterion could not fail, and the movement was measured before that was known.
  The figure needs re-measurement after F-004, not reinterpretation.
- **Rejected: "accumulated branches are a control violation."** Branch
  Completion permits owner deferral, and the owner deferred explicitly. The open
  item is that the deferral carries no review date, which is an owner decision
  and not a defect.
- **Rejected: "this report should repair F-004."** The lane's report and repair
  boundary forbids it, and the boundary held for F-001 under the same pressure.

## Version Acceptance Ledger

Recorded so acceptance can be compared across versions over time. Each row
states what was accepted, where, and on what evidence.

| Version | Candidate | Accepted into | Acceptance evidence | Standing qualification |
|---|---|---|---|---|
| v3.0.0 | portable-layout candidate | never promoted | preserved, unreleased | superseded baseline |
| v3.1.0 | `4ce74f8` | never promoted | preserved, unreleased | continued as v3.1.1 |
| v3.1.1 | `fa04e27` | `integration` at `b2918ee` | 7/7 acceptance; independent separate-context APPROVE on the exact candidate; 30-command AGENTS/RUNBOOK union PASS; remote containment read back | guardrail 73/100 qualified by F-004; four findings open below |

Finding lifecycle across reports in this lane:

| ID | Report | State at this review | Note |
|---|---|---|---|
| F-001 | boundaries | open, reproduced live | unrepaired on integration; extended by F-004 |
| F-002 | branch-lifecycle | landed, awaiting exposure | Branch Completion contract plus three governance assertions |
| F-003 | branch-lifecycle | landed, awaiting exposure | narrowed branch-removal gate |
| F-004 | this report | new, open | in-repo, demonstrated by code path |
| F-005 | this report | new, open | host-scoped; outside this repository's edit scope |
| F-006 | this report | new, open | diagnostic proposal |
| F-007 | this report | new, open | Canon proposal |
| P3-1 | S-027 review | open | wiki files stamp v3.0.0 against manifest v3.1.1; no diagnostic covers wiki stamps |
| P3-3 | S-027 review | open | `sessions.mjs` resolves `--from` without constraining it to the root; privacy scan still gates every write |

Neither the guardrail rubric nor the template evaluator scores branch lifecycle
or version-acceptance hygiene, so none of the rows above moves either score.
Whether they should is the open question F-003 already put to the owner.

## Next Action And Open Questions

S-027 is complete and is not reopened by this report. Nothing here is
authorized; each finding names a bounded action awaiting owner decision, and any
accepted repair needs a new linked spec with its own red/green proof.

Recommended order if the owner authorizes work: F-004 first, because it is
in-repo, demonstrated, and currently distorts the measure used to judge every
later version. Then F-005, which is the only finding with a privacy consequence,
though its first step belongs to the discovery root's owner. Then F-006 and
F-007.

Open questions for the owner:

- Is the primary checkout pinned to the merged branch deliberately? If yes, F-006
  is a diagnostic gap only; if no, local synchronization is also outstanding.
- Should the guardrail score be re-baselined after F-004, and should the
  historical 73 be annotated rather than restated?
- Does branch and version lifecycle deserve a scored criterion? This repeats the
  question F-003 left open; two reports have now reached it independently.
- Should the deferred branch cleanup, currently 27 remote branches contained in
  `origin/integration`, receive a review date?

A cold continuation can act on this report and the linked spec without the
originating chat. It creates no new task; the owner's authorization does.

## Review Boundary

This report is self-produced by a single session and carries no independent
PASS. It is not a separate-context candidate review and satisfies no integration
gate. The reviewing session did not implement S-027, which removes self-review
bias over the delivery but supplies no independent corroboration of this
report's own claims.

The two consequential claims that most need challenge before any repair is
accepted are the reading of `hasContradictorySpecState` as unconditionally
passing under schema 2, and the claim that selection returns finished work from
a stale checkout. Both are reproducible read-only from the locations cited.
