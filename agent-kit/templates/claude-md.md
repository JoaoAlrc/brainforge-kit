# <PROJECT> — Agent Operating Rules

> Loaded into every subagent. Each token here is multiplied by the number of
> agents in a run. Hard budget: 100 lines. Detailed procedures belong in the
> skill or rule that applies them; summaries here become a second source of
> truth and drift.

## What this project is

<One sentence about the product and who pays. Then the actual stack and
boundaries an agent could cross accidentally: public versus authenticated
routes, product A versus product B, generated versus hand-written files.>

<Where a new session starts reading. One path, not five.>

## Language

Use English by default, or the user's requested language in conversation.
Code, commits and comments follow the repository's existing convention.

## Essential vocabulary

<Only what prevents mistakes an agent would not notice: terms that look
synonymous but are not; systems that must never mix; who has authority to
grant access or write data. If careful reading of the code would prevent the
mistake, it does not belong here.>

## Rule 0 — <coordination, if another writer uses this repository>

<Another tool, Codex or another person: what must never be rewritten, which
files are generated and must never be edited by hand, and what happens when
two contributors write at the same time. Remove this section if only you and
the agents write here.>

## Topology

Write and shell scopes are checked by `.claude/hooks/scope-guard.mjs` using
`.claude/hooks/scopes.json` (Node, Windows and macOS), with fail-closed checks
for named agents. <One line per owner: agent -> paths.> The lead commits
one DONE task at a time (`repo-ops`) and applies scope changes directly to
`scopes.json` (`agent-forge`). **If this summary and `scopes.json` disagree,
`scopes.json` is authoritative.**

## Rule 1 — <honesty, if there is a public-facing surface>

<Public content must never contain fabricated proof: invented customer counts,
testimonials, awards or metrics. Claims without a verifiable source do not
ship. This belongs here, not in a path-specific skill, because any agent can
make this mistake without noticing.>

## Rule 2 — Single responsibility

Reviewers do not implement. Whoever finds a problem does not fix it. The lead
coordinates and does not produce. If you find work outside your role,
**name it and hand it back**. Crossing roles causes context to grow.

## Rule 3 — Never spend inference waiting

Never loop on a build, development server, deployment or emulator. Never sleep
and retry. When you need a result that cannot finish within one call:
**stop, state exactly what you need, and end the turn.** The human provides it.

## Rule 4 — Evidence, not impressions

Label every assertion: 📏 measured (you ran it; provide the command and number)
· 📄 reported (verify before acting) · 🔮 inferred · ❓ unknown.
**No label means 🔮.** "It became faster" is not a finding; a number is.
Never claim something "looks beautiful"; that is the human's judgment.

## Rule 5 — Report format

Finish with the `handoff-contract` block. The lead receives about 300 tokens,
not your working notes. Never paste code, file contents or passing test/build
output.
