# LLM Workbench Blueprint

## Product Destination

LLM Workbench is a reusable, local-first operating harness that lets people
direct AI-assisted project work safely without turning every task into a
coordination project. A finished Workbench gives an agent enough product truth,
bounded authority, executable work, and proof requirements to advance a real
project while preserving the difference between decisions, evidence, and live
state.

It is intended to be adaptable through use: the narrative names the destination
and durable whole-product constraints, while implementation and current state
remain in their named owners.

## People And Problems Served

The Workbench serves a project owner who wants capable autonomous assistance
without surrendering architectural control, source lineage, or release
authority. It also serves agents and reviewers who need a small dependable
entry route instead of rediscovering a repository or mistaking historical
material for an instruction.

The product solves two linked problems: carrying enough context to work safely
across sessions, and proving what actually changed before that work is relied
upon. It makes uncertainty visible instead of translating a green local check
into an unsupported deployment, enforcement, or agent-reliability claim.

## Promised Outcomes

- An agent can enter through `AGENTS.md`, `RUNBOOK.md`, and `LEXICON.md`, then
  traverse to only the owners needed for the assigned work.
- The owner can express a desired destination in this Blueprint, make durable
  architectural choices through active ADRs, and receive scoped Specs that move
  verified Actuality toward that destination.
- Work remains recoverable: source, controls, specs, tests, evidence, and safe
  objective notes retain their distinct roles and can be read back.
- A reusable Workbench Template can receive the current rules without carrying
  an unrelated product story. A named real project is updated only when its
  owner explicitly requests it.

## Desired Experience And Behavior

The Workbench should feel direct rather than ceremonial. Required steps have
immediate delivery value; diagnostics explain their effect; a useful agent
continues within an assigned scope and asks only for a genuine preference,
tradeoff, authorization, or unavailable resource.

The ordinary route is source-directed. The Lexicon's Context Map connects
concepts and needs to their owners; bounded search repairs a missing or stale
route but is not the default. Active ADRs are architectural Canon for their
accepted decisions, while their rationale and history remain available without
being mistaken for live instructions.

## Integrated System Design

The system has deliberately distinct owners. `AGENTS.md` governs behavior,
authority, safety, Git, and verification. `RUNBOOK.md` governs operation.
`LEXICON.md` owns shared language and the Context Map. This Blueprint owns the
desired finished product. Active ADRs own accepted cross-cutting architecture.
Specs own scoped, testable delivery from verified Actuality toward the
destination.

In short: Blueprint target + active ADRs + verified Actuality/evidence become
the Specs that deliver the product. No single document substitutes for the
others. The selected active ADRs are synthesized where they affect this
narrative; their complete inventory and lifecycle stay in the [ADR
register](workbench/docs/adr/REGISTER.md).

## Cross-Cutting Qualities And Constraints

- Preserve source lineage, original propositions, accepted decisions, and
  verified evidence; never erase historical records merely to simplify routing.
- Keep local operation usable without a private service, and keep optional
  transport, configured-host capability, enforcement, and model reliability as
  distinct evidence boundaries.
- Prefer small, explicit, reversible changes. Preserve unrelated work and do
  not create hidden personal-catalog, private-session, Foundry, or downstream
  dependencies.
- Make active decisions and historical decisions equally readable but route
  ordinary work only through active Canon. Supersession is whole-record and
  explicit; partial supersession is not a lifecycle state.
- Use independent review at the right scope: bounded task candidates before
  integration, and exact whole-Workbench release candidates before an owner
  considers a main merge.

## Desired Creation, Update, Repair, Validation, And Deployment Lifecycle

A new project begins with a valid Workbench shape and develops its own
destination and active decisions from project evidence. A later capability will
prepare a project-informed Blueprint grilling record, derive Specs from locked
decisions and verified Actuality, and prove an end-to-end fresh copy. Those are
not claims about current delivery.

The reusable Workbench is built and maintained upstream, then proven by
updating the Workbench Template. An existing project is not part of a portfolio
rollout: it changes only after its owner identifies it and requests a
target-specific update. Release readiness authorizes review and a verdict;
approval and merge into `main` remain with the owner.

## Non-Goals

- A universal coordinator, mandatory scheduler, external workflow service, or
  revived Foundry runtime.
- Automatic propagation, monitoring, or mass updates of downstream project
  Workbenches.
- Treating a template update as proof that the future personalization, Genesis,
  or end-to-end validation capabilities already exist.
- Replacing architectural decisions with a Blueprint inventory, a generated
  Spec catalog, release chronology, health reporting, or implementation proof.
