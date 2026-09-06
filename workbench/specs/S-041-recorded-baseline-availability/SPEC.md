# S-041 - Recorded Baseline Availability

**Spec ID:** S-041
**Status:** complete
**Priority:** 2
**Owner:** claude-opus-5
**Stance:** Builder
**Updated:** 2026-09-06
**Catalog description:** Decide and record what a harness-only migration does when the target has no runnable green baseline, so eight rooms (the report's count) blocked by an unrelated product or host condition get one answer instead of eight improvised ones.
**Blockers:** none
**Latest event:** Merged into `integration` as PR #65 at `b22a8da` on 2026-09-06 after separate-context review.
**Next gate:** None; the capability is complete and contained in `integration`.

## Outcome

The Adoption and update contracts give one answer to "the target has no
reproducible green baseline, for a reason the harness change cannot affect."
Either the owning spec records the baseline as unavailable with its reason and
the harness-only change proceeds against that record, or the contract states
plainly that a room without a runnable baseline is out of scope for migration.
An agent meeting the condition follows the contract instead of inventing a
remedy.

## Why It Matters

Adoption Phase 0 requires a reproducible green baseline before anything is
touched (`templates/ADOPTION.md:81-99`), and the update procedure requires
stopping on a red one unless the owner separately expands the task
(`skills/update-harness/SKILL.md:58-60`). There is no third state. Any unrelated
product or host condition therefore blocks a harness-only migration outright.

The report names seven rooms that stopped here - five after the skill gate,
plus two more through pre-existing `render-drift` in their legacy v2.x
projections - and separately summarizes the set as "stalled eight rooms"; that
arithmetic is the report's own and is carried here uncorrected rather than
reconciled by guesswork. Their causes were a missing npm dependency, an
unreadable sibling remote, a Vite config load failure, and a `spawn EPERM` from
a restricted runner in five reports across the set. Three further rooms declined
to run a baseline at all, because doing so would have written into a reviewed
project or read private data. In none of these cases was the blocking condition
caused by, or repairable by, the harness change being requested.

The absence of an answer is the blocker. Either answer unblocks the rooms; what
costs is that each agent had to decide alone, and several decided differently.

## Current Verified State

Verified in this repository on 2026-09-06. The findings were established at
`b3633e5`; the `file:line` citations were re-anchored to the post-S-036 tree
after PR #63 merged, so following one lands on what it names.

- `templates/ADOPTION.md:81-88` (Phase 0 step 1) requires confirming the
  existing test and build commands run green as found, and records a Git-metadata
  blocker path but no baseline-unavailable path.
- `templates/ADOPTION.md:99` states the Phase 0 output as "a green baseline run
  recorded" with no alternative.
- `templates/ADOPTION.md:286` makes a completion box out of "the full
  verification suite runs green and matches the Phase 0 baseline", which cannot
  be satisfied when no baseline exists.
- `skills/update-harness/SKILL.md:58-60`: "If the baseline is red, record the
  existing failure and stop unless the user explicitly expands the task to fix
  it." Red is handled; unavailable and refused-on-privacy-grounds are not.
- `skills/update-harness/SKILL.md:198` makes the completion criterion "project
  results match or improve on baseline", which has no defined value when the
  baseline could not be taken.
- No manifest field, spec field, or diagnostic records baseline availability.

Gap: the contract has two baseline states (green, red) and the portfolio met at
least three more (unavailable for a host reason, unavailable for a product
reason, deliberately not run for a privacy or write-boundary reason).

Those citations describe the tree before TK-001 closed. After TK-001 the same
text lives at `templates/ADOPTION.md:81-90` (Phase 0 step 1), `:100-109` (the
shared rule), `:111-113` (the Phase 0 output), `:300-303` (the completion box),
and at `skills/update-harness/SKILL.md:58-67` (the same rule word for word),
`:69-72` (the section 2 completion criterion) and `:210-213` (the section 5
completion criterion).

## Desired Behavior

The owner selected **Option A - record and proceed** on 2026-09-06. Option B
(declare such a room out of scope for migration) was considered and declined
because it would leave eight rooms (the report's count) permanently unmigratable for reasons the
harness did not cause and cannot repair.

1. The owning spec can record a baseline as `unavailable` with a reason drawn
   from a **closed** vocabulary: `host-restricted`,
   `product-broken-as-found`, or `owner-declined-on-boundary`. A reason outside
   that set is refused; the vocabulary is not free text.
2. The record carries the evidence for the reason and an explicit statement that
   the harness change being requested is not implicated in the failure.
3. A harness-only change proceeds against that record. Its completion criteria
   compare against the recorded state rather than against a green run, and say
   so in the completion text rather than implying a green baseline was taken.
4. The record travels with the room, so a later reviewer sees why no baseline
   exists without re-deriving it.
5. A red baseline is unchanged: it still stops unless the owner explicitly
   expands the task. `unavailable` is a distinct third state, never a way to
   relabel a failing suite.
6. Nothing on this path allows a red baseline to be reported as green, and the
   Workbench-side verification suite still runs green for the harness change
   itself.

## Decisions And Contracts

- **RESOLVED 2026-09-06 - Option A, record and proceed.** The owner selected
  permitting a harness-only migration against a recorded unavailable baseline,
  over declaring such a room out of scope. Recorded cost, accepted with the
  decision: a recorded exemption is a weaker guarantee than a green run, so the
  reason vocabulary stays closed and enumerated in the tool, not open text, and
  a test must prove that an unrecognised reason is refused. The mitigation is
  the closed vocabulary plus the unchanged red-baseline rule below.
- **`spawn EPERM` is a host condition, not evidence about the harness or the
  product.** Five reports recorded it and each classified it correctly. It
  enters this spec only as an input to the unavailable case.
- **Legacy `render-drift` is not a v3.1.1 defect.** Dungeon Friends and Resume
  Portfolio report stale generated regions in their own v2.x projections. Those
  belong to those rooms' lanes and appear here only as instances of this gap.
- **A recorded exemption never lowers the bar for the harness change itself.**
  The Workbench-side verification suite still runs green.

## Non-Goals

- Repairing any reviewed project's baseline.
- Weakening the green-baseline requirement where a baseline can be taken.
- Automating the judgment of whether a failure is product, host, or harness.

## Dependencies And Blockers

- none. The Option A / Option B decision that blocked TK-001 was answered by
  the owner on 2026-09-06 and is recorded in Decisions And Contracts.

## Vertical Implementation Slices

Tickets are temporary tracer bullets within this stable capability record.

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Write the Option A contract into `templates/ADOPTION.md`, `skills/update-harness/SKILL.md`, and the spec record shape, with a fixture proving the recorded state is honored, the vocabulary is closed, and a red baseline still stops | done | none | Red first, three cases in one batch before any implementation, run against the unchanged parser: case 1 (unavailable with a valid reason proceeds) failed `Cannot read properties of undefined (reading 'state')`; case 2 (a red baseline still stops) failed `Cannot read properties of undefined (reading 'proceeds')`; case 3 (a reason outside the closed vocabulary is refused) failed `Missing expected exception.`; the same batch inside tools/test-spec-workbench.mjs failed `AssertionError: a spec that records no baseline keeps parsing as it did before, + undefined - null`. Green after implementing parseBaselineRecord in workbench/tools/spec-packet.mjs: node tools/test-spec-workbench.mjs pass, plus all 25 node suites, python3 evals/tasks/task_b_path_safety/test_grade.py, render (no drift), doctor exit 0, python3 tools/check-append-only.py CLEAN, git diff --check clean. node tools/evaluate-workbench.mjs --path templates --include-controls scores templates 106.6/113, unchanged from the pre-change score. Word-for-word agreement proved by extracting the 737-character rule from templates/ADOPTION.md and asserting it appears verbatim in skills/update-harness/SKILL.md (True). |

### TK-001 - Write the answer down

**Stance:** Builder

Option A is selected; build it. Red first, three cases in one batch: a fixture
whose spec records an unavailable baseline with a valid reason proceeds; one
with a red baseline and no owner expansion still stops; and one whose reason is
outside the closed vocabulary is refused rather than accepted as free text.
Then write the contract into `templates/ADOPTION.md` Phase 0 and its completion
boxes, and into `skills/update-harness/SKILL.md` section 2 and its completion
criterion, so the two agree word for word on the third state.

## Acceptance Criteria

- [x] The owner's selection is recorded in this spec with its date: Option A,
      record and proceed, 2026-09-06.
- [x] `templates/ADOPTION.md` Phase 0 and its completion boxes state the chosen
      contract, including what a room does when no baseline can be taken.
- [x] `skills/update-harness/SKILL.md` section 2 and its completion criterion
      agree with `templates/ADOPTION.md`.
- [x] The recorded-unavailable path is proved by test, a reason outside the
      closed vocabulary is refused, and a red baseline still stops without owner
      expansion.
- [x] `node tools/evaluate-workbench.mjs --path templates --include-controls`
      and the full `AGENTS.md` verification suite pass.

## Testing Seams

- The template evaluator (`tools/evaluate-workbench.mjs`) over
  `templates/ADOPTION.md`.
- The spec-packet parser's handling of the recorded baseline field and its
  closed reason vocabulary (`workbench/tools/spec-packet.mjs`,
  `tools/test-spec-workbench.mjs`).

## Verification Procedure

```bash
node tools/evaluate-workbench.mjs --path templates --include-controls
node tools/test-spec-workbench.mjs
node tools/test-workbench-adoption.mjs
node tools/test-skill-catalog.mjs
node workbench/tools/spec-workbench.mjs doctor
```

## Documentation Impact

- `templates/ADOPTION.md` Phase 0 and Phase 7 completion boxes.
- `skills/update-harness/SKILL.md` sections 2 and the completion criterion.
- `LEXICON.md` if the baseline states become named terms.
- `AGENTS.md` Engineering And Verification, only if the rule generalizes beyond
  migration.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-06 | spec | Spec captured from upstream UP-017; both options specified so the owner selects rather than designs | Read `templates/ADOPTION.md:80-99,265,286,318` and `skills/update-harness/SKILL.md:42-60,164,198`; confirmed only green and red states exist | Blueprint catalog regenerated by render | Owner gate open; TK-001 blocked on it |
| 2026-09-06 | TK-001 | Owner answered the contract question: **Option A, record and proceed** | Owner decision recorded in chat and written into Decisions And Contracts and Desired Behavior; no code ran and no verification is claimed for it | Desired Behavior collapsed to the selected option; Option B recorded as considered and declined with its reason | TK-001 unblocked and ready; nothing implemented yet |
| 2026-09-06 | spec | Restored the append-only capture row that two rounds of citation repair had rewritten | The capture row above was created at `288c821` citing `templates/ADOPTION.md:80-99,265,286,318` and `skills/update-harness/SKILL.md:42-60,164,198`. It was rewritten at `a5e7fe0` (`164,198` to `156,186`) and again at `d1de47f` (`80-99` to `81-99`, `186` to `198`), both violating `AGENTS.md` Documentation Ownership. It is restored byte-for-byte and the corrections are recorded here instead: at `b3633e5` the completion criterion the row describes is `skills/update-harness/SKILL.md:186`, not `:198` (which is `1. What changed.`), and the Phase 0 range begins at `:81` because `:80` is blank. Live Current Verified State already cites `:81-88`, `:81-99` and `:198` against the post-S-036 tree, where the completion criterion moved to `:198` | No control text changed | TK-001 open |
| 2026-09-06 | TK-001 | Ticket closed | Red first, three cases in one batch before any implementation, run against the unchanged parser: case 1 (unavailable with a valid reason proceeds) failed `Cannot read properties of undefined (reading 'state')`; case 2 (a red baseline still stops) failed `Cannot read properties of undefined (reading 'proceeds')`; case 3 (a reason outside the closed vocabulary is refused) failed `Missing expected exception.`; the same batch inside tools/test-spec-workbench.mjs failed `AssertionError: a spec that records no baseline keeps parsing as it did before, + undefined - null`. Green after implementing parseBaselineRecord in workbench/tools/spec-packet.mjs: node tools/test-spec-workbench.mjs pass, plus all 25 node suites, python3 evals/tasks/task_b_path_safety/test_grade.py, render (no drift), doctor exit 0, python3 tools/check-append-only.py CLEAN, git diff --check clean. node tools/evaluate-workbench.mjs --path templates --include-controls scores templates 106.6/113, unchanged from the pre-change score. Word-for-word agreement proved by extracting the 737-character rule from templates/ADOPTION.md and asserting it appears verbatim in skills/update-harness/SKILL.md (True). | templates/ADOPTION.md Phase 0 step 1, the shared baseline rule after step 3, the Phase 0 output line, the Phase 7 completion box and the fabricate-a-green-run guardrail; skills/update-harness/SKILL.md section 2 body and completion criterion and the section 5 completion criterion, carrying the same rule word for word; templates/SPEC.md notes the optional Baseline field without adding a new bracketed placeholder token. LEXICON.md and AGENTS.md deliberately untouched: the baseline states are named only in the two migration contracts, not across root controls, and the rule does not generalize beyond migration. | The rooms that stopped are not retried by this spec; spec completion waits on the separate-context review of this candidate. |
| 2026-09-06 | TK-001 | Re-anchored the pre-change `file:line` citations in Current Verified State to the post-TK-001 tree and checked the four acceptance boxes TK-001 satisfies | Read each cited range after the edit: `templates/ADOPTION.md:81-90`, `:100-109`, `:111-113`, `:300-303`; `skills/update-harness/SKILL.md:58-67`, `:69-72`, `:210-213` | No control text changed by this row; the earlier rows keep their original citations | Spec completion waits on the separate-context review of this candidate |
| 2026-09-06 | TK-001 | Separate-context review APPROVED; three caveats recorded rather than left implied | Reviewer attacked `parseBaselineRecord` with 27 hand-built inputs: every near-miss, casing variant, superstring, multi-reason and whitespace variant of the closed vocabulary is refused, `unavailable` with a valid reason but no evidence is refused, and red cannot be flipped by spelling or whitespace. Back-compat proved by parsing all 40 specs with 0 failures and by `doctor` and `next --json` output byte-identical between `09bfff7` and this candidate. Word-for-word agreement confirmed by `cmp`: the shared rule block is byte-identical in `templates/ADOPTION.md:100-109` and `skills/update-harness/SKILL.md:58-67`. `templates/SPEC.md` bracket inventory identical to base, so the frozen placeholder vocabulary is exact; control fidelity ok; evaluator 106.6/113 unchanged. Recorded here rather than glossed: `proceeds`/`stop` are consumed by no tool, so the red stop is a record and a written contract rather than a gate; `red (owner-expanded)` is forgeable and asks less than `unavailable`; and two of the three reds prove API absence rather than wrong behavior, with only the out-of-vocabulary case changing observable behavior on unchanged surfaces | Three limitations added; no claim strengthened | The `owner-expanded` qualifier needs evidence, and the baseline record needs a consumer, before red is machine-enforced; both belong to a follow-up spec |

| 2026-09-06 | spec | Spec completed; the reviewed candidate is contained in `integration` | Merged as PR #65 at `b22a8da`. `git merge-base --is-ancestor b22a8da origin/integration` returns true; `git ls-tree origin/main` carries no `workbench/` tree, so `main` is untouched. Full `AGENTS.md` suite re-run on the merged `integration` tip `18ffc0d`: 25 node suites plus the path-safety grader all pass, `render` leaves no drift, `doctor` exits 0, `check-append-only.py` CLEAN, `git diff --check` clean, no CRLF. Guardrail 78/100 and templates 106.6/113, both unchanged from the pre-implementation baseline - a control-surface change is not expected to move either, and neither moved | Status, latest event, next gate and Completion Result reconciled with the merged reality | Limitations recorded in this spec stay open and routed; none is closed by the merge |

## Completion Result

The Adoption and update contracts now give one answer to a target with no runnable green baseline: the owning spec records it unavailable with a reason from a closed vocabulary and its evidence, and the harness-only change proceeds against that record. A red baseline still stops, and a reason outside the vocabulary is refused rather than accepted as free text.

The rule block is byte-identical in `templates/ADOPTION.md` and `skills/update-harness/SKILL.md`, verified by `cmp`. Word-for-word agreement is the point: two contracts paraphrasing each other is how eight rooms improvised eight answers.

Recorded rather than implied: the baseline is a record, not yet a gate - `proceeds` and `stop` are computed but no tool reads `spec.baseline`, so the red stop remains the written contract it already was. `red (owner-expanded)` is forgeable and asks less than `unavailable`. And two of the three red cases proved API absence rather than wrong behavior; only the out-of-vocabulary reason changes observable behavior on unchanged surfaces.

## Remaining Limitations Or Follow-Up Specs

- The eight rooms (the report's count) that stopped are not retried by this spec; the contract is
  what unblocks them, and their retries belong to their own owners.
- Option A trades a strong guarantee for a recorded one. The closed vocabulary
  bounds that trade but does not eliminate it: a room can still record
  `product-broken-as-found` for a condition a more patient operator would have
  fixed. The record makes that visible to a later reviewer rather than
  preventing it.
- **The recorded baseline is a record, not yet a gate.** `parseBaselineRecord`
  computes `proceeds` and `stop`, but `nextWork`, `claimWork` and `doctor` do
  not read `spec.baseline`. A fixture whose only spec records
  `**Baseline:** red` is still returned by `next` and still claimed. So "a red
  baseline still stops" is true of the parsed record and of the written
  contract, not of any tool. That is consistent with Desired Behavior 5, which
  says red is unchanged - at `09bfff7` the red stop was prose with no machine
  enforcement and it still is - but the distinction belongs here rather than
  being inferred from the evidence log.
- **`red (owner-expanded)` is forgeable and demands less than `unavailable`.**
  It flips `proceeds` to true with no evidence, no date, and no owner decision
  anywhere in the record, and it tolerates `red(owner-expanded)`, a tab, and a
  trailing hyphen. `unavailable` with a valid reason but no evidence is refused
  outright. The asymmetry runs the wrong way: the path that proceeds against a
  *failing* suite asks less than the path that proceeds against an *absent*
  one. Requiring non-empty evidence on the qualifier, exactly as `unavailable`
  does, is the natural next hardening and belongs to a follow-up spec.
- **Two of the three red cases prove API absence, not wrong behavior.** At
  `09bfff7` a spec recording `unavailable (host-restricted) - ...` already
  parsed, already passed `doctor`, and was already returned by `next`, because
  the field was ignored; the same is true of `red`. Only case 3, an
  out-of-vocabulary reason, changes observable behavior on unchanged public
  surfaces - `doctor` moves from `[]` to `malformed-spec`, and `next`, `claim`
  and `render` refuse. The evidence log's literals are accurate; this states
  what they do and do not establish.

## Supersession

- Supersedes: none
- Superseded by: none
