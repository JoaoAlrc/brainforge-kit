#!/usr/bin/env node
/** Optional integration check: local skill discovery, no model prompt or login. */
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import net from "node:net";
import { spawn, spawnSync } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";
import { gerarOutrosClientes } from "./client-adapters.mjs";

const kit = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const executable = process.env.BRAINFORGE_KIMI_BIN || "kimi";
const version = spawnSync(executable, ["--version"], { encoding: "utf8", windowsHide: true });
if (version.error || version.status !== 0) throw new Error("Kimi Code CLI not found; install it before this optional smoke test.");
const root = fs.mkdtempSync(path.join(os.tmpdir(), "brainforge-kimi-smoke-"));
const project = path.join(root, "project");
const isolatedHome = path.join(root, "kimi-data");
let child;
let exited;
try {
  fs.mkdirSync(path.join(project, ".git"), { recursive: true });
  const catalog = JSON.parse(fs.readFileSync(path.join(kit, "catalog/catalog.json"), "utf8"));
  const answers = { name: "Discovery smoke", lead: "scrum-master", runtimes: ["kimi"], agents: ["scrum-master", "code-reviewer"], skills: ["handoff-contract", "verify-falsification"], placeholders: {} };
  gerarOutrosClientes({ kit, answers, catalog, target: project, substitute: text => text,
    write(file, content) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, content); } });

  const socket = net.createServer();
  socket.listen(0, "127.0.0.1");
  await once(socket, "listening");
  const port = socket.address().port;
  await new Promise(resolve => socket.close(resolve));
  child = spawn(executable, ["web", "--no-open", "--port", String(port)], {
    cwd: project, windowsHide: true,
    env: { ...process.env, KIMI_CODE_HOME: isolatedHome, LOCALAPPDATA: path.join(root, "cache"), XDG_CACHE_HOME: path.join(root, "cache") },
  });
  exited = new Promise(resolve => { child.once("exit", resolve); child.once("error", resolve); });
  let startup = "";
  let spawnError;
  child.on("error", error => { spawnError = error; });
  child.stdout.on("data", data => { startup += data; });
  child.stderr.on("data", data => { startup += data; });
  const deadline = Date.now() + 15000;
  let base;
  while (Date.now() < deadline) {
    if (spawnError || child.exitCode !== null) throw new Error("Kimi server did not start in the isolated environment.");
    base = startup.match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];
    if (base && fs.existsSync(path.join(isolatedHome, "server.token"))) break;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  if (!base) throw new Error("Timed out starting local Kimi.");
  // This token belongs only to the temporary loopback server. Never log it.
  const token = fs.readFileSync(path.join(isolatedHome, "server.token"), "utf8").trim();
  const request = async (route, body) => {
    const response = await fetch(base + route, {
      method: body ? "POST" : "GET", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(5000),
    });
    const result = await response.json();
    assert.equal(response.status, 200, `HTTP ${response.status} at ${route}`);
    assert.equal(result.code, 0, `Kimi returned ${result.code} at ${route}`);
    return result.data;
  };
  const workspace = await request("/api/v1/workspaces", { root: project });
  const result = await request(`/api/v1/workspaces/${workspace.id}/skills`);
  for (const name of answers.skills) {
    const found = result.skills.find(skill => skill.name === name);
    assert.ok(found, `Kimi did not discover ${name}`);
    assert.equal(found.source, "project");
    assert.ok(path.resolve(found.path).startsWith(path.resolve(project) + path.sep), "skill discovered outside the fixture");
  }
  console.log(JSON.stringify({ client: "Kimi Code", version: version.stdout.trim(), projectSkills: answers.skills, discovery: "PASS", modelExecution: "NOT_RUN", nativeAgents: "SCHEMA_ONLY" }, null, 2));
  await request("/api/v1/shutdown", {});
} finally {
  if (child && child.exitCode === null && !child.killed) child.kill();
  if (exited) await exited;
  fs.rmSync(root, { recursive: true, force: true });
}
