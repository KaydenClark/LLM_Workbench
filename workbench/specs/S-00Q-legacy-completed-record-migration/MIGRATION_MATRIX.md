# Legacy Spec article migration matrix

Frozen source: `bc370fe742d5ddb8348bf361fccea31205f6cee7`. Exactly **50 completed Specs -> 50 individual Wiki articles**. Original bytes remain recoverable at the pinned baseline; current source hashes are recorded separately. This is an auditable inventory and proposed claim routing, not retirement approval.

The machine-readable [inventory](MIGRATION_INVENTORY.json) contains full source/article SHA-256 identities, every level-two source section with line interval and content hash, linked-owner hashes and the current-consumer snapshot. Lines read at the immutable source commit. Article hashes bind the assembled bytes, not a claim that the baseline contained the new articles.

Classification is by source-section purpose. A `current` group proposes current-meaning reconciliation; it does **not** certify that old requirements still describe current behavior. Independent review must compare each group with the article and named live sources, especially superseded requirements. `proof` remains bounded historical evidence, never fresh runtime proof.

The owner explicitly requested one article per Spec. Grouping A-F coordinates work only. The earlier tentative answer does not select a retirement QA mechanism or approve any concrete digest. All retirement/discard gates remain open.

## Structural verification and remaining gaps

- Baseline and article IDs match exactly: 50/50, no extras or duplicates; the inventory distinguishes baseline from current source bytes (S-027/S-028 carry new append-only disposition evidence).
- Every local Markdown article link and frontmatter owner path exists; this checks file routes, not Markdown anchor semantics or implementation correctness.
- Runtime reference inventory found 125 current-consumer occurrences before this matrix was authored. No consumers are silently declared migrated. Re-scan after routing edits and before retirement.
- Every source section is retained by immutable identity and classified below. This is section-level claim-group coverage; atomic claim preservation and agreement with current sources remain review work.
- Article limitations remain in each linked article; host-specific outcomes, old release readiness and unavailable native-host/cross-device proof cannot be re-certified by link checks.
- No real record moved or was deleted. Runtime repair results, owner QA, exact-main containment and recovery execution remain separate gates.

## Per-Spec claim routes

### S-001: Spec-Centered Progressive Disclosure

Article: [Spec-Centered Progressive Disclosure](../../wiki/design-concepts/spec-S-001-progressive-disclosure.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-001-progressive-disclosure/SPEC.md`.

Progressive disclosure keeps ordinary entry small: read the agent contract, follow the Runbook and Lexicon routes, then load the assigned capability and its relevant source. A Spec carries the assignment and its proof; the hot Taskboard derives an operational view. Reading an entire historical catalog is not a prerequisite for doing one bounded piece of work.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L13-18); Desired Behavior (L33-43); Documentation Impact (L106-111) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L44-54) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L73-85); Testing Seams (L86-92); Verification Procedure (L93-105); Append-Only Evidence And Execution Log (L112-123); Completion Result (L124-129) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L19-24); Current Verified State (L25-32); Vertical Implementation Slices (L65-72) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L55-60); Dependencies And Blockers (L61-64); Remaining Limitations Or Follow-Up Specs (L130-136); Supersession (L137-140) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `AGENTS.md`, `RUNBOOK.md`, `LEXICON.md`, `BLUEPRINT.md`, `workbench/tools/spec-workbench.mjs`, `tools/test-spec-workbench.mjs`.

Consumer snapshot: 2 occurrences. Semantic review and retirement approval: **pending**.

### S-002: Held-Out Path-Safety Evaluation

Article: [Held-Out Path-Safety Evaluation](../../wiki/design-concepts/spec-S-002-heldout-evaluation.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-002-heldout-evaluation/SPEC.md`.

The held-out task adds a security-oriented path-handling domain beside the development task. Its grader checks the produced repository and transcript without using the harness condition as an input to the grade. Keeping the held-out seam separate reduces the temptation to optimize only for familiar development fixtures.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L13-18); Desired Behavior (L29-33); Documentation Impact (L66-69) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L34-37) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L52-55); Testing Seams (L56-59); Verification Procedure (L60-65); Append-Only Evidence And Execution Log (L70-77); Completion Result (L78-82) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L19-23); Current Verified State (L24-28); Vertical Implementation Slices (L46-51) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L38-41); Dependencies And Blockers (L42-45); Remaining Limitations Or Follow-Up Specs (L83-87); Supersession (L88-91) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `evals/tasks/task_b_path_safety/task.json`, `evals/tasks/task_b_path_safety/grade.py`, `evals/tasks/task_b_path_safety/test_grade.py`, `evals/README.md`.

Consumer snapshot: 1 occurrences. Semantic review and retirement approval: **pending**.

### S-004: Dependency-Safe Direct Claiming

Article: [Dependency-Safe Direct Claiming](../../wiki/design-concepts/spec-S-004-safe-direct-claim.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-004-safe-direct-claim/SPEC.md`.

Direct claiming must enforce the same dependencies as selection. An agent may already know its assigned Spec and skip a general selector; that shortcut must not let it claim a ready Task whose prerequisite is unfinished.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L13-17); Desired Behavior (L28-32); Documentation Impact (L67-71) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L33-36) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L51-55); Testing Seams (L56-59); Verification Procedure (L60-66); Append-Only Evidence And Execution Log (L72-80); Completion Result (L81-84) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L18-22); Current Verified State (L23-27); Vertical Implementation Slices (L45-50) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L37-40); Dependencies And Blockers (L41-44); Remaining Limitations Or Follow-Up Specs (L85-88); Supersession (L89-92) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `workbench/tools/spec-workbench.mjs`, `workbench/tools/spec-packet.mjs`, `tools/test-spec-workbench.mjs`, `AGENTS.md`.

Consumer snapshot: 1 occurrences. Semantic review and retirement approval: **pending**.

### S-005: Consistent Bootstrap Ownership Guidance

Article: [Consistent Bootstrap Ownership Guidance](../../wiki/design-concepts/spec-S-005-bootstrap-doc-alignment.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-005-bootstrap-doc-alignment/SPEC.md`.

A new project inherits its operating model through public setup instructions and the copy-ready Genesis and Adoption procedures. If those entry points use obsolete ownership language, they can recreate the very duplication that the harness removed internally.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L13-17); Desired Behavior (L27-30); Documentation Impact (L66-69) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L31-34) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L49-53); Testing Seams (L54-57); Verification Procedure (L58-65); Append-Only Evidence And Execution Log (L70-77); Completion Result (L78-81) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L18-22); Current Verified State (L23-26); Vertical Implementation Slices (L43-48) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L35-38); Dependencies And Blockers (L39-42); Remaining Limitations Or Follow-Up Specs (L82-85); Supersession (L86-89) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `README.md`, `templates/GENESIS.md`, `templates/ADOPTION.md`, `AGENTS.md`, `tools/test-evaluate-workbench.mjs`.

Consumer snapshot: 1 occurrences. Semantic review and retirement approval: **pending**.

### S-006: Evidence-Gated Harness Feedback

Article: [Evidence-Gated Harness Feedback](../../wiki/design-concepts/spec-S-006-feedback-automation.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-006-feedback-automation/SPEC.md`.

The feedback loop separates candidate construction from an independent integration decision. Discovery reads the declared feedback lane first, then supported legacy feedback filenames. It excludes noncanonical project copies, normalizes origins, ranks candidates by impact and recurrence, and selects no new candidate while a pending fingerprint already exists.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L13-17); Desired Behavior (L31-35); Documentation Impact (L88-92) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L36-44) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L62-69); Testing Seams (L70-76); Verification Procedure (L77-87); Append-Only Evidence And Execution Log (L93-102); Completion Result (L103-108) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L18-22); Current Verified State (L23-30); Vertical Implementation Slices (L55-61) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L45-50); Dependencies And Blockers (L51-54); Remaining Limitations Or Follow-Up Specs (L109-113); Supersession (L114-117) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `tools/feedback-automation.mjs`, `tools/test-feedback-automation.mjs`, `tools/test-eval-runner.mjs`, `evals/run.py`, `RUNBOOK.md`.

Consumer snapshot: 2 occurrences. Semantic review and retirement approval: **pending**.

### S-007: Import-Safe Feedback Helper Entry

Article: [Import-Safe Feedback Helper Entry](../../wiki/design-concepts/spec-S-007-feedback-helper-import.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-007-feedback-helper-import/SPEC.md`.

A JavaScript file can be both a command-line program and an imported library. Its entry guard must decide whether to run the CLI without breaking callers that only want its exported decision functions.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L13-17); Desired Behavior (L27-30); Documentation Impact (L64-68) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L31-34) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L49-53); Testing Seams (L54-57); Verification Procedure (L58-63); Append-Only Evidence And Execution Log (L69-76); Completion Result (L77-80) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L18-22); Current Verified State (L23-26); Vertical Implementation Slices (L43-48) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L35-38); Dependencies And Blockers (L39-42); Remaining Limitations Or Follow-Up Specs (L81-84); Supersession (L85-88) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `tools/feedback-automation.mjs`, `tools/test-feedback-automation.mjs`.

