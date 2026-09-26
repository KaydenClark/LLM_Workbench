# TK-002O - Widen an active record's ID with the explicit widen-id verb

**Task ID:** TK-002O
**Spec ID:** S-01W
**Slice:** Widen an active record's ID with the explicit widen-id verb
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-01W Desired Behavior 5 and acceptance line 3 (eligible touch migration preserves former IDs, live links and immutable history without renaming completed records).
**Planned verification:** Red: in a disposable Git room with an active Spec `S-00Q` (one live link to it from another Spec and one historical evidence row naming it) and an active Task `TK-00A`, `widen-id S-00Q` and `widen-id TK-00A` are unknown commands; green: each widens once to `S-000Q` / `TK-000A` (folder, `**Spec ID:**`/`**Task ID:**` field, live links rewritten through the move machinery's reference rewrite), records the former ID in explicit record metadata that parses and round-trips, keeps evidence rows byte-identical and countable, resolves the former ID through dual-form lookup, and a repeat run is a no-op; it refuses without partial mutation for complete Specs, done Tasks, retired records, a dirty tree, an occupied destination or alias, and an unsafe path.

## Outcome

An agent starting substantive work on an active record can run
`widen-id S-###|TK-###` to bring its identity to the width-four form. The
command is explicit and identity-only: it never changes status, never touches
completed or retired records, and preserves the former ID and immutable
history. A read-only inventory at QA/verify time (the assembled QA slice) finds
active records still short.

## Authority And Source

Lane I (`claude-lane-I`) cut this Task under the owner's 2026-09-26 instruction
relayed by the Claude Director. Sources: ledger row E-8 (owner answer
2026-09-22: existing IDs widen only when their record is next touched, former
ID kept; completed records are not renamed; sweep only at QA/verify) and the
Director's E-8-derived decision recorded in S-01W Decisions (explicit
`widen-id` verb; automatic widening in `claim` and no widening rejected;
owner-vetoable).

## Released Lane

Write lane: `workbench/tools/spec-workbench.mjs` (new `widen-id` verb reusing
the `move-spec`/`move-task` reference-rewrite and scan machinery; do not change
lifecycle move behavior), `workbench/tools/task-record.mjs` (former-ID field
parse/format round trip), `tools/test-spec-workbench.mjs`,
`tools/test-visible-id-consumers.mjs`, and the ADR-0041 delivered/remaining
paragraph. The exact former-ID field name and shape are settled here and
recorded in the Task's Decisions section as a durable choice routed to ADR-0041.

## Decisions

None yet; the former-ID field shape is decided and recorded here during the Task.
