# S-00N - Feedback Finding Dispositions

**Spec ID:** S-00N
**Status:** planned
**Priority:** 3
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-15
**Catalog description:** Require every feedback finding to resolve into one of five named dispositions recorded in its owning Spec, and ratchet the registry so no future diagnostic lands without remediation text.
**Blockers:** none
**Latest event:** Spec authored at owner acceptance of ADR-000K, which had no delivery owner.
**Next gate:** Activate this Spec, then claim TK-001 or TK-002; `claim`
refuses a Spec that is still `planned`.

> **Citation anchors.** pre=`87c1d45cd6c32ceea12e05590eae966c0d6d4ecf` post=`87c1d45cd6c32ceea12e05590eae966c0d6d4ecf`.

## Outcome

A feedback finding cannot be recorded, acknowledged and then left in no state at
all. Each one resolves to exactly one disposition from a closed vocabulary —
`diagnostic`, `test`, `repaired`, `declined`, `accepted-open` — recorded in its
owning Spec, and the report format requires the field.

## Why It Matters

The feedback lane currently accepts a finding, describes its smallest bounded
next action, and stops. Nothing requires the finding to resolve into a named
class of outcome, so a real finding can sit acknowledged and undispositioned
indefinitely, which is the state most findings in `workbench/feedback/` are in
now. A lane that collects findings without dispositioning them is ceremony.

The closed vocabulary is what makes the requirement honest rather than
bureaucratic. A three-class set with no `accepted-open` would force a real,
accepted, unscheduled finding into `declined`, making the record assert
something false; a set with no `repaired` would leave a finding fixed by a
direct code, configuration or documentation change with no true home. A
vocabulary that cannot name the ordinary case gets bypassed in the ordinary
case.

## Current Verified State

At the pre anchor, `workbench/feedback/REPORT_FORMAT.md`, mirrored at
`templates/feedback/REPORT_FORMAT.md`, requires each finding to carry an ID,
severity, location, claim, reproduced effect and "the smallest bounded next
action", and requires Next Action to point at an existing spec or state that a
repair awaits authorization. Neither copy contains the word `disposition`.

`LEXICON.md`'s Feedback row already states that "an authorized repair and its
disposition belong in the owning Spec", so placement is settled; what is absent
is any requirement that a disposition exist, and any closed set to draw it from.

`tools/test-diagnostics.mjs` asserts a non-empty summary for the two
`git`-scope codes specifically, not across the registry. Every registered code
does currently carry remediation text, so the ratchet this Spec adds will pass
the day it lands.

## Desired Behavior

An agent writing a feedback report states each finding's disposition from the
closed set, and cannot omit it without the report being incomplete against its
own format. An agent reading the owning Spec learns what became of a finding it
is answerable for. A future contributor adding a diagnostic code without
remediation text fails the suite.

## Decisions And Contracts

- The closed five-class vocabulary, the required field, and why `repaired` and
  `accepted-open` exist:
  [ADR-000K](../../docs/adr/000K-every-feedback-finding-carries-one-of-four-dispositions.md).
- That a repair and its disposition belong in the owning Spec, which this makes
  required rather than merely permitted: `LEXICON.md`'s Feedback row.
- Registered blocking semantics, which the remediation ratchet asserts across
  the whole registry:
  [ADR-0029](../../docs/adr/0029-diagnostics-carry-registered-blocking-semantics.md).
- The dogfood boundary both `REPORT_FORMAT.md` copies must respect:
  `AGENTS.md`.

## Non-Goals

- **Retroactively dispositioning the existing lane.** TK-004 dispositions the
  findings currently in `workbench/feedback/`, but assigning `accepted-open` to
  a finding does not schedule it, and this Spec creates no work item for any of
  them.
- **Claiming the ratchet repairs anything.** All currently registered codes
  already carry remediation text. The test is a guard against future additions
  and is recorded that way so nobody later reads a green result as evidence it
  fixed something.
- Changing what severities or evidence states a report uses.
- Any change to who authorizes a repair.

## Dependencies And Blockers

None. TK-003's template edit must keep `templates/feedback/REPORT_FORMAT.md`
generic and `[BRACKETED]` while the root copy stays filled, per the `AGENTS.md`
dogfood boundary.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Define the closed disposition vocabulary in `LEXICON.md` | ready | none | Lexicon carries the five classes and what each asserts; `tools/test-control-fidelity.mjs` and the full suite pass |
| TK-002 | Ratchet the registry so every diagnostic carries remediation text | ready | none | Red test proving a registry entry with empty remediation fails, run against a temporarily emptied entry; green assertion across the whole registry; the real registry passes unchanged |
| TK-003 | Require the disposition field in both `REPORT_FORMAT.md` copies | blocked | TK-001 | Root copy filled and template copy generic and `[BRACKETED]`; `tools/test-guardrail-audit.mjs` and `node tools/evaluate-workbench.mjs --path templates --include-controls` pass |
| TK-004 | Disposition the findings already in the feedback lane | blocked | TK-003 | Every existing report's findings carry a disposition from the closed set, with `accepted-open` naming the owning Spec; no finding scheduled by this slice |

