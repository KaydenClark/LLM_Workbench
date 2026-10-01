# S-002A - Landmark Records

**Spec ID:** S-002A
**Status:** active
**Priority:** 1
**Owner:** codex-v4-carry
**Stance:** Builder
**Updated:** 2026-09-30
**Catalog description:** Maintain evolving landmark relationships and readable durable knowledge with recoverable provenance.
**Blockers:** none
**Latest event:** TK-002T closed with receipt-backed installed CLI/API proof and all 53 current required/Task-focused commands passing on clean immutable `edd229dfa88f2c79f009a4d53d1305df1ca13d9a`. Shared Wiki, assessment and lifecycle work remain; no whole-Spec or owner Human QA completion is claimed.
**Next gate:** TK-002W stays deferred until its shared lifecycle file slot is explicitly released against an immutable seam. Shared Wiki wiring and expected-claim assessment still need scoped delivery, followed by whole-Spec QA, separate-context Spec review and actual owner gates.

## Integration Visibility

This record was reconciled from lane candidate `92ba4e61356389effc54d3ceebd79f9f6ff49c7a` on 2026-09-27.
Its requirements, existing Task identities and append-only receipts are now
available from integration. Implementation files were not imported with this
planning reconciliation. Statements below that a Task is done, behavior is
delivered, or tests pass describe the named lane candidate, not this integration
tree. Checked acceptance reflects that candidate's evidence only; assembled
integration verification and independent review remain open. Existing Task
states preserve the actual hand-back rather than inventing new execution.
The Dispatcher retains its lane and pending gates. Do not reimplement completed
branch work or infer permission to bypass a pending approval/review.

### TK-002T current tree — 2026-09-29

This tree now includes the standalone validator, its managed-runtime registration,
installed CLI/API proof, real Git-index preservation tests and usage. The
2026-09-27 reconciliation above describes its historical planning import.
Only TK-002T is closed in this run; remaining candidate-only and incomplete
capabilities retain their existing gates. Integration containment is established
by the reviewed Task PR, separately from these source/fixture results.

## Outcome

Maintain evolving landmark relationships and readable durable knowledge with recoverable provenance.

## Why It Matters

Landmarks preserve evolving direction while readable articles explain durable
knowledge. Identity-bearing structured provenance must stay recoverable without
leaking WBIDs into the article or turning a completed Task into documentation
proof. Live record links must keep resolving after supported delivery moves.

## Current Verified State

Inspect observations at `git show b00a2e338436ef7b281b0cc53e74f891af32f18c:path`.
The original [foundation Spec](../S-01T-landmark-tracker-foundation/SPEC.md)
retains completed TK-01X/TK-01Y receipts and append-only evidence.
`workbench/tools/landmark-tracker.mjs` already provides `addLandmark`,
`showTracker`, `reviseRecord`, and `linkLandmark`; landmark records retain
`landmark-tracker/landmark@1`, LMK identities, origin and history. DQCs author
membership in their `landmarks` list. Existing 23 Tracker tests pass on this
baseline, including retitling, later connection, overlap and invalid writes.
No first create/read implementation Task is needed.

`workbench/tools/wiki.mjs` has no explicit Landmark-article full-byte WBID
check. The existing article route is distinct from retirement feature owners.
S-00I TK-01U has active uncommitted shared-consumer changes in a separate
checkout; do not duplicate its collection/type/provenance capability.
S-01T TK-01Z and TK-02A remain deferred. Their source obligations were transferred explicitly by Director/Tracker at
4e68ca488fa258f7dce0161aeebcd2946e492990; old deferred Tasks retain context
only, with completed Task bytes and append-only proof unchanged.

## Desired Behavior

1. Landmarks remain evolving feature/framework accounts with meaningful
   summary and importance, overlap, stable identity, retitling lineage and
   later DQC connection. They are not Specs or PRDs or implemented themselves.
2. Preserve the delivered manifest, JSON schema and DQC-owned membership
   contract. Reuse public APIs and type-scoped identity allocation; no new
   envelope, source conversion, forced parent or fixed taxonomy.
3. An explicitly designated Landmark article can be validated through a public
   read-only command/API against all its bytes. WBIDs in metadata, body, hidden
   comments, URLs and link targets are rejected with a useful named finding.
   Default validation must not report valid for arbitrary custom-type tokens
   accepted by the live identity grammar: unknown shaped tokens produce an
   explicit ambiguous/incomplete result, or conservative refusal. Namespace
   options may classify ambiguity but are not required to prevent false validity.
   Supported encoded URL/link targets addressing identities are checked with
   a documented decoding boundary. Ordinary lookalike prose ambiguity stays
   visible; no semantic identity inference is promised.
   Valid readable articles pass. Missing/unsafe/non-article paths fail visibly;
   every refusal preserves bytes and index. Unrelated Wiki articles, including
   retirement feature owners with Spec-ID source paths, keep their own rules.
