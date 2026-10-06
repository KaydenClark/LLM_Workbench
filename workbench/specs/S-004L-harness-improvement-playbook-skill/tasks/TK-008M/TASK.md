# TK-008M - Point the Runbook's harness feedback and evaluation rows at the one skill

**Task ID:** TK-008M
**Spec ID:** S-004L
**Slice:** Point the Runbook's harness feedback and evaluation rows at the one skill
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-008L
**Destination:** spec-acceptance: The Runbook's harness feedback and evaluation rows point at the one skill, and the Wiki has one validated page for it.
**Planned verification:** Red: `tools/test-runbook-index.mjs` expects the root rows "Evaluate a harness change", "Take in harness feedback" and "Write a manual harness feedback report" and the template row "Evaluate a harness change" to point into `workbench/skills/improve-harness/SKILL.md`, their Runbook headings to point the same way, and the pointed sections to carry the loop's lines; it fails at the committed pre-change tree. Green: the rows, the Evaluation And Benchmarking and Harness Feedback Loop bodies, the template row and the `workbench-evaluation` Harness Feedback Loop section (now the maintainer harvest steps behind a pointer to the loop) make it pass; `test-skill-inspection`, `test-governance-core`, `test-control-fidelity`, `test-carrier-landing` and the full suite pass on the committed candidate.

## Outcome

The operations index sends "Evaluate a harness change", "Take in harness
feedback" and "Write a manual harness feedback report" to the one skill, in the root Runbook and, for the evaluation row,
in the template Runbook every room receives. The claims, design, commands,
automated gate and run-outcome rows stay on the `workbench-evaluation`
maintainer skill: they are the comparison tooling, which this Spec does not
change. The report format in the feedback lane keeps its home; the one
skill's result record is written with it.

## Scope

- `RUNBOOK.md`: the three index rows, the Evaluation And Benchmarking intro,
  the Harness Feedback Loop and Manual Harness Feedback Reports section bodies.
- `templates/RUNBOOK.md`: the "Evaluate a harness change" row and the
  Evaluation And Benchmarking intro.
- `workbench/skills/workbench-evaluation/SKILL.md`: the Harness Feedback Loop
  and Manual Harness Feedback Reports sections keep the maintainer-only steps
  and point at the loop.
- `tools/test-runbook-index.mjs`: the S-004L row family.

## Acceptance

- [ ] The three root rows and the template evaluation row resolve into the one
      skill and the skill binds for those operations through the index.
- [ ] Every inbound anchor for the touched headings still resolves; root and
      template agree.

## Boundaries

The Runbook and `AGENTS.md` are shared writers with the Contract carrier
rewrite: before editing, confirm no open candidate holds `RUNBOOK.md`; if one
does, wait and record it in the Spec. `AGENTS.md` is untouched (no binding line
names the family). No command, finding or format changes meaning.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004l-tk008m-runbook-rows | d081e10a46699cfca445c9a65ae03a1435fea031 | ahead 0 behind 0 | 0 | Red 5ef903b5 (test-runbook-index 6 expected failures); green e506de5d: test-runbook-index 58/58, test-skill-inspection 9/9, test-governance-core 12/12, test-control-fidelity 38/38, test-carrier-landing 17/17, test-skill-catalog 3/3; carrier line-landing on RUNBOOK.md: 6 removed, 6 landed; after merging origin/integration 237d65a3 and the maintainer-skills Wiki line, full suite 52/52 ok on committed d081e10a (log scratchpad/s004l/suite-tk008m-d081e10a.log); wiki validate ok; guardrails 73/100 before and after; self-drift 12 findings pre/post, same set | RUNBOOK.md (three index rows, Evaluation And Benchmarking intro, Harness Feedback Loop and Manual Harness Feedback Reports bodies), templates/RUNBOOK.md (evaluation row and intro), workbench-evaluation SKILL.md (two sections point at the loop), workbench/wiki/maintainer-skills.md (workbench-evaluation keeps harvest steps around the loop) | The template's Return harness feedback and Write a manual harness feedback report rows keep their own sections (out of this Task's scope; routed at Spec QA) | 9ea2b0146405b854a707ba74975f6902997dc6155101a0e322b5e07d4ec104c9 |
