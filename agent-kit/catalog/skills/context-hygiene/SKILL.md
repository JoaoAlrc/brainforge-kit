---
name: context-hygiene
description: "Keeps project documents within their context budgets: what grows, how to measure it, and archival/splitting/indexing procedures that shrink files without losing history. Use on context-budget violations, at every session close, before adding anything except a status line to BACKLOG.md, and when a session seems expensive (token audit)."
---

# Context hygiene

Every file an agent reads is paid for on every read by every agent: `BACKLOG.md`
at every planning step, `CLAUDE.md` in every subagent, an agent definition on every
spawn. A 3,000-line backlog costs ~50k tokens per session before work begins.
Budgets keep *loaded* content small; history remains where planning does not load it.

## Budgets

Measured by `node .claude/hooks/context-budget.mjs` (runs on SessionStart with
`--brief`; run without that flag for the complete list).

| File | Budget |
| :-- | :-- |
| `CLAUDE.md` | Its header's declared budget (80–110; mirrored in `context-budget.json`) |
| `docs/tasks/BACKLOG.md` | 100 lines |
| `docs/tasks/ROADMAP.md` | 250 lines |
| `docs/tasks/TASK-*.md` | 220 lines |
| `.claude/agents/*.md` | 90 lines (lead: 160) |
| `.claude/skills/*/SKILL.md` | 170 lines; longer material goes in `references/` |
| `.claude/rules/*.md` | 120 lines |
| Any non-canon document | 60 KB → splitting candidate |

A number has one home. `agent-forge` defines agent budgets (**90 lines, 160 for
the lead**); `context-budget.json` follows it, never the reverse. If they disagree,
the source wins and configuration is corrected in the same session. To actually
change a budget, edit the configuration and record reason/date in `<DECISION_LOG>`.

## What grows, and where it goes

| Symptom in a loaded file | Move to |
| :-- | :-- |
| Session-close narratives and "what happened" prose | `docs/tasks/LOG.md`: append-only, dated `##` headings, never loaded for planning |
| "SUPERSEDED — retained for the record" blocks | `docs/tasks/archive/` |
| `DONE` task lines and evidence | One line each in `docs/tasks/archive/DONE.md` (ID, date, evidence) |
| Human decisions repeated across files | One dated line in `<DECISION_LOG>`; other files link to it |
| "Permanent rules" actually describing agent behavior | That agent's definition or a skill, through `agent-forge` |
| Environment facts (paths, versions, machine quirks) | `docs/agent-ops/ENVIRONMENT.md`, ≤40 lines |
| Audit/research reports over 60 KB | A folder split by heading plus an index of ≤40 lines |
| Duplicate copies (clean clone, old plan) | Report to the human; do not delete other people's copies |

## Procedure — never lose a byte

1. **Measure.** `wc -l docs/tasks/BACKLOG.md`; `grep -n '^#' docs/tasks/BACKLOG.md`
   shows sections. Never read the entire file to decide what to cut.
2. **Choose what stays:** what a new session needs to *plan*: status board,
   active blockers, next task, binding decisions as one line or link. Everything
   else is history.
3. **Move, do not delete.** Write extracted content to its destination first
   (Write; `git mv` only for whole files with Git write access, otherwise the lead
   stages it). Verify `lines(before) = lines(remaining) + lines(moved)`, then trim.
4. **Leave a pointer** where the content was:
   `History → docs/tasks/LOG.md (do not load for planning).`
5. **Measure again**; report before/after lines and tokens saved (≈0.27 token/byte).
6. **Commit separately**, one commit per trimmed file. The hygiene message is
   defined in `repo-ops`; do not reinvent it here.

## Rules

- Hygiene never touches canon (`canon.prefixes` in `scopes.json`, possibly empty).
  Only owners may change it through the canon process.
- Moving is not editing: never change a task's `Status:`, a decision's wording,
  or ordering inside a moved block.
- Never archive an open blocker, unapplied human decision, or item "owed to the
  human": keep one line for each until resolved.
- Moving >200 lines goes to `docs-janitor`, with the retained set explicit in the
  brief. Handle ≤200 lines yourself (and everything if there is no janitor).
- Index files (`README`, `00-START-HERE`) stay ≤40 lines: what exists, where,
  and what to load when.
- Documents too dense for their budget (a spec) are split by heading, never
  summarized: `docs/research/2026-03-market/01-method.md`, `02-findings.md`, plus index.
- Read `BACKLOG.md`/`ROADMAP.md` **once per session**; retain the facts in your
  context instead of rereading before each dispatch.

## Token audit — optional, heavier, on demand

`node .claude/hooks/token-audit.mjs [--sessions N] [--brief]` reads this project's
local session logs (`~/.claude/projects/`) and reports per session: input,
cache-write, cache-read, output (MEASURED from the SDK's `usage` field, never
estimated), cache hits, models, largest tool outputs entering context, and files
reread by the same top-level agent. It ends with
`PROBLEM | COST | FREQUENCY | IMPACT | EVIDENCE`, each row MEASURED or ESTIMATED.
Read-only by construction; writes nothing.

It does not run automatically: logs weigh 20–250 MB. Run when a session seems
expensive, monthly, or on request. It marks UNAVAILABLE data: MCP/plugin connector
preload (an account cost, fixed once in `~/.claude/settings.json`, not per project)
and dollar cost, which is absent from logs. The recurring finding is rereading
`BACKLOG.md`/`ROADMAP.md` 5–20 times.

## Session-close retrospective — two minutes, every session

- File over budget? Fix now if ≤200 lines; otherwise brief `docs-janitor` before
  ending the turn.
- Lesson manually reapplied this session? Use `agent-forge` to put it in the
  responsible agent's definition.
- An agent returned the same defect class twice? Revise the definition.
- Two agents searched for the same fact? Put the summary in the task file once.
- Act now; do not leave a reminder for another session.

## Project block — <PROJECT>

Facts about this project. **Never overwritten by a kit copy**: the rest of the
file may be updated from the catalog; this block may not.

- Canon excluded from hygiene: `<CANON_PATHS>`.
- Binding decisions live in `<DECISION_LOG>`.
- Budgets follow the table unless `.claude/hooks/context-budget.json` says otherwise;
  record differences with reason/date in `<DECISION_LOG>`.
- Large folders: each `docs/` folder archives in its own `archive/`
  (`docs/research/archive/`, `docs/audits/archive/`); session narratives go in
  `docs/tasks/LOG.md`. None of this returns to a loaded file.
