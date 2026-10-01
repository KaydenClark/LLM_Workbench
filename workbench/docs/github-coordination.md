# GitHub Coordination Adapter

The read-only binding inspector reads the manifest committed at an exact source
revision. It returns the existing Workbench room identity, the explicitly bound
GitHub repository and the source SHA/path. It makes no network request and
reports access as unverified. Repository binding does not establish assignment,
exclusive ownership, write capability or approval.

```bash
node workbench/tools/github-coordination.mjs inspect --project . --revision "$(git rev-parse HEAD)"
```

The optional `githubCoordination` field in `workbench/manifest.json` has this
shape:

```json
{
  "schemaVersion": 1,
  "repository": "Example/Room"
}
```

The schema accepts a portable ASCII `owner/repository` name, with no URL,
credentials or extra fields. The room must already have a valid `workbenchId`
in its schema-2 manifest. Legacy rooms remain usable through existing tools;
the inspector refuses an unconfigured room with `coordination-unconfigured`.
Inherited Git environment overrides are discarded before repository discovery;
real linked worktrees retain their own root and source. Dirty manifest edits cannot change the result for a committed revision. Missing
objects, malformed JSON/configuration, linked source manifests and nested
project roots are refused with named errors. Git replacement objects are ignored
so a source SHA retains its original meaning. Every Git operation disables lazy
fetching and optional locks; locally absent promised commits, trees and blobs
refuse without contacting their remote or changing Git metadata. Git must
support [`--no-lazy-fetch`](https://git-scm.com/docs/git#Documentation/git.txt---no-lazy-fetch); an unsupported Git invocation refuses rather than falling back.

The inspector ships through the existing managed runtime installer and receipt.
It adds no installed skill or new setup workflow. Setup, authenticated Issue
operations, artifact mapping and the one-authority claim cutover have separate
delivery owners in the [capability catalog](../specs/CATALOG.md). Until that
cutover lands, [ADR-000O](adr/000O-claims-are-pushed-on-the-task-branch-and-read-from-every-remote-tip.md)
remains the active claim mechanism; [ADR-000Q](adr/proposed/000Q-github-issues-are-the-required-live-coordination-authority.md)
records the intended successor and its effect conditions.
