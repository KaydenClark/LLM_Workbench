# S-00G packet drafts and reconciliation text

Spec-local planning companion to [SPEC.md](SPEC.md); not a task store, an executable queue or an accepted schema. Provenance: drafted in Codex candidate `3c8be95a7d1f06f5a2ce0b149d84685a8dbdb598` (base `89d4042fb8931b9d720af75bffea1c28803d72aa`, never merged), then rebuilt onto `integration` at `ec848e58626d1dbc33d3601c60178c47447c1014`, where the ledger, the three proposed ADRs and `tools/control-fidelity.mjs` are byte-identical to the base. SPEC.md is the single durable writer for this capability's state; this file holds the proposal material it links. The drafting-session history section below is provenance, not a standing assignment.

## Source authority and findings

Durable recovery source: `git show 89d4042fb8931b9d720af75bffea1c28803d72aa:workbench/wiki/grilling-destination-audit-ledger.json`, question IDs FND-Q20, Q21, Q21A-D, Q22, Q22A, Q23, Q23A, Q24 and Q24B. The ledger is evidence of answers; ADR acceptance remains a separate owner action. `result.effect` phrasing such as “Accepted” on Q21A is desired disposition, not proof ADR-000D moved out of proposed/.

FND-Q21 is settled through subquestions; Q23 and Q24 are locked. Only Q24B remains an unanswered question in this cluster. ADR-000B/C/D are still proposed. Never replace those gates with “none,” count a proposal as acceptance, or ask the owner to repeat the settled answers.

Recovered details were checked against the exact source entries named by the ledger in the ignored `workbench/sessions/notepads/grilling/` collection of the owner's checkout: `workbench-foundation-rework-2026-09-11.json` (proposal-017/022/024, decisions 061–063); `fnd-foundation-ownership-2026-09-15.json` (proposal-026, finding-033, decision-066); `blocked-obligations-review-2026-09-21.json` (decisions 018/019/025/026). Those ignored paths are recovery references, not durable citations for a committed result.

Important corrections:

- Q21D's 28 = 21 single-owner + 6 scoped + 1 representation. Decision-026 supersedes decision-063's 27 and correction-008's interim warning. Owns-vs-content is a change rule, not row 29.
- Q21B: altitude means scope, not file. Four rows have owners at all three scopes; Destination has Blueprint and Spec, with Task routing to Spec acceptance. Work state has Spec/Task source authors plus Taskboard project-wide representation; do not retain the obsolete unqualified “project scope = none.”
- Q21C: Task BODY holds execution choices, never Receipt. Durable choices escalate; until then they are remaining gaps. Contract/routing edits are execution, not another decision tier.
- Q23: accepted rows only; no lifecycle/status-shaped fields, no instance identifiers, routes-only results. Identifier checks scan within values, not only at string start.
- Q24: two origins and three classifications (portable invariants and defaults; project bindings; optional extensions). Do not recast this as four settled classes: invariant/default is an internal distinction in the first classification. Difference and Core type are comparison facts, not automatic compatibility/classification proof.
- Q23A: use “Ownership map,” eighth root file, Core routing artifact outside Contract. “Root control” label was retired. Existing Spec title is a historical identifier; revise prose/catalog meaning without renaming its path independently.
- The current Lexicon additionally has “Evolving concept understanding,” beyond the historical 25-row table. This is a real later coverage reconciliation item: preserve the locked 28-row recovery and route this newer requirement to the Spec's coverage reconciliation; do not silently invent row 29 or omit the newer capability from eventual exhaustive coverage.

## Recovered 28-row inventory

This is an allocation readback for reconciliation, not JSON field design. Rows 1–21 are the Q21D bundle, with the accepted repairs; the Decisions row has the explicit scoped escalation exception.