### TK-001 - Define the closed disposition vocabulary in `LEXICON.md`

**Stance:** Builder

One Core Term naming the five classes and what each asserts, beside the
existing Feedback responsibility row that already places a disposition in the
owning Spec. The Lexicon owns the meaning; the report format owns the
requirement to supply one.

### TK-002 - Ratchet the registry so every diagnostic carries remediation text

**Stance:** Builder

Replace the two-code spot check with an assertion across the whole registry.
Prove the test is real by emptying one entry's remediation text, watching it
fail, and restoring it — a test that has never failed is not evidence. Record
in the evidence row that the real registry passed unchanged, because it did,
and that this is a ratchet rather than a repair.

### TK-003 - Require the disposition field in both `REPORT_FORMAT.md` copies

**Stance:** Builder

The Findings section gains the disposition as a required field drawn from the
closed set. Both copies change together and diverge only as the dogfood
boundary requires: the root copy states the project's actual practice, the
template copy ships the generic shape.

### TK-004 - Disposition the findings already in the feedback lane

**Stance:** Builder

Read each existing report's findings and record the disposition each has
actually reached. Most will be `accepted-open` and must name the Spec that
holds them. Where no Spec holds one, `accepted-open` is still the honest
answer and the missing owner is reported as a gap — this slice dispositions
findings, it does not create Specs for them.

## Acceptance Criteria

- [ ] `LEXICON.md` defines the five dispositions as a closed set.
- [ ] Both `REPORT_FORMAT.md` copies require a disposition on every finding.
- [ ] `templates/feedback/REPORT_FORMAT.md` stays generic and `[BRACKETED]`;
      the root copy stays filled.
- [ ] A registry entry with empty remediation text fails the suite, proven by
      temporarily emptying one and observing the failure.
- [ ] The real registry passes that assertion unchanged, and the evidence row
      says so rather than presenting the green as a repair.
- [ ] Every finding already in `workbench/feedback/` carries a disposition, and
      each `accepted-open` names its owning Spec or reports the missing owner.
- [ ] The full verification suite passes and `doctor` carries no blocking
      finding.

## Testing Seams

The `diagnostics.mjs` registry as exercised by `tools/test-diagnostics.mjs`;
the template guardrail path covered by `tools/test-guardrail-audit.mjs` and
`node tools/evaluate-workbench.mjs --path templates --include-controls`;
`tools/test-control-fidelity.mjs` for the Lexicon edit.

## Verification Procedure

Run the targeted test for the touched seam, then the full verification suite
named in `AGENTS.md`, then
`node workbench/tools/spec-workbench.mjs doctor`.

## Documentation Impact

`LEXICON.md` at TK-001 and both `REPORT_FORMAT.md` copies at TK-003.
`RUNBOOK.md` gains the required field in its feedback reporting procedure at
TK-003, not before: documenting a required field ahead of the format that
requires it sends an agent looking for a rule that does not yet exist.
ADR-000K's `canonicalized_in` already names this Spec as of its acceptance.

## Append-Only Evidence And Execution Log

| Date | Commit | Claim | Method | Result |
|---|---|---|---|---|
| 2026-09-15 | 87c1d45 | Spec authored at owner acceptance of ADR-000K, which recorded that no Spec owned its implementation | Read ADR-000K against both `REPORT_FORMAT.md` copies, `LEXICON.md`'s Feedback row and `tools/test-diagnostics.mjs` at the pre anchor | Confirmed neither report format mentions a disposition, that the Lexicon already places one in the owning Spec, and that the diagnostics test checks a summary for two `git`-scope codes rather than the registry; no implementation performed |
| 2026-09-15 | 8a32f41 | Separate-context review of the acceptance candidate | Reviewer read this Spec against `tools/test-diagnostics.mjs`, `diagnostics.mjs` `PINNED_EFFECTS`, both `REPORT_FORMAT.md` copies and `blockersSatisfied` in `spec-workbench.mjs` | PASS with four should-fix findings. Two applied here: TK-002 was `blocked` with blockers `none`, which no tool catches and which would have withheld it from selection indefinitely, and `Next gate` named a `claim` the tooling refuses for a `planned` Spec. Reviewer confirmed the Current Verified State claims about the two-code summary check and the absent disposition field are accurate |

## Completion Result

Not started.

## Remaining Limitations Or Follow-Up Specs

ADR-000K's title and body name five dispositions; its filename, allocated when
the set had four, still reads `four-dispositions`. ADR paths are stable once
declared, so the filename is left as written and the register and history
project the correct title. A reader arriving by filename alone sees a stale
count.

Requiring a disposition does not make one true. Nothing here checks that a
finding marked `repaired` was actually repaired, or that an `accepted-open`
Spec ever schedules it; both remain review judgment.

## Supersession

None.
