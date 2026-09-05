# CIC v3.1.1 Adoption Feedback Report

## Target And Scope

- Report date: 2026-09-05 UTC (work performed 2026-09-04 local time).
- Assigned spec: none. This is an owner-requested, read-only Harness Feedback
  Review, not an assigned repair. The reviewed work's own owner is S-031 in the
  target repository, at `workbench/specs/S-031-workbench-v3-1-1-adoption/SPEC.md`.
- Target: Command Information Center (CIC), branch
  `claude/workbench-v3-1-1-adoption` at commit `a34c34a` (with `f364894`),
  against base `origin/Integration` at `a601df7`. Remote
  `https://github.com/KaydenClark/command-information-center`.
- Harness under review: this repository at `fa04e27` (v3.1.1), plus the
  user-scoped `adoption` and `update-harness` skills.
- Question: did the v3.1.1 harness help or fight a real room's move from the
  v2.3 root layout onto the manifest-declared support root, and what friction
  was caused by the harness rather than by the project?
- Method: read-only inspection of committed artifacts plus non-mutating
  diagnostics. No generator, formatter, test command, or Git write touched the
  target.

## Evidence And Limitations

Executed against the target, with actual results:

- `node workbench/tools/spec-workbench.mjs doctor` -> `ok - no blocking finding`;
  one `stale-claim [attention, blocks none]` row for S-027, dated 2026-08-30.
- `node workbench/tools/workbench-layout.mjs validate --project "$PWD"` ->
  `{"status":"valid", ...}` at schemaVersion 2, six lanes, seven collections.
- `git ls-remote origin` -> `refs/heads/claude/workbench-v3-1-1-adoption` =
  `a34c34a4ef199dfd8cce332946879837d20436a4`; `refs/heads/Integration` =
  `a601df7eee51f2e27beb201bcfd5c35c19f02279`.
- `gh pr view 35 --json state,mergeable,reviewDecision,reviews,...` ->
  `state: OPEN`, `mergeable: MERGEABLE`, `reviews: []`, `reviewDecision: ""`,
  `changedFiles: 63`, `additions: 2685`, `deletions: 787`,
  `createdAt: 2026-09-05T03:44:07Z`.
- `git status -sb` in the target -> `## claude/workbench-v3-1-1-adoption` with
  no upstream recorded locally.
- File reads: target `workbench/manifest.json`,
  `workbench/tools/.workbench-tools.json`,
  `workbench/sessions/checkpoints/adoption-recovery.json`,
  `workbench/feedback/WORKBENCH_FEEDBACK.md`, the seven root controls, and S-031.
- Source reads: `templates/ADOPTION.md`, `tools/workbench-adoption.mjs`,
  `workbench/tools/workbench-layout.mjs`, `RUNBOOK.md`, and the user-scoped
  `adoption` and `update-harness` skills.

Limitations, stated plainly:

- **No session transcript.** The reviewing context did not perform the work and
  has no recall of it. Every statement about difficulty or intent is an
  inference from artifact shape, marked as such, not a memory.
- **The project suite was not re-run.** The review contract forbids test
  commands. The figures `331 tests / 325 pass / 0 fail / 6 todo` against a
  `326 / 320 / 0 / 6` baseline, the browser run, the build, and the audit are
  S-031's recorded claims. They are Grounding, not Actuality verified here.
- These are structural and mechanical observations. They do not establish agent
  outcome improvement, and no comparative trial was run.

## Findings

Ordered by impact. Cause classes follow the review method: `defective Canon`,
`missing Canon`, `stale or insufficient Grounding`, `project-specific failure`,
`meta-caused friction`, or `mixed`.

### F-001 - High: no route exists for a layout-generation change on an already-adopted room

**Cause:** mixed (missing Canon + meta-caused friction). Confidence high.

**Canon claim.** `skills/adoption/SKILL.md`: "Use Adoption only when an existing
project is joining the Workbench for the first time. A routine harness update
uses `/update-harness`; do not rerun Adoption to update an already-adopted
project."

**Actuality.** CIC was already adopted at v2.3; its own
`workbench/specs/S-002-workbench-v2-3-adoption/SPEC.md` records that adoption.
Yet the target's `workbench/manifest.json` now reads
`"provenance": {"lifecycle": "adoption", ...}`, and both S-031 and the commit
message describe running "the bounded Adoption migration".

**Mechanism.** `tools/workbench-adoption.mjs migrate` is the only seam that
creates the v3 support root from a v2 root layout.
`workbench/tools/workbench-layout.mjs migrate` handles manifest schema 1 -> 2
only (it stamps `migratedFrom: 1`), which requires a manifest the target did not
have. So the sole tool able to perform this transition is gated behind a skill
that forbids using it for this case.