| # | Responsibility | Maintained owner / routing allocation |
|---|---|---|
| 1 | Authority | Current user request → AGENTS Authority Order; assigned Spec only bounded capability delegation |
| 2 | Decisions | ADR for consequential cross-cutting choice; Spec for scoped capability choice; Task body for execution-local choice; any change to what Core type owns always ADR naming OWNERSHIP.json in canonicalized_in |
| 3 | Language | Lexicon; capability-local vocabulary in Spec until shared |
| 4 | Knowledge | Wiki MEMORY → relevant knowledge/design-concept article → governing sources |
| 5 | Navigation | Ordered pair: Lexicon Context Map first → OWNERSHIP.json ownership query second; Wiki router and manifest retain their internal routing/configuration jobs |
| 6 | Operations | AGENTS lifecycle obligations; Runbook available operations, prerequisites and expected results |
| 7 | Procedures | Runbook named procedure/tool; linked Wiki guidebook may expand steps without duplicating governing rules |
| 8 | Reusable behavior | Runbook behavior route → resolved skill; Spec/Task assigns stance |
| 9 | Execution | Source/tool and actual host configuration mechanism; Runbook invocation; Spec work state/evidence |
| 10 | Configuration | Manifest, component configuration and ownership receipts |
| 11 | Capability | Runbook → named capability check → actual host/tool result; installation alone is not proof |
| 12 | Working context | Local JSON notepad; settled truth moves to its proper durable owner |
| 13 | Recovery | Runbook recovery procedure → existing controls, Spec, source, relevant note, recovery receipt/backup |
| 14 | Handoff | Requested local Markdown transfer for an identified receiving agent; no new authority |
| 15 | Feedback | Feedback occurrence/report → source evidence; authorized repair/disposition belongs in owning Spec |
| 16 | Evaluation | Evaluation definition and method in eval/outcome lanes; distinguishes result ownership under Evidence |
| 17 | Provenance | “Where did this claim or component come from?” → manifest provenance, component receipts, owning artifact source line |
| 18 | History | “What did this replace, and what was it before?” → Git, ADR HISTORY, superseded records |
| 19 | Delivery | “Is this change contained here?” → Git-confirmed integration/main containment, linked delivery proof |
| 20 | Release | “Is there a named published version, and what is installed?” → release records, manifest version, Template upgrade gate |
| 21 | Human orientation | README → Runbook operational detail |
| 22 | Destination | Product: Blueprint; capability: Spec; Task: declared gap with route to Spec acceptance in Packet |
| 23 | Boundaries | Product/capability/execution: permission limits inherited from governing request/controls, never relaxed below; product exclusions refined in Blueprint/Spec/Task; two edge types within one responsibility |
| 24 | Requirements | Product: Blueprint cross-cutting outcomes/constraints; capability: Spec; execution: Task bounded slice/Packet |
| 25 | Acceptance | Product: Blueprint qualities/constraints evaluated at Human QA (result is elsewhere); capability: Spec acceptance; execution: Task proof conditions |
| 26 | Evidence | Product: verified source/tests, main/release records, eval/outcome results; capability: Spec evidence; execution: Task proof/Receipt. Owns result and limits, not evaluation method |
| 27 | Work state | Spec and Task author their unit values; TASKBOARD.json summarizes them and owns project-wide representation, not source values |
| 28 | Representation / monitoring (Frontier view) | “Where do I see the whole active picture and monitor progress?” → TASKBOARD.json projection, sitrep read-out, README human orientation; summarizes Spec/Task types |

Q20 supplies nine directional relations, stored once: owns, inherits, refines, references, summarizes, provides evidence for, canonicalizes, supersedes, blocks. Reverse labels are rendered, not extra vocabulary; every relation has an instance_edge route. Primary/supporting role representation still needs schema design consistent with Q24, not a fabricated new relation.

## Ordered packet drafts (descriptive labels, no allocated IDs)

**Delivery status:** A's supported Spec reconciliation is applied in SPEC.md; verification and proof are recorded separately. B/C's initial five-case comparison matrix and ADR migration table are delivered here. Full schema/disposition proposals, owner decisions, ADR acceptance, migration and the cold-room demonstration remain unexecuted. These labels are not allocated Task IDs.

First-return delivery is this PACKET-PLAN content, including the concrete comparison matrix and migration table below. The q24b-proposal.md and adr-acceptance-proposal.md names are later intended output paths, not files created or complete in this return.

### A. Reconcile settled ownership answers in the assigned Spec

- Outcome: a cold reader distinguishes settled allocation/lifecycle/origin answers from unanswered Q24B and unaccepted ADRs, without regrilling or starting implementation.
- Stance: Reconciler. Dependency: none beyond current explicit assignment; no ADR acceptance required to report evidence correctly.
- Exact intended changed paths: `workbench/specs/S-00G-ownership-map-root-control/SPEC.md`; optional in-lane `workbench/specs/S-00G-ownership-map-root-control/PACKET-PLAN.md` for these proposals pending conversion. SPEC.md stays the single durable writer. No Wiki/ADR/root/projection changes.
- Execution performed: the supported live-section reconciliation is applied in SPEC.md, preserving historical evidence and unresolved owner gates. Review the resulting Spec and recorded verification; there is no replacement-text section below.
- Done: every current-facing open-Q21/Q23/Q24 claim repaired or explicitly historical; Q24B remains open; ADRs remain proposed; root-control terminology corrected in live prose; no map/runtime created. Preserve newer concept-understanding discrepancy as explicit remaining coverage work.
- Planned proof: bounded current-section search, inspect diff against source ledger, `node tools/test-grilling-ledger.mjs`, `node tools/test-spec-citation-anchors.mjs`, append-only check, full AGENTS verification for actual durable Spec changes. Render/projection refresh ships in the same candidate; a separate-context reviewer checks it before integration.

