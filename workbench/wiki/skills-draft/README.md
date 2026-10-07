---
type: meta
status: active
sensitivity: normal
knowledge_role: canonical
provenance:
  - draft skills wiki index authored for the skills draft wiki collection Spec (S-002L) Collection Index README Task (TK-006O) on 2026-10-04 from the owner's 2026-09-30 draft-skills-wiki direction
source_paths:
  - workbench/wiki/skills-draft/TEMPLATE.md
  - workbench/specs/S-002L-skills-draft-wiki-collection/SPEC.md
last_verified: 2026-10-04
---

# Skills Draft Wiki

This collection is a prototype of the skills Wiki, written on the skills as they
are today to find what is wrong: skills that should connect and do not, and
skills that connect and do not work together. It holds one draft article per
skill, in one folder per group, and every connection problem a draft finds is
one greppable finding line. Its home, its status rule and its validator checks
are in [SCHEMA.md](../SCHEMA.md); the article shape is in
[TEMPLATE.md](TEMPLATE.md).

Drafts do not replace the active `skill-*.md` articles beside the router.
A draft names the article it would replace under `supersedes`, and that article
stays active and routed until the owner decides a promotion. No skill source
moves because of a draft.

## Writing an article

An owning Spec writes its skill's draft at `skills-draft/<group>/<skill>.md`
from [TEMPLATE.md](TEMPLATE.md), then changes its row below from plain text to
a link to the article. Until the article exists the row stays plain text, so
this index never links to a file that is not there.

List every finding the drafts have raised with the command below; `TEMPLATE.md` is excluded because it shows the line format on a line of its own.

```bash
grep -rh '^F:' --exclude=TEMPLATE.md workbench/wiki/skills-draft
```

## Groups

