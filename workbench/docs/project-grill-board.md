# Optional project Grill Board

This optional component deploys the existing Grill Board page and protocol into
an adopted Git project. Standard tools/skills installation does not install it.
The source must be a clean checkout at the exact reviewed commit. Node 18 or
newer and Git are sufficient; no packages, service, hooks or credentials are
installed. Never install into a producer Board or overwrite an existing Board.

Create a configuration file outside the Board directory:

```json
{
  "schema": "grill-board/project@1",
  "title": "Project gun decisions",
  "repository": "https://github.com/OWNER/PROJECT",
  "instance": "project-guns-unique",
  "port": 4767,
  "topics": [
    {
      "id": "guns",
      "title": "Guns",
      "frame": "Choose the next weapon correction",
      "outcome": "Approved art and a tested candidate",
      "groups": ["pistol", "rifle"]
    }
  ]
}
```

Use the project's own title, canonical HTTPS GitHub repository URL, unique
instance name and manually selected unused port. Topic membership uses item
`group`, never producer question numbers. Each group belongs to one topic.
Other topics remains available for ungrouped questions. Configuration strings
are escaped as data, including embedded script delimiters.

From the reviewed Workbench source:

```sh
node tools/grill-board-deploy.mjs init --project /absolute/project \
  --source /absolute/reviewed-workbench --commit EXACT_40_CHARACTER_SHA \
  --config /absolute/project-board-config.json
node tools/grill-board-deploy.mjs verify --project /absolute/project
```

Initialization creates only `workbench/grill-board`: an empty `items.json`,
configured page, project configuration, component-private runtime, local ignore
rule and deployment receipt. It never copies producer questions or creates
owner answers. Receipt hashes cover immutable deployment files; `items.json`
and owner-local `answers.json` remain mutable through their respective writers.
Rerunning initialization verifies and preserves an existing deployment; different
configuration, collisions or modified managed bytes refuse rather than overwrite.
There is no automatic update or destructive recovery command. A component update
needs a separately reviewed preservation plan. Do not edit receipt-managed files.

Run the clone-portable installed adapter from the project root:

```sh
node workbench/grill-board/runtime/tools/grill-board-project.mjs serve --path .
```

Open the printed `http://127.0.0.1:PORT/` on that same machine. Stop with Ctrl-C.
The server binds only to loopback; host, bind and port overrides are refused.
Other-device access requires a separately approved access route. This component
creates no network route or persistent service. Batch/theme keys use the project
instance, preventing unrelated projects on a reused localhost port sharing state.

Agent commands use the same adapter and existing protocol:

```sh
node workbench/grill-board/runtime/tools/grill-board-project.mjs add --path . --file /absolute/items-to-add.json --by AGENT
node workbench/grill-board/runtime/tools/grill-board-project.mjs revise GB-0001 --path . --by AGENT --reason "New evidence" --question "Updated question"
node workbench/grill-board/runtime/tools/grill-board-project.mjs pending --path . --json
node workbench/grill-board/runtime/tools/grill-board-project.mjs apply GB-0001 --path . --by AGENT --where "Named durable owner"
```

Items retain the producer schema: key, configured group, kind, title, question,
current, proposal, optional draft/options/brief, named sources and tags. The
existing add operation allocates stable GB identities. Never edit items by hand
or regenerate them to reset history. Agents revise questions/proposals with a
reason; owners answer through the served page. No direct owner question editor
is provided. A revision makes earlier answers stale and prevents applying them.
`apply` records actual owner words after carrying them to the named durable owner.
Notes without a verdict and Not now do not constitute an applicable decision.

Named gun documents, Specs, Tasks and draft-source files are readable through
existing source links: their full current text appears in the source dialog;
proposals/drafts remain explicitly review material on the question. Drafts in
an item's `draft` are separate from current text; do not describe an excerpt as
a complete replacement. Existing formatted artifact reading remains available
for its supported artifact kinds. This component adds no generic catalogue or
new renderer. Source links use the configured repository and an explicit full
Git commit supplied in each source.ref by the project. Links reflect that
explicit provenance; the adapter does not infer whether a local uncommitted file
exists at the remote commit. Untracked or non-pinned references have no
misleading remote link.
Source reads remain restricted to named ordinary files inside the project;
private files, answers, linked files and escaping paths are refused. Markdown
remains rendered by the existing inert renderer.

`answers.json` is owner-local and ignored by the component's `.gitignore`.
Commit the deployment, configuration and items, never answers or temporary answer
files. Check `git check-ignore workbench/grill-board/answers.json` and
`git ls-files workbench/grill-board/answers.json` before publishing. A clean clone
has all executable runtime dependencies and questions, without owner answers.
A clone therefore does not transport unsynchronized owner answers to a new host.

The existing page can retain a stale-answer warning after a fresh confirmation
until reload. The saved answer and CLI status remain correct; reload to refresh
that inherited presentation. This adapter does not rewrite the producer renderer.

The source `tools/test-grill-board-deploy.mjs` exercises installation, preservation,
refusals, configured runtime, clone portability and the answer/revision protocol
with disposable data. A real project installation is not evidence that the owner
has approved questions, that game assets work in-game or that agent productivity
has improved.
