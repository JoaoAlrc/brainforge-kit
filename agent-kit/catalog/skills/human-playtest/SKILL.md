---
name: human-playtest
description: "Request, prepare, conduct, and record a <PROJECT> human playtest without wasting the participant's session: mandatory gates before DONE, observation by loop stage, main question, five standard questions, a ≤80-line docs/qa/ record, and what playtests do NOT prove. Use before asking someone to play, closing tasks marked needs human test, or turning feedback into tasks."
---

# Human playtest

Automation proves consistency, not clarity, touch, perceived fairness, or desire
to return. Only the human layer measures those, and it is the project's most
expensive resource. Every test answers **one question**, never "see how it is".

## When to request one — and when it is mandatory

Request a test when a milestone clears its automatic gates, or a decision depends
on perception (clarity, fairness, atmosphere, pacing) that a capture cannot establish.

**Mandatory before `DONE`** for changes to control response, interaction targets,
haptic/audio feedback, HUD scale, pacing (time/stages), economy (price/gain),
instruction text, or criteria saying "clear", "readable", or "satisfying".
Without a human, close as `PARTIAL — needs human testing`, never DONE.

**Never request testing of a build that failed `<CHECK_COMMAND>` / `<HEADLESS_CMD>`.**

## Prepare

1. **Identified build:** one-click launcher, a controls table and nothing else
   (a teaching README is a finding, not a prerequisite), hash/date/platform.
2. **One main question per session**, two maximum, e.g. "does the person understand
   the primary action within ten seconds?" Everything else is observation.
3. **Write the script beforehand**; the participant does not see it and receives
   no explanation beforehand.
4. **Separate test save**, fresh by default, never the owner's progress.
5. Stopwatch: start → first correct action → end of the tested segment.

## Observation script — record during play

| Moment | Observe | Bad signal |
| :-- | :-- | :-- |
| Opening | Starts unaided? Time to first correct action | Searches menus; repeated incorrect attempts |
| Orientation | Knows where to go without reading? Names world/screen landmarks? | Wanders; opens help (at what stage, reads or closes it?) |
| Primary action | Performs unaided? Repeats deliberately? | Tries another control; waits for confirmation |
| Consequence | Connects cause to system behavior? | "Out of nowhere"; surprise at punishment |
| Recovery | Finds a way out unaided? | Repeated failure loop |
| Reward | Notices its effect? Compares before/after? | Notices no change |
| Segment end | Plays again unprompted? Says what to change? | Closes without comment |

Record short literal quotes and times. **Do not explain or help during play**.
Record where you wanted to help: that is where the game fails to teach.

## Afterward — five fixed questions, plus the main question

1. In one sentence, what were you trying to do?
2. Why did the system react when it did? (perceived causality/fairness)
3. Which place or moment do you remember? (landmarks/atmosphere)
4. What changed because of you, and where is it useful? (visible progress/purpose)
5. Would you play again now? What would you change first?

Fixed questions make builds comparable. Then ask openly what felt broken,
confusing, empty, unfair, or good. Record it; "good" is not validation.

## Record — `docs/qa/playtest-<YYYY-MM-DD>-<slug>.md`, ≤80 lines

```markdown
# Human playtest — <date> — build <hash> — <platform>
Participants: N (non-dev count) · Duration: <mm:ss> · Save: new | continued
Main question: <...> → answer: <...>

## Previous-test regressions — <previous cause>: resolved | persists, where 📄
## Observations by moment — completed observation table, with times where available
## Five questions — short literal answers, no names
## Findings → destination — A1 <observed 📏> · impact · smallest change → <TASK-NNN | proposal | discarded: reason>
## What this test does NOT prove · Next question to test
```

No names, recording without consent, or personal data in the repository. Afterward,
add one delta line to the short state record; use `propose-change` if feedback changes scope.

## Rules

- **Approval applies only to the tested build**, not other versions/platforms/engines.
- Never write "liked it" or "it is good": describe what the participant did/said.
- A finding becomes a task after two occurrences or one reproduction; alone it
  remains an observation.
- Design timing targets are hypotheses: measure them; do not tune the game to hit them.
- Simulated substitutes do not test acceptance of real ads, purchases, or permissions.
- Never present mockups, captures, or concept art as the game or ask participants
  to "imagine" polish. Provisional work is provisional; state it.
- Do not schedule the next test before addressing the previous test's findings.

## Project block

- <ENGINE>; automatic gates: `<CHECK_COMMAND>`, `<HEADLESS_CMD>`.
- Canon receiving feedback: `<CANON_PATHS>`.
- Requester: lead; player: always the human; record: `docs/qa/`.
