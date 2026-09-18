#!/usr/bin/env node
/**
 * Generate project-local clients from catalog/catalog.json.
 * The catalog supplies tracks, roles, skill dependencies, and default scopes.
 * Existing files are preserved unless --force is explicitly supplied.
 *
 * node bootstrap/new-project.mjs --list
 * node bootstrap/new-project.mjs --track web-saas --print-answers
 * node bootstrap/new-project.mjs --answers answers.json --target ../my-project
 * node bootstrap/new-project.mjs --answers answers.json --target ../x --dry-run
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { gerarCodex, validateCodexOptions } from "./codex-adapter.mjs";
import { gerarOutrosClientes } from "./client-adapters.mjs";

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CATALOGO = path.join(KIT, "catalog", "catalog.json");

function lerJson(p) {
  let txt;
  try { txt = fs.readFileSync(p, "utf8"); }
  catch { console.error(`could not read ${p}`); process.exit(2); }
  try { return JSON.parse(txt); }
  catch (e) { console.error(`${p} is not valid JSON: ${e.message}`); process.exit(2); }
}

function args(argv) {
  const o = { target: "", answers: "", track: "", dryRun: false, list: false, printAnswers: false, force: false, noGit: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (["--target", "--answers", "--track"].includes(a)) {
      const value = argv[++i];
      if (!value || value.startsWith("--")) throw new Error(`missing value for ${a}`);
      o[a.slice(2)] = value;
    }
    else if (a === "--dry-run") o.dryRun = true;
    else if (a === "--list") o.list = true;
    else if (a === "--print-answers") o.printAnswers = true;
    else if (a === "--force") o.force = true;
    else if (a === "--no-git") o.noGit = true;
    else throw new Error(`unknown option: ${a}`);
  }
  return o;
}

// --- catalog ---------------------------------------------------------------

function listar(cat) {
  console.log("TRACKS");
  for (const [t, d] of Object.entries(cat.tracks)) {
    // Use the same core/track union as the answer template so --list matches generation.
    const agentesTotais = [...new Set([...(cat.core?.agents || []), ...(d.agents || [])])];
    const skillsTotais = [...new Set([...(cat.core?.skills || []), ...(d.skills || [])])];
    console.log(`  ${t.padEnd(16)} ${d.why || ""}`);
    console.log(`  ${"".padEnd(16)} agents: ${agentesTotais.join(", ")}`);
    console.log(`  ${"".padEnd(16)} skills:  ${skillsTotais.join(", ")}`);
    if (d.check_runners?.length) console.log(`  ${"".padEnd(16)} checks:  ${d.check_runners.join(" · ")}`);
    // Show optional conditions so the interview can select justified specialists.
    for (const [cond, nomes] of Object.entries(d.condicionais || {})) {
      console.log(`  ${"".padEnd(16) } if ${cond}: +${nomes.join(", ")}`);
    }
  }
  if (cat.core?.opcionais) {
    console.log("\nOPTIONAL CORE (available to any project when justified)");
    for (const [n, por] of Object.entries(cat.core.opcionais)) console.log(`  ${n.padEnd(20)} ${por}`);
  }
  console.log("\nAGENTS");
  for (const [n, d] of Object.entries(cat.agents)) {
    const tr = (d.tracks || []).join("/");
    console.log(`  ${n.padEnd(26)} ${String(d.model || "").padEnd(7)} ${tr.padEnd(22)} ${d.purpose || ""}`);
  }
  console.log("\nSKILLS");
  for (const [n, d] of Object.entries(cat.skills)) {
    const tr = (d.tracks || []).join("/");
    console.log(`  ${n.padEnd(26)} ${tr.padEnd(30)} ${d.purpose || ""}`);
  }
}

/** Load optional defaults; missing defaults simply leave more interview questions. */
function carregarDefaults() {
  const p = path.join(KIT, "catalog", "placeholder-defaults.json");
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return { generic: {} }; }
}

