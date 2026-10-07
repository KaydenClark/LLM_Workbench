---
name: summarize-csv
description: Summarize a CSV in local Markdown with validated date and amount columns, row count, total amount, and date range.
---

## Steps

1. Read the requested CSV and check its header for `date` and `amount`. If either column is missing, name every missing column and stop before writing a summary.
2. Validate every row: `date` must be interpretable as a date and `amount` as a finite number. Report invalid rows and values; proceed only when all rows validate. If a `currency` column is present, read `docs/references/currency.md` and apply its rules before calculating totals. If that reference is unavailable, report the missing reference and stop.
3. Calculate the data row count, total amount, and earliest and latest dates across all rows. For an empty CSV with valid headers, use zero rows, zero total, and “No dates” for the range. Where dates are ambiguous, resolve their format from the supplied context or ask before calculating the range.
4. Write the local Markdown report at the requested output path. Include the CSV identity, row count, total amount, and date range. Apply any currency-specific reporting rules loaded in step 2.
5. Read the saved report and check each required value against the calculated results. Completion means the file exists and all required values match; return its path.
