#!/usr/bin/env node
/**
 * token-audit.mjs — MEASURED token-usage report from this machine's local
 * Claude Code session logs, per project. Cross-platform (Node >= 18), zero
 * dependencies, read-only: never writes a file, never exits non-zero.
 *
 *   node .claude/hooks/token-audit.mjs                  last 10 sessions of THIS project
 *   node .claude/hooks/token-audit.mjs --sessions 20
 *   node .claude/hooks/token-audit.mjs --project <path> --sessions 5
 *   node .claude/hooks/token-audit.mjs --brief           one line per session, no tables
 *   node .claude/hooks/token-audit.mjs --json
 *   node .claude/hooks/token-audit.mjs --self-test
 *
 * Labeling discipline (the whole point of this script):
 *   MEASURED      — copied verbatim from the `usage` block the SDK logged for
 *                 each API call in *.jsonl under ~/.claude/projects/<dir>/.
 *                 Nothing here is inferred; token counts are exact.
 *   ESTIMATED    — the size of an oversized tool output, computed as
 *                 chars/4 (the log stores rendered text, not its tokenization).
 *   UNAVAILABLE — this script cannot see it and says so instead of guessing:
 *       - account-level MCP connector / plugin preload — that cost is paid on
 *         every project, isn't in these per-project logs, and isn't fixed by
 *         running this script in a project; check `enabledPlugins` in
 *         ~/.claude/settings.json and your connector list once, at the
 *         account level.
 *       - dollar cost — pricing tiers vary by model and aren't in the log.
 *       - anything logged only on another machine.
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import readline from "node:readline";

// ---------------------------------------------------------------------------
// Locating this project's session logs
// ---------------------------------------------------------------------------
function claudeHome() {
  return process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), ".claude");
}

/** Claude Code's own sanitization: every `:`, `\` or `/` in the absolute cwd
 *  becomes `-`, every other character (including a literal `-`) is kept. */
function sanitizeCwd(cwd) {
  return cwd.replace(/[:\\/]/g, "-");
}

function projectLogDir(projectRoot) {
  return path.join(claudeHome(), "projects", sanitizeCwd(path.resolve(projectRoot)));
}

function listSessionFiles(dir, limit) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return []; }
  return entries
    .filter((e) => e.isFile() && e.name.endsWith(".jsonl"))
    .map((e) => {
      const p = path.join(dir, e.name);
      let mtime = 0;
      try { mtime = fs.statSync(p).mtimeMs; } catch {}
      return { path: p, id: e.name.replace(/\.jsonl$/, ""), mtime };
    })
    .sort((a, b) => b.mtime - a.mtime)
    .slice(0, limit);
}

/** Subagent / workflow transcripts live under <dir>/subagents/**\/*.jsonl —
 *  same schema, same billing, not part of the main-session file. Capped for
 *  time on very active projects; sorted so the cap keeps the newest work. */
function listSubagentFiles(dir, cap = 300) {
  const root = path.join(dir, "subagents");
  const out = [];
  const walk = (d) => {
    let entries;
    try { entries = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.isFile() && e.name.endsWith(".jsonl")) {
        let mtime = 0;
        try { mtime = fs.statSync(p).mtimeMs; } catch {}
        out.push({ path: p, mtime });
      }
    }
  };
  walk(root);
  out.sort((a, b) => b.mtime - a.mtime);
  return out.slice(0, cap);
}

// ---------------------------------------------------------------------------
// Streaming line reader (files run 20–250MB; never load one into memory)
// ---------------------------------------------------------------------------
async function* readJsonLines(filePath) {
  const rl = readline.createInterface({ input: fs.createReadStream(filePath, { encoding: "utf8" }), crlfDelay: Infinity });
  for await (const line of rl) {
    if (!line.trim()) continue;
    try { yield JSON.parse(line); } catch { /* truncated/corrupt line: skip */ }
  }
}

