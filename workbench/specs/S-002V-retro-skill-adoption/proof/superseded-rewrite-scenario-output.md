# Retrospective: cart quantity bug session

## Target and scope

The user requested improvements to the environment for future runs of the session recorded in `[scenario fixture]/session.md`. This report preserves scenario output at the explicitly assigned temporary destination. It proposes changes and records no approval or performed repair.

Method: read the supplied record as the available primary evidence, distinguish recorded events from repository observations and hypotheses, and identify existing owners before proposing interventions. The coding session's date, application, model, configuration, repository location, and commit are unknown. The reporting host is Codex desktop on macOS; the evaluated session's host and model are unknown. No independent reviewer participated.

Skill source inspected: `workbench/skills/retro/SKILL.md`, `workbench/skills/writing-for-agents/SKILL.md`, and its `SKILL-MECHANICS.md` in `[isolated skill checkout]` at `8925425cdb13ec161698a5adfa99ad4126b67578`. Scenario coverage relates to the retro adoption Spec S-002V and writing-for-agents adoption Spec S-002P; this is not an integration review of those Specs.

## Evidence and limitations

- Read the entire supplied session record and its repository observations. Evidence state: supplied fixture; capture date and underlying revision unknown. Its SHA-256 is `f2048edf68c70a9e1d70f8ad752460c49eec527ee8f6dc5d13c29c032330767a`.
- Recorded sequence, lines 4–9: the agent changed cart totals without adding a regression test; `npm run check` failed for negative quantities; the agent added a clamp and claimed completion without rerunning; the user reported fractional quantities still failed; a later run failed for fractions; validation was corrected and the final recorded run passed. This is an eventual pass after failure and owner correction, not a clean first pass.
- Recorded navigation, lines 10–11: 19 broad searches located discount rules already linked from `docs/README.md`.
- Repository observations, lines 15–20: `check` is `node --test test/cart.test.js`; `src/cart.js` owns calculation and validation; `AGENTS.md` points to the checkout documentation and requires the check before completion; no CI workflow or pre-commit hook runs it. These observations were examined before proposing guardrails, but could not be independently verified against the coding repository.
- Executed read-only `git status --short --branch` and `git rev-parse HEAD` in the skill repository: clean `codex/retro-skill` checkout at the candidate above, one commit ahead of its recorded upstream. Read that room's relevant controls and report format. Those files describe the skill producer, not the unavailable cart project.
- Bounded checks for the fixture's `docs`, `src`, `test`, and `.github` paths in the skill repository returned missing paths. The supplied fixture directory contains only `authoring-request.md` and `session.md`; no underlying cart source, package file, hooks, CI configuration, diffs, or raw tool logs were supplied. No `npm run check` was run here and no cart behavior was reproduced.

The short fixture is the available primary scenario record. It supports conclusions about what it explicitly records, but not claims about omitted actions, complete test coverage, exact source behavior, or why the agent ignored instructions. The literal tool transcripts and commits are unavailable. No private log search or expanded access is needed for this bounded task.

## Findings and proposed improvements

### F-001 — High: existing cart check has no automated delivery route

- **Problem and evidence:** The record includes a completion claim after an unverified clamp, followed by a user-discovered fractional failure (lines 6–9). The observations say the existing check has no CI or hook wiring (lines 15 and 19). A check exists and was skipped at that completion boundary; it is not an absent test command.
- **Smallest proposal:** Have the cart project's maintainer wire its existing `npm run check` into its normal pull-request CI route. Reuse existing CI configuration if there is any; otherwise add one small workflow that invokes that command using the project's supported runtime and dependency setup, after inspecting the actual package and lockfile. Do not introduce a second checker or require both a hook and CI by default.
- **Owner:** Cart project's maintainer and existing CI configuration owner. Their identity and CI path are unavailable; confirm them in the actual project before implementation. Code and tests remain owned by `src/cart.js` and `test/cart.test.js`.
- **Verification:** In a disposable candidate, demonstrate that the negative-quantity and fractional-quantity failing states cause the CI job to fail, then that the corrected candidate passes. Confirm the job actually runs on the project's delivery event. CI can guard delivery; it cannot prevent an agent from making an unsupported textual claim.
- **Confidence:** High that the fixture reports unwired checks; medium that this is the most useful delivery guardrail without live configuration or a fresh rerun. General effectiveness is untested.
- **Disposition:** `diagnostic`. No intervention was accepted. There is no accepted cart follow-up Spec supplied; ownership of an execution assignment remains a gap rather than an invented task.

