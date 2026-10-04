# S-00G - Ownership Map Root Control

**Spec ID:** S-00G
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-29
**Catalog description:** Deliver the Ownership map as the eighth root file and Core routing artifact, with queryable responsibility routes and coordinated root-surface consumers.
**Blockers:** ADR-000B/C/D acceptance is resolved. The Spec remains planned: the four legacy slices cannot be converted faithfully while the converter refuses a planned Spec with ADR/question blockers. FND-Q24B's undeclared-difference policy is decided (conflict); its field shape and disposition placement remain implementation decisions within the locked guards.
**Latest event:** On 2026-09-29 the owner confirmed Q1 and ACC-1/2/4/5, then explicitly authorized their promotion and the ADR acceptance change. ADR-000B/C/D are active; ADR-0013/0033 are archived. ACC-5 routes completed capability navigation through Wiki feature articles; S-022 is a historical blocked packet and its new article must preserve that limit. No map schema or Task was implemented.
**Next gate:** Faithful conversion of the four legacy slices once the converter supports this planned Spec without inventing Task state, then S-00G implementation and verification. ADR acceptance is no longer a gate.

> **Citation anchors.** pre=`c0ac60a179235ef22fa6ea81aec74735087e06e5` post=`c0ac60a179235ef22fa6ea81aec74735087e06e5`.

## Outcome

The existing title retains its historical identity. In current terminology the
Ownership map is a routing artifact, not a Contract carrier or root control.

The Workbench carries a maintained ownership map at repository root as
`OWNERSHIP.json`, the eighth root file and a Core routing artifact. An agent with an ownership question
resolves it by structured query against that file and receives **routes to the
artifacts that own the answer**, never the answered claims. Every live consumer
that enumerates the root surface knows there are eight files, and the template
ships a copy-ready map so a new room starts with one.

## Why It Matters

Today the Artifact Ownership Schema lives inside `LEXICON.md`, a control every
agent loads whole at ordinary entry. Making that schema exhaustive at the type
level — which is what the approved answer requires — raises entry cost for every
agent, including the majority with no ownership question at all. Query-shaped
access is what makes exhaustive coverage affordable, and a prose table inside a
loaded control cannot provide it.

## Current Verified State

At the pre anchor, no root `.json` control exists in this repository; the root
surface is seven Markdown files. `LEXICON.md` carries the Artifact Ownership
Schema. More than six live consumers enumerate the root surface literally and
none of them knows an eighth file. Verified at review 2026-09-12, beyond the
original six (`workbench/tools/workbench-layout.mjs`, `tools/control-fidelity.mjs`,
`tools/test-workbench-layout.mjs`, `tools/test-control-fidelity.mjs`,
`RUNBOOK.md` two places, `templates/ADOPTION.md` three places): four more code
consumers each declare their own hardcoded seven-item control list
(`tools/test-workbench-upgrade.mjs`, `tools/test-genesis-from-decisions.mjs`,
`tools/test-workbench-adoption.mjs`, `tools/test-portability-matrix.mjs`), and
two more template consumers state the count in prose
(`templates/GENESIS.md` three places, `templates/README.md` one place). This
list is what a targeted search found, not a claim of completeness — the
pattern recurs by hardcoding, not by a shared source, so TK-002's red test
must be a repository-wide sweep for the pattern, not a fixed file list. `templates/` ships no root JSON control,
so a template `OWNERSHIP.json` is new shipped content rather than an edit.
`ADR-0013` still fixes the root surface at seven files and is still `accepted`.

## Desired Behavior

An agent asks an ownership question and receives a route. The query names an
artifact type or a responsibility and returns the owning artifact plus how to
reach it. It never returns the claim text, because a map that answers with
content becomes a second truth store that drifts from the first.

`LEXICON.md` keeps shared language and the Context Map and routes ownership
questions onward instead of answering them. `doctor` reports a missing or
malformed map without inventing authority the map does not carry.

