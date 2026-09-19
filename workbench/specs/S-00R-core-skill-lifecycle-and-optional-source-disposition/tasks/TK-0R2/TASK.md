# TK-0R2 - Convert optional-source inventory into evidence-backed dispositions

**Task ID:** TK-0R2
**Spec ID:** S-00R
**Slice:** Convert optional-source inventory into per-item retention or owner-gated removal dispositions
**Status:** done
**Stance:** Builder
**Blockers:** TK-0R0
**Destination:** spec-acceptance: Every optional item has retained purpose/provenance or an explicit owner-gated removal disposition
**Planned verification:** Red: catalog test fails for row without consumer/recovery route, provenance/attribution owner, or owner-gated status. Green: every item is retained with reason or marked `owner decision required`; repository scans are bounded evidence, not proof of no external consumer.
**Preservation and rollback:** Preserve optional source, notices, history, and archive-boundary tests. Only inventory/test text changes; revert if evidence changes. No removal, relocation, or discovery change.
**Bounded source evidence:** TK-0R0 inventory; README/catalog test; notices; bounded repository references. No external repo or Dungeon Friends.
**Proof:** Full 51-command suite passed on immutable 58a1b3b2caaaa0ece5414d4c027d97c388ab1b1c; separate-context source review PASS; shared command proof in S-00U/VERIFICATION.md.

## Done Criteria

Catalog rows distinguish retained, unresolved, and candidate items per path and
name the owner gate for every potential deletion.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/parallel-repair-assembly | 6bf32fc2e414de8be439622f73a00f76d762bbf3 | none | 21 | Full 51-command suite passed on immutable 58a1b3b2caaaa0ece5414d4c027d97c388ab1b1c; separate-context source review PASS; shared command proof in S-00U/VERIFICATION.md. | Owning Spec and named runtime/control/Wiki/reconciliation documentation updated; see S-00U/VERIFICATION.md and per-Spec evidence. | S-00R core lifecycle prose still waits for S-00P; per-item optional removal remains owner-gated. No optional files removed. | d5c3568f4716dddd469bd20491171205bc3453ef48cb2691fd7283eff2e9d1fc |
