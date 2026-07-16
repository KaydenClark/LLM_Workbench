# [PROJECT_NAME] - Blueprint

> Generated from LLM Workbench v[HARNESS_VERSION].

**Last reviewed:** [YYYY-MM-DD]
**Status:** [active / partial / stale]
**Source root:** `[ABSOLUTE_PROJECT_PATH]`

## Product Map

[One paragraph: what this product is, who it serves, and the problem it solves.]

Core promise:

> [Concrete user-facing promise.]

## Goals And Pillars

- **[Pillar]:** [stable product direction]
- **[Pillar]:** [stable product direction]
- **[Pillar]:** [stable product direction]

## Cross-Cutting Architecture And Invariants

| Layer / concern | Choice | Invariant / source |
|---|---|---|
| Runtime | [RUNTIME] | [constraint/source] |
| Product surface | [FRONTEND_API_CLI_OR_OTHER] | [constraint/source] |
| Data/storage | [STORAGE_OR_NONE] | [constraint/source] |
| Testing | [TEST_STACK] | [constraint/source] |
| Deployment/runtime | [DEPLOYMENT_OR_NONE] | [constraint/source] |

Rules that span multiple capabilities:

- [Invariant]
- [Privacy/safety boundary]
- [Architecture decision future specs must preserve]

Source and tests remain implementation truth. Put capability-specific
requirements and decisions in its stable spec, not here.
Put accepted project-wide definitions in `LEXICON.md`; the Blueprint helps
participants recover the design concept but is not itself the design concept or
the project glossary.

## Non-Goals

- [Non-goal]
- [Non-goal]

## Spec Catalog

The generated catalog links every durable capability record, including completed
history. Human-authored product prose stays outside the markers.

<!-- spec-catalog:start -->
| Spec | Description | Status |
|---|---|---|
| [S-001 - Capability](specs/S-001-capability/SPEC.md) | [Short catalog description] | planned |
<!-- spec-catalog:end -->

## Cross-Cutting Health

- `[BASELINE_TEST_COMMAND]` passes;
- `[BUILD_LINT_OR_AUDIT_COMMAND]` passes when relevant;
- the primary workflow succeeds end to end;
- secrets and private data stay out of committed output;
- spec doctor/render checks report no lifecycle, link, or projection drift.
