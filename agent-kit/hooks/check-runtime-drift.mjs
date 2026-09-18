#!/usr/bin/env node
/**
 * check-runtime-drift.mjs — read-only report of drift between the Claude-side
 * config a project's scope-guard actually enforces and any Codex-side mirror
 * of it. Cross-platform (Node >= 18), zero dependencies. Never writes, never
 * syncs, never exits non-zero unless invoked with --strict. Not wired into
 * any hook by default — run it by hand, or add it to your own scripts.
 *
 *   node .claude/hooks/check-runtime-drift.mjs             report, exit 0
 *   node .claude/hooks/check-runtime-drift.mjs --strict    exit 1 if any drift
 *   node .claude/hooks/check-runtime-drift.mjs --project <path>
 *
 * Why: a project with both a human-in-the-loop Claude Code scrum-master and
 * an OpenAI Codex agent working the same repo in parallel sometimes keeps a
 * .codex/ mirror of .claude/hooks/*.mjs and a .agents/skills/ mirror of
 * .claude/skills/*. Measured finding (codejtech, 2026-09): both mirrors had
 * already diverged from the originals the same day they were created. A copy
 * is never authority — read the original, or confirm the two match. This
 * script only reports; it never proposes or performs a sync. Auto-syncing
 * .codex/ from .claude/ would be exactly the unilateral cross-runtime edit
 * this fleet's own house convention (COMO-DIVIDIR-CLAUDE-E-CODEX.md, Regra 3)
 * puts in the human-coordinated column — that stays a human or a project
 * lead's decision, never this script's.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

function parseArgs(argv) {
  const opts = { project: process.cwd(), strict: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--project") opts.project = argv[++i] || opts.project;
    else if (argv[i] === "--strict") opts.strict = true;
  }
  return opts;
}

function sha(p) {
  try { return crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex").slice(0, 12); }
  catch { return null; }
}

function listFiles(dir) {
  const out = [];
  const walk = (d, rel) => {
    let entries;
    try { entries = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const abs = path.join(d, e.name);
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) walk(abs, r);
      else out.push(r);
    }
  };
  walk(dir, "");
  return out;
}

// (claudeDir, codexDir, label) pairs to compare, relative to the project root.
const MIRROR_PAIRS = [
  [".claude/hooks", ".codex/hooks", "hooks"],
  [".claude/skills", ".agents/skills", "skills"],
  [".claude/agents", ".codex/agents", "agents (expect format conversion, .md vs .toml — names only)"],
];

/** A shim is a file whose only job is to run the .claude/ original, so the two
 *  runtimes share one engine and one config instead of two copies that drift.
 *  It is the intended end state — not drift — and must never be reported as
 *  such, or the report cries wolf on the correct architecture and gets ignored.
 *  Recognised shape: an import/require whose path lands on .claude/<...>/<name>. */
function isShimFor(filePath, name) {
  let txt;
  try { txt = fs.readFileSync(filePath, "utf8"); } catch { return false; }
  if (txt.length > 4000) return false; // a real implementation, not a pointer
  // Strip comments and blank lines. What remains must be EXACTLY the one import
  // and nothing else: a "shim" carrying extra executable lines is a fork wearing
  // a pointer's clothes, and is the precise thing this report exists to catch.
  const code = txt
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split(/\r?\n/)
    .map((l) => l.replace(/\/\/.*$/, "").trim())
    .filter(Boolean)
    .join("\n");
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const only = new RegExp(String.raw`^(?:import\s+["']|require\s*\(\s*["'])[^"']*\.claude/[^"']*${esc}["']\)?;?$`);
  return only.test(code);
}

function compareMirror(root, claudeRel, codexRel, label) {
  const claudeDir = path.join(root, claudeRel);
  const codexDir = path.join(root, codexRel);
  if (!fs.existsSync(codexDir)) return null; // no mirror on this project — nothing to check
  const claudeFiles = new Set(listFiles(claudeDir));
  const codexFiles = new Set(listFiles(codexDir));
  const diffs = [];
  const shimmed = [];
  for (const f of claudeFiles) {
    if (label.startsWith("agents")) continue; // names differ by design; skip content compare
    if (codexFiles.has(f) && isShimFor(path.join(codexDir, f), path.basename(f))) { shimmed.push(f); continue; }
    if (!codexFiles.has(f)) {
      // A config file with no counterpart is correct when the engine beside it
      // is a shim: the real engine resolves config from its own location, so
      // one config serves both runtimes. Only a missing *executable* is news.
      const isConfig = !f.endsWith(".mjs") && !f.endsWith(".js");
      const engineShimmed = shimmed.length > 0 || [...codexFiles].some((c) => c.endsWith(".mjs") && isShimFor(path.join(codexDir, c), path.basename(c)));
      if (isConfig && engineShimmed) continue;
      diffs.push({ kind: "missing-in-codex", file: f });
      continue;
    }
    const h1 = sha(path.join(claudeDir, f));
    const h2 = sha(path.join(codexDir, f));
    if (h1 !== h2) diffs.push({ kind: "content-differs", file: f });
  }
  for (const f of codexFiles) {
    if (label.startsWith("agents")) continue;
    if (!claudeFiles.has(f)) diffs.push({ kind: "extra-in-codex", file: f });
  }
  return { label, claudeDir: claudeRel, codexDir: codexRel, diffs, shimmed, claudeCount: claudeFiles.size, codexCount: codexFiles.size };
}

function findAbsolutePaths(root) {
  // Absolute Windows/posix paths baked into a Codex config file are a portability
  // hazard the moment the repo moves machine or the other agent runs it.
  const targets = [".codex/hooks.json", ".codex/config.toml"];
  const hits = [];
  for (const t of targets) {
    const p = path.join(root, t);
    let txt;
    try { txt = fs.readFileSync(p, "utf8"); } catch { continue; }
    const re = /(?:[A-Za-z]:\\|\/(?:Users|home|c\/Users)\/)[^\s"'`]+/g;
    let m;
    while ((m = re.exec(txt))) hits.push({ file: t, match: m[0] });
  }
  return hits;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const root = path.resolve(opts.project);
  console.log(`check-runtime-drift — ${root}`);
  let any = false;
  for (const [c, x, label] of MIRROR_PAIRS) {
    const r = compareMirror(root, c, x, label);
    if (!r) continue;
    const shimNote = r.shimmed?.length ? `, ${r.shimmed.length} shimmed to the .claude original — single source, not drift` : "";
    if (!r.diffs.length) {
      console.log(`  ${label}: ${r.claudeDir} <-> ${r.codexDir} — in sync (${r.claudeCount} file(s)${shimNote})`);
      continue;
    }
    any = true;
    console.log(`  ${label}: ${r.claudeDir} <-> ${r.codexDir} — ${r.diffs.length} drift(s)${shimNote}`);
    for (const d of r.diffs.slice(0, 20)) console.log(`    ${d.kind.padEnd(18)} ${d.file}`);
    if (r.diffs.length > 20) console.log(`    ... +${r.diffs.length - 20} more`);
  }
  const abs = findAbsolutePaths(root);
  if (abs.length) {
    any = true;
    console.log(`  absolute paths baked into Codex config (portability hazard):`);
    for (const a of abs.slice(0, 10)) console.log(`    ${a.file}: ${a.match}`);
  }
  if (!any) console.log("  no .codex/ or .agents/ mirrors found, or everything in sync.");
  console.log("\nThis is a report only — it never syncs. A copy is never authority: read the");
  console.log(".claude/ original, or confirm both sides match before trusting either.");
  process.exit(opts.strict && any ? 1 : 0);
}

main();
