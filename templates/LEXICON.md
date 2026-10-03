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
| Capability knowledge and retained delivery records | [Wiki features](workbench/wiki/features/README.md) -> maintained capability article; [Spec catalog](workbench/specs/CATALOG.md) -> retained Spec for state and dated proof |
| Landmark Tracker meaning, delivery and availability | This Lexicon -> this room's Wiki concept explanation and accepted decision -> scoped delivery owners -> Runbook procedures and actual manifest/runtime checks; an accepted concept or completed Task does not prove an available operation |
| Durable knowledge and design concepts | [Wiki router](workbench/wiki/MEMORY.md) -> relevant note -> its governing sources |
| Decision rationale | [ADR register](workbench/docs/adr/REGISTER.md) -> active architectural decision -> its operational owners; [DDR register](workbench/docs/ddr/REGISTER.md) -> active destination decision -> its owners; [ADR history](workbench/docs/adr/HISTORY.md) and [DDR history](workbench/docs/ddr/HISTORY.md) remain explicit |
| Workflow altitude, review and lifecycle | [AGENTS review and closure](AGENTS.md#assembled-review-and-corrective-return) -> [Runbook lifecycle](RUNBOOK.md#spec-lifecycle-and-retrieval); follow this room's active ADR routes |
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
| **Decisions** | Preserve an accepted choice, its rationale, alternatives, consequences and supersession. | What was decided, and why this choice? | [ADR register](workbench/docs/adr/REGISTER.md) -> active architectural decision; [DDR register](workbench/docs/ddr/REGISTER.md) -> active destination decision; capability-local choices stay in the owning Spec. |
| **Language** | Define shared terms, aliases and distinctions precisely. | What does this word mean here? | This Lexicon; capability-only terms remain in their Spec until shared. |
| **Knowledge** | Explain durable concepts and source-backed context that help a reader understand the project. | What do I need to understand about this? | [Wiki MEMORY](workbench/wiki/MEMORY.md) -> relevant note or Design Concept article -> governing sources. |
| **Navigation** | Connect a question to its smallest relevant information owner. | Where should I look? | This Lexicon's Context Map; Wiki MEMORY routes inside the Wiki; manifest resolves locations. |
| **Work state** | Record assignment, priority, progress, dependencies, blockers, latest event and next gate. | What is happening, who owns it, and what is next? | Owning `SPEC.md` and its Tasks; [Taskboard](TASKBOARD.md) displays their generated current view. |
| **Acceptance** | Specify the observable conditions and required proof for declaring an outcome complete. | What would count as done? | Assigned Spec -> Acceptance Criteria and Verification Procedure; AGENTS owns project-wide verification and review obligations. |
| **Evidence** | Record the candidate, method, observer or producer, result, limits and source needed to assess a claim. | What was actually checked, and what does it prove? | Spec evidence log -> named test, review, report or result artifact. Evaluation records own their observations; the Spec links the proof relevant to its acceptance. |
| **Operations** | Govern how authorized work moves through selection, execution, verification, maintenance and delivery. | What operation applies, and what are its entry and exit conditions? | [AGENTS](AGENTS.md) owns lifecycle obligations; [Runbook](RUNBOOK.md) owns the available operations and their prerequisites and expected results. |
| **Procedures** | Describe the repeatable steps, inputs, commands, failure handling and checks for a particular operation. | How do I perform this operation here? | [Runbook](RUNBOOK.md) -> named procedure and tool. A linked Wiki guidebook may hold an extended procedure without copying its governing rules. |
| **Reusable behavior** | Define a method for a recurring kind of work and the posture of a stance. | Which method or stance should I apply? | Runbook -> Behavior Selection -> resolved skill `SKILL.md`; Spec/TASK assigns the normal stance. A skill inherits scope. |
| **Execution** | Carry out the authorized operation in a concrete environment and produce an observable result. | What runs, where does it run, and what happened? | Named source/tool plus actual host configuration own the mechanism; Runbook explains invocation; Spec records the resulting work state and evidence. A procedure is not a run. |
| **Configuration** | Declare paths, identity, dependencies, installed components and host settings. | What is configured here? | [Manifest](workbench/manifest.json), relevant component configuration and ownership receipts; Runbook routes setup and inspection. |
| **Capability** | Establish which operations the configured environment can actually perform and under what limitations. | Can this environment do the requested operation? | Runbook -> named capability check -> actual host/tool and its result. A manifest declaration or installed file alone is insufficient. |
| **Evolving concept understanding** | Preserve pre-delivery understanding, its unresolved questions, changes and evidence. | What do we currently understand, and what is still open? | DQCs and landmark records hold the structured account; the Wiki's landmark synthesis pages summarize it as it evolves; generated Tracker presents their relationships and documentation progress. Availability is established by the room runtime, not this definition. |
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
| **SPEC and TASK** | The Spec owns scoped delivery while it and its Tasks are needed as scaffolding. After verified delivery and reconciliation, the implementation and maintained documentation hold enduring capability knowledge. Its Tasks divide delivery into temporary slices, each held in its own `TASK.md`. Neither a dashboard nor a local task list replaces their accepted state. |
| **ADR** | An active accepted decision owns architectural Canon; rationale and rejected or superseded alternatives remain distinguishable. Operational owners are named by `canonicalized_in`. |
| **Wiki** | A directory of agent-written Markdown every agent reads and updates: summaries, entity pages, concept pages, comparisons, an overview and an evolving synthesis, in prose. Its pages are Enduring Context, its schema is Canon, and its raw sources are the Actuality claims of the operation just performed. Every Workbench use reads it and, when the work changed a page, updates it on the agent's branch; Git reconciles. It authorizes nothing. |
| **Wiki article and guidebook** | An article owns an explanation or synthesis; a guidebook owns a linked detailed procedure. Both cite governing sources, may reference identifiers only with the artifact's name and context, and cannot authorize work or become a second work tracker. Wiki `SCHEMA.md` owns their structure, page kinds, ingest, lint and maintenance rules. |
| **Manifest, schema, configuration and receipt** | A manifest locates and declares; a schema defines valid record shape; configuration supplies operating values; a receipt records an operation's source and result. Valid shape or recorded installation alone proves neither correct behavior nor current runtime availability. |
| **Skill and host adapter** | A skill owns reusable behavior. An adapter, including `CLAUDE.md`, makes the shared entry or capability usable in a host. Host settings implement only their actual supported controls; they do not redefine project authority. |
| **Source, tool and test** | Source implements behavior, a tool performs an operation, and a test exercises a claim at a defined seam. Tests derive expected behavior from accepted requirements. Observed results establish only the behavior and environment exercised. |
| **Evidence record and feedback report** | Evidence records observations with provenance and limits. A feedback report assembles observations, diagnosis and proposed action while keeping them distinct. Neither accepts its own recommendation. |
| **DQCs, landmarks and Tracker** | DQCs and landmarks maintain evolving concept understanding; Tracker projects it. They add documentation/alignment coverage without replacing Specs, Tasks, source questions, the ledger or durable knowledge owners. |
| **Notepad, handoff and recovery backup** | A notepad preserves working context; a handoff communicates continuation; a backup/receipt supports restoration. They have separate formats and lifecycles. None owns durable project truth or the whole continuity promise. |
| **Projection and index** | Taskboard, generated Landmark Tracker, Spec catalog and ADR and DDR register/history views point to their source records. Correct the source and regenerate a derived view; an index owns navigation, not the indexed claim. |
| **Template** | A template owns a reusable starting shape. The filled project artifact owns local truth. Template examples and placeholders never become project decisions by being copied. |

Continuity is the result of all these owners remaining coherent and recoverable,
not a responsibility delegated entirely to the notepad or the recovery folder.
Likewise, the Contract is the set of applicable claims, not a synonym for the
Blueprint. Ownership classifies information; authority and Governance Planes
still apply to individual claims in the current operation.

## Workbench Terms

| Term | Definition | Distinction |
|---|---|---|
| **Destination Question Card (DQC)** | A structured, evolving synthesis of related grilling questions about a concept, preserving understanding, unresolved matters, changes, expected results, source lineage and evidence-bearing alignment assessments. | It may exist before a landmark, Spec, Task or known Wiki destination. It is not each individual interview prompt and does not grant authority. It is temporary concept scaffolding: removal requires verified reconciliation of useful understanding, corrections, rationale and lineage into durable owners, with unresolved obligations and live references preserved; a Verified label alone is insufficient. |
| **Landmark** | An evolving account of a feature or framework pillar we are exploring or building toward, and its importance to the Workbench. | It can overlap other landmarks, precede Specs and outlive several Specs. It is not a Spec or PRD and is never itself implemented; Specs and Tasks deliver work. Further landmarks can emerge from DQCs. |
| **Landmark Tracker** | The documentation and alignment view generated from DQCs, landmark records and related source evidence, displaying relationships and distributions across documentation workflow steps. | Tracker monitors documenting; Taskboard monitors implementation. It replaces neither source records nor existing artifacts, and is not a manually assigned card stage or a source of authority. The installed view still prints Idea, Aligning, Confirmed, Mapped, Planned, Journey, Review and Verified; these evidence-assessed distributions describe documentation progress, not effort, Task state or runtime availability. |
| **Landmark Wiki page** | The landmark's evolving synthesis page: a coherent, human-readable Markdown summary of what its question cards add up to, updated whenever a card changes. | Several Specs may contribute to one article. Identifiers appear only with the artifact's name and context. The structured records keep lineage and state; the page keeps the readable account; its claims remain subject to existing ownership and authority rules. |
| **Expected result** | The intended change or knowledge to become durable once a question is answered, naming the destination when known. | Result describes achieved delivery, separately from intended Expected result; neither a Result field nor a completed Task establishes Verified. An unanswered question need not have an expected answer or a predetermined destination. These meanings do not establish that a room exposes a Result-writing operation. |
| **Design concept** | The shared understanding between the parties working on a project about what that project is. | It exists between participants. `BLUEPRINT.md` helps them reconstruct it but is not itself the design concept. |
| **Traverse, don't search** | The core Workbench navigation principle: reach task-relevant context by following links from known entry points to its owners. | Bounded search repairs missing routes or investigates the selected source area; broad rediscovery is not ordinary entry. `AGENTS.md` owns the behavior. |
| **Map** | A low-resolution index around a Spec destination, showing decisions so far, Fog and out-of-scope work. | It links to the artifacts that own the detail rather than creating a second file or truth store; it is distinct from the project-wide Context Map. |
| **Decisions so far** | The Map's concise index of conclusions, linked to their current owners and evidence. | Durable reasoning remains in its owning artifact; the Map does not copy it. |
| **Fog** | Anticipated work toward a destination that cannot yet be stated as a precise decision question. | It becomes plannable when the question can be phrased, not only when its answer is known. Deliberately excluded work stays out of scope. |
| **Frontier** | The open, unblocked and unclaimed Tasks at the edge of the current Map. | Taskboard projects implementation work across Specs; Landmark Tracker separately shows evolving documentation and understanding. Neither view authors the source state. |
| **Align** | The inquiry in which an owner idea becomes a shared design concept explicitly confirmed by owner and agent. | Grilling supports that inquiry; confirmation precedes the authorized documentation or delivery endpoint and is not itself implementation permission. |
| **Context Map** | The navigable relationships among Workbench concepts, controls, specs, Wiki context, and referenced source/evidence, entered through this Lexicon's Task Routing. | Existing owners hold the information; any rendered map is a source-derived Projection, not another truth store or authority. No graph service or Obsidian dependency is required. |
| **Workbench** | A room: the operating harness that gives agents safe rules, progressively disclosed project truth, executable work, and proof requirements, made of one set of Contract and routing artifacts with exactly one Blueprint. A Workbench can hold many other Workbenches and many Projects, and each Project it holds has its own Workbench, so rooms nest. | It governs the workflow; it is not the product being built. Nesting is the destination; a room may not yet have tooling for holding other Workbenches. A Workbench relates to Workbenches one-to-many and to Projects one-to-many; a Project relates to its own Workbench one-to-one. |
| **Project** | What is being done in a room: the product or body of work a Workbench exists to deliver. | Every Project has exactly one Workbench of its own. The Project is the work; the Workbench is the harness around it. |
| **Portable Workbench** | A fully packaged, deployable agent harness. Everything an agent needs to do the work is in the project's Git repository, so any agent on any machine, or several at once in the cloud, can clone it, do the authorized work, push it, and clean up after itself. Nothing the agent needs lives only on the owner's machine. | It describes the repository, not a host or a session. Host portability and the support root are things it depends on, not the thing itself. |
| **Host portability** | The property that the Workbench's plain files and tools behave the same on every configured host: case-sensitive and case-insensitive filesystems, Windows and POSIX paths, symlinked invocation. | One thing a Portable Workbench depends on; it is not the Portable Workbench itself. |
| **Ownership origin model** | The model of where an ownership assignment comes from, upstream Workbench or project-local, and of how a room's deliberate differences from upstream are classified and preserved across updates. | About upgrade compatibility between upstream and a room, not about a Portable Workbench. |
| **Workbench self-drift check** | A read-only check of the canonical Workbench's own current-facing artifacts before and after a Workbench update. | It is separate from a target project's drift check; structural render, doctor, or tests alone do not establish semantic freshness. |
| **Blueprint** | The adaptable narrative of the desired finished product: destination, people, outcomes, experience, integrated design, cross-cutting qualities, lifecycle and non-goals. A Workbench has exactly one Blueprint, and a Blueprint has many Specs and many Tasks. | It supports the design concept; it is not current status, an ADR or DDR inventory, a work queue, a glossary, or a proof archive. It is written before the decisions that follow it and links no record that carries an identifier (an ADR, DDR, Spec, Task or landmark); a decision record that changes it names it in `canonicalized_in` instead. |
| **Lexicon** | The canonical lookup table for definitions shared across the project. | It owns meanings, not requirements, implementation decisions, or work status. |
| **Spec** | A PRD-shaped scoped objective with its own destination, derived from Blueprint needs, active ADRs, verified Actuality and required evidence. It owns requirements, decisions, acceptance, verification, evidence and completion while needed for delivery. | A Spec has many Tasks and Chats. Tasks reach its destination; useful knowledge moves to maintained durable owners after verified delivery. TASK.md owns each active Task state and proof; the Spec holds capability state and gates. Record-backed Tasks live under `tasks/`; table-backed compatibility and completed tables remain readable history. See AGENTS review/closure and Runbook lifecycle. |
| **Task** | One bounded executable thin vertical slice that reaches or repairs a destination, with its own state, proof, blockers and assigned stance in TASK.md. Its Worker self-checks and hands back. One Task is intended for one useful context and one Chat. | It is temporary execution structure. A correction against the same reconciled capability updates its Wiki claim without resurrecting the Spec; a different destination calls for a new Spec. Small direct Blueprint Tasks remain accepted destination design with no delivered home; today ordinary Tasks are Spec-bound and Wiki-claim corrective records are supported. AGENTS carries the room's actual branch route and any accepted exception. |
| **Packet** | The bounded Task entry material: TASK.md, the active Spec acceptance lines it satisfies or the reconciled Wiki claim for corrective work, cited source/test paths and the Contract. A Scoped handoff and objective notepad join only when they exist. | Required material remains executable from tracked owners; optional local untracked context neither authorizes work nor proves claims. Traverse the owning Spec or Wiki rather than copying its body into the Packet. A corrective Packet does not resurrect a discarded Spec. |
| **Assembled-Spec review** | Destination-level verification of the complete Task results: the Dispatcher owns whole-Spec QA and a separate Director reviews the immutable assembled candidate before integration. | Worker self-check is not independent approval. Failed review preserves original Task proof and creates corrective Tasks under the still-open Spec; the fresh assembled candidate needs review. [AGENTS](AGENTS.md#assembled-review-and-corrective-return) owns the obligation. |
| **Human QA** | The owner-led evaluation of delivered work, whose timing the owner chooses at useful milestones, accumulated work, valued Specs or escalations; failed findings remain visible until resolved. | Version cadence is a default, not the sole trigger. Actual per-Spec content-bound approval is distinct from monitoring or a green suite; only the owner promotes integration to main. Failure returns to Align and delivery at the implicated scope, without assuming every defect changes design. |
| **Retired** | A transient staging location for reconciled Spec and Task scaffolding, removed from ordinary pickup while needed history remains reachable. | Its useful content reaches durable owners; discard requires closure/capture, verified main containment, clean current-reference checks and recovery identity. Task progress remains distinct from folder lifecycle. |
| **Archive** | Permanent storage for superseded and deprecated decision records (ADRs and DDRs), preserving their original bodies and reachable decision history. | It is never cleared by transient Spec/Task cleanup; each decision-record register routes active decisions and its history routes retained alternatives. |
| **Chat** | One owner-visible working context in a host, in which participants have a Conversation. A Chat works at most one Task: a Chat that works a Task completes it, cleans up and ends. | A Chat is not a Task, assignment, durable record, or authority boundary, and it never works several Tasks. Directing, review and grilling Chats work no Task. Several related Chats may belong to one Thread. |
| **Conversation** | The human-agent exchange taking place in a Chat. | It is ordinary descriptive language, not another artifact or workflow level; durable state must still reach its owning project record. |
| **Thread** | A connected series or tree of related Chats. | It groups conversational continuity only. It does not replace a Spec, Task dependency, notepad, handoff, or project work owner. |
| **Role** | The assigned scope of responsibility and action for an agent. | Director covers the project/integration, Dispatcher its Spec/branch, and Worker its Task. Branches express work scope; the request and controls still establish permission. |
| **Director** | The role scoped to the whole project and its integration branch: it coordinates Spec-bound Dispatchers and cross-Spec work. | It oversees independent review before integration and escalates owner choices. The owner remains the human above the Director; Human QA and main promotion remain owner acts. It never executes a Task or acquires authority merely by occupying a branch. |
| **Dispatcher** | The role scoped to one assigned Spec and its branch, coordinating parallel Task work and owning assembled-Spec verification. | It uses an assigned Spec Planner, Spec Manager, Reviewer or Auditor stance for the job within that scope. It does not take responsibility for neighboring Specs or independently approve its own assembled candidate. The broader direct-Blueprint-Task design remains separately owned; this minimum role buildout is Spec-bound. |
| **Worker** | The role scoped to one assigned Task and one attempt, producing a self-checked result and hand-back to its Dispatcher. | The assigned job can be implementation or Task-authoring assistance. A working Chat performs at most one Task; no new per-Task approval ceremony is implied. Shared Spec state retains one durable writer; a Worker cannot independently approve a candidate it implemented. |
| **Ticket** | Retired as a live term. `Task` names the execution slice. | Historical `TK-###` identifiers stay readable exactly as written in append-only evidence and are never rewritten; `TK` is the Task identifier prefix, so newly allocated slices keep the `TK-###` form. |
| **Coordination hand-back** | A point during an assigned run where the owner had to supply something that was not a preference, tradeoff, authorization, or unavailable resource under `AGENTS.md`'s governing gate: a settled decision repeated, evidence already in the project located for the agent, a routine technical finding reconciled, or an already-authorized step prompted. | It is a defect in a record, route, skill, or tool, recorded per occurrence with its cause and smallest correction in the assigned spec's evidence log by the `carry` skill. Answering a genuine owner decision is not one, and neither is a new framework built in response to one. `AGENTS.md` Safety And Change Control owns when an owner is asked; these four reasons restate that gate and never widen it. |

### Feedback Dispositions

Every feedback finding has exactly one disposition from this closed set, recorded
in its owning Spec. The report points to that owner and the supporting evidence.

- **diagnostic** — a registered doctor code with mandatory remediation text.
- **test** — a check added at a stable testing seam.
- **repaired** — a direct code, configuration or documentation fix, named by its commit, that did not become a registered diagnostic or stable-seam test.
- **declined** — not pursued, with the reason recorded.
- **accepted-open** — real and accepted but not scheduled, naming the owning Spec; if no owner is established, report that gap explicitly.

A disposition describes the supported outcome; it neither schedules a repair
nor grants permission. A report and finding ID together identify an occurrence.


## Continuity Terms

| Term | Definition | Distinction |
|---|---|---|
| **Notepad** | A local, objective-scoped JSON working record with a compact editable current view and an append-oriented work record. Grilling records are notepads and therefore JSON. Where available DQC and landmark operations maintain current concept understanding, grilling notepads become more historical and handoff-like, retaining useful origins, corrections and continuation context. Otherwise the existing notepad runtime preserves working understanding; creating a card never licenses discarding needed notes. | It is not Canon or permanent history; preserve important material until reconciled. A note belongs to its objective, not to the Chat, model or host that created it, and every context that can reach it resumes it, one writer at a time. One objective may use several linked notes for distinct purposes. |
| **Scoped handoff** | A separate local Markdown (`.md`) compaction authored from the relevant notepad material with plain-language, destination-specific continuation instructions. | A receiving agent can read the file or the owner can paste it into a new chat. It is requested or initiated by the owner; a pointer requires accessible, retained source data. Preservation does not grant authority. |
| **WBID** | The visible identifier comprising an artifact's type prefix and a value replacing the numeric portion. New Spec, Task, ADR and notepad values use uppercase `0-9A-Z`, minimum width four, with at least one letter. | Unique within the type and Workbench, not globally; no parallel secondary ID. Every spelling of one identity (short, widened or case variant, compared case-folded without leading zeros) is one WBID, reserved once and resolved to the one record. Existing numeric, short and mixed-case labels and their paths remain readable; an open Spec or Task widens only through the explicit `widen-id` touch, which keeps its former ID. Historical numeric slice identifiers remain spec-qualified, while new letter-bearing ones reserve the whole Workbench inventory. Workbench connection identities keep their separate base-62 format. |

## Stance Terms

| Term | Definition | Distinction |
|---|---|---|
| **Stance** | The job, method and obligations applied within an assigned role scope. | Role answers where responsibility applies; stance answers what job is performed there. A stance neither grants authority nor creates independence or an agent by being loaded. |
| **Spec Planner** | The stance that plans small Tasks and parallel vertical slices for one Spec at flight launch. | A Dispatcher may dispatch Workers to help author Tasks, then reconciles their drafts and hands the plan to Spec Manager. Its operating capability is specified separately from the Dispatcher role. |
| **Spec Manager** | The stance that dispatches and monitors execution of planned Task groups within one Spec. | A Dispatcher manages safe parallel work, hand-backs and assembled verification, escalating cross-Spec coordination to the Director. Its operating capability is specified separately from Spec Planner. |
| **Builder** | The stance that delivers a scoped, verified result and maintains its documentation. | Implementation includes relevant review and verification. |
| **Auditor** | The stance that checks claims against named evidence and reports a bounded verdict. | An audit does not authorize repairs or release. |
| **Reviewer** | The stance that challenges a candidate's correctness, impact and evidence. | At integration it runs in a separate context; it does not quietly repair the candidate. |
| **Reconciler** | The stance that reconciles achieved work with the state and owners needed for continuation. | It neither manufactures completion nor duplicates truth in a universal handoff. |
| **TASK** | The assigned Task within a SPEC, carrying its normal stance assignment. | Defined in Core Terms above; listed here only because the assignment is where a stance is set. |

## Governance Core

Design-concept routing: a question about what a product, subsystem, or
relationship *is* starts here, then follows the term to the
articles in `workbench/wiki/design-concepts/`; the Blueprint and the assigned
spec still decide when a requirement or verified Actuality matters.

Shared by every Workbench. These rows describe roles and boundaries; the
binding behavior lives in `AGENTS.md`, cross-cutting architecture in
`BLUEPRINT.md`, architectural rationale in the project's `workbench/docs/adr/`
collection and destination decisions in its `workbench/docs/ddr/` collection.

| Term | Definition | Distinction |
|---|---|---|
| **Governance Plane** | The role one claim plays in one operation: **Intent** (the request), **Canon** (the binding current-state rule), **Grounding** (evidence about intended truth or whether work was done correctly), **Enduring Context** (durable reference consulted), **Actuality** (the target being changed, including files, source, runtime, and verified state), and **Projection** (a source-derived report). | Planes classify claims and their use, never whole files, directories, or artifact types. One assigned spec carries Canon, Projection, Grounding, and Enduring Context claims at once. |
| **Workbench Contract** | The logical set of current claims owned by the seven root controls plus the explicitly assigned spec. | It is not a file; no `CONTRACT.md` or other coequal root control exists. |
| **Instruction authority** | What an agent may do: the current owner request, then `AGENTS.md` with platform safety, then the explicitly assigned spec as a bounded capability delegate, then the procedural controls. | An assigned spec cannot enlarge the request, platform safety, or `AGENTS.md` scope; an unassigned spec is evidence. |
| **State resolution** | How a Canon claim and verified Actuality are reconciled: newer Canon is an implementation gap, newer verified Actuality is documentation drift, unclear ordering is an ambiguity to investigate. | Neither "code always wins" nor "Canon proves implementation"; the touched owner is repaired rather than a universal precedence applied. |
| **No-governance-tax rule** | Ordinary owner-directed project work requires only the Workbench Contract and its verification; no coordination system, order form, flight, or external mechanism is a prerequisite. | Available mechanisms a change genuinely needs still apply; the line is availability, not ceremony. |
| **Diagnostic** | A registered finding a Workbench tool emits with a stable code, a severity of `error` or `attention`, a scope, and a blocking effect of `all`, `selection`, `selected-slice`, or `none`. | The consuming command enforces the effect; no artifact chooses whether its own finding blocks. |
| **Support lane** | One of the seven manifest-declared slots under lowercase `workbench/`: `docs`, `specs`, `wiki`, `sessions`, `feedback`, `tools`, `skills`. | A lane is a structural slot, not a plane. |
| **Skills lane** | The `workbench/skills` lane: the core skills tracked inside this room, marked by a receipt naming their source release, commit and hash, and replaced only by the Workbench update. The tracked `.agents/skills` and `.claude/skills` links resolve into it. | A skill this room adds under another name is room-owned and never replaced by the update; a personal skills catalog is never on this room's critical path. |
| **Collection** | A manifest-declared, machine-used directory inside a lane: `docs/adr`, `wiki/design-concepts`, `wiki/guidebooks`, `wiki/archive`, `sessions/grilling`, `sessions/handoffs`, `sessions/checkpoints`, `sessions/notepads`, `sessions/notepads/templates`, `sessions/recovery`, and the additive `wiki/features` and `docs/ddr`. | Collection names are lowercase; local notepads may use nested type folders; a collection is never promoted to a lane because its contents differ in kind. |
| **ADR** | An architecture decision record in `workbench/docs/adr/`: title, decision, considered alternatives, consequences, provenance, and frontmatter naming its operational owners. | Active accepted ADR decision claims are architectural Canon; rationale and history remain distinct; `canonicalized_in` names operational owners. |
| **Decision Record** | A record of one consequential decision and why it was made: an ADR for an architectural choice and a DDR for a destination choice. | Both are atomic, superseded whole and managed alike by one tool, `adr.mjs`, which creates, validates, registers, accepts, supersedes, deprecates and reads both. The test that chooses between them: would the choice still hold if the architecture were rebuilt differently? Yes is a DDR. One decision that needs both records links them rather than merging them. |
| **DDR** | A Destination Decision Record in `workbench/docs/ddr/`: one consequential choice about what the finished product must be or do, and why it was chosen over the alternatives, with the frontmatter keys `date`, `supersedes` and `canonicalized_in` and a free-prose body. | An active accepted DDR owns destination Canon beside the ADR; it serves a destination goal rather than an architecture choice. Lifecycle is its folder, as for an ADR: `proposed/`, the accepted top level, and the permanent `archive/`. `adr.mjs new --kind ddr` writes the next one into `proposed/`. A DDR that changes or contradicts the Blueprint names `BLUEPRINT.md` in `canonicalized_in`, which never names the Wiki; the Wiki cites it and keeps no page per DDR. It is not a Blueprint paragraph. |
| **Read words** | The five kinds of read every record is to answer, defined once: **list** (the records that exist), **show** (one whole record; `get` is an accepted synonym), **search** (records found by a query), **history** (how a record changed) and **inspect** (part of a record, a field or a range). | Create, Read, Update and Delete remain the frame; what kind of each a tool needs differs. `capture` is Create, not a read. The decision-record tool answers all five for ADRs and DDRs; other tools gain them as they are revised, and existing command names keep working. |
| **Checkpoint** | A retained historical tracked copy in `sessions/checkpoints/`; new copy creation is retired. | Preserve existing bytes and citations. New claims reconcile into their durable owners; operational recovery is separate. |
| **Operational recovery** | Local rollback receipts and backups in the ignored `sessions/recovery/` collection. | Excluded from notepad discovery and durable provenance; existing historical recovery references remain valid. |
| **Design Concept article** | An encyclopedic wiki article in `wiki/design-concepts/` explaining one durable cross-cutting design model or one landmark's evolving synthesis, ending with `Evidence and Sources` and carrying `History`. | It documents a design concept; it is not the Blueprint, an ADR, a procedure, or task state. Any agent creates or updates it in an authorized operation whose work touched it; the collection itself remains required. |
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
