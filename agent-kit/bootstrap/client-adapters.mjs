/** Project-local adapters. File ownership, dry-run and overwrite policy belong to write(). */
import fs from "node:fs";
import path from "node:path";

const PORTABLE_RUNTIMES = new Set(["codex", "kimi", "gemini"]);
const TEXT_EXTENSIONS = new Set([".md", ".txt", ".json", ".yaml", ".yml", ".toml", ".mjs", ".js", ".ts", ".py", ".sh", ".ps1", ".csv"]);

const PORTABLE_PREAMBLE = `## Document runtime

This copy is used by Codex, Kimi Code, and Gemini CLI. The current user
instructions and project domain rules take precedence. Read only the references
you need. Consult .brainforge/COORDINATION.md and .brainforge/SCOPES.json.
For infrastructure paths translated between clients, use SCOPES allow/deny
instead of another runtime's historical exclusions in the body; this does not
change domain boundaries, canon, or QA criteria.
Remaining references to Claude, its models, tools, hooks, events, or settings
describe the source runtime: do not execute, install, or modify them in this
client. Use your actual tools and keep the user's chosen model.
Scopes are declarative contracts; this file does not install path enforcement,
sandbox settings, approvals, or hooks. Do not infer authorization to commit,
push, deploy, or change global settings from a legacy procedure.

`;

function identifier(name, kind) {
  if (typeof name !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
    throw new Error(`invalid ${kind} identifier: ${name}`);
  }
}

function splitFrontmatter(text) {
  const normalized = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  return match ? { header: match[1], body: normalized.slice(match[0].length).trimStart() } : { header: "", body: normalized };
}

function descriptionOf(header, fallback) {
  // The catalog currently uses one-line scalar descriptions. A future YAML
  // block scalar falls back to the catalog's purpose instead of becoming "|".
  const value = header.match(/^description:\s*(.+)$/m)?.[1]?.trim();
  if (!value || /^[>|][-+]?\d?$/.test(value)) return fallback;
  if (value.startsWith('"')) {
    try { return JSON.parse(value); } catch { return fallback; }
  }
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1).replace(/''/g, "'");
  return value;
}

function portablePaths(text) {
  return text
    .replaceAll(".claude/hooks/scopes.json", ".brainforge/SCOPES.json")
    .replaceAll(".claude/skills/", ".agents/skills/")
    .replaceAll(".claude/agents/", ".brainforge/roles/");
}

function coordination(answers) {
  return `# Brainforge — shared coordination

Project: ${answers.name}. Coordinator role: ${answers.lead}.

1. Confirm the task, acceptance criteria, canon, and path ownership before editing.
   Reuse known context; read only the necessary sections.
2. Consult .brainforge/SCOPES.json for ownership, deny, canon, and check_runners.
   This is a declarative contract without automatic path enforcement.
   Client restrictions still apply. Do not change trust, permissions, or sandbox.
3. Read only the required role in .brainforge/roles/<name>.md. Skills live in
   .agents/skills/<name>/SKILL.md and are loaded on demand by the client.
4. Delegate only independent work with an objective, allowed files, verifiable
   criteria, and minimal context. Verify delegation is actually available.
   Without subagents, perform roles sequentially and state when independent
   review is still missing.
5. Before accepting a handoff, check the diff by path and the required evidence.
   Do not confuse file/configuration tests with actual client execution.
6. Preserve human decisions, QA, risk classes, and canon. Current user
   authorization takes precedence over inherited approval conventions.
   Do not infer authorization for commits, pushes, deployments, external
   messages, or global configuration.

## Clients

- Codex: .codex/agents/*.toml; follow .codex/COORDINATION.md when present.
- Kimi Code: .kimi-code/agents/*.md and .kimi-code/AGENTS.md; generated profiles
  use the Kimi Code 0.38.0 format. The kit does not impose a model.
- Gemini CLI: GEMINI.md imports this file; skills use native discovery.
  Roles in .brainforge/roles are references, not registered subagents.
  This adapter does not configure Gemini agents, hooks, or experimental settings.

Catalog bodies preserve domain procedures and may include Claude operational
examples. References to that client's hooks, settings, events, automatic budgets,
models, or tool names are not installation instructions for other clients.
Do not execute .claude commands or claim their hooks protect this session.
Adapt only the operation needed to the client's actual capabilities.
Definitions in .brainforge/roles are advisory Markdown without native frontmatter;
tool/model changes belong in the selected client's native profile.

Available roles: ${answers.agents.join(", ")}.
`;
}