Consumer snapshot: 1 occurrences. Semantic review and retirement approval: **pending**.

### S-008: Portable Verification Boundaries

Article: [Portable Verification Boundaries](../../wiki/design-concepts/spec-S-008-windows-verification-portability.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-008-windows-verification-portability/SPEC.md`.

Cross-platform verification needs stable serialized contracts without rewriting the host's real filesystem paths. Context-pack labels normalize path separators to forward slashes, while paths used for I/O retain native handling. Spec generated-region comparison normalizes CRLF to LF, so an equivalent checkout does not become stale solely because of line-ending style.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L13-17); Desired Behavior (L32-37); Documentation Impact (L87-91) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L38-47) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L63-69); Testing Seams (L70-75); Verification Procedure (L76-86); Append-Only Evidence And Execution Log (L92-100); Completion Result (L101-106) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L18-23); Current Verified State (L24-31); Vertical Implementation Slices (L57-62) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L48-52); Dependencies And Blockers (L53-56); Remaining Limitations Or Follow-Up Specs (L107-111); Supersession (L112-115) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `tools/context-pack.mjs`, `workbench/tools/spec-workbench.mjs`, `tools/test-context-tools.mjs`, `tools/test-eval-runner.mjs`, `evals/tasks/task_b_path_safety/grade.py`, `evals/tasks/task_b_path_safety/test_grade.py`.

Consumer snapshot: 1 occurrences. Semantic review and retirement approval: **pending**.

### S-009: Adoption When Git Writes Are Unavailable

Article: [Adoption When Git Writes Are Unavailable](../../wiki/design-concepts/spec-S-009-git-write-constrained-adoption.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-009-git-write-constrained-adoption/SPEC.md`.

A host can allow ordinary document edits while refusing branch, stash or commit writes in Git metadata. Adoption must distinguish that capability limit from a safe, completed migration.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L13-18); Desired Behavior (L34-39); Documentation Impact (L84-89) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L40-47) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L64-70); Testing Seams (L71-75); Verification Procedure (L76-83); Append-Only Evidence And Execution Log (L90-96); Completion Result (L97-101) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L19-24); Sanitized Feedback Record (L25-33); Vertical Implementation Slices (L58-63) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L48-53); Dependencies And Blockers (L54-57); Remaining Limitations Or Follow-Up Specs (L102-106); Supersession (L107-110) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `templates/ADOPTION.md`, `README.md`, `tools/test-adoption-git-write-fallback.mjs`, `AGENTS.md`.

Consumer snapshot: 1 occurrences. Semantic review and retirement approval: **pending**.

### S-00A: S-00A: Blueprint, Active ADRs And The Context Map

Article: [S-00A: Blueprint, Active ADRs And The Context Map](../../wiki/design-concepts/spec-S-00A-blueprint-active-adr-and-context-map.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md`.

The Blueprint describes the desired finished product. Accepted active ADR decisions carry architectural Canon; their rationale and historical alternatives remain evidence. The Lexicon routes questions to owners through its Context Map. A Spec describes a bounded destination derived from that direction and verified Actuality.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L16-22); Desired Behavior (L44-60); Documentation Impact (L211-216) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L61-73); Blueprint Definition And Rebuild Contract (L74-108) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L183-195); Testing Seams (L196-202); Verification Procedure (L203-210); Append-Only Evidence And Execution Log (L217-229); Completion Result (L230-245) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L23-29); Current Verified State (L30-43); Blueprint Review Checklist (L109-125); Grilling Record Reconciliation (L126-144); Vertical Implementation Slices (L158-182) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L145-151); Dependencies And Blockers (L152-157); Remaining Limitations Or Follow-Up Specs (L246-250); Supersession (L251-254) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `LEXICON.md`, `BLUEPRINT.md`, `workbench/tools/adr.mjs`, `tools/test-adr.mjs`, `workbench/docs/adr/000A-active-adr-decisions-and-destination-blueprints.md`.

Consumer snapshot: 3 occurrences. Semantic review and retirement approval: **pending**.

### S-00B: S-00B: Workbench Template Reformation

Article: [S-00B: Workbench Template Reformation](../../wiki/design-concepts/spec-S-00B-workbench-template-reformation.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-00B-workbench-template-reformation/SPEC.md`.

The reference room was changed from a fictional Example application into a copyable Workbench Template. A reference installation has its own controls, identity, local differences and installed-runtime provenance. Updating it requires preserving those facts rather than replacing the room with upstream generic files.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L16-21); Desired Behavior (L29-40); Documentation Impact (L103-107) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L41-50) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L78-90); Testing Seams (L91-95); Verification Procedure (L96-102); Append-Only Evidence And Execution Log (L108-117); Completion Result (L118-128) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L22-28); Vertical Implementation Slices (L62-77) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L51-56); Dependencies And Blockers (L57-61); Remaining Limitations Or Follow-Up Specs (L129-133); Supersession (L134-137) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `AGENTS.md`, `RUNBOOK.md`, `README.md`, `tools/control-fidelity.mjs`.

Consumer snapshot: 1 occurrences. Semantic review and retirement approval: **pending**.

### S-00C: S-00C: Project Evidence And Blueprint Grilling Preparation

Article: [S-00C: Project Evidence And Blueprint Grilling Preparation](../../wiki/design-concepts/spec-S-00C-project-evidence-and-blueprint-grilling.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-00C-project-evidence-and-blueprint-grilling/SPEC.md`.

The project-evidence preparation seam turns explicitly named project sources into a bounded provisional JSON grilling note. It retains source identities and uncertainty, then presents owner questions without answering them.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L16-20); Desired Behavior (L21-27); Documentation Impact (L76-80) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L28-33) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L64-70); Verification Procedure (L71-75); Append-Only Evidence And Execution Log (L81-89); Completion Result (L90-106) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Vertical Implementation Slices (L48-63) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L34-38); Dependencies And Blockers (L39-47); Remaining Limitations Or Follow-Up Specs (L107-110); Supersession (L111-114) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `workbench/tools/project-evidence.mjs`, `tools/test-project-evidence.mjs`, `RUNBOOK.md`.

Consumer snapshot: 2 occurrences. Semantic review and retirement approval: **pending**.

### S-00D: S-00D: Genesis From Blueprint And ADR Decisions

Article: [S-00D: Genesis From Blueprint And ADR Decisions](../../wiki/design-concepts/spec-S-00D-genesis-from-blueprint-and-adrs.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-00D-genesis-from-blueprint-and-adrs/SPEC.md`.

The public derivation seam creates a new Workbench from a clean Template, a source project, a prepared grilling note and an explicit `genesis-plan-1` plan. It requires an absent destination and derives exactly one first capability from selected locked questions and active ADRs.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L16-20); Desired Behavior (L21-26); Documentation Impact (L78-82) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L27-45) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L65-72); Verification Procedure (L73-77); Append-Only Evidence And Execution Log (L83-94); Completion Result (L95-103) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Vertical Implementation Slices (L59-64) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L46-50); Dependencies And Blockers (L51-58); Remaining Limitations Or Follow-Up Specs (L104-109); Supersession (L110-113) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `tools/genesis-from-decisions.mjs`, `tools/test-genesis-from-decisions.mjs`, `skills/genesis/SKILL.md`, `templates/GENESIS.md`.

Consumer snapshot: 2 occurrences. Semantic review and retirement approval: **pending**.

### S-00E: S-00E: Fresh Template Project Proof

