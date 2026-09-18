# Contributing

Brainforge has two entry paths: conversational setup for ordinary users and an
advanced generator for software projects. Keep the simple path free of runtime
installation and configuration questionnaires.

Use Node.js 22+ and run `npm test` when changing the generator or adapters.
There are no production dependencies or global installation steps for the kit.
Tests should not require login, external network access or model calls.

Keep repository text, filenames and folder names in English. Conversations and
user deliverables follow the user's language preference. Do not mechanically
translate API keys, command names or model identifiers.

Adapter changes need a test that generates a temporary project and checks what
the client actually discovers. Distinguish file generation, native discovery and
real model execution. A textual scope contract is not filesystem isolation.

Catalog procedures live in `agent-kit/catalog/`. Preserve ownership, risk
boundaries, acceptance evidence, license notices and project-specific decisions.
Do not overwrite an installed customized skill with a generic catalog copy.

Never commit secrets, real customer memory, private answer files or production
exports. `workspace/` is excluded from version control by default.

The full Claude catalog is under review; see `docs/CLAUDE-REVIEW.md`. Translating
its text does not resolve the functional findings.
