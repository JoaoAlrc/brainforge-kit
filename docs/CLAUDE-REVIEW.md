# Claude runtime review

Reviewed September 17, 2026. This report covers the full software catalog,
hooks and standalone business template. Hook and delegation fixes were left
for the Claude maintainer. Later English localization changes wording and paths
and normalizes description syntax, not underlying hook behavior. The new root
conversational setup uses a separate
small starter team and does not install the legacy hooks.

## Verdict

The catalog uses real Claude Code mechanisms: `.claude/agents`,
`.claude/skills`, `settings.agent`, and `PreToolUse`/`SessionStart` hooks.
Model assignments exist in the effective agent files. However, the full
workflow has proven delegation and shell-control gaps.

P1 means fix before recommending this full catalog as ready for other users.
P2 means incomplete behavior or inconsistent configuration that should be
resolved before a stable release.

## Evidence and limits

- Local Claude Code: **2.1.238**. Its doctor reported no installation problem.
- Current native strict validation passed for all 42 agent files, catalog
  skills and the standalone setup after English localization and description
  syntax normalization. The original catalog had two unquoted
  descriptions with YAML-sensitive colons; those descriptions were normalized
  without changing role responsibilities, tools or model assignments.
- Four baseline projects were generated with `--no-git`: web, mobile, Godot and
  Unreal. Each returned **272 passed, 0 failed** from the scope engine and no
  configuration errors or warnings.
- Required skills were present in all four baseline projects.
- Synthetic events used the documented `agent_type` field. Positive and negative
  decisions were compared. The Git output-file bypass was also executed in a
  disposable fixture to confirm a real write.

Those baseline projects predate the parallel adapter changes. Native format
validation and engine tests do not prove a live delegation chain or complete
shell isolation. No paid Claude session, deployment or external publication
was used to validate these findings.

## C1 · P1 · Coordinator delegation excludes installed implementers

**Files:** `agent-kit/catalog/agents/scrum-master.md`,
`agent-kit/catalog/placeholder-defaults.json`.

The tool allowlist uses
`Agent(Explore, docs-librarian, docs-janitor, <OWNERS>, <QA_AGENT>)`.
The OWNERS default is a descriptive pointer to the scopes file, not a list
of agent IDs. QA_AGENT defaults to `qa-web` across tracks.

As a result, installed roles such as `app-dev`, `platform-dev`,
`landing-dev`, `task-author` and reviewers are not callable through this
allowlist. Mobile and game tracks also reference a QA agent that is not
installed. `docs-librarian` is optional.

**Recommendation:** derive callable IDs from the final installed team; separate
ownership prose from agent identifiers; choose QA by track. Test that every
required role is both installed and callable, then verify implementation and
review in a short real Claude session.

