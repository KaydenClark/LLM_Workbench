---
name: research
description: Answer one bounded question quickly from a few sources — the light tier beside deep-research. Read docs, a third-party API, code, or a local resource to surface the fact a decision waits on; no fan-out, no adversarial verification, no report.
---

# Research

The **light** research tier. Use it to surface a bounded fact a decision is
waiting on — an API detail, a config default, "does library X support Y," what a
local file says. Fast and targeted.

## When to use which

- **`/research`** (this skill) — one bounded question, a handful of sources, a
  short sourced answer. No multi-source fan-out, no adversarial verification, no
  written report. Minutes, not a session.
- **`/deep-research`** — a comprehensive question needing fan-out across many
  sources, adversarial verification of claims, and a cited synthesis. Reach for
  it only when the answer genuinely needs that rigor; do not fire the report
  harness to confirm one API detail.

If a `/research` question keeps expanding — more sources, contested claims, needs
a written trail — stop and escalate to `/deep-research` rather than half-doing it.

## Procedure

1. State the one question and what decision waits on it.
2. Consult the smallest sufficient set of sources — local files and code first,
   then docs or the third-party API. Look things up; do not guess.
3. Return the answer with each source named, plus an explicit confidence and any
   caveat. If the sources disagree or are insufficient, say so — never invent a fact.

## As a wayfinder ticket

A `wayfinder` `research` ticket dispatches this skill as an AFK subagent on a
throwaway `research/<name>` branch, capturing the finding on the ticket. Escalate
that ticket to `/deep-research` only when its question proves to need the heavy tier.
