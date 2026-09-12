---
status: proposed
date: 2026-09-12
canonicalized_in:
  - LEXICON.md
  - RUNBOOK.md
---

# Every feedback finding carries one of four dispositions

A feedback finding resolves to exactly one disposition, recorded in the owning
Spec. The vocabulary is closed:

- **diagnostic** — a registered `doctor` code, with mandatory remediation text.
- **test** — a check added at a stable seam.
- **declined** — with a reason.
- **accepted-open** — real and accepted, not yet scheduled, naming the owning
  Spec that holds it.

`REPORT_FORMAT.md` requires the field. A suite test must fail when any
registered diagnostic lacks remediation text; that test does not exist yet
(`tools/test-diagnostics.mjs` currently asserts a non-empty summary for two
specific codes, not the full registry) and is part of this decision's
implementation, not already in place.

The fourth class exists because the first three cannot describe the most common
real state. Most findings currently in `workbench/feedback/` are accepted and
unscheduled; forcing those into `declined` would make the record assert
something false, and leaving them undispositioned would recreate exactly the gap
this rule closes. A vocabulary that cannot name the ordinary case gets bypassed
in the ordinary case.

Placement is not new. `LEXICON.md`'s Feedback row already states that "an
authorized repair and its disposition belong in the owning Spec". What is new is
that a disposition is required, drawn from a closed set, and that the report
format enforces its presence.

Verified read-only at `c0ac60a`: `workbench/feedback/REPORT_FORMAT.md`, mirrored
at `templates/feedback/REPORT_FORMAT.md`, requires each finding to carry an ID,
severity, location, claim, reproduced effect and "the smallest bounded next
action", and requires Next Action to point at an existing spec or state that a
repair awaits authorization — but nothing requires a finding to resolve into a
named class of outcome, so a finding can be recorded, acknowledged and left with
no disposition indefinitely.

Verified 2026-09-12: all 66 currently registered diagnostics already carry a
non-empty summary, so the accompanying suite test — not yet written — will
pass the day it lands. It is a ratchet against future additions, not a repair
of anything currently broken, and is recorded that way so nobody later
mistakes a green result for evidence that it fixed something.

Considered and rejected: three classes without `accepted-open`. See above.

Considered and rejected: dispositions kept only in the downstream upstream-fix
list, with the harness recording nothing per finding. That leaves the owning
Spec unable to state what became of a finding it is answerable for.

Consequences: `workbench/feedback/REPORT_FORMAT.md` and
`templates/feedback/REPORT_FORMAT.md` both change, and the `AGENTS.md` dogfood
boundary requires the template copy to stay generic and `[BRACKETED]` while the
root copy stays filled. None of that migration is performed by this decision.
No Spec owns it yet — a repo-wide search at review found none referencing this
ADR — so implementation has no delivery owner until one is authored and this
record's `canonicalized_in` is updated to name it.

Provenance: owner-approved answer RB-Q5, settled 2026-09-12, with the
`accepted-open` class added during that exchange. Recorded in the live grilling
note `workbench-foundation-rework-2026-09-11` — untracked working material named
as origin rather than durable evidence.

## Promotion status

This record is `proposed`. `LEXICON.md` and both `REPORT_FORMAT.md` copies
remain live as written, and no disposition field is required, until the owner
accepts it.