The [official allowlist documentation](https://code.claude.com/docs/en/sub-agents#restrict-which-subagents-can-be-spawned)
confirms that Agent(...) restricts which subagents the primary agent can start.

## C2 · P1 · Relative hook paths stop working from subdirectories

**File:** `agent-kit/templates/settings.hooks.json`.

Hook commands use paths relative to the current directory, such as
`node .claude/hooks/scope-guard.mjs`. Running the configured command from
`src/` in a generated fixture produced MODULE_NOT_FOUND and exit code 1.
The engine never reached its permission decision.

**Recommendation:** resolve the script through the client-provided project
directory, with quoting that works on Windows, macOS and Linux. Declare the
minimum client version and test worktrees. Trigger the complete hook from both
the root and a subdirectory; both must deny the same reviewer write.

Sources: [script paths](https://code.claude.com/docs/en/hooks#reference-scripts-by-path)
and [exit-code semantics](https://code.claude.com/docs/en/hooks#other-exit-codes).

## C3 · P1 · Read-only shell classification permits output files

**File:** `agent-kit/hooks/scope-guard.mjs`, Git and tar classification.

For `agent_type: code-reviewer`, both commands below received exit code 0
without a deny decision:

```text
git diff --no-index --output=src/reviewer-write.patch docs/before.txt docs/after.txt
tar -cf src/reviewer-write.tar docs
```

The Git command was executed in a disposable fixture and created a **146-byte
patch under src/**. Its exit code 1 indicated differences; the file write was
verified separately. The reviewer has Bash even though it lacks Write/Edit.

**Recommendation:** classify output flags and archive creation as mutations,
check their destinations and deny them for read-only roles. Include tests of
filesystem effects, not just common command words.

There is also a broader limit: dev and lead tiers permit commands classified
as other. A script can compute a write operation in a way pattern matching
does not recognize. This synthetic command received no deny decision:

```text
node -e "require('fs')['write'+'FileSync']('supabase/migrations/escape.sql','x')"
```

That last command was **not executed**. A shell-pattern classifier is an
operational guard, not a filesystem sandbox or absolute isolation guarantee.

## C4 · P2 · Current directory is confused with repository root

**File:** `agent-kit/hooks/scope-guard.mjs`, resolveRoots and relativize.

The engine includes event.cwd as a candidate root and prefers the deepest
candidate. The same absolute destination `src/components/Test.tsx` was
allowed for app-dev from the repository root and denied from src/, where it
was reinterpreted as `components/Test.tsx`.

**Recommendation:** distinguish the stable repository/worktree root from the
current directory used to resolve relative input. The same absolute path
must receive the same decision from root and subdirectories.

## C5 · P2 · Full-catalog setup leaves project context unfinished

**Files:** `agent-kit/skills/project-bootstrap/SKILL.md`,
`agent-kit/templates/claude-md.md`, `agent-kit/bootstrap/new-project.mjs`.

The four baseline projects had no CLAUDE.md. The legacy bootstrap skill
intentionally leaves it as a manual authoring step, while the original README
command sequence omitted that step. Generated roles also refer to project
backlogs and domain documents that still need real content.

**Recommendation:** finish the interview, author a short CLAUDE.md from actual
facts, create the minimum task context and identify the first actionable task.
Do not fill unknown requirements with fictional details.

The new root conversational setup addresses the ordinary user's entry path.
This finding remains relevant to the separate advanced Claude generator.

## C6 · P2 · Catalog model metadata differs from effective agent files

**Files:** `agent-kit/catalog/catalog.json` and matching catalog agent files.

The index reports fable for game-designer, adversarial-player, art-director
and unreal-gameplay-engineer; their actual frontmatter uses opus. The baseline
generator copied the effective files correctly. The issue affects catalog
listing and decisions based on index metadata, not those copied defaults.

**Recommendation:** derive model metadata from effective frontmatter and test
agreement. Keep account availability explicit and avoid fixed savings claims.

The effective baseline distribution is 26 Opus, 12 Sonnet and 2 Haiku roles.
It shows a deliberate responsibility/risk policy, not measured cost savings or
a quality advantage.

## C7 · P2 · The standalone business template has only setup

**Files:** `business-os/.claude/skills/setup/SKILL.md`,
`business-os/README.md`.

Only the interview skill is bundled. Dedicated content, ads and operations
skills are not installed. Memory limits are written instructions, not a
separate automatic enforcement mechanism.

**Recommendation:** keep available capabilities explicit and implement a small
complete business workflow before claiming a larger ready-made suite.

The new root setup can begin ordinary writing, planning and analysis through
the assistant's existing capabilities. This does not mean it has installed
specialized marketing integrations.

## C8 · P2 · Malformed hook input does not fail closed

**File:** `agent-kit/hooks/scope-guard.mjs`, stdin parsing and agent identity.

Empty input returns without a decision. Invalid JSON also returns without
a deny decision. Missing agent identity is treated as the primary session
with broader permissions.

**Recommendation:** make malformed input block when its context cannot be
verified. Document the intentional primary-session exception, require a client
version that supplies the expected identity fields and test the actual hook
transport in addition to direct engine functions.

## Distribution notes

- English localization, description syntax and path renames do not constitute
  fixes for C1–C8.
- Descriptive attribution has been centralized in THIRD_PARTY_NOTICES.md;
  required notices for adapted methodology must remain in distributions.
- The shared installer now rejects unsafe initial Git use and incomplete
  specialist placeholders. Those fixes are covered by the new adapter tests.
- Some legacy internal identifiers and historical Git content remain for
  compatibility. Review publication history before making the repository public.
- The new starter profiles have limited read-only reviewer tools and preserve
  the user's main model. They are distinct from the full catalog reviewed here.

## Reproduce

```sh
node agent-kit/hooks/scope-guard.mjs --self-test
claude plugin validate agent-kit/catalog/agents --strict
claude plugin validate agent-kit/catalog/skills --strict
```

For permission decisions, generate a disposable project with valid answers and
--no-git, then send JSON events to its scope-guard stdin using tool_name,
tool_input, cwd and agent_type. Empty output means this hook did not deny the
action; other client permission layers may still apply.

Official sources checked during the review:
[agents](https://code.claude.com/docs/en/sub-agents),
[hooks](https://code.claude.com/docs/en/hooks),
[settings](https://code.claude.com/docs/en/settings),
[skills](https://code.claude.com/docs/en/skills).

## Follow-up — September 17, 2026 (Claude maintainer)

Every finding in this report was independently re-verified before any fix —
not trusted on the strength of the report's own prose — with a direct read
of the affected code or a disposable-fixture reproduction, matching this
report's own evidentiary standard. All eight are now fixed in this
repository (`brainforge/agent-kit`) and re-verified after the fix; the
end-to-end suite (`bootstrap/selftest.sh`) passes clean across all four
tracks, including a positive-control check this fix cycle briefly broke and
caught before closing (see C4).

- **C1 — fixed, verified across all 4 tracks.** `scrum-master.md`'s `tools:
  Agent(...)` line now uses a single `<DELEGATABLE_AGENTS>` placeholder,
  computed by `new-project.mjs` from the project's actual final agent list
  (never from a static per-track default) and overwritten unconditionally at
  bootstrap time. `QA_AGENT` is derived the same way: the first installed
  `qa-*` agent, falling back to `code-reviewer`, never a hardcoded `qa-web`.
  Verified by generating one project per track and reading the literal
  `tools:` line and risk-routing table: web-saas → `qa-web`, mobile-expo →
  `qa-mobile`, godot-game/unreal-game → `qa-gameplay`; `272 passed, 0 failed`
  in each. **Not tested:** an actual live delegation + independent review in
  a running Claude session — this remains inferred from static generation
  correctness, the same limit this report's original evidence section
  already named.

- **C2 — fixed.** `templates/settings.hooks.json` now invokes both hooks
  through `"$CLAUDE_PROJECT_DIR/.claude/hooks/<name>.mjs"` (quoted, so a
  path with spaces stays one argument) instead of a bare relative path.
  **Not tested:** a live multi-directory Claude Code session confirming the
  documented environment variable behaves exactly as the cited docs state;
  also not checked or fixed: whether Codex, Kimi Code or Gemini CLI's own
  hook-equivalent (if any) has the same relative-path assumption — no
  evidence gathered there either way.

- **C3 — fixed, verified in a disposable fixture.** `git diff`/any git
  subcommand with `--output`/`--output=FILE` is now classified as a
  filesystem mutation before any per-subcommand branch runs; `tar` archive
  creation now resolves its real destination from `-f`/`--file` (which is
  its own argument, never a shell redirect) instead of only recognizing a
  shell `>`. Re-ran this report's own two commands against a disposable
  fixture for a read-only `code-reviewer`: both now return `deny`, and the
  fixture's target directory was confirmed empty afterward — the write
  that previously landed does not land now. **Not tested:** an exhaustive
  sweep of every other git/archive-tool flag capable of writing (this closes
  the two demonstrated vectors, not a proof that no others exist — the
  report's own caveat about shell-pattern classifiers applies here too).

- **C4 — fixed, verified, and a regression from the first fix attempt was
  caught before closing.** `resolveRoots()` no longer includes `event.cwd`
  as a competing root candidate — it stayed only as the base for resolving
  a *relative* `file_path` argument, which is legitimate and unrelated to
  the bug. First fix attempt caused `bootstrap/selftest.sh`'s positive-control
  check to start failing (lead denied in `docs/`): removing `cwd` as a root
  candidate entirely also removed the only root available when a client
  does not set `$CLAUDE_PROJECT_DIR` — exactly this report's own synthetic
  test harness. Root cause traced (not guessed) before the second fix:
  `relativize()` now falls back to treating `cwd` as a single, non-competing
  root only when no other candidate contains the target path at all — the
  ambiguity C4 reported (two candidates, deepest wins) cannot arise in that
  fallback because there is only ever one candidate in it. Verified: the
  same absolute path from the project root and from a subdirectory now
  returns the same decision, both with `$CLAUDE_PROJECT_DIR` set and without
  it. **Not tested:** genuine `workspace_roots`-based worktree isolation in
  a live multi-agent session.

- **C5 — addressed for the ordinary path already (per this report's own
  note); the advanced generator gap is now visible instead of silent.**
  `new-project.mjs` writes `CLAUDE.md` from `templates/claude-md.md` with
  the one fact it can safely substitute (`<PROJECT>`); the template's
  remaining bracketed sections are authoring instructions in English prose
  ("One sentence about the product and who pays..."), not data fields, and
  are deliberately never auto-filled — doing so would mean inventing the
  product narrative, which this project forbids everywhere else. The
  bootstrap's final report now lists every such section by name so the
  requirement cannot be missed. Verified by generating a project and reading
  the printed list (8 sections named) against the written file.

- **C6 — fixed, verified.** `merge-catalog.mjs` now derives an agent's
  `model` from its actual frontmatter at validation time — the same
  file-is-truth mechanism already used for `placeholders` and
  `needs_skills` in this codebase, extended to cover the field this report
  found stale. Forced a full resync and confirmed all four previously-stale
  entries (`game-designer`, `adversarial-player`, `art-director`,
  `unreal-gameplay-engineer`) now read `opus` in `catalog.json`, matching
  their files. **Flagged, not fixed:** the identical staleness exists in
  the original `apps/agent-kit` (outside this repository, live across an
  external fleet of projects) — out of scope for this pass by the maintainer's
  explicit instruction; needs a separate, deliberate fix there.

- **C7 — already resolved**, verified by reading `business-os/README.md`
  directly: it states plainly that only setup is bundled, that content/ads/
  operations skills are planned and not installed, and that memory budgets
  are written instructions rather than an enforcement mechanism. No change
  needed from this pass.

- **C8 — fixed, verified; one recommendation remains open.** Empty stdin and
  unparseable JSON now `deny` with a diagnostic message instead of silently
  returning with no decision — reasoned from the fact that this hook's only
  registered matcher is Write/Edit/MultiEdit/NotebookEdit/Bash/PowerShell, so
  every real invocation carries a real payload; there is no legitimate
  all-quiet case to protect. The intentional primary-session exception is
  untouched and now documented in the code itself: a *well-formed* event
  with no agent identity is still the human's own session and is still
  allowed — confirmed this by re-running the full self-test suite (`272
  passed, 0 failed`) after the change. Verified the two new deny paths
  directly with empty and garbage stdin. **Not done:** this report's second
  recommendation, requiring a minimum client version that reliably supplies
  identity fields — no version gate was added, only a code comment
  explaining the current design. This stays open.

### Also found during this pass, not in the original eight

While verifying C1, a near-miss: an early edit was almost applied to
`apps/agent-kit` (the external, untouched fleet copy) instead of this
repository's `agent-kit/`, caught only because the edit tool refused an
unread file. No changes reached that copy. Separately, C1, C3, C6 and C8 are
confirmed present in that same external copy, which is deployed across an
unrelated set of live projects outside this repository — the maintainer has
been told this directly; fixing it is a separate decision with a different
blast radius, not part of this pass.