### B. Prepare bounded Q24B schema and comparison examples

- Outcome: one reviewable proposal that makes the unresolved tradeoff concrete, retaining proposal-026 and its source/corrections. No implemented or accepted schema.
- Stance: Builder (analysis/proposal only). Dependency: A's recovered constraints; no ID allocation until conversion is serialized by the single Spec writer. May proceed in parallel with C after A's readback.
- Exact intended changed path: `workbench/specs/S-00G-ownership-map-root-control/q24b-proposal.md` (new spec-local proposal; linked once from SPEC.md).
- Scope: compare the existing two-authored-facts proposal against no-status/no-instance-ID/routes-only guards; read actual fidelity/upgrade seams, state integration limits; propose but do not settle disposition vocabulary and undeclared-difference behavior.
- Starting recommendation, still unaccepted: upstream authors strength invariant/default; project authors intent binding/extension/divergence; comparison computes conflict/report outcome outside active rows. Keep all computed comparison state in reports, never map lifecycle. Suggest reportable unresolved difference for legacy undeclared rows with no automatic restoration; whether it blocks a specific operation requires explicit registered policy. This differs from original proposal-026's strict-conflict recommendation and must be presented as a new proposal, not recovered answer.
- Required examples: unchanged row; local binding to upstream route; new extension; legitimate declared default divergence; attempted invariant reroute; undeclared difference in a legacy room; upstream deletion; competing upstream/local modification; duplicate/missing stable row key; instance ADR citation versus no-instance-identifier guard.
- Example comparison table must keep separate columns for authored upstream fact, authored project fact, mechanical delta, computed finding, actual action, and unknown decision. “Added” cannot imply “extension”; an invariant/default label cannot prove correct authority. Do not silently whitelist an authorizing ADR instance inside the map: proposal-026's ADR citation conflicts with the broad no-instance-IDs guard and needs explicit resolution/location.
- Done: exact illustrative field examples with clear PROPOSED labels; closed disposition options and reason; test-case matrix; one recommended owner choice with costs; no row rewritten and no comparator code.
- Planned proof: schema examples parse as JSON if included; manual guard matrix; citations to `tools/control-fidelity.mjs`, `workbench/tools/workbench-layout.mjs`, upgrade/adoption tests. Red/green is not applicable to a proposal; later behavior work requires failing-first fixtures. Current fidelity is Markdown line comparison, so no claim of row-keyed support.

### C. Prepare a coherent ADR acceptance and migration proposal

