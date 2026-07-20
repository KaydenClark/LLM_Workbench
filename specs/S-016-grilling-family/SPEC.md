# S-016 - Grilling-Family Capability

> Generated from LLM Workbench v2.3. Stable path
> `specs/S-016-grilling-family/SPEC.md`; never move between status folders.

**Spec ID:** S-016
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Catalog description:** Give the grilling-family skills (grilling primitive, grill-me, make-it-so, brainstorm, checkpoint) a dedicated capability spec that owns their split, notepad contract, and family behavior tests.
**Updated:** 2026-07-20
**Blockers:** Proposal awaiting owner authorization; the grilling-family contract is currently only implied by S-011's catalog-count acceptance.
**Latest event:** S-011's 2026-07-17 grilling-family redesign flagged that a dedicated spec should own the grilling-family contract instead of S-011's skills-adoption record.
**Next gate:** Owner authorizes activating this spec and assigns a durable writer to claim TK-001.

## Outcome

The grilling family of skills has one durable capability spec that owns its
members, their responsibilities, the running-notepad contract, and the behavior
tests that keep them a coherent family: `grilling` (question-at-a-time interview
primitive that keeps a running notepad), `grill-me` (the question-first entry
wrapper), `make-it-so` (explicit-invoke promoter that turns the settled notepad
or current conversation into canon and implements it), `brainstorm` (grilling
with a counter-argument lens), and `checkpoint` (save an in-progress notepad as
a resumable, committed handoff). S-011 retains skills-adoption history but no
longer implicitly owns this contract.

## Why It Matters

The grilling family was designed and rewritten under S-011 (Agent Skills
Adoption), whose real capability is importing and rewriting the harness skill
catalog. S-011's only guard on the family today is a catalog-count acceptance,
so the family's split, notepad lifecycle, and cross-skill routing have no
capability record or behavior contract of their own. S-011's 2026-07-17 evidence
explicitly noted "a dedicated grilling-family spec could later own this
contract." Extracting it gives the family durable acceptance criteria and a
test seam that fails when a member drifts, without bloating the skills-adoption
spec.

## Current Verified State

- `skills/README.md` lists the five family members as Active: `grilling` and
  `grill-me` (Core rewrite), and native `make-it-so`, `brainstorm`, and
  `checkpoint`.
- The physical skill folders exist under `skills/`: `grilling`, `grill-me`,
  `make-it-so`, `brainstorm`, and `checkpoint`.
- `tools/test-skill-catalog.mjs` currently enforces the overall catalog count
  and active/pending parity; it does not assert the grilling family's internal
  behavior contract (notepad ownership, promotion routing, counter-argument
  lens, checkpoint resumability).
- The running notepad lives in gitignored `.agents/grilling diary/`, per S-011's
  2026-07-17 redesign evidence.
- This spec is a proposal: no skill file, catalog test, or router entry has been
  changed for it.

## Desired Behavior

- One spec owns the grilling-family definition, member responsibilities, and the
  notepad lifecycle (created by `grilling`, promoted by `make-it-so`, saved and
  resumed by `checkpoint`).
- `grilling` stays a question-at-a-time interview primitive that keeps a running
  notepad and takes no promoting action on its own.
- `grill-me` remains a thin, runtime-agnostic question-first entry wrapper and
  creates no durable artifact of its own.
- `make-it-so` stays explicit-invoke only, promotes the matching notepad (else
  the current conversation) through `to-docs`, `to-spec`, and `to-tickets`, then
  implements with every checkpoint pushed to the remote; it never fires from the
  phrase said in passing.
- `brainstorm` runs the grilling interview with a counter-argument lens so every
  recommendation is weighed against its strongest opposing case.
- `checkpoint` saves an in-progress notepad as a committed, resumable handoff
  across workstations or agents and is the "stop but not done" counterpart to
  `make-it-so`.
- A behavior test asserts the family membership and routing so a drifting or
  missing member fails closed.

## Decisions And Contracts

- This spec owns the grilling-family capability and behavior contract; S-011
  keeps its skills-adoption history and stops being the implicit owner once this
  spec activates.
- The notepad is the single grilling artifact; the family creates no parallel
  tracker, ADR, PRD, or glossary layer, and routes settled truth only through
  the existing `to-docs`/`to-spec`/`to-tickets` owners.
- Grilling ends only on Kayden's exact `make it so` passphrase; `make-it-so` is
  never triggered by the phrase appearing in ordinary conversation.
- The family is behavior-tested, not just counted: the catalog test asserts the
  five members exist, are active, and route as a family.
- One durable writer owns the family's skill files and this spec's evidence at a
  time; independent review is a separate role.

## Non-Goals

