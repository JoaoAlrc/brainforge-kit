# Install the local starter team

These assets are plain text files. Copy them with the client's native file
tools; do not run an installer or ask the user to install a programming runtime.
Resolve paths from the repository root. Never overwrite an existing target.
If a target has custom content, keep it and proceed with available capabilities.

| Current client | Source | Target |
| --- | --- | --- |
| Claude Code | `onboarding/clients/claude/*.md` | `.claude/agents/<same filename>` |
| Codex | `onboarding/clients/codex/*.toml` | `.codex/agents/<same filename>` |
| Kimi Code | `onboarding/clients/kimi/*.md` | `.kimi-code/agents/<same filename>` |
| Gemini CLI | No native profiles in this starter | Follow `workspace/team.md` in the current session |

Copy only the three profiles for the current client. For Codex, when
`.codex/config.toml` does not exist, create it with:

```toml
[agents]
enabled = true
max_concurrent_threads_per_session = 2
```

If it exists, preserve it; do not silently replace the user's model, permissions
or agent settings. The profiles inherit the client's model unless the session
exposes a supported task-specific selection. They do not configure trust or
network access. Read-only profiles do not establish a path-level sandbox for
other profiles or for external connectors.

New profiles may require the client to reload the project. Test availability
through the client's real agent list/tool schema before delegating. Until then,
complete useful work with the current assistant. Gemini uses advisory roles
in this initial adapter; do not claim native multi-agent execution.

For Gemini, the root `.geminiignore` makes the four memory files and direct
Markdown deliverables in `workspace/output/` readable while Git still ignores
them. Other private workspace files stay excluded. Use Markdown for the first
text deliverable; do not disable ignore filters or change global settings to
read an excluded asset. Resolve a genuinely needed asset with the user.

If the user later needs the full software catalog in a separate repository,
the advanced generator can prepare it. Read `docs/ADVANCED.md` then. That step
requires Node 22+ and is separate from conversational setup; do not make it a
condition for creating the workspace or first deliverable.

For specialists selected by the current product or marketing task, follow
[SPECIALISTS.md](SPECIALISTS.md). Keep the starter small; prepare additional
profiles only for current work and verify actual discovery before use.

For explicit delegated model selection, consult [model policy](../docs/MODEL-POLICY.md).
