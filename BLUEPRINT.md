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

Ordinary language is sufficient to start deciding, specifying, building or
handing off. An agent follows the [Context Map](LEXICON.md#task-routing), loads
only relevant owners, and resolves routine details without asking the owner to
repeat settled answers. A specification-only request stays specification-only
through every composed skill and every receiving agent.

One ladder carries an idea to delivered software, and an agent can always say
which rung the work is on: an owner idea, Align through grilling, a confirmed
design concept, the Blueprint, then recursive Spec and Task delivery.

Align begins with an owner idea and proceeds through grilling. It reaches for
research, brainstorming and wayfinding only as far as a named uncertainty
requires, and it ends when owner and agent explicitly confirm a shared design
concept. That confirmed concept is what gets blueprinted, so nothing is
specified from an understanding the two have not agreed on. A prototype is
optional rather than a standard rung: it sits after the Blueprint and before a
Spec, where existing evidence cannot settle whether an approach is plausible,
and prototype code carries forward into the product only once it meets the same
implementation and verification requirements as any other work.

Grilling records answers and corrections as they arrive. Working notes remain
compact and useful through interruption; a resumed agent checks live state and
continues the same objective. A requested handoff is readable Markdown containing
the job, its boundaries, accessible context and one next action. Failed operations
remain visible and recoverable instead of becoming unsupported completion claims.

## Integrated System Design

The root controls form the entry surface. This Blueprint describes the desired
product, active ADR decisions explain cross-cutting architectural choices, the
Lexicon connects meanings and owners, and the Wiki supplies readable current
capability knowledge. [Claim-level ownership](workbench/docs/adr/000A-active-adr-decisions-and-destination-blueprints.md)
keeps these surfaces coherent without making a whole file one kind of authority.

Delivery is designed at three altitudes. The Blueprint is the product-level
destination and the journey that reaches it: the whole of counting to 100. A
Spec is one scoped objective with its own destination, PRD-shaped, the next
number to reach. Tasks do the counting; a Task is the bounded executable work
that advances a destination or repairs it. Stacked Specs realize the Blueprint
journey. Scope and destination decide where work belongs, never how much work
it turns out to be: a gap against a destination that already exists is
corrective Task work however many Tasks it takes, and a distinct scoped
objective with a destination of its own warrants a new Spec.

Each of these truths has a durable owner, and no working file is one of them.
The Blueprint owns product direction; the Wiki owns readable current capability
knowledge; ADR records own consequential architectural decisions; source, tests
and assets own implemented actuality and its proof; Git preserves recoverable
history. `SPEC.md` and `TASK.md` are transient working artifacts that carry
scope, state and evidence while their work is under way, and a later reader
depends on the durable owners rather than on them.

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

Delivery then repeats one loop. A need in the Blueprint creates a Spec; the Spec
creates its Tasks; the Taskboard projects their state so the next hot Task is
visible without reading the whole board. An agent picks up that hot Task,
implements it with red/green TDD, verifies the behavior that actually resulted,
and lands the proven Task branch. The finished Task is reconciled into its Spec
and then retired out of ordinary discovery, and the next hot Task follows, until
the Spec is assembled.

An assembled Spec is checked in a separate context against its own destination
and the combined results of its Tasks; that is where independent review belongs,
rather than in a ceremony repeated for every Task. A review that fails diagnoses
the gap and creates corrective Tasks under the still-open Spec, and the fresh
candidate is reviewed again. Once review passes, the owner performs Human QA on
the integration branch, which is the surface where the owner sees whether the
scoped destination is genuinely there. No Git merge closes a Spec; the owner's
confirmation does. A closed Spec is reconciled into its durable owners, the Wiki
holding the current capability knowledge a later reader needs, and is then
retired, with Git keeping the history recoverable. A later gap against that same
destination is a corrective Task that updates the reconciled record instead of
reviving a closed Spec.

Branch topology follows the same altitudes. A Spec branch is cut from the
integration branch, each Task branch is cut from its Spec branch and worked in
its own worktree, and proven Task results accumulate in the Spec branch until
the assembled Spec is reviewed and reaches the owner.

Failed Human QA returns to Align at whatever scope the failure actually
implicates, and the design-concept and delivery loop runs again from there. A
defect is not by itself evidence that the shared design concept was wrong, and
the loop is chosen at the scope the diagnosis supports.

Parallel work is coordinated rather than improvised: a coordinator hands
independent Tasks to separate agents and keeps a single durable writer for
shared state. That is the intended model beyond consistent single-Task
execution, and no ordinary assignment depends on it.

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
