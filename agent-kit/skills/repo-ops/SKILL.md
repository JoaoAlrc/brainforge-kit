---
name: repo-ops
description: How the scrum-master runs git, migrations and machine-specific commands itself — pull before work, one scoped commit per DONE task, push at close, the never-rewrite rule, two-machine (Windows + macOS) hygiene, and what still needs a human word. The hook (scope-guard) enforces the hard limits; this skill sets the habits.
---

# Repo ops

You have a shell (tier `lead`). Use the **Bash tool** on both machines —
Git Bash on Windows, zsh on macOS — so every command in this skill works
unchanged. Never PowerShell-only cmdlets; never `> nul` (in Git Bash that
creates a file named `nul` — use `/dev/null`).

## Session start

1. `git status --short && git log --oneline -5` — know the tree before you plan.
2. `git pull --ff-only`. If it fails: `git fetch && git status`, report the
   divergence; `git pull --no-rebase` (a merge) is allowed; rebase never.
3. Untracked strays → **report, never delete** (except what your own session
   created). `git status --short` shows them; `git clean -ndx` previews them
   without touching anything — it never deletes unless you pass `-f`, which
   you do not. Read that preview correctly: `node_modules/`, `.expo/`,
   `.godot/`, `.turbo/`, `.output/`, `.wrangler/`, `android/`, `ios/` and
   `.env` are gitignored **on purpose** and are not junk. Real junk looks
   like: a file whose name is a mangled path (a `>` redirect that never
   expanded), `nul` on Windows, an orphan `*.patch`, a duplicate clone
   directory with its own `.git`, a debug scaffold committed by accident.
   Name them in your report with one line each and let the human decide —
   an in-progress file and a leftover look identical from here.
4. Read the context-budget report printed at session start and act on it
   (`context-hygiene`).

## Commits — one per DONE task, by you

- Check `git status` first: a scoped add on a dirty index still carries what
  was already staged. `git restore --staged .` clears the index if needed.
- `git add <path> <path>` — the files named in the handoff, never `-A` or `.`.
- Message: `TASK-NNN: <what changed> (<risk class>)`. Hygiene:
  `docs(hygiene): <file> <before>→<after> lines`. Team:
  `team: mint|revise|retire <agent> — <why>`.
- `git push` at session close. On two machines, uncommitted work on one is
  invisible to the other: nothing stays uncommitted overnight.
- **Never rewrite history**: no `--amend`, `rebase`, `push --force`,
  `reset --hard`, `clean`, `checkout <path>`, `restore <path>` — the hook
  blocks them, and Lovable-synced repos read git history directly. To undo a
  bad change: the owning agent reverts it with Write/Edit, or `git revert`.

## Branches

`main` by default. A risky spike: `git switch -c spike/<name>`, then
`git merge --no-ff spike/<name>` and `git branch -d spike/<name>`. Delete a
branch only when it is merged (`-d`, never `-D`).

## Migrations

See the project block at the end of this file. Rules everywhere:
- You supply the migration's number/timestamp in the task file; the owning
  dev writes it; **never two migration-authoring tasks in parallel**;
  migration before its consumer, never beside it.
- Applying locally / to a dev database: yours, after the owning dev's handoff
  says the checks ran.
- Applying to a **linked, shared or production database** needs a
  `DECISION:` line from the human in the task file first. Money and data
  paths are irreversible.

## Check runners

Run the project's checks yourself when verifying a handoff (`npm run check`,
`npm test`, `"$GODOT" --headless …`). Never dev servers, emulators,
watchers, or anything that does not exit — never burn inference on waiting.

## Machines

- **Windows:** Git Bash paths (`/c/Users/...`); `python3` is a Store stub —
  hooks are Node. Per-machine values (`GODOT`) go in
  `.claude/settings.local.json`, which is untracked.
- **macOS:** no `powershell`. Nothing in the repo may depend on it.
- Line endings: `core.autocrlf=true` on Windows. A diff where every line
  changed is CRLF noise — don't commit it; report. Before filing a wave of
  `␍`/CR lint or prettier findings as defects, confirm with
  `git ls-files --eol` first — that is Windows working-tree noise, not a
  real defect, and filing it as one wastes a correction round.

## What still needs a human word

Remote/production database changes · dependency changes (`npm install …`
is blocked; name the package and why) · deleting anything you did not create
· pushing to a branch other than the one the human works on · anything the
hook blocks with "human decision".

## Project block

<!-- Filled per project by the scrum-master: where migrations live, the
command to create one, the numbering rule, the apply command(s), which
database is remote, the check-runner commands, the platform quirks. -->
