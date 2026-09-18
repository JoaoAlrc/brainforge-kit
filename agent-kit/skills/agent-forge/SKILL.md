---
name: agent-forge
description: How the scrum-master creates, revises, re-models or retires agents and skills and applies their scopes itself in .claude/hooks/scopes.json — the justification bar, the house format, the registration checklist with its self-check, and the safety rules. Load before touching anything under .claude/.
---

# Agent forge

The scrum-master alone evolves the team, end to end: definition, roster,
write scope, shell tier, settings. No human-gated hook diff — the human
reads the report and can revert. The power exists to close real gaps and
remove real friction, not to grow bureaucracy: every agent definition is
context loaded on every spawn, every write scope is attack surface.

## When to act

- **Mint** when a competence gap has hit two or more tasks, or the roadmap
  schedules it, and the competence is genuinely distinct — different ground
  truth, scope and failure modes — not a variant prompt of an existing role.
- **Revise** when an agent bounces the same defect class twice · a lesson is
  re-applied by hand in every dispatch (it belongs in the agent's own
  prompt, not in the backlog) · its scope blocks work it legitimately owns ·
  its model is wrong for the work.
- **Retire or merge** when two agents idle in the same lane or a role is
  never spawned. Retirement is a mint in reverse: same checklist.
- **Write a skill instead** when the gap is a shared protocol.
- **Don't mint for a one-off** — brief the closest existing agent tightly.

## Model routing — you own it

- Default = `model:` in the agent's frontmatter. Per-task override = the
  `model` parameter when you spawn it (a `critical` task to a sonnet dev →
  spawn with opus). Frontmatter for the rule, the spawn parameter for the
  exception.
- Ladder: `haiku` lookup/index · `sonnet` mechanical build, QA, volume
  research · `opus` judgment, review, canon, money · `fable` the one or two
  highest-leverage creative/architectural roles — never a default.
- **A human ruling about models recorded in BACKLOG/ROADMAP is applied to
  the frontmatter in the same session it is found.** A ruling that lives only
  in the backlog is re-applied by hand forever.
- Your own model and effort live in `.claude/agents/scrum-master.md`; a
  change takes effect at the next session. Raise it for a session that is
  mostly architecture or adjudication; never lower a role the human pinned
  (check ROADMAP decisions) without asking.

## The `workflow-subagent` identity — not a role you mint

An `agent()` call inside a `Workflow` script presents the hook a generic
`workflow-subagent` identity, not the name of any persona file — there is
none to write. `scopes.json` ships `write.workflow-subagent` (a sandbox:
`work/probes/`, `work/qa/`) and `shell.workflow-subagent` (`check-runner`)
for exactly this. Never widen it — a lens that needs more than a sandbox and
a check-runner shell runs as a real named `Agent` instead. `--check` warns
that it has no matching `.claude/agents/` file; that warning is expected,
not a defect — do not silence it by writing a persona file for it.

## House format

File `.claude/agents/<kebab-role>.md`, plain role name, no project prefix.
Frontmatter: `name` (= filename) · `description` (role + scope + write
constraint + when to use, ≤4 sentences) · `tools` (minimal allowlist) ·
`disallowedTools` (explicit) · `model` · `effort` · `maxTurns` (8 lookup /
16–22 reviewer / 30 default) · `skills` (only what every task needs — each
one is preloaded on every spawn) · `color`.
Body, in order: identity ("You are X. You own Y.") · ground truth ·
non-negotiables · output format · discipline, ending with the
`handoff-contract` reference. **≤ 90 lines** — measured by
`context-budget`. Study the project's exemplar agent named in CLAUDE.md.

**If the deliverable is a report or an audit, add a turn-budget clause**
(convergent across six projects, after two measured incidents: one burned
~800k tokens across five review agents that returned nothing, another a
30-turn/101k-token pass that returned nothing). The clause: (1) start
writing the deliverable at the halfway point and append findings
incrementally with Edit — never hold everything for one final Write;
(2) stop *investigating* at ~2/3 of `maxTurns` and write up what you have;
(3) report unreached scope as an explicit finding ("the brief was wider
than the budget"), never a silent omission; (4) never spend more than ~3
tool calls chasing one question — write a ❓ and move on. This is a template
addition, not a retrofit — it does not change what any agent already in
flight does.

## Registration checklist — all steps, same turn, this order

1. Write `.claude/agents/<name>.md`.
2. Scope it in `.claude/hooks/scopes.json`: `write.<name>` = `{allow, deny,
   why}` — or add it to `read_only` — and `shell.<name>` = `{tier}`.
   Tiers: `none` · `git-read` · `check-runner` (git-read + the project's
   `check_runners`) · `docs-ops` (file moves inside its write scope, no git
   writes) · `dev` (anything except git writes, dependency changes and file
   mutations outside its write scope) · `custom` (`allow` regex list) ·
   `lead` (you only).
3. `node .claude/hooks/scope-guard.mjs --check` → 0 errors, read the
   warnings. Then prove the scope both ways:
   `--explain <name> write <a path it must own>` and `<a path it must not>`;
   `--explain <name> shell "<a command it needs>"`.
4. Roster: add the name to `tools: Agent(...)` in `scrum-master.md`, to the
   routing table, and to the verification table if it closes a gate. Add its
   topology line to CLAUDE.md if it has a write scope (stay inside CLAUDE.md's
   line budget — drop a stale line for every new one).
5. Record one line in `docs/tasks/ROADMAP.md` decisions (or a `## Decisions`
   list in BACKLOG.md when the project has no ROADMAP): date · agent · why ·
   scope · tier.
6. Report to the human in the same turn: the gap, the definition path, the
   scope and tier, the first task. No approval needed; the human can revert
   with one commit.
7. The first task is `routine` or review-tier — calibrate before trusting
   it with structural, canon or money work.

Retire: `git rm` the file, remove its `scopes.json` entries, the roster and
routing lines, the CLAUDE.md line; record; report.
Revise a scope: edit `scopes.json`, `--check`, `--explain` both sides, record
if ownership changed.

## Safety rules — hard

- `.claude/hooks/`, `.claude/settings.json` and `scopes.json` are yours
  alone. Never give another agent a write scope that covers them.
  `.claude/agents|skills/` only to a cache owner, for its own skill folder.
- Never grant yourself production code, tests, or canon. You coordinate; a
  lead who codes stops verifying. Canon owners are named in `canon.owners`
  — never you. The human can change this by ruling; you don't.
- Never grant a dev the `lead` tier. `options.dev_git_write`,
  `dev_dep_install`, `lead_dep_install`, `lead_rebase` stay `false` unless
  the human rules otherwise, and the ruling is recorded.
- Never weaken a `global_deny`, a closed `gate`, or a compliance gate — those
  are human rulings.
- A minted agent starts with the minimum scope; widen when a task proves it.
- `--check` errors are fixed before the turn ends: a broken `scopes.json`
  fails closed for every named agent in the project.
- Cross-platform: hooks are Node, agents use the Bash tool. Never a
  PowerShell-only script, never `python3` (Windows has no python3).
