# Codex runtime coordination

This file governs only work performed in Codex. `AGENTS.md`, canon, backlog,
roadmap, recorded decisions, ADRs, and local rules remain shared project sources.
Do not copy them into agent prompts: cite the necessary section and preserve
their precedence, status, and owners.

`RULES.md` indexes rule caches by path. They do not load automatically as Claude
rules: consult only those covering the task's files. Resolve differences against
the shared canonical source cited by the rule; a cache is not another authority.

## Runtime and models

The main agent keeps the model chosen by the user. Do not pin or downgrade it
in repository files. This kit's role matrix is `MODELS.md`; unspecified subagents
use `gpt-5.6-terra` with `medium`. The generator creates a project-specific matrix
from role responsibilities, without treating Claude aliases as Codex models.

`MODELS.md` governs only Codex operational routing. It does not change canon,
ownership, risk, QA gates, or human decisions. More expensive models do not expand
authority. Each agent remains limited by its role and declared paths.

Custom agents live in `.codex/agents/*.toml`, using `name`, `description`,
`developer_instructions`, `model`, and `model_reasoning_effort`. Preserve existing
compatible security settings. Clients may apply native configuration; reading
a TOML through a delegation fallback applies neither its model nor its sandbox.
Allow/deny scopes are binding contracts; the coordinator verifies the diff by
path before accepting a handoff.

## Delegation

Use native agents when available. If the client exposes only `collaboration`,
pass `model` and `reasoning_effort` explicitly and use `fork_turns = "none"`
according to the actual tool schema. The fallback does not apply the TOML sandbox:
preserve read-only contracts and state that limitation. Without delegation tools,
work sequentially and do not claim independent review. Supply a self-contained
brief: objective, allowed files, relevant canon/decision, verifiable criteria,
and return format.

Keep at most two subagents active. Delegate independent tasks that can progress
without editing the same artifact, deciding the same contract, or consuming an
unfinished output. Reuse verified facts, search with `rg`, and read bounded
sections. Do not preload the entire team, full documents, or session history.

Each return should use 150–300 tokens: result, files, evidence, risks/blockers,
and next owner. The coordinator verifies evidence, routes fixes to the file
owner, and preserves project QA gates.

Native readers/reviewers declare `sandbox_mode = "read-only"`. This is not an
allowlist for external tools or a guarantee against session permission overrides.
Model and effort availability depend on the account. Do not assume a price or
savings per task; measure the outcome. Money, security, PII, and migration risks
require reconsidering effort and review even for ordinary execution roles.

## Compatibility

Historical Claude hook, model, and tool references in documents, skills, or
prompts are not Codex commands. Do not execute, copy, or rename Claude hooks or
change their configuration. `CLAUDE.md`, `.claude/**`, and this kit's `agents/`,
`hooks/`, `skills/`, and legacy templates belong to the Claude runtime.

Adapt tool names only in active Codex instructions. Preserve domain rules, canon,
ownership, QA, risk classes, external approvals, and CI invariants. Current user
authorization takes precedence over inherited conventions; do not ask again
about decisions already settled. Project configuration may depend on client
trust. Do not change trust, permissions, sandbox, or approvals as part of an
adapter change.

Do not infer authorization for new hooks, global events, commits, deployments,
or external changes. Follow current user authorization and project rules.

The current bootstrap generates `AGENTS.md`, `.codex/config.toml`, TOML agents,
`.agents/skills`, and shared `.brainforge/` knowledge. It does not install Claude
hook shims. Shared `SCOPES.json` is declarative, not technical per-path write
enforcement. Older projects need a reviewed migration; the generator does not
automatically remove existing hooks.

Verified on 2026-09-17: [subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents),
[configuration](https://learn.chatgpt.com/docs/config-file/config-reference), and
[skills](https://learn.chatgpt.com/docs/build-skills).