Article: [S-00E: Fresh Template Project Proof](../../wiki/design-concepts/spec-S-00E-fresh-template-project-proof.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-00E-fresh-template-project-proof/SPEC.md`.

A clean Template copy was used to create an independent Puffer Pond room through evidence preparation and decision-based Genesis. The demonstration then exercised a useful project Task and saved-note continuation in a fresh agent context.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L16-20); Desired Behavior (L21-26); Documentation Impact (L80-86) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L27-33) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L65-73); Verification Procedure (L74-79); Append-Only Evidence And Execution Log (L87-97); Completion Result (L98-110) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Vertical Implementation Slices (L47-64) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L34-38); Dependencies And Blockers (L39-46); Remaining Limitations Or Follow-Up Specs (L111-116); Supersession (L117-120) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `workbench/specs/S-00E-fresh-template-project-proof/PROOF.md`, `tools/genesis-from-decisions.mjs`, `tools/test-workbench-identity.mjs`.

Consumer snapshot: 4 occurrences. Semantic review and retirement approval: **pending**.

### S-00F: S-00F: The Named Template Upgrade Release Gate

Article: [S-00F: The Named Template Upgrade Release Gate](../../wiki/design-concepts/spec-S-00F-template-upgrade-release-gate.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-00F-template-upgrade-release-gate/SPEC.md`.

The producer must exercise each new Workbench version in the named Workbench_Template installation before declaring release readiness. Generic generation tests alone cannot prove an installed upgrade preserves room-owned state.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L14-17); Desired Behavior (L28-37); Documentation Impact (L127-130) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L38-50) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L75-81); Testing Seams (L82-86); Verification Procedure (L87-92); Delivered Template Evidence (L93-115); Append-Only Evidence And Execution Log (L131-140); Completion Result (L141-153) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L18-23); Current Verified State (L24-27); Vertical Implementation Slices (L61-74); Coordination Corrections (L116-126) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L51-55); Dependencies And Blockers (L56-60); Remaining Limitations Or Follow-Up Specs (L154-158); Supersession (L159-162) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `AGENTS.md`, `RUNBOOK.md`, `README.md`, `skills/update-harness/SKILL.md`, `tools/workbench-tools.mjs`.

Consumer snapshot: 3 occurrences. Semantic review and retirement approval: **pending**.

### S-00L: S-00L: Lexicon Freshness Repair

Article: [S-00L: Lexicon Freshness Repair](../../wiki/design-concepts/spec-S-00L-lexicon-freshness-repair.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-00L-lexicon-freshness-repair/SPEC.md`.

A terminology router also contains claims that can go stale: release lineage, a current candidate version, source boundaries and its verification stamp. S-00L repaired those claims without changing the meaning of the affected definitions.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L16-23); Desired Behavior (L58-68); Documentation Impact (L150-157) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L69-80) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L111-123); Testing Seams (L124-133); Verification Procedure (L134-149); Append-Only Evidence And Execution Log (L158-166); Completion Result (L167-177) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L24-34); Current Verified State (L35-57); Vertical Implementation Slices (L93-110) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L81-88); Dependencies And Blockers (L89-92); Remaining Limitations Or Follow-Up Specs (L178-182); Supersession (L183-186) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `LEXICON.md`, `workbench/manifest.json`, `tools/test-governance-core.mjs`, `tools/test-control-fidelity.mjs`.

Consumer snapshot: 1 occurrences. Semantic review and retirement approval: **pending**.

### S-010: Canonical Evaluator Invocation

Article: [Canonical Evaluator Invocation](../../wiki/design-concepts/spec-S-010-canonical-evaluator-entry.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-010-canonical-evaluator-entry/SPEC.md`.

A successful process exit is not enough if a directly invoked evaluator never runs. A checkout reached through a path alias can make the command-line script path differ textually from its module URL even though both identify the same file.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Documentation Impact (L39-43) | Article explanation + linked live owners; compare every old requirement before retirement. |
| proof | Acceptance Criteria (L28-33); Append-Only Evidence And Execution Log (L44-50); Completion Result (L51-55) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Sanitized Feedback Record (L13-21); Vertical Implementation Slices (L22-27) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Limitations (L34-38); Supersession (L56-59) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `tools/evaluate-workbench.mjs`, `tools/test-evaluate-workbench.mjs`, `RUNBOOK.md`.

Consumer snapshot: 1 occurrences. Semantic review and retirement approval: **pending**.

### S-012: Reproducible Adoption Provenance

Article: [Reproducible Adoption Provenance](../../wiki/design-concepts/spec-S-012-adoption-provenance-proof.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-012-adoption-provenance-proof/SPEC.md`.

Adoption proof must survive the original checkout and conversation. A cold reviewer needs the published source identity and executable reconstruction steps, not a statement that a local run once passed.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L13-18); Desired Behavior (L34-40); Documentation Impact (L89-94) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L41-50) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L67-74); Testing Seams (L75-79); Verification Procedure (L80-88); Append-Only Evidence And Execution Log (L95-101); Completion Result (L102-107) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L19-24); Sanitized Feedback Record (L25-33); Vertical Implementation Slices (L61-66) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L51-56); Dependencies And Blockers (L57-60); Remaining Limitations Or Follow-Up Specs (L108-112); Supersession (L113-116) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `templates/ADOPTION.md`, `README.md`, `tools/test-adoption-git-write-fallback.mjs`, `RUNBOOK.md`.

Consumer snapshot: 1 occurrences. Semantic review and retirement approval: **pending**.

### S-013: Verified Automation Run Outcomes

Article: [Verified Automation Run Outcomes](../../wiki/design-concepts/spec-S-013-automation-run-outcomes.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-013-automation-run-outcomes/SPEC.md`.

Run accounting distinguishes useful work, genuine absence of work and an interrupted attempt. The helper accepts exactly six categories: `actionable`, `worked`, `idle`, `owner_gate`, `collision` and `infrastructure_error`. It requires a nonempty reason and a nonnegative integer previous idle count. Unknown categories fail visibly.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L13-19); Desired Behavior (L34-41); Documentation Impact (L100-110) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L42-56) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L74-84); Testing Seams (L85-90); Verification Procedure (L91-99); Append-Only Evidence And Execution Log (L111-119); Completion Result (L120-128) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L20-26); Current Verified State (L27-33); Vertical Implementation Slices (L68-73) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L57-63); Dependencies And Blockers (L64-67); Remaining Limitations Or Follow-Up Specs (L129-133); Supersession (L134-138) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `tools/feedback-automation.mjs`, `tools/test-feedback-automation.mjs`, `RUNBOOK.md`, `README.md`.

Consumer snapshot: 1 occurrences. Semantic review and retirement approval: **pending**.

### S-015: Operable Genesis Readiness

