# Guardrail Audit: <producer-checkout>

Score: **73/100** (developing)

> 100 is the north star, not a regression-test pass mark. A green test suite can coexist with a low guardrail score.

| Area | Score | What is missing |
|---|---:|---|
| Static guardrail contract | 20/20 | none |
| Drift resistance | 20/25 | fresh taskboard proof |
| Benchmark discipline | 25/25 | none |
| Outcome evidence | 8/30 | real repeated outcome results; controls, prior version, and candidate compared; recent real outcome evidence; repeated trials with uncertainty |

## Recommended improvements

- **+8 Outcome evidence:** Run real repeated outcome trials and save the non-synthetic JSONL evidence. _Evidence: 0 non-synthetic outcome result file(s)_
- **+6 Outcome evidence:** Compare the candidate against both controls and the prior harness on the same tasks. _Evidence: Real results must include no-template, generic, prior/current, and candidate conditions._
- **+5 Drift resistance:** Run current verification and append a dated spec evidence row with the real result and remaining gap. _Evidence: The hot taskboard update and newest spec evidence row are no more than 30 days old._
- **+4 Outcome evidence:** Refresh the real outcome benchmark on the current candidate and record the tested ref and date. _Evidence: At least one non-synthetic outcome result is no more than 90 days old._
- **+4 Outcome evidence:** Score repeated trials, report the effect and confidence interval, and append the run to the ledger. _Evidence: The real-result ledger reports repeated trials and uncertainty, not a one-off win._

