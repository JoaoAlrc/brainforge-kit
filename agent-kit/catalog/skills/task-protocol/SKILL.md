---
name: task-protocol
description: Use when creating, sequencing, delegating or closing a <PROJECT> task — before any delegation. Defines the TASK-NNN format, the Definition of Ready gate, how a risk class binds to its close gate, acceptance-criteria standards, the Definition of Done, and the one-commit-per-task closing rule.
---

# Task protocol

Work is defined before delegation, or the agent rebuilds the whole project
before building anything. Tasks live in `docs/tasks/` — `BACKLOG.md` (board, one
line per task), `ROADMAP.md` (phases, gates, decisions of record),
`TASK-NNN.md`, `TASK-TEMPLATE.md` to copy, `archive/` for closed.
`BACKLOG.md` is the only file the scrum-master reads to plan: under 100 lines,
`DONE` archived, never a log. Statuses: `DRAFT` → `READY` → `IN-PROGRESS` →
`IN-REVIEW` → `DONE`, plus `BLOCKED`, which must name the blocker.

## Definition of Ready — the gate

A task may not be delegated unless **all** hold:

1. Every dependency is `DONE`.
2. It names its `ROADMAP.md` phase; that order is not reorderable.
3. Acceptance criteria are individually falsifiable — **one that cannot fail is
   not a criterion.**
4. Canon references name **file + section/rule id + status**, as in
   `docs/canon/economy.md §4.2 (ACCEPTED)`. The document alone is not enough.
5. Every value is quoted from canon, or declared a `TUNABLE` it introduces,
   with a starting hypothesis and where it lives.
6. Exactly one owner agent is named, with its `<RISK_CLASS>`.
7. `Out of scope` is explicit — it stops an agent from building three adjacent
   things because they looked easy.
8. No criterion depends on an unmade human decision, nor silently picks a side
   of a known cross-document contradiction.
9. **The owner can physically produce the deliverable** — check its
   `tools`/`disallowedTools`; a read-only agent is never assigned a file.

Any failure → stays `DRAFT`, reason recorded, scrum-master reports why. A
`DRAFT`/`PROPOSAL` canon reference does not block a task, only the *claim* that
the result is settled: write `implements X (§4.2, DRAFT) as a labelled
experiment`. A first-draft task cites the outline it works from, and says so.

## Writing acceptance criteria

- Bad: "the save system works correctly." Good: **inputs**, **expected
  observable**, **tolerance** where numbers compare, repeats on determinism.
- Bad: "it feels good" — a human playtest, not a criterion: write the observable
  ("first response within 50 ms"), flag it `needs human testing` (`human-playtest`).
- **Name evidence this environment can produce.** Outside `<CHECK_COMMAND>`'s
  limits the human settles it on a device and it stays ❓ — say who checks where.
- **Inert coverage is a defect**: a spy never asserted on, a case passing under
  both the fix and its revert. Say what a test does not prove.

## Risk class and its gate

Every task carries a `<RISK_CLASS>`, set at authoring, recorded in its file. The
taxonomy is the project's — one class per real invariant — and each class
**declares its close gate in the Project block**: the reviewers that must return
clean before `DONE`. A class with no declared gate is not a class. Where classes
overlap the stricter gate wins, never two reviewers on one diff. **When the
owner IS the gate** it does not vanish and the owner never reviews itself:
substitute the agent owning the files under review — exactly one, named in
Verification.

## Sequencing

- **Substrate first, and the `ROADMAP.md` order holds.** Domain types and
  contracts before their consumers, never in parallel; no presentation before
  the core runs green headlessly; no content batch before its validator exists.
- **One variable at a time**, and **one reviewer per artefact**: two tunables
  cannot tell you which helped, two reviewers produce a third round.
- **A file built incrementally is edited, never written.** `Write` replaces the
  whole file; an "append" truncates all it did not hold. One file per author.
- **`completed` from a subagent is not evidence.** Check the artefact against
  the criteria — half the work can be reported as success, truthfully.
- **Fan out only across true independence.** Probes against a finished substrate
  are parallel; the probes plus the substrate are a chain.
- **Correction rounds shrink.** Round 2 covers only what survived round 1; a
  round not smaller means vague defect reports — fix the reports. A defect
  surviving three rounds is an ambiguous criterion: human, not attempt 4.

## Definition of Done

A task is `DONE` when its gates return clean, **not** when the owner says so —
the scrum-master re-checks: file exists, test name real, quoted number present.

- [ ] Work sits in the layer its scope names; no cross-boundary write.
- [ ] Every acceptance criterion maps to a named file and symbol.
- [ ] Every `TUNABLE` touched is exported or config, never a buried literal.
- [ ] No new dependency or addon without separate human approval.
- [ ] Handoff uses the `handoff-contract` block with provenance labels.
- [ ] Everything decided that canon did not specify is listed.

Additionally, by what the work touches:

- **domain truth** (rules, types, schema, persistence, `<MIGRATIONS_DIR>`): a key
  assertion seen to fail (`verify-falsification`), mutation and red pasted, since
  green never seen red does not close DoD; determinism as deep-equal results over
  repeated runs with input unchanged; golden values **not** produced by the code.
- **data units** (levels, activities, copy, curves, manifests): every unit
  passes validation and replay with the report cited by path; authored intent
  and tool result agree, or the mismatch is the task's named finding.
- **input, presentation, timing, audio, haptics**: golden cases still pass with
  the effect on and off; the effect is toggleable in development for A/B;
  flagged `needs human testing` when it touches gesture geometry, haptics, timing
  or UI scale — desktop approval is insufficient.

## Closing, and authoring ahead

The scrum-master creates **one commit per `DONE` task** (`repo-ops`) right after
its own evidence re-check, exact paths from `git status` — never `-A`, never
batched across tasks. The commit is the scrum-master's. Author tasks from
`TASK-TEMPLATE.md` in batches, ahead of execution.

## Project block — <PROJECT>

<!-- Project-owned. A kit update replaces everything above and never this. -->

- Canon root and reference format (`<CANON_PATHS>`):
- `ROADMAP.md` phase order, and `<CHECK_COMMAND>` with what it cannot prove:
- Each `<RISK_CLASS>` and the gate it declares (`<QA_AGENT>` + invariant owner):
- Stack specifics (`<ENGINE>`, `<MIGRATIONS_DIR>`) and push policy:
