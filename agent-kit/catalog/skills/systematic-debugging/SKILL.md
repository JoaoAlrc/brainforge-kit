---
name: systematic-debugging
description: Use when encountering any bug, test failure, or unexpected behavior, before proposing a fix. Four gated phases — root cause, pattern, hypothesis, implementation — and the rationalizations that mean you're about to guess instead of investigate.
---

# Systematic Debugging

> Third-party license notice: see .brainforge/licenses/THIRD_PARTY_NOTICES.md in generated projects or THIRD_PARTY_NOTICES.md at repository root.

A symptom fix is a failure, even when it makes the symptom go away —
the same bug returns wearing a different stack trace. Root cause first,
always, especially under time pressure: guessing under a deadline is
what turns one bug into three.

## The Iron Law

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

Each phase gates the next — you cannot propose a fix before Phase 1 is
done, cannot implement before Phase 3 has a confirmed hypothesis.

## Phase 1 — Root cause

1. **Read the error completely.** Full stack trace, exact line, exact
   message — it usually names the actual problem.
2. **Reproduce reliably.** Not reproducible yet? Gather more data,
   don't start guessing at a fix for something you can't trigger.
3. **Check what changed.** `git diff`, recent commits, new dependency,
   environment difference.
4. **In a multi-component system, instrument the boundary** before
   guessing which layer is at fault: log what enters and leaves each
   component, run once, read where the data actually breaks.

## Phase 2 — Pattern

Find a working example doing something similar. Read the reference
implementation completely, not skimmed. List every difference between
the working and the broken case, however small — "that can't matter"
is exactly the assumption that costs the next hour.

## Phase 3 — Hypothesis

State one hypothesis in one sentence: *"I think X is the root cause
because Y."* Change the smallest possible thing to test it — one
variable, not a bundle of fixes. Confirmed → Phase 4. Not confirmed →
new hypothesis, not a second fix stacked on the first.

## Phase 4 — Implementation

1. Write a failing test that reproduces the bug — see
   `test-driven-development` for how. This must exist before the fix.
2. Fix the root cause. One change. No refactor riding along.
3. Verify: test passes, nothing else broke. `verify-falsification`'s
   positive-control rule applies here too — before claiming the fix
   works, confirm you actually ran it this turn.
4. **Fix didn't work, and this is attempt 3+?** Stop. This is no longer
   a wrong hypothesis — it's a sign the architecture itself is the
   problem. Naming the same shared-state/coupling issue in a new place
   each attempt is the tell. Surface it as a decision, don't attempt a
   fourth patch.

## Red flags — stop and return to Phase 1

- "Quick fix now, investigate later"
- "Just try changing X and see"
- "I don't fully understand but this might work"
- Proposing a fix before tracing where the data actually goes wrong
- A second fix attempt without a new hypothesis to justify it

## Common rationalizations

| Excuse | Reality |
|---|---|
| "Issue is simple" | Simple bugs have root causes too; the process is fast when the bug is simple. |
| "No time for process" | Guess-and-check thrashing is slower than one correct pass. |
| "I see the problem, let me fix it" | Seeing a symptom is not the same as knowing the cause. |
| "One more attempt" (after 2+ failures) | 3+ failures is an architecture question, not a persistence question. |
