# [PROJECT_NAME] - Lexicon

> Generated from LLM Workbench v[HARNESS_VERSION].

**Last reviewed:** [YYYY-MM-DD]
**Status:** [active / partial / stale]

This is the canonical lookup table for terms whose meaning is shared across the
project. Read it when a request, spec, test, or skill uses project language that
could be ambiguous.

## Task Routing

The ordinary entry route is `AGENTS.md` -> `RUNBOOK.md` -> `LEXICON.md`.
Continue to the assigned `SPEC.md` resolved through `workbench/manifest.json`.
Use `BLUEPRINT.md` for architecture and cross-cutting direction; use the
manifest-declared Wiki `MEMORY.md` for task-relevant durable knowledge and the
ADR `REGISTER.md` for decision rationale. Read only the relevant linked owners.
`TASKBOARD.md` is a dashboard, not a prerequisite reading archive.

These are the Context Map's entry routes. Follow the smallest applicable route:

| Need | Route to the owner |
|---|---|
| Artifact jobs, information ownership, and where to ask a question | [Artifact Ownership Schema](#artifact-ownership-schema) |
| Accepted terminology | This Lexicon -> the relevant definition |
| Product destination | [Blueprint](BLUEPRINT.md) |
| Assigned work, evidence, and implementation | [Manifest](workbench/manifest.json) -> assigned stable spec -> its referenced source/tests |
| Complete capability inventory | [Spec catalog](workbench/specs/CATALOG.md) -> stable spec; includes completed history |
| Durable knowledge and design concepts | [Wiki router](workbench/wiki/MEMORY.md) -> relevant note -> its governing sources |
| Decision rationale | [ADR register](workbench/docs/adr/REGISTER.md) -> active decision -> its operational owners; [history](workbench/docs/adr/HISTORY.md) remains explicit |
| Operations and procedures | [Runbook](RUNBOOK.md) -> relevant procedure -> named tool |
| Recovery after interruption or failure | [Runbook](RUNBOOK.md) -> recovery procedure -> existing Spec, source and local working context |

The Wiki retains its single `MEMORY.md` router. This table connects existing
owners; it does not add a second Wiki index or copy their contents.

## Ownership Rules

- Add a term only after the parties agree on its meaning.
- Put project-wide definitions here; keep capability-specific terms in the
  owning spec until they become shared.
- Definitions belong here. Requirements and decisions remain in
  `BLUEPRINT.md` or the owning `SPEC.md`.
- Surface conflicts before changing an established definition.
- Link to detailed sources instead of copying them here.

## Artifact Ownership Schema

An **artifact** is an identifiable document, structured record, source file or
output used by the Workbench. A **responsibility** is the job that needs doing.
An **artifact owner** is the maintained location of a particular kind of truth;
a **maintainer** is the person or assigned agent responsible for keeping it
current. Owning information does not grant permission to change it.

The Workbench Contract spans its existing controls and the assigned Spec; it is
not another document. The following jobs are distinct even when one document
serves several. This is an ownership map, not a requirement to create one file,
agent or workflow stage per row. Paths below use the standard layout; the
manifest resolves an installed project's actual lanes and collections.

### Responsibilities And Lookup

| Job | Definition and owned content | Agent question | Maintained owner / route |
|---|---|---|---|
| **Authority** | Establish who may authorize an action and which instructions apply. | Who can authorize this? | Current user request -> [AGENTS](AGENTS.md#authority-order); the assigned Spec delegates only its bounded capability. |
| **Boundaries** | Limit the authorized action: scope, protected resources, prohibitions, approvals, privacy and external effects. | May I change or expose this? | [AGENTS](AGENTS.md); the current request and assigned Spec may narrow the task. |
| **Destination** | Describe the desired finished product, its people, purpose, experience, outcomes, qualities and non-goals. | What are we trying to build, and why? | [Blueprint](BLUEPRINT.md). |
| **Requirements** | Define the behavior, interfaces, constraints and exclusions of one capability. | What must this capability do? | Assigned stable `SPEC.md` -> Desired Behavior, Decisions And Contracts, Non-Goals. Cross-cutting qualities stay in the Blueprint. |
| **Decisions** | Preserve an accepted choice, its rationale, alternatives, consequences and supersession. | What was decided, and why this choice? | [ADR register](workbench/docs/adr/REGISTER.md) -> active architectural decision; capability-local choices stay in the owning Spec. |
| **Language** | Define shared terms, aliases and distinctions precisely. | What does this word mean here? | This Lexicon; capability-only terms remain in their Spec until shared. |
| **Knowledge** | Explain durable concepts and source-backed context that help a reader understand the project. | What do I need to understand about this? | [Wiki MEMORY](workbench/wiki/MEMORY.md) -> relevant note or Design Concept article -> governing sources. |
| **Navigation** | Connect a question to its smallest relevant information owner. | Where should I look? | This Lexicon's Context Map; Wiki MEMORY routes inside the Wiki; manifest resolves locations. |
| **Work state** | Record assignment, priority, progress, dependencies, blockers, latest event and next gate. | What is happening, who owns it, and what is next? | Owning `SPEC.md` and its tickets; [Taskboard](TASKBOARD.md) displays their generated current view. |
| **Acceptance** | Specify the observable conditions and required proof for declaring an outcome complete. | What would count as done? | Assigned Spec -> Acceptance Criteria and Verification Procedure; AGENTS owns project-wide verification and review obligations. |
| **Evidence** | Record the candidate, method, observer or producer, result, limits and source needed to assess a claim. | What was actually checked, and what does it prove? | Spec evidence log -> named test, review, report or result artifact. Evaluation records own their observations; the Spec links the proof relevant to its acceptance. |
| **Operations** | Govern how authorized work moves through selection, execution, verification, maintenance and delivery. | What operation applies, and what are its entry and exit conditions? | [AGENTS](AGENTS.md) owns lifecycle obligations; [Runbook](RUNBOOK.md) owns the available operations and their prerequisites and expected results. |
| **Procedures** | Describe the repeatable steps, inputs, commands, failure handling and checks for a particular operation. | How do I perform this operation here? | [Runbook](RUNBOOK.md) -> named procedure and tool. A linked Wiki guidebook may hold an extended procedure without copying its governing rules. |
| **Reusable behavior** | Define a method for a recurring kind of work and the posture of a stance. | Which method or stance should I apply? | Runbook -> Behavior Selection -> resolved skill `SKILL.md`; Spec/TASK assigns the normal stance. A skill inherits scope. |
| **Execution** | Carry out the authorized operation in a concrete environment and produce an observable result. | What runs, where does it run, and what happened? | Named source/tool plus actual host configuration own the mechanism; Runbook explains invocation; Spec records the resulting work state and evidence. A procedure is not a run. |
| **Configuration** | Declare paths, identity, dependencies, installed components and host settings. | What is configured here? | [Manifest](workbench/manifest.json), relevant component configuration and ownership receipts; Runbook routes setup and inspection. |
| **Capability** | Establish which operations the configured environment can actually perform and under what limitations. | Can this environment do the requested operation? | Runbook -> named capability check -> actual host/tool and its result. A manifest declaration or installed file alone is insufficient. |
| **Working context** | Preserve unfinished reasoning, corrections, source references and unresolved questions for one objective. | What would otherwise be lost with this conversation? | Local JSON notepad in the manifest-declared collection; `notepad` skill and runtime maintain it. Settled truth moves to its durable owner. |
| **Recovery** | Restore a verified, usable state after interruption or failure and establish a safe continuation point. | What survived, and how can I resume or roll back? | Runbook -> recovery procedure -> existing controls, Spec, source, relevant notepad, and any recovery receipt or backup. Recheck live state before acting. |
| **Handoff** | Transfer the context needed for a specified recipient to continue one objective within inherited scope. | What does this receiving agent need? | Requested local Markdown handoff, authored from accessible owners and relevant notes; it does not replace them or create an assignment. |
| **Feedback** | Preserve observed failures, friction, impact, uncertainties and proposed corrections. | What went wrong, and what should be investigated? | Manifest feedback lane -> occurrence/report -> source evidence. An authorized repair and its disposition belong in the owning Spec. |
| **Evaluation** | Define comparisons and assess whether a change improves outcomes, including costs and uncertainty. | Does this harness help agents complete better work? | Runbook -> Evaluation And Benchmarking -> named evaluation definitions and result ledger; the relevant Spec owns acceptance. Structural checks do not establish agent outcomes. |
| **Provenance and history** | Preserve origins, revisions, producers, corrections and superseded claims without presenting them as current. | Where did this claim or component come from? | The owning artifact's provenance/evidence, Git history, ADR history or component receipt. Retired checkpoints remain history. |
| **Delivery and release** | Establish the verified candidate, integration containment, published version and installed consumer state separately. | Is this change delivered here, or only prepared? | AGENTS owns approval/review boundaries; Runbook owns closeout procedures; the delivery Spec owns proof linked to actual Git, release and installation records. |
| **Human orientation** | Explain what the project is, who it is for, and how a person starts using it. | How do I get started? | [README](README.md), linking operational detail to the Runbook. |

### Artifact Boundaries

The table above identifies where a question is answered. These distinctions
prevent a supporting artifact from silently taking over another job:

| Artifact | Defined job and ownership limit |
|---|---|
| **Root controls** | AGENTS governs agents; Blueprint describes destination; Lexicon defines and routes; Runbook gives operations and procedures; README orients people. TASKBOARD projects Spec state; CLAUDE adapts entry for its host. They are discoverable together, but do not carry equal instruction authority. |
| **SPEC and TASK** | The Spec is the durable capability owner. Its tickets divide delivery into temporary slices. Neither a dashboard nor a local task list replaces their accepted state. |
| **ADR** | An active accepted decision owns architectural Canon; rationale and rejected or superseded alternatives remain distinguishable. Operational owners are named by `canonicalized_in`. |
| **Wiki article and guidebook** | An article owns an explanation; a guidebook owns a linked detailed procedure. Both cite governing sources and cannot authorize work or become a second work tracker. Wiki `SCHEMA.md` owns their structure and maintenance rules. |
| **Manifest, schema, configuration and receipt** | A manifest locates and declares; a schema defines valid record shape; configuration supplies operating values; a receipt records an operation's source and result. Valid shape or recorded installation alone proves neither correct behavior nor current runtime availability. |
| **Skill and host adapter** | A skill owns reusable behavior. An adapter, including `CLAUDE.md`, makes the shared entry or capability usable in a host. Host settings implement only their actual supported controls; they do not redefine project authority. |
| **Source, tool and test** | Source implements behavior, a tool performs an operation, and a test exercises a claim at a defined seam. Tests derive expected behavior from accepted requirements. Observed results establish only the behavior and environment exercised. |
| **Evidence record and feedback report** | Evidence records observations with provenance and limits. A feedback report assembles observations, diagnosis and proposed action while keeping them distinct. Neither accepts its own recommendation. |
| **Notepad, handoff and recovery backup** | A notepad preserves working context; a handoff communicates continuation; a backup/receipt supports restoration. They have separate formats and lifecycles. None owns durable project truth or the whole continuity promise. |
| **Projection and index** | Taskboard, Spec catalog and ADR register/history views point to their source records. Correct the source and regenerate a derived view; an index owns navigation, not the indexed claim. |
| **Template** | A template owns a reusable starting shape. The filled project artifact owns local truth. Template examples and placeholders never become project decisions by being copied. |

Continuity is the result of all these owners remaining coherent and recoverable,
not a responsibility delegated entirely to the notepad or the recovery folder.
Likewise, the Contract is the set of applicable claims, not a synonym for the
Blueprint. Ownership classifies information; authority and Governance Planes
still apply to individual claims in the current operation.

## Workbench Terms

| Term | Definition | Distinction |
|---|---|---|
| **Design concept** | The shared understanding between the parties working on a project about what that project is. | It exists between participants. `BLUEPRINT.md` helps them reconstruct it but is not itself the design concept. |
| **Traverse, don't search** | The core Workbench navigation principle: reach task-relevant context by following links from known entry points to its owners. | Bounded search repairs missing routes or investigates the selected source area; broad rediscovery is not ordinary entry. `AGENTS.md` owns the behavior. |
| **Context Map** | The navigable relationships among Workbench concepts, controls, specs, Wiki context, and referenced source/evidence, entered through this Lexicon's Task Routing. | Existing owners hold the information; any rendered map is a source-derived Projection, not another truth store or authority. No graph service or Obsidian dependency is required. |
| **Workbench self-drift check** | A read-only check of the canonical Workbench's own current-facing artifacts before and after a Workbench update. | It is separate from a target project's drift check; structural render, doctor, or tests alone do not establish semantic freshness. |
| **Blueprint** | The adaptable narrative of the desired finished product: destination, people, outcomes, experience, integrated design, cross-cutting qualities, lifecycle and non-goals. | It supports the design concept; it is not current status, an ADR inventory, a work queue, a glossary, or a proof archive. |
| **Lexicon** | The canonical lookup table for definitions shared across the project. | It owns meanings, not requirements, implementation decisions, or work status. |
| **Spec** | A stable capability record containing scoped intent, requirements, decisions, implementation slices, acceptance, verification, evidence, and completion. | It combines the useful product and engineering roles often split between a PRD and technical spec. |
| **Ticket** | A temporary, one-context tracer-bullet slice inside a spec that produces independently verifiable progress. | It is execution structure, not durable capability history. |
| **Coordination hand-back** | A point during an assigned run where the owner had to supply something that was not a preference, tradeoff, authorization, or unavailable resource under `AGENTS.md`'s governing gate: a settled decision repeated, evidence already in the project located for the agent, a routine technical finding reconciled, or an already-authorized step prompted. | It is a defect in a record, route, skill, or tool, recorded per occurrence with its cause and smallest correction in the assigned spec's evidence log by the `carry` skill. Answering a genuine owner decision is not one, and neither is a new framework built in response to one. `AGENTS.md` Safety And Change Control owns when an owner is asked; these four reasons restate that gate and never widen it. |

## Continuity Terms

| Term | Definition | Distinction |
|---|---|---|
| **Notepad** | A local, objective-scoped JSON working record with a compact editable current view and an append-oriented work record. Grilling records are notepads and therefore JSON. | It is not Canon or permanent history; preserve important material until reconciled. One objective may use several linked notes. |
| **Scoped handoff** | A separate local Markdown (`.md`) compaction authored from the relevant notepad material with plain-language, destination-specific continuation instructions. | A receiving agent can read the file or the owner can paste it into a new chat. It is requested or initiated by the owner; a pointer requires accessible, retained source data. Preservation does not grant authority. |
| **WBID** | The visible identifier comprising an artifact's type prefix and a base-62 value replacing the numeric portion. | Unique within the type and Workbench, not globally; no parallel secondary ID. Existing numeric labels and stable paths remain readable; historical numeric tickets remain spec-qualified, while new letter-bearing tickets reserve the whole Workbench inventory. |

## Stance Terms

| Term | Definition | Distinction |
|---|---|---|
| **Stance** | The method and obligations for performing one assigned task within already established authority. | It is neither an identity nor an authority grant; switching stance creates no handoff. |
| **Builder** | The stance that delivers a scoped, verified result and maintains its documentation. | Implementation includes relevant review and verification. |
| **Auditor** | The stance that checks claims against named evidence and reports a bounded verdict. | An audit does not authorize repairs or release. |
| **Reviewer** | The stance that challenges a candidate's correctness, impact and evidence. | At integration it runs in a separate context; it does not quietly repair the candidate. |
| **Reconciler** | The stance that reconciles achieved work with the state and owners needed for continuation. | It neither manufactures completion nor duplicates truth in a universal handoff. |
| **TASK** | The assigned ticket within a stable SPEC, carrying its normal stance assignment. | No additional task file or queue is introduced. |

## Governance Core

Design-concept routing: a question about what a product, subsystem, or
relationship *is* starts here, then follows the term to the owner-directed
articles in `workbench/wiki/design-concepts/`; the Blueprint and the assigned
spec still decide when a requirement or verified Actuality matters.

Shared by every Workbench. These rows describe roles and boundaries; the
binding behavior lives in `AGENTS.md`, cross-cutting architecture in
`BLUEPRINT.md`, and rationale in the project's `workbench/docs/adr/` collection.

| Term | Definition | Distinction |
|---|---|---|
| **Governance Plane** | The role one claim plays in one operation: **Intent** (the request), **Canon** (the binding current-state rule), **Grounding** (evidence about intended truth or whether work was done correctly), **Enduring Context** (durable reference consulted), **Actuality** (the target being changed, including files, source, runtime, and verified state), and **Projection** (a source-derived report). | Planes classify claims and their use, never whole files, directories, or artifact types. One assigned spec carries Canon, Projection, Grounding, and Enduring Context claims at once. |
| **Workbench Contract** | The logical set of current claims owned by the seven root controls plus the explicitly assigned spec. | It is not a file; no `CONTRACT.md` or other coequal root control exists. |
| **Instruction authority** | What an agent may do: the current owner request, then `AGENTS.md` with platform safety, then the explicitly assigned spec as a bounded capability delegate, then the procedural controls. | An assigned spec cannot enlarge the request, platform safety, or `AGENTS.md` scope; an unassigned spec is evidence. |
| **State resolution** | How a Canon claim and verified Actuality are reconciled: newer Canon is an implementation gap, newer verified Actuality is documentation drift, unclear ordering is an ambiguity to investigate. | Neither "code always wins" nor "Canon proves implementation"; the touched owner is repaired rather than a universal precedence applied. |
| **No-governance-tax rule** | Ordinary owner-directed project work requires only the Workbench Contract and its verification; no coordination system, order form, flight, or external mechanism is a prerequisite. | Available mechanisms a change genuinely needs still apply; the line is availability, not ceremony. |
| **Diagnostic** | A registered finding a Workbench tool emits with a stable code, a severity of `error` or `attention`, a scope, and a blocking effect of `all`, `selection`, `selected-slice`, or `none`. | The consuming command enforces the effect; no artifact chooses whether its own finding blocks. |
| **Support lane** | One of the six manifest-declared slots under lowercase `workbench/`: `docs`, `specs`, `wiki`, `sessions`, `feedback`, `tools`. | A lane is a structural slot, not a plane; the count coincides with the six planes by accident. |
| **Collection** | A manifest-declared, machine-used directory inside a lane: `docs/adr`, `wiki/design-concepts`, `wiki/guidebooks`, `wiki/archive`, `sessions/grilling`, `sessions/handoffs`, `sessions/checkpoints`, `sessions/notepads`, `sessions/notepads/templates`, `sessions/recovery`. | Collection names are lowercase; local notepads may use nested type folders; a collection is never promoted to a lane because its contents differ in kind. |
| **ADR** | An architecture decision record in `workbench/docs/adr/`: title, decision, considered alternatives, consequences, provenance, and frontmatter naming its operational owners. | Active accepted ADR decision claims are architectural Canon; rationale and history remain distinct; `canonicalized_in` names operational owners. |
| **Checkpoint** | A retained historical tracked copy in `sessions/checkpoints/`; new copy creation is retired. | Preserve existing bytes and citations. New claims reconcile into their durable owners; operational recovery is separate. |
| **Operational recovery** | Local rollback receipts and backups in the ignored `sessions/recovery/` collection. | Excluded from notepad discovery and durable provenance; existing historical recovery references remain valid. |
| **Design Concept article** | An owner-authorized, encyclopedic wiki article in `wiki/design-concepts/` explaining one durable cross-cutting design model, ending with `Evidence and Sources` and carrying `History`. | It documents a design concept; it is not the Blueprint, an ADR, a procedure, or task state, and agents suggest or repair it but do not create it. |
| **Wiki profile** | The manifest's declared wiki shape: `project` (one room's memory router and collections) or `deployment` (adds owner, machine, and project pointer collections). | A profile declares routing shape; it grants no authority and copies no live task state. |
| **Managed runtime tool** | A file in `workbench/tools/` installed from the Workbench release and listed in the tools receipt with its source release, commit, and hash. | It is updated only by explicit update with backup and rollback; an application's root `tools/` is application-owned. |
| **Declared integration branch** | The branch, named by exact case in `workbench/manifest.json` `git.integrationBranch`, into which the independent review gate merges task branches; `git.defaultBranch` names the branch it is created from. | A declaration, not a prose convention: controls resolve it from the manifest, `doctor` reports it undeclared or missing without blocking selection, and only generation, adoption, and upgrade completion fail closed on it. |

## Project Terms

| Term | Definition | Distinction / aliases to avoid |
|---|---|---|
| **[TERM]** | [ONE-SENTENCE DEFINITION] | [WHAT THIS IS NOT OR WHICH ALIASES TO AVOID] |

## Continuity And Evidence Boundaries

- **Workbench connection identity:** the stable namespace selected for optional
  private session transport. Clones/worktrees share it; independent rooms differ.
  It is distinct from each visible, type-scoped artifact identifier.
- **Private session transport:** explicitly configured synchronization of selected
  live working records. Private Git retention changes recoverability, not the
  record's authority or durable project ownership.
- **Direct promotion:** deliberate selected-claim reconciliation into a named
  durable owner, with privacy/validity checks and verified destination recovery
  before scoped source cleanup. It is not merely a copy or commit.
- **Configured-host capability:** an operation exercised in the actual host and
  configuration. It does not establish machine enforcement or model reliability.
- **Core compatibility:** the explicit supported range between one selected
  installed global core release and room versions; a version difference alone
  is not proof of incompatibility.
