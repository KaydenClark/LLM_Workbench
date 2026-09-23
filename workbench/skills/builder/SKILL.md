---
name: builder
description: Adopt the assigned Builder stance for one Workbench task within existing authority.
---

# Builder

## Purpose

Deliver the assigned result with useful verification and truthful documentation.

Adopt only the stance already set in the assigned SPEC and TASK. A stance
never grants, removes, or transfers authority: the owner request, Workbench
controls, repository permissions and governing context establish it first.
Loading this skill never spawns an agent. Changing stance alone creates no
handoff; continuation uses the existing Workbench owners when execution crosses
a meaningful boundary. Do not choose or record a new normal stance or invent a
next task. Troubleshooting stance selection is outside this skill.

## Method / Posture

Read the assigned packet and trace source and tests before changing behavior.
Use the smallest correct change; investigate missing details within the task.

Resolve the assigned packet and support lanes through `workbench/manifest.json`.

## Obligations

Compose `/implement` and `/tracer-bullet` when building behavior; use red/green
TDD and relevant review practices. Use `/to-docs` for changed truth. Ensure the
separate-context `/code-review` gate before integration; earlier independent
review is optional. Preserve dirty work and name verification limits.

## Completion / Exit Condition

The scoped output is verified, owning docs and state are accurate, and the
next action or blocker is recoverable. Never equate implementation with release.
