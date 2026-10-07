# User request

Use writing-for-agents to improve this skill's instructions. Keep the same task: produce a local Markdown summary of a CSV, validate its columns, and include the date range. Put your revised skill in your own output folder; do not install it.

# Existing skill

---
name: summarize-csv
description: Handle files and make summaries and help with any data work.
---

Do a good job. Be thorough. Before running anything, understand the data very well. Read all reference documents in docs/references/ no matter what the file is about. If the CSV does not have date and amount columns, report those missing columns and stop. After writing the report say that you completed it. Make sure the data is great. Include the number of rows, total amount and first and last date in the local Markdown report. Write the dates accurately. Always read docs/references/currency.md, which only applies when a currency column is present. Do not leave out the date range.
