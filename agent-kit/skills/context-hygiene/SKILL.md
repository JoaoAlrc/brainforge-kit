---
name: context-hygiene
description: Keeping the project's documents inside their context budgets — what bloats, how to measure it, and the archive/split/index procedures that shrink a file without losing a byte of history. Load when context-budget reports a violation, at every session close, and before writing anything into BACKLOG.md that is not a status line.
---

# Context hygiene

Every file an agent reads is paid for on every read, by every agent that
reads it. `BACKLOG.md` is read at every planning step; `CLAUDE.md` is loaded
into every subagent; an agent definition is loaded on every spawn. A
3,000-line backlog costs ~50k tokens per session before any work starts.
Budgets keep the file that gets *loaded* small. History still exists — in a
file nobody loads to plan.

## Budgets

Measured by `node .claude/hooks/context-budget.mjs` (runs at SessionStart
with `--brief`; run it yourself without the flag for the full list).

| File | Budget |
| :-- | :-- |
| `CLAUDE.md` | the budget its own header states (80–110; mirrored in `context-budget.json`) |
| `docs/tasks/BACKLOG.md` | 100 lines |
| `docs/tasks/ROADMAP.md` | 250 lines |
| `.claude/agents/*.md` | 100 lines (`scrum-master.md` 160) |
| `.claude/skills/*/SKILL.md` | 170 lines — longer material goes to `references/` |
| `docs/tasks/TASK-*.md` | 220 lines |
| any non-canon doc | 60 KB → split candidate |

Adjust a budget in `.claude/hooks/context-budget.json` only with a reason
recorded in the ROADMAP decisions.

## What bloats, and where it goes instead

| Symptom in the loaded file | Move it to |
| :-- | :-- |
| session-close narratives, "what happened" prose | `docs/tasks/LOG.md` — append-only, dated `##` headings, never loaded to plan |
| "SUPERSEDED — kept for the record" blocks | `docs/tasks/archive/` |
| `DONE` task rows with their evidence | one line each in `docs/tasks/archive/DONE.md` (id · date · evidence) |
| human rulings repeated across files | one dated line each under `## Decisions` in ROADMAP.md (or `docs/tasks/RULINGS.md`); other files link |
| "standing rules" that are really how an agent should behave | the agent's own definition or a skill — via `agent-forge` |
| environment facts (paths, versions, machine quirks) | `docs/agent-ops/ENVIRONMENT.md`, ≤40 lines |
| audit / research reports over 60 KB | a folder split by heading + a ≤40-line index |
| duplicate copies (a clean-clone directory, an old plan) | report to the human — you don't delete other people's copies |

## Procedure — never lose a byte

1. **Measure.** `wc -l <file>`; `grep -n '^#' <file>` to see its sections.
2. **Decide the keep-set:** what a fresh session needs to *plan* — the status
   board, active blockers, the next task, binding decisions as one-liners or
   links. Everything else is history.
3. **Move, don't delete.** Write the extracted sections to their destination
   first (Write, or `mv` for whole files — `git mv` only as the scrum-master;
   `docs-janitor` has no git write, the lead stages its moves); verify
   `lines(before) = lines(kept) + lines(moved)`; only then trim the source.
4. **Leave a pointer** — one line where the content was:
   `History → docs/tasks/LOG.md (do not load to plan).`
5. **Re-measure** and report before/after lines and the tokens saved
   (≈ 0.27 tokens per byte).
6. **Commit it alone:** `docs(hygiene): <file> <before>→<after> lines`
   (repo-ops).

## Rules

- Canon (`docs/game-design-bible/`, `docs/canon/`, whatever `canon.prefixes`
  names) is never touched by hygiene. Owners only, through the canon process.
- Moving is not editing: never change a task `Status:`, a ruling's wording,
  or the order inside a moved block.
- Never archive an open blocker, an unapplied human ruling, or an
  "owed to the human" item — they stay, as one line each, until resolved.
- Delegate bulk moves (> 200 lines) to `docs-janitor` with the keep-set
  spelled out in the brief; do the ≤ 200-line trims yourself.
- Index files (`README`, `00-START-HERE`) stay ≤ 40 lines: what exists,
  where, what to load when.
- A doc over budget because it is genuinely dense (a spec) is split by
  heading into `<name>/NN-section.md` plus an index — never summarized.

## Token audit — optional, heavier, on demand

`node .claude/hooks/token-audit.mjs [--sessions N] [--brief]` reads this
project's own local session logs (`~/.claude/projects/<this-project>/*.jsonl`)
and reports, per session: input/cache-write/cache-read/output tokens (MEASURED,
copied from the SDK's own `usage` field — never guessed), cache-hit rate,
models used, the biggest tool outputs that landed in context, and files read
repeatedly by the same top-level agent within one session. It closes with a
`PROBLEM | COST | FREQUENCY | IMPACT | EVIDENCE` table, each line marked
MEASURED or ESTIMATED. It never writes anything and is read-only by construction.

Not run automatically — logs run 20–250MB, scanning ten of them takes real
seconds. Run it yourself when a session felt expensive, monthly, or when the
human asks for a token audit. What it will NOT tell you (UNAVAILABLE, and it
says so): account-level MCP connector / plugin preload — that cost is paid on
every project regardless of what this repo does, isn't in these per-project
logs, and is fixed once, at the account level (`enabledPlugins` in
`~/.claude/settings.json` and the connector list), not per project. Dollar
cost is also UNAVAILABLE — pricing tiers aren't in the log.

The one pattern this tool keeps finding across every project it has been run
on: `docs/tasks/BACKLOG.md` / `ROADMAP.md` re-`Read` by the same top-level
agent 5–20× within a single session — the exact bloat this skill's budgets
exist to prevent, plus a habit fix: read the file once per session, keep the
fact in your own context, don't re-`Read` it before every dispatch.

## Retro at session close — two minutes, every session

- A file over budget? Fix it now if ≤ 200 lines; otherwise brief
  `docs-janitor` before you end the turn.
- A lesson you re-applied by hand this session? `agent-forge`: put it in the
  agent's own definition.
- An agent bounced twice on the same defect class? Revise its definition.
- Two agents looked up the same fact? The librarian summary belongs in the
  task file, once.
- Act on these; don't write them down as notes for a future session.
