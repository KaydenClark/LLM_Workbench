# TK-00JD - Rerun glossary promotion through the promote tool

**Task ID:** TK-00JD
**Spec ID:** S-004J
**Slice:** Rerun glossary promotion through the promote tool
**Status:** blocked
**Stance:** Builder
**Blockers:** S-004O:delivered
**Destination:** spec-acceptance: A pending term and its correction remain in the notepad; confirmation records settled meaning and promotion reaches the canonical glossary only at the authorized boundary. No inline Canon or glossary write occurs.
**Planned verification:** On integration with Lexicon Retirement And ARCHITECTURE.md (S-004O) delivered, rebuild scenario 3's glossary variant (B) room with `proof/scenario-room.mjs` and rerun it with `proof/run-scenario.mjs`; the confirmed meaning reaches `GLOSSARY.md` through `sessions.mjs promote` with no manual write, the notepad keeps the pending term and its correction, and nothing tracked changes before the owner authorizes promotion. Record the curated run in `proof/scenarios/s3-capture-promotion/`, then the full RUNBOOK suite on a committed candidate.

## Scope and authority

The PR #425 review (Spec evidence verdict #3, 2026-10-08) found acceptance line 5 checked although both glossary-variant runs wrote `GLOSSARY.md` by hand after `sessions.mjs promote` refused the destination. The line was reopened with its wording unchanged. The fresh-context review of candidate `26b2532c` then found that no S-004J Task owned the rerun, so `next` and `claim` would never surface it. This Task owns it.

S-004O owns the glossary destination for `promote`; at 2026-10-08 it exists only on S-004O's assembly branch `claude/s004o-lexicon-retirement` (draft PR #431). This Task changes no tool. If the skill's promotion wording turns out to need a change, that is a red-green change to `workbench/skills/domain-modeling/SKILL.md` and `tools/test-domain-modeling-skill.mjs` inside this Task.

## Done criteria

The glossary variant promotes through the tool in a fresh-context run, its observations and curated record are committed, acceptance line 5 is checked against that run, the scenario evidence and the Domain Modeling Wiki article say so, and the full suite passes on a committed candidate.
