---
type: meta
status: active
sensitivity: normal
knowledge_role: canonical
provenance:
  - owner-approved draft article template (Template 2), 2026-09-30, carried into S-002L TK-006N on 2026-10-04
source_paths:
  - workbench/tools/wiki.mjs
  - workbench/specs/S-002L-skills-draft-wiki-collection/SPEC.md
last_verified: 2026-10-04
---

# Skills Draft Wiki Article Template

Copy the fenced block below to `skills-draft/<group>/<skill>.md`, fill the
placeholders, and delete every comment line you have answered. The section list
and order are the owner-approved template; `node workbench/tools/wiki.mjs
validate` accepts a draft that has them and refuses one that does not, by name.
The collection's shape and status rules are in [SCHEMA.md](../SCHEMA.md).

````markdown
---
type: memory
status: draft
sensitivity: normal
knowledge_role: curated
skill: <skill-name>
group: <group-folder>
skill_source: <core | pending | personal | new>
origin: <workbench | matt | foundry | other>
matt_counterpart: <name | none>
supersedes: <existing skill-*.md, or none>
provenance:
  - <who or what produced this, dates, upstream pin d81f3a1>
source_paths:
  - <repository-relative path>
last_verified: YYYY-MM-DD
---
# <Skill>: <what it does for you, one line>

## What it does

<!-- second person, no jargon -->

## When to reach for it

<!-- table: What you have | Reach for -->

## What it needs

<!-- other skills, config, tools; each resolves to something real or becomes a finding -->

## What it reads and writes

<!-- every artifact and where it lives -->

## How it works

<!-- one to three concept sections -->

## Common questions

<!-- including honest limits -->

## It's working if

<!-- observable signs, like our fresh-context scenarios -->

## Where it fits

<!-- chain line, group, upstream and downstream skills -->

--- draft only, stripped on promotion ---

## Compared with Matt's

<!-- counterpart, verdict: same | close | divergent | missing, behavior and clarity differences -->

## Findings

<!-- one finding per line, or the single word none: F:<skill>:NN | kind | one line | who fixes it -->

## Sources and history

<!-- our existing tail -->
````

## Front matter

| Key | Value |
|---|---|
| `group` | One of `getting-started`, `main-workflow`, `shaping`, `upkeep`, `primitives`, `productivity`, `stances`, `foundry`; it must equal the folder the draft sits in. |
| `skill` | The skill's name; it must equal the file name without `.md`. |
| `skill_source` | `core` (`workbench/skills`), `pending` (`skills-pending`), `personal` (only in the owner's install) or `new` (no source yet). |
| `origin` | `workbench`, `matt`, `foundry` or `other`; `foundry` marks a skill to revisit later, and `other` is a skill from none of the three (for example one that ships with a host tool). |
| `source_paths` | Repository-relative paths only. A `personal` skill has no repo path: name its install location (for example `~/.agents/skills/<name>/SKILL.md`, read-only) in a `provenance` line instead. |
| `supersedes` | The existing `skill-*.md` article this draft would replace on promotion, or `none`. It stays active and routed until the owner promotes the draft. |

## Finding lines

A finding is one line, so a later roll-up can list every connection problem
with a single `grep '^F:'`:

```text
F:<skill>:NN | kind | one line | who fixes it
```

- `<skill>` is the draft's own skill name and `NN` is a two-digit number,
  unique within the draft.
- `kind` is one of `dangling` (a reference that resolves to nothing),
  `stale-name` (a retired or renamed skill, term or path), `overlap` (two
  skills do the same job), `gap` (a missing piece or an unowned artifact),
  `conflict` (two statements that cannot both hold) or `missing-skill` (a
  skill the draft needs that does not exist).
- The last two fields are free text without ` | ` in them. `who fixes it`
  names the Spec or role that owns the repair.
- Write findings under `## Findings` with no bullet. The section holds only
  finding lines, the word `none`, blank lines and single-line comments.

## Adjustments the validator forced

The approved template is unchanged in its sections, their order and its keys.
Wording changes keep it parseable, and the draft-wiki Spec records them:

- A section's hint moved from the heading into a comment line under it, so a
  heading is exactly the section name and can be matched and grepped.
- Lists are block lists (`provenance`, `source_paths`), because the Wiki's
  front matter reader does not read `[a, b]` as a list and would skip the
  portability check on `source_paths`.
- Choice values (`skill_source`, `origin`) are written bare, with no trailing
  `# comment`, because the reader would keep the comment as part of the value;
  the validator refuses a value outside the listed set.
- `supersedes` and `matt_counterpart` carry `none` rather than being left
  blank.
- `origin` gained a fourth value, `other`, for a skill that is not from the
  Workbench, Matt or the Foundry.
