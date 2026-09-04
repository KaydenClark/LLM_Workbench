---
status: proposed
date: 2026-09-04
canonicalized_in:
  - AGENTS.md
  - RUNBOOK.md
---

# Diagnostic codes carry registered blocking semantics that consumers enforce

Every diagnostic a Workbench tool can emit is registered in trusted tool code with a stable `code`, a `severity` of `error` or `attention`, a `scope`, and a blocking effect of `all`, `selection`, `selected-slice`, or `none`. The commands that consume diagnostics enforce those effects: `doctor` fails on `all` and `selection`, `next` excludes blocked work, `claim` refuses a slice with a slice blocker, and `attention` stays visible without blocking. No artifact, manifest field, spec row, or projection may declare whether its own finding blocks.

Considered and rejected: a flat issue list where every finding fails `doctor`. It made a stale wiki link as blocking as an unsafe manifest, so agents learned to treat the whole report as noise or to repair projections before the work that would make them current, the deadlock [ADR-0020](0020-a-check-blocks-only-the-change-it-evaluates.md) forbids.

Consequences: an unsafe or unreadable manifest blocks all; identity ambiguity or lifecycle contradiction blocks selection; a concrete unmet dependency named by the selected ticket blocks that slice; stale registers, stale claims, and unrelated wiki staleness are attention. Adding a code or changing its effect is a tool change with a test, never a prose edit.

Provenance: owner-reviewed v3.1 greenlight decision, promoted 2026-09-04; see the tracked checkpoint `llm-workbench-v3-1-plan-2026-09-04.md` in the manifest-declared checkpoint collection.