## Decisions And Contracts

- Placement, root-surface count, and the separation of root placement from Core
  and Contract membership: [ADR-000B](../../docs/adr/000B-the-workbench-root-surface-is-eight-files-and-contract-membership-is-separate-from-root-placement.md).
- Contract membership and the three carriers: [ADR-000C](../../docs/adr/000C-the-workbench-contract-is-the-obligation-claim-set-carried-by-three-root-controls-and-the-assigned-spec.md).
- Exhaustive-by-query and the routes-not-claims guardrail: [ADR-000D](../../docs/adr/000D-the-ownership-map-is-an-exhaustive-type-level-framework-answered-by-structured-query.md).

All three are active accepted decisions. Their eight-file destination and
three-carrier Contract lead implementation; `OWNERSHIP.json`, `TASKBOARD.json`
and query behavior remain assigned delivery gaps, not present runtime claims.

The spec-local [packet plan](PACKET-PLAN.md) carries the recovered 28-row
allocation, four-tier decision rule, five concrete Q24B comparison examples, the
ADR-000B/C/D migration table and the proposed migration order. It is preparation
for Task conversion, not an independently executable queue or schema acceptance.
Its source claims read the ledger at `89d4042fb8931b9d720af75bffea1c28803d72aa`;
the ledger, the three ADRs and `tools/control-fidelity.mjs` are byte-identical at
`ec848e58626d1dbc33d3601c60178c47447c1014`, where this plan was rebuilt.

## Non-Goals

- Implementing FND-Q24B's field shape or disposition vocabulary during recovery/proposal work. The undeclared-difference policy was chosen by the owner on 2026-09-29 and is recorded here, not implemented.
- Treating ADR acceptance as proof that the ownership map, JSON Taskboard or query runtime has shipped.
- Duplicating routed claim text or live Spec/Task/ADR instances in the map; adding row lifecycle or status-shaped fields.
- Retiring or rewriting historical Spec, Task or ADR evidence.

## Dependencies And Blockers

The tracked [destination ledger](../../sessions/grilling-destination-audit-ledger.json), read at `89d4042fb8931b9d720af75bffea1c28803d72aa`, records FND-Q21 as settled through Q21A-D and FND-Q23/Q24 as locked. These are recovered decisions, not open questions to ask again. Earlier evidence rows preserve the prior unresolved discrepancy as history.

ADR-000B/C/D acceptance is resolved. Implementation remains planned. FND-Q24B belongs to this Spec as an ownership-origin-model question (PW-2 relabeled it from the retired "portability" framing and ruled it independent of S-00V): what authored facts classify project/upstream differences without a status-shaped field, and whether an undeclared difference is conflict or a reportable finding. The ledger routes its answer to this Spec "with an agent proposal first"; the proposal below was prepared for owner disposition, and on 2026-09-29 the owner disposed of its sub-fork in chat: an undeclared difference is a conflict (tradeoff 1, Option A). Proposal-026 is still only a proposal. Its two-authored-facts/computed-verdict shape and its ADR-citation tension with the no-instance guard are not accepted by that answer; they are compared against the five examples in the packet plan and settled within this Spec at implementation.

FND-Q21 fixes 28 responsibilities: 21 single-owner rows, six scoped rows and Representation/monitoring. Q21B distinguishes source-state authors from the Taskboard's representation role. Q21C places execution decisions in Task body, not Receipt; durable choices remain gaps until escalated. Q23 permits accepted rows only, with no instance identifiers, no status-shaped fields and routes-only query results. Q24 fixes two origins and three classifications, meaningful primary/supporting relationships and deliberate divergence with explicit disposition; row absence and artifact type alone do not classify or prove compatibility.

Current Lexicon coverage has since added Evolving concept understanding. Reconcile that later capability against exhaustive coverage and the locked 28-row recovery before final map population; do not silently expand the approved inventory. The map must represent OWNERSHIP.json and TASKBOARD.json as artifact types. Relations follow locked FND-Q20.