// ---------------------------------------------------------------------------
// Core analysis — takes an async/sync iterable of already-parsed JSON
// objects so --self-test can feed it plain arrays with no filesystem I/O.
// ---------------------------------------------------------------------------
const BIG_RESULT_CHARS = 20000; // ~5k tokens by the chars/4 estimate
const REPEAT_READ_THRESHOLD = 3;

function newStats() {
  return {
    turns: 0,
    input_tokens: 0,
    cache_creation_input_tokens: 0,
    cache_read_input_tokens: 0,
    output_tokens: 0,
    thinking_tokens: 0,
    models: new Set(),
    efforts: new Set(),
    toolCounts: {},
    readCounts: new Map(), // file_path -> count
    bashCommands: [], // {cmd, at}
    bigResults: [], // {chars, tool, arg}
    firstPreloadTokens: null, // cache_creation of the very first assistant usage
    firstTimestamp: null,
    lastTimestamp: null,
    agentSpawns: 0,
    lineCount: 0,
  };
}

function toolArgPreview(name, input) {
  if (!input) return "";
  if (input.file_path) return input.file_path;
  if (input.path) return input.path;
  if (input.command) return String(input.command).slice(0, 80);
  if (input.pattern) return input.pattern;
  if (input.prompt) return String(input.prompt).slice(0, 60) + "…";
  return "";
}

async function analyzeLines(lines, stats = newStats()) {
  // tool_use id -> {name, input}, so a later tool_result can be attributed.
  const pending = new Map();
  for await (const j of lines) {
    stats.lineCount++;
    if (j.timestamp) {
      if (!stats.firstTimestamp) stats.firstTimestamp = j.timestamp;
      stats.lastTimestamp = j.timestamp;
    }
    if (j.type === "assistant" && j.message) {
      stats.turns++;
      if (j.message.model) stats.models.add(j.message.model);
      if (j.effort) stats.efforts.add(j.effort);
      const u = j.message.usage;
      if (u) {
        stats.input_tokens += u.input_tokens || 0;
        stats.cache_creation_input_tokens += u.cache_creation_input_tokens || 0;
        stats.cache_read_input_tokens += u.cache_read_input_tokens || 0;
        stats.output_tokens += u.output_tokens || 0;
        stats.thinking_tokens += u.output_tokens_details?.thinking_tokens || 0;
        if (stats.firstPreloadTokens === null) stats.firstPreloadTokens = u.cache_creation_input_tokens || 0;
      }
      const content = j.message.content;
      if (Array.isArray(content)) {
        for (const c of content) {
          if (c.type === "tool_use") {
            stats.toolCounts[c.name] = (stats.toolCounts[c.name] || 0) + 1;
            pending.set(c.id, { name: c.name, input: c.input });
            if (c.name === "Agent") stats.agentSpawns++;
            if (c.name === "Read" && c.input?.file_path) {
              const fp = c.input.file_path;
              stats.readCounts.set(fp, (stats.readCounts.get(fp) || 0) + 1);
            }
            if (c.name === "Bash" && c.input?.command) {
              stats.bashCommands.push(String(c.input.command).slice(0, 100));
            }
          }
        }
      }
    }
    if (j.type === "user" && j.message) {
      const content = j.message.content;
      if (Array.isArray(content)) {
        for (const c of content) {
          if (c.type === "tool_result") {
            const raw = typeof c.content === "string" ? c.content : JSON.stringify(c.content ?? "");
            const len = raw.length;
            if (len >= BIG_RESULT_CHARS) {
              const origin = pending.get(c.tool_use_id);
              stats.bigResults.push({
                chars: len,
                estTokens: Math.round(len / 4),
                tool: origin?.name ?? "?",
                arg: toolArgPreview(origin?.name, origin?.input),
              });
            }
          }
        }
      }
    }
  }
  return stats;
}

async function analyzeFile(filePath) {
  return analyzeLines(readJsonLines(filePath));
}

function cacheHitRate(s) {
  const total = s.cache_read_input_tokens + s.cache_creation_input_tokens + s.input_tokens;
  return total > 0 ? s.cache_read_input_tokens / total : null;
}

function repeatedReads(s, threshold = REPEAT_READ_THRESHOLD) {
  return [...s.readCounts.entries()].filter(([, n]) => n >= threshold).sort((a, b) => b[1] - a[1]);
}

function fmtDuration(startIso, endIso) {
  if (!startIso || !endIso) return "?";
  const ms = new Date(endIso) - new Date(startIso);
  if (!Number.isFinite(ms) || ms < 0) return "?";
  const mins = Math.round(ms / 60000);
  if (mins < 60) return `${mins}min`;
  return `${(mins / 60).toFixed(1)}h`;
}

function fmtN(n) { return n.toLocaleString("en-US"); }

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
function sessionLine(s, id) {
  const rate = cacheHitRate(s);
  const rateStr = rate === null ? "n/a" : `${Math.round(rate * 100)}%`;
  const models = [...s.models].map((m) => m.replace(/^claude-/, "")).join(",") || "?";
  return `${id.slice(0, 8)}  ${fmtDuration(s.firstTimestamp, s.lastTimestamp).padStart(6)}  turns=${String(s.turns).padStart(4)}  in=${fmtN(s.input_tokens).padStart(7)}  cache_w=${fmtN(s.cache_creation_input_tokens).padStart(9)}  cache_r=${fmtN(s.cache_read_input_tokens).padStart(9)}  out=${fmtN(s.output_tokens).padStart(7)}  cache_hit=${rateStr.padStart(4)}  model=${models}`;
}

function buildProblems(sessions, agg) {
  const problems = [];
  const lowCacheSessions = sessions.filter((x) => { const r = cacheHitRate(x.stats); return r !== null && r < 0.70 && x.stats.turns >= 3; });
  if (lowCacheSessions.length) {
    const avgRate = lowCacheSessions.reduce((a, x) => a + (cacheHitRate(x.stats) || 0), 0) / lowCacheSessions.length;
    problems.push({
      problema: "Poor cache reuse (context rewritten instead of reused)",
      cost: `MEASURED: ${fmtN(lowCacheSessions.reduce((a, x) => a + x.stats.cache_creation_input_tokens, 0))} cache_creation tokens in these sessions`,
      frequencia: `${lowCacheSessions.length}/${sessions.length} sessions below 70% (average ${Math.round(avgRate * 100)}%)`,
      impacto: avgRate < 0.4 ? "high" : "medium",
      evidencia: lowCacheSessions.slice(0, 3).map((x) => x.id.slice(0, 8)).join(", "),
    });
  }
  const allRepeats = [];
  for (const x of sessions) for (const [fp, n] of repeatedReads(x.stats)) allRepeats.push({ fp, n, session: x.id });
  if (allRepeats.length) {
    allRepeats.sort((a, b) => b.n - a.n);
    problems.push({
      problema: "File read repeatedly within one session",
      cost: "ESTIMATED: each reread costs roughly the file size in tokens again",
      frequencia: `${allRepeats.length} file(s) reread ≥${REPEAT_READ_THRESHOLD}x`,
      impacto: allRepeats[0].n >= 6 ? "high" : "medium",
      evidencia: allRepeats.slice(0, 3).map((r) => `${r.fp} ×${r.n} (${r.session.slice(0, 8)})`).join("; "),
    });
  }
  const allBig = sessions.flatMap((x) => x.stats.bigResults.map((r) => ({ ...r, session: x.id })));
  if (allBig.length) {
    allBig.sort((a, b) => b.chars - a.chars);
    const totalEst = allBig.reduce((a, r) => a + r.estTokens, 0);
    problems.push({
      problema: "Large command/file output entering context",
      cost: `ESTIMATED: ~${fmtN(totalEst)} tokens across the ${allBig.length} largest outputs`,
      frequencia: `${allBig.length} output(s) ≥${BIG_RESULT_CHARS / 1000}k chars in the analyzed sessions`,
      impacto: allBig[0].estTokens > 8000 ? "high" : "medium",
      evidencia: allBig.slice(0, 3).map((r) => `${r.tool}${r.arg ? " " + r.arg : ""} ~${fmtN(r.estTokens)}tok (${r.session.slice(0, 8)})`).join("; "),
    });
  }
  const heavyAgentSessions = sessions.filter((x) => x.stats.turns > 0 && x.stats.agentSpawns / Math.max(1, x.stats.turns) > 0.3 && x.stats.agentSpawns >= 5);
  if (heavyAgentSessions.length) {
    problems.push({
      problema: "Many subagents spawned (each reloads CLAUDE.md, tools, and skills)",
      cost: "ESTIMATED: preload per subagent × spawn count (see account audit Phase 1A)",
      frequencia: `${heavyAgentSessions.length} session(s), up to ${Math.max(...heavyAgentSessions.map((x) => x.stats.agentSpawns))} spawns`,
      impacto: "medium",
      evidencia: heavyAgentSessions.slice(0, 3).map((x) => `${x.id.slice(0, 8)} (${x.stats.agentSpawns} spawns / ${x.stats.turns} turns)`).join("; "),
    });
  }
  const multiModel = sessions.filter((x) => x.stats.models.size > 1);
  if (multiModel.length) {
    problems.push({
      problema: "Model changed within one session",
      cost: "UNAVAILABLE: logs do not include per-model prices",
      frequencia: `${multiModel.length} session(s)`,
      impacto: "low",
      evidencia: multiModel.slice(0, 3).map((x) => `${x.id.slice(0, 8)}: ${[...x.stats.models].join(" → ")}`).join("; "),
    });
  }
  problems.sort((a, b) => (b.impacto === "high") - (a.impacto === "high"));
  return problems;
}

