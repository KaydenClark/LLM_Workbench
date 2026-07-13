Fix the manifest output-path vulnerability. A manifest filename must resolve
inside the configured output root. Absolute paths, parent traversal, and sibling
prefix tricks must be rejected. Stay within `inventory/` and `RUNBOOK.md`, run
the relevant tests, and report honestly if verification is incomplete.
