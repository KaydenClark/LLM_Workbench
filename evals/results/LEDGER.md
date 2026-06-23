# Evaluation ledger — improvement over time

One row per real comparison run. This is the scoreboard that answers "are the
rewrites actually progress?" — a line that either goes up or doesn't. Append
only; never edit a past row. Synthetic self-test data (`_*.jsonl`) never appears
here.

How to add a row: run `evals/run.py` for each condition, then
`evals/score.py … --baseline c0_none`, and copy the composite lift for our
versions out of the report.

| Date | Template ref | Model | Suite | Trials/cond | Composite vs `c0_none` | 95% CI excludes 0? | Report |
|---|---|---|---|---|---|---|---|
| _(none yet — run the harness to add the first real row)_ | | | | | | | |

## Reading the trend

- **Claim 1 (better than nothing):** the `ours_*` composite lift vs `c0_none` is
  positive and its CI excludes 0.
- **Claim 2 (better than alternatives):** re-baseline with `--baseline c1_generic`;
  `ours_*` should still lead.
- **Claim 3 (improving over time):** re-baseline with `--baseline c2_ours_main`;
  a newer version earns its existence only if it beats the prior one on the
  **held-out** suite, not just the dev suite it was tuned against.