function respostasModelo(cat, track) {
  const t = cat.tracks[track];
  if (!t) {
    console.error(`unknown track: ${track}. Known tracks: ${Object.keys(cat.tracks).join(", ")}`);
    process.exit(2);
  }
  // Merge shared core entries here rather than duplicating them in every track.
  const agentes = [...new Set([...(cat.core?.agents || []), ...(t.agents || [])])];
  const skills = new Set([...(cat.core?.skills || []), ...(t.skills || [])]);
  for (const a of agentes) for (const s of cat.agents[a]?.needs_skills || []) skills.add(s);
  const ph = new Set();
  for (const a of agentes) for (const p of cat.agents[a]?.placeholders || []) ph.add(p);
  for (const s of skills) for (const p of cat.skills[s]?.placeholders || []) ph.add(p);
  // Track commands, denied paths, and canon can also require placeholders.
  for (const p of JSON.stringify(t).match(/<[A-Z][A-Z0-9_]+>/g) || []) ph.add(p.slice(1, -1));

  // Only values without defaults become interview questions.
  const defaults = carregarDefaults();
  const porTrilha = defaults[`track:${track}`] || {};
  const dinheiro = defaults.money_track_extra || {};
  const placeholders = {};
  for (const p of [...ph].sort()) {
    placeholders[p] = porTrilha[p] ?? defaults.generic?.[p] ?? dinheiro[p] ?? `<FILL:${p}>`;
  }
  return {
    name: "<FILL:repository-name>",
    track,
    lead: t.lead || "scrum-master",
    language: "en",
    runtimes: ["claude", "codex"],
    codex: { model_policy: "balanced", max_agents: 2 },
    agents: agentes,
    skills: [...skills].sort(),
    placeholders,
    check_runners: t.check_runners || [],
    global_deny: t.global_deny || [],
    canon: t.canon || null,
    paths: {},
    lead_extra_allow: [],
  };
}

// --- writing ---------------------------------------------------------------

const feitos = [];
const pulados = [];

function escrever(destino, conteudo, dry, force) {
  if (fs.existsSync(destino) && !force) { pulados.push(path.relative(process.cwd(), destino)); return false; }
  if (!dry) {
    fs.mkdirSync(path.dirname(destino), { recursive: true });
    fs.writeFileSync(destino, conteudo);
  }
  feitos.push(path.relative(process.cwd(), destino));
  return true;
}

function substituir(txt, placeholders) {
  let out = txt;
  for (const [k, v] of Object.entries(placeholders || {})) out = out.split(`<${k}>`).join(v);
  return out;
}

function pendentes(txt) {
  return [...new Set(txt.match(/<(?:FILL|PREENCHER):[^>]+>/g) || [])];
}

// --- generated scopes.json -------------------------------------------------

function montarScopes(cat, r) {
  const write = {};
  const shell = {};
  const readOnly = [];
  for (const nome of r.agents) {
    const d = cat.agents[nome];
    if (!d) throw new Error(`agent '${nome}' is missing from the catalog`);
    const allow = r.paths?.[nome] ?? d.write ?? [];
    if (d.read_only || allow.length === 0) readOnly.push(nome);
    else {
      write[nome] = { allow: allow.map((p) => substituir(p, r.placeholders)), why: d.why || d.purpose || "" };
      if (d.deny?.length) write[nome].deny = d.deny.map((p) => substituir(p, r.placeholders));
    }
    shell[nome] = { tier: d.shell || "none" };
  }
  // Workflow-created agents need an explicit identity in the fail-closed scope map.
  if (!shell["workflow-subagent"]) {
    write["workflow-subagent"] = { allow: ["work/probes/", "work/qa/"], why: "disposable workspace for Workflow-created agents" };
    shell["workflow-subagent"] = { tier: "check-runner" };
  }
  const s = {
    $comment: "GENERATED by agent-kit/bootstrap/new-project.mjs from catalog/catalog.json. Editing this file after bootstrap is expected; the generator does not run again. Validate: node .claude/hooks/scope-guard.mjs --check",
    version: 1,
    project: r.name,
    lead: r.lead,
    global_deny: { prefixes: (r.global_deny || []).map((p) => substituir(p, r.placeholders)), exact: [], why: "generated files, lockfiles, and tool configuration: do not edit manually" },
    gates: [],
    read_only: readOnly.sort(),
    write,
    shell,
    check_runners: (r.check_runners || []).map((c) => substituir(c, r.placeholders)),
    lead_extra_allow: r.lead_extra_allow || [],
    options: { dev_git_write: false, dev_dep_install: false, lead_dep_install: false, lead_rebase: false },
  };
  if (r.canon) s.canon = r.canon;
  return s;
}

// --- shared contracts; these are not hooks or sandbox enforcement ------------

