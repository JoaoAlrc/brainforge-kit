#!/usr/bin/env node
/**
 * context-budget.mjs — reports files that have grown past their context budget.
 * Cross-platform (Node ≥ 18, zero dependencies). Never blocks: always exits 0.
 *
 *   node .claude/hooks/context-budget.mjs            full report
 *   node .claude/hooks/context-budget.mjs --brief    violations only; silent when clean
 *   node .claude/hooks/context-budget.mjs --json     machine-readable
 *
 * Wired as a SessionStart hook with --brief so the scrum-master sees, at the
 * top of every session, exactly which files are burning tokens. Budgets live in
 * .claude/hooks/context-budget.json (optional); defaults below apply otherwise.
 *
 * Why: a 100-line budget on BACKLOG.md that nobody measures becomes a 3,000-line
 * log within a month. Every one of those lines is loaded by every session that
 * plans, multiplied by every agent that reads it.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const rootArg = process.argv.indexOf("--root");
const ROOT = rootArg >= 0 && process.argv[rootArg + 1] ? path.resolve(process.argv[rootArg + 1]) : path.resolve(HERE, "..", "..");
const CONFIG = rootArg >= 0 ? path.join(ROOT, ".claude", "hooks", "context-budget.json") : path.join(HERE, "context-budget.json");

const DEFAULTS = {
  // exact files: line budgets
  files: {
    "CLAUDE.md": { lines: 110 },
    "AGENTS.md": { lines: 170 },
    "docs/tasks/BACKLOG.md": { lines: 100 },
    "docs/tasks/ROADMAP.md": { lines: 250 },
  },
  // glob-ish patterns (dir prefix + suffix): budgets per matching file
  patterns: [
    { match: ".claude/agents/*.md", lines: 100 },
    { match: ".claude/skills/*/SKILL.md", lines: 170 },
    { match: ".claude/rules/*.md", lines: 120 },
    { match: "docs/tasks/TASK-*.md", lines: 220 },
  ],
  // any markdown under docs/ larger than this is a split candidate, except canon
  large_doc_bytes: 60000,
  large_doc_exclude: ["docs/game-design-bible/", "docs/canon/", "docs/tasks/archive/", "docs/_index/"],
  // directories never scanned
  skip_dirs: ["node_modules", ".git", ".godot", ".expo", "android", "ios", "dist", "build", ".claude/worktrees", "wash-pricer-clean-clone"],
  tokens_per_byte: 0.27,
};

function loadConfig() {
  if (!fs.existsSync(CONFIG)) return DEFAULTS;
  try {
    const user = JSON.parse(fs.readFileSync(CONFIG, "utf8").replace(/^﻿/, ""));
    return {
      ...DEFAULTS,
      ...user,
      files: { ...DEFAULTS.files, ...(user.files ?? {}) },
      patterns: user.patterns ?? DEFAULTS.patterns,
      large_doc_exclude: user.large_doc_exclude ?? DEFAULTS.large_doc_exclude,
      skip_dirs: user.skip_dirs ?? DEFAULTS.skip_dirs,
    };
  } catch (e) {
    process.stderr.write(`context-budget: invalid ${path.relative(ROOT, CONFIG)} (${e.message}); using defaults\n`);
    return DEFAULTS;
  }
}

function toPosix(p) { return p.replace(/\\/g, "/"); }

function* walk(dir, cfg, rel = "") {
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) {
      if (cfg.skip_dirs.some((s) => r === s || r.startsWith(s + "/") || e.name === s)) continue;
      yield* walk(path.join(dir, e.name), cfg, r);
    } else if (e.isFile()) {
      yield r;
    }
  }
}

function globToRe(g) {
  const esc = g.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[^/]*");
  return new RegExp("^" + esc + "$", "i");
}

