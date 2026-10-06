# TK-005H - Move the Git, integration review and branch-completion operations behind their pointers

**Task ID:** TK-005H
**Spec ID:** S-004C
**Slice:** Move the Git, integration review and branch-completion operations behind their pointers
**Status:** done
**Stance:** Builder
**Blockers:** TK-005G
**Destination:** spec-acceptance: An inventory maps every line of `AGENTS.md` and `RUNBOOK.md` to a home, and a check shows every removed line landed (Git family), and a fresh agent can find and perform integration review and branch completion through its pointer without the removed prose.
**Planned verification:** Red: the landing check over the family's sections fails for each unplaced line when the bodies are dropped, and the index has no pointer from "open a PR", "get an immutable candidate reviewed", "merge and prove containment" or "clean up a branch" to a skill that carries the procedure. Green: every line is classified, the check passes at the candidate, `save`, `code-review`, `reviewer`, `implement` and `carry` (or a new skill the census justifies) carry the moved procedures with their binding requirements, the retained headings keep every inbound anchor (`AGENTS.md#git-rules` is the most linked heading in the repository), and the templates agree. `tools/test-branch-closeout.mjs`, `tools/test-delivery-skills.mjs`, `tools/test-skill-catalog.mjs`, `tools/test-spec-workbench.mjs`, the landing check and the full AGENTS suite pass on the committed candidate; touched Wiki pages lint clean.
**Proof:** Full AGENTS suite 50/50 at ce424a91; landing check passes at pin d7ffffe9 (AGENTS 190/190, RUNBOOK 617/617) and merge-base d65117a0 (22/22, 32/32); test-runbook-index, test-governance-core, test-control-fidelity, test-branch-closeout, test-delivery-skills, test-skill-catalog, test-spec-workbench green; guardrails 106.6/113 and 78/100 held; red d155f8b6.

## Outcome

The Git and branch-completion detail leaves `AGENTS.md` while the rules that
cannot be derived from the code stay as short lines: never commit directly to
`main` or `integration`, the default pull-request target, only the owner merges
`integration` into `main`, review of the immutable candidate by a separate
context before integration, never force-push shared history without approval,
never delete with `-D`. The mechanics (branch naming, the review and merge
sequence, proving containment, guarded remote deletion, the bootstrap exemption
reading) live in the skills the index points to, and the Runbook's
Version-Control Procedures and Independent Review Boundaries sections become
index rows with pointers.

## Scope

- `AGENTS.md` Git Rules and Branch Completion, and the Runbook's Version-Control
  Procedures and Independent Review Boundaries sections as the census confirms
  them.
- Home skills, index rows, inventory entries, template mirrors, readers and Wiki
  pages as the Spec's family method states.
- Takes an `AGENTS.md` writer turn.

## Acceptance

- [ ] Every line of the family's sections is classified and the landing check
      passes at the candidate.
- [ ] Each moved procedure is reachable from an index row through a skill that
      carries its binding requirements.
- [ ] `AGENTS.md` keeps only lines that apply in every session, with the
      owner-only `main` promotion and the separate-context review rule intact.
- [ ] Every inbound anchor for these headings resolves; root and template agree.

## Boundaries

Relocation only: no branch, review or merge rule changes meaning, and the
release owner's bootstrap exemption text is moved as written, not interpreted.
No change to the `gate`, `report` or branch-closeout commands.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004c-tk005h-git-family | ce424a91db3bbeb5e1990199aeedbeefd0070fbd | ahead 0 behind 0 | 0 | Red d155f8b6: test-runbook-index failed 5 (no 'Branch and open a pull request' row; AGENTS Git Rules lacked the implement pointer) and test-governance-core failed 1 (implement skill had no Branch completion section). Green at ce424a91: full AGENTS suite 50 pass 0 fail (suite-tk005h.log, candidate ce424a91 dirty []); test-runbook-index 28/28, test-governance-core 12/12, test-control-fidelity 37/37, test-branch-closeout 8/8 (Runbook recipe unchanged, still extracted in place), test-delivery-skills, test-skill-catalog, test-spec-workbench 59/59 pass. Landing check: pin d7ffffe9 AGENTS 190/190 and RUNBOOK 617/617 landed; merge-base d65117a0 (scratch inventories) AGENTS 22/22 and RUNBOOK 32/32 landed. Guardrails held: evaluate-workbench templates 106.6/113, audit-guardrails 78/100. Bytes: AGENTS.md 30637->30158, RUNBOOK.md 126745->125413, templates/AGENTS.md 25133->24618, templates/RUNBOOK.md 55293->53427. | AGENTS.md and templates/AGENTS.md Git Rules (route paragraph -> pointer; S-00O exemption 2 paragraph, branch/PR-target/manifest/force-push/version bullets, review gate and Human QA paragraphs stay) and Branch Completion (brief plus pointer); RUNBOOK.md and templates/RUNBOOK.md index rows (Branch and open a pull request; Merge, prove containment and clean up a branch; Review a candidate independently re-pointed), Version-Control Procedures (pointer; this room's commands and closeout recipe stay) and Independent Review Boundaries (stub); workbench/skills/implement/SKILL.md new Version-control procedures and Branch completion sections; workbench/skills/code-review/SKILL.md new Independent review boundaries section and re-pointed checklist reference; inventories classified; Wiki skill-implement, skill-code-review, finish-authorized-work updated, wiki validate ok. | The root closeout recipe, its variables paragraph and the disposable-review-clone paragraph stay in RUNBOOK.md as this room's commands (they name integration, S-00O and local paths, so a core skill cannot carry them); the Human QA paragraph and review-gate paragraph stay in AGENTS.md as always-true rules; templates/AGENTS.md Producer Template Upgrade Release Gate left for TK-005I. | 54dfc854516e9ecb583c87128a0465c64c4cb3ecdcd08954956bd5ac8ee80049 |
| 2 | claude/s004c-tk005h-git-family | 22331cc1d60d683c2222093b2fe26670bde9e135 | ahead 0 behind 0 | 0 | Full AGENTS suite 50/50 at ce424a91; landing check passes at pin d7ffffe9 (AGENTS 190/190, RUNBOOK 617/617) and merge-base d65117a0 (22/22, 32/32); test-runbook-index, test-governance-core, test-control-fidelity, test-branch-closeout, test-delivery-skills, test-skill-catalog, test-spec-workbench green; guardrails 106.6/113 and 78/100 held; red d155f8b6. | AGENTS.md and templates/AGENTS.md Git Rules and Branch Completion briefs with pointers; RUNBOOK.md and templates/RUNBOOK.md index rows, Version-Control Procedures pointer (room commands kept) and Independent Review Boundaries stub; implement skill Version-control procedures and Branch completion sections; code-review skill Independent review boundaries section; inventories; Wiki skill-implement, skill-code-review, finish-authorized-work. | Root closeout recipe, its variables paragraph and disposable-clone paragraph stay in RUNBOOK.md as this room's commands; AGENTS.md keeps the S-00O exemption 2 paragraph (stays), review-gate and Human QA paragraphs as always-true rules; template Producer Template Upgrade Release Gate left for TK-005I. | c896c8c83bde958e0d3a304ffdb840585efce228d51e54dfdc725a868d386732 |