function sharedScopes(cat, r) {
  const scopes = montarScopes(cat, r);
  scopes.$comment = "Declarative BrainForge contract. Codex/Kimi/Gemini do not execute the Claude hook; ownership and shell tiers require coordinator verification. Effective sandbox and permissions belong to the client.";
  const runtimePaths = [".brainforge/", ".agents/"];
  if (r.runtimes.includes("codex")) runtimePaths.push(".codex/");
  if (r.runtimes.includes("kimi")) runtimePaths.push(".kimi-code/");
  if (r.runtimes.includes("gemini")) runtimePaths.push(".gemini/", "GEMINI.md");
  if (r.runtimes.includes("claude")) runtimePaths.push(".claude/", "CLAUDE.md");
  const mapPath = (p) => {
    if (p === ".claude/") return runtimePaths;
    if (p === "CLAUDE.md") return ["AGENTS.md", ...(r.runtimes.includes("claude") ? [p] : [])];
    if (p.startsWith(".claude/skills/")) return [p.replace(".claude/skills/", ".agents/skills/")];
    if (p.startsWith(".claude/agents/")) return [p.replace(".claude/agents/", ".brainforge/roles/")];
    if (p === ".claude/hooks/" || p === ".claude/hooks/scopes.json") return [".brainforge/SCOPES.json"];
    return [p];
  };
  const mapPaths = (values) => [...new Set((values || []).flatMap(p => mapPath(substituir(p, r.placeholders))))];
  for (const [name, role] of Object.entries(scopes.write)) {
    const ownsPortableSkill = role.allow.some(p => p.startsWith(".claude/skills/"));
    role.allow = mapPaths(role.allow);
    // The source art role owns one Claude skill but denies the old Codex copy.
    // Once that same skill moves to .agents, its old blanket exclusion conflicts.
    // Keep all other paths closed by the narrow allow list and the remaining deny.
    if (role.deny) role.deny = mapPaths(role.deny.filter(p => !(ownsPortableSkill && p === ".agents/")));
    if (ownsPortableSkill) role.why += " Skill scope translated to .agents; the role owns only explicitly allowed skills.";
  }
  scopes.global_deny.prefixes = mapPaths(scopes.global_deny.prefixes);
  scopes.global_deny.exact = mapPaths(scopes.global_deny.exact);
  scopes.lead_extra_allow = mapPaths(scopes.lead_extra_allow);
  if (scopes.canon) scopes.canon = { ...scopes.canon, prefixes: mapPaths(scopes.canon.prefixes) };
  for (const gate of scopes.gates) gate.prefixes = mapPaths(gate.prefixes);
  return scopes;
}

