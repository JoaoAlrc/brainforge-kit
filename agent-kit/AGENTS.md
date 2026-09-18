<!-- CODEX-RUNTIME:BEGIN -->
## Using Codex

Codex uses `AGENTS.md` together with canon, backlog, roadmap, ADRs, and more
specific local instructions. For coordination and delegation, read
[`.codex/COORDINATION.md`](.codex/COORDINATION.md); for role models, read
[`.codex/MODELS.md`](.codex/MODELS.md). The model matrix governs only Codex
operations and never changes authority, ownership, risk, or canon.

Custom agents live in `.codex/agents/*.toml`; Codex skills live in `.agents/skills/`.
For Codex, this block supersedes legacy operational instructions giving precedence
to Claude. Historical references to its tools, models, hooks, or paths are not
Codex commands. `CLAUDE.md` and `.claude/**` belong to the Claude runtime. Relevant
environment/domain procedures documented there remain valid; read only the
necessary section.

Preserve all domain rules, path owners, QA gates, risk classes, external approvals,
CI invariants, and recorded decisions. Reuse known facts and read only necessary
sections; do not load all documents or the whole team by default.

Reading a TOML through a fallback applies neither its model nor sandbox; the
client must load native configuration. Before accepting delegated work, the
coordinator checks modified paths and required evidence. Current user
authorization takes precedence over inherited conventions. Do not change trust,
permissions, or global configuration during adaptation. Do not import Claude
hooks or infer authorization for hooks, global events, commits, or deployments.
<!-- CODEX-RUNTIME:END -->

# agent-kit — repository guidance

Start with the README and existing documents. Verify the actual stack, commands,
and local rules on disk before changing files.
