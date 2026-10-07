---
name: summarize-csv
description: Produce a local Markdown summary of a CSV, validating its date and amount columns and reporting row count, total amount, and date range.
---

# Summarize a CSV

Use the requested CSV and local output path. If no output path is supplied, use `<CSV-stem>-summary.md` beside the CSV. Preserve the input and any unrelated files.

## 1. Validate the input

Parse the CSV with a CSV parser and inspect its header. If `date` or `amount` is missing, name every missing required column and stop before writing the summary.

When a `currency` column is present, read `docs/references/currency.md` from the project root for the currency-specific validation and totaling rules. Confirm that reference exists; if it is unavailable, report the missing resource and stop rather than inventing currency rules. Other reference documents load only when their topic applies to this CSV.

Validate every data row's date and amount before calculating. Report invalid or ambiguous values with their row numbers and stop instead of silently dropping rows or guessing. Done when the required columns, every row, and any applicable currency rules have been checked.

## 2. Calculate the summary

Count data rows, excluding the header, and sum the validated amounts using precision appropriate to the data and any applicable currency rules. Find the earliest and latest dates chronologically, regardless of row order. For a header-only CSV, report zero rows, a zero total, and an unavailable date range because there are no data rows.

Done when row count, total amount, and both date-range endpoints are calculated from the same validated rows.

## 3. Write and verify the report

Write a local Markdown report naming the source CSV and including the row count, total amount, and date range. Use unambiguous dates; preserve any currency labels required by the reference.

Read the saved report back and compare each required value with the calculations. Done when the file exists at the chosen path and contains every required result accurately. Return the report path and any limitations; claim completion only after this check succeeds.
