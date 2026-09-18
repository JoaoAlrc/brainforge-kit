---
name: verify-gameplay
description: "Use to prove a <PROJECT> change behaves as claimed: choose risk-proportionate evidence, run <ENGINE> headless/graphical suites, sabotage assertions before trusting green, inspect captures, and report defects with executed counts. Use after changes to rules, combat, AI, economy, presentation, or saves; never to fix them."
---

# Verify gameplay

Green is not evidence. Green that you **saw turn red** is.

Game defects are silent: credit doubled once in twenty runs, an actor stuck only
when orders arrive on its spawn frame, a save restoring spent resources, a
collision missed once in fifty runs. None announces itself.

You test, not repair; defects return to their owners (`<OWNERS>`).

The doctrine—sabotage and see red, independent expectations, positive controls for
zero counts, never adapt production to the instrument—is in `verify-falsification`.
This is its application to <ENGINE>.

## Risk-proportionate proof

| Task class | Minimum execution |
| :-- | :-- |
| `routine` | Proof covering the touched file; capture for visible changes |
| `rules` | `<CHECK_COMMAND>` plus one new independently expected case per changed rule |
| `combat` / `ai` | Suite, changed case, failure case (out of range, no visibility, dead target) |
| `presentation` | `<GUI_CMD>`; inspect ≤5 captures; pass with effect **on and off** |
| `persistence` | Save → reload → save, without duplication/loss; previous-version save loads 📏 |
| `release` | Everything above against the packaged build, including captures |

Text/color adjustments need local inspection, not the entire suite. Rule changes
need a journey through outcome and restart; disclose missing script coverage.

## Sabotage table

Before an assertion counts as coverage, sabotage it once and observe red.
**Reverting is the next action, in the same turn**, before reporting results.

| Assertion | Sabotage | Must become |
| :-- | :-- | :-- |
| Fixed-step integration | Zero the dominant constant (gravity, friction) | RED |
| Swept collision | Replace sweep with endpoint-only test | RED |
| Interaction range | Double range in an out-of-range case | RED |
| Occlusion / line of sight | Make trace always return visible | RED |
| Resource credited once | Credit twice per tick | RED |
| One-time reward/loot | Remove already-paid flag | RED |
| Invalid action has no effect | Spend cost before validation | RED |
| Save avoids duplication | Reload twice and sum | RED |
| Repeatability | Inject randomness into an input value | RED |
| Visual effect does not change rules | Run with effect on/off | **Equal** counts = green |

Record mutation/red under `Falsification` in the handoff. Green never seen red
cannot close Definition of Done for rules, AI, or structural work.

## Running

- Suite: `<CHECK_COMMAND>`; isolated script: `<HEADLESS_CMD>`; unfocused graphical
  run for captures/frame time: `<GUI_CMD>`.
- **Never hardcode binary paths.** Use machine-specific environment variables.
  Paths pasted into tasks/dispatch prompts outlive their session and silently
  break on another machine.
- **Never pipe output into `grep` and interpret its exit code**: that is grep's
  code. Capture output first, then inspect it.
- **Exit 0 is not approval.** Read `<RESULT_FILE>`: newer than run start (stale
  files mean no evidence), no failure lines, **with executed count**. Scripts
  loading nothing can exit 0 with zero checks and resemble a clean pass. Scan the
  full log for script/parser errors and live objects at shutdown.
- First runs import assets or compile shaders; they are not results. Stale caches
  mislead like defects; force reimport after adding symbols.
- **One execution at a time**: build/editor compete for cache and mutex. No polling
  or sleep-and-retry. Launch in background with timeout and read the log. On timeout,
  kill **only your own process**, record, and report.
- Accelerated fixed-step headless simulation does **not** measure graphics
  performance or human duration. Median, p95, and draw calls require graphical runs.
- Save output to `<QA_DOCS>/measurements-YYYY-MM-DD-<slug>.txt` before citing any
  number; the next build overwrites it.

## Result format

```text
PASS | <case> | <observed state>
FAIL | <case> | expected=<x> observed=<y>
CHECKS=N FAILURES=K
```

One readable line per case, independent of spawn order; one check per acceptance
criterion. "0 failures" without "N executed" beside it is not evidence.

## Golden cases

```text
<fixture>
  inputs, parameters, step count
  expected after N steps  ← independent source (<CANON_PATHS>, hand calculation,
                            or a second naive implementation); name it
  tolerance              ← required for floats; declare it
  provenance: how expectations were derived, and when
```

They detect **accidental** change. When a `TUNABLE` changes deliberately,
regenerate expectations **in the same task**, with the decision recorded; never
"to make the test pass", turning the only safeguard into a rubber stamp.

## Captures — from the game itself, from the same build

The game saves its own viewport image with an unfocused window outside the
visible desktop. Never automate the shared desktop or compete for focus. Name
the build (source hash/date) in `<EVIDENCE_DIR>`; an image without a build is not
evidence. Compare **identical angles, positions, and phases**, using `before-`/`after-`.

Open every delivered image with `Read` (≤5 per round: an outcome, a blocked state)
and describe it: "capture OK" is not a description. Captures prove framing, HUD
overlap, readability, and presence, not control response, journeys, or fun.
Record resolution and command.

## What automation cannot prove

It proves consistency, transitions, collisions, and counts. It does not prove fun,
human duration, camera/aim comfort, audio mixing, perceived clarity, or beauty.
Accelerated automation skipping waits does not validate duration either.
**Never claim something is good**: state whether a structural obstacle exists
and mark `needs human testing`, mandatory for changes to input geometry, haptics,
camera, UI scale, or target size.

## Defect report

```text
D1
Criterion: <violated acceptance criterion, or "unlisted">
Severity: BLOCKER | MAJOR | MINOR
Observed: <what happened> 📏 <command>
Expected: <criterion or <CANON_PATHS> requirement>
Repro: <numbered minimal script parameters, not narrative>
Owner: <OWNERS>
Evidence: <trimmed FAIL line, error, or check name>
```

If all passes, report one executed-count line and stop. Do not invent cases to
justify a longer report.

## Prohibitions

Never fix production, loosen/delete a check, enlarge colliders, expose private
fields, or simplify scenes to make instrumentation reach a case (change the
instrument, not the game). Never blindly regenerate goldens after failure.
Never delete files, even draft scripts; rename and retain as evidence. Never
install a testing framework, addon, or plugin; propose real gaps to the human
with version and compatibility checks.

Label every claim: 📏 measured (command + number), 📄 reported, 🔮 inferred,
❓ unknown. **Unlabeled = 🔮.** End with `handoff-contract`.

## Project block — <PROJECT>

<!-- Project-owned. Kit updates replace everything above, never this block. -->

- `<PROJECT>`: —; `<ENGINE>` and exact version: —.
- `<CHECK_COMMAND>`: — (suite); `<HEADLESS_CMD>`: — (isolated script).
- `<GUI_CMD>`: — (off-desktop, unfocused, muted, file log).
- `<RESULT_FILE>`: —; `<QA_DOCS>`: —; `<EVIDENCE_DIR>`: —.
- `<CANON_PATHS>`: — (source of independent expectations).
- `<OWNERS>`: — (agents receiving defects).
- Renamed/added risk classes and their requirements: —.
- What this project's suite does **not** cover, and who decides: —.