function validateAnswers(r, cat) {
  if (!r || typeof r !== "object" || Array.isArray(r)) throw new Error("answers must be a JSON object");
  if (typeof r.name !== "string" || !r.name.trim() || /[\r\n\x00-\x1f]/.test(r.name)) throw new Error("name must be a single-line project name");
  if (!Object.hasOwn(cat.tracks, r.track)) throw new Error(`unknown track: ${r.track}`);
  r.runtimes ??= ["claude", "codex"];
  if (!Array.isArray(r.runtimes) || !r.runtimes.length || r.runtimes.some(x => !["claude", "codex", "kimi", "gemini"].includes(x))) throw new Error("runtimes: select claude, codex, kimi, and/or gemini");
  r.runtimes = [...new Set(r.runtimes)];
  for (const kind of ["agents", "skills"]) {
    if (!Array.isArray(r[kind])) throw new Error(`${kind} must be a list`);
    for (const name of r[kind]) {
      if (typeof name !== "string" || !/^[a-z0-9][a-z0-9-]*$/.test(name) || !Object.hasOwn(cat[kind], name)) throw new Error(`${kind}: unknown or unsafe item: ${name}`);
      const file = kind === "agents" ? path.join(KIT, "catalog", kind, `${name}.md`) : path.join(KIT, "catalog", kind, name, "SKILL.md");
      if (!fs.existsSync(file)) throw new Error(`missing catalog file: ${file}`);
    }
    r[kind] = [...new Set(r[kind])];
  }
  if (!r.agents.includes(r.lead)) throw new Error("lead must be listed in agents");
  // An added specialist must bring its required skills, even after the interview.
  for (const name of r.agents) for (const skill of cat.agents[name].needs_skills || []) {
    if (!Object.hasOwn(cat.skills, skill) || !fs.existsSync(path.join(KIT, "catalog", "skills", skill, "SKILL.md"))) throw new Error(`missing required skill: ${skill}`);
    if (!r.skills.includes(skill)) r.skills.push(skill);
  }
  if (!r.placeholders || typeof r.placeholders !== "object" || Array.isArray(r.placeholders) || Object.values(r.placeholders).some(v => typeof v !== "string")) throw new Error("placeholders must contain strings");

  // DELEGATABLE_AGENTS and QA_AGENT must reflect the FINAL installed team, not
  // a static per-track default. Bug found by an external Claude-runtime audit
  // (2026-09-17): the lead's `Agent(...)` allowlist and the QA routing table
  // both used to fall back to a fixed value (a literal "see scopes.json"
  // sentence, or "qa-web" on every track including ones with no qa-web at
  // all) — meaning the lead could not delegate to its own team, and every
  // non-web track pointed reviewers at an uninstalled agent.
  r.placeholders.DELEGATABLE_AGENTS = r.agents.filter((a) => a !== r.lead).join(", ") || "no specialists installed yet";
  const installedQa = r.agents.find((a) => a.startsWith("qa-"));
  if (!r.placeholders.QA_AGENT || !r.agents.includes(r.placeholders.QA_AGENT)) {
    r.placeholders.QA_AGENT = installedQa || r.agents.find((a) => a === "code-reviewer") || "no QA agent installed — add one before delegating";
  }

  const defaults = carregarDefaults();
  const required = new Set();
  for (const kind of ["agents", "skills"]) for (const name of r[kind]) for (const key of cat[kind][name].placeholders || []) required.add(key);
  for (const value of JSON.stringify({ track: cat.tracks[r.track], paths: r.paths, canon: r.canon, check_runners: r.check_runners, global_deny: r.global_deny }).match(/<[A-Z][A-Z0-9_]+>/g) || []) required.add(value.slice(1, -1));
  const missing = [];
  for (const key of required) {
    r.placeholders[key] ??= defaults[`track:${r.track}`]?.[key] ?? defaults.generic?.[key] ?? defaults.money_track_extra?.[key];
    if (typeof r.placeholders[key] !== "string" || !r.placeholders[key].trim() || /<(?:FILL|PREENCHER):|<[A-Z][A-Z0-9_]+>/.test(r.placeholders[key])) missing.push(key);
  }
  if (missing.length) throw new Error(`required placeholders are missing or incomplete; nothing was written: ${missing.join(", ")}`);
  validateCodexOptions(r.codex);
  for (const values of [r.check_runners || [], r.global_deny || [], r.lead_extra_allow || [], ...Object.values(r.paths || {})]) {
    if (!Array.isArray(values) || values.some(v => typeof v !== "string")) throw new Error("paths, check_runners, and scope lists must contain strings");
  }
}

// --- main -------------------------------------------------------------------

