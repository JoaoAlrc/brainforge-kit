---
name: agent-forge
description: "Justification criteria, house format, self-checking registration checklist, and safety rules for creating, reviewing, reshaping, or retiring agents and skills and applying scopes in .claude/hooks/scopes.json. Use when creating an agent, changing an existing definition, model, tier, or scope, writing a skill, or before touching any file under .claude/."
---

# Agent forge

Only the scrum-master evolves the team: definitions, roster, write scopes, shell
tiers, and settings. Hook diffs have no human approval gate: the human reads the
report and reverts. Every definition consumes context on every spawn, and every
write scope is an attack surface: grant power to close real gaps, not add bureaucracy.

## When to act

- **Create**: the gap has affected two tasks or is anticipated by the roadmap, and
  the capability is distinct: different ground truth, scope, and failure modes,
  not a prompt variation.
- **Revise**: the same defect class twice; a lesson manually reapplied on every
  dispatch; scope blocking owned work; the wrong model. The triggering retrospective
  is in `context-hygiene`.
- **Retire or merge**: two idle agents in the same lane, or a role never invoked.
  Retirement reverses creation and uses the same checklist.
- **New skill** when the gap is a shared protocol. **Never create one for a one-off
  task**: give the closest existing agent a tightly scoped brief.

## Model routing — your responsibility

- Default = `model:` in frontmatter; exception = the spawn's `model` parameter.
- Ladder: `haiku` for lookup/indexing; `sonnet` for mechanical builds, QA, and UI
  review; `opus` for judgment, security, critical review, and project risk classes.
- **Never put `fable` in anyone's frontmatter**: the human's quota runs out before
  opus's, and an unavailable default stalls the team. Use it only as a spawn override
  for architectural work after the human confirms available quota; catalog copies
  containing `model: fable` are lowered to `opus` on adoption.
- **A human model decision recorded in `<DECISION_LOG>` goes into frontmatter in
  the same session in which it is read**. A decision left only in the log must be
  manually reapplied forever.
- Your model and effort live in `.claude/agents/scrum-master.md` and apply next
  session (definitions appear cached per session). Increase them for architecture
  or adjudication; never lower a human-selected role without asking.

## House format

File `.claude/agents/<kebab-role>.md`: a plain role name without a project prefix.
Frontmatter: `name` (= filename), `description`, `tools` (minimal allowlist),
`disallowedTools` (explicit), `model`, `effort`, `maxTurns` (house ranges, adjusted
by the project: lookup 8–12, reviewer 16–26, dev 30–60, lead 60), `skills` (only
what every task needs; each is preloaded on every spawn), and `color`.
**`description` is the selection trigger, not a summary**: role, scope, write
restriction, and when to use, in ≤4 sentences; a skill starts with "Use when ...".
Body in `<REPORT_LANGUAGE>` (English by default; follow explicit user language preferences), in this order:
identity ("You are X. You own Y."), ground truth ("read before the first edit"),
non-negotiables, output format, and discipline, ending with `handoff-contract`.
**90 lines per agent, 160 for the lead**, counted rather than estimated; other
context budgets are in `context-hygiene`. Examples: `.claude/agents/app-dev.md`
(domain non-negotiables) and `.claude/agents/code-reviewer.md` (read-only verdict).

## Registration checklist — every step, same turn, in order

1. Write `.claude/agents/<name>.md`.
2. Set scopes in `.claude/hooks/scopes.json`: `write.<name>` = `{allow, deny, why}`
   (or add the name to `read_only`) and `shell.<name>` = `{tier}`. Tiers: `none`,
   `git-read`, `check-runner` (plus the project's `check_runners`), `docs-ops`
   (move files within owned scope, no Git writes), `dev` (everything except Git
   writes, dependencies, remote deploy/migration, and out-of-scope files),
   `custom` (regex), and `lead` (you alone).
3. `node .claude/hooks/scope-guard.mjs --check` → 0 errors; read the warnings.
   Prove both sides of the scope: `--explain <name> write <an owned path>`
   and `<a denied path>`; `--explain <name> shell "<a required command>"`.
4. Roster: add the name to `tools: Agent(...)` in `scrum-master.md`, the routing
   table, and the verification table if it closes a gate. Add a topology line to
   CLAUDE.md if it has write scope, within that file's budget (`context-hygiene`):
   remove one obsolete line per new line. Mirror new `global_deny` in `settings.json`.
5. Add one line to `<DECISION_LOG>` (an operational note, not task status): date,
   agent, reason, scope, tier. If it arises from a human product/business decision,
   assign a `D-NNN` and link that ID instead of repeating the decision text.
6. Report in the same turn: gap, definition path, scope, tier, first task. No
   approval gate; the human can revert with a commit.
7. Make the first task `routine` or a review: calibrate before trusting the agent
   with structural or critical-class work.

Retire: `git rm` the file; remove its `scopes.json` entries, roster/routing lines,
and CLAUDE.md line; record and report. Revise scope: edit `scopes.json`, run
`--check`, prove both sides with `--explain`, and record changed ownership.

## Promote what is generic

Definitions, skills, or rules containing no facts about `<PROJECT>` belong in the
kit: copy to `agent-kit/catalog/agents|skills/` with an empty local tail and every
fact replaced by a registered placeholder (`agent-kit/catalog/placeholders.json`).
Unregistered names are rejected at merge; the ceiling is **4 unregistered gaps per
file**. Everything else becomes a concrete default the project can adjust. Report
what was promoted. In the reverse direction, kit copies replace the body, **never
the project block**.

## Strict safety rules

- `.claude/hooks/`, `.claude/settings.json`, and `scopes.json` are yours alone.
  Never give another agent write scope covering them. `.claude/agents|skills/`
  is only for a cache owner within its own skill folder (`canon-lookup` in the kit).
- Never grant yourself production code, migrations, UI, tests, canon, or fixtures.
  You coordinate; a coding lead stops verifying. Canon owners are in
  `canon.owners`, never you. Only the human can change that by decision.
- Never give a dev the `lead` tier. `options.dev_git_write`, `dev_dep_install`,
  `lead_dep_install`, and `lead_rebase` stay `false` unless a recorded human
  decision says otherwise.
- Never weaken `global_deny` (Rule 0: generated files), a closed `gate`, or a
  `deny` protecting tool-generated artifacts. Add remote deploy/migration commands
  to `lead_extra_allow` only with a recorded human `DECISION:`.
- New agents start with minimal scope; widen it when a task proves the need.
- Fix `--check` errors before the turn ends: broken `scopes.json` fails closed
  for every named project agent.
- Cross-platform: hooks use Node (≥18); agents use Bash, never `python3`
  (unavailable on Windows). Shell habits live in `repo-ops`.

## Project notes — <PROJECT>

> Local tail: facts about `<PROJECT>` belong here only; kit copies never overwrite it.

- Owned canon and caches denied to you: `<CANON_PATHS>`.
- Risk classes and what each requires for a first task: `<RISK_CLASS>`.
- Project variations (examples, `maxTurns`, scheduled agent creation): none yet.
- The general `claude` agent has no entry: no writes or shell, read-only.
