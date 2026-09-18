# Brainforge Kit

Tell your AI assistant what you want to achieve. Brainforge helps it remember
your context, organize the work and take the next useful step with you.

For business owners, creators and people building software. You do not need to
know how agents, models or configuration files work to get started.

## Start with a conversation

1. Get the folder: click **Code → Download ZIP** here, then unzip it.
   If you use Git, you can clone the repository instead.
2. Open that folder in Claude Code, Codex, Kimi Code or Gemini CLI.
3. Type **start**.

You can also use your assistant's shortcut:

| Assistant | Start setup |
| --- | --- |
| Claude Code | `/start` |
| Codex desktop | Type `/start` and select the start skill; `$start` also works |
| Codex CLI | `$start`, or select start from `/skills` |
| Kimi Code | `/skill:start` |
| Gemini CLI | `/start` |

The word **start**, without a slash, is the common entry across supported
clients. Slash syntax belongs to each client; Brainforge cannot register a
bare `/start` in clients that do not support custom slash names. The assistant
detects its environment from the active session and follows one shared workflow.
Older setup shortcuts remain supported.

Brainforge asks a few plain questions, one at a time. It learns your goal,
who the work is for and what would help first. It saves that context, prepares
a small working team and starts the first task when it has enough information.

The questions cover your goal, audience, first useful result, existing material
and constraints. It skips what you already told it. If you have used the
workspace before, start resumes the saved task instead of interviewing you again.

**No JSON to fill out. No Node or npm installation for conversational setup.**
You need an installed, signed-in assistant with access to local files.
If a shortcut does not appear in your client version, the plain request above
works through the root instructions; you can also ask it to read
`onboarding/SETUP.md`.

To get the folder through your assistant, you can say:

> Clone https://github.com/JoaoAlrc/brainforge-kit into a new folder, open it, and
> help me set it up. Ask about what I want to achieve before configuring anything.

The repository is currently private; cloning requires access from its owner.

## What happens next

Say what you need in normal language. For example:

- "Help me plan next week's content for my business."
- "Turn this idea into a clear first version of a product."
- "Help me understand and fix this problem in my app."
- "Pick up where we stopped."

The assistant reads your saved context and uses only the relevant procedures.
The initial team has coordination, creation and review responsibilities.
Native delegation depends on your client; when it is unavailable, the
assistant works sequentially and tells you when a separate review is still
needed. New agent profiles may require a project reload, but that does not
block the first task.

For software, describe the experience you want. Brainforge asks relevant product
questions, chooses a suitable architecture and prepares only the specialists
needed for the next task. You do not need to select frameworks or databases.
A menu website may need no backend; a driving game needs decisions about the
camera, interaction and target device before an engine is selected.

The shared [solution-design procedure](onboarding/skills/solution-design/SKILL.md)
uses current documentation when available and records reasons and uncertainties.
The [specialist index](onboarding/SPECIALISTS.md) includes eight software packs
for web interfaces, Node, Supabase, C#/.NET, Unity, Godot, Unreal and mobile work,
plus eight marketing, release and customer-learning packs. Three shared
procedures coordinate solution design, product delivery and missing capabilities.
These are assistant-executed procedures, not an autonomous routing service or
a guarantee of the best technology.
Existing project choices take precedence over starting templates.

For an end-to-end request, Brainforge keeps a delivery record through design,
implementation, verification, release, marketing and operation. Marketing covers
research, positioning, copy, creative production, content/SEO, paid-campaign
preparation and performance analysis. It loads only the current task's procedures.

If a task needs an absent skill, the assistant can research, create and trial a
scoped local procedure and specialist. Missing tools, account access and input
data are recorded separately. Creating a skill does not connect an ad account,
generate a video or deploy an application by itself. See the
[delivery workflow](onboarding/skills/product-lifecycle/SKILL.md).

Repository files and folder names are English. The assistant speaks your
language and creates deliverables in the language you request.

## Your workspace

Your context and outputs live in `workspace/`:

| File | What it remembers |
| --- | --- |
| `context.md` | Your goal, audience and current situation |
| `preferences.md` | How you want to work, language and optional brand references |
| `team.md` | Who does what and how the result will be checked |
| `next.md` | The current task and what comes next |
| `output/` | Your deliverables |

This folder stays local and is ignored by Git. Setup resumes existing context
instead of resetting it. It does not publish your work or connect external
accounts automatically.

## For larger software projects

The advanced kit contains **40 catalog roles, 22 catalog skills and four
starting tracks** for web, mobile, Godot and Unreal projects. It can generate
client-specific profiles and project contracts when you need them.

That optional developer workflow requires Node 22+. It is separate from the
conversational start. See [advanced setup](docs/ADVANCED.md),
[Codex](docs/CODEX.md) and [Kimi/Gemini](agent-kit/CLIENTS.md).

## Current limits

This is a technical preview. General writing, planning and analysis use your
assistant's existing capabilities. Specialized publishing, ads and analytics
integrations are not bundled or activated by setup. Marketing procedures are
bundled; execution depends on the active client's tools and authorized access.
Drafts, generated assets, verified releases and live campaigns have distinct
statuses. The shared workflow is the full entrypoint; copying only the older
standalone business folder does not include these new procedures.

The full Claude software catalog has a separate
[runtime review and maintainer follow-up](docs/CLAUDE-REVIEW.md). The small starter
team does not install those hooks. This workflow update does not re-audit that
runtime. Gemini support has not been tested in a live
client. A role description is not a security boundary.

See the [audit](docs/AUDIT.md) for evidence and limitations. We do not claim
measured cost savings or better results than other tools without benchmarks.

## Contribute

See [CONTRIBUTING](CONTRIBUTING.md). Developers can run `npm test`; ordinary
users do not need to run the test suite to start a conversation.

[MIT license](LICENSE) · [Third-party notices](THIRD_PARTY_NOTICES.md)

## Independent kit

This repository contains no Brainforge application code or installers. It includes
general content, marketing, software and design procedures. Ready-made sector
products and carousel asset collections are separate optional packs.
See [model policy](docs/MODEL-POLICY.md) and [distribution](docs/DISTRIBUTION.md).
