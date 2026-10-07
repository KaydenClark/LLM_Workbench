# Scenario 4 - Decision records offered sparingly, ADR or DDR by the scope test

Acceptance line 7: an easily reversed, an unsurprising and a no-alternative
choice each fail the decision-record offer; a qualifying one is offered as ADR
or DDR by the scope test.

## Run 1 (room variant A)

| Field | Value |
|---|---|
| Room | `s4-A`, variant A, base `a1001106a0c13b070cc47f5367e2960718305270` |
| Installed from | Worktree commit `bc3abc64c139143ca59b972e7c4a6a60594f522a` |
| Model / CLI | `claude-opus-5-5`, Claude Code 2.1.287 |
| Session | `6e3cf8e4-0d33-43bf-b80a-c17f619ef778` |
| Skills loaded | `<room>/.claude/skills/domain-modeling` |
| Curated record | [run1-A.json](run1-A.json); owner turn in [turns.json](turns.json) |

### Owner turn

`/domain-modeling` with four settled choices, asking which, if any, should get a
decision record: (1) rename the test helper `invoice()` to `openInvoice()`
(easily reversed); (2) sequential Invoice ids like every invoicing system
(unsurprising); (3) integer cents because the required payment processor only
accepts integer cents (no real alternative); (4) issued Invoices are never
edited and corrections are Credit Notes, chosen over editable Invoices with an
audit log despite the support cost, because auditors need issued Invoices to
stay as sent (qualifying).

### Curated agent turn

The agent checked the declared `adr` and `ddr` collections and their registers
for an existing record, then answered with a three-test table:

| # | Hard to reverse | Surprising | Real trade-off | Record |
|---|---|---|---|---|
| 1 rename | no | no | no | No |
| 2 sequential ids | partly | no | no | No |
| 3 integer cents | yes | no | no | No |
| 4 Credit Notes only | yes | yes | yes | Yes, DDR |

- (1) "a one-line rename confined to the tests and easy to undo".
- (2) "a future reader won't wonder why, and you didn't weigh an alternative.
  It fails tests 2 and 3", and the code already does it (`src/billing/invoice.js:8`).
- (3) "the payment processor forces it. With no real alternative there's no
  trade-off … It fails test 3"; suggested recording the constraint in the
  billing Spec or a Wiki page instead.
- (4) Scope test: "the rule would still hold if the architecture were rebuilt
  differently. It's a choice about what the product must do, so it belongs in
  the `ddr` collection." It traced the consequences (Lexicon Invoice row at
  `LEXICON.md:308` agrees; Credit Note is undefined; Settlement interaction is
  open) and stated: "I haven't written anything. A DDR you accept would be
  written through `to-docs` with `adr.mjs`." It ended with one question.

### Room diff

Status empty, diff empty, HEAD at base; post-run `git log --all` shows only the
base commit. No notepad was created in this one-turn run.

### Assertions

| Assertion | Result |
|---|---|
| Easily reversed choice declined, failing test named | PASS (1) |
| Unsurprising choice declined, failing test named | PASS (2) |
| No-real-alternative choice declined, failing test named | PASS (3) |
| Qualifying choice offered, all three tests stated | PASS (4) |
| ADR or DDR chosen by the scope test, with reasoning | PASS (DDR, "would still hold if the architecture were rebuilt differently") |
| No record written without authorization | PASS |

### Limits

One run, one model, one turn. The owner asked directly which choices deserve a
record, so this run shows the offer test applied on request, not an unprompted
offer; scenario 1 (turn 2) and scenario 3 (turn 3) show the agent raising or
declining the record on its own.
