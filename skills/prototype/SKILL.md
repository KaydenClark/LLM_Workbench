---
name: prototype
description: Make a cheap, rough, disposable artifact to react to — an outline, a stub, a rough UI or logic take — when "how should it look or behave" is the real question. Adapted from Matt Pocock's prototype skill; wired to the Workbench preview and artifact tooling.
---

# Prototype

Raise the fidelity of a discussion by making something concrete to react to,
instead of arguing in the abstract. Use it when the key question is *how should
this look* or *how should this behave* — a decision a rough artifact answers
faster than words.

## Disposable by contract

A prototype is **throwaway.** It exists to be reacted to and discarded, never to
become the real implementation. Keep it rough and cheap; the moment it starts
turning into the actual build, stop — you have left prototyping and skipped the
decision it was meant to inform.

## Procedure

1. Name the question the prototype answers ("which of these two layouts," "does
   this interaction feel right").
2. Make the cheapest artifact that answers it — an outline, a rough take, a stub,
   or throwaway UI/logic. Use the Workbench preview/artifact tooling (the Browser
   preview surface, the artifact builder) rather than standing up real
   infrastructure.
3. Link the artifact as an asset to react to, and record the reaction — the
   decision — separately. The reaction is what survives; the prototype is not.

## As a wayfinder ticket

A `wayfinder` `prototype` ticket is worked with the human in the loop: build the
rough artifact, link it from the ticket, and record the resulting decision as the
ticket's resolution. The prototype is an asset on the ticket, not the answer.