function kimiInstructions() {
  return `# Brainforge — Kimi Code

Read .brainforge/COORDINATION.md before acting and preserve AGENTS.md and more
specific local instructions. Rules under "Codex" or "Claude" headings apply only
to those clients; do not load their profiles/models or run their hooks in Kimi.
Shared skills live in .agents/skills/; use /skill:<name> or client discovery.
Selected agents live in .kimi-code/agents/*.md.
Use profiles only when delegation helps; provide minimal context and scope.
Do not force a model, change permissions, or configure global services. Check
handoff paths against .brainforge/SCOPES.json. Read-only roles have no shell;
the coordinator supplies evidence when they need a diff or test.
`;
}

function kimiProfile(name, entry, answers, description, sourceHeader) {
  const allow = answers.paths?.[name] ?? entry.write ?? [];
  const readOnly = entry.read_only || allow.length === 0;
  const lead = name === answers.lead;
  const sourceAllow = sourceHeader.match(/^tools:\s*(.+)$/m)?.[1];
  const sourceDeny = sourceHeader.match(/^disallowedTools:\s*(.+)$/m)?.[1] || "";
  const listed = (text, tool) => new RegExp(`(?:^|[,\\s])${tool}(?:$|[,\\s(])`).test(text);
  const permits = tool => !listed(sourceDeny, tool) && (!sourceAllow || listed(sourceAllow, tool));
  // Claude's Read includes images; Kimi has a separate documented media tool.
  const tools = ["Read", "ReadMediaFile", "Grep", "Glob", "Skill"]
    .filter(tool => permits(tool === "ReadMediaFile" ? "Read" : tool));
  if (!readOnly) {
    if (permits("Write")) tools.push("Write");
    if (permits("Edit")) tools.push("Edit");
    if (entry.shell && entry.shell !== "none" && permits("Bash")) tools.push("Bash");
  }
  for (const [source, native] of [["WebSearch", "WebSearch"], ["WebFetch", "FetchURL"], ["TodoWrite", "TodoList"], ["AskUserQuestion", "AskUserQuestion"]]) {
    if (sourceAllow && listed(sourceAllow, source) && permits(source)) tools.push(native);
  }
  if (lead && !readOnly && permits("Agent")) tools.push("Agent");
  const subagents = tools.includes("Agent") ? answers.agents.filter(n => n !== name) : [];
  return `---
name: ${JSON.stringify(name)}
description: ${JSON.stringify(description)}
tools: ${JSON.stringify(tools)}
subagents: ${JSON.stringify(subagents)}
---

\${base_prompt}

You act as ${name}. Before acting, read
.brainforge/roles/${name}.md, .brainforge/COORDINATION.md, and only the relevant
scopes in .brainforge/SCOPES.json. This profile's tool allowlist does not restrict
paths; respect declared ownership and check the diff when finishing.
${readOnly ? "This role is read-only; do not change files or execute commands.\n" : "Edit only task files within your declared scope.\n"}
Web and media tools depend on the host/model; if unavailable, state the
limitation and request evidence from the coordinator without inventing research.
When delegated, your final message is the complete handoff to the coordinator:
result, files, evidence, limitations, and next step. Preserve the session model.
`;
}

/**
 * Generate portable knowledge plus the explicitly selected Kimi/Gemini adapter.
 * Codex's caller owns AGENTS.md when enabled and the shared SCOPES.json contract.
 * All outputs are collected before invoking write; malformed sources fail early.
 */
