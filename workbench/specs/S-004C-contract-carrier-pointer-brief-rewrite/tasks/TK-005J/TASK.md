# TK-005J - Move the operations every room runs behind their pointers

**Task ID:** TK-005J
**Spec ID:** S-004C
**Slice:** Move the operations every room runs behind their pointers
**Status:** done
**Stance:** Builder
**Blockers:** TK-005I
**Destination:** spec-acceptance: An inventory maps every line of `AGENTS.md` and `RUNBOOK.md` to a home, and a check shows every removed line landed (room-operations family), and `RUNBOOK.md` is an operations index in which each operation's procedure is reachable in a skill.
**Planned verification:** Red: the landing check over the family's sections fails for each unplaced line when the bodies are dropped, and the index has no pointer from "write or accept a decision record", "validate the Wiki", "read the diagnostics", "allocate a visible identifier", "record a landmark", "recover after a failure" or "check a host capability" to a skill that carries the procedure. Green: every line is classified, the check passes at the candidate, each operation's procedure lives in the skill the census chooses (an existing skill where its job matches, a new skill per operation family otherwise, never one per section), the retained headings keep every inbound anchor, the generic `templates/RUNBOOK.md` carries the same index and pointers (this family is the one every generated room receives), and the tests and evals that read these sections pass. The targeted tests the census names (adr, wiki, visible ids, diagnostics, landmark tracker and wiki, configured host, sessions) and the full AGENTS suite pass on the committed candidate; touched Wiki pages lint clean.
**Proof:** Full suite 50/50 at 44368515 (SUITE_SOURCE=RUNBOOK.md, dirty []); red e1231319, green test-runbook-index 41/41, control-fidelity 37/37, governance-core 12/12, workbench-layout 73/73, skill-catalog and reader tests green; landing check ok vs pin d7ffffe9 (AGENTS 283/283, RUNBOOK 1020/1020) and merge-base c89a7ad5 (0, 414/414); guardrails 106.6/113 and 78/100 held; wiki validate ok; AGENTS.md 26,238 B unchanged, RUNBOOK.md 127,808 -> 101,224 B, templates/RUNBOOK.md 53,428 -> 38,104 B, AGENTS+index 39,358 -> 39,666 B

## Outcome

The operations a generated room runs itself move behind the index: the
decision-record commands (the section Decision Record Tooling finished in its
last Task, now stable), Visible Identifiers, the Landmark Tracker, Wiki
Validation, Installed State The Harness Wrote, Diagnostics And Blocking
Effects, the Socket Contract Registry, Troubleshooting, Recovery And Rollback,
Workbench connection identity, and the configured-host capability checks. These
are the sections the generic `templates/RUNBOOK.md` also carries, so this family
is the one that changes what a fresh room receives.

## Scope

- The Runbook sections above as the baseline census confirms them, and their
  `templates/RUNBOOK.md` counterparts.
- Home skills and the constraint on adding them: a new core skill changes the
  closed core bundle (its catalog, install receipt, Template and update-route
  effects) and is added only for an operation with no fitting skill, one skill
  per operation family.
- Index rows, inventory entries, readers and Wiki pages as the Spec's family
  method states.

## Acceptance

- [ ] Every line of the family's sections is classified and the landing check
      passes at the candidate.
- [ ] Each moved procedure is reachable from an index row through a skill that
      carries its binding requirements.
- [ ] The core skill catalog, its count statement and the install receipt agree
      with any added core skill.
- [ ] Every inbound anchor for these headings resolves; root and template agree.

## Boundaries