**Impact.** The room's permanent provenance record misdescribes its own history.
An agent reading `lifecycle: "adoption"` will conclude CIC joined the Workbench
in September 2026, contradicting S-002. The implementing agent's choice was the
only one that worked; the gap is in the controls.

**Counterevidence considered.** None found. `RUNBOOK.md` line 233 does describe
the migration as "a real one-time migration", which is consistent with a
first-join framing and does not carve out the already-adopted case.

**Bounded next action.** Owner decision on whether v2-root -> v3-support-root is
an Adoption case, an Upgrade case, or a third named lifecycle; then a separately
authorized change to the skill text and to the manifest's permitted
`provenance.lifecycle` values.

### F-002 - High: `/update-harness`, the skill that should govern this work, is a generation stale

**Cause:** defective Canon (meta-caused). Confidence high.

**Canon claim.** `skills/update-harness/SKILL.md` step 1.3 instructs the agent to
verify the canonical Workbench source at `$INSTANCE_ROOT/Foundry/Halls/Forge`.

**Actuality.** On the observed machine `INSTANCE_ROOT` is unset and
`~/Foundry` does not exist. The same skill then instructs, in step 3,
"create stable `specs/S-###-slug/SPEC.md` capability packets" and "copy the
canonical `tools/spec-workbench.mjs` exactly", and in step 4 runs
`node tools/spec-workbench.mjs render`. All are v2 root-layout paths superseded
by the manifest-declared lanes.

**Impact.** An agent that correctly selects `/update-harness` for an
already-adopted project fails at its first verification step, and if it proceeds
is steered to write v2 paths and a root-level tool copy into a v3 room. This is
the second half of F-001: the correct route is unusable and the usable route is
forbidden.

**Bounded next action.** Rewrite `update-harness` for v3.1.1 - resolvable source
location, manifest lanes, `workbench/tools/`, receipt verification - and name the
layout-generation case explicitly. Separately authorized; not performed here.

### F-003 - Medium: the migrate seam cannot record source provenance in the manifest

**Cause:** meta-caused friction. Confidence high.

**Canon claim.** `templates/ADOPTION.md` -> Inputs requires capturing "source
remote, ref, and resolved commit"; `skills/adoption/SKILL.md` step 6 requires
recording "the source remote, ref, resolved commit, executed self-tests, and any
vendored-helper checksum in the owning spec".

**Actuality.** Two provenance records now disagree in the target.
`workbench/tools/.workbench-tools.json` carries
`"commit": "fa04e27261497ad5aa2f62085764fb6581b2e7e1"` with `"dirty": false`.
`workbench/manifest.json` carries `"commit": "unrecorded"`.

**Mechanism, demonstrated in source.** `workbench/tools/workbench-layout.mjs:213`
resolves `commit: options['--source-commit'] ?? 'unrecorded'`, and
`tools/workbench-adoption.mjs` (usage string, line 195) accepts only
`--project`, `--home`, and `--version`. The migrate path has no way to pass the
resolved commit through, so `"unrecorded"` is the only value it can produce.

**Impact.** Low today, because the receipt carries the truth and S-031 records it
in prose. But `workbench/manifest.json` is the declared single support-path
authority, so its provenance block reads as authoritative while being empty. Two
records of the same fact, one blank, is a drift generator.

**Explicitly not an agent failure.** The implementing agent recorded the commit
in both places it could: the receipt and the owning spec.

**Bounded next action.** Either thread the resolved source commit from the
adoption run into `manifest.provenance.source.commit`, or remove that field so
the receipt is the single record. Add red/green coverage for whichever is
chosen. Separately authorized.

### F-004 - Medium: appending harness friction is a finish condition in no checklist

**Cause:** mixed (missing Canon amplifying a project-specific omission).
Confidence high.

**Canon claim.** The target's `AGENTS.md` documentation-ownership table routes
"reusable control-surface friction sent back to the harness" to
`workbench/feedback/WORKBENCH_FEEDBACK.md`. That file's own header states it is
an append-only log carrying reusable control-surface friction back to the LLM
Workbench.

**Actuality.** The log holds exactly two rows, both dated 2026-07-28. It carries
no row for the 2026-09-04 adoption, despite that run encountering at least the
three reusable frictions recorded above as F-001, F-002, and F-003.

