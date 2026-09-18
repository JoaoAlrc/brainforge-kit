import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { codexTier, validateCodexOptions } from "./codex-adapter.mjs";

const kit = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const entry = path.join(kit, "bootstrap", "new-project.mjs");
const run = (...args) => spawnSync(process.execPath, [entry, ...args], { encoding: "utf8" });
const catalog = JSON.parse(fs.readFileSync(path.join(kit, "catalog", "catalog.json"), "utf8"));

function fixture(t, track = "web-saas", runtimes = ["codex"]) {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "brainforge-codex-"));
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }));
  const template = run("--track", track, "--print-answers");
  assert.equal(template.status, 0, template.stderr);
  const answers = JSON.parse(template.stdout);
  answers.name = "Example Project";
  answers.runtimes = runtimes;
  for (const [name, value] of Object.entries(answers.placeholders)) {
    if (/<(?:FILL|PREENCHER):/.test(value)) answers.placeholders[name] = `example-${name.toLowerCase()}`;
  }
  const file = path.join(temp, "answers.json");
  const target = path.join(temp, "project");
  const save = () => fs.writeFileSync(file, JSON.stringify(answers));
  save();
  return { temp, file, target, answers, save, create: (...flags) => run("--answers", file, "--target", target, "--no-git", ...flags) };
}

function parseFlatToml(file) {
  const result = {};
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    if (!line || line.startsWith("#") || line.startsWith("[")) continue;
    const [, key, value] = line.match(/^([a-z_]+) = (.+)$/) || [];
    assert.ok(key, `Unexpected TOML line in ${file}: ${line}`);
    result[key] = JSON.parse(value);
  }
  return result;
}

for (const track of Object.keys(catalog.tracks)) {
  test(`Codex ${track}: native roles, complete skills and no Claude dependency`, (t) => {
    const f = fixture(t, track);
    const output = f.create();
    assert.equal(output.status, 0, output.stderr);
    assert.equal(fs.existsSync(path.join(f.target, ".claude")), false);
    assert.equal(fs.existsSync(path.join(f.target, ".codex", "hooks.json")), false);
    assert.equal(fs.existsSync(path.join(f.target, ".codex", "hooks")), false);
    assert.ok(fs.readFileSync(path.join(f.target, "AGENTS.md"), "utf8").includes(".codex/agents"));
    const config = parseFlatToml(path.join(f.target, ".codex", "config.toml"));
    assert.equal(config.max_concurrent_threads_per_session, 2);
    assert.equal(config.model, undefined, "principal model must stay with user");
    assert.equal(config.sandbox_mode, undefined, "do not relax session sandbox");
    assert.equal(config.approval_policy, undefined);
    const scopes = JSON.parse(fs.readFileSync(path.join(f.target, ".brainforge", "SCOPES.json"), "utf8"));
    for (const name of f.answers.agents) {
      const role = parseFlatToml(path.join(f.target, ".codex", "agents", `${name}.toml`));
      assert.equal(role.name, name);
      assert.ok(role.description);
      assert.ok(role.developer_instructions.includes(`.brainforge/roles/${name}.md`));
      assert.ok(fs.existsSync(path.join(f.target, ".brainforge", "roles", `${name}.md`)));
      assert.equal(role.sandbox_mode, scopes.read_only.includes(name) ? "read-only" : undefined);
      for (const skill of catalog.agents[name].needs_skills || []) {
        assert.ok(fs.existsSync(path.join(f.target, ".agents", "skills", skill, "SKILL.md")), skill);
      }
    }
    assert.ok(scopes.write[f.answers.lead].allow.includes(".codex/"));
    assert.ok(scopes.write[f.answers.lead].allow.includes(".agents/"));
    assert.ok(fs.existsSync(path.join(f.target, ".brainforge", "licenses", "THIRD_PARTY_NOTICES.md")));
  });
}

test("inherit model policy preserves account/model choice and reviewer sandbox", (t) => {
  const f = fixture(t);
  f.answers.codex = { model_policy: "inherit", max_agents: 1 };
  f.save();
  assert.equal(f.create().status, 0);
  const config = parseFlatToml(path.join(f.target, ".codex", "config.toml"));
  assert.equal(config.default_subagent_model, undefined);
  const role = parseFlatToml(path.join(f.target, ".codex", "agents", "code-reviewer.toml"));
  assert.equal(role.model, undefined);
  assert.equal(role.model_reasoning_effort, undefined);
  assert.equal(role.sandbox_mode, "read-only");
});

test("role routing and custom tier are independent of Claude model aliases", (t) => {
  assert.equal(codexTier("docs-librarian", "scrum-master"), "lookup");
  assert.equal(codexTier("app-dev", "scrum-master"), "execution");
  for (const name of ["scrum-master", "code-reviewer", "commerce-dev", "domain-engineer", "kids-compliance", "persistence-dev", "backend-dev", "platform-dev"]) assert.equal(codexTier(name, "scrum-master"), "review");
  const f = fixture(t);
  f.answers.codex.models = { execution: { model: "my-model", effort: "low" } };
  f.save();
  assert.equal(f.create().status, 0);
  assert.equal(parseFlatToml(path.join(f.target, ".codex", "agents", "app-dev.toml")).model, "my-model");
  assert.throws(() => validateCodexOptions({ model_policy: "magic" }));
  assert.throws(() => validateCodexOptions({ max_agents: 0 }));
});

