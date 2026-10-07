---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - LLM Workbench template wiki: general AI coding terms adopted from the AI Coding Dictionary
source_paths:
  - GLOSSARY.md
last_verified: [YYYY-MM-DD]
---

# AI coding reference

The general words of AI-assisted coding, as the Workbench uses them. None of them needs a glossary entry: each keeps its ordinary meaning, restated here so agents and the owner use it one way. Two AI coding words that carry a distinct Workbench meaning, Automated review and Grilling, are explained in [Workbench meanings of AI coding terms](vocabulary-workbench-meanings-of-ai-coding-terms.md) and defined in the [glossary](../../GLOSSARY.md#workbench-meanings-of-ai-coding-terms).

The LLM Workbench owner adopted these words from the AI Coding Dictionary as meanings the Workbench should know inside itself. The owner adds further batches as the project needs them. Each entry restates the agreed meaning in Workbench words. The dictionary link is attribution, not a live import: the dictionary's source carries no license, and an edit upstream changes no Workbench meaning until the owner adopts it. An entry defines a word and sets no policy for any role, model or cost. The dictionary itself is at [aihero.dev](https://www.aihero.dev/ai-coding-dictionary).

## Model

The trained parameters on their own: something that predicts the next token from the text it is handed. It keeps no state and can do nothing in the world until a harness wraps it. Providers sell larger, more capable, slower and costlier models beside smaller, faster, cheaper ones, so the tier is a choice made per task.

**In the Workbench.** Not the agent and not the harness; a model plus a harness is an agent. When output disappoints, look at the context and the harness before the model.

Attribution: [AI Coding Dictionary, Model](https://www.aihero.dev/ai-coding-dictionary/model).

## Parameters

The numbers inside a model, also called its weights. Training sets them and inference only reads them, so nothing that happens in a session alters them. Everything a model knows without being told lives there and stops at its knowledge cutoff.

**In the Workbench.** Why project knowledge has to arrive as context. Changing the parameters means retraining, which in effect produces a different model.

Attribution: [AI Coding Dictionary, Parameters](https://www.aihero.dev/ai-coding-dictionary/parameters).

## Effort

A per-request setting for how much the model reasons before it answers. That reasoning is generated, and charged for, as output tokens whether or not it is shown, so higher effort costs more and answers later. Too little gives a confident but shallow answer to a hard problem; too much burns time on rote work.

**In the Workbench.** Spend it on the hard part of a task, not on a whole session by default. This entry defines the word and sets no effort for any role or operation.

Attribution: [AI Coding Dictionary, Effort](https://www.aihero.dev/ai-coding-dictionary/effort).

## Inference

Running a trained model to produce output, which happens on every request to a model provider. The parameters are only read, so a correction made today is not learned for tomorrow. It is billed by the token and is the main cost of using a model; each tool round trip is another pass over the whole context.

**In the Workbench.** Not training. It is why continuity is written down and why the size of the context is a matter of cost.

Attribution: [AI Coding Dictionary, Inference](https://www.aihero.dev/ai-coding-dictionary/inference).

## Token

What a model reads in and writes out, cut from text by a fixed tokenizer vocabulary. An English word averages a little under one token, but hashes, generated identifiers and encoded data break into many. Context size, cost and speed are all counted in tokens.

**In the Workbench.** Avoid "word" for any of those measures. Long identifiers in always-loaded files cost more than they look.

Attribution: [AI Coding Dictionary, Token](https://www.aihero.dev/ai-coding-dictionary/token).

## Next-token prediction

The model's one operation: from the context so far it samples a single next token, appends it and goes again, so every output, a tool call included, is assembled a token at a time. It chooses what is likely, not what is true.

**In the Workbench.** The source of hallucination and of run-to-run variation. A tool call is text the harness parses and runs.

Attribution: [AI Coding Dictionary, Next-token prediction](https://www.aihero.dev/ai-coding-dictionary/next-token-prediction).

## Non-determinism

The same input can yield different output, because each token is sampled and provider-side serving adds its own variation; no setting removes it. Repeated runs of one task spread across a distribution.

**In the Workbench.** Why one passing run is not proof. Retrying is a legitimate strategy, automated checks must catch the poor results, and a streak of poor results is usually the distribution, not a worse model. `AGENTS.md` requires repeated controlled trials before an agent-outcome claim for this reason.

Attribution: [AI Coding Dictionary, Non-determinism](https://www.aihero.dev/ai-coding-dictionary/non-determinism).

## Model provider

Whatever runs a model to answer requests, remote or local. The harness asks a provider for each response instead of running the model itself. Rate limits, capacity and outages live there, along with pricing, cache discounts and the list of models that exist. A provider need not be the maker of the model.

**In the Workbench.** The Workbench's existing names that say bare "provider" (the cross-provider tools, the "provider home") mean the agent family, Claude or Codex, not this; they stay as public names. New prose says harness or model provider instead of bare "provider".

Attribution: [AI Coding Dictionary, Model provider](https://www.aihero.dev/ai-coding-dictionary/model-provider).

## Harness

Everything around a model that makes it an agent: its tools, its system prompt, the way the context window is managed, permissions and hooks. It builds each request, executes the tool calls that the model requests, returns the results, keeps the session history, asks the user before risky actions and chooses when to compact. Claude Code, Codex CLI, Cursor and Claude.ai are harnesses.

**In the Workbench.** The Workbench is not a harness: it is the agentic management system that a harness such as Claude Code or Codex loads, so its agents can align the owner's ideas and implement the owner's design concepts. `AGENTS.md`, permission settings and hooks are instructions to the harness. One model behaves differently under different harnesses (Claude.ai answers, Claude Code edits files), so when behavior changes the harness is often the variable. In the Workbench's words "host" means the harness where it names software (a Chat's host, a host adapter such as `CLAUDE.md`) and the machine where it names a machine (Host portability). Public names that carry the word, such as the `update-harness` skill, stay until they are renamed on their own.

Attribution: [AI Coding Dictionary, Harness](https://www.aihero.dev/ai-coding-dictionary/harness).

## Input tokens

The tokens a harness sends with every request: the system prompt, the history and the tool results. Each costs less than an output token, yet input is usually most of the bill, because the stateless model is sent the whole session again each turn. Caching, clearing and compaction reduce it.

**In the Workbench.** Counterpart of Output tokens. Always-loaded files such as `AGENTS.md` are input on every request, which is why they stay short.

Attribution: [AI Coding Dictionary, Input tokens](https://www.aihero.dev/ai-coding-dictionary/input-tokens).

## Output tokens

The tokens the model generates, tool calls and hidden reasoning included. Each costs more than an input token, commonly several times as much, and are produced one at a time, so they set how long a turn takes. Emitting edits instead of whole files saves them.

**In the Workbench.** Counterpart of Input tokens. Higher Effort produces more of them.

Attribution: [AI Coding Dictionary, Output tokens](https://www.aihero.dev/ai-coding-dictionary/output-tokens).

## Cache tokens

Input tokens the provider reuses because they repeat the opening stretch of an earlier request exactly; they are billed far below the input rate and keep long sessions affordable. Only an exact prefix matches, so a change early in the conversation misses from that point on, and the cache lapses after a few idle minutes. A cost jump shows first as cache tokens falling against input tokens.

**In the Workbench.** Why content that is loaded at the start of every session should stay stable rather than being edited mid-session.

Attribution: [AI Coding Dictionary, Cache tokens](https://www.aihero.dev/ai-coding-dictionary/cache-tokens).

## Stateless

Carries nothing forward. A model is stateless across requests and never learns from a session; between sessions an agent forgets too, unless something is written down. The sense of continuity inside a session is the harness re-sending the transcript.

**In the Workbench.** Counterpart of Stateful. To make a correction stick, write it where every later session reads it: `AGENTS.md`, a notepad, a handoff or the Wiki.

Attribution: [AI Coding Dictionary, Stateless](https://www.aihero.dev/ai-coding-dictionary/stateless).

## Stateful

Carries information forward. A session is stateful from one turn to the next; an agent becomes stateful across sessions only through a memory system that writes to the environment and loads it back; a model never is. Each layer re-reads its state from the layer beneath it. Carried state carries early mistakes too, which is why clearing discards it.

**In the Workbench.** Counterpart of Stateless. Notepads, the Wiki and `AGENTS.md` are the Workbench's cross-session state; the dictionary's memory system is not adopted as a term here.

Attribution: [AI Coding Dictionary, Stateful](https://www.aihero.dev/ai-coding-dictionary/stateful).

## Agent

A model that a harness has equipped with tools, a system prompt and a window of context, taking turns with a user: the unit one talks to and delegates to. The word names the model and harness together as one actor, not a mechanical part.

**In the Workbench.** Avoid "the AI" and "the bot". A Role is a scope assigned to an agent and a Stance is the job it does there; neither creates a new agent.

Attribution: [AI Coding Dictionary, Agent](https://www.aihero.dev/ai-coding-dictionary/agent).

## System prompt

The standing instructions a harness puts at the front of every request: identity, behavior, available tools and conventions. It is usually large and written by the harness vendor; files such as `AGENTS.md` load beside it. It stays fixed for a session, which is what starts the cache, and models are trained to give it priority over user messages.

**In the Workbench.** `AGENTS.md` and `CLAUDE.md` ride beside it and do not replace it.

Attribution: [AI Coding Dictionary, System prompt](https://www.aihero.dev/ai-coding-dictionary/system-prompt).

## Context window

Everything the model sees on one request: a single finite, model-specific sequence of tokens made of the system prompt, the conversation and the tool results, and the only way the model perceives anything. It fills as a session runs until compaction or clearing, and every token competes for attention, so treat it as a budget.

**In the Workbench.** Avoid "memory". Progressive disclosure and context pointers exist to keep it small.

Attribution: [AI Coding Dictionary, Context window](https://www.aihero.dev/ai-coding-dictionary/context-window).

## Context

The information relevant to the task that the agent has right now. It measures quality, not quantity: most failures trace to a needed fact that was never loaded or that sat buried.

**In the Workbench.** Not the context window (the actual run of tokens) and not the session (the running history). Context Map, Enduring Context and Working context are different terms: the Context Map is the navigable relationships among Workbench concepts, Enduring Context is a Governance Plane for durable reference, and Working context is the unfinished reasoning a notepad preserves.

Attribution: [AI Coding Dictionary, Context](https://www.aihero.dev/ai-coding-dictionary/context).

## Session

A single bounded run of working with an agent. It starts empty, accumulates the messages, tool outputs and files opened along the way, and ends when it is cleared, closed, or summarized into a new one. What fills the context window is the session, and its history is the agent's working memory, lost when it ends; only files survive.

**In the Workbench.** A Chat is the owner-visible working context in a host; a session is one run of the context window inside it. A Chat normally holds one session and may hold more when the harness compacts or clears within it, and a Task still maps to one Chat. Inference: this joins the two agreed definitions and is not a separate owner answer. "Session" in `AGENTS.md`'s Session Records And Checkpoints and Long Session Control sections, and the `sessions` support lane, use the word in this sense: the lane's records outlive any one session. Keeping to one task a session keeps what is loaded on topic.

Attribution: [AI Coding Dictionary, Session](https://www.aihero.dev/ai-coding-dictionary/session).

## Smart zone

The early stretch of a session in which an agent does its best work, before quality slides as its context grows. Work is planned to fit inside it, not inside the context window's hard limit.

**In the Workbench.** Not the context window's capacity: a session can still have room left and already be out of the zone.

Attribution: [AI Coding Dictionary, Smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone).

## Attention budget

The fixed amount of influence each token spreads over everything else in the context, so every token added dilutes the others.

**In the Workbench.** Not used as a term elsewhere in the Workbench; it is the reason behind the Progressive disclosure entry's rule that every loaded token costs attention.

Attribution: [AI Coding Dictionary, Attention budget](https://www.aihero.dev/ai-coding-dictionary/attention-budget).

## Attention degradation

The gradual loss of instruction-following as a session grows: the mechanism behind leaving the smart zone. Removing context recovers it; adding more does not.

**In the Workbench.** Progressive disclosure and a Task's context ceiling describe its effect without naming it.

Attribution: [AI Coding Dictionary, Attention degradation](https://www.aihero.dev/ai-coding-dictionary/attention-degradation).

## Automated check

A deterministic pass-or-fail verification, such as a test, a type check, a lint or a build, which an agent can correct its own work against.

**In the Workbench.** `doctor`, the test suites and the Diagnostic entry are instances. It involves no judgement, which separates it from an Automated review; the owner's Check workflow verb is the building agent running automated checks on its own Task before handing it back.

Attribution: [AI Coding Dictionary, Automated check](https://www.aihero.dev/ai-coding-dictionary/automated-check).

## Human review

A person reading the actual change, not the agent's account of it.

**In the Workbench.** Human QA is the owner-led evaluation of delivered work at times the owner chooses; a human review is defined by what is read, the change itself, not by who evaluates or when. One does not stand in for the other.

Attribution: [AI Coding Dictionary, Human review](https://www.aihero.dev/ai-coding-dictionary/human-review).

## Environment

The world an agent works in, outside its harness: what it sees through tool results and alters through tool calls. It is the layer that persists between sessions.

**In the Workbench.** Not the harness and not the session. Filesystem is its most common form.

Attribution: [AI Coding Dictionary, Environment](https://www.aihero.dev/ai-coding-dictionary/environment).

## Filesystem

The most common environment: the files and directories an agent reads and writes, where a project and its workbench live.

**In the Workbench.** Host portability treats filesystems as a machine concern (case sensitivity, paths, symlinks); this entry is about what the agent works in, not how the machine stores it.

Attribution: [AI Coding Dictionary, Filesystem](https://www.aihero.dev/ai-coding-dictionary/filesystem).

## Software factory

A system in which triggers, not a person, start agent sessions, so more work runs while nobody is watching.

**In the Workbench.** Defined here so the word means one thing; the entry sets no policy for unattended work.

Attribution: [AI Coding Dictionary, Software factory](https://www.aihero.dev/ai-coding-dictionary/software-factory).