**Mechanism.** Neither `templates/ADOPTION.md` -> "What A Finished Adoption Must
Prove" nor `skills/adoption/SKILL.md` lists appending observed harness friction
as a completion condition. ADOPTION.md's only feedback instruction is its closing
note to copy `templates/feedback/REPORT_FORMAT.md` into the lane if it is
missing - a setup step, not a harvest step. The lane is installed and then never
asked for.

**Impact.** The friction was known to the implementing agent at the time and was
recoverable afterwards only by artifact archaeology, which is what produced this
report. A checklist line would have captured it for the cost of one row.

**Bounded next action.** Owner decision on adding a line to ADOPTION.md's
completion checklist: harness friction observed during the run is appended to
the feedback lane, or `none observed` is recorded with a reason. The same
question applies to GENESIS.md and to the upgrade path.

### F-005 - Medium: hand-reconciled root controls have no fidelity check

**Cause:** mixed (missing Canon + project-specific failure). Confidence high.

**Canon claim.** This repository's `AGENTS.md` documentation-ownership table
reads: "decision rationale, alternatives, supersession | `workbench/docs/adr/`
(rule binds only where `canonicalized_in` points)".

**Actuality.** The reconciled copy at the target's `AGENTS.md:220` reads
"decision rationale, alternatives, supersession | `workbench/docs/adr/`" - the
scoping qualifier is absent. CIC's adopted rule is therefore unconditional and
stricter than the source rule it was reconciled from, and nothing records that
as a decision.

**Compounding observation.** Under the stricter rule as written, the
fork-retirement decision in S-031 - which carries rationale, a declined
alternative, and supersession of S-028 for this room - owes an ADR. The target's
`workbench/docs/adr/` contains only `.gitkeep`.

**Mechanism.** 392 lines of `AGENTS.md` were reconciled by hand in a single
commit. No tool diffs an adopted control against the template it derives from,
so a dropped clause is invisible. `workbench/tools/template-placeholders.mjs`
checks for unfilled placeholders, not for fidelity to source.

**Impact.** One dropped qualifier out of 392 lines is small; the absence of any
check is not. Every adopting room can silently diverge in either direction -
stricter or looser than the harness intends - with no signal.

**Bounded next action.** Two separable items for owner decision: (a) a
control-fidelity diff check as part of adoption and upgrade verification, and
(b) a target-local repair restoring the qualifier in CIC's `AGENTS.md`. Neither
is performed here.

### F-006 - Low: the ADOPTION completion checklist and the owning spec's acceptance list diverged

**Cause:** project-specific failure. Confidence medium.

**Canon claim.** `templates/ADOPTION.md` -> "What A Finished Adoption Must Prove"
includes: "`.claude/settings.json` is filled from that scope, or `.claude/` was
omitted with a reason."

**Actuality.** The target has no `.claude/` directory, and a search for
`.claude` across the target's `AGENTS.md`, `RUNBOOK.md`, `README.md`, and S-031
returns nothing. S-031 marks every one of its own acceptance boxes `[x]`.

**Mechanism.** S-031 authored its own acceptance list rather than carrying
ADOPTION.md's checklist forward, and this item did not survive the transfer. The
spec is internally consistent; the protocol box is simply unowned.

**Impact.** Low. Mechanical scope enforcement is absent, and no reader can tell
whether that was chosen or missed.

**Bounded next action.** Target-local: record the omission reason, or add the
settings file. Optionally, ADOPTION.md could state that the owning spec's
acceptance list must subsume the protocol checklist.

## Challenged Or Rejected Findings

- **"The work stopped short of merging, so Branch Completion was violated."**
  Rejected as stated. The target's `AGENTS.md:256` requires a separate-context
  reviewer before branches combine, and `gh` reports PR #35 with `reviews: []`.
  Stopping at an unreviewed candidate is the controls working, not failing. What
  is true and weaker: the work is recoverable, not delivered - `origin/Integration`
  at `a601df7` does not contain `a34c34a` - and a 63-file harness migration
  sitting unreviewed accrues drift risk. Recorded as an open gate below, not as a
  finding against the agent.
- **"This is a recurrence of the branch-lifecycle F-002 stop-at-PR pattern."**
  Not supported. That finding's Branch Completion repair landed in this
  repository and the target now carries it verbatim at `AGENTS.md:262`. The
  correct lifecycle status is landed-awaiting-exposure: the control is present
  and this candidate has not yet exercised it through to a merge.
- **"Retiring the FUID columns lost history."** Not supported as data loss. The
  removed columns remain in Git history, S-028 stays `complete` with its
  capability intact for other scopes, and S-031 names two paths back. What the
  evidence does support is narrower and already disclosed by the target itself:
  CIC's own room now reports as an `unavailable` Work-item Projection source.
