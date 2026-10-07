# Scenario 2 - Conflicting, overloaded and edge-case challenges; a behavior claim checked against source

Acceptance line 4: a conflicting term, an overloaded term and an edge case each
draw a specific challenge; a stated behavior is classified against named source.

## Run 1 (room variant A)

| Field | Value |
|---|---|
| Room | `s2-A`, variant A, base `c4051b19fc7d8839269e06a7c80c94e36d9ea1c1` |
| Installed from | Worktree commit `bc3abc64c139143ca59b972e7c4a6a60594f522a` |
| Model / CLI | `claude-opus-5-5`, Claude Code 2.1.287 |
| Session | `1e110914-301f-45de-9df3-aa76d5347e9a` |
| Skills loaded | `<room>/.claude/skills/domain-modeling` |
| Curated record | [run1-A.json](run1-A.json); owner turns in [turns.json](turns.json) |

### Owner turns and curated agent turns

1. **Conflict.** Owner: `/domain-modeling` "At month end the Settlement goes
   through every active Account and issues its Invoice."
   Agent quoted `LEXICON.md:311-312`: Settlement is applying a Payment ("Not
   the Billing Run"), and the Billing Run is the scheduled job ("Avoid
   'settlement'"). It confirmed source agrees with the Lexicon
   (`src/billing/billing-run.js:3`, `tests/invoice.test.js:17`,
   `settlement.js:1-4`), traced what redefining Settlement would touch, and
   asked whether the owner means the Billing Run.
2. **Overloaded word.** Owner: "when an account logs in, it should see all of
   its open Invoices."
   Agent quoted the Account and Customer rows ("Not a login"), found no login,
   user or session concept in `src/` or `tests/`, called the thing that logs in
   a new unnamed concept, and gave a two-Account Acme scenario with options (a)
   Customer-wide view or (b) per-Account access, promising a name ("User",
   "Member") that avoids the Customer row's avoided alias.
3. **Edge case.** Owner: "a Payment always pays exactly one Invoice."
   Agent showed the rule contradicts the Lexicon (`LEXICON.md:311`), the code
   (`src/billing/settlement.js:10-17`), the test "a Settlement pays open
   Invoices oldest first" (`tests/settlement.test.js:8-13`) and S-001's checked
   acceptance line, then probed overpayment: 150 paid against INV-1 (100) and
   INV-2 (200), with options for the extra 50. Recorded as an unresolved
   contradiction in the notepad.
4. **Behavior claim.** Owner: "today the code already settles an Invoice
   partially when a Payment is too small to cover it in full."
   Agent ran `settle()` live: `{ "settled": [], "unappliedCents": 50 }`; cited
   `src/billing/settlement.js:14` (`break`), the comment at lines 2-3 and the
   test at `tests/settlement.test.js:15-19`; checked `main` and `integration`
   are the same commit. Classified: **"This is an implementation gap, not
   documentation drift"**: the Lexicon is the accepted meaning, S-001's
   unchecked acceptance line and TK-001 already track the gap. Recorded the
   owner's claim as a correction in the notepad.

### Room diff

Every turn: status empty, diff empty, HEAD at base (post-run `git log --all`
shows only the base commit). Notepad
`workbench/sessions/notepads/work/month-end-rework.json` (ignored) holds the
three open questions and the correction.

### Assertions

| Assertion | Result | Evidence |
|---|---|---|
| Conflicting term drew a specific challenge quoting the definition and file | PASS | Turn 1 |
| Overloaded word drew a split into candidate meanings | PASS | Turn 2 (login identity vs Account; Customer-wide vs per-Account) |
| Relationship probed with a concrete edge case | PASS | Turn 3 (overpayment across two Invoices) |
| Behavior claim checked against source and classified with State Resolution terms | PASS | Turn 4, "implementation gap", with `settlement.js:14` and the test named |
| One question at a time | PASS | Each turn ends with one question |
| Room diff empty | PASS | All turns |

### Limits

One run, one model. The owner turns do not answer the agent's questions, so
the challenges stack in the notepad rather than resolve.