4. Several delivery Specs may maintain one coherent readable article. Keep
   identity-bearing lineage in structured DQC/landmark/delivery records and
   readable identifier-free routes in the article; no duplicate article,
   mandatory pre-answer Wiki home or separate publishing ceremony.
5. Assessment compares specific expected claims with actual durable bytes,
   revision and applicable gates. Existence, completed Tasks and accepted ADRs
   alone never establish Verified. Changes expose only evidenced affected
   claims and preserve earlier proof. Agree a narrow assessment result seam
   with DQC source mutation and Tracker presentation; never create a second
   competing assessment store.
6. Supported Spec/Task movement and retirement rewrite live JSON references,
   while immutable commit/path citations retain original interpretation.
   Genuine live tracked dependencies prevent discard. Approved fixture discard
   recovers named source bytes from the recorded commit. Ignored local notes
   are not recoverable from ordinary Git by this capability.

## Decisions And Contracts

The accepted model remains in [ADR-000N](../../docs/adr/000N-landmark-tracker-connects-evolving-understanding-to-durable-knowledge.md)
and the [readable model](../../wiki/design-concepts/landmark-tracker.md).
The owner correction explicitly splits three capability Specs and authorizes
Task planning and workers; the earlier specification-only endpoint describes
historical delivery, not current authorization.

DQC [S-002B](../S-002B-destination-question-cards/SPEC.md) owns source
understanding, Result mutation and initial exclusive `landmark-tracker.mjs`
write slot. Tracker [S-001Z](../S-001Z-landmark-tracker-view/SPEC.md) owns
calculation/view and serial identity reservations/projection authoring. This
Spec owns Landmark semantics, article validation/assessment and JSON lifecycle
reference behavior. Shared-file mutation is serial; independent module/test
Tasks can proceed concurrently through released seams.

## Source Acceptance Transfer

S-01T original criteria remain source history; no boxes or old proof are erased.
This Spec owns criterion 3 (landmark connection/retitle), 7 (actual durable
content assessment), 10 (shared identifier-free article), 11 (article/feature
route compatibility by consuming S-00I), and 12 (live/historical recovery).
Record/article aspects of 8 and Records portions of 1, 6 and 13 are joint
acceptance, evidenced here and linked in the cross-Spec demonstration. DQC owns
understanding/composition mutation; Tracker owns rendering/calculation. Whole
capability completion is not a dependency for consuming a released small seam.

Inherited completed behavior: original TK-01X/TK-01Y, verified locally 23/23.
Unfinished source: TK-01Z article validation/assessment and TK-02A lifecycle
consumers; split into small successors without moving completed Task history.
Director/Tracker source mapping at 4e68ca488fa258f7dce0161aeebcd2946e492990
marks old delivery as routed; retain that exact source mapping at assembly,
preserving every original acceptance and append-only receipt.

## Non-Goals

- Reimplement delivered create/read/retitle/link or change existing schemas.
- Duplicate S-00I's features collection/type/retirement provenance capability.
- Change unrelated Wiki articles, delete notes, curate exhaustive landmarks.
- Release/version/main promotion, other rooms, scheduler or added authority.
- Reset owner Human QA based on tests, reviews or a fixture approval.

## Dependencies And Blockers

The first standalone article validator has no runtime dependency on incomplete
Specs. Shared `wiki.mjs`, path/layout/manifest and lifecycle consumers currently
have an active S-00I TK-01U writer. Later wiring consumes an immutable candidate
or released file slot; it does not wait for whole S-00I completion. DQC first
shared-runtime mutation releases a clean seam before Records assessment writes.
Source transfer mapping and globally unique Task reservations are coordinated
by Director/Tracker, not fabricated cross-Spec blocker tokens.

## Vertical Implementation Slices

Tasks are record-backed under `tasks/`. First approved residual slice validates
one explicitly designated readable Landmark article through a standalone public
command/API, rejecting WBIDs across complete bytes with no writes. Subsequent
small slices wire the released Wiki seam, assess one expected claim against
actual bytes, preserve one live JSON move, and refuse/recover one tracked
fixture discard. Allocate each only after its concrete seam is traced and
coordination slot reserved; do not create broad lifecycle or whole-Spec barriers.

## Acceptance Criteria

- [ ] Existing landmark creation/read/retitle/overlap/connection and origin history
      remain verified at the retained public seams.
