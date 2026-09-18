---
name: handoff-contract
description: "The fixed block every agent uses to close a task: outcome, delivered files, criteria and labeled evidence by layer, tunables, decisions, canon touched, shared contracts, and next step. Use for the final scrum-master/lead handoff, never before completion. Target ≤300 tokens; hard limit 500."
---

# Handoff contract

Your working context is disposable. The scrum-master's is not: everything passes
through it, and what it reads becomes a roadmap line. Your return is what it pays
for. **Target: fewer than 300 tokens. Hard limit: 500.**

## Provenance labels — on every factual claim

| Label | Meaning | Requires |
| :-- | :-- | :-- |
| 📏 | **Measured**: you ran/read it here, now | Command (or path:lines) and number |
| 📄 | **Reported**: a document, old log, or another agent said it | Source; treat as hypothesis |
| 🔮 | **Inferred**: nobody measured it | State that explicitly |
| ❓ | **Unknown**: you do not know | Say so instead of estimating |

**Unlabeled means 🔮.** A test you ran but never saw fail is 🔮 about what it
measures, even when 📏 about having run. A screenshot proves framing/readability,
never a complete journey or satisfaction. Evidence produced outside your turn is
📄, never your 📏. Project layers are in the Project block. In every track,
**one layer does not prove the next** (green pure rules do not prove a scene),
and **the final layer is human**, never yours.

## Block

```text
HANDOFF
Task: TASK-NNN                     Milestone: <roadmap milestone>
Agent: <your name>
Outcome: COMPLETE | PARTIAL | BLOCKED | REJECTED

Delivered:
- <path> — <one line: what changed>

Criteria:
- <criterion> — PASS 📏 | FAIL 📏 | NOT TESTED

Evidence by layer:
- <layer>: <`<CHECK_COMMAND>` · executed/failures> | not applicable
- human: pending | not applicable

Tunables introduced or changed:
- <NOME> = <value> — <location> — TUNABLE hypothesis

Falsification:                     (rule, state, or economy tasks)
- <assertion> — sabotaged with <one-line mutation> — observed RED 📏

Invariants verified:              (<RISK_CLASS> tasks)
- <invariant> — <enforcement location> — <exercising test> OK 📏

Migration:                        (if <MIGRATIONS_DIR> changed)
- <file> — applied locally 📏 | not applied (remote belongs to the human)

Decisions I made:
- <every choice not specified by <CANON_PATHS>, one line each>

Canon touched:
- <doc § section> — DECIDED|HYPOTHESIS|TUNABLE|OPEN — remains <same status>

Shared contract:
- <changed-contract file consumed by another agent/runtime, or "none">

Needs human input:
- <decisions, device/play tests, credentials, approvals, or "none">

Next:
- <the single next action and owning agent>
```

Omit a section only when it does not apply. Never omit `Canon touched` or `Shared
contract` for implementation tasks: stating that HYPOTHESIS remains HYPOTHESIS,
or no contract changed, is the point.

## Rules

- **Never paste code.** Give its path. The lead can read it and usually will not.
- **Never paste passing check output.** "127/127 📏" is the whole report.
  Name the command, not its output; an error count also fits on one line.
- **Never paste the contents of a file you read.** Cite path/section (`:line` only
  when exact wording is the finding, at most 3 lines).
- **Never narrate the process:** no "first I looked at X, then considered Y".
- **Always expose guesses.** Anything unspecified by <CANON_PATHS> goes under
  `Decisions I made`. Silent assumptions accidentally become contracts.
- **A suite loading zero tests fails**; it is not "0 errors". Report executed
  test counts, never merely "passed".
- **Never claim something is good, beautiful, or fun.** Code/screenshots cannot
  establish that. State whether a structural obstacle exists and mark `Needs human input`.
- **`BLOCKED` is a good result.** Returning early with a precise blocker costs
  ~200 tokens; an incorrect guess costs a whole rework cycle.
- **`REJECTED`** means the task itself is flawed: it contradicts <CANON_PATHS>,
  touches out-of-scope files, exceeds cycle scope, or has an untestable criterion.
  Cite the violated rule.
- **A 4,000-token handoff reproducing the work is worse than none.** It defeats
  separate context; isolation only pays off when little crosses the boundary.

## Review and reporting agents

Reviewers and QA substitute their finding formats for `Delivered`/`Criteria`,
with the same ceiling **per finding**: problem and smallest correction, never
its investigative history. `Evidence by layer` remains mandatory.
`Outcome: COMPLETE` means "verdict delivered", not "everything passed".

## Project block — <PROJECT>

Only this section is edited per project. The rest comes from the kit and is
replaced on every copy; **this section is never overwritten**.

- Evidence layers, in order: <CAMADAS>; the final layer is human.
- Named checks: <CHECK_COMMAND>.
- Governing canon: <CANON_PATHS>.
- Migrations: <MIGRATIONS_DIR>; engine/runtime: <ENGINE> | not applicable.
- <RISK_CLASS> tasks and required invariants: <INVARIANTES>.
- Evidence location: <EVIDENCE_DIR>.
