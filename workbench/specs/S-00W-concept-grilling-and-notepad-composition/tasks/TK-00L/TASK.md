# TK-00L - Settle one design decision before the next question

**Task ID:** TK-00L
**Spec ID:** S-00W
**Slice:** Settle one design decision before the next question
**Status:** ready
**Blockers:** none
**Destination:** spec-acceptance: S-00W Acceptance Criteria lines 1-4
**Stance:** Builder
**Planned verification:** Red: a fresh-context grilling scenario advances from a pending or corrected answer, treats a recommendation as accepted, or declares an empty ready frontier complete; green: the question, owner answer, pending/corrected readback, explicit confirmation, affected dependency update and next question occur in order, and a final concept readback stays gated on owner confirmation. Run targeted catalog and scenario checks, then the required suite; report human interpretation limits.

## Delivery

Make the repository-owned grilling source a standalone inquiry and synthesis skill. Ask one consequential ready question with recommended answer, why and impact; distinguish a provisional owner answer from a confirmed decision. Wait on the current decision while the owner corrects the Question / Answer / Why / Impact readback. Maintain a changing dependency map and ready frontier, prune irrelevant branches, reopen a settled answer only for a named reason, and synthesize the concept at meaningful boundaries. Remove notepad runtime mechanics from this primitive while preserving optional evidence lookup and the caller's authority limits.

## Done Criteria

- The owner can correct the readback before locking; no next substantive question is asked while it is pending.
- A confirmed answer changes only affected dependencies; unsupported readiness and missing facts remain visible.
- The bounded final concept readback is confirmed before transition.
- A fresh grilling scenario runs without a notepad runtime or new storage requirement.

## Preservation And Rollback

Preserve existing notepad data and optional project-evidence behavior. Revert only this skill source and its targeted verification changes if the scenario regresses; do not rewrite historical question entries.