- [x] Explicit Landmark article validation rejects WBIDs in complete bytes,
      accepts readable valid content, and preserves files/index on every refusal.
- [ ] Ordinary feature provenance and existing Wiki contracts remain compatible;
      shared collection/schema/retirement work is consumed without duplication.
- [ ] Two delivery Specs can maintain one article; structured identity lineage
      remains recoverable without WBIDs or copied delivery state in article bytes.
- [ ] Actual expected claims, durable contents/revision and applicable gates
      determine the documented assessment; completed Tasks alone do not.
- [ ] Live JSON references survive supported moves/retirement while historical
      citations retain immutable interpretation; genuine tracked dependencies
      refuse discard and approved fixture recovery reproduces named bytes.
- [ ] Source transfer preserves original acceptance/completed proof; whole-Spec
      QA, full checks, self-drift/guardrail receipts and under-minute demos are
      recorded; separate-context integration review and actual owner gates remain.

## Testing Seams And Verification

First Task defines the new public article validation command/API in
`workbench/tools/landmark-wiki.mjs`, exercised by
`tools/test-landmark-wiki.mjs` using actual disposable Markdown articles and
fresh-process CLI calls. Trace identity grammar and existing safe path helpers
before coding. Confirm semantic failing tests, then minimal green behavior;
include metadata/comment/URL/link cases and unrelated feature compatibility.
Shared wiring later uses `validateWiki`, `move-spec`, `move-task`, retirement and
discard public seams with disposable committed rooms. No real cleanup/approval
is performed as a fixture. Every implementing worker runs required full AGENTS
checks on its committed candidate and reports named red/green proof and demo.

## Documentation Impact

The [standalone validator usage](../../landmark-tracker/LANDMARK-WIKI.md)
explains its public command, installed distribution and detection limits; shared Runbook/controls/managed receipt changes coordinate with their
writer. Later Wiki schema/router and generic mirrors update only on released
file slots. Keep generic templates copy-ready. No historical evidence copied
into Taskboard; Tracker owns final generated projection. Known baseline drift
is retained explicitly: seven attention findings, guardrail 78/100 and
self-drift cleanUpdate=false. Passing checks do not prove clean update or QA.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-26 | none | Serial identity reservation under explicit owner three-Spec split | Live base b00a2e338436ef7b281b0cc53e74f891af32f18c; next-id proposal saved before next allocation | This minimal scaffold | Dispatcher scope/Tasks and source transfer mapping pending |
| 2026-09-26 | TK-002T | Director-approved first residual Task reserved serially; inherited create/read behavior not reimplemented | Existing Tracker 23/23; doctor seven baseline attention; active lane-H dirty consumers inspected; guardrail 78/100; self-drift cleanUpdate false | Scoped successor Spec and Task; original source history preserved | Worker red/green and source transfer reconciliation pending |
| 2026-09-26 | TK-002T | Packet 04d54b165c06a6a46a5cec53bda3cbe79e0caeec delivered to one-Task Sol worker; fresh-context readback accepted; inherited authorization and Director callbacks carried | Citation checks 3/3; local render/doctor pass with seven existing attention findings; packet clean | Markdown handoff is local context only; authored Spec/Task tracked | Worker red/green/full candidate proof and source transfer pending; no Human QA completion |
| 2026-09-26 | TK-002T | Early public test review found fixed-prefix default could omit permitted custom notepad identities; Director requires generic default ambiguity/refusal and supported encoded-target proof within same Task | Initial worker red 59439b5 then 13/13 green bd0707e is superseded for final acceptance; corrected immutable candidate pending | Desired Behavior clarifies honest default lexical boundary; no identity/runtime refactor | Installed distribution needs released RUNTIME_TOOLS seam; whole Spec and owner QA remain pending |
| 2026-09-26 | none | Import exact foundation transfer sources from 4e68ca488fa258f7dce0161aeebcd2946e492990 and saved Tracker TK-002U inventory from bf4ba683; preserve own Records current state | Director reports Luna tracked-tree readback all 13 successor routes; local doctor follows | Foundation/context-only pending Tasks and saved peer packets imported without reauthoring | Corrected TK-002T immutable verification pending; next allocation waits actual saved DQC composition Task |
| 2026-09-26 | TK-002W | Director grants next serial planning turn after importing exact saved Tracker U and DQC V records from df987692; public next-id proposes W and packet saved | No runtime test run or worker dispatched; predicted red grounded in Markdown-only lifecycle collector at b00a2e3 | Small public JSON-home move Task with exact shared file release gate | Active H writer must release immutable lifecycle seam; TK-002T corrected candidate full checks remain primary |
| 2026-09-26 | TK-002T | Candidate 6688a946fb454cec9b557dd19fcf3230437e1bea corrected generic/encoded validation; installed red b6da8db87dec3ceb6a296fef65c628d7188b751c proves missing registry entry. Director releases only disjoint RUNTIME_TOOLS hunk via Task89c64b8; worker commit attempt automatically rejected before execution | Worker reports focused16/16, demo4/4 in0.63s, full50commands49pass1change-caused canonical runtime-list failure, dirty[] at candidate; not fullgreen. Root inspecting prepared patch; direct approval remains pending | Exact Task clearance and preserved receipts; independent Sol source reviewer01a0e020-fe95-7413-bc64-201083ebac61 | Registration not immutably saved; no integration/wholeSpec/ownerQA pass; shared Wiki/assessment/lifecycle remain |
| 2026-09-26 | review | Separate-context Sol source review01a0e020-fe95-7413-bc64-201083ebac61 pins04d54b1 to6688a94, dirty[]; P2 registry omission independently reproduced; no additional proven source defect. Import exact worker90885bd Task receipts/state without rewriting rows | Independentvalidator16/16, Tracker23/23, Wiki13/13, documenteddemo2/2 in0.28s, diffcheckpass; no independentfullsuitepass. Guardrail78/100, cleanUpdatefalse; reported49/50 retains failing registrygate | Actual Task in-progress and receipts preserved; current feature compatibility limited to projecttype | Review does not pass integration; corrected registered immutable candidate/fullproof and freshreview still needed; direct registry approval pending |

