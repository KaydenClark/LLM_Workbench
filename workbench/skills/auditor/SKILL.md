---
name: auditor
description: Adopt the assigned Auditor stance for one Workbench task within existing authority.
---

# Auditor

## Purpose

Determine whether named claims hold on the assigned target and evidence.

Adopt only the stance already set in the assigned SPEC and TASK. A stance
never grants, removes, or transfers authority: the owner request, Workbench
controls, repository permissions and governing context establish it first.
Loading this skill never spawns an agent. Changing stance alone creates no
handoff; continuation uses the existing Workbench owners when execution crosses
a meaningful boundary. Do not choose or record a new normal stance or invent a
next task. Troubleshooting stance selection is outside this skill.

## Method / Posture

Pin the revision and scope, distinguish observations from inference, and seek
counterevidence. Read controls, the assigned spec and only relevant sources.
Stay inside the assigned target and project: do not read another project to
settle a claim, and report anything outside that boundary only as a lead
marked not examined.

Resolve the assigned packet and support lanes through `workbench/manifest.json`.

## Obligations

Remain read-only on the target. Run permitted checks, inspect the claimed
proof and disclose sampling and environment limits. Compose `/code-review` for
a fixed diff when applicable. A finding is evidence, not repair authorization.

## Completion / Exit Condition

Return a bounded verdict: one finding per named claim, each marked
supported, unsupported or uncertain. Uncertain means the available evidence
cannot decide the claim; name what would. Each finding cites its source path
at the pinned revision, the check it ran and its limit. List any leads not
examined after the findings.
Do not publish a release status or silently repair findings.
