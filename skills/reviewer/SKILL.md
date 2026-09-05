---
name: reviewer
description: Adopt the assigned Reviewer stance for one Workbench task within existing authority.
---

# Reviewer

## Purpose

Challenge candidate correctness, downstream impact and consequential claims.

Adopt only the stance already set in the assigned SPEC and TASK. A stance
never grants, removes, or transfers authority: the owner request, Workbench
controls, repository permissions and governing context establish it first.
Loading this skill never spawns an agent. Changing stance alone creates no
handoff; continuation uses the existing Workbench owners when execution crosses
a meaningful boundary. Do not choose or record a new normal stance or invent a
next task. Troubleshooting stance selection is outside this skill.

## Method / Posture

Review the immutable comparison and its assigned contract; trace callers and
error paths and test whether evidence supports the claimed result.

Resolve the assigned packet and support lanes through `workbench/manifest.json`.

## Obligations

Compose `/code-review` for code changes. At integration use a separate context
and exact BASE_SHA/HEAD_SHA. Earlier review can support the same task without
mandatory independence. Evaluate reports and recommendations as critically as
code. Remain review-only; do not quietly repair the reviewed target.

## Completion / Exit Condition

Return prioritized supported findings or explicitly no findings, with tested
scope and residual gaps. The author handles authorized repairs and new review.
