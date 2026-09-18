# Advanced software setup

Most users should start with the conversation described in the [README](../README.md).
This guide is for developers or an assistant configuring a separate software
repository from the full catalog. It is not required for conversational setup.

## Requirements

Node.js 22 or newer. Git is optional with `--no-git`; otherwise configure your
Git name and email before creating the new repository. Clients are installed
and authenticated separately. No package installation is required for the kit.

## Generate a project

From the Brainforge root:

```sh
node brainforge.mjs doctor
node brainforge.mjs answers --track web-saas --out answers.json
```

Fill the requested facts in `answers.json`. Choose clients in `runtimes`, for
example `["codex"]` or `["codex", "kimi", "gemini"]`. Review real write paths,
verification commands and specialist dependencies.

```sh
node brainforge.mjs create --answers answers.json --target ../my-project --dry-run
node brainforge.mjs create --answers answers.json --target ../my-project
```

The target must be new or empty. `--no-git` skips initial Git history. The
generator creates instructions and agents, not the application. Open the
generated folder in your assistant to build the product.

`answers` writes UTF-8 directly, so Windows shell redirection does not determine
the JSON encoding. Keep project answers and credentials out of the shared kit.

## Tracks and clients

| Track | Starting point |
| --- | --- |
| `web-saas` | Web application with a backend |
| `mobile-expo` | React Native / Expo |
| `godot-game` | Godot |
| `unreal-game` | Unreal |

These tracks do not install frameworks. For another stack, use an appropriate
team and verified commands rather than filling in invented values to pass
validation. `node brainforge.mjs list` shows catalog options.

The Codex generator supports model inheritance or responsibility-based defaults;
see [CODEX.md](CODEX.md). Kimi/Gemini details are in [CLIENTS.md](../agent-kit/CLIENTS.md).
Review [Claude's known issues](CLAUDE-REVIEW.md) before distributing that full
catalog as stable.

## Updating an existing project

The low-level generator accepts `--no-git` for adding missing files without
automatically committing existing work. It preserves existing files by default;
a skipped file may still require a deliberate manual merge.

Do not use `--force` as an update strategy. Project-specific decisions in skills
and roles must survive catalog upgrades. Existing legacy Codex hook shims are
not automatically removed.
