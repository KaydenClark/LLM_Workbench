# S-019 - Context Packaging And Research Workspaces

> Generated from LLM Workbench v2.3. Stable path
> `specs/S-019-context-research-tools/SPEC.md`; never move between status folders.

**Spec ID:** S-019
**Status:** complete
**Priority:** 4
**Owner:** codex
**Updated:** 2026-07-17
**Catalog description:** Package selected repository context safely and scaffold durable question-focused research without adding dependencies.
**Blockers:** none
**Latest event:** Existing context and research helper tools were captured as one durable supporting capability.
**Next gate:** none

## Outcome

An agent can assemble a bounded Markdown or XML context packet and create a
durable research folder for one question without copying secrets, dependency
trees, or unrelated project history.

## Why It Matters

Progressive disclosure still needs a deliberate way to package the few files a
model or reviewer needs. Research also needs a durable result when chat alone is
not enough, without introducing a hosted knowledge system or bespoke dependency.

## Current Verified State

- `tools/context-pack.mjs` accepts explicit files or folders, ignores common
  generated/secret paths, supports Markdown, line numbers, and Claude XML.
- `tools/new-research-project.mjs` creates a slugged question folder with
  `notes.md` and `README.md`.
- `research templates/README.md` documents the question-first workflow.
- `tools/test-context-tools.mjs` verifies exclusions, formats, and scaffold output.

## Desired Behavior

- Context selection is explicit, portable, deterministic, and safe by default.
- Gitignore and caller exclusions are honored; secrets and dependency/build
  directories are not packaged accidentally.
- Research scaffolding creates one folder per question and preserves the final
  answer, evidence, verification, and uncertainty.
- These helpers support the harness but do not become canonical project memory.

## Decisions And Contracts

- Zero npm dependencies.
- Explicit caller paths define scope; the tool does not crawl external roots.
- Markdown and XML output preserve source names and optional line numbers.
- Research results link to canonical project sources instead of duplicating them.

## Non-Goals

- Replacing OpenBrain, the Wiki, project specs, or source control.
- Reading secrets, browser state, local databases, or arbitrary external paths.
- Hosting research or context packets as a service.

## Dependencies And Blockers

- none

## Vertical Implementation Slices

Tickets are temporary tracer bullets within this stable capability record.

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Package selected files as bounded Markdown or XML context | done | none | context-tools self-test |
| TK-002 | Scaffold one durable research question with notes and final README | done | TK-001 | context-tools self-test |

### Historical Done Criteria And Demo

- **TK-001 done criteria:** explicit inputs render as Markdown or XML with
  portable source names and optional line numbers while Gitignore, caller
  exclusions, dependencies, builds, tests, and secret-like files remain out.
  **Under-one-minute demo artifact:** `node tools/test-context-tools.mjs`
  prints the green bounded-context result.
- **TK-002 done criteria:** one command creates a slugged question folder with
  `notes.md` and a question-bearing final `README.md`, without making research
  canonical project memory. **Under-one-minute demo artifact:** the same
  `node tools/test-context-tools.mjs` run creates and inspects the disposable
  scaffold before reporting green.

## Acceptance Criteria

- [x] Explicit files and folders can be rendered as Markdown or XML.
- [x] Common secret, dependency, build, and caller-excluded paths are omitted.
- [x] Optional line numbers and portable source paths are supported.
- [x] Research scaffolding creates `notes.md` and a question-bearing `README.md`.
- [x] The helper remains zero-dependency and passes current full verification.

## Testing Seams

- Temporary folder containing included source, ignored tests, dependencies, and secret-like files.
- Temporary research root with deterministic slug and question output.

## Verification Procedure

```bash
node tools/test-context-tools.mjs
node tools/spec-workbench.mjs doctor
```

Then run the complete verification suite in `RUNBOOK.md`.

## Documentation Impact

- README and research template docs own public commands.
- This spec owns the cohesive supporting capability.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-17 | canon harvest | Captured implemented context and research helpers as a stable capability | Context-tools self-test, render, doctor, and complete Runbook checks passed | Added S-019 and Blueprint coverage mapping | none |
| 2026-07-17 | audit remediation | Added historical done criteria and under-one-minute context/research demos | Context-tools self-test, full planning verification, render, doctor, and diff check passed | Updated S-019 only; README and research template commands remain accurate | none |

## Completion Result

Pass. Bounded context packaging and durable research scaffolding are shipped,
tested, portable, and explicitly subordinate to canonical project truth.

## Remaining Limitations Or Follow-Up Specs

- none

## Supersession

- Supersedes: none
- Superseded by: none