### F-002 — Medium: completion relied on an intermediate fix instead of current verification

- **Problem and evidence:** The clamp was followed by a completion claim with no rerun (line 6), despite the existing `AGENTS.md` requirement (line 18). The subsequent fractional failure shows the practical consequence. The missing regression added before the first edit is recorded in line 4; the later failures also show existing tests already detected both defects.
- **Smallest proposal:** Refine the existing completion requirement in the cart project's `AGENTS.md` so its observable exit condition is the check result from the final edited state, cited in the hand-back. Keep the requirement with that owner instead of repeating it in multiple documents. For bug fixes, point the workflow at `test/cart.test.js` to reproduce the failing case before editing, adding a regression only where the actual tests lack coverage. Do not assume negative or fractional test cases are absent.
- **Owner:** Cart project's `AGENTS.md` maintainer; `test/cart.test.js` for any demonstrated coverage gap. No named maintainer or accepted follow-up Spec is supplied.
- **Verification:** Rerun this bug task in a fresh context. Observe a failing check or targeted regression before the fix, a check after the last code change, and a hand-back that identifies the actual result. Introduce a final fractional validation defect in a disposable fixture to check that the agent reports failure instead of completion.
- **Confidence:** High that the recorded completion rule was skipped; medium that a sharper completion condition helps. The reason it was skipped is unknown, and the present rule may already be clear enough. Inspect its exact wording and compare runs before deciding whether an instruction edit earns its context cost.
- **Disposition:** `diagnostic`. Proposed only; no instruction, source, or test was changed and no accepted execution owner was assigned.

### F-003 — Low: checkout navigation used repeated broad searches despite an existing route

- **Problem and evidence:** Lines 11–12 record 19 broad searches before finding `docs/discounts.md`; lines 17–18 identify the existing `AGENTS.md` → `docs/README.md` → discount rules route. This demonstrates tool cost, not a missing document or missing pointer.
- **Smallest proposal:** First inspect the actual checkout route and how it appears at entry. If its trigger or ordering is unclear, sharpen the existing pointer to require reading the checkout index before falling back to a bounded search. If it is already clear, retain that route and make no documentation change; test whether the agent actually follows it. Avoid copying discount rules into always-loaded instructions or inventing another router.
- **Owner:** Cart project's existing `AGENTS.md` checkout pointer and `docs/README.md` index maintainers. `docs/discounts.md` retains the rules. Named maintainers and an accepted follow-up Spec are unavailable.
- **Verification:** In a fresh checkout-discount scenario, observe whether the agent follows the existing two-link route and reaches the rules without broad repeated search. Preserve search-call count and outcome for comparison with the recorded 19 searches; do not claim improvement from pointer text alone.
- **Confidence:** High that repeated searches occurred in the fixture; low on the environmental cause. Pointer salience or ordering is a hypothesis, not an established defect.
- **Disposition:** `diagnostic`. Read and rerun before selecting an intervention; no repair is accepted or performed.

## Challenged or unsupported conclusions

- The record does not support adding a new test framework: the existing check detected negative and fractional failures.
- It does not establish that more validation rules, more steering text, or broader information access would help. The final recorded fix passed; its exact implementation and coverage are unavailable.
- It does not establish general agent reliability or effective native skill discovery or host enforcement. These skills were loaded directly from named paths for one fixture scenario.
- The eventual successful rerun is a useful lesson to retain: verify the corrected state. It does not erase the premature completion or prove that one clamp fixed the whole input domain.

## Next action and review boundary

All three candidates remain proposals. If the owner selects one, resolve the actual cart checkout and its existing work owner, then use the shipped `improve-harness` loop to inspect the current seam, baseline the task, make the smallest authorized intervention, and rerun. Route documentation to its existing owner through `to-docs`. No new lesson store, task, gate, or approval record is created here.

No code, steering file, hook, CI configuration, credential, fixture, or repository state was edited by this retrospective. The only retrospective write is this temporary output report. There was no independent review or integration action, and no unrun test is reported as passing.
