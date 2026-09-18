#!/usr/bin/env node
/**
 * Apply catalog/placeholders.json to Markdown files in catalog/.
 * Normalize aliases, resolve known skill/role names, and report unregistered gaps.
 * One concept has one canonical name; unnecessary gaps become interview noise.
 *
 * node bootstrap/fix-placeholders.mjs --dry-run
 * node bootstrap/fix-placeholders.mjs --report
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CAT = path.join(KIT, "catalog");
const REG = path.join(CAT, "placeholders.json");

function args(argv) {
  const o = { dryRun: false, report: false };
  for (const a of argv) {
    if (a === "--dry-run") o.dryRun = true;
    else if (a === "--report") o.report = true;
  }
  return o;
}

function arquivos(d, out = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) arquivos(p, out);
    else if (p.endsWith(".md")) out.push(p);
  }
  return out;
}

function rotulo(f) {
  return path.basename(f) === "SKILL.md" ? path.basename(path.dirname(f)) : path.basename(f, ".md");
}

function main() {
  const o = args(process.argv.slice(2));
  const reg = JSON.parse(fs.readFileSync(REG, "utf8"));
  const canonicos = new Set(Object.keys(reg.canonicos));
  const apelidos = reg.apelidos || {};
  const resolvidos = { ...reg.resolvidos };
  delete resolvidos.$comment;

  const fs_ = arquivos(CAT);
  let trocas = 0, resolucoes = 0, tocados = 0;
  const sobraram = {};

  for (const f of fs_) {
    const antes = fs.readFileSync(f, "utf8");
    let txt = antes;

    for (const [de, para] of Object.entries(apelidos)) {
      const re = new RegExp(`<${de}>`, "g");
      const n = (txt.match(re) || []).length;
      if (n) { txt = txt.replace(re, `<${para}>`); trocas += n; }
    }
    // Known catalog names become literal text rather than unnecessary interview questions.
    for (const [de, para] of Object.entries(resolvidos)) {
      const re = new RegExp(`<${de}>`, "g");
      const n = (txt.match(re) || []).length;
      if (n) { txt = txt.replace(re, para); resolucoes += n; }
    }

    if (txt !== antes) { tocados++; if (!o.dryRun) fs.writeFileSync(f, txt); }

    const restantes = [...new Set((txt.match(/<[A-Z][A-Z0-9_]+>/g) || [])
      .map((s) => s.slice(1, -1))
      .filter((s) => s !== "PLACEHOLDER" && !canonicos.has(s)))];
    if (restantes.length) sobraram[rotulo(f)] = restantes;
  }

  console.log(`${o.dryRun ? "[dry-run] " : ""}${trocas} alias(es) replaced, ${resolucoes} resolved to literal names, ${tocados} file(s) changed`);

  const fora = new Map();
  for (const [arq, lista] of Object.entries(sobraram)) for (const p of lista) fora.set(p, (fora.get(p) || 0) + 1);
  console.log(`\n${fora.size} placeholder(s) still outside the registry in ${Object.keys(sobraram).length} file(s).`);
  if (o.report) {
    const ord = Object.entries(sobraram).sort((a, b) => b[1].length - a[1].length);
    for (const [arq, lista] of ord) console.log(`  ${arq.padEnd(26)} ${lista.length.toString().padStart(2)}  ${lista.join(" ")}`);
  } else {
    const top = [...fora.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15);
    console.log("  most frequent:", top.map(([p, n]) => `${p}(${n})`).join(" "));
    console.log("  use --report for the per-file list.");
  }
  console.log("\nA remaining placeholder is not necessarily an error: a value needed by only");
  console.log("one role can remain. Too many gaps are a problem:");
  console.log("each gap becomes a question someone must answer during setup.");
}

main();
