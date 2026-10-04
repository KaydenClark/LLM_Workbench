---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner requested one durable Wiki article per Spec on 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task Move And Retype Remaining Per-Spec Articles (TK-002) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-053-configured-host-capabilities/SPEC.md
  - tools/configured-host.mjs
  - tools/test-configured-host.mjs
  - workbench/specs/S-053-configured-host-capabilities/local-host-result.json
last_verified: 2026-10-04
---

# Configured Host Capabilities

Configured-host conformance asks what the actual host can do at named command seams. The Configured Host Capabilities Spec (S-053) delivered it so capability, enforcement and agent reliability stay separate: a runner operation passing does not establish that an agent discovers the skill or reliably obeys the workflow.

## What It Does

The accepted minimum has five checks:

1. Declared writable lanes work in supported relative, home-relative and absolute forms.
2. A skill in the declared discovery root is discoverable and invocable by the configured provider.
3. The declared Node runtime executes managed tools.
4. The host supports its selected directory discovery adapter, a symlink or junction.
5. Record syntax survives checkout, including line endings.

An unavailable capability affects only the operation that needs it. The public command and its tests check bounded operations and return explicit unavailable or unverified results.

## Why It Matters

Host configuration, tool paths and native provider behavior need their own evidence; fixture or source availability cannot substitute for that evidence. In particular, filesystem and parser probes cannot establish native provider discovery or invocation.

## Limits

- Git network access, optional synchronization, provider enforcement hooks and model output quality are outside this floor.
- The retained `local-host-result.json` records four runner checks passing while native discovery/invocation remains unverified.
- The Spec does not claim Windows or native Claude support from that result, nor broader rollout readiness.
- The later integration proof closes its source delivery boundary without changing those observation limits. New host claims require a fresh actual-host check.

## Evidence and Sources

The source record was read at `bc370fe742d5ddb8348bf361fccea31205f6cee7` and the named current owners were inspected during article preparation. Historical tests are attributed to the original record, not claimed rerun here.

- [Historical Configured Host Capabilities Spec (S-053)](../../specs/S-053-configured-host-capabilities/SPEC.md). Original decisions, corrections, acceptance and evidence retain their own scope; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `bc370fe`](https://github.com/KaydenClark/LLM_Workbench/blob/bc370fe742d5ddb8348bf361fccea31205f6cee7/workbench/specs/S-053-configured-host-capabilities/SPEC.md). Exact source recovery: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-053-configured-host-capabilities/SPEC.md`.
- [tools/configured-host.mjs](../../../tools/configured-host.mjs) - the configured-host command.
- [tools/test-configured-host.mjs](../../../tools/test-configured-host.mjs) - its verification seam.
- [Retained local host result](../../specs/S-053-configured-host-capabilities/local-host-result.json) - the retained runner result named under Limits.

## History

- 2026-09-19: Reconciled into one article on owner direction; source records and proof remain intact pending their lifecycle gates.
- 2026-10-04: Moved from `design-concepts/spec-S-053-configured-host-capabilities.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task Move And Retype Remaining Per-Spec Articles (TK-002). Every live link to it was rewritten by the move; no claim was changed.
