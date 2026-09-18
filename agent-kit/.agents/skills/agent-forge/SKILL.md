---
name: "agent-forge"
description: "Create or revise Codex-only agents and skills while preserving project authority, ownership, and QA. Use before changing .codex/agents or .agents/skills."
---

# Agent forge for Codex

Read [Codex coordination](../../../.codex/COORDINATION.md) and the
[model matrix](../../../.codex/MODELS.md). This procedure replaces the legacy
skill body for Codex. When migrating a project, preserve its specific notes
separately and incorporate them at the end of this file.

## When to change

Create an agent for recurring responsibilities with distinct sources of truth,
ownership, or failure modes. Revise it when defects recur, scopes are wrong, or
the matrix selects another model. Prefer briefs for isolated work and skills
for shared protocols.

## Format

Agents live in `.codex/agents/<role>.toml` and use these basic fields:

```toml
name = "<role>"
description = "<function, scope, write restriction, and when to use>"
model = "<slug from .codex/MODELS.md>"
model_reasoning_effort = "<effort>"
developer_instructions = """
<identity, sources, ownership, invariants, QA, output, and stopping conditions>
"""
```

Do not copy `agent_type`, `tools`, `disallowedTools`, `skills`, `maxTurns`, or
`color` from Claude format. Preserve compatible existing security settings.
Reading TOML through a fallback applies neither sandbox nor model. Declare
allowed/denied paths as a contract; the coordinator checks the diff before
accepting the handoff.

Skills live in `.agents/skills/<name>/SKILL.md`, with JSON-quoted `name` and
`description` strings. Reference the two documents above using the relative
links already present in this skill.

## Models and delegation

The main agent keeps the interface-selected model. `scrum-master` uses Sol/high.
Other agents default to Terra/medium; responsibility-specific exceptions come
from `MODELS.md`. In `collaboration`, use `fork_turns = "none"` and specify
`model` and `reasoning_effort`. Keep at most two subagents; never load the entire team.

Preserve canon, backlog, domain rules, ownership, QA, risk, external approvals,
CI, and project notes. This adaptation changes neither `CLAUDE.md`, `.claude/**`,
legacy `agent-kit` content, hooks, trust, nor global client configuration.
Subsequent actions follow user authorization; do not infer permission for global
events, commits, or deployments.
