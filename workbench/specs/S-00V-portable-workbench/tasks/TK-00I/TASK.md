# TK-00I - Project knowledge that lived only in host memory is in the Wiki and the Workbench runs without the memory directory

**Task ID:** TK-00I
**Spec ID:** S-00V
**Slice:** Project knowledge that lived only in host memory is in the Wiki and the Workbench runs without the memory directory
**Status:** ready
**Blockers:** none
**Destination:** spec-acceptance: S-00V box 6 (knowledge a cloud agent needs that lived only in host memory is in the Wiki, and the Workbench runs without the memory directory)
**Stance:** Reconciler
**Planned verification:** Audit inventory of the host memory directory with a disposition per file; new flat Wiki entries under `SCHEMA.md` rules routed from `workbench/wiki/MEMORY.md`; `tools/test-wiki.mjs` green; proof that the round-trip test and the suite run with the memory directory absent (scrubbed HOME) cited or added; full AGENTS suite; separate-context review.

## Delivery

Grilling decision-009 (PW-8, owner: "This is what the wiki is for"). Read,
never edit or delete, `~/.claude/projects/-Users-kayden-LLM-Workbench/memory/`
and the personal catalog's project-relevant knowledge. For each file decide:

- project knowledge a fresh cloud agent needs: promote into one flat Wiki entry
  per term or decision (frontmatter per `workbench/wiki/SCHEMA.md`), linked
  from the `MEMORY.md` router and back to its durable sources;
- already owned by a control, Spec or ADR: cite that owner, copy nothing;
- a rule that belongs in a root control: record the needed wording in S-00V's
  gap (S-00P is rewriting the controls) and route a Wiki entry to it;
- stale (superseded by landed work) or not project knowledge (personal matters,
  other projects, machine paths): exclude, with the reason, and copy nothing.

Never copy credentials, personal data about the owner, or content about other
projects. Host memory stays a per-machine convenience; nothing may depend on it.

## Done Criteria

- The inventory names every memory file at the audit commit and its
  disposition; the Wiki router reaches every promoted entry.
- A check proves the Workbench runs with no memory directory (the round trip
  already scrubs HOME: cite the exact assertion, or add one).