function measure(rel) {
  const abs = path.join(ROOT, rel);
  let txt;
  try { txt = fs.readFileSync(abs, "utf8"); } catch { return null; }
  const bytes = Buffer.byteLength(txt, "utf8");
  const lines = txt.length ? txt.split(/\r?\n/).length - (txt.endsWith("\n") ? 1 : 0) : 0;
  return { rel, bytes, lines };
}

function run() {
  const cfg = loadConfig();
  const brief = process.argv.includes("--brief");
  const json = process.argv.includes("--json");
  const findings = [];
  const seen = new Set();

  for (const [rel, budget] of Object.entries(cfg.files)) {
    const m = measure(rel);
    if (!m) continue;
    seen.add(rel.toLowerCase());
    if (budget.lines && m.lines > budget.lines) findings.push({ ...m, budget: budget.lines, unit: "lines", ratio: m.lines / budget.lines, kind: "budget" });
    if (budget.bytes && m.bytes > budget.bytes) findings.push({ ...m, budget: budget.bytes, unit: "bytes", ratio: m.bytes / budget.bytes, kind: "budget" });
  }
  const patternRes = cfg.patterns.map((p) => ({ ...p, re: globToRe(p.match) }));
  for (const rel of walk(ROOT, cfg)) {
    const posix = toPosix(rel);
    const lower = posix.toLowerCase();
    if (!lower.endsWith(".md")) continue;
    if (seen.has(lower)) continue;
    let matched = false;
    for (const p of patternRes) {
      if (p.re.test(posix)) {
        matched = true;
        const m = measure(posix);
        if (!m) break;
        if (p.lines && m.lines > p.lines) findings.push({ ...m, budget: p.lines, unit: "lines", ratio: m.lines / p.lines, kind: "budget" });
        if (p.bytes && m.bytes > p.bytes) findings.push({ ...m, budget: p.bytes, unit: "bytes", ratio: m.bytes / p.bytes, kind: "budget" });
        break;
      }
    }
    if (matched) continue;
    if (lower.startsWith("docs/") && !cfg.large_doc_exclude.some((x) => lower.startsWith(x.toLowerCase()))) {
      const m = measure(posix);
      if (m && m.bytes > cfg.large_doc_bytes) findings.push({ ...m, budget: cfg.large_doc_bytes, unit: "bytes", ratio: m.bytes / cfg.large_doc_bytes, kind: "split-candidate" });
    }
  }
  findings.sort((a, b) => b.ratio - a.ratio);
  const wasted = findings.filter((f) => f.kind === "budget").reduce((acc, f) => acc + Math.max(0, f.bytes - (f.unit === "bytes" ? f.budget : f.budget * 70)), 0);
  const tokens = Math.round(wasted * cfg.tokens_per_byte);

  if (json) { console.log(JSON.stringify({ root: ROOT, findings, estimated_excess_tokens: tokens }, null, 2)); return; }
  if (!findings.length) { if (!brief) console.log("context-budget: all files within budget."); return; }
  const cap = brief ? 12 : 60;
  const lines = [`context-budget: ${findings.length} file(s) over budget (~${tokens.toLocaleString("en-US")} excess tokens loaded per read). context-hygiene skill applies.`];
  for (const f of findings.slice(0, cap)) {
    const size = f.unit === "lines" ? `${f.lines} lines` : `${(f.bytes / 1024).toFixed(0)} KB`;
    const bud = f.unit === "lines" ? `${f.budget} lines` : `${(f.budget / 1024).toFixed(0)} KB`;
    const tag = f.kind === "split-candidate" ? "split?" : `${f.ratio.toFixed(1)}x`;
    lines.push(`  ${tag.padStart(6)}  ${f.rel}  (${size}, budget ${bud})`);
  }
  if (findings.length > cap) lines.push(`  ... +${findings.length - cap} more (run without --brief)`);
  console.log(lines.join("\n"));
}

try { run(); } catch (e) { process.stderr.write(`context-budget: ${e.message}\n`); }
process.exit(0);
