# TK-0Q1 - Close allocator and discard safety gaps before migration

**Task ID:** TK-0Q1
**Spec ID:** S-00Q
**Slice:** Close allocator and discard safety gaps before migration
**Status:** blocked
**Blockers:** S-00T; runtime repair is delivered there once, independent of legacy retirement approval
**Destination:** spec-acceptance: S-00Q Acceptance Criteria line 3
**Stance:** Builder
**Planned verification:** Red: fixtures reproduce next-id proposing retired S-00H, the post-discard Wiki dangling reference, duplicate orphan corrective Tasks, last-retired-Task fallback to table state, and first-add recovery identity after remove/re-add; green: allocation considers every lifecycle/corrective/remote-tracking-visible ID and each discard case is idempotent, record-backed, last-add recoverable and diagnostic-clean after the documented operation.

## Delivery

Implementation is delegated once to [S-00T](../../../S-00T-lifecycle-discard-repair/SPEC.md); consume its reviewed evidence rather than repeating the repair.

Repair only the existing allocation, discard and corrective-Task seams. Do not
design a parallel lifecycle or relax any S-00I gate. Decide and test how frozen
historical attribution is represented without remaining a current path
reference. Include the two smaller implementation risks in the review:
frontmatter-bounded provenance append and checked render/staging failure.

## Preservation And Rollback

Use disposable repositories for every destructive case. Capture the existing
behavior as red proof, preserve `archive` as unreachable by discard, and retain
the original retired directory until recovery is exercised. Roll back the code
candidate as one Task commit if any gate weakens.

## Done Criteria

- The allocator cannot reuse S-00H or any other visible ID.
- A successful discard finishes without an expected blocking residue.
- Corrective creation is idempotent and record-backed state cannot flip.
- Recovery selects the correct immutable path identity after remove/re-add.
