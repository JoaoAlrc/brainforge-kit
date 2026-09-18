---
name: review-architecture
description: "Use to review <PROJECT>'s <ENGINE> structure and fidelity to canon: rule/scene/presentation boundaries, sole ownership, duplicate formulas, buried numbers, event/save contracts, per-frame cost, editor-free testing, and silent promotion of unsettled canon. Load before structural/gameplay reviews, weakened shared-surface diffs, and baseline reviews. Read-only."
---

# Review architecture

Two deliberately separate questions, both mandatory:

- **STRUCTURE:** is this coherent, singly owned, and testable without the editor?
- **CONTRACT:** is this faithful to `<CANON_PATHS>` and `<RULES_PATHS>`, including their status labels?

Answering one does not excuse the other. Emit **two labeled finding classes**
(S and C) so neither disappears. Read-only: never implement corrections; name the smallest.

## Before starting

Read only files listed in the handoff; do not survey the repository. If another
file supports a finding, name it and explain why; that itself is a coupling finding.
Without a handoff (baseline review), inspect `<GAMEPLAY_PATHS>`, then the translating
scene, then presentation, in one pass rather than a line-by-line audit. **This
checklist may lag the milestone:** if it conflicts with `<CANON_PATHS>`, canon
wins and the mismatch is a finding.

## STRUCTURE checklist — each item is a finding

- Changing a balance number requires editing multiple files.
- The same function decides, draws, **and** plays sound.
- Rule code reads input, clock, OS, randomness, or camera.
- Presentation changes rule state (effects move actors, animation changes timers),
  or rules reach into presentation to guarantee visuals.
- Actors read global state instead of receiving a `setup`/command contract.
- **God file:** input, camera, HUD, economy, spawn, and save concentrate in one
  file, with new behavior only fitting as more lines there. The finding concerns
  sole-ownership/parallelism costs, **not size**. Extract a small-contract module.
- **Duplicate formula:** preview math differs from execution, multiple places
  calculate cost, or mirrored state drifts. This is the costliest finding because
  the two copies diverge unnoticed.
- Rule-affecting numbers buried in logic (`if resources >= 8`) rather than named
  and owned in `<RULES_PATHS>`.
- Events without documented types, with inconsistent payloads, or named as commands.
- Game phases represented by booleans without an explicit state machine.
- Saves without versions, validation, or fallback; load mutating before validation;
  reload duplicating entities; restart failing to clear everything it created.
- Per-frame all-actor scans, pathfinding, or per-entity traces without intervals or
  measurements; allocation on hot paths.
- Entities without stable keys (reused IDs), or identity based on display names.
- Tests requiring the whole game, private state, another machine's absolute path,
  or a fixed version directory.

Positive criteria: full games run through `<HEADLESS_CMD>` using only
`<GAMEPLAY_PATHS>`; scenes can be replaced without touching rules; disabled effects
do not change outcomes; numbers change in one place; new entities require no edits
to existing ones; yesterday's save loads today.

## <ENGINE> specifics

| Check | Reason |
| :-- | :-- |
| Static parameter/return types where cost is zero | Analysis-time errors instead of next-milestone errors |
| No new singleton, autoload, or global bus in a prototype | Invisible coupling without ownership |
| Events name completed facts (`order_resolved`, not `resolve_order`) | Emitters do not command consumers |
| Inject dependencies; no cross-scene node/actor paths | Independently testable scenes |
| Movement in physics steps, one position mutator outside reset | Equal at 60/144 Hz, no teleporting |
| Single collision-layer registry and typed regions, never node names | Explicit blocking relationships |
| Shared resources/assets hold no runtime state | Avoid cross-instance contamination |
| Single owner and recorded reason for time dilation/deferred execution | Avoid stuck pauses and ordering hacks |
| No <ENGINE> API asserted from memory | Model knowledge predates installed versions |
| No manual engine-artifact edits; tools folder outside the build | Avoid import/merge problems and leaked prototypes |

**Do not report the absence of prohibited scope:** `<SCOPE_EXCLUSIONS>` and usually
pooling, CI, autoload, ECS, global event buses, service locators, DI, or a second
platform. Reporting correctly absent features wastes review and expands scope.
Check the current milestone before reporting absence: earlier prohibitions may now
be in scope. New dependencies/plugins/modules without human decisions are `BLOCKER`.

## CONTRACT checklist

The most important class: its defects are invisible and permanent. Every finding
cites `file § section`; **without citation it is suspicion, not a finding**.

1. **Silent promotion:** code, comments, constants, or handoffs call settled what
   canon labels hypothesis, draft, proposal, tunable, or open. `# final value` and
   `FINAL_*` are findings. Quote the literal label; match **containment, never exact
   strings**, because status vocabulary composes.
2. **Unauthorized constant:** every critical number traces to canon or a declared,
   owned `<TUNABLE_MARK>`. Invented ceilings/thresholds are `BLOCKER`: they silently
   become canon and are almost impossible to find later.
3. **Buried tunable:** `<TUNABLE_MARK>` is a logic literal instead of an exposed,
   named property.
4. **Conformance:** behavior matches its section, including limits, recovery, and
   failure cases. No teleporting actors, dead ends, missing targets stalling groups,
   or cycles yielding profits canon did not authorize.
5. **Rule/presentation boundary** violated under `<RULES_PATHS>`.
6. **Hidden randomness** where canon promises deterministic outcomes.
7. **Scope drift:** unrequested or canon-deferred work. Extra surface is a defect:
   unspecified, unverified, and now maintained.
8. **Verification gates:** every `<CHECK_COMMAND>` criterion has executed evidence
   or a declared gap. Broken checks or removed/weakened tests without TASK rationale
   are silent regressions. Changing them is allowed; changing them silently is not.
9. **Readability/language:** UI text outside `<REPORT_LANGUAGE>` or color-only
   information is a contract finding, not a matter of taste.

## Output

```text
S1 (STRUCTURE) | C1 (CONTRACT) · BLOCKER | MUST-FIX | LATER
Location: <file:line or symbol> · Problem: <one sentence>
Canon says: <file § section and status label>   (mandatory for C)
Why it matters: <concrete consequence, what breaks, who pays>
Evidence: <≤2-line excerpt or symbol> 📏 | 📄 | 🔮
Smallest correction: <minimal restoration of the boundary, never a redesign>
Owner: <OWNERS> | needs-human
```

Close with both verdicts:

```text
Structure: SOUND | SOUND WITH CORRECTIONS | UNSOUND
Contract:  FAITHFUL | RETURN TO DEV | NEEDS HUMAN DECISION
```

Use `NEEDS HUMAN DECISION` for ambiguous canon or contradictory documents. **Do not
resolve the contradiction**: name it, stop, and point to `propose-change`.
For a god-file **split plan**, use ≤8 lines: what moves where, in what order, and
what each step proves. Unchanged check counts are the standard; a step without
independent proof is not a step.

## Discipline

Checklist, not quota. **Two real problems mean two findings.** Never invent findings
to seem thorough or combine unrelated problems. All sound? One line per class,
then stop. One reviewer per artifact; do not duplicate QA/adversarial work.
Out-of-task debt is `LATER` with an owner, keeping the diff reviewable.
**Report early:** draft verdicts on the first pass; at two-thirds of turns, stop
investigating and write. Unread areas are ❓ findings; timely partial answers beat none.

## Project block

<!-- Filled per project by the scrum-master, NEVER overwritten by a kit copy.
Include actual placeholder values; file/line/responsibility map (confirm before
citing, because reported numbers age); added/removed engine checks and reasons. -->