Article: [Operable Genesis Readiness](../../wiki/design-concepts/spec-S-015-portable-v3-release-audit-recovery.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-015-portable-v3-release-audit-recovery/SPEC.md`.

A scaffold is not ready merely because expected filenames exist. Genesis readiness must establish that a cold agent can follow the declared support layout, read filled controls and select executable work.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L16-22); Desired Behavior (L50-70); Documentation Impact (L170-177) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L71-90) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L147-155); Testing Seams (L156-163); Verification Procedure (L164-169); Append-Only Evidence And Execution Log (L178-190); Completion Result (L191-202) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L23-30); Current Verified State (L31-49); Vertical Implementation Slices (L104-146) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L91-97); Dependencies And Blockers (L98-103); Remaining Limitations Or Follow-Up Specs (L203-209); Supersession (L210-213) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `workbench/tools/workbench-layout.mjs`, `workbench/tools/spec-packet.mjs`, `workbench/tools/template-placeholders.mjs`, `tools/test-workbench-layout.mjs`, `tools/test-workbench-dogfood.mjs`, `templates/GENESIS.md`, `AGENTS.md`.

Consumer snapshot: 1 occurrences. Semantic review and retirement approval: **pending**.

### S-020: Bounded Team Coordination (S-020)

Article: [Bounded Team Coordination (S-020)](../../wiki/design-concepts/spec-S-020-spec-native-team-coordination.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-020-spec-native-team-coordination/SPEC.md`.

A small agent team can work concurrently when its assignments have disjoint edit paths. A coordinator partitions the assigned work, names each lane's output and verification, receives proof, and consolidates shared state once. The useful unit of independence is the file and dependency boundary: separate worktrees preserve checkouts, but do not make competing edits to the same runtime or control independent.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L16-21); Desired Behavior (L45-57); Documentation Impact (L174-179) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L58-67) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L149-157); Testing Seams (L158-163); Verification Procedure (L164-173); Append-Only Evidence And Execution Log (L180-190); Completion Result (L191-196) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L22-29); Current Verified State (L30-44); Vertical Implementation Slices (L79-148) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L68-73); Dependencies And Blockers (L74-78); Remaining Limitations Or Follow-Up Specs (L197-201); Supersession (L202-205) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `team templates/README.md`, `team templates/MANAGER.md`, `team templates/SUBAGENT.md`, `tools/team-coordination-demo.mjs`, `tools/test-team-coordination.mjs`, `tools/test-team-coordination-demo.mjs`.

Consumer snapshot: 0 occurrences. Semantic review and retirement approval: **pending**.

### S-021: Portable Workbench Architecture (S-021)

Article: [Portable Workbench Architecture (S-021)](../../wiki/design-concepts/spec-S-021-portable-workbench-v3.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-021-portable-workbench-v3/SPEC.md`.

A Workbench is a filled project with root controls and a manifest-routed support area. Genesis creates a project, Adoption reconciles an existing project, and explicit upgrades carry managed components forward. LLM Workbench is the source product; ordinary operation does not depend on Foundry or a private machine's topology.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L18-27); Desired Behavior (L61-89); Documentation Impact (L339-351) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L90-118) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L283-307); Testing Seams (L308-322); Verification Procedure (L323-338); Append-Only Evidence And Execution Log (L352-364); Completion Result (L365-371) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L28-36); Current Verified State (L37-60); Vertical Implementation Slices (L144-282) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L119-133); Dependencies And Blockers (L134-143); Remaining Limitations Or Follow-Up Specs (L372-378); Supersession (L379-382) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `workbench/manifest.json`, `workbench/tools/workbench-paths.mjs`, `workbench/tools/workbench-layout.mjs`, `tools/workbench-adoption.mjs`, `tools/workbench-upgrade.mjs`, `tools/core-skill-installer.mjs`, `tools/test-workbench-adoption.mjs`, `tools/test-workbench-upgrade.mjs`.

Consumer snapshot: 1 occurrences. Semantic review and retirement approval: **pending**.

### S-023: Manifest And Managed Runtime (S-023)

Article: [Manifest And Managed Runtime (S-023)](../../wiki/design-concepts/spec-S-023-manifest-and-managed-runtime.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-023-manifest-schema-2-and-managed-runtime/SPEC.md`.

Schema 2 declares six support lanes—docs, specs, wiki, sessions, feedback and tools—and the machine-used collections inside them. Consumers resolve these bindings through workbench-paths. An application's root tools directory does not become harness-owned merely because the Workbench has a managed tools lane.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L17-25); Desired Behavior (L46-73); Documentation Impact (L141-147) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L74-90) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L112-120); Testing Seams (L121-128); Verification Procedure (L129-140); Append-Only Evidence And Execution Log (L148-158); Completion Result (L159-171) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L26-33); Current Verified State (L34-45); Vertical Implementation Slices (L101-111) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L91-96); Dependencies And Blockers (L97-100); Remaining Limitations Or Follow-Up Specs (L172-176); Supersession (L177-180) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `workbench/manifest.json`, `workbench/tools/workbench-paths.mjs`, `tools/workbench-tools.mjs`, `tools/test-workbench-tools.mjs`, `tools/test-workbench-layout.mjs`, `workbench/tools/sessions.mjs`, `workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md`, `workbench/docs/adr/0032-manifest-schema-2-declares-lanes-and-collections.md`.

Consumer snapshot: 0 occurrences. Semantic review and retirement approval: **pending**.

### S-024: Governance Claims And Diagnostics (S-024)

Article: [Governance Claims And Diagnostics (S-024)](../../wiki/design-concepts/spec-S-024-governance-core-and-diagnostics.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-024-governance-core-adrs-and-diagnostics/SPEC.md`.

Governance planes classify the role a claim plays in an operation. Intent, Canon, Grounding, Enduring Context, Actuality and Projection do not label entire files as authorities. A Spec can contain accepted requirements, observed results and derived views without making those claims interchangeable.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L17-25); Desired Behavior (L46-63); Documentation Impact (L129-135) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L64-81) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L101-109); Testing Seams (L110-116); Verification Procedure (L117-128); Append-Only Evidence And Execution Log (L136-146); Completion Result (L147-158) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L26-33); Current Verified State (L34-45); Vertical Implementation Slices (L91-100) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L82-86); Dependencies And Blockers (L87-90); Remaining Limitations Or Follow-Up Specs (L159-162); Supersession (L163-166) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `LEXICON.md`, `AGENTS.md`, `workbench/tools/diagnostics.mjs`, `workbench/tools/adr.mjs`, `tools/test-diagnostics.mjs`, `tools/test-governance-core.mjs`, `tools/test-adr.mjs`, `workbench/docs/adr/000A-active-adr-decisions-and-destination-blueprints.md`, `workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md`, `workbench/docs/adr/0029-diagnostics-carry-registered-blocking-semantics.md`.

Consumer snapshot: 0 occurrences. Semantic review and retirement approval: **pending**.

### S-025: Portable Wiki Knowledge (S-025)

Article: [Portable Wiki Knowledge (S-025)](../../wiki/design-concepts/spec-S-025-portable-wiki-and-design-concepts.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-025-portable-wiki-and-design-concepts/SPEC.md`.

The Wiki holds durable explanations with explicit source links. MEMORY.md is its one router; SCHEMA.md and lane guidance define shape, maintenance and handling. Lexicon directs readers to the Wiki when they need a concept explained, and to work owners when they need current assignment or acceptance state.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L17-26); Desired Behavior (L47-65); Documentation Impact (L119-124) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L66-75) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L96-103); Testing Seams (L104-109); Verification Procedure (L110-118); Append-Only Evidence And Execution Log (L125-135); Completion Result (L136-148) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L27-34); Current Verified State (L35-46); Vertical Implementation Slices (L86-95) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L76-81); Dependencies And Blockers (L82-85); Remaining Limitations Or Follow-Up Specs (L149-153); Supersession (L154-157) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `workbench/wiki/SCHEMA.md`, `workbench/wiki/AGENTS.md`, `workbench/wiki/design-concepts/README.md`, `workbench/tools/wiki.mjs`, `tools/test-wiki.mjs`, `workbench/docs/adr/0018-the-wiki-is-the-knowledge-base.md`, `workbench/docs/adr/0030-every-workbench-declares-a-design-concepts-collection.md`.

Consumer snapshot: 0 occurrences. Semantic review and retirement approval: **pending**.

### S-026: Workflow Composition And Cold Continuation (S-026)

Article: [Workflow Composition And Cold Continuation (S-026)](../../wiki/design-concepts/spec-S-026-workflow-composition-and-cold-resume.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-026-workflow-composition-and-cold-resume/SPEC.md`.

A composed workflow carries planning into implementation without depending on the original chat. Controls, the assigned Spec and Tasks, linked knowledge, named verification and a recoverable Git commit provide the continuation route. Skills resolve support paths through the manifest rather than importing private directory assumptions.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L17-25); Desired Behavior (L43-61); Documentation Impact (L117-122) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L62-70) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L91-98); Testing Seams (L99-105); Verification Procedure (L106-116); Append-Only Evidence And Execution Log (L123-133); Completion Result (L134-144) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L26-32); Current Verified State (L33-42); Vertical Implementation Slices (L81-90) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L71-75); Dependencies And Blockers (L76-80); Remaining Limitations Or Follow-Up Specs (L145-148); Supersession (L149-152) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `workbench/tools/sessions.mjs`, `workbench/tools/notepads.mjs`, `tools/test-workbench-round-trip.mjs`, `tools/test-sessions.mjs`, `tools/test-direct-promotion.mjs`, `skills/make-it-so/SKILL.md`, `skills/promote/SKILL.md`, `RUNBOOK.md`.

Consumer snapshot: 0 occurrences. Semantic review and retirement approval: **pending**.

### S-027: Assigned Work, Portable Stances And Delivery Boundaries

Article: [Assigned Work, Portable Stances And Delivery Boundaries](../../wiki/design-concepts/spec-S-027-workbench-v3-1-1-boundaries.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-027-workbench-v3-1-1-boundaries/SPEC.md`.

The normal entry route is `AGENTS.md -> RUNBOOK.md -> LEXICON.md`, followed by the assigned capability and only its relevant context. The Blueprint is loaded for architecture and product direction. An agent investigates missing information inside its assignment and does not invent a new queue item merely because it reaches a gap.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L14-20); Desired Behavior (L40-66); Documentation Impact (L145-151) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L67-89) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L121-130); Testing Seams (L131-138); Verification Procedure (L139-144); Append-Only Evidence And Execution Log (L152-196); Completion Result (L197-215) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L21-25); Current Verified State (L26-39); Vertical Implementation Slices (L106-120) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L90-99); Dependencies And Blockers (L100-105); Remaining Limitations Or Follow-Up Specs (L216-245); Supersession (L246-249) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `AGENTS.md`, `RUNBOOK.md`, `LEXICON.md`, `skills/builder/SKILL.md`, `skills/auditor/SKILL.md`, `skills/reviewer/SKILL.md`, `skills/reconciler/SKILL.md`, `tools/test-governance-core.mjs`, `tools/test-branch-closeout.mjs`, `tools/test-workbench-tools.mjs`, `tools/test-workbench-adoption.mjs`.

