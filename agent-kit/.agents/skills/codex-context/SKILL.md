---
name: "codex-context"
description: "Keep Codex context small and faithful to project sources. Use before researching canon, preparing briefs, or delegating work."
---

# Codex context

First read [Codex coordination](../../../.codex/COORDINATION.md). Consult the
[model matrix](../../../.codex/MODELS.md) only when routing an agent.

State lives in the repository. Runtimes share `AGENTS.md`, canon, backlog,
roadmap, decisions, and ADRs; do not create Codex copies. Preserve declared
statuses, precedence, ownership, risk, and QA gates exactly.

## Procedure

1. Reuse facts already in the brief or confirmed during this session.
2. Locate relevant text with `rg` or `rg --files`; read only the necessary section.
3. Cite file/section in the brief. Separate measured facts, documented facts,
   inferences, and unknowns.
4. Report both sources when binding documents disagree. Never silently choose
   a side or turn hypotheses into decisions.
5. Delegate only independent work. Include objective, allowed paths, criteria,
   sources, and return format; do not preload full documents or the entire team.

Subagent returns contain 150–300 tokens: result, files, evidence, risks/blockers,
and next owner. The coordinator validates evidence against the repository.

Old Claude model/tool/hook references do not define Codex behavior. Never run
or rename those hooks. Relevant environment/domain procedures in CLAUDE.md still
apply; preserve them and consult their sources without duplicating canon.
This adaptation changes neither Claude, trust, sandbox, global permissions, nor
approvals. Subsequent actions, including commits/deployments, follow current
user authorization and project rules.

Consult the [rules index](../../../.codex/RULES.md) for path restrictions. Load
only applicable caches and verify their shared canonical source; never assume
`.codex/rules` loads automatically.