- **"The single 59-file migration commit violates one-logical-change."** Not
  supported. One migration is one logical change, and the product-code reader
  work was correctly split into `f364894`. A weaker, evidenced observation
  remains: both commits carry timestamps twelve seconds apart (21:43:24 and
  21:43:36), so no intermediate recovery point existed during the run, against
  `skills/adoption/SKILL.md` step 5 ("commit and push each coherent migration
  ticket and every incomplete checkpoint"). Recorded as a practice note, not a
  control defect.
- **"The absence of a handoff artifact is a gap."** Rejected. `AGENTS.md`
  states cold continuation uses existing owners and that no universal handoff
  artifact is required. S-031's `Next gate` line carries the continuation.

## Aligned Claims

Recorded so the report is not read as a list of failures. Each was checked:

- `workbench-layout.mjs validate` returns `status: valid` at schema 2 with all
  six lanes and seven collections, matching S-031's first acceptance criterion.
- The tools receipt hashes eleven managed files and names the exact source
  release and commit with `dirty: false`.
- `doctor` reports no blocking finding. Its single attention row predates the
  work, was left untouched, and is disclosed in S-031's Remaining Limitations.
- All seven root controls exist as filled ordinary files with no `[BRACKETED]`
  placeholder.
- Nothing was silently lost. `adoption-recovery.json` records all three moves;
  `CONTRACT.md`, `SPEC_DIARY.md`, and `tools/protected-checkouts.json` were each
  explicitly classified as project-owned and kept, with the Lexicon recording the
  distinction - which is the port/fold/keep/retire discipline ADOPTION.md asks
  for.
- The consequential decision was disclosed against self-interest. Retiring the
  fork makes CIC's own room report `unavailable` on its own dashboard, and S-031
  states that in plain language with two named paths back rather than hiding it
  behind a fallback.

## Meta-Caused Risk Patterns

1. **Version transitions are the weakest seam in the harness.** F-001, F-002 and
   F-003 share one mechanism: steady-state controls are strong, transition
   controls are not. First-join is documented; layout-generation change on an
   already-adopted room is not; the skill that should cover it is a generation
   behind the layout it must produce. Leading indicator: any room whose
   `provenance.lifecycle` does not match its own adoption history.
2. **Reconciliation is unverified by construction.** F-005. Adoption and upgrade
   both require hand-reconciling long control documents, and no check compares
   the result with its source. Leading indicator: adopted controls stricter or
   looser than the template in ways no record explains.
3. **The feedback lane is installed but never harvested.** F-004. The lane, the
   format file, and the ownership row all exist; no completion checklist asks
   whether a row is owed. Leading indicator: a feedback log whose newest row
   predates the room's most recent harness change.

## Next Action And Open Questions

No repair is performed by this report and none is authorized by it.

Open gate on the reviewed work, owned by the target's owner: PR #35 is open with
no review. The next executable action is a separate-context review of `a34c34a`
against CIC's controls and S-031, then the merge into `Integration` and the
containment check that Branch Completion requires.

Proposals awaiting owner authorization in this repository, each separable:
F-001 (name the transition lifecycle), F-002 (rewrite `update-harness` for
v3.1.1), F-003 (single provenance record), F-004 (feedback harvest as a
completion condition), F-005a (control-fidelity diff check). Target-local
repairs F-005b and F-006 belong to CIC's owner.

Companion record: the four reusable frictions (F-001 through F-004) are proposed
as append-only rows in the target's own
`workbench/feedback/WORKBENCH_FEEDBACK.md`, which is the declared owner for
friction returned to this harness. F-005 and F-006 are project-local and are not
proposed for that log.

Open question for the owner, raised by the reason this report was requested:
these three reports now sit in one lane with no index. If the intent is
longitudinal reporting on how rooms accept successive harness versions, the
missing piece is a per-room adoption record that can be read mechanically -
version, lifecycle, source commit, date, outcome - which F-003 currently
prevents the manifest from supplying.

## Review Boundary

This is a read-only Grounding report produced without an assigned spec, at owner
request. It carries no independent PASS and grants no repair, merge, or release
authority. Its consequential claims - especially the F-003 mechanism and the
F-005 divergence - should be challenged against the fixed sources cited before
any of them is accepted as Canon.

The reviewing context did not perform the reviewed work and holds no memory of
it. Where this report describes difficulty or intent, it is reading artifacts,
not recalling a session. A reviewer with the original transcript may correct any
such inference, and should.

Improvement is not claimed. Whether these proposals reduce real friction is a
question for later real-use evidence assessed by an independent evaluator, not
for this report and not for a passing regression test.