Consumer snapshot: 5 occurrences. Semantic review and retirement approval: **pending**.

### S-028: Feedback And Migration Integrity

Article: [Feedback And Migration Integrity](../../wiki/design-concepts/spec-S-028-harness-feedback-integrity.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-028-harness-feedback-integrity/SPEC.md`.

Integrity checks must exercise the paths that consume a declaration rather than ban every occurrence of a legacy-looking string. S-028 rejected a blanket lane-literal linter because migration input, fixtures and explanatory text can legitimately name older locations.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L14-19); Desired Behavior (L34-52); Documentation Impact (L119-124) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L53-67) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L97-105); Testing Seams (L106-112); Verification Procedure (L113-118); Append-Only Evidence And Execution Log (L125-136); Completion Result (L137-144) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L20-25); Current Verified State (L26-33); Vertical Implementation Slices (L84-96) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L68-76); Dependencies And Blockers (L77-83); Supersession (L145-148) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `tools/audit-guardrails.mjs`, `tools/feedback-automation.mjs`, `tools/workbench-adoption.mjs`, `templates/feedback/REPORT_FORMAT.md`, `templates/ADOPTION.md`, `skills/update-harness/SKILL.md`, `tools/test-guardrail-audit.mjs`, `tools/test-feedback-automation.mjs`, `tools/test-workbench-adoption.mjs`.

Consumer snapshot: 1 occurrences. Semantic review and retirement approval: **pending**.

### S-029: Declared Integration And Recoverable Completion

Article: [Declared Integration And Recoverable Completion](../../wiki/design-concepts/spec-S-029-declared-integration-branch.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-029-declared-integration-branch/SPEC.md`.

A review boundary needs a real merge destination. The manifest declares `git.defaultBranch` and `git.integrationBranch` by exact name; controls and runtime resolve that declaration rather than assuming every room uses the same spelling. Exact ref enumeration avoids accepting `Integration` as `integration` merely because a filesystem is case-insensitive. `HEAD` is not a valid declared branch name.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L14-21); Desired Behavior (L84-122); Documentation Impact (L238-249) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L123-145) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L204-212); Testing Seams (L213-223); Verification Procedure (L224-237); Append-Only Evidence And Execution Log (L250-260); Completion Result (L261-319) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L22-43); Current Verified State (L44-83); Vertical Implementation Slices (L162-203) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L146-156); Dependencies And Blockers (L157-161); Remaining Limitations Or Follow-Up Specs (L320-328); Supersession (L329-332) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `workbench/manifest.json`, `workbench/tools/workbench-paths.mjs`, `workbench/tools/spec-workbench.mjs`, `workbench/tools/workbench-layout.mjs`, `tools/workbench-adoption.mjs`, `workbench/docs/adr/0039-the-integration-branch-is-a-manifest-declared-fact.md`, `RUNBOOK.md`, `tools/test-diagnostics.mjs`, `tools/test-workbench-layout.mjs`.

Consumer snapshot: 3 occurrences. Semantic review and retirement approval: **pending**.

### S-030: Mechanical Permission Scope And Declared Lanes

Article: [Mechanical Permission Scope And Declared Lanes](../../wiki/design-concepts/spec-S-030-permission-scope-matches-lanes.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-030-permission-scope-matches-lanes/SPEC.md`.

The permission file and prose edit scope must describe the same effective boundary. A room can otherwise pass document checks while its host asks on every record write or denies a declared authorship lane.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L14-20); Desired Behavior (L68-91); Documentation Impact (L174-183) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L92-106) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L147-153); Testing Seams (L154-161); Verification Procedure (L162-173); Append-Only Evidence And Execution Log (L184-193); Completion Result (L194-269) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L21-36); Current Verified State (L37-67); Vertical Implementation Slices (L119-146) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L107-114); Dependencies And Blockers (L115-118); Remaining Limitations Or Follow-Up Specs (L270-276); Supersession (L277-280) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `templates/.claude/settings.json`, `templates/.claude/README.md`, `workbench/tools/workbench-layout.mjs`, `workbench/tools/diagnostics.mjs`, `RUNBOOK.md`, `tools/test-diagnostics.mjs`, `tools/test-workbench-layout.mjs`.

Consumer snapshot: 2 occurrences. Semantic review and retirement approval: **pending**.

### S-031: Installed Skill Identity And Inspection

Article: [Installed Skill Identity And Inspection](../../wiki/design-concepts/spec-S-031-installed-skill-generation.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-031-installed-skill-generation/SPEC.md`.

A canonical skill source and an installed copy can diverge. A review must name the path and commit it actually read; text from a user discovery root cannot be attributed to the release merely because the skill name matches.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L14-20); Desired Behavior (L69-90); Documentation Impact (L173-180) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L91-106) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L145-152); Testing Seams (L153-159); Verification Procedure (L160-172); Append-Only Evidence And Execution Log (L181-190); Completion Result (L191-245) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L21-41); Current Verified State (L42-68); Vertical Implementation Slices (L118-144) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L107-113); Dependencies And Blockers (L114-117); Remaining Limitations Or Follow-Up Specs (L246-255); Supersession (L256-259) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `tools/skill-marker.mjs`, `workbench/tools/skill-inspection.mjs`, `workbench/tools/workbench-layout.mjs`, `skills/README.md`, `templates/feedback/REPORT_FORMAT.md`, `tools/test-skill-inspection.mjs`, `tools/test-core-skill-installer.mjs`.

Consumer snapshot: 3 occurrences. Semantic review and retirement approval: **pending**.

### S-032: Upgrade Layout Without Replacing Skills

Article: [Upgrade Layout Without Replacing Skills](../../wiki/design-concepts/spec-S-032-upgrade-route-and-source-provenance.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-032-upgrade-route-and-source-provenance/SPEC.md`.

An already-adopted legacy room needs an upgrade route even when replacing its installed skills is not authorized or possible. `upgrade --layout-only` performs the legacy support-root transition with presence-only skill readiness. It does not compare, mark, install, back up or replace skills. The recovery record names lifecycle upgrade, presence-only handling and an empty skill backup list. Explicit skill replacement remains a distinct, mutually exclusive mode.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L14-21); Desired Behavior (L79-102); Documentation Impact (L187-194) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L103-119) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L158-164); Testing Seams (L165-173); Verification Procedure (L174-186); Append-Only Evidence And Execution Log (L195-205); Completion Result (L206-258) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L22-35); Current Verified State (L36-78); Vertical Implementation Slices (L130-157) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L120-125); Dependencies And Blockers (L126-129); Remaining Limitations Or Follow-Up Specs (L259-273); Supersession (L274-277) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `tools/workbench-upgrade.mjs`, `tools/workbench-adoption.mjs`, `tools/workbench-tools.mjs`, `workbench/tools/workbench-layout.mjs`, `skills/update-harness/SKILL.md`, `skills/adoption/SKILL.md`, `RUNBOOK.md`, `tools/test-workbench-upgrade.mjs`, `tools/test-workbench-layout.mjs`, `tools/test-workbench-tools.mjs`.

Consumer snapshot: 2 occurrences. Semantic review and retirement approval: **pending**.

### S-033: Wiki Routing, Version Stamps And Safe Source Reads

Article: [Wiki Routing, Version Stamps And Safe Source Reads](../../wiki/design-concepts/spec-S-033-silent-gap-diagnostics.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-033-silent-gap-diagnostics/SPEC.md`.

A Wiki router is useful only if ordinary entry can reach it. The `room-brain-unrouted` diagnostic checks that the agent contract references the Wiki lane and the public README references MEMORY. It names the missing control route. This is a presence check, not semantic proof that every link leads to useful knowledge.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L14-19); Desired Behavior (L58-73); Documentation Impact (L156-163) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L74-84) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L130-136); Testing Seams (L137-143); Verification Procedure (L144-155); Append-Only Evidence And Execution Log (L164-174); Completion Result (L175-228) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L20-33); Current Verified State (L34-57); Vertical Implementation Slices (L97-129) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L85-92); Dependencies And Blockers (L93-96); Remaining Limitations Or Follow-Up Specs (L229-234); Supersession (L235-238) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `workbench/tools/wiki.mjs`, `workbench/tools/workbench-layout.mjs`, `workbench/tools/workbench-paths.mjs`, `workbench/tools/sessions.mjs`, `workbench/wiki/SCHEMA.md`, `RUNBOOK.md`, `tools/test-wiki.mjs`, `tools/test-sessions.mjs`, `tools/test-diagnostics.mjs`.

