---
name: perf-budget
description: Defines what "light" means for <PROJECT> as numbers, and how to measure them the same way every time. Use before claiming a change made something lighter or heavier, when setting a target for a new route or screen, and before adding a dependency to a user-facing surface.
---

# Perf budget

"Light" is not a feeling — it's a small set of numbers, measured the same way
every time so that before/after comparisons mean something.

## What to measure

1. **Shipped JS per user-facing surface** (`<SURFACES>` — a public route on
   web, the startup bundle plus each lazy chunk on mobile), from a
   **production build** (`<CHECK_COMMAND>`), never the dev server. Dev weight
   is not representative of anything a user experiences.
2. **Runtime metrics** (`<RUNTIME_METRICS>` — e.g. LCP/CLS/INP, or cold start
   to first interaction) against the production build or preview, and only if
   a measurement tool is actually installed. Check what's there before
   assuming; don't install a new tool without the human's approval.
3. **Dependency leakage** — does a light surface pull in something only the
   heavy authenticated area needs? `<HEAVY_DEPS>` are legitimate where they
   belong; none of them belong in the bundle of a marketing route or a launch
   screen.

## Baseline and delta

Until a baseline is recorded, the first measurement *is* the baseline — write
it down with the command that produced it and the date. After that, every
change reports a **delta against it**, not a fresh snapshot with nothing to
compare. Directionally: a surface with no forms, tables, charts or live data
to hydrate should ship meaningfully less JS than one that has them.

## Procedure

1. Run `<CHECK_COMMAND>` and read the per-surface / per-chunk output.
2. Grep the surface's real imports — directly and transitively through
   `<SHARED_DIRS>` — for anything on the heavy-dependency list.
3. If runtime tooling exists, run it against the built output, not dev.
4. Report every number as 📏 measured, with the exact command that produced
   it. No command, no number — a claim without a command is 🔮, not a finding.

## Anti-patterns

- Reporting "feels faster" instead of a number.
- Measuring the dev server and presenting it as representative.
- A change that swaps a CSS or native effect for a JS animation library
  without anyone naming the added weight.
- A dependency added to a light surface with no before/after number.

## Project block

Project-owned. The only part of this file a project fills in, and the only
part a kit update must never overwrite.

- Build command: `<CHECK_COMMAND>`
- Surfaces measured, and the budget for each: `<SURFACES>`
- Runtime metrics and the tool that produces them: `<RUNTIME_METRICS>`
- Heavy dependencies that must not leak: `<HEAVY_DEPS>`
- Shared dirs imports are traced through: `<SHARED_DIRS>`
- Current baseline (number · command · date), or "none yet".
