---
name: verify-falsification
description: Four engine-agnostic verification rules, independently re-derived by six different projects in the fleet — sabotage-and-see-RED, independent expected values, positive control before any zero-count claim, never adapt production code to the harness. Load before writing or trusting any test suite, QA pass, or "N checks, 0 failures" report.
---

# Verify-falsification

Six projects in this fleet, working on six different engines and stacks,
independently re-derived the same four rules after being burned by a green
suite that proved nothing. That convergence is the argument for this skill:
these are not one project's house style, they are what "verified" actually
requires, regardless of engine.

## 1 — Sabotage and see RED, before it counts as coverage

A key assertion that has never been seen to fail proves nothing about what
it measures. Break it on purpose once — zero the gravity, disable the
collision layer, force the wrong branch — confirm the test goes red, then
revert.

**Hard invariant: the revert is the very next action**, in the same turn,
before anything else — including before writing up the result. An agent
that sabotages an assertion and then runs out of turns before reverting
leaves a broken repository. If you cannot revert in the same tool call
sequence, do not sabotage.

## 2 — Expected values come from an independent source

A golden case's expected value must come from a closed-form calculation, a
hand-worked derivation, or a second, independently-written implementation —
**never** from running the implementation under test and copying its
output. A test that gets its answer from the code it tests cannot catch
that code being wrong; it can only catch it changing.

## 3 — A positive control before any "0 failures" claim

Every claim of the shape "N checks, 0 failures" needs a positive control
run first: prove the harness can fail before trusting that it did not. A
harness that silently loaded zero tests exits 0/0 and looks identical to a
harness that ran everything and found nothing wrong. Report executed and
failed counts together, never failed alone — "0 failed" with no "N
executed" alongside it is not evidence.

## 4 — Never adapt production code to make the harness pass

If a check fails, the finding is the code (or the check) is wrong — not
that the check is inconvenient. Silently loosening a production invariant
to quiet a red test converts a real defect into a hidden one. Report the
conflict; do not resolve it by weakening the thing under test.

## Applying this

Preload this skill on any agent whose job includes writing tests, running a
QA pass, or reporting a check-suite result. It does not replace a
project's own task-protocol or handoff-contract — it is the discipline
those close-gates should be measuring against.
