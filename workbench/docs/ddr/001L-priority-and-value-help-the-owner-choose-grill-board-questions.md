---
date: 2026-10-07
supersedes:
canonicalized_in:
  - BLUEPRINT.md
  - LEXICON.md
  - workbench/specs/S-004D-shared-interactive-board/SPEC.md
---

# DDR-001L — Priority and Value help the Owner choose Grill Board questions

## Decision

The Grill Board helps the Owner evaluate its questions and filter them into an
answering queue of the Owner's choosing using the separate Priority and Value
classifications adopted from the Command Information Center (CIC).

Priority guides attention to the question. Value classifies the capability or
change it governs by return versus investment, using the unchanged
[P1–P4 / V1–V4 meanings](../../../LEXICON.md#priority-and-value).
They never become a summed score. P1 remains visible regardless of Value;
quick wins must not continually crowd out strategic work. Explicit filters
select the Owner's desired slice, such as P1 with V2, P3 with V1 or P2 alone
(PV-03), including slices without P1.

The Owner sees compact numbered red P and amber V badges on each question,
opens their grading rationale on click, and can open the question's complete
information centrally. Independent filters support P alone, V alone or their
intersection. Agents assign reasoned grades and reconsider them when updating
question cards from Owner answers; the Owner can direct corrections.
The first proof is confined to the Grill Board. DQCs are deferred.

## Why

The Owner needs to evaluate and filter more than 150 questions into a queue,
then self-prioritize by effort and impact. P/V already supplies the
recommendation; the desired addition is visible classifications and filters.
Grading details must be available without distracting from the question.

## Considered And Rejected

- A summed P+V score loses the distinct attention and return/investment meanings.
- An additional automatic recommended-batch feature was not selected: the
  Owner chooses the queue using P/V and the existing board controls.
- Always-expanded grading explanations distract from the question. Compact
  badges open a small explanation card; full question information is also
  available in the central view.
- Extending the first proof to DQCs was explicitly deferred to keep it focused.

## Consequences And Revisit Conditions

The Blueprint carries the promised outcome, the Lexicon owns shared meanings,
and [Shared Interactive Workbench Board — S-004D](../../specs/S-004D-shared-interactive-board/SPEC.md#priority-and-value-for-answering-questions)
owns requirements, acceptance and future delivery proof. Existing board
identity, answer ownership, revision history and approval boundaries remain,
as S-004D states in its [Priority and Value requirement 5](../../specs/S-004D-shared-interactive-board/SPEC.md#priority-and-value-for-answering-questions)
(question identity, revision history and saved answers preserved; agents never
write `answers.json`) and [Desired Behavior items 5 and 6](../../specs/S-004D-shared-interactive-board/SPEC.md#desired-behavior)
(approval evidence stays distinct, no gate bypass, identity preserved).
The only maintenance requested here is within the answer-to-card-update cycle.

The purpose confirmed in PV-02 is to prove on the Grill Board that P/V helps
the Owner choose which questions to answer. Revisit the application if the
board proof shows that it does not. Broader DQC use and CIC's possible
final-call authority remain separate future choices.

## Destination Level

Blueprint; this decision refines the Grill Board experience delivered under
S-004D. It does not assign a new landmark or activate a Task.

## Provenance

- CIC's separate-axis map: [CIC DDR-000G, Priority and Value guide attention on separate axes](https://github.com/KaydenClark/command-information-center/blob/af9296e31bb15f11aaf84fa04e01b7e6a7524eea/workbench/docs/ddr/proposed/000G-priority-and-value-guide-attention-on-separate-axes.md),
  exact source commit `af9296e31bb15f11aaf84fa04e01b7e6a7524eea`. Its content
  was Owner-confirmed at CT-D01D on 2026-10-06 while its folder lifecycle remained proposed.
- Owner authorized copying the map, then confirmed the Workbench application
  in this conversation on 2026-10-07: Value target (PV-01), board-only purpose
  and cadence (PV-02), visible/filterable classifications (PV-03), and badge
  explanations plus central detail (PV-04).
- The final Question / Answer / Why / Impact concept readback (PV-05) was
  explicitly confirmed with the direction to use `to-docs` and `to-spec`.

## Reconciliation Boundary

Decision content is Owner-confirmed (2026-10-07). This record was accepted in
its promotion from a clean tree cut from integration
`d9a353590644f957ae24636d13ce9a41ef1987e9`. P/V remains a planned board
capability until its implementation and usefulness proof are recorded in S-004D.