| Group | Articles | What it covers |
|---|---|---|
| [getting-started](#getting-started) | 7 | Set a room up: Genesis, adoption, setup and the orientation skills. |
| [main-workflow](#main-workflow) | 14 | Carry work from an idea to a merged change: specify, cut Tasks, implement, review, coordinate. |
| [shaping](#shaping) | 7 | Think a problem through before it is a Spec: interviews, maps, research and prototypes. |
| [upkeep](#upkeep) | 21 | Keep a room healthy: update the harness, fix bugs and conflicts, triage, and review the harness itself. |
| [primitives](#primitives) | 12 | Skills other skills compose: interviews, notes, promotion, documentation, vocabulary and testing. |
| [productivity](#productivity) | 5 | Skills for working with people and other agents: handoff, teaching, questionnaires. |
| [stances](#stances) | 6 | The jobs an agent takes inside an assignment: Builder, Auditor, Reviewer, Reconciler and two Foundry-origin ones. |
| [foundry](#foundry) | 9 | Foundry-origin skills and two adjacent personal skills (`chronicle`, `clean-my-ai-harness-codex`, which are not Foundry skills and take `origin: other`), kept here as drafts until the owner decides whether to adopt, retire or hand back each one. |
| **Total** | **81** | |

Source is where the skill lives today: `core` is `workbench/skills`, `pending` is `skills-pending`, `personal` is only in the owner's own skills install, and `new` has no source yet. "Matt counterpart" is the nearest skill in Matt Pocock's skills at the upstream pin `d81f3a1`, or `none`. The owning Spec is the Spec that writes the draft in its step 2 onward.

## getting-started

Set a room up: Genesis, adoption, setup and the orientation skills.

| Skill | Source | Owning Spec | Matt counterpart |
|---|---|---|---|
| genesis | core | S-01G (genesis skill rebuild) | none (nearest setup-matt-pocock-skills) |
| adoption | core | S-01D (adoption skill rebuild) | none |
| ask-workbench | personal, becomes core | S-002M (ask workbench skill alignment) | ask-matt |
| sitrep | personal, becomes core | S-002O (sitrep skill alignment) | none |
| setup-pre-commit | pending | S-002R (setup pre commit skill alignment) | setup-pre-commit (not promoted upstream) |
| setup-ts-deep-modules | pending | S-002S (setup ts deep modules skill alignment) | setup-ts-deep-modules (not promoted upstream) |
| setup | new | S-002Q (workbench setup step) | setup-matt-pocock-skills |

## main-workflow

Carry work from an idea to a merged change: specify, cut Tasks, implement, review, coordinate.

| Skill | Source | Owning Spec | Matt counterpart |
|---|---|---|---|
| to-spec | core | S-01K (to spec skill rebuild) | to-spec |
| to-tasks | core | S-01L (to tasks skill rebuild) | to-tickets |
| to-tickets | personal, stale name of to-tasks | S-01L (to tasks skill rebuild) | to-tickets |
| implement | core | S-01H (implement skill rebuild) | implement |
| carry | core | S-01C (carry skill rebuild) | none |
| code-review | core | S-01F (code review skill rebuild) | code-review |
| make-it-so | core | S-01I (make it so skill rebuild) | none |
| director | core | S-002C (director role) | none |
| dispatcher | core | S-002D (dispatcher role) | none |
| spec-planner | core | S-002F (spec planner stance) | none |
| spec-manager | core | S-002G (spec manager stance) | none (nearest implement-spec) |
| [implement-spec](main-workflow/implement-spec.md) | core lane, Workbench-only maintainer | S-002T (implement spec skill adoption) | implement-spec |
| pr | new | S-002U (pr skill adoption) | pr |
| retro | new | S-002V (retro skill adoption) | retro |

## shaping

Think a problem through before it is a Spec: interviews, maps, research and prototypes.

| Skill | Source | Owning Spec | Matt counterpart |
|---|---|---|---|
| grill-me | core | S-00Z (grill me skill rebuild) | grill-me |
| brainstorm | personal, becomes core | S-002N (brainstorm skill alignment) | none |
| wayfinder | pending | S-002W (wayfinder skill alignment) | wayfinder |
| research | pending | S-002X (research skill alignment) | research |
| prototype | pending | S-002Y (prototype skill alignment) | prototype |
| design-an-interface | pending | S-002Z (design an interface skill alignment) | none (design-it-twice is now a supporting file of codebase-design) |
| loop-me | pending | S-003F (loop me skill alignment) | loop-me (not promoted upstream) |

## upkeep

Keep a room healthy: update the harness, fix bugs and conflicts, triage, and review the harness itself.

| Skill | Source | Owning Spec | Matt counterpart |
|---|---|---|---|
| update-harness | core | S-01N (update harness skill rebuild) | none |
| checkpoint | core | S-01E (checkpoint skill rebuild) | none (retired compatibility notice) |
| improve-codebase-architecture | pending | S-003G (improve codebase architecture skill alignment) | improve-codebase-architecture |
| diagnosing-bugs | pending | S-003H (diagnosing bugs skill alignment) | diagnosing-bugs |
| resolving-merge-conflicts | pending | S-003I (resolving merge conflicts skill alignment) | removed from the upstream tree |
| triage | new | S-003J (triage skill adoption) | triage |
| harness-feedback-review | personal, retired | S-004L (harness improvement playbook skill), which retired it in favor of improve-harness | none |
| harness-review-actions | personal, retired | S-004L (harness improvement playbook skill), which retired it in favor of improve-harness | none |
| harness-review-actuality | personal, retired | S-004L (harness improvement playbook skill), which retired it in favor of improve-harness | none |
| harness-review-assay-follow-up | personal, retired | S-004L (harness improvement playbook skill), which retired it in favor of improve-harness | none |
| harness-review-canon | personal, retired | S-004L (harness improvement playbook skill), which retired it in favor of improve-harness | none |
| harness-review-classify-causes | personal, retired | S-004L (harness improvement playbook skill), which retired it in favor of improve-harness | none |
| harness-review-diagnosis | personal, retired | S-004L (harness improvement playbook skill), which retired it in favor of improve-harness | none |
| harness-review-disposition | personal, retired | S-004L (harness improvement playbook skill), which retired it in favor of improve-harness | none |
| harness-review-feedback-lifecycle | personal, retired | S-004L (harness improvement playbook skill), which retired it in favor of improve-harness | none |
| harness-review-grounding | personal, retired | S-004L (harness improvement playbook skill), which retired it in favor of improve-harness | none |
| harness-review-map-gaps | personal, retired | S-004L (harness improvement playbook skill), which retired it in favor of improve-harness | none |
| harness-review-meta-risks | personal, retired | S-004L (harness improvement playbook skill), which retired it in favor of improve-harness | none |
| harness-review-reconnaissance | personal, retired | S-004L (harness improvement playbook skill), which retired it in favor of improve-harness | none |
| harness-review-report | personal, retired | S-004L (harness improvement playbook skill), which retired it in favor of improve-harness | none |
| harness-review-scope | personal, retired | S-004L (harness improvement playbook skill), which retired it in favor of improve-harness | none |

## primitives

Skills other skills compose: interviews, notes, promotion, documentation, vocabulary and testing.

| Skill | Source | Owning Spec | Matt counterpart |
|---|---|---|---|
| grilling | core | S-00X (grilling skill rebuild) | grilling |
| notepad | core | S-00Y (notepad skill rebuild) | none |
| promote | core | S-01B (promote skill rebuild) | none |
| to-docs | core | S-01J (to docs skill rebuild) | none |
| save | core | S-01O (save skill rebuild) | none |
| tracer-bullet | core | S-01M (tracer bullet skill rebuild) | part of to-tickets |
| domain-modeling | pending | S-002H (domain modeling skill) | domain-modeling |
| ubiquitous-language | pending | S-003L (ubiquitous language skill alignment) | removed upstream (superseded by domain-modeling) |
| codebase-design | pending | S-003M (codebase design skill alignment) | codebase-design |
| tdd | pending | S-003N (tdd skill alignment) | tdd |
| lexicon | personal | S-003O (lexicon skill alignment) | none (nearest domain-modeling, wait-what) |
| writing-for-agents | new, becomes core | S-002P (writing for agents skill adoption) | writing-for-agents |

## productivity

Skills for working with people and other agents: handoff, teaching, questionnaires.

| Skill | Source | Owning Spec | Matt counterpart |
|---|---|---|---|
| handoff | core | S-01A (handoff skill rebuild) | handoff |
| teach | pending | S-003A (teach skill alignment) | teach |
| wizard | pending | S-003B (wizard skill alignment) | wizard |
| wait-what | new | S-003C (wait what skill adoption) | wait-what |
| to-questionnaire | new | S-003D (to questionnaire skill adoption) | to-questionnaire |

## stances

The jobs an agent takes inside an assignment: Builder, Auditor, Reviewer, Reconciler and two Foundry-origin ones.

| Skill | Source | Owning Spec | Matt counterpart |
|---|---|---|---|
| builder | core | S-01P (builder skill rebuild) | none |
| auditor | core | S-01Q (auditor skill rebuild) | none |
| reviewer | core | S-01R (reviewer skill rebuild) | none |
| reconciler | core | S-01S (reconciler skill rebuild) | none |
| role-engineer | personal, Foundry origin | S-003E (foundry origin skills triage) | none (nearest builder) |
| first-responder | personal, Foundry origin | S-003E (foundry origin skills triage) | none |

## foundry

Foundry-origin skills and two adjacent personal skills (`chronicle`, `clean-my-ai-harness-codex`, which are not Foundry skills and take `origin: other`), kept here as drafts until the owner decides whether to adopt, retire or hand back each one.

| Skill | Source | Owning Spec | Matt counterpart |
|---|---|---|---|
| preflight | personal, Foundry origin | S-003E (foundry origin skills triage) | none |
| land | personal, Foundry origin | S-003E (foundry origin skills triage) | none |
| launch-flight | personal, Foundry origin | S-003E (foundry origin skills triage) | none |
| in-flight | personal, Foundry origin | S-003E (foundry origin skills triage) | none |
| landing-check | personal, Foundry origin | S-003E (foundry origin skills triage) | none |
| postflight-check | personal, Foundry origin | S-003E (foundry origin skills triage) | none |
| foundry-slice | personal, Foundry origin | S-003E (foundry origin skills triage) | none |
| chronicle | personal | S-003E (foundry origin skills triage) | none |
| clean-my-ai-harness-codex | personal | S-003E (foundry origin skills triage) | none |

## Notes

- `to-tickets` is the stale name of `to-tasks`; it has a row so its retirement is visible, and its owning Spec folds it into the `to-tasks` article.
- `writing-for-agents` replaces `writing-great-skills`, which folds into its Spec and has no row of its own.
- The 15-skill Harness Feedback Review family (`harness-feedback-review`, its three composites and its eleven stages) was retired by the Harness Improvement Playbook Skill Spec (S-004L) in favor of the one `improve-harness` core skill, whose article is [skill-improve-harness.md](../skill-improve-harness.md); its rows stay so the retirement is visible, no draft article is written for them, and removing the host copies is the owner's. The Foundry triage Spec covers eleven skills: the nine in `foundry` plus `role-engineer` and `first-responder` in `stances`, the owner's accepted exception to one Spec per skill.
- Whether a Foundry-origin skill is adopted, retired or handed back is decided later from that triage Spec's output, never by drafting an article.
