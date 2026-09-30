# Validate a readable Landmark article

Explicitly designate one existing article. The command reads all UTF-8 Markdown
bytes, including frontmatter, prose, comments, code fences and link targets:

```bash
node workbench/tools/landmark-wiki.mjs validate workbench/wiki/design-concepts/example.md --json
# For another room, add --path /absolute/project
```

The article path is relative to the resolved project root, or an absolute path
inside it. The public API takes an explicit root:

```js
import { validateLandmarkArticle } from './workbench/tools/landmark-wiki.mjs';
const result = validateLandmarkArticle(projectRoot, articlePath);
// Explicitly identify custom types (for example, custom notepad namespaces):
const withCustom = validateLandmarkArticle(projectRoot, articlePath, {
  extraPrefixes: ['CUSTOM', 'ROOM2']
});
```

Success returns `{ status: 'valid', article, findings: [] }`. Identity findings
return `status: 'invalid'` and CLI exit 1. Each `landmark-wbid` finding names the
identity, project-relative article, one-based line and Unicode-character column,
and zero-based UTF-8 byte offset. Generic grammar candidates with an undesignated
prefix return `landmark-ambiguous` and `status: 'incomplete'` (CLI exit 1) when
no known identity is present; they never silently pass. Input/path/read failures throw
`LandmarkWikiRefusal` in the API; the CLI returns `status: 'blocked'` with a named
error and exit 1. Without `--json`, the command prints readable findings.

No operation writes the article, Wiki router, structured records or generated
Tracker. Missing paths, paths outside the project, symbolic links in article
paths, non-files, non-Markdown files, empty content and invalid UTF-8 visibly
refuse. This validates identifier absence and readable content; it does not
assess the article's claims or replace its applicable Wiki metadata rules.

Detection follows the delivered identity grammar: uppercase type prefix, hyphen,
alphanumeric suffix. Default standard artifact prefixes are `S`, `TK`, `ADR`, `N`, `LMK`
and `DQC`; suffixes include old decimal labels, legacy mixed-case base62 and
new widened uppercase base36. Connection identities use `WB` and exactly 22
base62 characters. Alphanumeric token boundaries avoid matching a known prefix
inside an unrelated word; filenames and qualified source paths still match.
`visibleIdParts` and `isWorkbenchId` in `workbench/tools/visible-ids.mjs` own
this grammar. Fixed type callers are Spec/Task, ADR and Tracker tools; the
Runbook documents `N` for notes. `allocateNote` also permits caller-chosen
prefixes, so the six defaults are a convenience, not an exhaustive inventory.
Identify additional namespaces with repeated `--prefix CUSTOM --prefix ROOM2`
or API `extraPrefixes`. Prefix validation uses the same 1–16 uppercase
letter/digit grammar, starting with a letter, before reading article bytes.
No record or ignored-note inventory is read.

This is syntactic detection, not an allocated-record lookup. A word spelled
exactly like a known identity (for example `S-curve`) is ambiguous and refused.
Unknown/custom type prefixes cannot pass by omission: even ordinary prose such
as `HTTP-API` matches generic grammar and returns incomplete until clarified.
Ordinary hyphenated words such as `source-path` pass. One layer of `%HH` byte
encoding is decoded across the content, including URLs and link targets;
locations still refer to the original article bytes. Recursive encoding,
HTML entities, split spellings and historical interview labels outside this
grammar are not semantically reconstructed. This is explicit byte/grammar
validation, not a claim of arbitrary obfuscation detection.

Keep identity-bearing provenance in the structured Landmark/DQC/delivery
records. Several Specs may maintain the same readable article. Only an explicit
call applies this rule; ordinary feature and retirement articles retain their
existing Wiki provenance rules. The compatibility fixture exercises the current
`type: project` with retirement source paths and links; it does not prove an
unreleased feature-type/schema addition. Shared Wiki wiring, claim assessment and record
lifecycle support remain later delivery slices.

Run the disposable public CLI/API demonstration (normally under one second):

```bash
node --test --test-name-pattern='valid explicitly|rejects actual comment' tools/test-landmark-wiki.mjs
```

It creates a readable article with external structured provenance, accepts it,
then separately refuses an identity in actual hidden-comment bytes with its
location. Snapshot assertions check that validation writes nothing. Fixtures
are removed afterward; no manual article setup is needed.

This source-checkout command is available now. Installed-room distribution
requires adding `landmark-wiki.mjs` to `RUNTIME_TOOLS` in
`workbench/tools/workbench-layout.mjs` and testing the managed-tools receipt;
that shared installer seam is outside this Task's file lane. No root or generic
control mirror changes are needed for this isolated API addition.

Delivery owner: [Landmark Records](../specs/S-002A-landmark-records/SPEC.md).
