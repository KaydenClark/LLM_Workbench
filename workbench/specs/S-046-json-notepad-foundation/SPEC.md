# S-046 - JSON Notepad Foundation

**Spec ID:** S-046
**Status:** active
**Priority:** 1
**Owner:** codex
**Stance:** Builder
**Updated:** 2026-09-07
**Catalog description:** Preserve objective continuity in local JSON notepads with safe updates, selective retrieval, and reconciliation before cleanup.
**Blockers:** none
**Latest event:** TK-001 closed with proof.
**Next gate:** Complete TK-002.

## Outcome

An agent preserves consequential working context as it discovers it. A fresh
agent can recover the objective, findings, corrections, unresolved work, and
next authorized action without the owner reconstructing the conversation.
Requested handoffs retrieve the relevant slice; cleanup preserves everything
still needed. New live notepads use JSON from this decision onward.

## Why It Matters

The owner requested a bounded foundation after a grilling session mixed settled
requirements, implementation choices, and larger Workbench changes. The goal
is useful continuity, not an exhaustive questionnaire or permanent transcript.

## Current Verified State

Inspected at `8e9c06f6f98825925e7da6cce59fb68768b589d7` on 2026-09-06:

- `workbench/tools/sessions.mjs` implements privacy scanning and checkpoint
  copying, not active-note capture, bounded retrieval, or safe note updates.
- `skills/grilling/SKILL.md` creates Markdown notes; `skills/make-it-so/SKILL.md`
  assumes grilling as its input. The installed project grilling copy lacks the
  source notepad contract. Installed skill generations are unknown to doctor.
- The manifest still declares grilling, handoffs, and checkpoints. The next
  layout and the generic notepad skill are requirements, not installed behavior.
- S-026's completed file-copy round trip is mechanical proof, not proof of
  continuous agent capture or recovery from an agent-authored record.
- The source grilling record was read in full, including later corrections.
  All three turns of the linked ChatGPT conversation were retrieved; no older
  turns remained. Its attachment bytes are not exposed by the conversation
  tool. The owner supplied the local notepad for this assignment; no claim is
  made that it is byte-identical to the historical attachment.

## Desired Behavior

1. A shared notepad skill guides judgment; deterministic tooling owns structural
   validation, serialization, safe updates, discovery, and bounded retrieval.
   Skill instructions and generated readable views remain Markdown.
2. Each objective may have several linked notes. The shared versioned JSON
   Schema covers visible identity, objective relationships, timestamps, an
   editable resumption view, an ordered work record, and flexible extensions.
   Full prose and source wording remain possible. Example templates guide
   capture; they never impose a universal reasoning form.
3. Preserve directives, source-backed findings, proposals, owner decisions,
   verification results, uncertainty, blockers, and explicit corrections when
   losing them would impair continuation. No mandatory turn timer or exhaustive
   event checklist is accepted. Labels never grant authority or verify truth.
4. Discover by explicit assignment, note identity, or objective relationship;
   when no stronger signal exists, use the most recently created local note or
   handoff, checking relevance before acting. Reconcile current controls and
   relevant Git, spec, filesystem, and process state on resume.
5. Read a bounded slice by note identity and topic or field. Preserve the
   selected material's correction and dependency context. Return explicit
   pagination and continuation information; never silently truncate. The tool
   may parse the whole objective-sized file. No unlimited-storage claim follows.
6. A handoff is a separately authored, destination-specific compaction requested
   or initiated by the owner. Use the active note as source. A pointer requires
   destination access and retention while needed; otherwise carry selected
   content. Handoff creation alone needs no separate objective note.
7. Reconcile important material into its proper owner or verified result before
   scoped cleanup. Unfinished work and active handoff dependencies prevent
   disposal. Partial promotion is not permission to flush the rest. A tool can
   check declared dispositions, not decide whether the reasoning is sufficient.
8. Target layout: manifest-declared `sessions/notepads/`, local-only type
   folders, tracked `sessions/notepads/templates/` examples/schema, and local
   `sessions/handoffs/`. Until that migration is implemented, keep new JSON
   grilling notes in the existing manifest-declared grilling collection.
9. Thin integrations cover ordinary work, grilling, handoff, and make-it-so;
   meaningful read-only investigation is included. Do not redesign the entire
   delivery workflow to demonstrate this foundation.

## Decisions And Contracts

- **Accepted:** JSON plus schema and tool-mediated selective access; objective
  continuity; local-only live notes/handoffs; survival-value capture; flexible
  templates; source and correction fidelity; authority and privacy boundaries;
  owner-initiated handoffs; reconciliation before deletion. ADR-0040 routes the
  cross-cutting rule into the Contract.