- Outcome: owner can inspect one consistent B/C/D package with explicit migration sequencing and unresolved choices, rather than accept mutually stale records.
- Stance: Reconciler. Dependency: A; B needed before claiming full schema readiness, not before drafting package.
- Exact intended changed path: `workbench/specs/S-00G-ownership-map-root-control/adr-acceptance-proposal.md` (new spec-local proposal, no ADR writes).
- Proposal: B supersedes ADR-0013 on explicit acceptance, separating root placement/Core/Contract; C supersedes ADR-0033 preserving claim-set semantics and three carriers plus assigned Spec; D incorporates recovered Q20/Q21/Q23/Q24, removes false open-answer claims, retains Q24B as unsettled field-shape decision. Use map/routing terminology. B/C/D remain proposed until actual owner acceptance and runtime lifecycle procedure.
- ACC-3 recovery: the Contract and other routing artifacts make the Blueprint's claims binding. Excluding BLUEPRINT.md from the mandatory carrier set changes entry/routing, not the force of accepted product promises. The migration must preserve the binding route explicitly: a routed Blueprint claim constrains scoped delivery without enlarging user authorization. Source condition: this direction comes from the drafting session's 2026-09-26 recovery report and an untracked reconciliation note, while the tracked ledger still records ACC-3 as partially answered with the binding part open; per AGENTS State Resolution the condition is named here, not resolved. It does not accept B/C/D.
- Planned cold-room demonstration (not run): use a disposable project and the public Workbench setup route, with an accepted Blueprint promise that its task-list CLI preserves items across process restarts. A fresh agent enters AGENTS → RUNBOOK → LEXICON with an assigned add/list Task that links rather than copies the Blueprint promise. Start with a memory-only app. The proposed runner adds an item, ends that process, starts a new list process and asserts persistence: red before authorized repair, green after. Record discovered governing route, commands/output, implementation and candidate SHA. A fresh reader reruns it in the generated room. Text assertions or directly supplying the missing promise to the agent do not prove route discovery. Proposed future path `tools/demo-blueprint-binding.mjs` requires an assigned test lane; it does not exist and no runnable demo is claimed now. Coordinate this single demonstration with S-00P rather than duplicate it.
- Compare C's “load all three whole” wording with current smallest-route entry; propose precise consistency rather than changing entry cost accidentally. Compare old B eight-filename list/TASKBOARD.md with accepted future TASKBOARD.json direction; coordinate board owner before freezing enumeration.
- Migration order: reconcile accepted answer evidence → settle Q24B → owner reviews coherent ADR package → authorized accept/supersede procedure plus operational-owner edits → smallest queryable vertical map behavior, consumer enumeration, template copy and structured comparison → only then remove Lexicon schema/add Runbook query route → full checks/separate-context review of the immutable candidate → integration → owner Human QA. Preserve the usable Lexicon route throughout. Existing container-first slices may remain staged internals; do not advertise an empty map as the new usable route.
- Shared write lane request (future, not granted): exact proposed ADR B/C/D paths already linked by Spec; ADR-0013/0033 supersession through runtime; `workbench/docs/adr/REGISTER.md` and `HISTORY.md`; `AGENTS.md`, `BLUEPRINT.md`, `LEXICON.md`, `RUNBOOK.md` and their applicable template counterparts; runtime/tests as identified by bounded sweep. The assigned implementation lane confirms the exact final set before mutation; no request for blanket repository ownership.
- Done: per-ADR decision/acceptance/migration table; owner-only gates; explicit shared paths; current-versus-future route demonstration; no lifecycle moves or claimed acceptance.
- Planned proof: source crosswalk to locked ledger IDs, proposed ADR full text, accepted predecessors, live root owners; unresolved questions visibly separated from accepted semantics. No behavior tests claimed.

## Legacy four-row conversion: preserve blockers

`convertSpecSlices` at the inspected SHA requires Spec `active`, stages and parses every pending record before writes, and Task parser only accepts S/TK blocker IDs. S-00G is planned and TK-001/TK-004 have ADR/question prose blockers. Therefore direct conversion currently refuses, correctly. Do not temporarily activate it, strip blockers, substitute invented dependencies, create tasks/ manually to bypass it, or allocate IDs outside serialized conversion.

The eventual command is `node workbench/tools/spec-workbench.mjs convert-tasks S-00G` after a separately authorized faithful conversion path exists. Expected paths: `workbench/specs/S-00G-ownership-map-root-control/tasks/TK-001/TASK.md`, likewise TK-002, TK-003, TK-004; plus owning SPEC.md. Preserve numeric IDs and original proof as Planned verification, never proof actually run. Preserve all four legacy blockers until a real gate is resolved or a supported equivalent model records it. Conversion limitation is a runtime delivery dependency, not permission to falsely restatus the Spec.

For each approved new packet, the single Spec writer serializes `node workbench/tools/spec-workbench.mjs next-id S-00G --prefix TK --json`, persists that planned record before the next allocation, No real IDs were requested for this plan (`next-id` returns an unreserved proposal only). Pending a faithful path, `PACKET-PLAN.md` is the exact spec-local fallback, with descriptive A/B/C labels, not a parallel executable queue.

## Drafting-session checks at `89d4042` (history; current verification is in SPEC.md evidence)

- Read AGENTS → Runbook Ordinary Entry → Lexicon routing → manifest specs lane → `show S-00G`, to-tasks skill, assigned Spec and proposed B/C/D.
- `doctor`: exit 0; seven informational findings (stale S-00Q claim, five stale seeds, unverified provenance), no blockers. `next --json`: S-00Q/TK-0Q0; explicit S-00G assignment retained, no selection performed.
- `node tools/test-grilling-ledger.mjs`: 5/5 pass.
- `git ls-files OWNERSHIP.json templates/OWNERSHIP.json workbench/specs/S-00G-ownership-map-root-control/tasks`: empty. ADR files remain under proposed/.
- Read converter preflight and Task blocker parser; did not invoke conversion, allocation, render, claim, ADR lifecycle or mutation tools.
- `tools/control-fidelity.mjs`: six Markdown templatedControls, `compareTarget` routes to classifyLines; no map target/row-keyed comparator in this inspected path. No claim of a repository-wide comparator audit.
- No red/green, full suite, guardrail or self-drift receipts run: this worker changed no repo behavior, control or Spec; those checks belonged to the assembled candidate. No runtime success, acceptance or delivery claimed.

