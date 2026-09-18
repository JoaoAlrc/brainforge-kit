# Kimi Code and Gemini CLI

For the simple start, use the root [README](../README.md): open the folder and
type `start`. Shortcuts are `/skill:start` for Kimi and `/start` for Gemini;
the older setup entries remain supported. The shared workflow does not require Node.

The advanced generator also accepts kimi and gemini in the answers' runtimes
array. Keep only the clients you use. Existing files are preserved by default;
skipped instructions may need a deliberate merge.

| Client | Instructions | Skills | Roles |
| --- | --- | --- | --- |
| Kimi Code | AGENTS.md and .kimi-code/AGENTS.md | .agents/skills/ | Native .kimi-code/agents profiles |
| Gemini CLI | GEMINI.md | .agents/skills/ | Advisory .brainforge/roles procedures |

## Kimi Code

The adapter targets **Kimi Code 0.38.0**, checked against the current official
[skills](https://moonshotai.github.io/kimi-code/en/customization/skills) and
[agents](https://moonshotai.github.io/kimi-code/en/customization/agents)
documentation. It is distinct from the older Python Kimi CLI.

Open the client in the project root. Use /skill:handoff-contract when that
skill is selected, or start a new session with kimi --agent scrum-master when
the full generator installed that role. No model is forced by the adapter.
Research tools are mapped to native tool names and explicit edit denials
are preserved. Read-only reviewers receive no shell, writing or delegation;
the coordinator provides diffs and test evidence.

Optional integration check, with Kimi installed:

```sh
node agent-kit/bootstrap/kimi-smoke.mjs
```

It starts a temporary loopback server with isolated data/cache, verifies project
skill discovery and stops the process. It uses Kimi's experimental local API.
It does not send a model prompt or validate delegation quality.

## Gemini CLI

The adapter follows official
[skills](https://geminicli.com/docs/cli/skills/),
[project instructions](https://geminicli.com/docs/cli/gemini-md/) and
[custom commands](https://geminicli.com/docs/cli/custom-commands/).

The root .gemini/commands/start.toml provides /start; setup.toml preserves the
older /setup entry. Check discovery with
/commands list or /commands reload. Shared skills can be inspected with
/skills list; /memory show displays loaded instructions.

The root `.geminiignore` allows the four local memory files and direct Markdown
outputs. Git still ignores `workspace/`. Other workspace assets remain excluded.
This uses the documented [negation rules](https://geminicli.com/docs/cli/gemini-ignore/)
and the current client's combined ignore parser, without disabling Git filters.
Regression checks cover both a clone and an extracted download; they do not
substitute for a live Gemini session.

**Experimental:** Gemini CLI was not installed in the validation environment.
File generation is tested; actual discovery and execution still need a live
client check. Advisory roles do not register native Gemini subagents or
enable experimental settings.

## Recorded evidence

On September 17, 2026, Kimi Code 0.38.0 found handoff-contract,
verify-falsification and the new root setup skill in isolated Windows fixtures.
The three starter profiles passed native parsing; builder and reviewer appeared
in the native agent catalog with their expected tools. An invalid YAML control
was rejected. There was no model call or trust change; actual model delegation
has not been demonstrated.

## Shared limits

.brainforge/SCOPES.json is a path, QA and ownership contract, not a tool filter.
The adapters do not transplant Claude hooks or bypass approvals, trust, login
or global configuration. Kimi tool lists do not create path-level isolation.

Shared role/skill copies retain domain procedures, remove Claude-native
metadata and add compatibility guidance. Use the current client's real tools,
not operational examples for another runtime.
