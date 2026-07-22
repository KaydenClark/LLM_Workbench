---
name: diagnosing-bugs
description: Establish a tight reproduction, prove the root cause, and enter repair only when authorized.
---

# Diagnosing Bugs

Define the observed and expected behavior, then build the smallest reliable
reproduction. Make the loop go red, reduce it to the causal inputs, and test
each hypothesis with evidence. Distinguish the cause from symptoms and report
the broken assumption.

Diagnose by default. If repair is requested, add a regression test first and
make the least invasive change. Record the reproduction, root cause, and
verification in the owning spec when the defect is scoped there.
