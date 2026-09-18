import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { gerarOutrosClientes } from "./client-adapters.mjs";

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "brainforge-clients-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const kit = path.join(root, "kit");
  const put = (rel, value) => {
    const file = path.join(kit, rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, value);
  };
  put("catalog/agents/reviewer.md", "---\nname: reviewer\ndescription: Review <PROJECT>\nmodel: opus\ntools: Read, Grep, Glob, Bash, Skill\n---\nReview the canon in docs/canon.\n");
  put("catalog/agents/dev.md", "---\nname: dev\ndescription: Implement <PROJECT>\nmodel: sonnet\n---\nImplement the scoped task.\n");
  put("catalog/skills/example/SKILL.md", "---\nname: example\ndescription: Use to inspect <PROJECT>\nallowed-tools: Bash\n---\nConsult references/check.md and .claude/skills/example/.\n");
  put("catalog/skills/example/references/check.md", "Canon: <PROJECT>.\n");
  put("catalog/skills/example/assets/sample.bin", Buffer.from([0, 128, 255, 10]));
  const catalog = { agents: { reviewer: { purpose: "Review the code", read_only: true, write: [], needs_skills: ["example"] }, dev: { purpose: "Implement changes", write: ["src/"] } }, skills: { example: { purpose: "Use for inspection" } } };
  const answers = { name: "Example", lead: "dev", runtimes: ["kimi", "gemini"], agents: ["reviewer", "dev"], skills: ["example"], placeholders: { PROJECT: "Example" } };
  const target = path.join(root, "project");
  const output = new Map();
  const substitute = (text, placeholders) => Object.entries(placeholders || {}).reduce((s, [key, value]) => s.split(`<${key}>`).join(value), text);
  const write = (file, value) => { output.set(path.relative(target, file).split(path.sep).join("/"), value); };
  const options = { kit, catalog, answers, target, write, substitute };
  return { ...options, root, output, options };
}

test("clients are opt-in and Claude-only generates nothing", t => {
  const f = fixture(t);
  f.answers.runtimes = ["claude"];
  gerarOutrosClientes(f.options);
  assert.equal(f.output.size, 0);
});

test("Codex gets portable roles and discoverable skills without other clients", t => {
  const f = fixture(t);
  f.answers.runtimes = ["codex"];
  gerarOutrosClientes(f.options);
  assert.ok(f.output.has(".brainforge/roles/reviewer.md"));
  assert.match(f.output.get(".brainforge/roles/reviewer.md"), /Skills required by this role: example/);
  assert.ok(f.output.has(".agents/skills/example/SKILL.md"));
  assert.ok(!f.output.has("AGENTS.md"));
  assert.ok(!f.output.has("GEMINI.md"));
  assert.ok(![...f.output.keys()].some(p => p.startsWith(".kimi-code/")));
});

test("portable skills use valid minimal metadata and retain references and binary assets", t => {
  const f = fixture(t);
  gerarOutrosClientes(f.options);
  const skill = f.output.get(".agents/skills/example/SKILL.md");
  assert.match(skill, /^---\nname: "example"\ndescription: /);
  assert.doesNotMatch(skill, /allowed-tools:/);
  assert.doesNotMatch(skill, /<PROJECT>/);
  assert.match(skill, /references\/check.md/);
  assert.match(skill, /\.agents\/skills\/example/);
  assert.equal(f.output.get(".agents/skills/example/references/check.md"), "Canon: Example.\n");
  assert.deepEqual(f.output.get(".agents/skills/example/assets/sample.bin"), Buffer.from([0, 128, 255, 10]));
});

test("Kimi profiles use native fields and constrain read-only agents without shell", t => {
  const f = fixture(t);
  gerarOutrosClientes(f.options);
  const profile = f.output.get(".kimi-code/agents/reviewer.md");
  const header = profile.split("---\n")[1];
  assert.match(header, /name: "reviewer"/);
  assert.match(header, /tools: \["Read","ReadMediaFile","Grep","Glob","Skill"\]/);
  assert.match(header, /subagents: \[\]/);
  assert.doesNotMatch(header, /Bash|Write|model:|effort:|maxTurns/);
  assert.match(profile, /\$\{base_prompt\}/);
  assert.match(profile, /\.brainforge\/roles\/reviewer.md/);
  assert.ok(f.output.has(".kimi-code/AGENTS.md"));
  assert.ok(f.output.has("AGENTS.md"));
});

test("Kimi maps research tools and preserves explicit edit denial", t => {
  const f = fixture(t);
  fs.writeFileSync(path.join(f.kit, "catalog/agents/researcher.md"), "---\nname: researcher\ndescription: External research\ntools: Read, Grep, Glob, Write, WebSearch, WebFetch, TodoWrite, Skill\ndisallowedTools: Edit, Bash, Agent\n---\nResearch only.\n");
  f.answers.agents.push("researcher");
  f.catalog.agents.researcher = { purpose: "Research", write: ["docs/research/"], shell: "none" };
  gerarOutrosClientes(f.options);
  const header = f.output.get(".kimi-code/agents/researcher.md").split("---\n")[1];
  assert.match(header, /"Write"/);
  assert.match(header, /"WebSearch"/);
  assert.match(header, /"FetchURL"/);
  assert.match(header, /"TodoList"/);
  assert.doesNotMatch(header, /"Edit"|"Bash"|"Agent"|WebFetch|TodoWrite/);
});

test("Gemini imports shared instructions without changing settings or approvals", t => {
  const f = fixture(t);
  gerarOutrosClientes(f.options);
  assert.match(f.output.get("GEMINI.md"), /@\.\/\.brainforge\/COORDINATION.md/);
  assert.ok(![...f.output.keys()].some(p => /settings\.json|config\.toml|hooks/.test(p)));
  const coordination = f.output.get(".brainforge/COORDINATION.md");
  assert.match(coordination, /SCOPES\.json/);
  assert.match(coordination, /declarativ/);
});

test("shared files coexist with Codex and every write stays under target", t => {
  const f = fixture(t);
  f.answers.runtimes.push("codex");
  gerarOutrosClientes(f.options);
  assert.ok(!f.output.has("AGENTS.md"));
  for (const file of f.output.keys()) assert.ok(!file.startsWith(".."), file);
});

test("invalid identifiers and missing source files fail before writing anything", t => {
  for (const name of ["../escape", "not-in-catalog"]) {
    const f = fixture(t);
    f.answers.agents.push(name);
    assert.throws(() => gerarOutrosClientes(f.options), /agent|identifier|catalog/i);
    assert.equal(f.output.size, 0);
  }
  const f = fixture(t);
  fs.unlinkSync(path.join(f.kit, "catalog/skills/example/SKILL.md"));
  assert.throws(() => gerarOutrosClientes(f.options), /SKILL\.md/);
  assert.equal(f.output.size, 0);
});

test("writer can preserve existing user files without side effects from the adapter", t => {
  const f = fixture(t);
  fs.mkdirSync(f.target, { recursive: true });
  fs.writeFileSync(path.join(f.target, "GEMINI.md"), "My instructions\n");
  f.options.write = (file, content) => {
    if (fs.existsSync(file)) return false;
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
    return true;
  };
  gerarOutrosClientes(f.options);
  assert.equal(fs.readFileSync(path.join(f.target, "GEMINI.md"), "utf8"), "My instructions\n");
  assert.ok(fs.existsSync(path.join(f.target, ".agents/skills/example/SKILL.md")));
  assert.ok(!fs.existsSync(path.join(f.target, ".claude")));
});
