# Validate a readable Landmark article

This command checks the Wiki's name-and-context identifier rule: an identifier
(`S-###`, `TK-###`, `ADR-###`, `LMK-`/`DQC-` and so on) is welcome on a page, as
the Wiki schema's Update section and `AGENTS.md` Documentation Ownership And
Proof say, when the artifact's name and a little context sit beside it, and a
bare identifier is reported. It replaces the earlier rule that refused every
identifier. A report is repaired by adding the name and context; the identifier
is never stripped.

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

Success returns `{ status: 'valid', article, findings: [] }`. A bare identifier
returns `status: 'invalid'` and CLI exit 1. Each `landmark-bare-id` finding names
the identifier, project-relative article, one-based line and Unicode-character
column, and zero-based UTF-8 byte offset, and its message tells the author to add
the artifact's name and context beside it and keep the identifier. A generic
grammar candidate with an undesignated prefix that has no name beside it returns
`landmark-ambiguous` and `status: 'incomplete'` (CLI exit 1) when no bare
identifier is present; it never silently passes, and the same name-and-context
form clears it.

## What "accompanied by the artifact's name and context" means

The check is mechanical and per occurrence, on one line of the content after one
layer of `%HH` decoding. Other identifiers on the line never count as a name. An
occurrence passes when any one of these holds:

1. **Link text names it.** The identifier sits in a link target (an inline
   `[text](target)` link or a `[text]: target` reference) and the link text has a
   name: at least two words, at least two of them not in the closed list of
   function and artifact-kind words (a, the, of, and, see, Spec, Task, ADR, note,
   card and similar). `[Landmark Records Spec](../landmarks/LMK-000A.json)` passes;
   `[records](...)` does not.
2. **A path slug names it.** The identifier is followed directly by a hyphenated
   slug of two or more lowercase words, as in
   `workbench/specs/S-002A-landmark-records/SPEC.md`. Later segments may start
   with a digit, as in `S-045-v3-1-2-follow-ups`, but at least two segments must
   start with a letter; one word, as in `ADR-0041-history`, or a version
   fragment, as in `ADR-0041-v3-1`, does not name it.
3. **A name phrase is adjacent.** Only whitespace and wrapper or separator
   characters (parentheses, brackets, backticks, emphasis marks, quotes, a colon
   or a spaced dash) separate the identifier from a name phrase before or after
   it. With a wrapper or separator between them the phrase needs two non-function
   words, so `Landmark Records Spec (S-002A)`, `S-002A (Landmark Records Spec)` and
   `TK-003: Name and context identifier validator` pass. With only whitespace
   between them the phrase must be two or more Title Case words, so
   `the Landmark Records Spec S-002A` passes while `Built through TK-002T`,
   `See Spec S-002A`, a list of identifiers, a bare `[S-002A](...)` link text, a
   bare code span and a bare metadata value are bare.

This is a floor for finding a bare identifier, not a judgment that the name is
the right one. Whether the name is correct and the context is useful is the
reading job of the Wiki lint in `workbench/wiki/SCHEMA.md`. Input/path/read failures throw
`LandmarkWikiRefusal` in the API; the CLI returns `status: 'blocked'` with a named
error and exit 1. Without `--json`, the command prints readable findings.

No operation writes the article, Wiki router, structured records or generated
Tracker. Missing paths, paths outside the project, symbolic links in article
paths, non-files, non-Markdown files, empty content and invalid UTF-8 visibly
refuse. This validates that every identifier has its name and context and that
the content is readable; it does not assess the article's claims or replace its
applicable Wiki metadata rules.

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
exactly like a known identity (for example `S-curve`) is treated as that
identity and reported until a name sits beside it. Unknown/custom type prefixes
cannot pass by omission: even ordinary prose such as `HTTP-API` matches generic
grammar and returns incomplete until a name sits beside it or its namespace is
designated.
Ordinary hyphenated words such as `source-path` pass. One layer of `%HH` byte
encoding is decoded across the content, including URLs and link targets;
locations still refer to the original article bytes. Recursive encoding,
HTML entities, split spellings and historical interview labels outside this
grammar are not semantically reconstructed. This is explicit byte/grammar
validation, not a claim of arbitrary obfuscation detection.

Structured Landmark/DQC/delivery records still hold the full identity
lineage. A readable article may carry identifiers for navigation, each with its
artifact's name and context. Several Specs may maintain the same readable
article. Only an explicit call applies this rule; ordinary feature and retirement articles retain their
existing Wiki provenance rules. The compatibility fixture exercises the current
`type: project` with retirement source paths and links; it does not prove an
unreleased feature-type/schema addition. Shared Wiki wiring, claim assessment and record
lifecycle support remain later delivery slices.

Run the disposable public CLI/API demonstration (normally under one second):

```bash
node --test --test-name-pattern='valid explicitly|rejects actual comment' tools/test-landmark-wiki.mjs
```

It creates a readable article with external structured provenance, accepts it,
then separately refuses an identifier in actual hidden-comment bytes with its
location. Snapshot assertions check that validation writes nothing. Fixtures
are removed afterward; no manual article setup is needed.

Managed installation includes this command through `RUNTIME_TOOLS` in
`workbench/tools/workbench-layout.mjs`. The installed CLI/API test checks its
receipt hash, successful validation and encoded custom-identity refusal in a
disposable room. No root or generic control mirror changes are needed for this
isolated API addition; ordinary rooms receive the command through the existing
managed-tools install or explicit update route.

Delivery owner: [Landmark Records](../specs/S-002A-landmark-records/SPEC.md).

Identifier rule history: the first delivery refused every identifier
(the old `landmark-wbid` finding, owned by Landmark Records). The Wiki Evolving-Synthesis
Migration Spec replaced that ban with this name-and-context rule
(`landmark-bare-id`); the Landmark Records Spec and Landmark Tracker Foundation
Spec keep their original requirement text as history and carry an evidence row
for the change.

Landmark synthesis pages: each landmark's page lives in
`workbench/wiki/design-concepts/` as `landmark-<title>.md`, is routed from the
Wiki router, and is validated with this command; its convention is in the
[design-concepts README](../wiki/design-concepts/README.md#landmark-synthesis-pages).
`tools/test-landmark-wiki.mjs` checks that every landmark record has exactly one
routed page that passes this rule.

Assessment boundary: the Tracker's claim and documentation assessment
(`revise --claim-evidence`, `--assess ... --evidence`) records the evidence
reference an operator or agent names, as `<artifact>@<revision>`, and derives a
claim's `supported`/`affected` status from record revisions; `rebuild` does not
read Wiki bytes. A synthesis page can be named as that evidence, but nothing
yet compares a card's expected claims with a page's actual bytes. Doing so is a
later delivery decision of the Landmark Records Spec, not a property of these
pages.
