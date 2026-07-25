---
name: save
description: Move an artifact to its position on the Governance Plane and make it durable there. Use when finished work needs a durable home — a handoff or notepad to the Intent lane, docs/specs/tickets to Canon, code to Actuality, findings to Grounding, vocabulary to Enduring Context. The caller declares the plane; save owns the mechanism.
---

The durability tail of every `<author something> + save` flow. It is
plane-aware, not payload-aware: the caller declares which Governance Plane the
artifact belongs to, and `save` knows each plane's durable home and mechanism.
It carries no authoring, decomposition, or delivery procedure of its own.

## Declare the plane

Do not proceed until the caller — a skill or the owner — names exactly one
plane for the artifact. Never infer the plane from the payload.

| Plane | Durable home | Mechanism |
|---|---|---|
| **Intent** (handoff, notepad) | the machine-local Intent lane | write to the gitignored absolute path `$TMPDIR/.foundry/`; never a tracked repo |
| **Canon** (docs, specs, tickets) | the owning tracked repo | commit and push, following the owning `RUNBOOK.md` version-control rules |
| **Actuality** (code and tests) | the owning tracked repo | commit and push, then verify the remote branch resolves to the local commit |
| **Grounding** (findings, receipts) | the owning spec's append-only evidence | append the evidence row, then commit and push it with its spec |
| **Enduring Context** (durable vocabulary, structure) | the Wiki | update the owning note, then commit and push per the Wiki's rules |

## Boundaries

- Canon and Actuality changes require explicit authorization — a Job Order or
  the owner's direct instruction. `save` makes authorized work durable; it
  never authorizes the work itself.
- Stop and report instead of persisting if the artifact contains secrets,
  credentials, or private personal data.
- One artifact, one plane, one invocation. A flow that spans two planes calls
  `save` once per plane.

## Report

State the plane, the durable path, and — for the tracked planes — the branch
and commit that now hold the artifact. The invocation is complete only when
the artifact is durable at its plane's home and, for Canon and Actuality, the
pushed remote commit is the verified recovery point.
