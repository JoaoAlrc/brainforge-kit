# Set up Brainforge

Run this workflow when the user says `start`, asks to set up Brainforge, or
invokes the start or legacy setup entry, or gives a first product goal without
an existing workspace. Reuse that goal; no activation word is required. The result is a usable workspace and
one concrete first deliverable, or a continuation of existing work.
Setup is a conversation, not a request for a configuration file.

## Begin with the user

Reply in the user's language. Repository files, folder names and configuration
keys stay in English; write deliverables in the language the user requests.
Do not ask the user to select a stack, runtime, model, track, JSON schema or
terminal command.

Detect the active client silently from the session's identity, tool metadata
or a client-native command's explicit context. Do not infer it from the model
name or the presence of `.claude`, `.codex`, `.gemini` or `.agents`: this package
ships multiple adapters together. Choose the matching adapter in CLIENT-SETUP.md.
If the host is unknown or unsupported, continue with its available file tools
and the shared workflow, without installing native profiles or pretending to
have recognized the client. Do not make identifying the client a user question.

Use the client's normal file tools, including its usual shell-backed file
access when needed. **Node, npm, Python and Git identity are not prerequisites
for this workflow.** Do not run a dependency check as the first interaction.
Do not ask the user to install a programming runtime or run terminal commands
merely to finish setup.

Locate the repository root using this file and the catalog. If existing
`workspace/context.md` contains real information, read it and
`workspace/next.md`; resume and fill gaps. Never restart the interview or erase
existing context without the user's request.

For a fresh workspace, begin with one simple question unless the answer is
already in the conversation: **"What would you like Brainforge to help you
achieve first?"** Offer examples only if the user is unsure.

Ask one question at a time, in the user's language, skipping known answers.
Use these as conversational prompts, not a mandatory form:

1. What would you like Brainforge to help you achieve first?
2. Who is this for?
3. What useful result would you like us to produce first?
4. What do you already have that we can use?
5. Is there a deadline, budget or other constraint I should respect?

Reuse every answer already given. A name, writing
sample or brand detail is optional unless the first deliverable needs it.
Aim for at most five new questions, fewer when context is sufficient.
Do not force a business profile menu or a technical taxonomy.

## Choose the smallest useful working setup

Infer a business, software or mixed focus from the goal. This choice is an
internal routing decision, not a label the user has to learn. Never imply the
software has been built or integrations connected just because setup is done.

For software, first follow [solution-design/SKILL.md](skills/solution-design/SKILL.md).
Understand the intended experience, choose a justified architecture, and compose
the necessary specialists before selecting a legacy track. Tracks are examples,
not technology defaults. Additional product questions are allowed when they
change the design; ask one at a time and skip known answers. Never ask the user
to choose a framework or declare their development expertise.

For business and marketing, select the relevant procedures from
[SPECIALISTS.md](SPECIALISTS.md). They cover research, messaging, creative
production, content, campaign preparation, measurement and feedback. Read brand
and factual inputs when needed. Use actual available tools; a bundled procedure
is not an installed plugin or an account connection.

For a complete product request, follow
[product lifecycle](skills/product-lifecycle/SKILL.md) through the applicable
stages. If a capability is missing in any domain, follow
[capability expansion](skills/capability-expansion/SKILL.md). Finish the first
useful step and continue authorized work; do not stop at creating profiles.

Create or update these local files with actual facts, using file tools:
- `workspace/context.md`: goal, audience, current situation, first result and
  constraints; at most 60 lines.
- `workspace/preferences.md`: working language, communication preferences,
  examples and optional brand references; at most 40 lines.
- `workspace/team.md`: coordinator, maker and reviewer responsibilities,
  selected catalog paths when useful, allowed work areas and completion checks;
  at most 60 lines. Each added specialist needs a current task.
- `workspace/next.md`: the first task, acceptance criteria, status and any
  genuine blocker; at most 40 lines.

Unknown optional facts stay explicitly unknown. Never insert fake commands,
metrics, audience research or business facts to mark setup complete. Preserve
existing sections when updating. `workspace/` is ignored by Git so personal
context is not accidentally published. Do not commit or push setup data.

## Activate the team in the current client

Read [CLIENT-SETUP.md](CLIENT-SETUP.md) and install only the current client's
small starter team with file tools. This does not require a script or Node.
Do not touch any pre-existing profile/configuration with the same path: reuse
it if it is compatible, otherwise explain the conflict and continue with the
current assistant. Never turn an optional profile conflict into a blocked
interview.

The coordinator remains the assistant the user is already talking to. Native
profiles are available for delegation when the client supports them. If the
client needs a restart to discover a new profile, finish the first task in
the current session; mention the restart only when delegation becomes useful.
If there is no delegation tool, work sequentially and state that an independent
review has not happened. Do not simulate messages from nonexistent agents.

Keep the user's main model. Apply a smaller model to a delegated task only when
the client exposes a compatible model and effort choice. Use stronger reasoning
and appropriate review for money, permissions, sensitive data and domain rules.
Do not configure account access, approval bypasses, trust or global settings.

## Finish by doing something useful

Save the four files and check their actual contents. In a few plain sentences,
state what you understood and what you are doing first. If the first deliverable
is already clear and authorized, produce it now in `workspace/output/` with
the normal client tools. Examples: a draft weekly plan, a response draft,
a project brief, or a scoped implementation step with its checks.

If a missing asset or essential decision prevents that deliverable, ask one
focused question and record the blocker. Do not call a requirements summary a
finished application, an ad plan a running campaign, or an unconnected account
an integration.

After setup, use [WORKFLOW.md](WORKFLOW.md) to select relevant procedures,
execute, verify and save the next step. Ordinary requests should read the
saved context and continue.
Do not make the user run another onboarding command at every session.
