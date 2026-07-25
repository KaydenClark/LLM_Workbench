---
name: foundry-slice
description: Cut a Foundry capability into vertical slices that each connect two Foundry layers through their socket contract, then decompose, order, and size the chain of single-repo tasks that realizes one.
disable-model-invocation: true
---

# Foundry Slice

A Foundry vertical slice connects **two Foundry layers** through **one observable
end-to-end outcome**. It need not touch every layer — connecting two through one
real behavior is the sufficient unit. It nests *above* the project-internal
tracer bullets: each component keeps its own internal layers, and the Foundry
slice is the seam *between* components. A change that stays inside one component
is not a Foundry slice at all; that is `/tracer-bullet` work.

Use this discipline when a capability must cross between Foundry components,
before writing a slice into a spec's `Vertical Implementation Slices` table, and
whenever a proposed slice names only one repo.

This skill cuts slices. It does not run them — execution, independent audit,
close classification, and the hard stops belong to
`Scheduled/Captain/FOUNDRY_SLICE_RUN.md`, which reads this discipline before it
selects anything.

## 1. Map the crossing

Name the two layers this capability must connect, from the socket contract
registry rather than a remembered list. Read the `K-###` records to see which
sockets exist now and what each declares: capability, contract surface, and
module-agnostic contract. The Foundry's layers are an open registry, not a fixed
set — the registry is the source of truth, and a capability's crossing is mapped
per-capability exactly as `/tracer-bullet` step 1 maps a project's layers.

The map is done when you can name the producing side, the consuming side, and the
`K-###` socket between them.

## 2. Apply the contract gate before anything else

It is **not a valid Foundry slice unless the two layers connect via the socket
contract.** A connection that reaches around a contract — one module reading
another's files, database, or internals directly — is disqualified. It is a
boundary violation to flag, not a slice to schedule.

Test the proposal, do not assume it:

- **Named socket** — the crossing resolves to a declared `K-###` record.
- **No reach-around** — neither side imports, opens, or queries the other's
  storage. Injected backends and vendored contract copies are fine; a filesystem
  or database path into the other component is not.
- **Independently movable** — because the contract is the seam, each side can
  change behind it without the other being edited in the same task.

If the crossing has no socket yet, the slice is not ready: declaring the contract
is its own earlier task, and often its own decision about whether a new socket is
warranted.

## 3. Cut the narrowest complete crossing

Pick the thinnest behavior an observer can actually see travel from one component
to the other, and cut one slice for exactly that. State it as an outcome ("a
value produced by one component is rendered in another with its provenance"),
never as a component ("add the endpoint"). Hold the width to one behavior; take
full depth across the crossing.

A sound Foundry slice:

- **Two layers, one outcome** — a real behavior, end to end, through the contract.
- **Demoable alone** — its proof is a check Kayden can run in under a minute.
- **Registry-exercising** — it resolves through the declared contract, so the
  proof shows the seam working, not just the two sides existing.
- **Unblocked** — the first slice of a new capability should depend on nothing
  that is not already merged.

## 4. Decompose into a chain of single-repo tasks

A slice is a **dependency-ordered chain of single-repo tasks** that crosses repos
through the socket contract. One task in one repo unblocks the next in another,
and that whole chain is one slice.

- **No task crosses more than one repo.** Each task is atomic to one repository.
- **One agent drives the whole slice** across every repo it touches, one task at
  a time, in blocking order.
- **Save and push after each task**, so nothing is lost and each finished task
  can unblock the next.
- **One-writer-per-repo** means only that no *two* agents write the same repo
  concurrently. It does not confine one agent to one repo.
- **Size each task to about one context.** When a task will not fit, split it
  within its repo rather than letting it straddle two.

Order by the **real blocking dependency**, not dogmatically contract-first —
though a consuming task that binds a contract naturally waits on the task that
declares it. The same agent closes the slice: it verifies the end-to-end crossing,
runs the demo, and owns the slice row.

## 5. Write the slice down

Record the cut slice as one row in the owning spec's `Vertical Implementation
Slices` table, with its chain of single-repo tasks, explicit blockers, and the
observable outcome as its proof. The slice row owns the end-to-end result even
though its tasks are per-repo.

New crossings go into their own linked spec rather than accumulating in the spec
that first defined the model. Hand the ordered tasks to `/to-tickets`, or to
`/to-spec` when the owning spec does not exist yet.

## Slice smell test

Before approving any slice, ask two questions. Does one observable behavior
travel all the way from one component to the other? And does it travel **through
the declared contract**? If the answer to the first is no, it is a component-local
change — send it to `/tracer-bullet`. If the answer to the second is no, it is a
reach-around: flag the boundary violation and do not schedule it.
