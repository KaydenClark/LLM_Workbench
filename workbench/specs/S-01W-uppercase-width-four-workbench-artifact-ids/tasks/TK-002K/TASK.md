# TK-002K - Resolve short and widened IDs to one stored record

**Task ID:** TK-002K
**Spec ID:** S-01W
**Slice:** Resolve short and widened IDs to one stored record
**Status:** ready
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-01W Desired Behavior 3 and 4 for public Spec and Task selectors.
**Planned verification:** Red: in a disposable room holding stored `S-00Q` with Task `TK-00A`, `show S-000Q`, `claim S-000Q` and a widened Task selector (`TK-000A`) fail as unknown while the short forms work; green: widened and short selectors (and case variants that share the collision key) resolve to the one stored record, output reports the stored ID and path unchanged, two records sharing one key refuse selection by name, numeric historical Task labels keep Spec-qualified scope, and no record bytes or paths change.

## Outcome

Public Spec and Task operations accept every supported spelling of an identity
(`S-00Q`, `S-000Q`; `TK-00A`, `TK-000A`) and act on the one stored record,
reporting its stored identity and path. Ambiguous duplicates refuse rather than
choosing a winner. Nothing is renamed: widening is the later `widen-id` slice.

## Authority And Source

Lane I (`claude-lane-I`) cut this Task under the owner's 2026-09-26 instruction
relayed by the Claude Director. Source: ledger row E-8 (owner answer
2026-09-22): the allocator treats `S-00Q` and `S-000Q` as the same, with
dual-form lookup, and existing IDs are not mass-renamed.

## Released Lane

Write lane: `workbench/tools/spec-workbench.mjs` (selector resolution: trace
`findSpec`, parent checks in `next-id`, Task selectors in `claim`/`close`/
`show`/`move-task`, blocker matching and retired explicit lookup),
`workbench/tools/task-record.mjs` only if Task lookup lives there,
`tools/test-visible-id-consumers.mjs`, `tools/test-spec-workbench.mjs`, and the
ADR-0041 "delivered" paragraph. If the trace shows QA/report consumers
(`spec-report.mjs`) also need it and the change exceeds one bounded Task, stop
at the Spec/Task command surface and record the remainder as a gap.

Also carry TK-02B's review note: an active record and a retired record whose
IDs share one collision key are diagnosed by `doctor` but folded as occupied
inventory by `next-id`; decide at the selector seam whether selection by that
key refuses (Desired Behavior 3: ambiguous duplicates refuse rather than
choosing a winner), and prove the chosen behavior in a fixture.

## Decisions

None.
