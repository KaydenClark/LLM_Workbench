# Required Integration Branch: assembled Review

Date: 2026-10-10 UTC. Reviewer: fresh Codex context
`/root/integration_final_spec_review`, inherited session model, review-only.
This context performed no implementation, correction or durable state writes.
The single durable writer records its actual returned result here.

- Result: PASS, no findings within the Required Integration Branch Spec (S-005I).
- Base: `bcb8cfa0a685b67d151e5102d3f2cc855a13613b`.
- Candidate: `74bda06e3589a2e3a72d25dd9e2e75fd65457715`.
- Expected integration tip: `3a3fa8176b1cae055653a389bee6bd418aa0f9da`.
- Digest: `6c52a16882a0539771dde14285411af7fa199d38bb08329239242ed3d65c8ca5`.

The earlier failed findings are resolved: Genesis and Adoption Wiki guidance
requires distinct, remotely published integration staging; the historical
default-detection limitation is qualified; the Spec baseline names its exact
tree. Current Spec and Taskboard headers reflect delivered corrections.

Source/caller inspection and the focused regression establish that adoption
creates missing integration from the resolved default, preserves HEAD and
existing refs, and refuses branch setup errors before layout migration.
Controls, protocols, skills and the ADR-0039 amendment agree on mandatory
staging and owner-only default-branch promotion. No Task continuation is needed.

## Verification and limits

The reviewer reran `tools/test-integration-setup.mjs`, governance checks
(12/12), Wiki validation, doctor and the comparison diff check. It independently
read successful canonical CI results for runtime `aae2f71a`, submission
`5f6dd2a1` (attempt 2) and corrective submission `7020cadd`. The workflow runs
`tools/verify.mjs`, which executes the canonical Runbook list. It did not repeat
the full suite. [Verification record](verification.md) preserves the local
57-command runs and their exact candidates.

PR 456 independently reports MERGED at `3a3fa817` on integration. Local
ancestry confirms integration contains both submitted heads. Candidate HEAD
and the clean working tree were read back before the review result.

Wiki coverage screened all 150 Markdown pages for branch-policy terms and
read affected setup, branch, readiness, installation and workflow owners.
This does not establish exhaustive whole-Wiki semantic cleanliness. Existing
unrelated drift includes Task-review wording in `workbench/wiki/skill-code-review.md`
line 41 at this candidate; it conflicts with the current control's prohibition
on separate-context Task Review and is outside this capability correction.

Doctor retains the same 24 findings: 12 blocked slices, six stale claims, five
stale seeds and one provenance finding. The recorded notepad timing failure
remains unresolved. No consumer upgrade, installed-agent reliability, clean-room
or owner-approval claim follows. Owner approval and main verification stay open.

Sources: [Spec](SPEC.md), [Task](tasks/TK-008Q/TASK.md),
[verification](verification.md), [branch capability Wiki](../../wiki/features/declared-integration-and-recoverable-completion.md),
[review contract](../../skills/code-review/SKILL.md).
