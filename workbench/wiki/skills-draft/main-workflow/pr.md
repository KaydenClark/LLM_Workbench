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
  - workbench/specs/S-002U-pr-skill-adoption/proof/scenario-result.json
  - workbench/docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md
last_verified: 2026-10-07
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

Intended behavior, from the source: the body opens with a small visual beside brief prose, shows a real before and after, and states the door and blast radius plainly, in the project's glossary terms, while nothing in Git or GitHub changes. Observed: the shipped source hashes byte-identical to the pin and makes no tool call. A fresh clone of the declared-Core candidate `5e965265` resolves `pr` through both `.agents/skills` and `.claude/skills` to the same lane file, whose SHA-256 `ab63f1cf…` equals the upstream bytes, and its manifest requires `pr`; that is structural discovery, not a host invoking it from an ordinary prompt. On October 7, 2026 one fresh context, given only the skill, a known change, its real test output and a glossary fixture, wrote a body with a file-layout diff and a short pseudocode of the new check, a before and after quoted from the real runs, a two-way door and a branch-local blast radius in the fixture's terms, and changed nothing in Git or GitHub. It miscounted the change once (five added files where four were added and one edited) and carried no merge answers. The [scenario result](../../../specs/S-002U-pr-skill-adoption/proof/scenario-result.json) holds the input, the body and the environment diff. Limitation: one run, a fixture glossary, the same host and model as its caller, and the skill invoked by path rather than discovered.

## Where it fits

implement or implement-spec -> pr writes the body -> the caller opens the PR -> independent review -> integration -> owner approval and main.

It is a primitive of the PR step, not a role or a Git operation. Group: main-workflow.

--- draft only, stripped on promotion ---

## Compared with Matt's

Counterpart: [Matt Pocock engineering/pr at the pinned source](https://github.com/mattpocock/skills/blob/d81f3a183412e71a5b1e84ca21bc1a35eea03a60/skills/engineering/pr/SKILL.md). Verdict: same. `SKILL.md`, `CREDITS.md` and `agents/openai.yaml` are byte-identical to the pin, so the adapter diff is empty; the [NOTICE](../../../skills/pr/NOTICE.md) records the pin, the absence of an adapter and the MIT text, and the skill catalog test pins the source hash. This article adds only the Workbench boundaries around the body: Git operations stay with implement and the Runbook, the glossary reference stays unchanged, and the merge answers stay with implement.

Source, article and observed behavior: the source and this article agree that the skill authors a body and nothing else. Observed behavior: byte identity, no tool call, fresh-clone discovery through both adapters, and one fresh-context body that followed the template's three sections, used real evidence and left Git untouched. Invocation from an ordinary prompt, a delivered glossary and repeat-run quality are not yet observed.

## Findings

F:pr:01 | gap | The template has no place for the Worker merge-safety and completion answers that implement requires in a PR description | pr skill adoption Spec (S-002U)
F:pr:02 | dangling | The source's GLOSSARY.md reference resolves to nothing until the glossary is delivered | Lexicon Retirement And ARCHITECTURE.md (S-004O)
F:pr:03 | gap | One fresh-context body was observed by direct path with a fixture glossary; ordinary-prompt discovery, the delivered glossary and repeat runs are unobserved | pr skill adoption Spec (S-002U)

## Sources and history

- October 6, 2026: Owner approved pr as required Core in every Workbench. The pinned source was imported byte-identical with its lineage, and this draft was written from [Template 2](../TEMPLATE.md).
- October 7, 2026: One fresh-context body-authoring scenario observed on a known change with real before and after output (S-002U TK-007W); finding 03 narrowed to what remains unobserved.
- The draft remains curated context and supplies no independent authority.
