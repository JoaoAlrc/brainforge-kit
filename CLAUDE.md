# Brainforge workspace

When the user says `start`, invokes `/start`, or asks to set up Brainforge, use
the start skill or read
`onboarding/SETUP.md`. Start with their goal, not a technical checklist.
The older `/setup` entry remains supported.

For ongoing work, read `workspace/context.md`, `workspace/preferences.md`,
`workspace/team.md` and `workspace/next.md` when they exist. Follow
`onboarding/WORKFLOW.md` and read only the catalog procedures relevant to the
task. Use native file tools; conversational
setup does not require Node, Git identity or terminal commands from the user.

Preserve existing user data. Keep repository paths in English and converse in
the user's language. Never imply a connector, hook or agent ran unless it did.
Follow current user authorization for external actions.

If the task is maintaining Brainforge itself, use the README, CONTRIBUTING.md
and the more specific instructions in agent-kit/. The known Claude catalog
issues are documented in docs/CLAUDE-REVIEW.md; the small onboarding profiles
do not install that catalog's hooks or restricted coordinator allowlist.
