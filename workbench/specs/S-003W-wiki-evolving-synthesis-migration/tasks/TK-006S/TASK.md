# TK-006S - Corrective: add name and context to bare identifiers on the other skill pages (whole-Wiki lint F-2, group B)

**Task ID:** TK-006S
**Spec ID:** S-003W
**Slice:** Corrective: add name and context to bare identifiers on the other skill pages (whole-Wiki lint F-2, group B)
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: A page with an identifier beside the artifact's name passes the identifier validator; a bare identifier is reported
**Planned verification:** landmark-wiki.mjs validate clean on the twenty pages; wiki.mjs validate; no claim changed; full suite

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s003w-tk-006s-identifiers-skill-pages | 396a86aea492cd52a879aa2faf5660a9704c2a20 | ahead 0 behind 0 | 0 | landmark-wiki validate on the 20 group B skill pages: 149 findings before, 0 after; wiki.mjs validate ok; test-wiki 25/25; test-landmark-wiki 76/76; full RUNBOOK suite 51/51 on clean committed candidate 396a86ae | workbench/wiki/skill-{adoption,auditor,builder,carry,checkpoint,code-review,dispatcher,genesis,grill-me,grilling,handoff,implement,make-it-so,promote,reconciler,reviewer,save,to-docs,workbench-runtime,worker-role}.md names added beside identifiers; no claim changed | none | 9e42cc2ac9c622a752d25b497ac86d421a4aa950681fa8c859e9c12f95b37ebe |
