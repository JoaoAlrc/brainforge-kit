# Models — agent-kit

Updated 2026-09-17. The main agent keeps the UI selection. This matrix supports
kit development; the bootstrap generates a separate matrix for selected project
roles.

| Role | Codex model | Effort | Reason |
|---|---|---|---|
| `codex-reviewer` | `gpt-5.6-sol` | `high` | Independent review in a read-only sandbox. |
| `context-scout` | `gpt-5.6-luna` | `low` | Bounded lookup in a read-only sandbox. |
| `implementation-engineer` | `gpt-5.6-terra` | `high` | Bounded implementation and integration against an existing contract. |

These are initial responsibility-based choices, not benchmarks or measured
savings. For routine work, use the existing owner rather than creating another
agent to save a call. After diagnosing difficulty, escalate the same bounded
task to Sol/high or Astra/xhigh with evidence; do not escalate every agent by
default. Current user instructions take precedence.

Unspecified subagents default to Terra/medium, with at most two in parallel.
With collaboration, pass model/effort explicitly and fork_turns none; reading a
file does not change an active session. Native configuration depends on the
client loading the project. See [COORDINATION](COORDINATION.md).

For generated projects, `codex.model_policy = "inherit"` in answers JSON omits
model and effort. `codex.models.lookup`, `.execution`, and `.review` accept `model`
and `effort`. `codex.max_agents` accepts 1–8 (default 2). Choose combinations
available in the client and account. The matrix uses responsibility and risk,
never another provider's model name.

Sources: [subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents)
and [models](https://learn.chatgpt.com/docs/models), checked on 2026-09-17.
This kit provides no comparative benchmark or cost guarantee.
