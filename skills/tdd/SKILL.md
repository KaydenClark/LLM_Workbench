---
name: tdd
description: Drive one behavior at a public seam through a verified red-green-refactor loop.
---

# TDD

Identify the behavior and its stable public seam. Add the smallest focused test
that fails for the expected reason, run it, then implement only enough to make
it pass. Refactor while green and run the owning project's required checks.

Keep tests behavioral and deterministic. If a seam cannot be tested, explain
why and use the strongest repeatable alternative; record meaningful proof in
the assigned spec when this is delivery work.
