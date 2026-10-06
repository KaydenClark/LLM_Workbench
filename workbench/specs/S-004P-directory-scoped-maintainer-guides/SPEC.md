# S-004P - Directory-Scoped Maintainer Guides

**Spec ID:** S-004P
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-05
**Catalog description:** Add directory-scoped guides to this repository's maintainer directories that carry only each directory's invariants, owners and pointers to the declared maintainer skills, loaded by location and never shipped to a room.
**Blockers:** none for specification. The Instruction Authority line belongs to the Contract carrier rewrite's writer; implementation awaits Plan and assignment.
**Latest event:** Authored at the Map step from the owner's merged maintainer-home decision of 2026-10-05; no Task is cut.
**Next gate:** At Plan, establish which guide files each host loads by location, census the directory invariants now in the root brief, and cut small Tasks.

## Outcome

Each maintainer directory of this repository that has invariants worth stating, such as `templates/`, `tools/`, `workbench/skills/` and `workbench/docs/`, carries a directory-scoped guide an agent receives only when working there. The guide says what is always true of that directory, who owns each kind of file in it, and which maintainer-skill row carries any procedure. It never carries a procedure, never restates or binds a skill, and never ships to a generated room. Directory invariants that today sit in the root brief move there, and the root brief shrinks.

## Why It Matters

The owner merged the two maintainer-home concepts on 2026-10-05: the declared maintainer skills stay the home of procedures, and the nested guide's non-conflicting part, invariants disclosed by location, is added ([the merged decision](../../docs/ddr/001K-maintainer-procedures-live-in-declared-maintainer-skills-and-directory-scoped-guides-carry-only-a-directory-s-invariants-and-pointers.md)). The root brief pays for every line on every turn; a rule about `templates/` is paid for by an agent that never touches `templates/`. Lopopolo's corpus nests editor-only rules the same way, linked from the [lineage page](../../wiki/harness-engineering-lineage.md).

## Current Verified State

At integration `35187ee6` (2026-10-05): the manifest declares three maintainer skills, `workbench-release`, `workbench-room-checks` and `workbench-evaluation`, excluded from the core bundle and reached from Runbook index rows. The root `AGENTS.md` Edit Scope section carries the dogfood boundary for `templates/` and the Workbench update drift boundary as always-loaded lines. The only nested guides are `workbench/wiki/AGENTS.md` and its Template mirror `templates/wiki/AGENTS.md`, wiki-lane guides that ship to every room by design; no maintainer directory holds one, and the only host adapter is the root `CLAUDE.md`, pinned to `@AGENTS.md`. The wiki guide is the precedent for a guide disclosed by location; whether it is folded into the one shape this Spec defines or named a room-guide exception is decided at Plan. Which nested guide files Claude Code and Codex each load by location is not recorded in the repository. No implementation or agent-outcome proof for this capability is claimed by this Map record.

## Desired Behavior

1. A directory-scoped guide has one shape: the directory's invariants as short declarative lines, the owner of each kind of file in it, and a pointer per procedure to the maintainer-skill row in the operations index. A mechanical check refuses a guide line that is a step of a procedure or that names a skill as binding.
2. Each host loads the guide by location. The Plan establishes the file each host reads in a subdirectory and whether a nested host adapter is needed, and records it; the guide is written once and the adapter, if any, only imports it.
3. The root brief loses the lines a guide now carries, through the carrier rewrite's landing check, and no line leaves before its guide exists.
4. The maintainer guides are this repository's own: the closed core bundle, the Template, Genesis, adoption and the update route are unchanged, and a generated room receives none of them. The wiki-lane guide keeps shipping as it does today.
5. One line in the Instruction Authority list says a directory-scoped guide binds while working in that directory. That line is written by the carrier rewrite's `AGENTS.md` writer on this Spec's behalf.

## Decisions And Contracts

- [Maintainer procedures live in declared maintainer skills and directory-scoped guides carry only a directory's invariants and pointers](../../docs/ddr/001K-maintainer-procedures-live-in-declared-maintainer-skills-and-directory-scoped-guides-carry-only-a-directory-s-invariants-and-pointers.md) (owner, 2026-10-05).
- [AGENTS.md is the map and the only Contract file](../../docs/ddr/001C-agents-md-is-the-map-and-the-only-contract-file.md): a guide binds by location through the map's one line, never by its own authority.
- One home per truth ([Every kind of truth has one maintained home](../../docs/ddr/000G-every-kind-of-truth-has-one-maintained-home.md)): a guide points at a procedure and never repeats it.

## Non-Goals

Moving any procedure out of the maintainer skills, nested guides in generated rooms, changing the closed bundle or the Template, a host-specific adapter beyond an import line, implementing another capability.

## Dependencies And Blockers

- `AGENTS.md` and the landing-check tool are the [Contract carrier rewrite](../S-004C-contract-carrier-pointer-brief-rewrite/SPEC.md)'s writer and tool; the Instruction Authority line and the removal of root-brief lines go through that Spec's writer, and this Spec records the wait rather than editing concurrently.
- The [release owner](../S-00O-workbench-v4-0-0-release/SPEC.md) retains version, Template and owner gates.

## Vertical Implementation Slices

No Tasks cut. At Plan, cut small complete-path slices: the host-loading proof for one directory; the guide shape and its mechanical check; one guide per maintainer directory with its lines moved from the root brief through the landing check; the Instruction Authority line through the carrier writer. The empty tasks directory keeps this planned capability record-backed.

## Acceptance Criteria

- [ ] A recorded proof shows which file each host loads in a subdirectory, and every guide is reached that way.
- [ ] Every maintainer directory with invariants has one guide in the one shape, and the mechanical check refuses a procedure step or a binding claim inside a guide.
- [ ] Each line moved from the root brief has its guide as its landed home in the landing check, and the root brief is shorter by those lines.
- [ ] The Template, a fresh Genesis room, an adopted project and an updated room contain no maintainer guide, the wiki-lane guide is unchanged, and the closed-bundle checks pass.
- [ ] The Instruction Authority list carries the one line, written by the carrier writer, and the full suite passes on the committed candidate; named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

The guide check as a tool test, the landing check, the control-fidelity and governance-core tests, the template-placeholder check, the Genesis, adoption and update-route round trips, and a recorded host-loading proof per host.

## Verification Procedure

Run the targeted control, template, genesis, adoption and upgrade tests, then the full AGENTS suite, `render` and `doctor`, on the committed candidate. Obtain separate-context review of the immutable candidate before integration.

## Documentation Impact

The guides themselves, the root brief, the Wiki page for the maintainer skills, and the lineage page's pointer.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-05 | none | Authored at the Map step from the owner's merged maintainer-home decision of 2026-10-05 at integration 35187ee6. | Map only; the manifest, root brief and host adapter were read, no runtime proof claimed. | This Spec. | Plan, the host-loading proof, implementation and proof remain. |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Whether a generated room may add its own directory guides for project directories is a later question under the Progressive Disclosure landmark.

## Supersession

- Supersedes: none
- Superseded by: none
