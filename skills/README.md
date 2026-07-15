# Workbench Agent Skills

Conversational front doors for the Workbench harness: interview (grill), spec
capture, ticket breakdown, implementation, review, and diagnosis flows that
agents and the owner invoke instead of retyping the process each session.

## Provenance

Except `update-harness` (authored in this repo), these skills were imported
2026-07-14 from [mattpocock/skills](https://github.com/mattpocock/skills)
(MIT license, author Matt Pocock), taken from the snapshot installed at
`GPT_OS/.agents/skills/`. Imported files are the unmodified upstream text;
rewrites to Workbench vocabulary happen as tracked commits on top, per spec
S-011. Upstream skills not imported (author-personal, course tooling, or
superseded) remain only in the untracked `.agents/skills/` snapshot.

## Disposition (S-011)

| Group | Skills | Plan |
|---|---|---|
| Core flow — rewire to Workbench nouns | grilling, grill-me, grill-with-docs, to-spec, to-tickets, implement, tdd, code-review, diagnosing-bugs, prototype, research, handoff | Replace `docs/agents/` + `CONTEXT.md` + `.scratch/` + issue-tracker contract with `BLUEPRINT.md`, `specs/S-###-slug/SPEC.md`, `TASKBOARD.md` projection, `RUNBOOK.md` verification, evidence rows |
| Rewrite or heavy edit | ask-matt (becomes the Workbench router skill), codebase-design, design-an-interface, domain-modeling | Keep the design vocabulary; route outputs to Blueprint/spec decisions instead of parallel docs |
| Parked pending need | triage, qa, wayfinder, claude-handoff, teach, setup-pre-commit, wizard, setup-ts-deep-modules, resolving-merge-conflicts, improve-codebase-architecture | Imported unmodified; adopt or drop per project demand |
| Workbench-native | update-harness, writing-great-skills (authoring reference) | update-harness is Kayden's; writing-great-skills guides skill rewrites |

Until a skill's rewrite lands, treat its upstream conventions (GitHub issues,
`.scratch/`, `CONTEXT.md`, `docs/agents/`) as **not in effect** in Workbench
projects; the harness control docs remain the only truth contract.

## Deployment

Canonical source is this folder. Projects expose skills to Claude Code via a
`.claude/skills` entry (symlink to this folder or a copied subset). GPT_OS root
links here directly. Distribution to other projects rides the normal harness
upgrade path (`update-harness`, RUNBOOK "Upgrading The Harness").