Relocation only: no command, flag or finding changes behavior or meaning. The
decision-record, diagnostics and identifier runtime tools are not edited. This
family waits for the continuity, lifecycle, Git and verification families so
the shared index table and the single `RUNBOOK.md` writer stay serial.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004c-tk005j-room-operations-family | 4436851559792ebfc8db5634f760f54d013183b9 | ahead 0 behind 0 | 0 | Full suite 50/50 at 44368515 (SUITE_SOURCE=RUNBOOK.md, dirty []); red e1231319 (test-runbook-index 4/41 failed, test-skill-catalog failed on workbench-runtime not declared, test-governance-core 2/12 failed); green: test-runbook-index 41/41, test-skill-catalog, test-governance-core 12/12, test-control-fidelity 37/37, test-workbench-layout 73/73, test-skills-lane 4/4, test-core-skill-installer 31/31, test-workbench-upgrade 5/5, test-adr 56/56, test-wiki 14/14, test-visible-ids 9/9, test-visible-id-consumers 31/31, test-diagnostics 36/36, test-landmark-wiki 18/18, test-configured-host 10/10, test-sessions 8/8, round trip root and template; landing check ok vs pin d7ffffe9 (AGENTS 283/283, RUNBOOK 1020/1020) and merge-base c89a7ad5 (AGENTS 0 removed, RUNBOOK 414/414); guardrails 106.6/113 and 78/100 held; wiki validate ok; AGENTS.md 26,238 -> 26,238 B, RUNBOOK.md 127,808 -> 101,224 B, templates/RUNBOOK.md 53,428 -> 38,104 B, AGENTS+index 39,358 -> 39,666 B | RUNBOOK.md and templates/RUNBOOK.md: 10 root and 12 template index rows re-pointed or added (decision records, diagnostics, Wiki validation, installed state, identifiers, Landmark Tracker, recovery, connection identity, configured host, room-local skills), sections reduced to sentence plus pointer with headings kept, Evidence claim-age and amendment-first paragraphs pointed, template lifecycle section keeps its command list; new core skill workbench/skills/workbench-runtime (bundle 26 -> 27: workbench-layout coreSkills, manifest required list, skills README catalog and count, README, RUNBOOK Skills lane count, LEXICON Core skill bundle count, templates/GENESIS, wiki skill-genesis); to-docs Decision records, notepad Landmark Tracker subsection, implement Recovery and rollback; Wiki skill-workbench-runtime (new, routed in MEMORY), skill-to-docs, skill-notepad, skill-implement, design-concepts landmark-tracker and spec-S-047, SCHEMA (root and template) installed-state route; inventory-runbook.json; tests test-runbook-index, test-skill-catalog, test-governance-core, test-workbench-layout | Socket Contract Registry left in place for TK-005K (maintainer-only tools/ commands); Portable Save core-catalog paragraphs (root and template) left for TK-005K; Troubleshooting tables and template Environment Configuration, Data Operations and Deployment Or Startup stay as room-owned sections; four stale Installed State lines retired with reason (doctor, not wiki validate, emits the installed-state findings); LEXICON.md bundle-count word changed outside the Lexicon Task; combined loaded-cost bound not met (39,666 vs 38,178 B); no fresh-context scenario run for workbench-runtime | 4ab7fc77e21476dd87148c932303041d10c1816a91c1a27050452930badcb3e7 |
| 2 | claude/s004c-tk005j-room-operations-family | c2609a1e91399c2ae2a97f38738b1c0f5509f411 | ahead 0 behind 0 | 0 | Full suite 50/50 at 44368515 (SUITE_SOURCE=RUNBOOK.md, dirty []); red e1231319, green test-runbook-index 41/41, control-fidelity 37/37, governance-core 12/12, workbench-layout 73/73, skill-catalog and reader tests green; landing check ok vs pin d7ffffe9 (AGENTS 283/283, RUNBOOK 1020/1020) and merge-base c89a7ad5 (0, 414/414); guardrails 106.6/113 and 78/100 held; wiki validate ok; AGENTS.md 26,238 B unchanged, RUNBOOK.md 127,808 -> 101,224 B, templates/RUNBOOK.md 53,428 -> 38,104 B, AGENTS+index 39,358 -> 39,666 B | Root and template RUNBOOK index rows and room-operations sections reduced to sentence plus pointer (headings kept); new core skill workbench-runtime with the 27-skill bundle change (layout catalog, manifest, skills README, README, RUNBOOK, LEXICON, templates/GENESIS, wiki skill-genesis); to-docs Decision records, notepad Landmark Tracker, implement Recovery and rollback; Wiki skill-workbench-runtime (new), skill-to-docs, skill-notepad, skill-implement, landmark-tracker, spec-S-047, SCHEMA root and template; inventory-runbook.json; tests test-runbook-index, test-skill-catalog, test-governance-core, test-workbench-layout | Socket Contract Registry and Portable Save core-catalog paragraphs left for TK-005K; Troubleshooting and template Environment Configuration, Data Operations, Deployment Or Startup stay room-owned; four stale Installed State lines retired with reason; LEXICON.md bundle count changed outside the Lexicon Task; combined loaded-cost bound not met (39,666 vs 38,178 B); no fresh-context scenario for workbench-runtime | 376bd9ddb0e7021cbef197588bbafdeb75545fc9ca0b9870ee84009b29727f17 |
