# S-041 - Recorded Baseline Availability

**Spec ID:** S-041
**Status:** active
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-06
**Catalog description:** Decide and record what a harness-only migration does when the target has no runnable green baseline, so eight rooms blocked by an unrelated product or host condition get one answer instead of eight improvised ones.
**Blockers:** none
**Latest event:** Owner selected Option A (record and proceed) on 2026-09-06; TK-001 is unblocked and ready.
**Next gate:** Claim TK-001 and prove red that a spec recording an unavailable baseline with a valid reason proceeds while a red baseline still stops.

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

Eight rooms stopped here. Their causes were a missing npm dependency, an
unreadable sibling remote, a Vite config load failure, a `spawn EPERM` from a
restricted runner in five reports across the set, and pre-existing
`render-drift` in two legacy v2.x projections. Three further rooms declined to
run a baseline at all, because doing so would have written into a reviewed
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

## Desired Behavior

The owner selected **Option A - record and proceed** on 2026-09-06. Option B
(declare such a room out of scope for migration) was considered and declined
because it would leave eight rooms permanently unmigratable for reasons the
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
| TK-001 | Write the Option A contract into `templates/ADOPTION.md`, `skills/update-harness/SKILL.md`, and the spec record shape, with a fixture proving the recorded state is honored, the vocabulary is closed, and a red baseline still stops | ready | none | pending |

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
- [ ] `templates/ADOPTION.md` Phase 0 and its completion boxes state the chosen
      contract, including what a room does when no baseline can be taken.
- [ ] `skills/update-harness/SKILL.md` section 2 and its completion criterion
      agree with `templates/ADOPTION.md`.
- [ ] The recorded-unavailable path is proved by test, a reason outside the
      closed vocabulary is refused, and a red baseline still stops without owner
      expansion.
- [ ] `node tools/evaluate-workbench.mjs --path templates --include-controls`
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
| 2026-09-06 | spec | Spec captured from upstream UP-017; both options specified so the owner selects rather than designs | Read `templates/ADOPTION.md:81-99,265,286,318` and `skills/update-harness/SKILL.md:42-60,156,198`; confirmed only green and red states exist | Blueprint catalog regenerated by render | Owner gate open; TK-001 blocked on it |
| 2026-09-06 | TK-001 | Owner answered the contract question: **Option A, record and proceed** | Owner decision recorded in chat and written into Decisions And Contracts and Desired Behavior; no code ran and no verification is claimed for it | Desired Behavior collapsed to the selected option; Option B recorded as considered and declined with its reason | TK-001 unblocked and ready; nothing implemented yet |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- The eight rooms that stopped are not retried by this spec; the contract is
  what unblocks them, and their retries belong to their own owners.
- Option A trades a strong guarantee for a recorded one. The closed vocabulary
  bounds that trade but does not eliminate it: a room can still record
  `product-broken-as-found` for a condition a more patient operator would have
  fixed. The record makes that visible to a later reviewer rather than
  preventing it.

## Supersession

- Supersedes: none
- Superseded by: none