## Five concrete Q24B comparison examples — proposed only

Illustrative field names are not accepted schema. A conceptual upstream declaration might be `{ "key": "knowledge.project", "strength": "default", "route": "wiki/MEMORY.md" }`; a project declaration might be `{ "key": "knowledge.project", "intent": "binding", "route": "docs/knowledge/MEMORY.md" }`. The key denotes a responsibility/scope assignment, not a Spec/Task/ADR instance. An accepted type-level route placeholder is not a populated instance ID. Actual classification support requires authored semantics, not names alone.

| Case | Upstream fact | Project fact | Mechanical delta | Proposed computed report / action | Unsettled point |
|---|---|---|---|---|---|
| 1. Local binding | `knowledge.project`, default, abstract Wiki route | Same key, intent binding, room Wiki router | Route changed | Report binding only if it still fulfills the upstream responsibility; preserve project route | Exact schema for binding compatibility |
| 2. Extension | No row for room-only art-asset provenance responsibility | New key, intent extension, local art manifest route | Row added | Report declared extension plus discoverability check; preserve row | Added alone never proves extension; local support proof shape |
| 3. Deliberate default divergence | Default routes procedural detail to Runbook | Same responsibility intentionally routed to room guidebook; intent divergence | Route changed | Report declared divergence, require explicit disposition evidence, preserve project route | Proposed disposition `retain-local`; evidence location must satisfy no-instance-ID guard |
| 4. Invariant reroute | Invariant Authority route to governing request/AGENTS | Same key reroutes authority to a room Wiki article | Route changed | Report incompatible invariant difference; never silently restore either version | Exact affected-operation blocking policy must be registered/accepted |
| 5. Legacy undeclared difference | Existing default route | Differing local route, no intent metadata | Route changed, intent absent | Recommended unresolved finding with preserved bytes and explicit decision needed; proposal-026 instead called this conflict | Owner must choose conflict versus reportable finding and any operation-specific effect |

Proposed divergence dispositions for owner comparison: `retain-local` (preserve intentional compatible room choice), `adopt-upstream` (explicit later migration, not an automatic comparator action), `reconcile` (a further scoped decision/change is required). These are suggestion labels, not accepted closed vocabulary. Treating `reconcile` as authored map state may violate Q23; preferable location is the decision/report owning the disposition, with the map retaining only accepted current routes and allowed structural facts. A durable ADR reference containing an actual ID likewise cannot be smuggled into map values while claiming the no-instance guard passed. These two tensions need explicit Q24B resolution.

Migration dependencies for the concrete proposal: A recovery → B examples and owner Q24B choice; A recovery → C B/C/D consistency proposal; accepted package + settled schema → root-map reader/query + guard fixtures → consumer/template/comparator changes → populated query demo → Lexicon/Runbook routing switch → full checks → separate-context review of the immutable candidate. Preparation of A/B/C does not itself satisfy any implementation dependency.

## Coherent B/C/D migration table — proposal only

| Record | Accepted meaning to recover into proposal | Predecessor / open gate | Migration dependency and preserved route |
|---|---|---|---|
| ADR-000B | Eighth root file is Ownership map, Core routing artifact; root placement does not imply Contract | Explicit acceptance before superseding ADR-0013; coordinate future Taskboard filename with board owner | Root-surface consumer sweep and template support; do not claim installed eighth-file coverage at ADR acceptance |
| ADR-000C | Contract claim-set carried by AGENTS, RUNBOOK, LEXICON plus bounded assigned Spec; other artifacts routed by intent; routed Blueprint product promises remain binding | Explicit acceptance before superseding ADR-0033; reconcile whole-file loading wording with current ordinary entry | Update actual named operational owners and template controls in an assigned implementation lane; no new CONTRACT.md |
| ADR-000D | Exhaustive type-level map; 28-row recovery; nine relations; accepted rows only; no instances/status; routes only | Explicit acceptance remains required; Q24B field shape unresolved; later concept-understanding coverage needs reconciliation | Keep Lexicon ownership answers until map populated/queryable; accept/supersede decisions separately from usable runtime delivery |

Acceptance of this preparation document does not accept any ADR or schema. Existing Spec title “Ownership Map Root Control” is retained only as historical identity; live meaning follows the recovered routing-artifact terminology. No rename is delivered by this plan; the catalog description is refreshed by render in the same candidate.