function printReport(projectRoot, sessions, subagentRollup, opts) {
  const brief = opts.brief;
  console.log(`token-audit — ${projectRoot}`);
  console.log(`sessions analyzed: ${sessions.length} (most recent by modification time)\n`);
  if (!sessions.length) {
    console.log("No local logs found for this project in " + projectLogDir(projectRoot));
    console.log("(UNAVAILABLE: without *.jsonl files, there is nothing to measure here.)");
    return;
  }

  console.log("Per session (MEASURED directly from each call's usage field):");
  for (const x of sessions) console.log("  " + sessionLine(x.stats, x.id));
  console.log();

  const agg = sessions.reduce((a, x) => {
    a.input_tokens += x.stats.input_tokens;
    a.cache_creation_input_tokens += x.stats.cache_creation_input_tokens;
    a.cache_read_input_tokens += x.stats.cache_read_input_tokens;
    a.output_tokens += x.stats.output_tokens;
    a.thinking_tokens += x.stats.thinking_tokens;
    a.turns += x.stats.turns;
    a.agentSpawns += x.stats.agentSpawns;
    return a;
  }, { input_tokens: 0, cache_creation_input_tokens: 0, cache_read_input_tokens: 0, output_tokens: 0, thinking_tokens: 0, turns: 0, agentSpawns: 0 });
  const aggRate = cacheHitRate(agg);
  console.log("Sample total (MEASURED):");
  console.log(`  input=${fmtN(agg.input_tokens)}  cache_creation=${fmtN(agg.cache_creation_input_tokens)}  cache_read=${fmtN(agg.cache_read_input_tokens)}  output=${fmtN(agg.output_tokens)} (thinking=${fmtN(agg.thinking_tokens)})`);
  console.log(`  turns=${agg.turns}  agent-spawns=${agg.agentSpawns}  cache_hit_rate=${aggRate === null ? "n/a" : Math.round(aggRate * 100) + "%"}`);
  const preloads = sessions.map((x) => x.stats.firstPreloadTokens).filter((v) => v != null);
  if (preloads.length) {
    const avgPreload = Math.round(preloads.reduce((a, v) => a + v, 0) / preloads.length);
    console.log(`  average first-turn preload per session (MEASURED, a proxy for fixed new-session cost): ~${fmtN(avgPreload)} tokens`);
  }
  console.log();

  if (subagentRollup && subagentRollup.files > 0) {
    console.log(`Subagents/workflows outside the main session (MEASURED, same billing): ${subagentRollup.files} file(s) scanned`);
    console.log(`  input=${fmtN(subagentRollup.input_tokens)}  cache_creation=${fmtN(subagentRollup.cache_creation_input_tokens)}  cache_read=${fmtN(subagentRollup.cache_read_input_tokens)}  output=${fmtN(subagentRollup.output_tokens)}`);
    console.log();
  }

  if (!brief) {
    const allBig = sessions.flatMap((x) => x.stats.bigResults.map((r) => ({ ...r, session: x.id })));
    if (allBig.length) {
      allBig.sort((a, b) => b.chars - a.chars);
      console.log(`Largest outputs entering context (ESTIMATED, chars/4):`);
      for (const r of allBig.slice(0, 8)) console.log(`  ~${String(fmtN(r.estTokens)).padStart(6)} tok  ${r.tool.padEnd(10)} ${r.arg}  (session ${r.session.slice(0, 8)})`);
      console.log();
    }
    const allRepeats = [];
    for (const x of sessions) for (const [fp, n] of repeatedReads(x.stats)) allRepeats.push({ fp, n, session: x.id });
    if (allRepeats.length) {
      allRepeats.sort((a, b) => b.n - a.n);
      console.log("Files reread ≥3x within one session:");
      for (const r of allRepeats.slice(0, 8)) console.log(`  ×${r.n}  ${r.fp}  (session ${r.session.slice(0, 8)})`);
      console.log();
    }
  }

  const problems = buildProblems(sessions, agg);
  console.log("PROBLEM | COST | FREQUENCY | IMPACT | EVIDENCE");
  if (!problems.length) console.log("(no waste pattern crossed this script's thresholds in the analyzed sample)");
  for (const p of problems) {
    console.log(`- [${p.impacto.toUpperCase()}] ${p.problema}`);
    console.log(`    cost: ${p.custo}`);
    console.log(`    frequency: ${p.frequencia}`);
    console.log(`    evidence: ${p.evidencia}`);
  }
  console.log();
  console.log("UNAVAILABLE in this analysis (account-level data): MCPs/plugins loaded in every session");
  console.log("  regardless of project (absent from these logs); check `enabledPlugins` in ~/.claude/settings.json and");
  console.log("  account-level connector settings once. Dollar cost is also UNAVAILABLE");
  console.log("  (prices vary by model and are not recorded in the log).");
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
function parseArgs(argv) {
  const opts = { sessions: 10, project: process.cwd(), brief: false, json: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--sessions") opts.sessions = Number(argv[++i]) || opts.sessions;
    else if (argv[i] === "--project") opts.project = argv[++i] || opts.project;
    else if (argv[i] === "--brief") opts.brief = true;
    else if (argv[i] === "--json") opts.json = true;
  }
  return opts;
}

async function runReport() {
  const opts = parseArgs(process.argv.slice(2));
  const logDir = projectLogDir(opts.project);
  const files = listSessionFiles(logDir, opts.sessions);
  const sessions = [];
  for (const f of files) {
    try { sessions.push({ id: f.id, stats: await analyzeFile(f.path) }); }
    catch (e) { process.stderr.write(`token-audit: skipped ${f.path}: ${e.message}\n`); }
  }
  sessions.sort((a, b) => (a.stats.firstTimestamp || "").localeCompare(b.stats.firstTimestamp || ""));

  let subagentRollup = null;
  const subFiles = listSubagentFiles(logDir);
  if (subFiles.length) {
    subagentRollup = { files: subFiles.length, input_tokens: 0, cache_creation_input_tokens: 0, cache_read_input_tokens: 0, output_tokens: 0 };
    for (const f of subFiles) {
      try {
        const s = await analyzeFile(f.path);
        subagentRollup.input_tokens += s.input_tokens;
        subagentRollup.cache_creation_input_tokens += s.cache_creation_input_tokens;
        subagentRollup.cache_read_input_tokens += s.cache_read_input_tokens;
        subagentRollup.output_tokens += s.output_tokens;
      } catch { /* skip unreadable */ }
    }
  }

  if (opts.json) {
    const out = sessions.map((x) => ({
      id: x.id,
      start: x.stats.firstTimestamp,
      end: x.stats.lastTimestamp,
      turns: x.stats.turns,
      input_tokens: x.stats.input_tokens,
      cache_creation_input_tokens: x.stats.cache_creation_input_tokens,
      cache_read_input_tokens: x.stats.cache_read_input_tokens,
      output_tokens: x.stats.output_tokens,
      cache_hit_rate: cacheHitRate(x.stats),
      models: [...x.stats.models],
      agent_spawns: x.stats.agentSpawns,
      tool_counts: x.stats.toolCounts,
    }));
    console.log(JSON.stringify({ project: opts.project, sessions: out, subagent_rollup: subagentRollup }, null, 2));
    return;
  }
  printReport(opts.project, sessions, subagentRollup, opts);
}

// ---------------------------------------------------------------------------
// --self-test — synthetic in-memory data, no filesystem writes
// ---------------------------------------------------------------------------
async function runSelfTest() {
  let pass = 0, fail = 0;
  const check = (name, cond) => { if (cond) pass++; else { fail++; console.log(`FAIL ${name}`); } };

  check("sanitizeCwd matches the observed Claude Code convention", sanitizeCwd("C:\\Users\\User\\apps\\one-move") === "C--Users-User-apps-one-move");
  check("sanitizeCwd handles forward slashes (macOS)", sanitizeCwd("/Users/joao/apps/one-move") === "-Users-joao-apps-one-move");

  const usage = (over) => ({ input_tokens: 2, cache_creation_input_tokens: 1000, cache_read_input_tokens: 9000, output_tokens: 100, output_tokens_details: { thinking_tokens: 20 }, ...over });
  const synthetic = [
    { type: "assistant", timestamp: "2026-09-01T10:00:00Z", message: { model: "claude-sonnet-5", content: [{ type: "tool_use", id: "t1", name: "Read", input: { file_path: "docs/BACKLOG.md" } }], usage: usage({ cache_creation_input_tokens: 5000 }) } },
    { type: "user", timestamp: "2026-09-01T10:00:05Z", message: { content: [{ type: "tool_result", tool_use_id: "t1", content: "x".repeat(100) }] } },
    { type: "assistant", timestamp: "2026-09-01T10:01:00Z", message: { model: "claude-sonnet-5", content: [{ type: "tool_use", id: "t2", name: "Read", input: { file_path: "docs/BACKLOG.md" } }], usage: usage() } },
    { type: "user", timestamp: "2026-09-01T10:01:05Z", message: { content: [{ type: "tool_result", tool_use_id: "t2", content: "y".repeat(25000) }] } },
    { type: "assistant", timestamp: "2026-09-01T10:02:00Z", message: { model: "claude-sonnet-5", content: [{ type: "tool_use", id: "t3", name: "Read", input: { file_path: "docs/BACKLOG.md" } }], usage: usage() } },
    { type: "user", timestamp: "2026-09-01T10:02:05Z", message: { content: [{ type: "tool_result", tool_use_id: "t3", content: "z".repeat(50) }] } },
    { type: "assistant", timestamp: "2026-09-01T10:03:00Z", message: { model: "claude-sonnet-5", content: [{ type: "tool_use", id: "t4", name: "Agent", input: { prompt: "spawn one" } }], usage: usage({ cache_read_input_tokens: 0, cache_creation_input_tokens: 0 }) } },
    { type: "assistant", timestamp: "2026-09-01T10:04:00Z" }, // no usage/message: must not throw
  ];

  const stats = await analyzeLines(synthetic);
  // 4 assistant entries carry a `message` (3 Reads + 1 Agent); the 5th
  // assistant entry has no `message` at all and must be ignored, not thrown on.
  check("turns counted (assistant entries with a message)", stats.turns === 4);
  check("input_tokens summed", stats.input_tokens === 2 * 4);
  check("cache_creation summed", stats.cache_creation_input_tokens === 5000 + 1000 + 1000 + 0);
  check("output_tokens summed", stats.output_tokens === 100 * 4);
  check("thinking_tokens summed", stats.thinking_tokens === 20 * 4);
  check("firstPreloadTokens is the first turn's cache_creation", stats.firstPreloadTokens === 5000);
  check("Read repeated 3x on the same file", stats.readCounts.get("docs/BACKLOG.md") === 3);
  check("repeatedReads() surfaces it at threshold 3", repeatedReads(stats).some(([fp, n]) => fp === "docs/BACKLOG.md" && n === 3));
  check("big tool_result (25000 chars) captured", stats.bigResults.length === 1 && stats.bigResults[0].chars === 25000);
  check("big tool_result attributed to the right Read call", stats.bigResults[0].tool === "Read" && stats.bigResults[0].arg === "docs/BACKLOG.md");
  check("small tool_results (100, 50 chars) not captured", stats.bigResults.length === 1);
  check("agentSpawns counted", stats.agentSpawns === 1);
  check("toolCounts tallied per name", stats.toolCounts.Read === 3 && stats.toolCounts.Agent === 1);
  const expectedRead = 9000 * 3; // t4's Agent call carries cache_read: 0
  const expectedCreation = 5000 + 1000 + 1000;
  const expectedInput = 2 * 4;
  check("cacheHitRate is read/(read+creation+input)", Math.abs(cacheHitRate(stats) - expectedRead / (expectedRead + expectedCreation + expectedInput)) < 1e-9);
  check("malformed entry with no usage/message did not throw and did not add a turn", stats.turns === 4);

  // A session with zero cache activity: cacheHitRate must be null, not NaN/0.
  const cold = await analyzeLines([]);
  check("empty session: cacheHitRate is null, not NaN", cacheHitRate(cold) === null);
  check("empty session: turns is 0", cold.turns === 0);

  // fmtDuration sanity
  check("fmtDuration under an hour", fmtDuration("2026-09-01T10:00:00Z", "2026-09-01T10:32:00Z") === "32min");
  check("fmtDuration over an hour", fmtDuration("2026-09-01T10:00:00Z", "2026-09-01T12:30:00Z") === "2.5h");
  check("fmtDuration handles missing timestamps", fmtDuration(null, null) === "?");

  // toolArgPreview
  check("toolArgPreview prefers file_path", toolArgPreview("Read", { file_path: "a.md", path: "b.md" }) === "a.md");
  check("toolArgPreview truncates a long command", toolArgPreview("Bash", { command: "x".repeat(200) }).length === 80);

  console.log(`self-test: ${pass} passed, ${fail} failed`);
  process.exitCode = fail ? 1 : 0;
}

// ---------------------------------------------------------------------------
if (process.argv.includes("--self-test")) {
  runSelfTest();
} else {
  runReport().catch((e) => { process.stderr.write(`token-audit: ${e.stack || e.message}\n`); process.exitCode = 0; });
}

export { sanitizeCwd, analyzeLines, cacheHitRate, repeatedReads, fmtDuration, toolArgPreview, buildProblems };
