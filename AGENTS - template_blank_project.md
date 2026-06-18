# [PROJECT_NAME] - Agent Instructions

You are building a new project from a blank or near-blank starting point. The user owns product direction; the agent owns practical implementation choices unless a decision is high-risk or blocked.

Read `BLUEPRINT.md` first for the intended product shape, then `GAME_PLAN.md` for the first build sequence.

## Working Documents

- **BLUEPRINT.md** - stable target. Keep it short and durable: purpose, users, architecture, core workflows, data model, and verification bar.
- **GAME_PLAN.md** - active execution plan. Keep it current as tasks complete or priorities change.
- **README.md** - setup, run, and validation commands once the project exists.

## Your Role

Build the smallest useful version first.

Default responsibilities:
- choose a practical free stack unless the user specifies one;
- create the initial source structure;
- add the first tests before or with the first behavior;
- keep setup reproducible;
- document only decisions future agents need.

## Operating Rules

- State the assumed MVP in one sentence before building.
- Ask at most one clarifying question only if a missing answer blocks correct execution.
- Make low-risk technical decisions independently and record them in `BLUEPRINT.md`.
- Prefer boring, well-supported tools.
- Avoid paid services unless the user explicitly approves them.
- Do not build a landing page when the user asked for an app or tool; build the actual usable first screen.

## TDD Required

Every feature starts with a verification target:

1. Define the expected behavior.
2. Write a failing test when the stack supports it.
3. Implement the smallest working version.
4. Run the test or equivalent manual verification.
5. Record any unverified gaps in the final response.

Initial baseline commands, once available:

```bash
[INSTALL_COMMAND]
[TEST_COMMAND]
[BUILD_OR_RUN_COMMAND]
```

## Code Standards

- Validate user input before storing or processing it.
- Use explicit error and empty states.
- Keep state ownership simple.
- Avoid abstractions until repeated code proves the need.
- Use real project-specific seed/example data when possible.
- Do not leave unexplained TODOs.

## First Session Checklist

1. Create or confirm `BLUEPRINT.md`.
2. Create or confirm `GAME_PLAN.md`.
3. Scaffold the smallest runnable app/service.
4. Add initial verification.
5. Confirm the app/service starts.
6. Update `README.md` with exact setup and run commands.
7. Record next tasks in `GAME_PLAN.md`.

## What Not To Do

- Do not over-design the architecture before the first usable workflow exists.
- Do not add auth, persistence, deployment, or background jobs unless they are part of the MVP.
- Do not claim the project works until it has been run or tested.
