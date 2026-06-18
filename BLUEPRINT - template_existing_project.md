# [PROJECT_NAME] - Blueprint

**Last reviewed:** [YYYY-MM-DD]  
**Status:** existing project audit

This is the stable reference for the project. It describes what the project is, how it is built, what is already working, and what remains unfinished. Keep this document factual and source-backed.

## What This Project Is

[One paragraph describing the product/service/tool and who uses it.]

Core promise:

> [A concrete user-facing promise, written in plain language.]

This project is not:

- [Non-goal 1]
- [Non-goal 2]
- [Non-goal 3]

## What It Looks Like When Complete

When complete, a user can:

- [Workflow or capability 1]
- [Workflow or capability 2]
- [Workflow or capability 3]
- [Workflow or capability 4]

The most important quality bar is:

- [correctness / speed / reliability / privacy / ease of use / other]

## Architecture

| Layer | Choice | Notes |
|---|---|---|
| Runtime | [RUNTIME] | [version/source] |
| Frontend | [FRONTEND_OR_NONE] | [notes] |
| Backend | [BACKEND_OR_NONE] | [notes] |
| Database/storage | [STORAGE] | [notes] |
| Auth | [AUTH_OR_NONE] | [notes] |
| Testing | [TEST_STACK] | [notes] |
| Deployment/runtime | [DEPLOYMENT] | [notes] |

## Directory Map

```text
[PROJECT_ROOT]/
├── [path]/        <- [purpose]
├── [path]/        <- [purpose]
└── [path]         <- [purpose]
```

## Main Contracts

Use the sections that apply. Delete irrelevant sections.

### Routes / Screens

| Route or screen | Purpose | Status |
|---|---|---|
| `[ROUTE]` | [purpose] | [working/partial/missing] |

### API Endpoints

| Method | Path | Auth | Purpose | Status |
|---|---|---|---|---|
| `[METHOD]` | `[PATH]` | [yes/no] | [purpose] | [working/partial/missing] |

### Data Model

| Entity | Key fields | Notes |
|---|---|---|
| `[ENTITY]` | `[FIELDS]` | [notes] |

## Core Logic

[Describe the most important domain logic and where it lives.]

Rules:

- [Invariant 1]
- [Invariant 2]
- [Invariant 3]

Do not duplicate this logic in:

- [places where reimplementation would cause bugs]

## What Is Built

- [Verified capability 1]
- [Verified capability 2]
- [Verified capability 3]

## What Is Not Built Yet

- **[Missing item]** - [why it matters / blocker / dependency]
- **[Missing item]** - [why it matters / blocker / dependency]

## Known Risks

- [Risk or technical debt item]
- [Risk or technical debt item]

## Environment

Required local configuration:

```bash
[ENV_VAR]=[description]
[ENV_VAR]=[description]
```

Setup:

```bash
[INSTALL_COMMAND]
[RUN_COMMAND]
```

Verification:

```bash
[TEST_COMMAND]
[BUILD_COMMAND]
```

## Key Design Decisions

**Why [decision]?**  
[Short rationale.]

**Why [decision]?**  
[Short rationale.]
