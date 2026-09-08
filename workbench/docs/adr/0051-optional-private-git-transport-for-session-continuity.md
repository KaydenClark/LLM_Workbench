---
status: accepted
date: 2026-09-08
canonicalized_in:
  - BLUEPRINT.md
  - workbench/specs/S-052-private-session-transport/SPEC.md
---

# Optional private Git transport for session continuity

Optional private Git transport uses workbench_sessions. A stable Workbench
identity in the project manifest survives clone/worktree/rename/relocation;
independent rooms receive a different identity. It names the namespace, distinct
from visible type-scoped artifact IDs.

Selected live notepads, grilling and handoff records map into
workbenches/<WBID>/sessions/ with a small workbench.json. Agents continue to use
manifest-declared project paths; machine-specific paths are local configuration.
Schemas, templates and promoted documents stay in project Git; live records stay
ignored there. Fetch before resume, push after meaningful saves and switching
devices, name pending offline work and last confirmed remote revision.
Serialize local sync, keep one active writer per note, preserve competing
revisions and expose conflicts. Never silently overwrite or force push.

Considered alternatives: Project Git publication exposes working context and conflates promotion with
transport. Required cloud service or always-online state breaks local operation.
A private sync copy does not transfer unpushed code or running processes.

Consequences: Git history retention is accepted: deletion removes current files, not history.
Privacy and non-authority rules remain. This narrows ADR-0040/0028's local-only
transport boundary, without making private commits durable project evidence.
Real Mac/Windows Claude/Codex save/resume, offline and conflict proof are required
before claiming the selected cross-device capability.

Provenance: owner-requested v3.2.0 implementation and make-it-so promotion,
2026-09-08; reconciled concern CAND-N in
[S-050](../../specs/S-050-workbench-v3-2-0-release/SPEC.md).
Historical source statuses and lineage remain in its complete reconciliation.
Acceptance of this decision is not a claim its runtime or outcome is implemented.
