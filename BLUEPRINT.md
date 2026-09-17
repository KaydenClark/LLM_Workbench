# LLM Workbench - Blueprint

## Product Destination

LLM Workbench is a portable operating harness through which a person can entrust
an AI agent with a software project. The project itself carries enough product
understanding, authority boundaries, working context and evidence for another
capable agent to continue it without the owner reconstructing the conversation.

## People And Problems Served

The owner supplies intent and consequential decisions. Agents turn that intent
into scoped, verified work and maintain the sources that make it understandable.
The Workbench serves both: it reduces repeated explanation and routine owner
coordination while keeping meaningful choices and publication under human control.
A fresh collaborator can understand the product without reading its whole history.

## Promised Outcomes

An agent can find the right owner, reconstruct the desired result, select the
appropriate behavior and finish the authorized assignment. Decisions retain their
meaning and corrections; unfinished work remains reachable. Verification states
what actually happened, and delivery claims identify the achieved recovery boundary.
The owner can inspect both the product direction and the evidence behind progress.

## Desired Experience And Behavior

An idea reaches delivery along one ladder the owner and the agent can both name:
**Idea -> Align through grilling -> confirmed design concept -> Blueprint ->
recursive Spec/Task delivery.** Align begins from an owner idea and runs through
grilling, drawing on whatever research, brainstorming or wayfinding a named
uncertainty actually requires, and it ends only when owner and agent explicitly
confirm the design concept they now share. That confirmed concept is what gets
blueprinted. A prototype is an option rather than a rung: it sits after the
Blueprint and before a Spec when nothing already in hand settles plausibility,
and its code carries forward only once it meets the same implementation and
verification requirements as any other work.

