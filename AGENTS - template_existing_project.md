# [PROJECT_NAME] - Agent Instructions

You are working in an existing project. The code is the source of truth. Read `BLUEPRINT.md` first to understand what the project is supposed to do, then read `GAME_PLAN.md` to understand current priorities.

## Working Documents

- **BLUEPRINT.md** - stable reference. Describes product purpose, architecture, contracts, data model, and completed behavior.
- **GAME_PLAN.md** - active plan. Describes current state, deferred work, next tasks, and verification expectations.
- **README.md** - setup and run commands. If README conflicts with source code, verify the source and update the stale doc.

## Your Role

You maintain this project without changing its direction unless the user asks for that.

You may edit:
- `[PRIMARY_SOURCE_DIRS]`
- `[TEST_DIRS]`
- `[DOCS_TO_KEEP_CURRENT]`

Do not edit:
- `[OUT_OF_SCOPE_DIRS_OR_REPOS]`
- unrelated generated files, secrets, local data, or dependency lockfiles unless the task requires it.

## Operating Rules

- Start by restating the current build goal in one sentence.
- Read relevant files before editing.
- Prefer the smallest correct change.
- Preserve existing architecture, naming, and style.
- If docs and code disagree, trust verified code, flag the drift, and update docs when appropriate.
- Do not invent APIs, files, functions, behavior, or test results.
- Do not add dependencies without explaining what they do and why they are needed.

## TDD Required

Every feature and bug fix follows red/green/refactor:

1. Write or update a failing test that proves the expected behavior.
2. Run the test and confirm it fails for the right reason.
3. Implement the smallest change that makes it pass.
4. Refactor only while tests stay green.
5. Run the relevant full verification command before calling the work done.

Current expected baseline:

```bash
[VERIFY_BASELINE_COMMAND]
```

If the baseline is red before your change, stop and identify whether the failure is pre-existing or caused by your work.

## Code Standards

- Validate inputs at boundaries.
- Use explicit error handling.
- Keep files focused; split only when the existing style supports it or the file is becoming hard to maintain.
- Add comments only to explain non-obvious decisions or constraints.
- Keep user-facing text specific to this project; do not use lorem ipsum or placeholder product content.

## Day-One Checklist

1. Read `BLUEPRINT.md`.
2. Read `GAME_PLAN.md`.
3. Read the files directly touched by the requested work.
4. Check branch/status if version control is present.
5. Run `[VERIFY_BASELINE_COMMAND]` before feature work when practical.
6. Implement with tests.
7. Run `[VERIFY_FINAL_COMMAND]`.
8. Update `GAME_PLAN.md` or `BLUEPRINT.md` only when the durable project state changed.

## What Not To Do

- Do not rewrite working systems just to make them cleaner.
- Do not broaden scope without a concrete reason.
- Do not mark work complete without verification.
- Do not hide uncertainty; state what was not verified.
