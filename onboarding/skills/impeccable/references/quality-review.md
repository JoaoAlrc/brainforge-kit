# Visual Quality and Bounded Review

Modified Brainforge adaptation of Impeccable 4.3.1 guidance from `craft-floor.md`,
`audit.md`, `critique.md`, `polish.md` and the finish-reviewer role. Native detector
commands, fixed aesthetic bans and native-agent dispatch have been replaced with
host-aware checks and scoped evidence. Copyright 2025 Paul Bakaus.
See [../NOTICE.md](../NOTICE.md) and [../LICENSE](../LICENSE).

## Choose the review scope

Critique judges whether the design supports the audience and intended action.
Audit examines concrete implementation and accessibility issues. Polish fixes
agreed defects while preserving the established direction. For a focused request
such as spacing, copy, responsiveness or animation, inspect the affected journey
and its related states; do not redesign the entire product.

Read the request, direction, affected files and evidence. Confirm which route,
version, viewport and state a screenshot represents. A stale or wrong capture
cannot establish fidelity. If the application cannot run, inspect source and
available captures, and clearly separate those findings from unperformed runtime
checks. Do not fabricate measurements, screenshots or detector output.

## Inspect together

Use the same bounded browser pass to inspect these relevant dimensions:

- **Hierarchy and action:** the main purpose and next action are easy to locate;
  section order follows the visitor's task; real content carries the page.
- **Composition:** image and text scale match the chosen direction; spacing
  groups related content and separates distinct sections; repeated structures
  do not flatten the entire page into interchangeable cards.
- **Typography:** readable measures and line heights, a coherent type hierarchy,
  no clipped real copy, excessive tracking or accidental fallback fonts.
- **Color and imagery:** sufficient text and control contrast, intentional
  foreground/background roles, loaded assets, appropriate crops and no layout
  shifts. Measure contrast with an available tool before claiming a ratio.
- **Interaction:** keyboard focus and navigation, labels and errors, primary
  controls, empty/loading/disabled states and recovery paths relevant to scope.
- **Responsiveness:** composition and controls work in narrow and wide views;
  content remains readable without unintended horizontal scrolling.
- **Motion and performance:** effects explain or reinforce the experience,
  reduced-motion preferences are respected, loading and interaction remain
  usable. Do not claim benchmark or accessibility certification from a screenshot.
- **Implementation integrity:** key behavior is real, demo values are identified,
  unavailable integrations are stated, and internal briefs are not exposed in
  shipped markup or assets.

Prefer computed values and observed behavior to intention. A successful build
does not prove visual quality, and an attractive screenshot does not prove forms,
filters, persistence or navigation work. Use only the tests the available tools
and current authorization can actually support.

## Keep correction finite

Batch the first inspection across the required viewports and states. Fix the
material findings in one batch, then capture and check the affected views once
more. Do not start an additional general hunt after that confirmation. If a
material problem remains, report it with evidence and follow the host's existing
repair budget or the user's explicit continuation. A new tool failure is not a
passed check and does not justify bypassing a review gate.

When an independent reviewer is available, hand it the goal, direction, affected
files, captures, observed interactions and missing checks. Do not install or
pretend to spawn an upstream reviewer. With no independent reviewer, label the
result as self-review or source inspection, as appropriate.

## Return findings the next specialist can act on

For each material finding, state the affected element/state, observed evidence,
impact on the user's task, and smallest appropriate correction. Distinguish an
unavailable check from an observed failure. Prioritize blocked actions, unreadable
content and broken controls before subjective polish.

Summarize whether evidence needs recapture, substantial fidelity needs rebuilding,
specific fixes remain, or the inspected scope is ready. This is an advisory
description: the host's delivery schema and review gates remain authoritative.
Never describe a narrow fix confirmation as approval of the entire application.

Keep what already works explicit so correction does not dilute the chosen
direction. Report files changed, checks actually executed, evidence locations,
remaining findings and unsupported checks without inventing an overall score.
