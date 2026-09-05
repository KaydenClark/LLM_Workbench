---
status: accepted
date: 2026-09-04
ported_from: GPT_OS ADR-0019 (shared sessions lane), with its force-add convention replaced
canonicalized_in:
  - AGENTS.md
  - RUNBOOK.md
---

# Live session records stay untracked; durable references target promoted checkpoints

Grilling notepads and handoffs share one `sessions/` lane as `sessions/grilling/` and `sessions/handoffs/`, both untracked by default. A record becomes durable only by a deliberate, privacy-checked promotion into the tracked `sessions/checkpoints/` collection, and every durable reference from an ADR, spec, or control targets that promoted copy. An untracked local path is not durable evidence.

Considered and rejected: force-adding a cited live notepad in place. It leaves the cited file inside an ignored directory, so a clean clone cannot tell which neighbours are recoverable, and it skips the privacy check a public repository needs before a working record is published.

Consequences: `/checkpoint` and `/make-it-so` promote through the checkpoint collection; `doctor` reports a durable reference into an untracked collection as a defect; the `journal/` name remains unused because it is occupied by an append-only ledger concept in downstream deployments.

Provenance: owner-reviewed v3.1 greenlight decision, promoted 2026-09-04; see the tracked checkpoint `llm-workbench-v3-1-plan-2026-09-04.md` in the manifest-declared checkpoint collection.
