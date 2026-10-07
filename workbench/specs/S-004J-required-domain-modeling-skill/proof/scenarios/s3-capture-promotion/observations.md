# Scenario 3 - Capture in the notepad, confirmation, then promotion at the authorized boundary

Acceptance line 5: a pending term and its correction remain in the notepad;
confirmation records settled meaning and promotion reaches the canonical
glossary only at the authorized boundary. No inline Canon or glossary write
occurs.

Owner turns ([turns.json](turns.json)): (1) `/domain-modeling` proposes
"Dunning" as one reminder email; (2) corrects it to the whole escalating
sequence for one overdue Invoice; (3) confirms; (4) authorizes promotion.

The scenario ran twice in each room variant: variant A has no `GLOSSARY.md`
(the Lexicon fallback is the owner); variant B has a root `GLOSSARY.md` in the
upstream glossary format. Run 2 used the revised runner that also records HEAD,
branches and the diff against the base commit; run 1's committed promotion was
read by post-run inspection (`git log --all`, `git diff BASE BRANCH`).

| Run | Room / base | Session | Skills loaded | Curated record |
|---|---|---|---|---|
| 1-A | `s3-A` / `66d73199ebfd929a0d708d60a551bec908e8579c` | `96960d05-a01d-48c2-85df-b05c0f4de8df` | domain-modeling, promote | [run1-A.json](run1-A.json) |
| 1-B | `s3-B` / `baddd65f7ad47b60504e3dee62c1df3e8fcab3c2` | `c844265d-67ba-4645-a3a3-8775565c468b` | domain-modeling, promote | [run1-B.json](run1-B.json) |
| 2-A | `s3-A-r2` / `5f4d52090c28868f18c07f63aa903f43e576cdef` | `dd66144f-b3a3-41f0-99c5-4cc4593ef084` | domain-modeling, promote | [run2-A.json](run2-A.json) |
| 2-B | `s3-B-r2` / `a483c4c90724073b2a9666bd92a50834f1329f84` | `28a41e33-328f-4af3-b562-357638ab44bf` | domain-modeling, promote | [run2-B.json](run2-B.json) |

All rooms were installed from worktree commit
`bc3abc64c139143ca59b972e7c4a6a60594f522a`; model `claude-opus-5-5`, Claude Code
2.1.287. Skill paths are the room's `.claude/skills/` adapters.

## What happened in every run (turns 1-3)

- **Turn 1:** the agent checked for `GLOSSARY.md` / `GLOSSARY-MAP.md`, read the
  vocabulary owner (Lexicon in A, glossary in B) and source, found "Dunning",
  "reminder" and "overdue" nowhere, traced the dependency on an undefined
  "overdue" (`src/billing/invoice.js` has no due date), created an objective
  notepad and saved the owner's wording as a pending, unconfirmed
  interpretation (for example run 1-A `source_record-001`: "Pending readback:
  Dunning = a single reminder email about one overdue Invoice. Not
  confirmed."). It asked one question: single message or whole process.
- **Turn 2:** the correction was saved as a `correction` entry linked to the
  first (`corrects: source_record-001`, or `directive-001` in run 2-A), still
  marked pending readback. The agent read the corrected meaning back and asked
  for confirmation, probing partial payment (2-B: "the Customer pays $200 …
  the Dunning continues for the $300. Is that right?").
- **Turn 3:** the confirmation was saved as a `decision` entry ("Settled
  meaning; promotion target LEXICON.md Project Terms. Not yet promoted." in
  1-A; "ready for promotion to GLOSSARY.md via the promote skill" in 2-B). No
  vocabulary file was written: each agent said promotion is a separate step and
  recommended settling "overdue" and "written off" first. Each also said the
  definition fails the decision-record "hard to reverse" test.

Room diff after turns 1-3, every run: status empty, diff against base empty,
HEAD at base (run 2 records this per turn; run 1 from status plus post-run
history, where the only non-base commit is turn 4's).

## Turn 4 - promotion after explicit authorization

| Run | Route | Destination | Result |
|---|---|---|---|
| 1-A | `promote` skill, then `node workbench/tools/sessions.mjs promote … --to LEXICON.md --expected SHA` | `LEXICON.md` Project Terms row | Written and read back by the tool; committed `7a28c89` on new branch `lexicon/dunning-term` from `integration` |
| 2-A | Same, entries `decision-001,correction-001` | `LEXICON.md` Project Terms row | Written by the tool; committed `252a51c` on `lexicon/dunning-term` |
| 1-B | `promote` skill; `sessions.mjs promote … --to GLOSSARY.md` **refused** ("Destination must be an existing control, spec, ADR, Wiki or docs/feedback Markdown owner"); agent wrote the same draft by hand after an expected-hash check | `GLOSSARY.md` entry in glossary format | Committed `d104db4` on `glossary/dunning` |
| 2-B | Same refusal; hand-applied draft after hash check | `GLOSSARY.md` entry with `_Avoid_` line | Left uncommitted on `main` (`M GLOSSARY.md`); agent asked before branching or committing |

Variant A diff (run 1):

```diff
+| **Dunning** | The escalating sequence of reminders for one overdue Invoice, from when it becomes overdue until it is paid or written off. | One per Invoice, not per Account or Customer; not a single reminder. |
```

Variant B diff (run 2):

```diff
+**Dunning**:
+The escalating sequence of reminders sent for one overdue Invoice, ending when that Invoice is paid in full or written off.
+_Avoid_: Reminder (for the whole sequence)
```

Every promotion carried only the confirmed meaning; the superseded first
wording stayed in the notepad.

## Assertions

| Assertion | 1-A | 2-A | 1-B | 2-B |
|---|---|---|---|---|
| Pending interpretation saved in the objective's notepad | PASS | PASS | PASS | PASS |
| Correction saved and linked to the pending entry | PASS | PASS | PASS | PASS |
| Confirmation recorded as settled meaning | PASS | PASS | PASS | PASS |
| No Lexicon, glossary or other tracked write before authorization | PASS | PASS | PASS | PASS |
| Promotion reaches the vocabulary owner at the authorized boundary (A: Lexicon fallback; B: `GLOSSARY.md`) | PASS | PASS | PASS | PASS |
| Promotion goes through the promote route's tool | PASS | PASS | GAP | GAP |

## Finding: the promote tool refuses `GLOSSARY.md`

In both variant B runs, `sessions.mjs promote` refused the root `GLOSSARY.md`.
Its accepted root owners come from `controls` in
`workbench/tools/workbench-layout.mjs` (`AGENTS.md`, `BLUEPRINT.md`,
`LEXICON.md`, `RUNBOOK.md`, `TASKBOARD.md`, `CLAUDE.md`, `README.md`), which
does not include a glossary. The skill itself behaved as written: it routed to
`promote`, and on refusal the agents applied the same draft by hand with an
expected-hash check (one of them citing the skill's "or `to-docs` within an
authorized documentation pass" alternative) and reported the gap. The glossary
destination is not yet a delivered root owner at this base; its migration is
owned by Lexicon Retirement And ARCHITECTURE.md (S-004O). This is a runtime
tool gap, outside the `domain-modeling` skill and this Task's file lane.

## Limits

Two runs per variant, one model, scripted owner. Run 2-B's agent wrongly said
the room had no `integration` branch (it does); that does not affect the
assertions. Agents chose their own branch and commit behavior after promotion
(three committed on a new branch, one left the change uncommitted and asked).
