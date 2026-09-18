---
name: codex-coexistence
description: "Use when Claude and Codex share the <PROJECT> repository: at lead session start, before touching paths the other runtime may be editing, when handing it board tasks or receiving its work, and whenever .claude/ and .codex/ or .agents/ diverge. Defines path ownership, active-run detection, and the single source for hooks."
---

# Coexisting with Codex

The human switches between Claude and Codex, sometimes running Codex while Claude
reads. Neither reports to the other or communicates directly: the human starts
runs, and `<BOARD>` is their meeting point. The approach is ownership by **path**
(which Git understands), three columns, and labeled evidence on both sides
(📏 📄 🔮 ❓ are defined in `handoff-contract`; do not repeat their definitions here).

## Codex-owned — never edited by Claude

`.codex/`, `.agents/`, `AGENTS.md`, everything its tools generate
(`<GENERATED_FILES>`), and its side of shared directories. The hook denies access
through `global_deny`. Stale content here is **reported to the human**, numbered,
never repaired. Suggestions for the Codex kit are report text, not files.

Convention: one directory per subject, one subdirectory per runtime. Codex owns
`<DOCS_ROOT>/codex/` and `<EVIDENCE_DIR>/codex/`; you own `<DOCS_ROOT>/claude/` and
`<EVIDENCE_DIR>/claude/`. Each runtime owns its instruction file: `CLAUDE.md` is
🔵, `AGENTS.md` is 🟠. Neither is a shared append-only file.

## Hooks: one source, not copies

A hook in two files creates two truths, which drift apart.

- The actual engine is `.claude/hooks/<name>.mjs`. `.codex/hooks/<name>.mjs` is a
  **one-line shim**, `import "../../.claude/hooks/<name>.mjs";`, relative to itself
  and therefore independent of the triggering process's cwd. (`<name>` is
  intentionally lowercase: it is the hook name, not an unresolved placeholder.)
- **There is no configuration in `.codex/hooks/`.** Configuration resolves from
  the actual module's location: both runtimes read `.claude/hooks/*.json`.
  Never restore the duplicate.
- Any executable shim line beyond the import creates a disguised fork. Creating
  or changing a shim changes a cross-runtime contract: ⚠️ coordinate.
- `.agents/skills/` remains **real files** and diverges by design (the Codex
  harness does not import Markdown). Report divergence; do not synchronize it.
- Check with `node .claude/hooks/check-runtime-drift.mjs` (`--strict` exits 1).
  It **reports** only: synchronizing `.codex/` from `.claude/` would be unilateral
  cross-runtime editing in the ⚠️ column. Shims count as one source, not drift;
  absolute wiring paths (`.codex/hooks.json`, `.codex/config.toml`) are a portability
  risk to report.

## Detect an active Codex run — before any edit

```bash
git status --short
ls -la --time-style=long-iso <EVIDENCE_DIR>/codex/ | tail -3
```

- Modified/untracked files **you** did not touch this session belong to Codex.
  Do not edit or `git add` them; record them in the handoff.
- Evidence dated today and newer than the last commit means a run is active.
  Wait for human confirmation before touching any ⚠️ path or code both runtimes edit.
- An existing tool lock (`.godot/*.lock`, `Temp/UnityLockfile`, or `<ENGINE>`'s build
  lock) means an editor is open, owned by Codex or the human. Never build, remove
  the lock, or terminate the process.
- Pause the other side's scheduled automation **before** requesting analysis:
  a delivery during an audit makes every measurement a moving target.

## Three columns — by path

| 🔵 Claude — Codex asks before editing | 🟠 Codex — Claude asks before editing | ⚠️ Coordinate — one at a time, human decision |
| :-- | :-- | :-- |
| `.claude/`, `CLAUDE.md`, `<DOCS_ROOT>/claude/` | Everything listed above | `<BOARD>`: each in its own section |
| Canonical measurement instrument | Build, platform, localization, generated art, prompts | `<CANON_PATHS>` · `<COORDINATE_PATHS>` |
| Rule core and measurement-dependent code | Broad regression suites, captures, evidence docs | Save/migration contract, project config, large file (~500 lines) both want |

Other code is **serialized by task**: the owner of the board's `IN-PROGRESS` row
owns that file until closure. Two owners of one file: extract; if impossible,
serialize. Never work in parallel on it.

## Hand work to Codex

It reads `AGENTS.md`, its evidence side, and the board, not `<DOCS_ROOT>/claude/`.
A 🟠 row must be self-contained: ID, one-sentence task, **files touched**,
verifiable completion criterion, and required evidence. Without a file column,
the table is decoration. The human starts the run.

🟠 profile: substantial well-specified implementation, art/prompts, bootstraps,
build/platform, localization, broad regression, captures/evidence documentation,
and editorial research. 🔵 profile: root cause of incorrect numbers, measurement
instrument design, document/code contradictions, contracts between layers,
module extraction, and costed design proposals.

## Receive Codex's work

On resuming, read **only the top block** (latest round) in `<EVIDENCE_DIR>/codex/`,
`git log --oneline -5`, and the board diff. Its PASS is 📄 until a Claude agent
reproduces the command. Do not repeat routine verification; repeat it when your
task depends on that fact.

## Never

- Write Claude results on its side (`<DOCS_ROOT>/codex/`, `<EVIDENCE_DIR>/codex/`)
  "for the record": yours go on your side and in the handoff; the human decides
  what Codex adopts.
- Revert or "fix" its work on your initiative. Contradicts canon? Report numbered
  findings to the human.
- Build while today's log is growing in `<EVIDENCE_DIR>`, or manually edit
  generated files (`<GENERATED_FILES>`) to bypass their tool.
- Create another STATE, index, or bible: the board is the meeting point.

## Project block — <PROJECT>

<!-- Project facts. A new kit copy replaces everything above, never this block. -->

- Board `<BOARD>`; canon `<CANON_PATHS>`; extra ⚠️ paths: `<COORDINATE_PATHS>`.
- Docs `<DOCS_ROOT>` and evidence `<EVIDENCE_DIR>`: `/claude` is yours, `/codex` is theirs.
- Generated `<GENERATED_FILES>`; `<ENGINE>` lock/build; other Codex-owned root files (e.g. `README.md`).
