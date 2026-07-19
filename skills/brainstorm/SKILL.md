---
name: brainstorm
description: Explore an idea or problem space by running a grilling interview with a counter-argument lens — every recommendation comes with its strongest opposing case. Use when the user wants to think something through, weigh alternatives, or pressure-test an idea before committing.
---

Run a `/grilling` session (that skill owns the interview and the notepad). This
skill changes the interview's stance and stops short of canon.

Stance — for each question, before asking, also surface:

- the strongest **counter-argument** or steelman of the opposite choice;
- at least one credible **alternative** the user may not have considered;
- the **main risk** of your own recommended answer.

Then still give your recommendation and let me decide. Record decisions in the
notepad exactly as `grilling` specifies, noting rejected alternatives as a short
trailing `(considered: …)` on the relevant line so the reasoning survives.

This is exploratory. Do NOT promote anything to canonical docs or specs. If I end
with `/make-it-so`, promotion happens then; otherwise the notepad persists on its
own (see `/notepad`) and we simply stop. Report the notepad and a short synthesis
of the settled direction and the live tensions.