Consumer snapshot: 2 occurrences. Semantic review and retirement approval: **pending**.

### S-034: Control Fidelity Without Forced Uniformity

Article: [Control Fidelity Without Forced Uniformity](../../wiki/design-concepts/spec-S-034-control-fidelity-report.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-034-control-fidelity-report/SPEC.md`.

A room may deliberately diverge from its template. Fidelity reporting makes that divergence inspectable instead of treating every local rule as a defect or silently accepting lost qualifiers.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L14-20); Desired Behavior (L56-77); Documentation Impact (L150-156) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L78-90) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L126-133); Testing Seams (L134-139); Verification Procedure (L140-149); Append-Only Evidence And Execution Log (L157-166); Completion Result (L167-227) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L21-32); Current Verified State (L33-55); Vertical Implementation Slices (L101-125) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L91-96); Dependencies And Blockers (L97-100); Remaining Limitations Or Follow-Up Specs (L228-238); Supersession (L239-242) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `tools/control-fidelity.mjs`, `tools/test-control-fidelity.mjs`, `workbench/tools/template-placeholders.mjs`, `templates/ADOPTION.md`, `skills/update-harness/SKILL.md`, `LEXICON.md`, `RUNBOOK.md`.

Consumer snapshot: 3 occurrences. Semantic review and retirement approval: **pending**.

### S-035: Release Candidate Proof And Historical Disposition

Article: [Release Candidate Proof And Historical Disposition](../../wiki/design-concepts/spec-S-035-workbench-v3-1-2-candidate.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-035-workbench-v3-1-2-candidate/SPEC.md`.

A release candidate joins capability delivery, version identity and an account of the feedback it addressed. S-035 coordinated the v3.1.2 candidate after the prerequisite capabilities were complete, measured guardrails without changing criteria, obtained exact-candidate review and proved integration containment. Its recorded PR, commit and score are historical release evidence, not the current Workbench version or a new readiness claim.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L14-21); Desired Behavior (L67-83); Documentation Impact (L154-159) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L84-95) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L132-139); Testing Seams (L140-147); Verification Procedure (L148-153); Append-Only Evidence And Execution Log (L160-169); Completion Result (L170-271) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L22-31); Current Verified State (L32-66); Vertical Implementation Slices (L107-131) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L96-102); Dependencies And Blockers (L103-106); Remaining Limitations Or Follow-Up Specs (L272-283); Supersession (L284-287) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `workbench/tools/workbench-layout.mjs`, `tools/test-workbench-layout.mjs`, `tools/audit-guardrails.mjs`, `AGENTS.md`, `RUNBOOK.md`, `benchmarks/RESULTS.md`.

Consumer snapshot: 8 occurrences. Semantic review and retirement approval: **pending**.

### S-036: Evidence-Bounded Upgrade Claims (S-036)

Article: [Evidence-Bounded Upgrade Claims (S-036)](../../wiki/design-concepts/spec-S-036-evidence-corrections.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-036-v3-1-2-evidence-corrections/SPEC.md`.

Upgrade reports must distinguish what a check observes from what an operator might infer. S-036 corrected an unpublished v3.1.2 candidate where permission visibility, control fidelity and source identity had been overstated. A bounded matcher that cannot interpret a restriction reports uncertainty; it does not establish that a lane is writable.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L14-20); Desired Behavior (L62-88); Documentation Impact (L210-220) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L89-103) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L172-180); Testing Seams (L181-191); Verification Procedure (L192-209); Append-Only Evidence And Execution Log (L221-239); Completion Result (L240-258) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L21-31); Current Verified State (L32-61); Vertical Implementation Slices (L121-171) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L104-113); Dependencies And Blockers (L114-120); Remaining Limitations Or Follow-Up Specs (L259-266); Supersession (L267-270) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `tools/control-fidelity.mjs`, `tools/workbench-tools.mjs`, `workbench/tools/workbench-layout.mjs`, `tools/test-control-fidelity.mjs`, `tools/test-workbench-upgrade.mjs`.

Consumer snapshot: 1 occurrences. Semantic review and retirement approval: **pending**.

### S-037: Line-Ending-Aware Records (S-037)

Article: [Line-Ending-Aware Records (S-037)](../../wiki/design-concepts/spec-S-037-line-ending-agnostic-records.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-037-line-ending-agnostic-records/SPEC.md`.

Portable record readers must accept ordinary LF and CRLF checkouts without requiring each adopted repository to change Git settings. ADR and Wiki parsing share parseFrontmatter, so a correction at that seam applies consistently to both. Parsing normalizes a copy; writers preserve the destination's terminator to avoid an unrelated whole-file diff.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L20-25); Desired Behavior (L61-76); Documentation Impact (L170-175) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L77-88) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L129-137); Testing Seams (L138-147); Verification Procedure (L148-169); Append-Only Evidence And Execution Log (L176-185); Completion Result (L186-206) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L26-41); Current Verified State (L42-60); Vertical Implementation Slices (L104-128) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L89-99); Dependencies And Blockers (L100-103); Remaining Limitations Or Follow-Up Specs (L207-221); Supersession (L222-225) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `workbench/tools/adr.mjs`, `workbench/tools/wiki.mjs`, `tools/workbench-adoption.mjs`, `tools/test-adr.mjs`, `tools/test-wiki.mjs`, `tools/test-workbench-adoption.mjs`.

Consumer snapshot: 0 occurrences. Semantic review and retirement approval: **pending**.

### S-038: Source-Checked Finding Disposition (S-038)

Article: [Source-Checked Finding Disposition (S-038)](../../wiki/design-concepts/spec-S-038-upstream-finding-disposition.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-038-v3-1-2-upstream-fix-list/SPEC.md`.

An upstream finding is evidence to investigate, not an instruction to repair. S-038 reconciled the second v3.1.1 fix list into named capabilities, corrected unsupported report premises, and preserved the release account. Its eleven items were routed to S-039 through S-044; code ownership stayed with those capabilities.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L20-27); Desired Behavior (L139-152); Documentation Impact (L246-253) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L153-169) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L214-229); Testing Seams (L230-236); Verification Procedure (L237-245); Append-Only Evidence And Execution Log (L254-269); Completion Result (L270-375) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L28-40); Current Verified State (L41-138); Vertical Implementation Slices (L185-213) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L170-176); Dependencies And Blockers (L177-184); Remaining Limitations Or Follow-Up Specs (L376-420); Supersession (L421-424) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md`, `tools/audit-guardrails.mjs`, `AGENTS.md`.

Consumer snapshot: 2 occurrences. Semantic review and retirement approval: **pending**.

### S-039: Installed Runtime Integrity (S-039)

Article: [Installed Runtime Integrity (S-039)](../../wiki/design-concepts/spec-S-039-installed-runtime-integrity.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-039-installed-runtime-integrity/SPEC.md`.

An installed room can compare its runtime files with the hashes in its managed-tools receipt. The authoritative expected file set also matters: an empty map, omitted file or unsafe receipt key cannot be allowed to shrink verification silently. The installed workbench-layout runtime owns this check so the room does not need the product's root tools directory to inspect itself.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L20-28); Desired Behavior (L97-112); Documentation Impact (L214-241) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L113-124) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L167-198); Testing Seams (L199-204); Verification Procedure (L205-213); Append-Only Evidence And Execution Log (L242-262); Completion Result (L263-353) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L29-46); Current Verified State (L47-96); Vertical Implementation Slices (L138-166) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L125-133); Dependencies And Blockers (L134-137); Remaining Limitations Or Follow-Up Specs (L354-436); Supersession (L437-440) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `workbench/tools/workbench-layout.mjs`, `tools/workbench-tools.mjs`, `workbench/tools/spec-workbench.mjs`, `tools/test-workbench-tools.mjs`, `tools/test-diagnostics.mjs`, `workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md`.

Consumer snapshot: 2 occurrences. Semantic review and retirement approval: **pending**.

### S-040: Skill Presence And Repair Routes (S-040)

Article: [Skill Presence And Repair Routes (S-040)](../../wiki/design-concepts/spec-S-040-skill-gate-route-selection.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-040-skill-gate-route-selection/SPEC.md`.

A refusal should name the supported way forward. S-040 made presence-only installation recognize a linked destination whose resolved directory already contains the skill, and made shared-skill refusal messages point to the layout-only route where applicable. A directory already present is skipped; this does not grant permission to overwrite unmanaged user content.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L20-27); Desired Behavior (L89-105); Documentation Impact (L196-202) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L106-119) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L163-177); Testing Seams (L178-185); Verification Procedure (L186-195); Append-Only Evidence And Execution Log (L203-219); Completion Result (L220-227) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L28-45); Current Verified State (L46-88); Vertical Implementation Slices (L133-162) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L120-128); Dependencies And Blockers (L129-132); Remaining Limitations Or Follow-Up Specs (L228-276); Supersession (L277-280) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `tools/skill-presence.mjs`, `tools/core-skill-installer.mjs`, `tools/workbench-adoption.mjs`, `tools/workbench-upgrade.mjs`, `skills/update-harness/SKILL.md`, `tools/test-core-skill-installer.mjs`, `workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md`.