This accepted-decision change updates ADRs, root controls and Wiki routes; runtime, manifest, template and test implementation remains in later S-00G slices. Task-record conversion also needs a faithful path for this planned Spec with its remaining blockers: `convert-tasks S-00G` refuses a planned Spec, and the Task parser accepts only S/TK blocker IDs, so the four legacy slices and the pending A/B/C packet drafts stay in this Spec and PACKET-PLAN.md without invented IDs. Activating the Spec only to satisfy the converter is not a faithful path.

### Owner choices, as tradeoffs

**1. FND-Q24B — how a legacy undeclared difference is treated.** A room row
differs from upstream and carries no authored intent (example 5 in the packet
plan). **Decided 2026-09-29: Option A, conflict.** The owner selected it in
chat during the Director run; the options below are kept as the history of
what was put to him. The recommendation for Option B is superseded by that
choice.

- *Option A, conflict* (proposal-026's original recommendation). Every undeclared
  difference is a conflict until someone declares intent. Cost: the first
  upgrade of every legacy room that ever edited a route stops on each such row,
  including harmless ones; safest against a silent authority reroute.
- *Option B, reportable finding* (was recommended; not chosen). The comparator preserves the
  room's bytes, reports the difference as unresolved and restores nothing
  automatically; whether it blocks a specific operation is decided by an
  explicitly registered diagnostic effect, so an invariant-strength row
  (example 4) can still block. Cost: a non-invariant undeclared difference can
  persist as a visible, non-blocking finding until someone disposes of it, and
  the invariant policy must be registered before this is safe.
- *Option C, defer*: ship the map with origin facts but no comparator verdict
  for undeclared rows. Cost: upgrades gain no protection from the map until a
  later decision; lowest implementation cost now.

The companion placement question rides with it: whether a divergence
disposition and any authorizing ADR citation live in the map or in the
decision/report that owns the disposition. The owner's 2026-09-29 answer did
not cover it, so this stays a recommendation: outside the map, so the
no-instance-identifier and no-status-shaped-field guards (Q23) hold
unweakened; cost: a reader cannot see the disposition from the map alone and
the comparator joins to another owner.

**2. ADR-000B/C/D — acceptance route and timing. Decided 2026-09-29.**
The owner chose Option A: agents reconcile the three texts to locked answers
without another owner reread, then accept them now. A confirmed grilling
Question / Answer / Why / Impact readback locks the ADR; `to-docs` writes it
before Specs and Tasks. ADR-000B names `TASKBOARD.json`; ADR-000C names
AGENTS, RUNBOOK and LEXICON with the assigned Spec; ADR-000D records settled
FND-Q21/Q23/Q24 and ACC-4's routes-not-claims violation and TK-004 check.
The seven-versus-eight implementation window is accepted and explicitly
tracked here. ADR-0013/0033 are archived as superseded. ACC-5 routes agents
to Wiki feature articles first, with archives retained as sources; S-022's
historical packet is not completed and its article says so. These decisions
do not implement the map, JSON Taskboard or query.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Add `OWNERSHIP.json` at root with a validated schema and a failing-first reader | blocked | Spec planned; Task conversion unavailable | Red test for a missing/malformed map; green minimal reader; full suite |
| TK-002 | Sweep and teach every live root-surface consumer about the eighth file | blocked | TK-001 | Red repo-wide sweep proving every hardcoded root-surface count/list is found; green update of every one found; `doctor` clean |
| TK-003 | Ship a copy-ready `templates/OWNERSHIP.json` and update every template consumer | blocked | TK-002 | Template render and adoption tests pass; `evaluate-workbench --path templates` unchanged or improved |
| TK-004 | Implement the structured query surface and move the schema out of `LEXICON.md` | blocked | TK-003; Spec planned (FND-Q24B policy answered 2026-09-29) | Red query-output test proving routes, never claim text, plus schema rejection of instance IDs and status-shaped fields; green query; Lexicon routes onward |

### TK-001 - Add `OWNERSHIP.json` at root with a validated schema and a failing-first reader

**Stance:** Builder

Define the record shape at a stable testing seam before writing the file. Add a
failing test for a missing and for a malformed map, confirm the expected
failure, then implement the smallest reader that turns it green. The legacy slice proposes a valid but deliberately unpopulated container;
populating it is TK-004. Its final schema must honor Q24B's decided
conflict policy and the accepted ADR package. The field shape and disposition
placement remain implementation decisions under those guards; recovery of
settled allocation answers does not settle them.

### TK-002 - Sweep and teach every live root-surface consumer about the eighth file

**Stance:** Builder

The pattern recurs by hardcoding a literal count or file list, not from one
shared source, so start with a red test that scans the repository (excluding
`.git`, `node_modules` and untracked scratch paths) for the pattern and fails
listing every hit — do not trust the ten-plus consumers already found at review
(`workbench/tools/workbench-layout.mjs`, `tools/control-fidelity.mjs`,
`tools/test-workbench-layout.mjs`, `tools/test-control-fidelity.mjs`,
`tools/test-workbench-upgrade.mjs`, `tools/test-genesis-from-decisions.mjs`,
`tools/test-workbench-adoption.mjs`, `tools/test-portability-matrix.mjs`,
`RUNBOOK.md`) as the complete list. Update every consumer the sweep finds and
turn the sweep itself green. `CLAUDE.md` and root `README.md` were checked at
review and carry no such count; template consumers are TK-003.

### TK-003 - Ship a copy-ready `templates/OWNERSHIP.json` and update every template consumer

**Stance:** Builder

The template copy stays generic and `[BRACKETED]` per the dogfood boundary; the
root copy stays filled and current. `templates/ADOPTION.md` (three places),
`templates/GENESIS.md` (three places, verified at review) and
`templates/README.md` (one place, verified at review) all name the root
surface and must learn the eighth file everywhere TK-002's sweep finds it under
`templates/`.

### TK-004 - Implement the structured query surface and move the schema out of `LEXICON.md`

**Stance:** Builder

ADR-000B/C/D are accepted. Start TK-004 only after its predecessor slices and faithful Task conversion are ready. FND-Q24B is answered: an undeclared difference is a conflict until intent is declared (owner, 2026-09-29), so the comparator reports such a row as a conflict and restores nothing; the field shape that carries this without a status-shaped field must be settled within this Spec during implementation under the Q23 guards. Q21A-D, Q23 and Q24 are settled requirements recovered through the tracked ledger; implement them without reopening their answered questions. Test that queries return routes rather than claim text, accepted rows carry neither lifecycle nor status-shaped fields, and instance identifiers are rejected even within values.

## Acceptance Criteria

- [ ] `OWNERSHIP.json` exists at repository root and validates against a
      declared schema.
- [ ] A structured query returns the owning artifact and its route for every
      Core artifact type, and returns no claim text.
- [ ] A repository-wide sweep for a hardcoded root-surface count or file list
      finds nothing still asserting seven, proven by a test that failed before
      the change and passes after every found consumer is updated.
- [ ] `templates/` ships a generic `OWNERSHIP.json`, and `ADOPTION.md`,
      `GENESIS.md` and `README.md` all describe the eighth file everywhere
      they name the root surface.
- [ ] `LEXICON.md` no longer carries the Artifact Ownership Schema and routes
      ownership questions to the map.
- [ ] A fresh agent with no prior context can traverse the map and reach the
      owner of any Core artifact type.

## Testing Seams

The map reader and its query function, a repository-wide root-surface-count
sweep, the enumerations in `workbench-layout.mjs` and `control-fidelity.mjs`
plus the other consumers TK-002 finds, and the template render path.

## Verification Procedure

Run the targeted test for the touched seam, then the full verification suite
named in `AGENTS.md`, then
`node workbench/tools/spec-workbench.mjs doctor`.

## Documentation Impact

The acceptance change reconciles AGENTS, RUNBOOK and LEXICON to the
three-carrier Contract and accepted eight-file destination. The current
Markdown Taskboard, templates and enumerating consumers remain implementation
gaps owned by S-00G and the board work. `LEXICON.md` retains the Artifact
Ownership Schema until TK-004 makes the map queryable; only then does the
ownership route move. `RUNBOOK.md` gains the query procedure at that point.

## Append-Only Evidence And Execution Log

| Date | Commit | Claim | Method | Result |
|---|---|---|---|---|
| 2026-09-12 | c0ac60a | Spec authored; no implementation performed | Read-only consumer scan and ADR authoring | Six enumerating consumers confirmed; no root JSON control exists |
| 2026-09-12 | b4edb20 | Review found the six-consumer inventory was incomplete | Repo-wide grep for literal root-control-name arrays and "seven" root-surface mentions | Four more code consumers and two more template consumers found and named; TK-002/TK-003 changed from a fixed list to a sweep-and-fix pattern since the true count is not established as complete even now |
| 2026-09-12 | f2d2e87 | Review found ADR-000D and this Spec's Documentation Impact removed LEXICON.md's Artifact Ownership Schema "at acceptance", before TK-004 populates the map — leaving no route for an ownership question during TK-001-TK-003 | Re-read ADR-000D's Consequences against this Spec's own ticket sequencing | Corrected ADR-000D and Documentation Impact to defer schema removal until TK-004 lands; no implementation performed |
| 2026-09-21 | spec | FND-Q24B, an open owner question asked 2026-09-15 that gates TK-004 beside FND-Q21/Q23/Q24, appeared in no tracked file in this repository: every copy lived in the gitignored `workbench/sessions/` tree, so a notepad flush would have erased the only record that the gate exists. Recorded here as a gate; the proposed shape put to the owner stays unresolved in its live note and is not promoted | `git grep -n FND-Q24B -- .` at `03b2332` returned nothing, while `grep -rl` over `workbench/sessions/` found it in eight ignored files; `git check-ignore -v` resolved each to `workbench/sessions/.gitignore` lines 12 and 19. Cross-checked against `workbench/feedback/REPORT-foundation-question-review-2026-09-11.md`, which carries a full section for the other 25 notepad-owned open questions but predates FND-Q24B. `S-00G/SPEC.md` is byte-identical at `03b2332` and `cc53fad`, the audit anchor | This Spec's Blockers, Next gate, Non-Goals, Dependencies, TK-004 row and section, and Remaining Limitations now name FND-Q24B; no other owner changed, no question restatused, no answer promoted | TK-004 stays `blocked` and gains no new gate in substance; the four open answers remain the owner's. The live note holding FND-Q24B's proposal is still the only copy of that proposal |
| 2026-09-21 | spec | Separate-context review returned FAIL (High) on the row above's commit `4cc6277`: that commit restated FND-Q21, FND-Q23, FND-Q24 and FND-Q24B as four open owner questions and bumped `Updated` to 2026-09-21, while the same board it was derived from records FND-Q23 and FND-Q24 as `locked` by the owner on 2026-09-15, already owned by this Spec. A documentation-truth change shipped a gate line wrong in half its entries, freshly dated, having read the contradiction. Two Medium/Low findings also upheld: `decision-065`/`decision-066` entered a tracked record as identifiers resolvable in no tracked file, and the recovery pointer named a directory rather than a file | Reviewer ran the full suite at `4cc6277` independently: 46/46 pass, `doctor` attention count identical to base. Finding confirmed here directly against the board: `FND-Q21` and `FND-Q24B` are `decision_state: open` owned by the grilling note, while `FND-Q23` and `FND-Q24` are `locked` with `current_owning_artifact` already this Spec | Condition named, not resolved, per AGENTS.md State Resolution: no gate retired and no status flipped on an untracked source. Dependencies And Blockers gains an Unreconciled paragraph pointing at ADR-000D as the second stale owner; the header, Next gate, Non-Goals, TK-004 row and section carry the same qualification; the two decision identifiers are replaced by their plain premises with their untracked provenance stated; the recovery pointer names the exact note | ADR-000D still carries FND-Q23 and FND-Q24 as open and is unrepaired — out of this change's scope and left to its owner. Whether the owner in fact locked them on 2026-09-15 rests on untracked evidence and is not established here |
| 2026-09-21 | spec | Fresh separate-context review of the corrected candidate `58d2c2f` returned PASS with three non-blocking findings, all accepted and fixed here: the Unreconciled paragraph dated the audit board 2026-09-21, which is this entry's date and not the board's; the Non-Goals bullet said the two restated rulings live in one ignored note when they appear in several; and one sentence read as though FND-Q23 and FND-Q24 were not gates until reconciled, inverting the header and TK-004 | Board `generated_at` confirmed here as `2026-09-19T06:32:45Z` with `audit_checkout` `cc53fad`. Reviewer ran the full suite at `58d2c2f` independently: 46/46 pass, 49 doctor attention findings identical to base and to `4cc6277`, `next --json` returning S-00Q/TK-0Q0, `render` a verified no-op, append-only clean across `03b2332`/`4cc6277`/`58d2c2f`, and zero live bare citations under the anchor regex | Three prose corrections in live sections only; no evidence row rewritten, no status flipped, no gate retired or loosened. Corrected in this candidate rather than deferred to a later Task, since S-00G is `planned` and blocked and no Task is scheduled to touch it | The reviewer's own residual finding stands: ADR-000D still presents FND-Q21/Q23/Q24 as flatly open with no pointer back to this discrepancy, so the pointer remains one-directional until ADR-000D's owner repairs it |
| 2026-09-26 | none | Planning candidate rebuilt on `integration` at `ec848e5` from the unmerged Codex input candidate `3c8be95` (base `89d4042`), whose only review defect was an unrendered `CATALOG.md`. Carried: its live-section reconciliation (FND-Q21A-D, Q23 and Q24 recovered as settled from the tracked ledger; root-control wording replaced by the Ownership map routing-artifact terminology) and [PACKET-PLAN.md](PACKET-PLAN.md) (28-row allocation, four decision tiers, nine relations, five Q24B comparison examples, ADR-000B/C/D migration table). Changed on carry: drafting-session paths and roles removed, FND-Q24B relabeled an ownership-origin-model question per PW-2, and the Q24B undeclared-difference treatment and the ADR-000B/C/D acceptance route and timing written as owner tradeoffs with options, recommendation and cost. The input's own unpublished evidence row is not carried; the checks it reported were its own | `git diff 89d4042 ec848e5` is empty for this Spec, the ledger, the three proposed ADRs and `tools/control-fidelity.mjs`. Ledger read for FND-Q24B, PW-2 and ACC-1..5; FND-Q24B searched across tracked `workbench/wiki/`, `workbench/specs/` and ADRs and the owner's ignored notepads and handoffs, with no owner answer found. ADR authorship read from `git log --follow` (`c37e847`, `099b1bb`, both with an agent co-author trailer) and each record's Provenance line. `convert-tasks S-00G` in a throwaway clone refused the planned Spec as expected. The six earlier rows are byte-identical; `test-grilling-ledger` 5/5, `test-spec-citation-anchors` 3/3, `check-append-only` CLEAN; 28 numbered allocation rows and both JSON examples parse; `render` refreshed `CATALOG.md` only; `doctor` reports no blocking finding; self-drift pre at `ec848e5` is `cleanUpdate:false` with the seven baseline attention findings | Documentation-only planning: no runtime, schema, template, test, root-control, ADR or Task record change, and no ADR moved. The full AGENTS suite, self-drift post and a fresh-clone `doctor` run against the committed candidate and are reported with its SHA, since a row cannot name its own commit. Open gaps stay in Remaining Limitations |
| 2026-09-26 | review | Review verdict: pass at d21890ea11a5b4c1d9aa3282206c7e21987010d6 [92ac540ba6b0] #1 | No High/Medium/Low findings. Full AGENTS suite 48/48 at the committed candidate (read-only runner, dirty []); fresh-clone doctor no blocking finding; self-drift pre/post unchanged (seven baseline findings). Reviewer confirmed ledger status (Q21A-D/Q23/Q24 settled, Q24B open) and that ADR-000B/C/D acceptance timing is a real owner tradeoff; its sandbox could not create temp dirs for two fixture tests, which passed in the suite. | codex exec gpt-5.5, read-only sandbox, separate context from the Lane J dispatcher and worker | 4 |
| 2026-09-29 | none | Owner answered FND-Q24B: asked in chat, during the Claude Director run, how the ownership map should treat a legacy room row that differs from upstream with no authored intent, the owner selected Option A, conflict ("Every undeclared difference is a conflict until intent is declared. Safest, but the first upgrade of every legacy room stops on each such row."). Asked the ADR-000B/C/D acceptance tradeoff in the same chat, he directed a fresh grilling instead of choosing among the options | Owner's verbatim in-chat selection relayed by the Director to this lane; tradeoff 1, the header, Non-Goals, TK-004 and Completion Result updated in this Spec; ledger FND-Q24B moved open to locked with the answer, reason and a 2026-09-29 progress reading, ACC-1 and ACC-2 given a dated note and kept open; `test-grilling-ledger` 5/5; `render` and `doctor` run on the committed candidate and reported with its SHA, since a row cannot name its own commit. The Director's grilling handoff for ADR-000B/C/D lives in the untracked `workbench/sessions/handoffs/` collection and is cited as a local route only | Tradeoff 1 decided; the companion disposition-placement recommendation is unchanged because the answer did not reach it; proposal-026's field shape is not accepted. Tradeoff 2 stays open, routed to the grilling. No Task claimed, no ADR moved, no schema written; S-00G stays planned. `LEXICON.md`'s Ownership origin model row still calls FND-Q24B open and is listed under Remaining Limitations for its owner |

| 2026-09-29 | spec | Owner confirmed Q1 and ACC-1/2/4/5 and authorized ADR acceptance; the three decisions now lead S-00G implementation | Confirmed grilling readbacks; active ADR-000B/C/D and archived ADR-0013/0033; `adr.mjs validate` passed | Acceptance gate resolved. Map/Taskboard JSON and route query remain implementation gaps; this Spec stays planned pending faithful Task conversion |

| 2026-09-29 | b69068a20cad278fa7a10590aae163f0268b40a6 | First committed acceptance candidate passed 47/48 full-suite commands; the Blueprint contract check found a stale ADR-0033 owner route in the historical claim inventory | Full AGENTS command list on b69068a; repaired only the inventory owner path to archive/ while preserving its source text; targeted Blueprint contract check then passed | The failed run is not a green candidate; full suite must rerun after this route correction. Guardrail audit stayed 78/100 with unchanged criteria and no agent-outcome evidence. |

| 2026-09-29 | ddd2a7b67da4700533f8e4dec8857289db755616 | Full suite passed 48/48 on the committed acceptance candidate, but separate-context review returned FAIL on current-facing drift | Full AGENTS command list; reviewer checked immutable diff against parent ef2b1296 and found stale proposed-ADR wording in two S-00G live sections, ACC-3 progress, and packet-plan delivery status | Repaired those four places in the next candidate while preserving ACC-3 as partially answered; a new immutable review and exact-SHA verification are required before integration. |

| 2026-09-29 | 4bf0fabf4fe8fdcc21c3a9a4bd74280f6981f0a1 | Separate-context review of the first status-corrected candidate returned FAIL on one residual TK-004 contradiction | Reviewer compared the full diff from ef2b1296; TK-004 said Q24B field shape was settled, while the header and Dependencies left it for implementation. The 48-command run on this SHA was interrupted after that finding; no full-suite pass is claimed for it. | Rephrased TK-004 as an obligation to settle field shape within this Spec during implementation; new immutable review and full-suite proof required. |

| 2026-09-29 | 5cf9fdfe172ebec62940959da517c30394896a6b | Reconciled ADR acceptance and Wiki-first documentation candidate passed separate-context review and the full verification suite | Read-only reviewer returned PASS on the full diff from ef2b1296 with no actionable finding; all 48 AGENTS commands passed on this clean committed SHA; ADR and Wiki validators, render, doctor and append-only checks are included. Clean-parent self-drift pre and this candidate post each report the same eight baseline findings and `cleanUpdate:false`; guardrail audit is 78/100 before and after with unchanged criteria | Acceptance decision and documentation proof are established for this candidate. Map and JSON Taskboard implementation remain S-00G/board work; self-drift baseline findings and outcome evidence remain outside this promotion. Integration containment must be checked after delivery. |

| 2026-09-29 | 7d3095167322b2466da27f521ffbb1840e5408d5 | Full combined-branch review found one stale TK-001 sentence inherited from the Q24B lane | Separate-context reviewer checked the full candidate against origin/integration at 1450e7a8 and found that TK-001 called Q24B unresolved, although its conflict policy is decided. The 48-command run on this SHA was interrupted after 11 passing commands; no full-suite pass is claimed for it. | TK-001 now distinguishes the locked conflict policy from field shape and disposition placement still to be settled during implementation. The ledger no longer asserts a delivery state that would go stale after integration. Fresh exact-SHA review and verification remain required. |

| 2026-09-29 | 1cec360553b60a60c97471c51eb87f68cb4c290c | Corrected combined acceptance candidate passed independent review and full verification | Separate-context reviewer returned PASS with no actionable finding on the full clean diff against origin/integration at 1450e7a8; all 48 AGENTS commands passed on this exact clean SHA, including ADR, Wiki, ledger, append-only, template evaluation and doctor checks. The ledger now keeps integration containment as a Git fact rather than a transient status claim. | ADR acceptance and Wiki-first navigation are ready for integration delivery. S-00G map and JSON Taskboard implementation, ACC-3 binding-force question, and the eight baseline self-drift attention findings remain separate open work; this row does not claim release proof or agent-outcome improvement. |

## Completion Result

ADR acceptance and the related documentation decisions are reconciled.
Map implementation has not started. The Spec remains planned until its four
legacy slices can be converted faithfully; the next delivery gate is the
conversion and then implementation, not another ADR acceptance decision.

## Remaining Limitations Or Follow-Up Specs

No Ownership map or structured JSON comparison is implemented. The accepted
eight-file root destination and three-carrier Contract therefore lead actual
files, templates and consumers. Q21A-D/Q23/Q24 are settled and Q24B's
undeclared-difference policy is conflict; its field shape and disposition
placement remain implementation decisions. The 28-row allocation and the
newer Evolving concept understanding responsibility need explicit coverage
reconciliation before map population. The current fidelity consumer compares
Markdown lines, so a row-keyed JSON comparator needs its own implementation
slice. The converter cannot yet faithfully convert this planned Spec's legacy
slices; no Task is claimed or marked complete to hide that limitation.

The Lexicon's existing ownership schema remains the usable route until TK-004.
Templates and runtime consumers still describe seven root files and are
assigned to the implementation slices; acceptance does not certify them.
Historical evidence rows below remain records of what was believed and
verified at their dates.

## Supersession

None.
