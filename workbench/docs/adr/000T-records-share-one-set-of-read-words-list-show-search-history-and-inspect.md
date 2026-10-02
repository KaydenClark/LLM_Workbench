---
date: 2026-10-02
canonicalized_in:
  - LEXICON.md
---

# Records share one set of read words: list, show, search, history and inspect

## Decision

Every kind of record the Workbench keeps answers the same kinds of read with
the same words, so an agent asks a notepad, a Destination Question Card, a
landmark, a Spec, an ADR or a DDR the same way. Create, Read, Update and Delete
remain the frame every tool answers
([ADR-0003](0003-full-crud-with-artifact-conditions.md) and the Wiki schema's
contract); what varies from one tool to the next is the kind of read. The five
words:

- **list**: the records that exist.
- **show**: one whole record. `get` is an accepted synonym, meaning fetch one
  whole record by its identifier.
- **search**: records found by a query.
- **history**: how a record changed.
- **inspect**: part of a record, a field or a range.

`capture` is Create, not a read. Existing command names (`read`, `show`,
`capture`, `new` and the rest) keep working and count as synonyms until a Spec
renames each tool. The five words are defined once, in the Lexicon.

No formal standard for this exists in the AI tooling community, but independent
tools converge on the same kinds of read. The Model Context Protocol lists and
reads resources ([resources specification](https://modelcontextprotocol.io/specification/latest/server/resources)),
and its reference memory server reads the whole graph, searches nodes and opens
nodes by name ([memory server](https://github.com/modelcontextprotocol/servers/tree/main/src/memory)).
Mem0 offers search, get by identifier, get all and a per-memory history
([memory operations](https://docs.mem0.ai/core-concepts/memory-operations),
[history](https://docs.mem0.ai/api-reference/memory/history-memory)). LangGraph's
store has get, search and list of namespaces
([BaseStore](https://reference.langchain.com/python/langgraph.store/base/BaseStore)).
The Anthropic memory tool views a directory or a file with an optional line range
([memory tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool)),
and RFC 7089 standardizes reading past states of a web resource
([Memento](https://www.rfc-editor.org/rfc/rfc7089)). The owner chose the
Workbench's words from that convergence.

Considered and rejected: inventing a vocabulary of the Workbench's own (the
earlier proposal of recall, inspect, get and history); making `get` mean search
(the AI tools use `get` to fetch by key and `search` to query, so a reader from
those tools would be misled); two verbs for one whole-record read (the
difference between a readable page and an exact fetch is already a `--json`
flag, as the Landmark Tracker's `show` has it); replacing `inspect` with `show`
(`show` already reads one whole record in the Spec tool and the Tracker, so
that would flip its meaning); and Git-style `show` and `log` or REST verbs
(neither has words for create and update, and REST does not fit a command line).

Consequences: the Lexicon carries the five definitions. A tool gains the words
when a Spec touches it; this record renames nothing. The ADR and DDR tools have
no read command at the time of this record, so the Decision Record tooling Spec
gives them these words. Whether `search` attaches the linked corrections to a
result, as the notepad's topic read does, is undecided.

Provenance: owner-confirmed grilling of 2026-10-01 under the objective
"ddr-and-control-surface", which asked whether the AI community has a standard
read set for a store read by many agents and then set the words above. The
sources above were read on 2026-10-01; the Letta documentation and the CoALA
paper could not be read through the research tool and are not relied on.
