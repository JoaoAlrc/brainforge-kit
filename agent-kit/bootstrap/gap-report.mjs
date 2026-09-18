#!/usr/bin/env node
/**
 * Compare an existing project against the catalog without modifying it.
 * Report missing roles/skills and promotion candidates. Never blindly replace
 * project skills: their project-specific sections contain decisions and evidence.
 * Use agent-forge to review each proposed update individually.
 *
 * node bootstrap/gap-report.mjs --project ../example-project
 * node bootstrap/gap-report.mjs --all --root .. --only-core
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CATALOGO = path.join(KIT, "catalog", "catalog.json");

function args(argv) {
  const o = { project: "", root: "", all: false, onlyCore: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--project") o.project = argv[++i];
    else if (argv[i] === "--root") o.root = argv[++i];
    else if (argv[i] === "--all") o.all = true;
    else if (argv[i] === "--only-core") o.onlyCore = true;
  }
  return o;
}

function ler(p) {
  try { return JSON.parse(fs.readFileSync(p, "utf8")); }
  catch (e) { console.error(`could not read ${p}: ${e.message}`); process.exit(2); }
}

function nomes(dir, sufixo) {
  try {
    return new Set(fs.readdirSync(dir, { withFileTypes: true })
      .filter((e) => (sufixo === "/" ? e.isDirectory() : e.isFile() && e.name.endsWith(sufixo)))
      .map((e) => e.name.replace(/\.md$/, "")));
  } catch { return new Set(); }
}

function detectarTrilha(raiz) {
  const tem = (f) => fs.existsSync(path.join(raiz, f));
  const pkg = tem("package.json") ? fs.readFileSync(path.join(raiz, "package.json"), "utf8") : "";
  if (fs.existsSync(raiz) && fs.readdirSync(raiz).some((f) => f.endsWith(".uproject"))) return "unreal-game";
  if (tem("project.godot")) return "godot-game";
  if (/"expo"/.test(pkg)) return "mobile-expo";
  if (/tanstack|"next"|"vite"/.test(pkg)) return "web-saas";
  if (pkg) return "web-saas";
  return "";
}

function relatorio(cat, raiz, onlyCore) {
  const nome = path.basename(raiz);
  if (!fs.existsSync(path.join(raiz, ".claude"))) return null;
  const temAgentes = nomes(path.join(raiz, ".claude", "agents"), ".md");
  const temSkills = nomes(path.join(raiz, ".claude", "skills"), "/");
  const trilha = detectarTrilha(raiz);

  const cabe = (d) => {
    const t = d.tracks || [];
    if (t.includes("*")) return "core";
    if (trilha && t.includes(trilha)) return "track";
    return null;
  };

  const faltaAgentes = [];
  for (const [n, d] of Object.entries(cat.agents)) {
    const c = cabe(d);
    if (!c) continue;
    if (onlyCore && c !== "core") continue;
    if (!temAgentes.has(n)) faltaAgentes.push({ n, c, why: d.purpose || "" });
  }
  const faltaSkills = [];
  for (const [n, d] of Object.entries(cat.skills)) {
    const c = cabe(d);
    if (!c) continue;
    if (onlyCore && c !== "core") continue;
    if (!temSkills.has(n)) faltaSkills.push({ n, c, why: d.purpose || "" });
  }

  // Project-only roles and skills are candidates for promotion into the catalog.
  const candidatos = [
    ...[...temAgentes].filter((n) => !cat.agents[n]).map((n) => `agent ${n}`),
    ...[...temSkills].filter((n) => !cat.skills[n]).map((n) => `skill ${n}`),
  ];

  return { nome, trilha, faltaAgentes, faltaSkills, candidatos };
}

function imprimir(r) {
  if (!r) return;
  const total = r.faltaAgentes.length + r.faltaSkills.length;
  console.log(`\n${r.nome}  [track: ${r.trilha || "not detected"}]  ${total} gap(s)`);
  for (const a of r.faltaAgentes) console.log(`  missing agent  ${a.n.padEnd(24)} (${a.c}) ${a.why}`);
  for (const s of r.faltaSkills) console.log(`  missing skill   ${s.n.padEnd(24)} (${s.c}) ${s.why}`);
  if (r.candidatos.length) {
    console.log(`  candidates for catalog promotion (${r.candidatos.length}):`);
    for (const c of r.candidatos.slice(0, 12)) console.log(`    ${c}`);
    if (r.candidatos.length > 12) console.log(`    ... +${r.candidatos.length - 12}`);
  }
}

function main() {
  const o = args(process.argv.slice(2));
  const cat = ler(CATALOGO);
  if (o.all) {
    const raiz = path.resolve(o.root || ".");
    const rs = fs.readdirSync(raiz, { withFileTypes: true })
      .filter((e) => e.isDirectory() && !e.name.startsWith("."))
      .map((e) => relatorio(cat, path.join(raiz, e.name), o.onlyCore))
      .filter(Boolean);
    rs.sort((a, b) => (b.faltaAgentes.length + b.faltaSkills.length) - (a.faltaAgentes.length + a.faltaSkills.length));
    for (const r of rs) imprimir(r);
    console.log(`\n${rs.length} project(s) with .claude/ inspected.`);
  } else if (o.project) {
    imprimir(relatorio(cat, path.resolve(o.project), o.onlyCore));
  } else {
    console.error("usage: --project <dir> | --all --root <dir> [--only-core]");
    process.exit(2);
  }
  console.log("\nReport only. Do not copy blindly: replacing a project skill with a catalog");
  console.log("skill erases project-specific sections. Use agent-forge to review each file");
  console.log("and decide which parts of the project version must be preserved.");
}

main();
