# Brainforge workspace

When the user says `start`, invokes the start skill, or asks to set up Brainforge,
read `onboarding/SETUP.md`. The older setup skill remains a compatibility alias.
An ordinary first product request is also sufficient: if no workspace context
exists, begin setup using the goal already supplied. `start` is optional.
Do not start a customer interview when the user is maintaining Brainforge itself.
Ask about the user's
goal and do the configuration yourself; do not ask a nontechnical user to fill
JSON, choose a software stack or run Node commands.

For ongoing work, read `workspace/context.md`, `workspace/preferences.md`,
`workspace/team.md` and `workspace/next.md` when present. Resume the task rather
than repeating the interview. Follow `onboarding/WORKFLOW.md` and read selected
catalog procedures on demand.
Repository paths and shipped texts are English; use the user's language in
conversation and the requested language for deliverables.

Setup uses the client's file tools. It does not require Node, npm or Git
identity, or terminal commands from the user. The advanced software generator
is optional and separate.
Native profiles and client permissions are distinct from advisory roles.
Never claim a subagent, test, connector or security control ran unless verified.

Preserve existing files and current user authorization. Do not commit personal
workspace data, publish outputs or change global settings merely because a
template suggests it. Workspace files are local and ignored by Git.

For work on Brainforge itself, consult CONTRIBUTING.md and the more specific
instructions in agent-kit/. Validate installer/adapter changes with npm test.
The advanced Claude catalog has known issues in docs/CLAUDE-REVIEW.md.
Keep required license notices with distributed material.
