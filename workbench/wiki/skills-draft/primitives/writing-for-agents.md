---
type: memory
status: draft
sensitivity: normal
knowledge_role: curated
skill: writing-for-agents
group: primitives
skill_source: core
origin: matt
matt_counterpart: productivity/writing-for-agents
supersedes: none
provenance:
  - Owner-requested required Core adoption, 2026-10-06
  - Matt Pocock source at d81f3a183412e71a5b1e84ca21bc1a35eea03a60, adapted to Workbench ownership and invocation
source_paths:
  - workbench/skills/writing-for-agents/SKILL.md
  - workbench/specs/S-002P-writing-for-agents-skill-adoption/SPEC.md
  - workbench/manifest.json
  - THIRD_PARTY_NOTICES.md
last_verified: 2026-10-07
---
# Writing for agents: make instructions easier to find and follow

## What it does

You use one writing reference for skills, steering files and documents agents load through pointers. It helps you make the agent's process predictable with precise triggers, coherent reference and checkable completion. The [skill source](../../../skills/writing-for-agents/SKILL.md) owns the guidance; the [adoption Spec](../../../specs/S-002P-writing-for-agents-skill-adoption/SPEC.md) owns its evidence and limits.

## When to reach for it

| What you have | Reach for |
|---|---|
| A skill, steering file or agent reference to write or revise | writing-for-agents |
| A settled truth to place in its durable documentation owner | to-docs |
| A difficult session whose instruction environment needs examination | retro |

## What it needs

Your authorized outcome, the current document, its consumers and the existing control owner. For skill-specific invocation and packaging it loads its shipped [Skill mechanics](../../../skills/writing-for-agents/SKILL-MECHANICS.md). It needs no personal installation or network source at runtime.

## What it reads and writes

It reads the document and its referenced sources, consumers, current scripts and configuration. It guides edits to the assigned document; it creates no new store or mandatory document by itself. Settled changes follow [to-docs](../../../skills/to-docs/SKILL.md). Archive and personal copies of writing-great-skills are preserved as provenance and are not moved or deleted by loading this reference.

## How it works

It sharpens pointers so each necessary branch reaches the right material, keeps shared guidance inline and branch-specific detail behind links, and makes completion conditions observable. It keeps each meaning with one owner, groups definitions with their caveats, and removes duplicates, stale material and demonstrated no-ops without weakening accepted requirements.

## Common questions

**Is this writing-great-skills renamed?** It is the maintained successor and broader reference. The older skill's useful concepts are retained here in the universal reference or skill-specific mechanics: predictability, both loads, pointers, hierarchy, co-location, completion, granularity, leading words, premature completion, duplication, sediment, sprawl, no-ops and positive wording. Definitions are local to their topics rather than copied into a second glossary.


| Earlier idea or term | Fold-in disposition |
|---|---|
| Predictability | survives: process consistency is the reference's outcome |
| Context load | covered: cost of always-loaded lines under Information hierarchy |
| Cognitive load | covered: cost of additional human routes under Information hierarchy |
| Context pointer and description | survives: precise triggers under Context pointers and mechanics |
| Information hierarchy, steps and reference | survives: common material inline, conditional material disclosed |
| Progressive disclosure and co-location | survives: branch-specific links and grouped definitions |
| Completion criterion and legwork | covered: observable conditions with required coverage |
| Granularity and invocation cuts | covered: separate only useful branches and real invocation needs |
| Premature completion and post-completion steps | survives: sharpen criteria first; real context boundary only if needed |
| Leading words | survives: familiar concise concepts without repeated definitions |
| Duplication and single source of truth | survives: one rule owner, linked consumers |
| Sediment, relevance and sprawl | covered: prune stale layers and disclose meaningful branches |
| No-op | survives: test behavior against model defaults when uncertain |
| Negation | covered: positive actions paired with necessary hard boundaries |
| Separate GLOSSARY.md | dropped as a duplicated definition store; definitions stay with their topics; the archive remains intact |
| Universal user-only composition restriction | retained as upstream reference; the actual host and higher-priority Workbench controls govern composition |

The archived source remains recoverable provenance. The personal-install copy retires only by the owner's hand; this delivery changes no provider-home files.

**Must every skill be user-invoked?** Use automatic selection for reusable discipline and explicit invocation for owner-started workflows. Retro ships to every room but remains explicit-only. Composition follows Workbench authority and host mechanics, so an upstream invocation restriction does not replace the room's controls.

**Does shorter prove better?** Structural validation proves links and metadata. A representative fresh-context run supplies bounded behavioral evidence; stronger claims need comparative evaluation.

## It's working if

The agent reaches a needed reference from a precise trigger, can tell when each step is finished and keeps requirements and permission boundaries intact. Resources travel with the room. A fresh-context scenario and installation checks are required by the Spec; native host discovery remains a separate claim.

## Where it fits

Authorized document change -> writing-for-agents -> edited existing owner -> route and scenario checks -> to-docs and normal review. This is a primitive reference, automatically selectable and required in every room. Retro reads it before proposing instruction changes.

--- draft only, stripped on promotion ---

## Compared with Matt's

Verdict: same. The entrypoint and SKILL-MECHANICS.md retain the supplied productivity/writing-for-agents text at d81f3a183412e71a5b1e84ca21bc1a35eea03a60 unchanged. The earlier broad rewrite is superseded at the owner's request. Host-specific invocation and composition descriptions remain upstream reference; the existing Workbench controls and actual host metadata govern local operation. Notice files preserve source identity and the MIT license without adding rules to the skill body.

## Findings

F:writing-for-agents:01 | stale-name | writing-great-skills remains preserved archive and personal provenance; the live authoring route now uses writing-for-agents | Writing-for-agents Skill Adoption (S-002P) and Core Skill Lifecycle And Optional Source Disposition (S-00R) for any later archive disposition
F:writing-for-agents:02 | conflict | Upstream user-invocation rules are host-specific; the unchanged upstream mechanics are interpreted under higher-priority Workbench controls and actual host policy | Writing-for-agents Skill Adoption (S-002P)
F:writing-for-agents:03 | gap | Native configured-host discovery requires host evidence beyond structural installation and a direct-path scenario | Writing-for-agents Skill Adoption (S-002P)

## Sources and history

- [Matt's pinned writing reference](https://github.com/mattpocock/skills/blob/d81f3a183412e71a5b1e84ca21bc1a35eea03a60/skills/productivity/writing-for-agents/SKILL.md), its skill mechanics, and the preserved writing-great-skills source were read on 2026-10-06.
- The owner reaffirmed required Core adoption on 2026-10-06. The old archive's retention decision stays with Core Skill Lifecycle And Optional Source Disposition (S-00R); the personal install is untouched.
- [Template 2](../TEMPLATE.md) supplies the draft shape. This is curated context; integration review and owner closure remain separately recorded in the Spec.

- 2026-10-07: References, imported source and retained scenario provenance rechecked for paired Core delivery; native invocation and reliability remain unverified.
