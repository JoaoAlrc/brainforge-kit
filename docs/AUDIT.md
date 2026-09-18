# Distribution audit

Date: September 17, 2026. Scope: the supplied conversation, local Brainforge
and reference checkouts, official client documentation, and local checks.

## Verdict

Brainforge has a useful software workflow foundation: focused roles,
responsibilities, review, context budgets and handoff contracts. This review
adds a conversational front door and native client adapters. A new user can
start with a plain request; filling a JSON file and installing Node are no
longer part of the default setup.

The distribution is an early release, not evidence of superior model results.
The advanced Claude runtime still needs the fixes in
[CLAUDE-REVIEW.md](CLAUDE-REVIEW.md). Business tasks can use the assistant's
available capabilities; the package does not include a complete marketing
automation suite.

## Changes made

| Initial problem | Current behavior |
| --- | --- |
| Setup exposed internal scripts and technical choices | A short conversation saves context and starts a useful task |
| No ordinary-language entry for each client | Root instructions and setup shortcuts for all four clients |
| Small tasks inherited an oversized software setup | A three-role starter; specialists are selected only when needed |
| Codex mainly received Claude hook shims | Native instructions, agent TOMLs, skills and coordination |
| Runtime selection still generated Claude files | Explicit client selection in the advanced generator |
| Codex read-only roles lacked a sandbox declaration | Native read-only profiles, with limits documented |
| Generation could stage pre-existing user files | Empty-target protection and validation before writing |
| No portable distribution checks | Automated generator/CLI checks and Windows/Linux/macOS CI |
| Mixed repository language and business folder names | English documentation, prompts and paths |
| Incomplete notices for adapted material | MIT license and complete third-party notices |

The existing Claude catalog, templates and hooks received editorial
localization and description syntax normalization, not fixes to the eight
audited runtime issues. The new root
starter is independent of those legacy hooks. Shared generator fixes apply
when producing an advanced project.

## Comparison and limits

| Dimension | Assessment |
| --- | --- |
| Ease of starting | Conversational setup uses ordinary file tools; the programming runtime is optional |
| Software responsibilities | Detailed domain roles and contracts, with known hook enforcement limits |
| General development methods | Useful overlap with established workflows; adaptation alone proves no quality advantage |
| Business work | Context and planning support; no bundled publishing or analytics integration |
| Native clients | Codex adapter, Kimi profiles/discovery and Gemini advisory coordination |
| Quality, latency and cost | No comparative task benchmark; no claim of measured superiority |

The comparison used available project files and documentation, not repeated
model runs on identical tasks. Agent counts and passing configuration tests
must not be presented as measured productivity or token savings.

## Claude follow-up

The [full report](CLAUDE-REVIEW.md) lists eight findings and acceptance criteria.
Prioritize the coordinator's delegation allowlist, hook paths after directory
changes, and shell commands that write from nominally read-only roles.

The initial catalog had 26 Opus, 12 Sonnet and 2 Haiku profiles; four index
entries disagreed with the effective files. This is a configuration finding,
not a cost benchmark. The new small starter inherits the user's model.

## Branding, attribution and privacy

User-facing branding is Brainforge. Required notices for three adapted skills
are centralized in [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md), and
generated distributions preserve them. Removing promotional references does
not justify deleting an applicable copyright or license notice.

The repository is private as requested. Current editorial examples were
generalized, but the original commit history has not been rewritten. Review
that history before making a public release. Personal setup information goes
into the ignored `workspace/` directory.

## Validation

The current distribution passed all 27 automated Node tests on Windows
with Node 24.19.0. Coverage includes all four software tracks, runtime selection,
skills, scope validation, pre-write rejection, Git behavior, the CLI and Gemini
memory filtering. Gemini's default Git ignore handling would block the saved
context; a narrow project-level exception now makes memory and Markdown
outputs readable while Git continues to exclude them from commits.

Additional baseline evidence:

- Codex CLI 0.155.0-alpha.2.6 diagnostics loaded the configuration. Terminal
  limitations prevented treating the diagnostic as a full work session.
- Kimi Code 0.38.0 discovered two generated project skills in an isolated local
  workspace, without a model request or login. Native delegation was not run.
- Gemini configuration was inspected against the documented format; Gemini CLI
  was not installed for a live execution check.
- The Claude engine passed 272 baseline cases on each of four tracks, while the
  additional findings in the report still reproduced.
- The [first remote workflow](https://github.com/JoaoAlrc/brainforge/actions/runs/35241593609)
  passed on Windows, Linux and macOS with Node 22. Current official checkout
  and setup-node action versions replaced deprecated versions afterward.
- A fresh clone of the private repository ran the optional doctor and generated
  a valid answer template using only published files.

The conversational start was also exercised in an isolated Codex fixture:
given a cafe owner's complete brief, it saved all four context files, produced
three Brazilian Portuguese Instagram drafts, preserved an existing custom
agent profile and resumed without repeating the interview. The exercise used
file editing and ordinary file access, with no programming runtime, generator
or manual terminal work from the user. It did not exercise native delegation.

Claude Code's strict component validator accepted the new setup skill and
three starter agent profiles. The Codex starter profiles and Gemini command
parsed as TOML. Kimi also discovered the new setup skill, parsed the starter
profiles and exposed builder/reviewer tool lists; a malformed YAML control was
rejected. No trust setting or model prompt was used for that Kimi check.
These checks validate packaging, not model behavior across all clients.

Automated checks do not call a model. Account availability controls model and
effort support. Responsibility documents alone do not create filesystem
sandboxes or restrict external connectors. No full four-client model session,
comparative quality benchmark or measured cost claim is implied.

See the [Codex guide](CODEX.md), [client guide](../agent-kit/CLIENTS.md) and
[Claude findings](CLAUDE-REVIEW.md) for technical sources and limits.
