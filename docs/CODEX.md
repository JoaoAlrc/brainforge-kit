# Brainforge with Codex

For ordinary use, open the repository and type `start`, or invoke `$start`.
In the desktop app, skills also appear in the slash menu: type `/start` and
select the skill. In CLI versions, use `$start` or `/skills`. The old `$setup`
entry remains supported. See the official
[slash command reference](https://learn.chatgpt.com/docs/reference/slash-commands).
The conversational workflow saves your context and prepares
a small starter team using file tools. It does not require Node.

This guide describes the optional **full software generator**. Select
`"runtimes": ["codex"]` in the advanced answers file to generate Codex alone,
or combine it with claude, kimi and gemini. Codex does not require Claude.

## Generated files

| File | Purpose |
| --- | --- |
| `AGENTS.md` | Project entry instructions |
| `.codex/config.toml` | Subagent limits and defaults |
| `.codex/agents/*.toml` | Native roles and instructions |
| `.codex/MODELS.md` | Effective generated model matrix |
| `.agents/skills/*/SKILL.md` | Discoverable skills |
| `.brainforge/roles/*.md` | Selected domain procedures |
| `.brainforge/SCOPES.json` | Ownership and verification contract |
| `.brainforge/COORDINATION.md` | Shared workflow |

Domain rules derive from the selected catalog. Compatibility instructions
explain how to interpret legacy examples from another client.

## Models and responsibility

The primary session keeps the user's selected model. The advanced generator
defaults to at most two concurrent subagents:

| Generator tier | Default | Responsibility |
| --- | --- | --- |
| lookup | GPT-5.6 Luna / low | Narrow lookup and document retrieval |
| execution | GPT-5.6 Terra / medium | Bounded implementation |
| review | GPT-5.6 Sol / high | Coordination, review, domain rules, money, permissions, backend, persistence and child protection |

These are starting heuristics, not a cost or quality benchmark. Critical work
requires an appropriate model and review in any role. Stronger models never
expand permissions. The simple onboarding profiles inherit the client model
for portability unless a supported task-specific choice is available.

To inherit the account/client model in the advanced generator:

```json
"codex": {
  "model_policy": "inherit",
  "max_agents": 2
}
```

For custom defaults, use model_policy balanced and codex.models.lookup,
codex.models.execution or codex.models.review, each with model and effort.
max_agents accepts 1–8. The generator checks structure, not account access.
After generation, native profiles belong to the project and can be edited.

## Permissions

Native read-only roles declare `sandbox_mode = "read-only"`. Writing roles
inherit the client's sandbox; the kit does not expand it. The project does
not change global trust, approvals or network access.

SCOPES.json is a declarative path and shell contract, **not a technical
path-level barrier**. The coordinator checks the diff and evidence.
External tools have their own permissions. Claude hook shims are not
installed or presented as Codex protection.

Use native roles when available. If the client only exposes a general
collaboration tool, pass the brief and supported model choice explicitly;
reading a TOML file does not apply its sandbox. Without delegation tools,
work sequentially and state when independent review is missing.

## Compatibility and evidence

The format follows official documentation checked September 17, 2026:
[custom agents](https://learn.chatgpt.com/docs/agent-configuration/subagents),
[configuration](https://learn.chatgpt.com/docs/config-file/config-reference),
[skills](https://learn.chatgpt.com/docs/build-skills) and
[models](https://learn.chatgpt.com/docs/models).

Older clients may not load this format. Project configuration may depend on
client trust settings; the kit does not change that choice automatically.

Node tests cover all four tracks, required skills, read-only profiles, model
overrides/inheritance, runtime selection, dry runs and preservation of existing
files. Codex CLI 0.155.0-alpha.2.6 accepted configuration loading. These checks
do not prove a complete paid-model task or compatibility with every plan.

Older generated projects may contain .codex/hooks.json and Claude-dependent
shims. The current generator does not silently remove them. Review migration
before assuming an existing project uses only the new runtime.