Consumer snapshot: 3 occurrences. Semantic review and retirement approval: **pending**.

### S-041: Recorded Baseline Availability (S-041)

Article: [Recorded Baseline Availability (S-041)](../../wiki/design-concepts/spec-S-041-recorded-baseline-availability.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-041-recorded-baseline-availability/SPEC.md`.

A harness-only change may encounter a target with no reproducible green application baseline for a reason the harness change cannot affect. The owner selected record-and-proceed: the owning Spec records an unavailable baseline with evidence and one of the closed reasons host-restricted, product-broken-as-found or owner-declined-on-boundary. An unknown reason is refused.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L20-29); Desired Behavior (L85-109); Documentation Impact (L191-198) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L110-127) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L159-172); Testing Seams (L173-180); Verification Procedure (L181-190); Append-Only Evidence And Execution Log (L199-211); Completion Result (L212-219) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L30-51); Current Verified State (L52-84); Vertical Implementation Slices (L139-158) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L128-133); Dependencies And Blockers (L134-138); Remaining Limitations Or Follow-Up Specs (L220-254); Supersession (L255-258) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `workbench/tools/spec-packet.mjs`, `templates/ADOPTION.md`, `skills/update-harness/SKILL.md`, `tools/test-spec-workbench.mjs`, `AGENTS.md`.

Consumer snapshot: 1 occurrences. Semantic review and retirement approval: **pending**.

### S-042: Installed State Reporting And Repair (S-042)

Article: [Installed State Reporting And Repair (S-042)](../../wiki/design-concepts/spec-S-042-installed-state-repair.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-042-installed-state-repair/SPEC.md`.

Seeded documents and managed runtime files have different ownership. Runtime receipts assert managed-byte identity; a room may legitimately adapt seeded guidance. A separate seed-generation record therefore reports stale seed provenance without turning every local edit into runtime tampering.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L20-27); Desired Behavior (L113-129); Documentation Impact (L244-250) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L130-145) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L206-224); Testing Seams (L225-232); Verification Procedure (L233-243); Append-Only Evidence And Execution Log (L251-281); Completion Result (L282-296) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L28-51); Current Verified State (L52-112); Vertical Implementation Slices (L164-205) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L146-152); Dependencies And Blockers (L153-163); Remaining Limitations Or Follow-Up Specs (L297-332); Supersession (L333-336) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `workbench/tools/workbench-layout.mjs`, `workbench/tools/spec-workbench.mjs`, `workbench/tools/adr.mjs`, `workbench/tools/wiki.mjs`, `tools/test-diagnostics.mjs`, `tools/test-workbench-layout.mjs`, `tools/test-adr.mjs`, `tools/test-wiki.mjs`.

Consumer snapshot: 4 occurrences. Semantic review and retirement approval: **pending**.

### S-043: Diagnostics Ordered By Consequence (S-043)

Article: [Diagnostics Ordered By Consequence (S-043)](../../wiki/design-concepts/spec-S-043-diagnostic-output-legibility.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-043-diagnostic-output-legibility/SPEC.md`.

Doctor's human-readable output groups findings by what they do: blocking, selected-slice constraints, then informational findings. Each populated group has a count. The effect leads the row's severity, so an error with blocks none is visibly distinct from a condition that prevents work.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L20-26); Desired Behavior (L86-97); Documentation Impact (L191-196) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L98-129) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L162-175); Testing Seams (L176-182); Verification Procedure (L183-190); Append-Only Evidence And Execution Log (L197-207); Completion Result (L208-217) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L27-42); Current Verified State (L43-85); Vertical Implementation Slices (L142-161) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L130-137); Dependencies And Blockers (L138-141); Remaining Limitations Or Follow-Up Specs (L218-233); Supersession (L234-237) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `workbench/tools/spec-workbench.mjs`, `workbench/tools/diagnostics.mjs`, `tools/test-diagnostics.mjs`, `workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md`.

Consumer snapshot: 1 occurrences. Semantic review and retirement approval: **pending**.

### S-044: Adoption Preflight And Legacy Classification (S-044)

Article: [Adoption Preflight And Legacy Classification (S-044)](../../wiki/design-concepts/spec-S-044-adoption-and-legacy-classification.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-044-legacy-room-classification/SPEC.md`.

Adoption preflight reports every unreconciled root control in one refusal, with each reason, a reconcile order and a template-overwrite warning. An operator can prepare a complete correction instead of discovering one missing file on each attempt. Scaffolding is not permission to replace a project's actual controls with generic templates.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L20-27); Desired Behavior (L73-86); Documentation Impact (L346-354) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L87-274) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L316-328); Testing Seams (L329-335); Verification Procedure (L336-345); Append-Only Evidence And Execution Log (L355-382); Completion Result (L383-494) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L28-43); Current Verified State (L44-72); Vertical Implementation Slices (L285-315) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L275-280); Dependencies And Blockers (L281-284); Remaining Limitations Or Follow-Up Specs (L495-519); Supersession (L520-523) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `tools/workbench-classify.mjs`, `tools/workbench-adoption.mjs`, `tools/test-workbench-layout.mjs`, `tools/test-workbench-adoption.mjs`, `templates/ADOPTION.md`, `workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md`.

Consumer snapshot: 3 occurrences. Semantic review and retirement approval: **pending**.

### S-045: Linked Follow-Up Reconciliation (S-045)

Article: [Linked Follow-Up Reconciliation (S-045)](../../wiki/design-concepts/spec-S-045-linked-follow-up-reconciliation.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md`.

A completed result can leave an accepted obligation that needs a new owner. S-045 collected seven bounded follow-ups from S-039 through S-044 without reopening their completed implementation records. Dependencies and owner direction became executable work rather than disappearing into historical prose.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L20-38); Desired Behavior (L85-98); Documentation Impact (L232-236) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L99-126) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L152-211); Testing Seams (L212-221); Verification Procedure (L222-231); Append-Only Evidence And Execution Log (L237-260); Completion Result (L261-312) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L39-56); Current Verified State (L57-84); Vertical Implementation Slices (L140-151) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L127-132); Dependencies And Blockers (L133-139); Remaining Limitations Or Follow-Up Specs (L313-338); Supersession (L339-342) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `tools/skill-presence.mjs`, `tools/core-skill-installer.mjs`, `workbench/tools/spec-workbench.mjs`, `tools/test-diagnostics.mjs`, `tools/test-workbench-layout.mjs`, `tools/test-spec-citation-anchors.mjs`, `tools/check-append-only.py`, `AGENTS.md`.

Consumer snapshot: 11 occurrences. Semantic review and retirement approval: **pending**.

### S-046: S-046: JSON Notepad Foundation

Article: [S-046: JSON Notepad Foundation](../../wiki/design-concepts/spec-S-046-json-notepad-foundation.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-046-json-notepad-foundation/SPEC.md`.

A local JSON notepad preserves consequential context while work happens: objective, findings, corrections, uncertainty and the next authorized action. Its purpose is continuation without making the owner reconstruct lost context. The notepad is provisional evidence and never grants authority.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L14-21); Desired Behavior (L53-95); Documentation Impact (L315-323) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L96-135) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L292-302); Testing Seams (L303-307); Verification Procedure (L308-314); TK-001 Verification Account (L324-374); TK-003 Verification Account (L375-429); TK-002 Verification Account (L430-729); v3.2.0 Layout Verification (L730-750); v3.2.0 Authored Handoff And Cleanup Verification (L751-787); Append-Only Evidence And Execution Log (L788-809); Completion Result (L810-834) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L22-27); Current Verified State (L28-52); Source Reconciliation And Promotion (L136-176); Vertical Implementation Slices (L191-276); Renewed v3.2 Notepad Repair (L277-291); Routine Coordination Record (L841-852) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L177-184); Dependencies And Blockers (L185-190); Remaining Limitations Or Follow-Up Specs (L835-840); Supersession (L853-856) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `workbench/tools/notepads.mjs`, `skills/notepad/SKILL.md`, `skills/handoff/SKILL.md`, `tools/test-notepads.mjs`.

