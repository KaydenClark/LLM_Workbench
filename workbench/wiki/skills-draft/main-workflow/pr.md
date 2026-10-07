---
type: memory
status: draft
sensitivity: normal
knowledge_role: curated
skill: pr
group: main-workflow
skill_source: core
origin: matt
matt_counterpart: engineering/pr
supersedes: none
provenance:
  - Owner approved pr as required Core in every Workbench, 2026-10-06, recorded in the pr skill adoption Spec (S-002U)
  - Matt Pocock skills/engineering/pr at d81f3a183412e71a5b1e84ca21bc1a35eea03a60, imported byte-identical; Summary visuals credited to Dex Horthy (Humanlayer) show-me
source_paths:
  - workbench/skills/pr/SKILL.md
  - workbench/skills/pr/NOTICE.md
  - workbench/skills/pr/CREDITS.md
  - workbench/specs/S-002U-pr-skill-adoption/SPEC.md
  - workbench/docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md
last_verified: 2026-10-06
---
# PR: write a pull request body that is fast to review

## What it does

You have a change and want its pull request body. The skill gives you a three-section template, Summary, Evidence and Merge Danger, and tells you how to fill each one briefly with no preamble. It writes the body text only. Opening the PR, publishing it, reviewing, merging and cleaning up the branch stay with [implement](../../../skills/implement/SKILL.md#version-control-procedures) and the [Runbook](../../../../RUNBOOK.md#version-control-procedures). The [source](../../../skills/pr/SKILL.md) owns the template; the [pr skill adoption Spec (S-002U)](../../../specs/S-002U-pr-skill-adoption/SPEC.md) owns delivery proof and remaining gates.

## When to reach for it

| What you have | Reach for |
|---|---|
| A change whose PR body you are about to write | pr |
| A branch to open, publish, merge or clean up | [implement](../../../skills/implement/SKILL.md#version-control-procedures) and the Runbook's Version-Control Procedures |
| A fixed diff that needs independent review | [code-review](../../../skills/code-review/SKILL.md) |
| A sliced Spec to carry to a ready PR | [implement-spec](implement-spec.md), which then needs a body |

## What it needs

The change itself and its real evidence: a screenshot when the change is visual and the environment can take one, otherwise the exact test or command output before and after. It needs the project's canonical vocabulary from `GLOSSARY.md`; the source names that file and the Workbench keeps the reference unchanged. It calls no tool and needs no other skill.

## What it reads and writes

It reads the change, its evidence and `GLOSSARY.md`. It writes one Markdown PR body and nothing else: no file, no Git state, no GitHub publication. Where that body goes is the caller's operation.

## How it works

### Summary: the smallest view that makes the point

Pick one visual, sometimes two: pseudocode for logic, a call tree for runtime flow, a component tree for UI structure, a shallow file tree for a refactor, Mermaid for interaction or data flow, or a `diff` shaped like the topic when the surrounding structure already exists. Put each visual next to the short text it supports and keep only what answers the current question. This menu and its placement guidance come from Dex Horthy's `show-me` skill at Humanlayer, which the source credits in its frontmatter and [CREDITS.md](../../../skills/pr/CREDITS.md).

### Evidence and Merge Danger

Evidence is a before and after. A screenshot is the strongest for a visual change; test results or console output come next, shown as the exact test that failed and now passes. Merge Danger names the door, one-way when the change is destructive or hard to reverse and two-way when it rolls back cheaply, then a one-word blast radius and, optionally, what could break.

## Common questions

**Does it open or merge the PR?** No. It authors the body. Every Git and GitHub operation stays with implement and the Runbook, and the skill adds no merge or main authority.

**What if a section has no real evidence?** Report what was actually run. The source asks for concrete evidence; it does not license an invented check or screenshot.

**Where do the terms come from if `GLOSSARY.md` is missing?** The settled destination is root `GLOSSARY.md`, by the [Lexicon retirement decision (DDR-001E)](../../../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md). Its delivery belongs to [Lexicon Retirement And ARCHITECTURE.md (S-004O)](../../../specs/S-004O-lexicon-retirement-and-architecture-md/SPEC.md), and on the base this draft was written against the file does not exist yet. Limitation: until it does, the vocabulary instruction points at nothing; do not substitute `LEXICON.md` or start another vocabulary store.

**Does it carry the Workbench merge answers?** Not by itself. A Worker's PR also carries the two merge-safety and completion answers from [implement](../../../skills/implement/SKILL.md#4-review-at-the-relevant-boundary); the template has no section for them (finding 01).

## It's working if

Intended behavior, from the source: the body opens with a small visual beside brief prose, shows a real before and after, and states the door and blast radius plainly, in the project's glossary terms, while nothing in Git or GitHub changes. Observed so far: the shipped source hashes byte-identical to the pin and makes no tool call. Not yet observed: a fresh-context body written from a known change; the Spec carries that scenario and its limits when it runs.

## Where it fits

implement or implement-spec -> pr writes the body -> the caller opens the PR -> independent review -> integration -> owner approval and main.

It is a primitive of the PR step, not a role or a Git operation. Group: main-workflow.

--- draft only, stripped on promotion ---

## Compared with Matt's

Counterpart: [Matt Pocock engineering/pr at the pinned source](https://github.com/mattpocock/skills/blob/d81f3a183412e71a5b1e84ca21bc1a35eea03a60/skills/engineering/pr/SKILL.md). Verdict: same. `SKILL.md`, `CREDITS.md` and `agents/openai.yaml` are byte-identical to the pin, so the adapter diff is empty; the [NOTICE](../../../skills/pr/NOTICE.md) records the pin, the absence of an adapter and the MIT text, and the skill catalog test pins the source hash. This article adds only the Workbench boundaries around the body: Git operations stay with implement and the Runbook, the glossary reference stays unchanged, and the merge answers stay with implement.

Source, article and observed behavior: the source and this article agree that the skill authors a body and nothing else. Observed behavior is structural only (byte identity and no tool call); invocation from an ordinary prompt and the quality of a generated body are not yet observed.

## Findings

F:pr:01 | gap | The template has no place for the Worker merge-safety and completion answers that implement requires in a PR description | pr skill adoption Spec (S-002U)
F:pr:02 | dangling | The source's GLOSSARY.md reference resolves to nothing until the glossary is delivered | Lexicon Retirement And ARCHITECTURE.md (S-004O)
F:pr:03 | gap | A fresh-context body-authoring scenario with a known change has not yet been observed | pr skill adoption Spec (S-002U)

## Sources and history

- October 6, 2026: Owner approved pr as required Core in every Workbench. The pinned source was imported byte-identical with its lineage, and this draft was written from [Template 2](../TEMPLATE.md).
- The draft remains curated context and supplies no independent authority.