function main() {
  const o = args(process.argv.slice(2));
  const cat = lerJson(CATALOGO);
  if (o.list) return listar(cat);
  if (o.printAnswers) return console.log(JSON.stringify(respostasModelo(cat, o.track), null, 2));
  if (!o.answers || !o.target) {
    console.error("usage: --list | --track <t> --print-answers | --answers <f.json> --target <dir> [--dry-run] [--force] [--no-git]");
    process.exit(2);
  }

  const r = lerJson(path.resolve(o.answers));
  validateAnswers(r, cat);
  const alvo = path.resolve(o.target);
  const dry = o.dryRun;

  const faltando = pendentes(JSON.stringify(r));
  if (faltando.length) {
    console.error(`incomplete answers; nothing was written. Fill in: ${faltando.join(", ")}`);
    process.exit(2);
  }
  if (r.runtimes.includes("claude") && fs.existsSync(path.join(alvo, ".claude")) && !o.force) {
    console.error(`${alvo} already has .claude/. This script creates new projects; use agent-forge to evolve an existing project. (--force overrides)`);
    process.exit(2);
  }

  if (fs.existsSync(alvo) && !fs.statSync(alvo).isDirectory()) throw new Error("target must be a directory");
  if (!o.noGit && fs.existsSync(alvo) && fs.readdirSync(alvo).length > 0) throw new Error("destination is not empty: use --no-git to add files without committing existing work");
  const branch = r.placeholders.DEFAULT_BRANCH || "main";
  if (!dry && !o.noGit) {
    try {
      execFileSync("git", ["check-ref-format", "--branch", branch], { stdio: "ignore" });
      execFileSync("git", ["var", "GIT_AUTHOR_IDENT"], { stdio: "ignore" });
      execFileSync("git", ["var", "GIT_COMMITTER_IDENT"], { stdio: "ignore" });
    } catch {
      throw new Error("Git/identity/branch unavailable. Configure Git name/email and a valid DEFAULT_BRANCH, or use --no-git. Nothing was written.");
    }
  }
  const write = (dest, content) => escrever(dest, content, dry, o.force);

  if (r.runtimes.includes("claude")) {

  // Hook implementations.
  for (const h of ["scope-guard.mjs", "context-budget.mjs", "token-audit.mjs", "check-runtime-drift.mjs"]) {
    const src = path.join(KIT, "hooks", h);
    if (fs.existsSync(src)) escrever(path.join(alvo, ".claude", "hooks", h), fs.readFileSync(src), dry, o.force);
  }
  escrever(path.join(alvo, ".claude", "hooks", "context-budget.json"),
    fs.readFileSync(path.join(KIT, "templates", "context-budget.json")), dry, o.force);

  // Agents.
  for (const nome of r.agents) {
    const src = path.join(KIT, "catalog", "agents", `${nome}.md`);
    if (!fs.existsSync(src)) { console.error(`WARNING: agent '${nome}' missing from catalog; skipping`); continue; }
    escrever(path.join(alvo, ".claude", "agents", `${nome}.md`), substituir(fs.readFileSync(src, "utf8"), r.placeholders), dry, o.force);
  }

  // Skills: the complete SKILL.md and references tree.
  for (const nome of r.skills) {
    const dir = path.join(KIT, "catalog", "skills", nome);
    if (!fs.existsSync(dir)) { console.error(`WARNING: skill '${nome}' missing from catalog; skipping`); continue; }
    const andar = (d, rel) => {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const abs = path.join(d, e.name);
        const r2 = rel ? path.join(rel, e.name) : e.name;
        if (e.isDirectory()) andar(abs, r2);
        else escrever(path.join(alvo, ".claude", "skills", nome, r2), substituir(fs.readFileSync(abs, "utf8"), r.placeholders), dry, o.force);
      }
    };
    andar(dir, "");
  }

  // scopes + settings
  escrever(path.join(alvo, ".claude", "hooks", "scopes.json"), JSON.stringify(montarScopes(cat, r), null, 2) + "\n", dry, o.force);
  const settings = lerJson(path.join(KIT, "templates", "settings.hooks.json"));
  settings.agent = r.lead;
  escrever(path.join(alvo, ".claude", "settings.json"), JSON.stringify(settings, null, 2) + "\n", dry, o.force);
  }

  // Portable clients.
  if (r.runtimes.some(x => x !== "claude")) {
    const scopes = sharedScopes(cat, r);
    write(path.join(alvo, ".brainforge", "SCOPES.json"), JSON.stringify(scopes, null, 2) + "\n");
    gerarOutrosClientes({ kit: KIT, answers: r, catalog: cat, target: alvo, write, substitute: substituir });
    if (r.runtimes.includes("codex")) gerarCodex({ answers: r, catalog: cat, target: alvo, write, substitute: substituir, scopes });
  }

  for (const file of ["LICENSE", "THIRD_PARTY_NOTICES.md"]) {
    const source = path.join(KIT, "..", file);
    if (fs.existsSync(source)) write(path.join(alvo, ".brainforge", "licenses", file), fs.readFileSync(source));
  }

  // CLAUDE.md — written from the template with the one fact-derived value it
  // has (PROJECT), never left absent. Found by an external audit
  // (2026-09-17): the advanced generator produced projects with no CLAUDE.md
  // at all, leaving a required document as an unannounced manual step. The
  // template's remaining `<lowercase, sentence-style>` sections are authoring
  // instructions, not data fields — filling them from placeholders would mean
  // inventing the product narrative, exactly what this project forbids
  // everywhere else. So: write the file, then say loudly what is still
  // missing, instead of both hiding the gap and fabricating a fix for it.
  const cmSrc = path.join(KIT, "templates", "claude-md.md");
  let claudeMdEscrito = false;
  if (!fs.existsSync(path.join(alvo, "CLAUDE.md")) && fs.existsSync(cmSrc)) {
    escrever(path.join(alvo, "CLAUDE.md"), substituir(fs.readFileSync(cmSrc, "utf8"), r.placeholders), dry, o.force);
    claudeMdEscrito = true;
  }

  // .gitignore
  const gi = path.join(KIT, "templates", "gitignore.append");
  if (fs.existsSync(gi)) {
    const dest = path.join(alvo, ".gitignore");
    const antes = fs.existsSync(dest) ? fs.readFileSync(dest, "utf8") : "";
    const add = fs.readFileSync(gi, "utf8");
    if (!antes.includes(add.split("\n")[0])) escrever(dest, antes + (antes && !antes.endsWith("\n") ? "\n" : "") + add, dry, true);
  }

  // Initialize history for a new empty project; --no-git skips this step.
  let gitFeito = false;
  if (!dry && !o.noGit) {
    try {
      execFileSync("git", ["init", "-q", "--initial-branch", branch], { cwd: alvo, stdio: "ignore" });
      execFileSync("git", ["add", "-A"], { cwd: alvo, stdio: "ignore" });
      execFileSync("git", ["commit", "-q", "-m", `bootstrap: initial scaffold generated by agent-kit (${r.track} track)`], { cwd: alvo, stdio: "ignore" });
      gitFeito = true;
    } catch (e) {
      console.error(`  initial git init/commit FAILED (${e.message.split("\n")[0]}) — run manually: cd ${alvo} && git init && git add -A && git commit -m "bootstrap"`);
      process.exitCode = 1;
    }
  }

  // Report.
  console.log(`${dry ? "[dry-run] " : ""}${feitos.length} file(s) in ${alvo}`);
  if (gitFeito) console.log(`  git: repository initialized and initial commit created`);
  if (pulados.length) {
    console.log(`${pulados.length} skipped because they already exist:`);
    for (const p of pulados.slice(0, 20)) console.log(`  ${p}`);
  }

  if (!dry) {
    const guard = path.join(alvo, ".claude", "hooks", "scope-guard.mjs");
    for (const modo of r.runtimes.includes("claude") ? ["--self-test", "--check"] : []) {
      try {
        const out = execFileSync(process.execPath, [guard, modo], { cwd: alvo, encoding: "utf8" });
        console.log(`  ${modo}: ${out.trim().split("\n").pop()}`);
      } catch (e) {
        console.error(`  ${modo}: FAILED\n${(e.stdout || "") + (e.stderr || "")}`);
        process.exitCode = 1;
      }
    }
    const restam = [];
    const varrer = (d) => {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const a = path.join(d, e.name);
        if (e.isDirectory()) varrer(a);
        else if (/\.(md|json)$/.test(e.name)) {
          const t = fs.readFileSync(a, "utf8");
          // The literal word <PLACEHOLDER> describes the mechanism; it is not an unresolved value.
          if (/<[A-Z][A-Z0-9_]+>/.test(t.replace(/<PLACEHOLDER>/g, ""))) restam.push(path.relative(alvo, a));
        }
      }
    };
    if (fs.existsSync(path.join(alvo, ".claude"))) varrer(path.join(alvo, ".claude"));
    if (restam.length) {
      console.log(`\n  ${restam.length} file(s) still contain unresolved <UPPERCASE> placeholders:`);
      for (const f of restam.slice(0, 15)) console.log(`    ${f}`);
      console.log("  This is expected for project-specific information. Resolve it before delegating.");
    }
    if (claudeMdEscrito) {
      const cmTxt = fs.readFileSync(path.join(alvo, "CLAUDE.md"), "utf8");
      // A real placeholder is strictly <UPPERCASE_WITH_UNDERSCORES>; an
      // authoring instruction is an English sentence, so it always contains
      // a lowercase letter somewhere in the span. That is the distinguishing
      // test — not the first character's case, which a sentence starting a
      // capitalized word ("One sentence...") gets wrong.
      const secoes = (cmTxt.match(/<[^<>]*[a-z][^<>]*>/gs) || []);
      if (secoes.length) {
        console.log(`\n  CLAUDE.md was written, but ${secoes.length} section(s) still need real authoring — these are instructions, not data, so nothing was invented to fill them:`);
        for (const s of secoes) console.log(`    ${s.length > 90 ? s.slice(0, 87) + "..." : s}`);
        console.log("  Write these from actual project facts before the first delegation — an agent's context includes this file every turn.");
      }
    }
  }
}

try { main(); }
catch (error) { console.error(error.message); process.exitCode = 2; }