Consumer snapshot: 8 occurrences. Semantic review and retirement approval: **pending**.

### S-047: S-047: Visible Workbench Identifiers

Article: [S-047: Visible Workbench Identifiers](../../wiki/design-concepts/spec-S-047-visible-workbench-identifiers.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-047-visible-workbench-identifiers/SPEC.md`.

A visible identifier combines its artifact type prefix with a base-62 value. It is the identity a reader sees, not an additional hidden identity beside a label. Uniqueness is scoped to that type and Workbench; unrelated Workbenches may use the same visible label.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L14-20); Desired Behavior (L35-47); Documentation Impact (L208-212) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L48-55) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | TK-001 Verification Account (L127-150); Acceptance Criteria (L190-197); Testing Seams (L198-202); Verification Procedure (L203-207); Append-Only Evidence And Execution Log (L213-223); Completion Result (L224-236) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L21-26); Current Verified State (L27-34); Vertical Implementation Slices (L66-97); Evaluated Compatibility Defaults (L98-126); TK-002 Consumer Coverage (L151-189) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L56-60); Dependencies And Blockers (L61-65); Remaining Limitations Or Follow-Up Specs (L237-241); Supersession (L242-245) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `workbench/tools/visible-ids.mjs`, `tools/test-visible-ids.mjs`, `tools/test-visible-id-consumers.mjs`, `LEXICON.md`.

Consumer snapshot: 7 occurrences. Semantic review and retirement approval: **pending**.

### S-048: S-048: Checkpoint Retirement And Direct Promotion

Article: [S-048: Checkpoint Retirement And Direct Promotion](../../wiki/design-concepts/spec-S-048-checkpoint-retirement.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-048-checkpoint-retirement/SPEC.md`.

Checkpoint creation was retired while existing checkpoint history and recovery references were preserved. The legacy checkpoint command is a refusal-only compatibility boundary; it does not create new copies.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L14-20); Desired Behavior (L37-51); Documentation Impact (L219-224) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L52-60) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L199-206); Testing Seams (L207-212); Verification Procedure (L213-218); Append-Only Evidence And Execution Log (L225-236); Completion Result (L237-249) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L21-27); Current Verified State (L28-36); Vertical Implementation Slices (L71-113); TK-001 Preservation Account (L114-127); TK-002 Implementation Account (L128-171); TK-003 Recovery Migration (L172-198) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L61-65); Dependencies And Blockers (L66-70); Remaining Limitations Or Follow-Up Specs (L250-255); Supersession (L256-259) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `workbench/tools/sessions.mjs`, `tools/test-sessions.mjs`, `skills/promote/SKILL.md`, `AGENTS.md`.

Consumer snapshot: 6 occurrences. Semantic review and retirement approval: **pending**.

### S-049: S-049: Assignment Ownership And Coordination Records

Article: [S-049: Assignment Ownership And Coordination Records](../../wiki/design-concepts/spec-S-049-assignment-ownership-and-coordination-record.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-049-assignment-ownership-and-coordination-record/SPEC.md`.

The Carry skill owns an assigned Spec or Task through the endpoint already authorized: recover context, execute, verify, reconcile records and deliver to the permitted integration boundary. It cannot expand the assignment or replace an owner-only decision.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L34-46); Desired Behavior (L104-124); Documentation Impact (L238-258) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L125-155) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L185-218); Testing Seams (L219-229); Verification Procedure (L230-237); Append-Only Evidence And Execution Log (L259-276); Completion Result (L277-309) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L47-70); Current Verified State (L71-103); Vertical Implementation Slices (L178-184) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L156-166); Dependencies And Blockers (L167-177); Remaining Limitations Or Follow-Up Specs (L310-336); Supersession (L337-339) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `skills/carry/SKILL.md`, `workbench/manifest.json`, `tools/test-skill-catalog.mjs`, `workbench/tools/workbench-layout.mjs`.

Consumer snapshot: 3 occurrences. Semantic review and retirement approval: **pending**.

### S-051: S-051: Core Skill Ownership And Compatibility

Article: [S-051: Core Skill Ownership And Compatibility](../../wiki/design-concepts/spec-S-051-core-skill-ownership-and-compatibility.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-051-core-skill-ownership-and-compatibility/SPEC.md`.

A core installation needs an identifiable source generation and compatible manifest policy while preserving optional shared skills and project-local ownership. Source content, installed bytes, discovery and actual native invocation are separate checks.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L16-19); Desired Behavior (L34-58); Documentation Impact (L252-255) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L59-75) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Installed Acceptance Receipt (L205-214); Repair Acceptance (added; historical checked evidence retained) (L215-229); Acceptance Criteria (L230-237); Testing Seams (L238-243); Verification Procedure (L244-251); Append-Only Evidence And Execution Log (L256-292); Completion Result (L293-304) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L20-25); Current Verified State (L26-33); Vertical Implementation Slices (L88-194); Authorized Delivery Recovery (L195-204) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L76-82); Dependencies And Blockers (L83-87); Remaining Limitations Or Follow-Up Specs (L305-313); Supersession (L314-317) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `tools/core-skill-installer.mjs`, `tools/test-core-skill-installer.mjs`, `skills/update-harness/SKILL.md`, `workbench/manifest.json`.

Consumer snapshot: 8 occurrences. Semantic review and retirement approval: **pending**.

### S-053: S-053: Configured Host Capabilities

Article: [S-053: Configured Host Capabilities](../../wiki/design-concepts/spec-S-053-configured-host-capabilities.md). Immutable original: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-053-configured-host-capabilities/SPEC.md`.

Configured-host conformance asks what the actual host can do at named command seams. It keeps capability, enforcement and agent reliability separate: a runner operation passing does not establish that an agent discovers the skill or reliably obeys the workflow.

| Claim group | Source sections at baseline | Proposed destination / review obligation |
|---|---|---|
| current | Outcome (L16-19); Desired Behavior (L33-54); Documentation Impact (L123-126) | Article explanation + linked live owners; compare every old requirement before retirement. |
| decision | Decisions And Contracts (L55-63) | Article rationale + named owning controls/ADRs where linked; historical decisions stay recoverable. |
| proof | Acceptance Criteria (L102-108); Testing Seams (L109-114); Verification Procedure (L115-122); Append-Only Evidence And Execution Log (L127-142); Completion Result (L143-157) | Article evidence routes + immutable original evidence; no new test or QA result inferred. |
| historical | Why It Matters (L20-25); Current Verified State (L26-32); Vertical Implementation Slices (L76-101) | Immutable original + article history; preserve original context without making it current. |
| uncertain | Non-Goals (L64-70); Dependencies And Blockers (L71-75); Remaining Limitations Or Follow-Up Specs (L158-164); Supersession (L165-168) | Article limitations + immutable original; resolve missing or superseded claim treatment explicitly. |

Current owner routes: `tools/configured-host.mjs`, `tools/test-configured-host.mjs`, `workbench/specs/S-053-configured-host-capabilities/local-host-result.json`.

Consumer snapshot: 5 occurrences. Semantic review and retirement approval: **pending**.
