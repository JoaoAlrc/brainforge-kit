# Brainforge business — operating instructions

This file is read at the start of a conversation. Keep it under 100 lines;
include only instructions worth loading every time.

## Business context

At the start of each conversation, read these files when they contain facts:
1. `memory/company.md`: the business, its work and customers.
2. `memory/preferences.md`: voice and things to avoid.
3. `memory/strategy.md`: current priorities.

Use the context without asking the user to repeat it. For visual work, consult
`identity/design-guide.md`.

## Memory hygiene

- Keep company and preferences files at most 60 lines each. They describe the
  present; they are not historical logs.
- Keep strategy at most 40 lines and date it. Move completed or outdated
  priorities to `memory/archive/YYYY-MM.md` before adding new ones.
- After a skill rewrites one of these files, measure its line count before
  and after. If it exceeds the budget, explain the overrun and ask whether
  completed material should be archived.

## Setup interview

`/setup` may ask several questions, one at a time. Other skills ask only for
facts that memory and the visual guide do not already supply.

## Visual identity

Use `identity/design-guide.md` as the source for colors, fonts and visual style.
If it is empty, say so once and proceed with a neutral default.

## Produce the deliverable

A skill produces its output under `content/`, `ads/` or `operations/`, using
the existing folder for that category. Do not reconfirm work already authorized
by the user's request and the skill.

## Evidence

Report metrics only from actual files or data. If the evidence does not exist,
state that rather than presenting an estimate as fact.