test("unknown runtime and traversal fail before writing; dry-run is pure", (t) => {
  const f = fixture(t);
  f.answers.runtimes = ["typo"];
  f.save();
  assert.equal(f.create().status, 2);
  assert.equal(fs.existsSync(f.target), false);
  f.answers.runtimes = ["codex"];
  f.answers.agents.push("../../escape");
  f.save();
  assert.equal(f.create().status, 2);
  assert.equal(fs.existsSync(f.target), false);
  f.answers.agents.pop();
  f.save();
  assert.equal(f.create("--dry-run").status, 0);
  assert.equal(fs.existsSync(f.target), false);
  assert.equal(run("--unexpected").status, 2);
});

test("existing files are preserved and existing work is never auto-committed", (t) => {
  const f = fixture(t);
  fs.mkdirSync(path.join(f.target, ".codex"), { recursive: true });
  const config = path.join(f.target, ".codex", "config.toml");
  fs.writeFileSync(config, "# custom user configuration\n");
  const output = run("--answers", f.file, "--target", f.target);
  assert.equal(output.status, 2);
  assert.match(output.stderr, /destination is not empty/);
  assert.equal(fs.existsSync(path.join(f.target, ".git")), false);
  assert.equal(f.create().status, 0);
  assert.equal(fs.readFileSync(config, "utf8"), "# custom user configuration\n");
});

test("portable skill ownership, denies and canon paths use the effective runtime", (t) => {
  const f = fixture(t, "godot-game");
  f.answers.canon = { prefixes: ["<CANON_PATHS>", ".claude/skills/visual-identity/"], owners: ["art-director"] };
  f.save();
  assert.equal(f.create().status, 0);
  const scopes = JSON.parse(fs.readFileSync(path.join(f.target, ".brainforge", "SCOPES.json"), "utf8"));
  const art = scopes.write["art-director"];
  assert.ok(art.allow.includes(".agents/skills/visual-identity/"));
  assert.ok(!art.deny.includes(".agents/"));
  assert.ok(art.deny.includes(".brainforge/SCOPES.json"));
  assert.ok(art.deny.includes(".brainforge/roles/"));
  assert.ok(scopes.canon.prefixes.includes(".agents/skills/visual-identity/"));
  assert.ok(!JSON.stringify(scopes.canon).includes("<CANON_PATHS>"));
});

test("adding specialists closes skill dependencies and requires their placeholders before writing", (t) => {
  const f = fixture(t);
  f.answers.agents.push("doc-steward");
  f.save();
  const incomplete = f.create();
  assert.equal(incomplete.status, 2);
  assert.match(incomplete.stderr, /CACHE_SKILL/);
  assert.equal(fs.existsSync(f.target), false);
  for (const name of ["doc-steward"]) {
    for (const key of catalog.agents[name].placeholders || []) f.answers.placeholders[key] = `example-${key.toLowerCase()}`;
    for (const skill of catalog.agents[name].needs_skills || []) for (const key of catalog.skills[skill].placeholders || []) f.answers.placeholders[key] ??= `example-${key.toLowerCase()}`;
  }
  f.save();
  assert.equal(f.create().status, 0);
  const scopes = JSON.parse(fs.readFileSync(path.join(f.target, ".brainforge", "SCOPES.json"), "utf8"));
  assert.ok(scopes.write["doc-steward"].allow.includes(".agents/skills/example-cache_skill/SKILL.md"));
});

test("Git creates a main branch with fixture identity and fails closed without identity", (t) => {
  const probe = spawnSync("git", ["--version"], { encoding: "utf8" });
  if (probe.status !== 0) return t.skip("Git is not installed");
  const f = fixture(t);
  const config = path.join(f.temp, "gitconfig");
  fs.writeFileSync(config, "[user]\n\tname = BrainForge Tests\n\temail = tests@example.invalid\n");
  const env = { ...process.env, GIT_CONFIG_GLOBAL: config, GIT_CONFIG_NOSYSTEM: "1", GIT_AUTHOR_NAME: "BrainForge Tests", GIT_AUTHOR_EMAIL: "tests@example.invalid", GIT_COMMITTER_NAME: "BrainForge Tests", GIT_COMMITTER_EMAIL: "tests@example.invalid" };
  const output = spawnSync(process.execPath, [entry, "--answers", f.file, "--target", f.target], { encoding: "utf8", env });
  assert.equal(output.status, 0, output.stderr);
  assert.equal(spawnSync("git", ["branch", "--show-current"], { cwd: f.target, encoding: "utf8", env }).stdout.trim(), "main");
  assert.equal(spawnSync("git", ["rev-parse", "--verify", "HEAD"], { cwd: f.target, encoding: "utf8", env }).status, 0);

  const missing = fixture(t);
  const invalid = { ...env, GIT_AUTHOR_NAME: "", GIT_AUTHOR_EMAIL: "", GIT_COMMITTER_NAME: "", GIT_COMMITTER_EMAIL: "" };
  const failure = spawnSync(process.execPath, [entry, "--answers", missing.file, "--target", missing.target], { encoding: "utf8", env: invalid });
  assert.equal(failure.status, 2);
  assert.match(failure.stderr, /--no-git/);
  assert.equal(fs.existsSync(missing.target), false);
});
