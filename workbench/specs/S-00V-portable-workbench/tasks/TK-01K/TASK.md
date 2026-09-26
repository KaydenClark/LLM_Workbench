# TK-01K - Notes and handoffs may be committed temporarily, with the ADR-0051 narrowing and the promote-before-end exit rule

**Task ID:** TK-01K
**Spec ID:** S-00V
**Slice:** Notes and handoffs may be committed temporarily, with the ADR-0051 narrowing and the promote-before-end exit rule
**Status:** blocked
**Blockers:** S-00P, TK-00J
**Destination:** spec-acceptance: S-00V box 3 (a session's notepad and handoff can be committed and later removed without a privacy or provenance check treating them as durable evidence)
**Stance:** Builder
**Planned verification:** Red: a test asserting `workbench/sessions/.gitignore` permits committing a notepad and handoff while the committed copies stay non-evidence (reusing the earlier Task's checks), and a control-fidelity assertion for the promote-before-end rule; green after the ignore lift, the ADR narrowing ADR-0051 (and ADR-0040 where it applies), and the control wording; `adr validate`; full AGENTS suite; separate-context review.

## Delivery

Desired Behavior 3 and grilling decisions 006 and 011. Lift the ignore rule so a
session may commit its notepad or handoff temporarily when continuation needs
it, then promote and remove it. Record the narrowing of ADR-0051's "live records
stay ignored" in a new ADR. Add the promote-before-end exit rule and lift the
untracked-notes sentence in `AGENTS.md` Session Records And Checkpoints, update
the Lexicon Packet row, and mirror into `templates/`.

**Collision hold.** `S-00P` in Blockers stands for the narrower real condition: S-00P TK-002 (the `AGENTS.md` rewrite, with the LEXICON and templates rewrites S-00P TK-004 and TK-005 for those files) is contained in `origin/integration`. The record vocabulary accepts only `S-`/`TK-` ids and a cross-Spec numeric Task id cannot be named, so the Spec id holds conservatively. When `git merge-base --is-ancestor` proves the S-00P commits in integration, the S-00V dispatcher removes `S-00P` from Blockers in its own commit with an evidence row citing the containing commit. Until then do not edit `AGENTS.md`, `RUNBOOK.md`, `LEXICON.md`, `BLUEPRINT.md` or `templates/` controls for this Task.

The notepad, handoff, save and promote skills carry the exit wording; their
rebuild Specs (S-00Y, S-01A, S-01O, S-01B) are live. Land skill wording only
where the owning rebuild is not in flight; otherwise record the needed wording
in S-00V's gap and report it to the Director.

## Done Criteria

- A committed note or handoff passes privacy checks, is refused as evidence,
  and can be removed cleanly.
- The ADR, `AGENTS.md`, Lexicon and templates agree on the rule.