export function gerarOutrosClientes({ kit, answers, catalog, target, write, substitute }) {
  const runtimes = new Set(answers.runtimes || []);
  if (![...runtimes].some(r => PORTABLE_RUNTIMES.has(r))) return;
  const files = new Map();
  const put = (relative, content) => files.set(path.join(target, relative), content);
  const adapt = text => portablePaths(substitute(text, answers.placeholders));

  for (const name of answers.agents) {
    identifier(name, "agent");
    const entry = catalog.agents[name];
    if (!entry) throw new Error(`agent '${name}' missing from catalog`);
    const source = path.join(kit, "catalog", "agents", `${name}.md`);
    const stat = fs.lstatSync(source);
    if (!stat.isFile()) throw new Error(`agent must be a regular file: ${source}`);
    const { header, body } = splitFrontmatter(fs.readFileSync(source, "utf8"));
    const description = adapt(descriptionOf(header, entry.purpose || `Role ${name}`));
    const requiredSkills = (entry.needs_skills || []).join(", ");
    put(`.brainforge/roles/${name}.md`, PORTABLE_PREAMBLE +
      (requiredSkills ? `Skills required by this role: ${requiredSkills}. Read them on demand in .agents/skills/.\n\n` : "") + adapt(body));
    if (runtimes.has("kimi")) put(`.kimi-code/agents/${name}.md`, kimiProfile(name, entry, answers, description, header));
  }

  for (const name of answers.skills) {
    identifier(name, "skill");
    if (!catalog.skills[name]) throw new Error(`skill '${name}' missing from catalog`);
    const source = path.join(kit, "catalog", "skills", name);
    const main = path.join(source, "SKILL.md");
    if (!fs.existsSync(main)) throw new Error(`skill '${name}' has no SKILL.md: ${main}`);
    if (!fs.lstatSync(source).isDirectory()) throw new Error(`skill must be a regular directory: ${source}`);
    const walk = (directory, relative = "") => {
      for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const file = path.join(directory, entry.name);
        const rel = relative ? `${relative}/${entry.name}` : entry.name;
        if (entry.isSymbolicLink()) throw new Error(`non-portable symbolic link in skill: ${file}`);
        if (entry.isDirectory()) { walk(file, rel); continue; }
        if (!entry.isFile()) throw new Error(`skill asset is not a regular file: ${file}`);
        let content = fs.readFileSync(file);
        if (rel === "SKILL.md") {
          const { header, body } = splitFrontmatter(content.toString("utf8"));
          const description = adapt(descriptionOf(header, catalog.skills[name].purpose || `Use the ${name} skill`));
          content = `---\nname: ${JSON.stringify(name)}\ndescription: ${JSON.stringify(description)}\n---\n\n` + PORTABLE_PREAMBLE + adapt(body);
        } else if (TEXT_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
          // Text assets retain their contents and relative reference paths.
          content = substitute(content.toString("utf8"), answers.placeholders);
        }
        put(`.agents/skills/${name}/${rel}`, content);
      }
    };
    walk(source);
  }

  put(".brainforge/COORDINATION.md", coordination(answers));
  if (runtimes.has("kimi")) {
    put(".kimi-code/AGENTS.md", kimiInstructions());
    if (!runtimes.has("codex")) put("AGENTS.md", kimiInstructions());
  }
  if (runtimes.has("gemini")) {
    put("GEMINI.md", `# Brainforge — Gemini CLI\n\n@./.brainforge/COORDINATION.md\n\nAlso respect shared rules in AGENTS.md when present and more specific local\ninstructions. Skills in .agents/skills/ use native discovery; verify with\n/skills list. Roles in .brainforge/roles/*.md are advisory in this adapter.\nKeep the user's chosen models, permissions, and settings.\n`);
  }
  for (const [file, content] of files) write(file, content);
}