- Adding new grilling-family members or a marketplace/plugin distribution path.
- Rewriting the `to-docs`/`to-spec`/`to-tickets`/`implement` delivery skills,
  which keep their own owners.
- Changing where the notepad is stored or committing the gitignored diary.
- Finishing S-011's remaining pending-skill rewrites or its Claude discovery
  gate.

## Dependencies And Blockers

- Shares `tools/test-skill-catalog.mjs` and `skills/README.md` with S-011; edits
  must use a single durable writer lane to avoid clobbering S-011 work.
- Downstream promotion routing depends on the existing `to-docs`, `to-spec`, and
  `to-tickets` skills remaining active.
- Blocked as a proposal until the owner authorizes activation.

## Vertical Implementation Slices

Tickets are temporary tracer bullets within this stable capability record.

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Add a grilling-family behavior contract to the catalog test and hand family ownership from S-011 to this spec | ready | none | pending |

### Scoped Ticket: TK-001

**Vertical slice:** Add one grilling-family behavior assertion to
`tools/test-skill-catalog.mjs` that fails when any of `grilling`, `grill-me`,
`make-it-so`, `brainstorm`, or `checkpoint` is missing, inactive, or no longer
routes as a family, then record the family-ownership handoff from S-011 to this
spec. Change no delivery skill and add no parallel context store.

**Done criteria:**

- The catalog test first fails red when a family member is removed or its family
  routing is broken, then passes green with the five members active and routing
  through the notepad and the existing promotion owners.
- `skills/README.md` and the router still list the five members as active with
  their current responsibilities; no member is renamed or duplicated.
- S-011 records the family-ownership handoff (append-only) and this spec owns
  the family contract going forward; no completed S-011 evidence is rewritten.
- The targeted catalog test and the full RUNBOOK suite pass; `render`, `doctor`,
  and `git diff --check` are green.

**Verification:**

```bash
node tools/test-skill-catalog.mjs
node tools/spec-workbench.mjs render
node tools/spec-workbench.mjs doctor
git diff --check
```

## Acceptance Criteria

- [ ] One spec owns the grilling-family members, responsibilities, and notepad
      lifecycle; S-011 no longer implicitly owns the contract.
- [ ] `tools/test-skill-catalog.mjs` asserts the five family members exist, are
      active, and route as a family, failing closed on drift.
- [ ] `grilling` keeps the notepad, `grill-me` stays a thin entry, `make-it-so`
      is explicit-invoke promotion only, `brainstorm` applies the
      counter-argument lens, and `checkpoint` saves a resumable handoff.
- [ ] The family creates no parallel tracker, ADR, PRD, or glossary layer and
      routes settled truth only through existing owners.
- [ ] The full RUNBOOK suite, render, doctor, and `git diff --check` pass.

## Testing Seams

- Static: catalog membership, active status, and family-routing assertions in
  `tools/test-skill-catalog.mjs`; `skills/README.md` parity.
- Behavior: notepad ownership by `grilling`, promotion routing by `make-it-so`,
  counter-argument lens by `brainstorm`, and resumable save by `checkpoint`.
- Runtime: fresh-session discovery of the five members remains an owner-checkable
  manual gate shared with S-011/TK-003.

## Verification Procedure

```bash
node tools/test-skill-catalog.mjs
node tools/spec-workbench.mjs render
node tools/spec-workbench.mjs doctor
git diff --check
```

## Documentation Impact

- This spec owns the grilling-family capability, decisions, and proof.
- `skills/README.md` owns the member list, responsibilities, and rewrite lanes.
- S-011 keeps skills-adoption history and records the ownership handoff without
  rewriting completed evidence.
- Generated `BLUEPRINT.md` and `TASKBOARD.md` project catalog and active state.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-20 | plan | Proposed S-016 to own the grilling-family capability (grilling, grill-me, make-it-so, brainstorm, checkpoint) and its notepad and behavior contract, promoting the family out of S-011's implicit catalog-count ownership as S-011's 2026-07-17 evidence anticipated. Captured a single behavior-contract tracer bullet; no skill file, catalog test, or router entry was changed. | Read `skills/README.md` family rows and confirmed the five `skills/` folders exist; `node tools/spec-workbench.mjs render` and `doctor` passed with S-016 in the Blueprint catalog and out of the hot board while planned | Added S-016; rendered the generated Blueprint catalog and Taskboard | Owner authorizes activation and assigns a durable writer to claim TK-001; the S-011 handoff row is written when TK-001 lands |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- This is a proposal (`planned`); no behavior test or ownership handoff has been
  implemented.
- Fresh-session discovery of the family remains an owner-checkable gate shared
  with S-011/TK-003.

## Supersession

- Supersedes: none
- Superseded by: none
- Related: S-011 (Agent Skills Adoption) originated and rewrote the family; this
  spec takes over the family capability contract on activation.
