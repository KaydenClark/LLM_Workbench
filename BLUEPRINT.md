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

Grilling records answers and corrections as they arrive. Working notes remain
compact and useful through interruption; a resumed agent checks live state and
continues the same objective. A requested handoff is readable Markdown containing
the job, its boundaries, accessible context and one next action. Failed operations
remain visible and recoverable instead of becoming unsupported completion claims.

## Integrated System Design

The root controls form the entry surface. This Blueprint describes the desired
product, active ADR decisions explain cross-cutting architectural choices, the
Lexicon connects meanings and owners, and stable Specs hold scoped delivery and
proof. The Wiki supplies enduring context. [Claim-level ownership](workbench/docs/adr/000A-active-adr-decisions-and-destination-blueprints.md)
keeps these surfaces coherent without making a whole file one kind of authority.

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
Development proceeds through bounded specifications, useful tests, implementation,
owned documentation and independent review of the integration candidate. The
Workbench Template exercises the same update contract as a real installed room.
Whole-product readiness examines the combined system before owner-controlled
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
