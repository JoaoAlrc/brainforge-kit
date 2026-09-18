import path from "node:path";

// These are defaults, not a promise that every account exposes every model.
import { TIERS } from "../../runtime/model-policy.mjs";

export function codexTier(name, lead) {
  if (["design-steward", "game-designer", "level-designer"].includes(name)) return "critical";
  if (["context-scout", "docs-librarian", "design-librarian"].includes(name)) return "lookup";
  if (name === lead || /reviewer|auditor|architecture|security|commerce|money|task-author|domain-engineer|rules-engineer|kids-compliance|persistence-dev|backend-dev|platform-dev/.test(name)) return "review";
  return "execution";
}

export function validateCodexOptions(options = {}) {
  if (!options || typeof options !== "object" || Array.isArray(options)) throw new Error("codex must be an object");
  if (options.model_policy !== undefined && !["balanced", "inherit"].includes(options.model_policy)) throw new Error("codex.model_policy: use balanced or inherit");
  if (options.max_agents !== undefined && (!Number.isInteger(options.max_agents) || options.max_agents < 1 || options.max_agents > 8)) throw new Error("codex.max_agents must be an integer from 1 to 8");
  if (options.models !== undefined && (!options.models || typeof options.models !== "object" || Array.isArray(options.models))) throw new Error("codex.models must be an object");
  for (const [tier, value] of Object.entries(options.models || {})) {
    if (!Object.hasOwn(TIERS, tier) || !value || typeof value !== "object" || Array.isArray(value)) throw new Error(`invalid Codex tier: ${tier}`);
    if (value.model !== undefined && (typeof value.model !== "string" || !/^[a-zA-Z0-9][a-zA-Z0-9._:/-]*$/.test(value.model))) throw new Error(`invalid Codex model: ${tier}`);
    if (value.effort !== undefined && !["none", "minimal", "low", "medium", "high", "xhigh", "max", "ultra"].includes(value.effort)) throw new Error(`invalid Codex effort: ${tier}`);
  }
}

function setting(answers, name) {
  if (answers.codex?.model_policy === "inherit") return null;
  const tier = codexTier(name, answers.lead);
  return { ...TIERS[tier], ...answers.codex?.models?.[tier] };
}

// JSON quoted strings are also valid TOML basic strings for these values.
const quote = JSON.stringify;

