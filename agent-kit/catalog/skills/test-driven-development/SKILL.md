---
name: test-driven-development
description: Use when implementing any feature or bugfix, before writing implementation code. Defines the red-green-refactor cycle as a hard gate — no production code without a failing test written first — and the rationalizations that mean you're about to skip it.
---

# Test-Driven Development

> Third-party license notice: see .brainforge/licenses/THIRD_PARTY_NOTICES.md in generated projects or THIRD_PARTY_NOTICES.md at repository root.

This skill assumes `verify-falsification`.

Write the test first. Watch it fail. Write minimal code to pass. If you
didn't watch it fail, you don't know it tests the right thing — that's
the same principle `verify-falsification` calls sabotage-and-see-RED,
applied one step earlier: there, you break an *existing* assertion to
prove it isn't vacuous; here, you write the assertion first so it's
never been anything else.

## The Iron Law

```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```

Wrote code before the test? Delete it — don't keep it "as reference,"
don't adapt it while writing the test after the fact. Implement fresh
from the test. "I'll test after" produces a test that passes on first
run, which proves nothing: you never watched it fail, so you never
proved it can catch the bug it claims to guard.

## Red — Green — Refactor

1. **RED.** One minimal test for one behavior, clear name, real code —
   no mock unless truly unavoidable. Run it. It must fail, and fail for
   the right reason (feature missing, not a typo in the test itself).
   Passes immediately? You're testing existing behavior — fix the test.
2. **GREEN.** Simplest code that passes — no added options, no
   refactor of unrelated code, no "while I'm here." Run it: this test
   passes, every other test still passes, output is clean (no stray
   warnings).
3. **REFACTOR.** Only once green. Remove duplication, improve names.
   Never add behavior here — a refactor that changes what the code
   does was Green wearing a disguise.
4. Repeat for the next behavior.

## Common rationalizations (all mean: stop, start over)

| Excuse | Why it doesn't hold |
|---|---|
| "Too simple to test" | Simple code breaks too; the test costs 30 seconds. |
| "I'll test after" | Passes on first run — proves nothing, you never saw it fail. |
| "Already tested manually" | No record of what was covered, can't re-run on the next change. |
| "Keep it as reference" | You'll adapt it — that's testing after with extra steps. |
| "This is different because…" | It never is. Delete the code, start with the test. |

## Bug fixes go through the same gate

A bug is a missing test, not a missing `if`. Write a test that
reproduces the bug — the smallest repro that fails for the reported
reason — then follow Red/Green/Refactor. `systematic-debugging`
covers what happens *before* this, when the root cause isn't obvious
yet; this skill covers what happens once you know what to fix.

## Verification checklist

- [ ] Every new function/method has a test
- [ ] Watched each test fail before implementing, for the right reason
- [ ] Minimal code written to pass — no unrequested extras
- [ ] All tests pass, output is clean
- [ ] Edge cases and error paths covered, not just the happy path

Can't check every box? You skipped TDD — go back, don't rationalize
forward. Before claiming any of this is done, `verify-falsification`'s
positive-control rule still applies: a suite that has never failed
hasn't proven it can.