- **Engineering defaults, not owner answers:** propose one `.json` file per
  note, one writer per note, revision-checked serialized updates, safe replace
  retaining the previous valid file on failure, and explicit correction links.
  Test these choices in TK-002. Exact field names, command flags, pagination
  format, and schema implementation belong to engineering, not another grill.
- **Separate accepted work:** S-047 owns visible base-62 WBID compatibility;
  S-048 owns checkpoint rationale/disposition/retirement. Neither requires
  redesigning every artifact before a local JSON note can demonstrate value.
- **Current assignment endpoint:** promote supported decisions and define the
  build, preserving remaining material in grouped JSON grilling records.
  TK-001 does not implement or certify the complete runtime described above.
  No downstream installation update, checkpoint deletion, or release is included.

## Source Reconciliation And Promotion

Owner decision of 2026-09-06: "Notepads need to become JSON from here on out,
and we need tooling for that." The same request authorizes promoting what the
source supports into ADRs, specs, and Contract owners, and retaining everything
else in focused grilling notes. This is the promotion authority; the source
record and prior assistant recommendations alone are not authority.

Context: [Notepad Skill Foundation Needs](https://chatgpt.com/c/6a9e2919-3b8c-83e8-a845-74933ca49d1f).
The local source's original question IDs below identify the reconciled subjects;
the grouped JSON records retain exact text and the source hash locally. Durable
requirements stand here without depending on an ignored source path.

| Source questions | Disposition | Durable owner or remaining review |
|---|---|---|
| 1, 1A, 1B, 2, 2A, 2B, 2C | Settled by later owner answers | This spec; Contract purpose, capture, privacy, and structure |
| 3, 3A | Settled: preserve by survival value, no universal event/pre-dependency checklist | This spec; AGENTS and RUNBOOK |
| 3B | Optional timed flush was never accepted | Foundation engineering note; not a prerequisite |
| 4, 4A, 4B, 5 | Shared capability, Contract ownership, flexible templates, target layout accepted | This spec and ADR-0040; migration is not claimed implemented |
| 5A, 5B, 17B | Objective and note relationships already settled; metadata is engineering | This spec; S-047 for visible identifiers |
| 6, 6A, 6B | Writer/correction mechanics were open; proposed single writer and explicit links | Foundation engineering note; no simultaneous-writer guarantee accepted |
| 7, 7A, 7B | Recovery outcome and newest-created fallback settled; procedure is engineering | This spec and RUNBOOK |
| 8 | Local-only settled; device-loss and cross-machine guarantees remain open | Preservation grilling note |
| 8A, 8B, 8C | Checkpoint triggers/lineage questions displaced by retirement decision | S-048; keep historical questions locally, not foundation blockers |
| 9, 9A, 17, 17A | Separate tailored handoff and no autonomous future work settled | This spec; Contract |
| 9B, 9C | Reconcile before disposal settled; elaborate receipt/archive policy not accepted | Basic safety here; preservation note retains tradeoffs |
| 10 | Consume active objective records accepted as foundation integration | This spec |
| 10A, 10B | Whole delivery phase redesign/receipts not accepted | Workflow grilling note |
| 11, 11A, 11B | Meaningful-work coverage and trivial-chat exemption settled | This spec; extra templates are engineering examples |
| 12, 12A, 12B | Privacy and authority answered by 2C and later corrections | AGENTS; tests enforce only mechanical portions |
| 13, 13A, 13B | Tooling required; interface and diagnostic detail is engineering | This spec; foundation engineering note |
| 14, 14A, 14B, 16, 16A, 16B | Real recovery outcome required; proposed proof protocol below | Rollout/evidence note retains quantitative release and provider tradeoffs |
| 15, 15A, 15B | Preserve live sources; migration/installed-generation proof needed | This spec and S-047; rollout note retains release ordering |
| 17C, 17D | Corrected visible, type-and-Workbench scoped base-62 identifiers accepted | S-047 and ADR-0041; no secondary global ID |
| 18 | Separate checkpoint investigation and retirement accepted | S-048; later historical grilling remains local |

Earlier source summaries saying these later-answered questions remain open
are superseded for routing, but preserved verbatim in the local records.
The ChatGPT JSON fields, single-writer default, exact API example, and testing
protocol are proposals, not verbatim owner approvals.

## Non-Goals

- Unlimited history, cross-machine synchronization, recovery from device loss,
  autonomous task or handoff creation, a new coordination framework.
- Converting all existing artifacts to WBIDs, removing historical checkpoints,
  or updating installed/downstream skills in this scoping assignment.
- Treating JSON validation, file copies, or a static score as agent-outcome proof.

## Dependencies And Blockers

- No further owner answer blocks the bounded local foundation proposal.
- Broad portability promises await evidence; any unavailable provider is named,
  not simulated and reported as a real agent trial.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Reconcile the supplied sources into Contract/ADRs/specs and lossless focused JSON grilling records | done | none | 99 source segments, 57 question routes, byte-identical source reconstruction; ADR/Wiki/render/diff and targeted documentation checks pass; 25 of 33 suite commands pass after UTF-8 rerun, eight Node failures reproduced on baseline; full verification account in this spec |
| TK-002 | One agent saves an objective finding with a correction, then a fresh reader retrieves only that topic through the shared skill, schema, and CLI | ready | TK-001 | pending |

### TK-001 - Scope and reconcile

**Stance:** Builder

Current owner-assigned delivery: source coverage, explicit disposition, generic
Contract parity, JSON review records, privacy/ignore checks, and documentation
verification. The grouped records stay local. Integrate only after a separate
context reviews the immutable candidate. No runtime outcome claim is allowed.

### TK-002 - First complete JSON continuity path

**Stance:** Builder

Map Contract -> shared skill -> CLI input -> schema/record -> safe file update
-> bounded JSON output -> fresh reader. Demonstrate one objective with topics
X and Y: create, append a sourced finding for X, append its correction, save a
current view, interrupt, retrieve X with correction context and explicit page
continuation, and verify current project state before resuming. Y is preserved
but excluded from the scoped response unless it is an explicit dependency.
Test public seams red then green for invalid structure, malformed JSON,
duplicate identity, stale revision, blocked/interrupted write, path escape,
privacy rejection, and correction chains. Add later slices after this path
returns feedback; the acceptance below is not all compressed into TK-002.

## Acceptance Criteria

- [x] Source questions and corrections have explicit dispositions; all remaining source material is retained locally in focused JSON records, and promoted truth has durable owners.
- [ ] Shared schema, skill, and tool safely create/update/resume an objective note without requiring a model to regenerate its history.
- [ ] Bounded retrieval excludes unrelated topics, carries corrections/dependencies, and reports pagination without silent loss.
- [ ] Requested handoff and partial-cleanup demonstrations preserve unfinished material and destination dependencies.
- [ ] Root/template controls, source workflows, layout, managed-tool packaging, and explicitly authorized installed paths agree on the supported behavior.
- [ ] A fresh agent without the original conversation resumes real agent-authored work; cross-provider and interruption limits are recorded honestly.
- [ ] Full verification, unchanged-criteria guardrail comparison, and independent integration review are recorded for the implemented candidate.

## Testing Seams

- Scoping: JSON parse and source coverage/hash reconstruction; question disposition coverage; privacy and Git ignore checks; ADR/Wiki/spec render/doctor; existing full suite.
- Runtime: CLI and filesystem failure seams; fresh-agent trials through the actual installed skill path. A synthetic copy fixture cannot substitute for these trials.

## Verification Procedure

Use the full AGENTS verification suite, ADR and Wiki validation, render, doctor,
guardrail before/after, and diff check. For implementation add the focused public
CLI tests and the real capture/resume/handoff/cleanup demonstration described
above. Record a sub-minute demo command once the CLI exists; do not invent one.

## Documentation Impact

AGENTS owns rules; BLUEPRINT the continuity goal and scope; LEXICON the terms;
RUNBOOK the available operations; ADR-0040 rationale. Generic controls mirror
the rules without copying this project's task state. The root-only Runbook
inspection example names an actual local note and is intentionally omitted
from the generic template. Wiki MEMORY routes to
these owners and contains no duplicate queue. S-047 and S-048 own follow-ons.

## TK-001 Verification Account

No runtime code or test behavior changed, so a new red/green behavioral test
is not applicable to TK-001; the implementation slice explicitly requires it.

Candidate `6f4820d` was tested in an isolated LF checkout on Windows with normal
subprocess access. The 33-command union of the AGENTS and Runbook suites ran:
24 passed; eight Node commands and the initial Python append-only command
failed. This is not a fully green suite or an implementation release.

| Failed Node command | Comparison with unchanged integration `8e9c06f` |
|---|---|
| test-skill-catalog | Same hostile textconv fixture Windows-path failure; source catalog assertions pass in LF checkout |
| test-workbench-layout | All four failed classify cases reproduced using the same test-name filter on the baseline |
| test-workbench-tools | Same three failed cases: installed mode, drift classification, and no-file import |
| test-diagnostics | Same permission-scope-drift case fails |
| test-branch-closeout | Same three closeout cases fail |
| test-sessions | Same checkpoint mode assertion fails (438 versus 420) |
| test-workbench-round-trip | Same receipt-hash drift after the fixture's Git round trip blocks doctor |
| test-control-fidelity | Same closed-stdout-pipe case fails |

These failures are recorded, not repaired or exempted by changing criteria.
The initial Python failure was Windows default decoding of Git history.
The unchanged test passes with `PYTHONUTF8=1`, including clean-history and all
three planted-violation cases. Thus 25 of the 33 commands pass with that
environment correction; the eight baseline Node failures remain. The initial
working-checkout catalog CRLF regex failure and sandbox child-Git restriction
are distinct from the normal-permission LF results above.

Additional proof: all 57 source question IDs have a disposition; 99 contiguous
segments reconstruct the original 43,270 bytes with SHA-256
`a044de8698bee4b1861aad61287b0b722e3fae33cbd93b8b822144e07ab56f5b`.
The original remains untouched. The five focused notes plus their index parse
as JSON; the separate retrieved-chat JSON is also local and ignored. Three
full conversation turns are preserved. All seven JSON files are Git-ignored.

Privacy: the three specs scan clean. Independent review scanned all seven local
JSON files: six clean; checkpoint-history matches the scanner's retired host
handoff-lane pattern because an exact historical mechanism string is preserved.
It is not a credential or personal data. It remains only in the local source
record, is not promoted, and no all-JSON-clean claim is made. The original and
its preserved fragments are retained rather than silently redacted.

ADR validation, Wiki validation, render, and diff checks pass. A normal-permission
local doctor has zero blockers and 33 informational findings: one existing
manifest provenance mismatch and 32 unknown installed skill generations.
Guardrail is 78/100 before and after with unchanged criteria; templates score
106.6/113. The four remaining guardrail recommendations are real repeated trials,
control/prior/candidate comparisons, current evidence, and uncertainty reporting.
No agent-outcome improvement follows from these static results.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-06 | TK-001 | Scope captured from current owner request, complete local source, and three retrieved conversation turns | Refreshed origin/integration to 8e9c06f; guardrail 78/100 before edits; doctor has no selection blocker but reports installed-generation/provenance observations and sandbox-limited Git observation | Supported decisions and proposals separated in this spec | Promotion, JSON grouping, verification, and review pending |
| 2026-09-07 | TK-001 | Source reconciliation and scoped delivery verified | 99 segments reconstruct 43270 bytes and original SHA; all 57 IDs routed; six grouped/index records plus chat source JSON are ignored; ADR/Wiki/render/diff checks pass; full 33-command union at 6f4820d initially 24 pass, eight baseline-reproduced Node failures, Python decoding failure; unchanged Python test passes with PYTHONUTF8=1, giving 25 pass and eight baseline failures; final Runbook delta passes governance/dogfood/citation/evaluator checks | Two ADRs, three specs, root/template Contract, Wiki router, and benchmark record; local source preserved including explicitly noted historical-lane scanner match | Complete runtime remains TK-002 onward; fresh review of final immutable scoping candidate required before integration |
| 2026-09-07 | TK-001 | Ticket closed | 99 source segments, 57 question routes, byte-identical source reconstruction; ADR/Wiki/render/diff and targeted documentation checks pass; 25 of 33 suite commands pass after UTF-8 rerun, eight Node failures reproduced on baseline; full verification account in this spec | Root/template Contract, ADR-0040/0041, S-046/047/048, Wiki router, benchmark account, and local JSON groups updated | TK-002 onward implement the runtime; final immutable candidate review and integration PR are the scoping closeout gate |

## Completion Result

TK-001 delivers the scoped requirements, promoted decisions, and local JSON
review groups. The full capability remains unimplemented; remaining acceptance
boxes are intentionally open. Final independent review and integration
containment are recorded against the exact candidate in its integration PR.
The Windows suite is not fully green; the verification account above separates
pre-existing failures from the scoping result.

## Remaining Limitations Or Follow-Up Specs

- [S-047](../S-047-visible-workbench-identifiers/SPEC.md): visible WBID compatibility and migration.
- [S-048](../S-048-checkpoint-retirement/SPEC.md): checkpoint rationale and lossless retirement.
- Preservation guarantees, wider workflow redesign, and release/evidence choices remain in local focused grilling notes; they do not block TK-002's bounded proposal.

## Routine Coordination Record

The source records two concrete owner interventions: correcting the agent's
placement of lifecycle steps in AGENTS, and asking how many questions remained
after a separate checkpoint spec had already been assigned. Causes: procedural
truth routed to the wrong owner, and an unreconciled question map mixing settled
answers with follow-ons. Smallest corrections: route steps to RUNBOOK and
reconcile each question against later answers before asking it again. Those
corrections are applied here. The current scoping request is direction, not a
new routine-coordination failure. No additional owner coordination has been
required so far; environment refresh and source retrieval were handled locally.

## Supersession

- Supersedes: none; S-026 remains historical mechanical proof.
- Superseded by: none.