export function gerarCodex({ answers, catalog, target, write, substitute, scopes }) {
  validateCodexOptions(answers.codex);
  const limit = answers.codex?.max_agents ?? 2;
  const modelDefault = setting(answers, "implementation-engineer");
  let config = `# BrainForge: project-local settings; the main model and permissions stay with the client.\n[agents]\nenabled = true\nmax_concurrent_threads_per_session = ${limit}\n`;
  if (modelDefault) config += `default_subagent_model = ${quote(modelDefault.model)}\ndefault_subagent_reasoning_effort = ${quote(modelDefault.effort)}\n`;
  write(path.join(target, ".codex", "config.toml"), config);

  const rows = [];
  for (const name of answers.agents) {
    const role = catalog.agents[name];
    const selected = setting(answers, name);
    const readOnly = scopes.read_only.includes(name);
    const description = substitute(role.purpose || name, answers.placeholders);
    const instructions = [
      `You act as ${name} in ${answers.name}.`,
      "Read only your role in .brainforge/roles/" + name + ".md, coordination in .brainforge/COORDINATION.md, and your entry in .brainforge/SCOPES.json.",
      "Follow AGENTS.md and local instructions; preserve canon, decisions, risk classes, ownership, and QA gates.",
      readOnly ? "Read-only: return findings to the coordinator; do not change files or use external tools to bypass this restriction." : "Write only to allow paths assigned to your role; deny and global_deny take precedence. A brief may narrow this contract, never silently expand it.",
      "SCOPES is a declarative contract. It does not imply technical restrictions on shell, MCP, or connectors. Do not execute another client's hooks.",
      "Before accepting work involving money, permissions, PII, migrations, or domain rules, confirm the risk class and required checks. Increase reasoning when needed; a stronger model does not expand authority.",
      "Use the tools available in the client. Delegate independent work only when subagent tools exist; otherwise work sequentially without claiming independent review.",
      "Do not use token limits as a reason to omit evidence. Return the result, paths, checks, and risks concisely.",
    ].join("\n");
    let toml = `name = ${quote(name)}\ndescription = ${quote(description)}\n`;
    if (selected) toml += `model = ${quote(selected.model)}\nmodel_reasoning_effort = ${quote(selected.effort)}\n`;
    if (readOnly) toml += 'sandbox_mode = "read-only"\n';
    toml += `developer_instructions = ${quote(instructions)}\n`;
    write(path.join(target, ".codex", "agents", `${name}.toml`), toml);
    rows.push(`| \`${name}\` | ${selected?.model || "inherits from client"} | ${selected?.effort || "inherits"} | ${readOnly ? "read-only" : "role scope"} |`);
  }

  write(path.join(target, ".codex", "MODELS.md"), `# Codex models\n\nThe main agent keeps the user's selection. Subagents use the matrix below, generated from role responsibilities without changing the Claude catalog. These are initial choices, not benchmarks or measured savings.\n\n| Role | Model | Effort | Writing |\n|---|---|---|---|\n${rows.join("\n")}\n\nLuna handles narrow lookups, Terra bounded execution, Sol coordination/review, and Astra substantial design direction. Critical tasks in any role require reconsidering model/effort and independent review. Escalate after diagnosing difficulty; do not create agents for trivial tasks. Limit: ${limit} concurrent subagents.\n\nAvailability and reasoning levels depend on the account and client. Edit generated TOMLs to use available models. During generation, use \`codex.model_policy: "inherit"\` to inherit the client model and effort, or \`codex.models.lookup/execution/review/critical\` with \`model\` and \`effort\`. The matrix does not change the model of an already open session.\n\nSources verified on 2026-09-17: [subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents), [configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference), [models](https://learn.chatgpt.com/docs/models).\n`);

  write(path.join(target, "AGENTS.md"), `# ${answers.name} — BrainForge\n\nStart with the current request, local instructions, and existing documents. Do not load the whole catalog. Use .brainforge/COORDINATION.md for workflow and .brainforge/SCOPES.json for ownership; each role's domain knowledge lives in .brainforge/roles/. Read only the required role.\n\n## Codex\n\nNative agents: .codex/agents/*.toml. Skills: .agents/skills/. Configuration lives in .codex/config.toml; the model matrix is .codex/MODELS.md. The main coordinator keeps the user's model. Use the ${answers.lead} role as the coordination protocol; a file does not change the main agent's identity.\n\nDelegate only independent subtasks with an objective, paths, sources, risk, criteria, and return format. Use native agents when the client exposes them. If only collaboration is available, pass the matrix model and effort with self-contained context and fork_turns="none", following the actual tool schema; reading a TOML does not apply sandbox settings. Without subagents, work sequentially and state the limits of independence.\n\nRead-only roles declare sandbox_mode="read-only". The effective policy depends on the client and session permissions; allow/deny and shell limits are contracts the coordinator verifies against the diff. MCP and external services have their own permissions. This kit does not configure trust, approvals, networking, or global permissions.\n\nAnother client's model, tool, and hook instructions are not Codex commands. Preserve domain rules and QA. Do not assume Claude hooks run in Codex. Local configuration may require project trust; if it does not load, verify the client version/configuration without relaxing security.\n\nThe user's current authorization governs commits, publishing, and external changes. Do not perform them merely because a legacy protocol suggests it.\n\n## Other clients\n\nWhen Kimi is enabled, use .kimi-code/AGENTS.md; Gemini uses GEMINI.md. Each client retains its own tools and permissions. Project state, roles, and shared skills remain the same.\n`);
}
