# LLM Workbench

## Dev environment tips

- Start with `git status --short --branch` and the [Runbook](RUNBOOK.md#operations-index). Load the relevant tracked skill before performing its operation.
- Resolve assigned work through [the manifest](workbench/manifest.json). Read the assigned Spec and Task before editing; use [implement](workbench/skills/implement/SKILL.md#work-selection-and-lifecycle) to select and claim work.
- Use the [Wiki router](workbench/wiki/MEMORY.md) for project context, [Lexicon](LEXICON.md#task-routing) for meanings and ownership, and [Blueprint](BLUEPRINT.md) for architecture. Follow their relevant links; use a bounded search when a route fails.
- Finish the user's requested endpoint. Resolve reversible decisions within scope and recover existing answers before asking. Do not add approval gates or treat a question as authorization.
- Read source and dependencies before editing. Make the smallest correct change and preserve unrelated dirty work. Keep one writer for shared state.
- Edit only root control/docs files, `templates/`, `workbench/`, `team templates/`, `research templates/`, `tools/`, `evals/`, `outcomes/` and `benchmarks/` within the assignment. Ask before changing `LICENSE`, `research papers/` or another repository. Do not read or touch Dungeon Friends without a separate request.
- Ask before destructive actions, paid services or scope expansion. Never commit secrets or private data; stop and report committed credentials you discover. Use another agent provider only on the owner's specific instructions in the current request.
- Maintain changed documentation through [to-docs](workbench/skills/to-docs/SKILL.md). Preserve consequential working context through [notepad](workbench/skills/notepad/SKILL.md), and verify live state when resuming.

## Testing instructions

- Run `node workbench/tools/spec-workbench.mjs doctor` to check the room and `node tools/test-evaluate-workbench.mjs` for the fast check.
- For behavior changes, confirm a failing test before implementing the fix. Run targeted checks, then the [full verification suite](RUNBOOK.md#test-and-build). Run that suite for controls, templates, tools, evals and Spec changes too.
- Check the result against the assigned acceptance criteria. Fix failures within scope; report exactly what remains unverified. Never weaken checks to get a pass or clear review findings with unrelated green tests.
- For harness changes, run the before/after [room checks](workbench/skills/workbench-room-checks/SKILL.md). Update generic templates alongside root files or explain the exemption.

## PR instructions

- Branch from the current target using `codex/`, `claude/` or `backup/`. Never commit directly to `main` or `integration`; PRs default to `integration`. Follow the [release owner's exceptions](workbench/specs/S-00O-workbench-v4-0-0-release/SPEC.md#bootstrap-exemptions).
- Keep each commit to one logical change with an imperative subject. Include the Worker's [merge-safety and completion answers](workbench/skills/implement/SKILL.md#4-review-at-the-relevant-boundary) in the PR.
- Follow [code-review](workbench/skills/code-review/SKILL.md) at the required review boundary. Do not request separate-context review for a Task or merge while required review is pending.
- When integration is authorized and its gates pass, merge, prove containment and clean up through [implement](workbench/skills/implement/SKILL.md#branch-completion). Leave owner approval and promotion to `main` to the owner.
- Report what changed, why, risks, verification and the endpoint reached. Preserve unresolved review and Human QA findings in their existing owners.
