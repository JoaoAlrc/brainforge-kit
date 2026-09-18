---
name: project-bootstrap
description: "Start a new fleet project: nine-question interview selecting its track/team, scaffolder generating .claude/ and scopes.json from the catalog, and handling catalog gaps. Load when the human starts a project or requests agents/skills in a repository without .claude/."
---

# Project bootstrap

**Never read other fleet projects to "extract the best".** That work is already
distilled in `agent-kit/catalog/`. Rereading 21 repositories costs hundreds of
thousands of tokens and produces a worse synthesis. If the catalog is wrong or
incomplete, **fix the catalog** instead of bypassing it by rereading the fleet.

## 1. Interview

This is an instance of `brainstorming`'s `architectural` gate. The human need not
know track names; identifying them is your responsibility. **Golden rule: never
ask what can be inferred.** Ask about the PRODUCT in plain language, propose a
track, and invite confirmation/correction: "This sounds like a website with login
and billing—is that right?" beats "TanStack+Supabase, Expo, Godot, or Unreal?".
Use open-ended questions only when inference is impossible.

Ask all nine questions together, in one block, rather than serially. The human
answers together; you assemble the team in one pass. Do not repeat information
already provided: restate your understanding and ask only for missing details.

1. **One-sentence product and who pays for it.**
2. **What users see, and where.** Browser, phone, or full-screen game with
   controller/keyboard? Does anyone work in a game engine (Godot/Unreal), or only
   application code? Do not ask the engine's name; infer and propose:

   | Description | Proposed track |
   | --- | --- |
   | Website/dashboard, browser, user login | `web-saas` |
   | Phone app, Expo/React Native, or generic mobile | `mobile-expo` |
   | Game with a team using/planning Godot | `godot-game` |
   | Game with a team using/planning Unreal | `unreal-game` |
   | None of these | See §1.1 below |

3. **Does real money move?** Subscription, one-time purchase, credit, split?
4. **Any PII, minors, or sensitive data?**
5. **Any public surface making claims?** Landing page, store, ad?
6. **Who else writes in this repository?** Only you, Lovable, Codex, another person?
7. **Which command proves readiness?** If unknown, propose the inferred track's
   default (`node .../new-project.mjs --list` shows each track's `check_runners`)
   and request confirmation only.
8. **Any non-negotiable canon**, such as a world bible, brand rules, or domain contract?
9. **What will you build in the next two weeks?**

Question 9 determines the team. The first eight choose the track; 9 determines
who starts **active**. Agents without work in the next two weeks are not created
until `agent-forge` identifies work for them. Oversized day-one teams cost context
without return.

### 1.1 When no track fits

A real example was a Python+FastAPI project without Supabase or TanStack: none of
the four tracks matched. **Do not impose the closest track on the whole project.**
Instead, in order:

1. Install only the **core** (`scrum-master`, `docs-janitor`, `task-author`, plus
   universal skills), which applies regardless of stack.
2. From the closest track, select only stack-independent roles (`domain-engineer`,
   `qa-*`, `code-reviewer`, `security-reviewer`). Reread default write scopes.
   If they name another stack's real paths (`supabase/`, `src/router.tsx`), **changing
   a placeholder is insufficient; the whole role assumes that stack**. Omit it.
3. Missing backend/language coverage becomes **day-one `agent-forge` work, not an
   exception**. Create the agent from scratch with actual project write scopes,
   never generic example paths. Explain its catalog-external origin in the handoff.
4. If the gap could serve another project, such as a complete `api-python` track,
   **propose catalog promotion to the human**. Do not decide alone; `agent-forge`
   defines the justification threshold.

Never silently leave a responsibility unowned. If `apps/api/` has no agent, say
so in the interview summary rather than letting the human discover it later.

## 2. Assemble from the catalog

```bash
node agent-kit/bootstrap/new-project.mjs --list
node agent-kit/bootstrap/new-project.mjs --track <track> --print-answers > /tmp/resp.json
# Edit /tmp/resp.json: name, placeholders, check_runners; REMOVE agents
# not justified by question 9.
node agent-kit/bootstrap/new-project.mjs --answers /tmp/resp.json --target <dir> --dry-run
node agent-kit/bootstrap/new-project.mjs --answers /tmp/resp.json --target <dir>
```

`scopes.json` is **generated** from the catalog, never hand-written, keeping
advertised topology aligned with applied topology. After bootstrap, direct edits
through `agent-forge` are normal; the generator does not rerun or overwrite them.

The script automatically runs `--self-test` and `--check`, then lists unresolved
placeholders. These are not bugs: they are facts only the human knows. Resolve
them before delegating the first task.

## 3. What the catalog does not cover

Compare question 9 against the installed team and state: **what error could this
project permit that no current agent would catch?** That justifies new agents/skills,
not "it would be nice to have one".

- Domain-specific errors (business rule, law, data contract): a **skill** loaded
  by whoever writes that path.
- Recurring work polluting another role's context: an **agent**.
- Anything else: create nothing; record it in `CLAUDE.md` and continue.

Use `agent-forge` and its full justification threshold. If the agent/skill could
serve another fleet project, **promote it to the catalog** in the same operation;
that is how the catalog improves over time.

## 4. CLAUDE.md

The scaffolder does not write `CLAUDE.md`: it depends on answers 1–8 and is the
fleet's most expensive document, loaded by every subagent. Write it manually,
with a hard 100-line budget, using `agent-kit/templates/claude-md.md`. Path-specific
rules belong in that path's skill, not here. Rules any agent could unknowingly
violate—copy honesty, domain vocabulary, Lovable coordination—remain resident here.

## 5. Before declaring readiness

- `node .claude/hooks/scope-guard.mjs --matrix`: inspect the table; every agent
  writes where expected, **only** there.
- `node .claude/hooks/scope-guard.mjs --explain <agent> write <path>` on a path that
  must be denied. Observing DENIED is proof; assuming it is not.
- With Codex: `node .codex/hooks/scope-guard.mjs --self-test` and
  `node .claude/hooks/check-runtime-drift.mjs`.
