# TK-00JB - Prove domain-modeling behavior in fresh-context disposable rooms

**Task ID:** TK-00JB
**Spec ID:** S-004J
**Slice:** Prove domain-modeling behavior in fresh-context disposable rooms
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-00JA
**Destination:** spec-acceptance: In a grilling scenario, a proposed rename or boundary is traced to named owners, identifiers and tests before the owner chooses, and the room diff stays empty.
**Planned verification:** Scripted-owner fresh-context runs in disposable rooms installed from the assembled lane, asserting observed turns and room diffs for the trace, challenge, capture/promotion, decision-record and grilling-without-the-skill scenarios; a source correction, if any, re-runs the scoped test and full suite.
**Claimed by:** claude-s004j-worker-jb

## Scope and authority

Owner, 2026-10-06: "New Spec! You will be one of 3 running at the same time." with `/implement-spec` on this Spec.

Exercise the delivered skill in disposable rooms only, never this repository's live state, covering acceptance lines 3, 4, 5, 7 and 8: a rename or boundary traced to named owners before the choice with an empty room diff; conflicting, overloaded and edge-case challenges and a source-classified behavior claim; a pending term and its correction kept in the notepad with no inline Canon or glossary write; three non-qualifying choices declined and a qualifying one offered as ADR or DDR by the scope test; grilling completing without the skill and no parallel terminology store. Record transcripts, the model, run counts and limits as evidence. A defect found in the lane source is corrected here with its scoped test re-run.

## Done criteria

Each scenario has an observed transcript and room diff assertion under this Spec's proof path, with limits named; any correction is green on the scoped test and the full suite.
