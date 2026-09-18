---
name: repo-ops
description: "Use when operating on the repository yourself: starting a session (status/pull), handling untracked files, committing a DONE task, pushing at close, running checks, ordering/applying migrations, giving the human commands, or deciding whether human input is required. The scope-guard hook enforces hard limits; this skill defines habits."
---

# Repo ops

You have shell access (`lead` tier). Use the **Bash tool** on both machines:
Git Bash on Windows, zsh on macOS, so every command here works unchanged.
Never use PowerShell-only cmdlets or `> nul` (Git Bash creates a file named `nul`;
use `/dev/null`).

## Session start

1. `git status --short && git log --oneline -5`: understand the tree before planning.
2. `git pull --ff-only`. No remote yet (bootstrap): report and continue. Divergence:
   run `git fetch && git status`, report; `git pull --no-rebase` (a merge) is allowed,
   never rebase.
3. Untracked files: **report, never delete** except files created by your own
   session. `git status --short` shows them; `git clean -ndx` previews without
   changes. Deletion requires `-f`, which you do not use. **Read the preview
   correctly:** dependencies, builds, tool artifacts (`node_modules/`, `dist/`,
   `build/`, `.output/`, `.expo/`, `android/`, `ios/`, `.godot/`, `Binaries/`,
   `Intermediate/`, `Saved/`, `<IGNORED_DIRS>`) and `.env` are ignored **deliberately**;
   they are not trash and must never be proposed for removal. Real leftovers look
   like a filename made from a mangled path (an unexpanded `>`), `nul` on Windows,
   an orphan `*.patch`, a duplicate clone with its own `.git`, or an accidentally
   committed debug scaffold. List each on one report line and let the human decide:
   from here, work in progress and leftovers look identical.
4. Read the context-budget report printed at session start and act on it
   (`context-hygiene`).

## Commits — one per DONE task, made by you

- Check `git status` first: scoped staging still includes anything already staged.
  `git restore --staged .` clears the index.
- `git add <path> <path>`: only files named in the handoff, never `-A` or `.`.
  Never add build-modified generated files (`<GENERATED_FILES>`) or a lockfile
  you did not see the human generate. If it appears in status, report it.
- **Then `git diff --cached --stat` before every commit.** Scoped `add` does not
  guarantee a scoped commit: `git commit` includes everything already staged,
  including another person's work in a shared tree. 📏 A real fleet incident:
  a fix commit also included two human-staged deletions without mentioning them
  in its message. You do not own the index.
- Message (language: `<REPORT_LANGUAGE>`): `TASK-NNN: <what changed> (<risk class>)`.
  Hygiene: `docs(hygiene): <file> <before>→<after> lines`.
  Team: `team: mint|revise|retire <agent> — <reason>`.
- `git push` at session close. With two machines, uncommitted work on one is
  invisible on the other: do not leave work uncommitted overnight.
- **Never rewrite history:** no `--amend`, `rebase`, `push --force`, `reset --hard`,
  `clean`, `checkout <path>`, or `restore <path>`. The hook blocks them, and reviewers
  compare against HEAD: rewrites invalidate reviewed diffs and handoffs. Undo with
  the owner's Write/Edit changes or `git revert`.
- **The hook blocks `git rm`/`git mv` outside your write scope**, and owners have
  no delete tool. The owner lists exact paths; the human runs `git rm`; you verify
  with `<CHECK_COMMAND>` and push.

## Branches

Use `<DEFAULT_BRANCH>` by default. For a risky spike: `git switch -c
spike/<name>`, then `git merge --no-ff spike/<name>` and `git branch -d
spike/<name>`. Delete a branch only after merging (`-d`, never `-D`).

## Migrations

See the project block below. Universal rules:
- Supply the number/timestamp in the task file (agents have no clock). The owning
  dev writes SQL in `<MIGRATIONS_DIR>`. **Never run two migration-authoring tasks
  in parallel**: serializing multiple authors is your responsibility. A migration
  precedes its consumer (RPC, screen); never schedule them alongside each other.
- Apply locally/in dev after the owner's handoff confirms checks ran, **and only
  if the command is in `lead_extra_allow`**. Otherwise the human applies it and
  the task waits in `REVIEW`.
- Applying to a **linked, shared, or production** database requires a human
  `DECISION:` line in the task file first. Money, ownership, and identity paths
  are irreversible.
- The owning dev regenerates schema-derived mirrors (types, clients) after local
  application. Add them to `global_deny`; never edit manually.

## Check runners

Run checks yourself when verifying a handoff: `<CHECK_COMMAND>` and other
`check_runners` from `scopes.json`. Need another? Add it there first. Never run dev
servers, emulators, watchers, tunnels, or other non-terminating processes; never
spend inference waiting.

## Machines

- **Windows:** Git Bash paths (`/c/Users/...`); `python3` is a Store stub, so hooks
  use Node. Machine-specific values (local paths, `<ENGINE>`) belong in untracked
  `.claude/settings.local.json`.
- **macOS:** no `powershell`; nothing in the repository may depend on it.
- Line endings: `core.autocrlf=true` on Windows. A diff changing every line is
  CRLF noise: do not commit it; report it.
- **Commands handed to the human run in PowerShell** (editor terminal, including
  the Run button). One command per block, one line, no `\` continuation (PowerShell
  passes it literally), and no `&&`/`;` chaining (`;` does not short-circuit, so a
  failed step lets the next run). Three blocks beat one clever command; this
  lesson already cost an entire round.

## What still requires human input

Remote/linked/production database migration or deployment; dependency changes
(`install` is blocked: name the package and reason; only a human `DECISION:` opens
that window, and you close it when the milestone ends); provider keys in `.env`
(never committed; `.env.example` lists keys); deleting anything you did not create;
pushing to a branch other than the human's working branch; anything the hook
blocks with "human decision".

## Project block — `<PROJECT>`

> **This tail belongs to the project, not the kit.** A new catalog copy replaces
> everything above and **never** this block. Fill it during scaffolding and resolve
> every `<PLACEHOLDER>` here.

- **Remote/branch:** `<REMOTE_URL>`; default `<DEFAULT_BRANCH>`; no remote yet? State until when.
- **Migrations:** `<MIGRATIONS_DIR>`, filename format, author, `lead_extra_allow`, remote operator.
- **Check runners:** `<CHECK_COMMAND>` and others; human-only operations (dev server, emulator, `<ENGINE>`).
- **Generated / `global_deny`:** `<GENERATED_FILES>`.
- **Canon:** `<CANON_PATHS>` and its owning agent; you neither edit nor move it.
- **Quirks:** external sync, Docker, ports, `<ENGINE>`, and other local pitfalls.
