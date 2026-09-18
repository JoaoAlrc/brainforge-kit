# Brainforge software kit

This folder contains the full software catalog and advanced generators.
Ordinary users should start with the [conversational setup](../README.md).
Developers can use [advanced setup](../docs/ADVANCED.md).

| Path | Purpose |
| --- | --- |
| catalog/agents/ | 40 catalog roles |
| catalog/skills/ | 22 procedures and contracts |
| catalog/catalog.json | Index, dependencies, tracks and scope defaults |
| bootstrap/new-project.mjs | Generate a project from answers |
| bootstrap/codex-adapter.mjs | Native Codex configuration |
| bootstrap/client-adapters.mjs | Portable knowledge and Kimi/Gemini adapters |
| hooks/, templates/, skills/, agents/ | Legacy Claude components |
| .codex/ and .agents/ | Codex configuration for maintaining the kit |

## Generate a separate software project

From the repository root:

```sh
node brainforge.mjs answers --track web-saas --out answers.json
node brainforge.mjs create --answers answers.json --target ../new-project --dry-run
node brainforge.mjs create --answers answers.json --target ../new-project
```

Fill the actual project facts first. The CLI rejects nonempty targets and
writes UTF-8 independently of the shell. This path needs Node 22+; the ordinary
conversational setup does not.

The lower-level generator remains available from this directory:

```sh
node bootstrap/new-project.mjs --list
node bootstrap/new-project.mjs --answers answers.json --target ../new-project --no-git
```

Do not use --force as an upgrade strategy. A project may have customized
decisions in its skills and roles that must survive a catalog update.

## Client configuration

[Codex](../docs/CODEX.md) gets native instructions, profiles and skills.
[Kimi/Gemini](CLIENTS.md) share portable knowledge with distinct entry points.
No adapter claims that a written path contract is filesystem isolation.

The full [Claude catalog review](../docs/CLAUDE-REVIEW.md) identifies known
delegation and hook issues. Testing an engine directly does not prove the
client loads it or that every shell effect is covered.

Run npm test from the repository root for the portable suite. The legacy
bootstrap/selftest.sh requires Bash and primarily covers Claude generation;
it does not prove native execution of another client.