| 2026-09-27 | none | Integration visibility reconciliation | Imported requirements and existing Task receipts from `92ba4e61356389effc54d3ceebd79f9f6ff49c7a`; no runtime files merged and no new Tasks cut | This owner and release reconciliation report | Implementing candidate review, integration delivery and applicable owner gates remain |

| 2026-09-29 | TK-002T | Owner-directed carry resumes the existing in-progress slice on current integration, preserving historical attempts and pending whole-Spec gates; zero coordination hand-backs | Fresh fetch and next select TK-002T; original worker and Dispatcher tips last changed 2026-09-26, Dispatcher checkout clean, no worker worktree registered. claim refuses because no ready Task exists and restores the tree; this run resumes the existing in-progress Task rather than resetting it. Prior automatic registry commit rejection remains history; current user requests the smallest v4 slice to completion and its Task explicitly releases the one-line registry hunk | Existing source/test/usage bytes recovered from worker 90885bde; no unrelated branch changes imported | Reproduce installed red, permitted registry commit, green full checks and fresh review pending |
| 2026-09-30 | TK-002T | Task closed | Clean immutable edd229dfa88f2c79f009a4d53d1305df1ca13d9a: all 53 commands passed (48 AGENTS, 3 additional RUNBOOK, validator and Tracker); validator 18/18, Wiki 13/13, Tracker 23/23. Observed installed red at 8faf09ad was 16/17, missing managed validator; released registration at 0b04f923 made installed CLI/API and receipt-hash checks green. Public 3-case demo passed in 0.50s. No source or index writes on validation; real staged-index fixture passes. | Updated workbench/landmark-tracker/LANDMARK-WIKI.md public command/API, syntactic ambiguity and encoding limits, installed distribution; Spec and Task progress updated, projections rendered. Root/template controls checked: isolated command addition needs no contract mirror. | Shared Wiki integration, expected-claim assessment, deferred TK-002W lifecycle seam and whole-Spec QA remain. Owner Human QA is not approved. Task candidate separate-context review and integration landing follow; known S-00Q stale claim and historical provenance/seeds keep cleanUpdate false, guardrail remains 78/100. |

| 2026-09-29 | TK-002T | Fresh carry proof and bounded self-drift reconciliation; zero coordination hand-backs, no slices skipped within this Task | Immutable edd229d clean and remotely accepted on codex/v4-next-slice; 53/53 commands at the exact source. Pre ac6fadb: 8 attention findings; post edd229d: 7, with resumed S-002A stale claim removed. Remaining S-00Q stale claim blocks a clean-update claim; five historical seed findings and historical adoption provenance retain limits. Guardrail pre/post 78/100; missing repeated real outcomes, control/prior comparisons, current evidence and uncertainty remain. Manual readback covered root controls, manifest, generated board/catalog, current Task/Spec, referenced ADR/Wiki, registry/distribution and usage; other rooms untouched | Public usage and current owner/projection reconciled, historical records preserved | Final immutable Task review/landing; broader Spec gaps stay above. TK-002W deferred shared slot is not selected or implemented |