Ordinary language is sufficient to start deciding, specifying, building or
handing off. An agent follows the [Context Map](LEXICON.md#task-routing), loads
only relevant owners, and resolves routine details without asking the owner to
repeat settled answers. A specification-only request stays specification-only
through every composed skill and every receiving agent.

Grilling records answers and corrections as they arrive. Working notes remain
compact and useful through interruption; a resumed agent checks live state and
continues the same objective. A requested handoff is readable Markdown containing
the job, its boundaries, accessible context and one next action. Failed operations
remain visible and recoverable instead of becoming unsupported completion claims.

## Integrated System Design

The root controls form the entry surface. This Blueprint describes the desired
product, active ADR decisions explain cross-cutting architectural choices, the
Lexicon connects meanings and owners, and Specs and their Tasks carry scoped
delivery and its proof. [Claim-level ownership](workbench/docs/adr/000A-active-adr-decisions-and-destination-blueprints.md)
keeps these surfaces coherent without making a whole file one kind of authority.

Work is described at three altitudes. This Blueprint holds the product-level
destination and the journey toward it, the equivalent of counting to 100. A Spec
is one scoped objective with its own destination, shaped like a product
requirements document: the next number to reach, derived from the Blueprint.
Tasks do the counting, as the bounded executable work that reaches or repairs a
Spec's destination. Stacked Specs realize the journey. Scope chooses the
altitude, not volume: a gap against an existing destination stays corrective
Task work however many Tasks it takes, while a genuinely distinct scoped
objective becomes a new Spec.

Each altitude has one intended home, and none of them is product documentation.
`SPEC.md` and `TASK.md` are transient working artifacts: the Spec states its
objective, acceptance and evidence, the Task owns active execution state, and
the Taskboard projects the hot Tasks rather than owning them. Durable truth
lives elsewhere. This Blueprint owns product direction; the Wiki owns readable
current capability knowledge; ADRs own consequential architectural decisions;
source, tests and assets own implemented actuality and its proof; Git preserves
history. A completed Spec is reconciled into those owners precisely so that
retiring its working artifacts loses nothing.

Branching follows the same altitudes. A Spec branch is cut from the integration
branch, each Task branch is cut from its own Spec branch and worked in a
separate worktree, and proven Task results accumulate in the Spec branch until
that Spec is assembled. A coordinator is the intended model for running
independent Tasks in parallel over that topology; consistent single-Task
execution is what it is built on top of.

A manifest resolves the support collections and managed local runtime. Core skills
compose reusable behavior within the caller's scope. One upstream-owned global
core is shared by provider discovery adapters, alongside independently owned
optional personal skills and project extensions. [Core ownership](workbench/docs/adr/0046-core-personal-shared-and-room-local-skill-ownership.md)
keeps the base independent of a personal catalog.

Local JSON notepads hold unfinished reasoning, source references and corrections.
Supported settled claims move into their durable owners before cleanup. Optional
private transport can carry selected live context across devices with explicit
acknowledgment and conflict preservation; ordinary local work remains independent.

Updating a target project and updating the canonical Workbench have different
drift boundaries. A Workbench update must inspect the Workbench's own controls,
Specs, projections, procedures, manifest, templates and managed artifacts for
stale or contradictory current guidance before and after the update. A
structurally valid render or test run is not semantic freshness proof. The
Workbench is not updated successfully if a memoryless agent could still be
misdirected by an artifact that presents completed work as pending.

## Cross-Cutting Qualities And Constraints

Portability, safe autonomy, source fidelity and recoverability apply throughout.
Plain files and small deterministic local tools support multiple configured hosts.
The system exposes compatibility and unavailable capabilities without silently
replacing personal work or claiming support from file presence alone.

Instructions, accepted design, verified behavior and historical evidence remain
distinguishable. Privacy covers working content and metadata. Unrelated changes,
original decisions, corrections and completed evidence survive migration.
A structural check proves only its boundary; claims of improved agent reliability
require repeated controlled observations with uncertainty and failures preserved.

## Desired Lifecycle

New projects receive a coherent starter; existing projects adopt or explicitly
update it while preserving their product truth and deliberate local differences.

Delivery then repeats one recursive loop. A need in the Blueprint creates a
Spec; the Spec creates its Tasks; the Taskboard projects them; an agent picks up
a hot Task, implements it under red/green TDD, verifies it against real
behavior, and lands that Task branch. The finished Task is reconciled into its
Spec and then retired, and the next hot Task begins. When the Spec is assembled,
a separate context reviews that assembled Spec and the combined Task results.
A review that fails diagnoses the gap and creates corrective Tasks under the
still-open Spec, and a fresh candidate is reviewed; there is no per-Task review
ceremony standing between a Task and its own verification. The integration
branch is the owner's Human QA surface, and passing Human QA is what establishes
that the scoped destination is actually there: no Git merge makes that judgment.
Only then does the Spec close, reconcile into its durable owners with the Wiki
holding the resulting capability knowledge, and retire. Once the exact change is
verified on the default branch, the transient Spec and Task records may be
discarded, Git preserving recoverable history; a later gap against that same
destination is a corrective Task that updates the durable record rather than
resurrecting a retired Spec.

The loop nests at whatever scope the work needs. Failed Human QA returns to
Align and back down the same ladder at the scope that actually missed, without
inferring from one defect that the shared design concept was wrong.

The Workbench Template exercises the same update contract as a real installed
room. Whole-product readiness examines the combined system before owner-controlled
publication. Installation and remote delivery are verified where they occur.

Failures lead to investigation, the smallest supported repair and corrected
records. Working context is saved before it can be lost; cleanups follow verified
reconciliation. Each completed assignment leaves an executable continuation or
truthful completion without a new mandatory coordination system.

## Non-Goals

The Workbench is not a portfolio scheduler, autonomous source of permission,
provider-specific control plane, marketplace, transcript archive or proof that
an agent always follows instructions. It does not require Foundry, a graph
service, a private catalog or network access for ordinary local work. It cannot
guarantee capture after an immediate interruption or move a running process by
synchronizing files. Publication and unrelated project rollout are owner choices.

It does not become a hosted tracker, database, paid service, broad MCP server or
general project-management application. Personal task management and replacement
of Command Information Center are outside its purpose. Startup context has no
permanent Done lane or proof archive; historical tasks are not retrofitted into
manufactured specifications. The portable Workbench does not import Foundry
FUIDs, Job Orders, flights, Claims, orchestration or CIC release machinery.
